'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  channelName: string;
  onUserJoined?: (uid: string | number) => void;
  onUserLeft?: (uid: string | number) => void;
  isMuted?: boolean;
  isVideoOff?: boolean;
  onMuteChange?: (muted: boolean) => void;
  onVideoChange?: (videoOff: boolean) => void;
}

interface RemoteUser {
  uid: string | number;
  videoTrack?: any;
  audioTrack?: any;
  hasVideo: boolean;
  hasAudio: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  channelName, 
  onUserJoined, 
  onUserLeft,
  isMuted = false,
  isVideoOff = false,
  onMuteChange,
  onVideoChange 
}) => {
  const [AgoraRTC, setAgoraRTC] = useState<any>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [localTracks, setLocalTracks] = useState<{
    videoTrack: any;
    audioTrack: any;
  }>({ videoTrack: null, audioTrack: null });
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [error, setError] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const client = useRef<any>(null);

  const initializeAgora = async () => {
    try {
      const AgoraRTCModule = await import('agora-rtc-sdk-ng');
      setAgoraRTC(AgoraRTCModule.default);
    } catch (error) {
      setError('Failed to load video call SDK');
      console.error('Error loading Agora SDK:', error);
    }
  };

  useEffect(() => {
    initializeAgora();
    return () => {
      if (client.current) {
        client.current.removeAllListeners();
      }
    };
  }, []);

  useEffect(() => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(!isMuted);
    }
  }, [isMuted, localTracks.audioTrack]);

  useEffect(() => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(!isVideoOff);
    }
  }, [isVideoOff, localTracks.videoTrack]);

  const setupLocalTracks = async () => {
    try {
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack({
          encoderConfig: {
            width: 640,
            height: 360,
            frameRate: 30,
            bitrateMin: 400,
            bitrateMax: 1000,
          },
        }),
      ]);

      // Set initial states
      audioTrack.setEnabled(!isMuted);
      videoTrack.setEnabled(!isVideoOff);

      setLocalTracks({ audioTrack, videoTrack });

      if (videoTrack && localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      return [audioTrack, videoTrack];
    } catch (err) {
      console.error('Error creating local tracks:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!AgoraRTC) return;

    const initializeClient = async () => {
      try {
        setConnectionStatus('Initializing...');
        client.current = AgoraRTC.createClient({ 
          mode: 'rtc', 
          codec: 'vp8',
          role: 'host'
        });

        // Set up event handlers
        client.current.on('user-published', handleUserPublished);
        client.current.on('user-unpublished', handleUserUnpublished);
        client.current.on('user-joined', (user: any) => {
          console.log('User joined:', user.uid);
          setConnectionStatus(`User ${user.uid} joined the call`);
          onUserJoined?.(user.uid);
          setRemoteUsers(prev => {
            if (prev.find(u => u.uid === user.uid)) return prev;
            return [...prev, { uid: user.uid, hasVideo: false, hasAudio: false }];
          });
        });
        client.current.on('user-left', handleUserLeft);
        client.current.on('connection-state-change', (curState: string, prevState: string) => {
          console.log('Connection state changed:', prevState, '->', curState);
          setConnectionStatus(`Connection: ${curState}`);
        });

        setConnectionStatus('Joining channel...');
        await client.current.join(
          '0ef97ff32db048cd8d5063a70234652d', // Your Agora App ID
          channelName,
          null,
          null
        );

        setConnectionStatus('Setting up local media...');
        const [audioTrack, videoTrack] = await setupLocalTracks();

        setConnectionStatus('Publishing streams...');
        await client.current.publish([audioTrack, videoTrack]);
        
        setJoined(true);
        setConnectionStatus('Connected');
        setRetryCount(0);
      } catch (err: any) {
        console.error('Error in initialization:', err);
        setError(err.message || 'Failed to join video call');
        setConnectionStatus('Connection failed');
        
        if (retryCount < 3 && (
          err.message.includes('NETWORK_ERROR') ||
          err.message.includes('MEDIA_DEVICE_NO_PERMISSION') ||
          err.message.includes('NOT_READABLE')
        )) {
          setRetryCount(prev => prev + 1);
          setTimeout(initializeClient, 2000);
        }
      }
    };

    initializeClient();

    return () => {
      setConnectionStatus('Disconnecting...');
      if (client.current) {
        if (localTracks.audioTrack || localTracks.videoTrack) {
          client.current.unpublish([localTracks.audioTrack, localTracks.videoTrack]).catch(console.error);
          localTracks.audioTrack?.close();
          localTracks.videoTrack?.close();
        }
        client.current.leave().catch(console.error);
        setRemoteUsers([]);
        setJoined(false);
      }
      setConnectionStatus('Disconnected');
    };
  }, [AgoraRTC, channelName]);

  const handleUserPublished = async (user: any, mediaType: 'video' | 'audio') => {
    try {
      console.log(`Subscribing to ${mediaType} from user:`, user.uid);
      await client.current?.subscribe(user, mediaType);
      console.log('Successfully subscribed to', mediaType, 'track from user:', user.uid);

      setRemoteUsers(prevUsers => {
        const existingUser = prevUsers.find(u => u.uid === user.uid);
        if (existingUser) {
          return prevUsers.map(u => {
            if (u.uid === user.uid) {
              const updatedUser = {
                ...u,
                [mediaType + 'Track']: user[mediaType + 'Track'],
                ['has' + mediaType.charAt(0).toUpperCase() + mediaType.slice(1)]: true
              };
              if (mediaType === 'video' && remoteVideoRefs.current[user.uid]) {
                setTimeout(() => {
                  updatedUser.videoTrack?.play(remoteVideoRefs.current[user.uid]);
                }, 100);
              } else if (mediaType === 'audio') {
                updatedUser.audioTrack?.play();
              }
              return updatedUser;
            }
            return u;
          });
        }

        const newUser = {
          uid: user.uid,
          [mediaType + 'Track']: user[mediaType + 'Track'],
          hasVideo: mediaType === 'video',
          hasAudio: mediaType === 'audio'
        };

        if (mediaType === 'video' && remoteVideoRefs.current[user.uid]) {
          setTimeout(() => {
            user.videoTrack?.play(remoteVideoRefs.current[user.uid]);
          }, 100);
        } else if (mediaType === 'audio') {
          user.audioTrack?.play();
        }

        return [...prevUsers, newUser];
      });
    } catch (error: any) {
      console.error('Error handling user published:', error);
      if (!error.message.includes('INVALID_REMOTE_USER')) {
        toast.error(`Failed to subscribe to remote user: ${error.message}`);
      }
    }
  };

  const handleUserUnpublished = async (user: any, mediaType: 'video' | 'audio') => {
    try {
      if (mediaType === 'video' && user.videoTrack) {
        user.videoTrack.stop();
      } else if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.stop();
      }

      setRemoteUsers(prevUsers => {
        return prevUsers.map(u => {
          if (u.uid === user.uid) {
            return {
              ...u,
              [mediaType + 'Track']: null,
              ['has' + mediaType.charAt(0).toUpperCase() + mediaType.slice(1)]: false
            };
          }
          return u;
        }).filter(u => u.hasVideo || u.hasAudio);
      });
    } catch (error) {
      console.error('Error handling user unpublished:', error);
    }
  };

  const handleUserLeft = (user: any) => {
    console.log('User left:', user.uid);
    setConnectionStatus(`User ${user.uid} left the call`);
    onUserLeft?.(user.uid);
    
    if (user.videoTrack) {
      user.videoTrack.stop();
    }
    if (user.audioTrack) {
      user.audioTrack.stop();
    }
    
    if (remoteVideoRefs.current[user.uid]) {
      remoteVideoRefs.current[user.uid] = null;
      delete remoteVideoRefs.current[user.uid];
    }

    setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
  };

  const setRemoteVideoRef = (uid: string) => (el: HTMLDivElement | null) => {
    if (remoteVideoRefs.current) {
      remoteVideoRefs.current[uid] = el;
      const user = remoteUsers.find(u => u.uid === uid);
      if (user?.videoTrack && el) {
        setTimeout(() => {
          user.videoTrack.play(el);
        }, 100);
      }
    }
  };

  const handleRetry = () => {
    setError('');
    setRetryCount(0);
    initializeAgora();
  };

  if (!AgoraRTC) {
    return <div className="text-center p-4">Loading video call SDK...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="video-grid-fullscreen">
      {/* Local Video */}
      <div className="local-video">
        <div ref={localVideoRef} className="absolute inset-0" />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          You
        </div>
      </div>

      {/* Remote Videos */}
      {remoteUsers.map((user, index) => (
        <div key={user.uid} className={cn(
          "remote-video",
          // Only show the first remote user in fullscreen
          index === 0 ? "block" : "hidden"
        )}>
          <div ref={setRemoteVideoRef(user.uid.toString())} className="absolute inset-0" />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            User {user.uid}
          </div>
        </div>
      ))}

      {remoteUsers.length === 0 && joined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Waiting for others to join...</p>
            <p className="text-sm mt-2">Share the channel name with them to join this call.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Prevent SSR for this component
export default dynamic(() => Promise.resolve(VideoCall), {
  ssr: false,
}); 
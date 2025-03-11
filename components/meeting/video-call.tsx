'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  channelName: string;
  userName: string;
  onUserJoined?: (uid: string | number) => void;
  onUserLeft?: (uid: string | number) => void;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isScreenSharing?: boolean;
  onMuteChange?: (muted: boolean) => void;
  onVideoChange?: (videoOff: boolean) => void;
  onScreenShareChange?: (isScreenSharing: boolean) => void;
  onMessageReceived?: (message: { text: string; sender: string; timestamp: Date }) => void;
  onSendMessage?: (message: string) => void;
}

interface RemoteUser {
  uid: string | number;
  name: string;
  videoTrack?: any;
  audioTrack?: any;
  hasVideo: boolean;
  hasAudio: boolean;
  isScreenShare?: boolean;
}

interface ChatMessage {
  msg: string;
  from: string;
  time: number;
  type: string;
  to: string;
  chatType: string;
}

interface ChatError {
  type: string;
  message: string;
  error?: Error;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  channelName,
  userName,
  onUserJoined, 
  onUserLeft,
  isMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  onMuteChange,
  onVideoChange,
  onScreenShareChange,
  onMessageReceived,
  onSendMessage
}) => {
  const [AgoraRTC, setAgoraRTC] = useState<any>(null);
  const [ChatSDK, setChatSDK] = useState<any>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [localTracks, setLocalTracks] = useState<{
    videoTrack: any;
    audioTrack: any;
    screenTrack?: any;
  }>({ videoTrack: null, audioTrack: null });
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [error, setError] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const client = useRef<any>(null);
  const chatConnection = useRef<any>(null);

  const initializeAgora = async () => {
    try {
      const [AgoraRTCModule, { default: ChatSDK }] = await Promise.all([
        import('agora-rtc-sdk-ng'),
        import('agora-chat')
      ]);
      setAgoraRTC(AgoraRTCModule.default);
      setChatSDK(ChatSDK);
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
      if (chatConnection.current) {
        chatConnection.current.close();
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

  useEffect(() => {
    if (isScreenSharing) {
      startScreenShare();
    } else {
      stopScreenShare();
    }
  }, [isScreenSharing]);

  const startScreenShare = async () => {
    try {
      if (!AgoraRTC || !client.current) return;

      // Store the current video track
      const currentVideoTrack = localTracks.videoTrack;

      // Unpublish the camera video track if it exists
      if (currentVideoTrack) {
        await client.current.unpublish(currentVideoTrack);
      }

      // Create screen share track
      const screenTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: {
          width: 1920,
          height: 1080,
          frameRate: 30,
          bitrateMin: 600,
          bitrateMax: 2000,
        },
      });

      // If we already have a screen track, stop it
      if (localTracks.screenTrack) {
        await client.current.unpublish(localTracks.screenTrack);
        localTracks.screenTrack.close();
      }

      // Publish screen track
      await client.current.publish(screenTrack);

      // Update local tracks
      setLocalTracks(prev => ({
        ...prev,
        screenTrack,
        videoTrack: currentVideoTrack, // Keep the video track in state but unpublished
      }));

      // Handle screen share stopped by user through browser UI
      screenTrack.on('track-ended', () => {
        onScreenShareChange?.(false);
      });

    } catch (error: any) {
      console.error('Error starting screen share:', error);
      toast.error('Failed to start screen sharing: ' + error.message);
      onScreenShareChange?.(false);
    }
  };

  const stopScreenShare = async () => {
    try {
      if (!client.current) return;

      // Unpublish screen track if it exists
      if (localTracks.screenTrack) {
        await client.current.unpublish(localTracks.screenTrack);
        localTracks.screenTrack.close();
      }

      // Republish the camera video track if it exists
      if (localTracks.videoTrack) {
        await client.current.publish(localTracks.videoTrack);
      }

      // Update local tracks
      setLocalTracks(prev => ({
        ...prev,
        screenTrack: null,
      }));

    } catch (error) {
      console.error('Error stopping screen share:', error);
      toast.error('Failed to stop screen sharing');
    }
  };

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
            return [...prev, { uid: user.uid, name: userName, hasVideo: false, hasAudio: false }];
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
        if (localTracks.audioTrack || localTracks.videoTrack || localTracks.screenTrack) {
          client.current.unpublish([
            localTracks.audioTrack,
            localTracks.videoTrack,
            localTracks.screenTrack
          ].filter(Boolean)).catch(console.error);
          localTracks.audioTrack?.close();
          localTracks.videoTrack?.close();
          localTracks.screenTrack?.close();
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
          name: user.name || `User ${user.uid}`,
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

  const generateSecurePassword = (length: number = 32) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const initializeChat = async () => {
    if (!ChatSDK) return;

    try {
      // Initialize the Chat SDK
      const connection = ChatSDK.create({
        appKey: '0ef97ff32db048cd8d5063a70234652d'  // Your Agora App Key
      });
      chatConnection.current = connection;

      // Add event handlers
      connection.addEventHandler('chat', {
        onConnected: () => {
          console.log('Chat connected successfully');
          joinChatChannel();
        },
        onDisconnected: () => {
          console.log('Chat disconnected');
        },
        onTextMessage: (message: ChatMessage) => {
          try {
            onMessageReceived?.({
              text: message.msg,
              sender: message.from,
              timestamp: new Date(message.time)
            });
          } catch (error) {
            console.error('Error handling message:', error);
          }
        },
        onError: (error: ChatError) => {
          console.error('Chat error:', error);
          toast.error('Chat error occurred');
        }
      });

      // Generate a secure password based on the channel name and user name
      const securePassword = generateSecurePassword();

      // Open the connection
      await connection.open({
        user: userName,
        pwd: securePassword
      });

    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to initialize chat');
    }
  };

  const joinChatChannel = async () => {
    try {
      await chatConnection.current.joinChatRoom(channelName);
    } catch (error) {
      console.error('Error joining chat room:', error);
      toast.error('Failed to join chat room');
    }
  };

  const sendMessage = async (text: string) => {
    if (!chatConnection.current) return;

    try {
      const msg = {
        type: 'txt',
        to: channelName,
        msg: text,
        chatType: 'chatRoom'
      };

      await chatConnection.current.send(msg);
      
      // Also notify local UI
      onMessageReceived?.({
        text,
        sender: userName,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    if (onSendMessage) {
      onSendMessage = sendMessage;
    }
  }, [onSendMessage]);

  useEffect(() => {
    if (ChatSDK && userName && channelName) {
      initializeChat();
    }
  }, [ChatSDK, userName, channelName]);

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
    <div className="relative h-full">
      {/* Main Grid for Remote Videos */}
      <div className={cn(
        "grid gap-4 p-4 h-full",
        remoteUsers.length === 0 && "grid-cols-1",
        remoteUsers.length === 1 && "grid-cols-1",
        remoteUsers.length === 2 && "grid-cols-2",
        remoteUsers.length >= 3 && "grid-cols-3",
        "auto-rows-fr"
      )}>
        {/* Remote Videos */}
        {remoteUsers.map((user) => {
          console.log("user is here ", user); // Log user information
          return (
            <div key={user.uid} className="relative rounded-lg overflow-hidden bg-black">
              <div ref={setRemoteVideoRef(user.uid.toString())} className="absolute inset-0" />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                hello {user.name}
              </div>
            </div>
          );
        })}

        {remoteUsers.length === 0 && joined && (
          <div className="flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Waiting for others to join...</p>
              <p className="text-sm mt-2">Share the channel name with them to join this call.</p>
            </div>
          </div>
        )}
      </div>

      {/* Local Video - Fixed in top left corner with subtle border */}
      <div className="local-video-container fixed top-4 left-4 w-48 aspect-video z-50">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 p-[1px]">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
            <div ref={localVideoRef} className="absolute inset-0" />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {userName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prevent SSR for this component
export default dynamic(() => Promise.resolve(VideoCall), {
  ssr: false,
}); 
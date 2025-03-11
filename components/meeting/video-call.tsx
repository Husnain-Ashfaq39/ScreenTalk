'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
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
  hasVideo: boolean;
  hasAudio: boolean;
  isScreenShare?: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  userName,
  isMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  onMuteChange,
  onVideoChange,
  onScreenShareChange,
}) => {
  // Mock data for UI demonstration
  const [remoteUsers] = useState<RemoteUser[]>([
    { uid: '1', name: 'Demo User 1', hasVideo: true, hasAudio: true },
    { uid: '2', name: 'Demo User 2', hasVideo: true, hasAudio: false },
  ]);
  const [joined] = useState<boolean>(true);
  
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dummy function for remote video refs
  const setRemoteVideoRef = (uid: string) => (el: HTMLDivElement | null) => {
    if (remoteVideoRefs.current) {
      remoteVideoRefs.current[uid] = el;
    }
  };

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
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative rounded-lg overflow-hidden bg-black">
            <div ref={setRemoteVideoRef(user.uid.toString())} className="absolute inset-0">
              {/* Placeholder for video */}
              <div className="w-full h-full flex items-center justify-center text-white">
                {user.hasVideo ? 
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-lg">Video Feed</span>
                  </div> : 
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold">{user.name.charAt(0)}</span>
                  </div>
                }
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {user.name} {!user.hasAudio && '(Muted)'}
            </div>
          </div>
        ))}

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
            <div ref={localVideoRef} className="absolute inset-0">
              {/* Placeholder for local video */}
              <div className="w-full h-full flex items-center justify-center">
                {!isVideoOff ? 
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-sm">Your Video</span>
                  </div> : 
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{userName.charAt(0)}</span>
                  </div>
                }
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {userName} {isMuted && '(Muted)'}
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
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const VideoCall = dynamic(() => import('./video-call'), {
  ssr: false,
});

interface VideoGridProps {
  userName: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isScreenSharing?: boolean;
  onMuteChange?: (muted: boolean) => void;
  onVideoChange?: (videoOff: boolean) => void;
  onScreenShareChange?: (isScreenSharing: boolean) => void;
}

export function VideoGrid({ 
  userName,
  isMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  onMuteChange,
  onVideoChange,
  onScreenShareChange,
}: VideoGridProps) {
  const searchParams = useSearchParams();
  const [channelName] = useState<string>('demo-channel');
  
  // Get display name from user info or use a default
  const displayName = userName || 'User';

  // Dummy handlers that would normally interact with Agora
  const handleUserJoined = (uid: string | number) => {
    console.log('UI Only - User joined:', uid);
  };

  const handleUserLeft = (uid: string | number) => {
    console.log('UI Only - User left:', uid);
  };

  return (
    <VideoCall
      channelName={channelName}
      userName={displayName}
      onUserJoined={handleUserJoined}
      onUserLeft={handleUserLeft}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      isScreenSharing={isScreenSharing}
      onMuteChange={onMuteChange}
      onVideoChange={onVideoChange}
      onScreenShareChange={onScreenShareChange}
    />
  );
} 
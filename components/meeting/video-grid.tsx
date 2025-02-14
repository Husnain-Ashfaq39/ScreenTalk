'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const VideoCall = dynamic(() => import('./video-call'), {
  ssr: false,
});

interface VideoGridProps {
  isMuted?: boolean;
  isVideoOff?: boolean;
  onMuteChange?: (muted: boolean) => void;
  onVideoChange?: (videoOff: boolean) => void;
}

export function VideoGrid({ 
  isMuted = false,
  isVideoOff = false,
  onMuteChange,
  onVideoChange 
}: VideoGridProps) {
  const searchParams = useSearchParams();
  const [channelName, setChannelName] = useState<string>('');

  useEffect(() => {
    const channel = searchParams.get('channel') || 'default-channel';
    setChannelName(channel);
  }, [searchParams]);

  const handleUserJoined = (uid: string | number) => {
    console.log('User joined:', uid);
  };

  const handleUserLeft = (uid: string | number) => {
    console.log('User left:', uid);
  };

  return (
    <VideoCall
      channelName={channelName}
      onUserJoined={handleUserJoined}
      onUserLeft={handleUserLeft}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      onMuteChange={onMuteChange}
      onVideoChange={onVideoChange}
    />
  );
} 
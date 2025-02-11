'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatPanel } from '@/components/meeting/chat-panel';
import { ParticipantList } from '@/components/meeting/participant-list';
import { VideoGrid } from '@/components/meeting/video-grid';

export default function MeetingRoom() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleParticipants = () => setIsParticipantsOpen(!isParticipantsOpen);
  
  const handleLeave = () => {
    // Implement leave meeting logic
    window.location.href = '/';
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 bg-background">
          <VideoGrid />
        </div>

        {/* Controls */}
        <div className="h-20 bg-muted/50 border-t flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(isMuted && 'bg-red-500 hover:bg-red-500/90 text-white')}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(isVideoOff && 'bg-red-500 hover:bg-red-500/90 text-white')}
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(isScreenSharing && 'bg-green-500 hover:bg-green-500/90 text-white')}
            onClick={toggleScreenShare}
          >
            <Monitor />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(isChatOpen && 'bg-primary/10')}
            onClick={toggleChat}
          >
            <MessageCircle />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(isParticipantsOpen && 'bg-primary/10')}
            onClick={toggleParticipants}
          >
            <Users />
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={handleLeave}
          >
            <PhoneOff />
          </Button>
        </div>
      </div>

      {/* Side Panels */}
      {isChatOpen && (
        <div className="w-80 border-l bg-background">
          <ChatPanel meetingId={'1'} />
        </div>
      )}
      
      {isParticipantsOpen && (
        <div className="w-80 border-l bg-background">
          <ParticipantList meetingId={'1'} />
        </div>
      )}
    </div>
  );
}
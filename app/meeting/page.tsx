'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatPanel } from '@/components/meeting/chat-panel';
import { ParticipantList } from '@/components/meeting/participant-list';
import { VideoGrid } from '@/components/meeting/video-grid';

type SidePanel = 'chat' | 'participants' | null;

export default function MeetingRoom() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activePanel, setActivePanel] = useState<SidePanel>(null);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  
  const togglePanel = (panel: SidePanel) => {
    setActivePanel(current => current === panel ? null : panel);
  };
  
  const handleLeave = () => {
    // Implement leave meeting logic
    window.location.href = '/';
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        activePanel && "lg:mr-[25vw]"
      )}>
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
            className={cn(activePanel === 'chat' && 'bg-primary/10')}
            onClick={() => togglePanel('chat')}
          >
            <MessageCircle />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(activePanel === 'participants' && 'bg-primary/10')}
            onClick={() => togglePanel('participants')}
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

      {/* Side Panel */}
      <div className={cn(
        "fixed right-0 top-16 bottom-0 bg-background border-l",
        "w-full lg:w-[25vw] transition-transform duration-300",
        activePanel ? "translate-x-0" : "translate-x-full",
        "z-20"
      )}>
        {activePanel === 'chat' && <ChatPanel meetingId={'1'} />}
        {activePanel === 'participants' && <ParticipantList meetingId={'1'} />}
      </div>
    </div>
  );
}
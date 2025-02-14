'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatPanel } from '@/components/meeting/chat-panel';
import { ParticipantList } from '@/components/meeting/participant-list';
import { VideoGrid } from '@/components/meeting/video-grid';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type SidePanel = 'chat' | 'participants' | null;

export default function MeetingRoom() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activePanel, setActivePanel] = useState<SidePanel>(null);
  const [showControls, setShowControls] = useState(true);
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
      
      setMouseTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
    };
  }, [mouseTimeout]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.success(isVideoOff ? 'Camera turned on' : 'Camera turned off');
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.success(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };
  
  const togglePanel = (panel: SidePanel) => {
    setActivePanel(current => current === panel ? null : panel);
  };
  
  const handleLeave = () => {
    router.push('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-background">
      {/* Main Content */}
      <div className={cn(
        "h-full flex flex-col transition-all duration-300",
        activePanel && "lg:mr-[25vw]"
      )}>
        {/* Video Grid */}
        <div className="flex-1">
          <VideoGrid
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onMuteChange={setIsMuted}
            onVideoChange={setIsVideoOff}
          />
        </div>

        {/* Floating Controls */}
        <div className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-full bg-background/90 backdrop-blur border shadow-lg transition-all duration-300",
          showControls ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        )}>
          <div className="flex items-center gap-4">
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
      </div>

      {/* Side Panel */}
      <div className={cn(
        "fixed right-0 top-0 bottom-0 bg-background border-l",
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
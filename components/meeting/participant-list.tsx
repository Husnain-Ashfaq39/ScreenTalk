'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

export function ParticipantList({ meetingId }: { meetingId: string }) {
  // Mock data for UI demonstration
  const [participants] = useState<Participant[]>([
    { id: '1', name: 'You', isMuted: false, isVideoOff: false },
    { id: '2', name: 'Demo User 1', isMuted: true, isVideoOff: false },
    { id: '3', name: 'Demo User 2', isMuted: false, isVideoOff: true },
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Participants ({participants.length})</h2>
      </div>
      
      <ScrollArea className="flex-1">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-4 hover:bg-muted/50"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium">{participant.name}</span>
                {participant.id === '1' && (
                  <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {participant.isMuted && <span>Muted</span>}
              {participant.isVideoOff && <span>Video Off</span>}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
} 
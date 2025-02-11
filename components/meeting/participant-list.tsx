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
  const [participants] = useState<Participant[]>([
    { id: '1', name: 'You', isMuted: false, isVideoOff: false },
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
            <span className="font-medium">{participant.name}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
} 
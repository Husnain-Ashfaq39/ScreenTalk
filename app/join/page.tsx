'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function JoinMeeting() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');

  const handleJoin = () => {
    if (!meetingId.trim()) {
      toast.error('Please enter a meeting ID');
      return;
    }

    toast.success('Joining meeting...');
    router.push(`/meeting?channel=${meetingId.trim()}`);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Join Meeting</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter a meeting ID to join an existing meeting
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>
          <Button className="w-full" onClick={handleJoin}>
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
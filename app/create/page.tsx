'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateMeeting() {
  const [meetingName, setMeetingName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    if (!meetingName.trim()) {
      toast.error('Please enter a meeting name');
      return;
    }
    // Handle create meeting logic here
    toast.success('Creating meeting...');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create Meeting</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Set up a new meeting room
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-name">Meeting Name</Label>
            <Input
              id="meeting-name"
              placeholder="Enter meeting name"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private">Private Meeting</Label>
          </div>
          <Button className="w-full" onClick={handleCreate}>
            Create Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
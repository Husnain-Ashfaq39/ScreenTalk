export interface Meeting {
  id: string;
  date: string;
  duration: string;
  participants: number;
  status: 'Completed' | 'Scheduled' | 'In Progress';
}

export interface ScheduledMeeting {
  title: string;
  time: string;
}

export const recentMeetings: Meeting[] = [
  {
    id: '#MET-2023-001',
    date: 'Oct 10, 2023',
    duration: '45 mins',
    participants: 8,
    status: 'Completed'
  },
  {
    id: '#MET-2023-002',
    date: 'Oct 11, 2023',
    duration: '30 mins',
    participants: 5,
    status: 'Completed'
  }
];

export const scheduledMeetings: ScheduledMeeting[] = [
  {
    title: 'Team Sync',
    time: 'Today, 2:00 PM'
  },
  {
    title: 'Client Meeting',
    time: 'Tomorrow, 10:00 AM'
  }
];

export const meetingTrends = [
  { month: 'Jan', meetings: 30 },
  { month: 'Feb', meetings: 45 },
  { month: 'Mar', meetings: 38 },
  { month: 'Apr', meetings: 50 },
  { month: 'May', meetings: 65 },
  { month: 'Jun', meetings: 58 },
];

export const meetingStatusData = [
  { name: 'Completed', value: 45 },
  { name: 'Scheduled', value: 30 },
  { name: 'In Progress', value: 15 },
]; 
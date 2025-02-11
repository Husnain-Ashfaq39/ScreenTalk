'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, Video, Monitor } from "lucide-react";
import Link from "next/link";

interface Meeting {
  id: string;
  date: string;
  duration: string;
  participants: number;
  status: 'Completed' | 'Scheduled' | 'In Progress';
}

export default function Dashboard() {
  const recentMeetings: Meeting[] = [
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

  const scheduledMeetings = [
    {
      title: 'Team Sync',
      time: 'Today, 2:00 PM'
    },
    {
      title: 'Client Meeting',
      time: 'Tomorrow, 10:00 AM'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome Back, John</h1>
        <Button asChild>
          <Link href="/create">
            <span>+ New Meeting</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Minutes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">MEETING ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">DATE</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">DURATION</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">PARTICIPANTS</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recentMeetings.map((meeting) => (
                  <tr key={meeting.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{meeting.id}</td>
                    <td className="p-4 align-middle">{meeting.date}</td>
                    <td className="p-4 align-middle">{meeting.duration}</td>
                    <td className="p-4 align-middle">{meeting.participants}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {meeting.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Video className="h-6 w-6" />
              <span>Start Video Call</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Monitor className="h-6 w-6" />
              <span>Share Screen</span>
            </Button>
          </CardContent>
        </Card>

        {/* Scheduled Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledMeetings.map((meeting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground">{meeting.time}</p>
                  </div>
                  <Button variant="outline">Join</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
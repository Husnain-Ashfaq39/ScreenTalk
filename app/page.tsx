'use client';

import { Button } from '@/components/ui/button';
import { Video, Users, Share2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-6 md:py-12 lg:py-20 xl:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Connect, Share, Collaborate
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Experience seamless video conferencing with ScreenTalk. High-quality video calls, screen sharing, and real-time chat all in one place.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/create">
                <Button size="lg">Start a Meeting</Button>
              </Link>
              <Link href="/join">
                <Button variant="outline" size="lg">Join Meeting</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={item} className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Video Calls</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Crystal clear HD video calls with support for multiple participants
              </p>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Screen Sharing</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Share your screen with one click for better collaboration
              </p>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Chat</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Built-in chat functionality for seamless communication
              </p>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Group Meetings</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Host meetings with multiple participants in high quality
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
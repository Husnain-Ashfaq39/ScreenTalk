'use client';

import { Button } from '@/components/ui/button';
import { Video, Users, Share2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FeaturesSectionDemo } from '@/components/ui/features';

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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-background">
        <FeaturesSectionDemo />
      </section>
    </div>
  );
}
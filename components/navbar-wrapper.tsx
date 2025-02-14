'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isMeeting = pathname?.startsWith('/meeting');

  if (isDashboard || isMeeting) {
    return null;
  }

  return <Navbar />;
} 
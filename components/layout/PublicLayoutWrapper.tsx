"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  // Patterns for paths that should NOT have the global Navbar and Footer
  const isDashboard = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/admin') || 
                      pathname.startsWith('/publisher') ||
                      pathname === '/login' ||
                      pathname === '/register' ||
                      pathname === '/signup';

  if (isDashboard) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}

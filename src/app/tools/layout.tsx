import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Fire Safety Inspector Tools | BFP Inspectors Guide',
  description: 'Tools for fire safety inspectors including calculators, reference library, and report generation',
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

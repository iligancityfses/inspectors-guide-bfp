import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fire Safety Inspectors Guide',
  description: 'A tool for fire safety inspectors based on RA 9514 IRR 2019',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 py-3 text-center text-xs text-gray-600 border-t border-gray-200">
          <p>Created by FO1 Gejon JNG, Iligan City Fire Station</p>
          <p className="mt-1">Based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019)</p>
        </footer>
      </body>
    </html>
  );
}

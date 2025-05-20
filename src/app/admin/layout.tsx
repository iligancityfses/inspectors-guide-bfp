import { Metadata } from 'next';

// Add metadata for better SEO and page identification
export const metadata: Metadata = {
  title: 'Admin Dashboard - Fire Safety Inspectors Guide',
  description: 'Administrative dashboard for the Fire Safety Inspectors Guide application',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}

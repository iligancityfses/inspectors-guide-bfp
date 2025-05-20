import { Metadata } from 'next';

// Add metadata for better SEO and page identification
export const metadata: Metadata = {
  title: 'Disclaimer - Fire Safety Inspectors Guide',
  description: 'Legal disclaimer and terms of use for the Fire Safety Inspectors Guide application',
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="disclaimer-layout">
      {children}
    </div>
  )
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Insect Identifier - AI-Powered Insect Recognition',
  description: 'Upload an image of any insect to instantly identify it using AI technology.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
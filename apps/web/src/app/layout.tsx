import '@/app/globals.css';
import { DevBanner } from '@/components/DevBanner';
import { NavBar } from '@/components/navigation/nav-bar';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'Puglet - Mock Padlet',
  description: 'One of the todo list trackers of all time',
  icons: {
    icon: [
      { url: '/puglet.ico', sizes: 'any' },
      { url: '/puglet.png', sizes: '32x32', type: 'image/png' },
      { url: '/puglet.webp', sizes: '32x32', type: 'image/webp' },
    ],
    apple: [{ url: '/puglet.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/puglet.ico'],
  },
  manifest: '/puglet.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(montserrat.variable, 'font-sans')}>
        <Providers>
          <DevBanner />
          <div className="flex min-h-screen flex-col">
            <NavBar />

            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

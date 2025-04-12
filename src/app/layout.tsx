import '@/app/globals.css';
import { NavBar } from '@/components/NavBar';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter, Montserrat, Open_Sans, Poppins, Roboto } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const poppins = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Puglet - Mock Padlet',
  description: 'A simple todo list application',
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
    <html lang="en">
      <body>
        <Providers>
          <Toaster />
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

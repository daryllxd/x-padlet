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
  title: 'Todo Manager',
  description: 'A simple todo manager application with presentation mode',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🧑‍🎨</text></svg>',
        sizes: 'any',
      },
    ],
  },
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

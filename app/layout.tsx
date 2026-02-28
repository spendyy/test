import type { Metadata } from 'next';
import { Flamenco } from 'next/font/google';
import './globals.css';

export const flamenco = Flamenco({
  weight: '400',
  variable: '--font-flamenco',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pages app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${flamenco.variable} antialiased bg-linear-to-r bg-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}

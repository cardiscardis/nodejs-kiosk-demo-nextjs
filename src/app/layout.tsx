import './globals.css';
import Nav from '@/components/Nav';
import config from '@/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: config.bitpay.design.hero.title,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}

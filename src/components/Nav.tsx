'use client';

import Image from 'next/image';
import Link from 'next/link';
import config from '@/config';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  className="h-8 w-auto"
                  src={config.bitpay.design.logo}
                  alt="Logo"
                  width={300}
                  height={75}
                />
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                onClick={() => setIsOpen(false)}
                href="/invoices"
                className={`text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/invoices'
                    ? 'border-b-2 border-indigo-500'
                    : 'border-b-2 border-transparent'
                }`}
                aria-current="page"
              >
                Invoices
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                onClick={() => setIsOpen(false)}
                href="/ledger"
                className={`text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/ledger'
                    ? 'border-b-2 border-indigo-500'
                    : 'border-b-2 border-transparent'
                }`}
                aria-current="page"
              >
                Ledger
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
      >
        <div className="space-y-1 pt-2 pb-3">
          <Link
            onClick={() => setIsOpen(false)}
            href="/invoices"
            className={`bg-indigo-50 block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/invoices'
                ? ' border-indigo-500 text-indigo-700'
                : ''
            }`}
            aria-current="page"
          >
            Invoices
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            href="/ledger"
            className={`bg-indigo-50 block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/ledger' ? ' border-indigo-500 text-indigo-700' : ''
            }`}
            aria-current="page"
          >
            Ledger
          </Link>
        </div>
      </div>
    </nav>
  );
}

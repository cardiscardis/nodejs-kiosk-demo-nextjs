'use client';

import Link from 'next/link';
import { formatNumber } from '@/utils';
import { Invoice } from '@prisma/client';
import useInvoices from '@/hooks/useInvoices';
import NotificationsWrapper from './NotificationsWrapper';
import Notification from './Notification';

export default function InvoicesTable({
  invoices: initialInvoices,
}: {
  invoices: Invoice[];
}) {
  const cols = [
    { label: 'ID' },
    { label: 'Price' },
    { label: 'Description' },
    { label: 'Status' },
  ];

  const { invoices, events, setEvents } = useInvoices(initialInvoices);
  const onNotificationClose = (index: number) => {
    const updatedEvent = { ...events[index], showed: true };
    const newEvents = [...events];
    newEvents[index] = updatedEvent;
    setEvents(newEvents);
  };

  return (
    <>
      <div className="px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {cols.map((col, index) => {
                      return (
                        <th
                          key={index}
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 first:pl-0"
                        >
                          {col.label}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices &&
                    invoices.map((invoice) => {
                      return (
                        <tr key={invoice.id}>
                          <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 pl-0">
                            <Link href={`/invoices/${invoice.id}`}>
                              {invoice.bitpay_id}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            {invoice.price && invoice.currency_code
                              ? formatNumber(
                                  invoice.price,
                                  invoice.currency_code
                                )
                              : null}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            {invoice.item_description}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm capitalize font-medium text-gray-800">
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                  {invoices.length === 0 && (
                    <tr>
                      <td className="text-center py-20" colSpan={cols.length}>
                        <p className="text-md">
                          {`You don't have any invoices yet.`}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <NotificationsWrapper>
        {events.length > 0 &&
          events.map(
            (event, i) =>
              !event.showed && (
                <Notification
                  key={i}
                  eventData={event}
                  onClose={() => onNotificationClose(i)}
                />
              )
          )}
      </NotificationsWrapper>
    </>
  );
}

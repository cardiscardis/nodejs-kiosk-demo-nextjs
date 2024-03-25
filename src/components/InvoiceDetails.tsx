'use client';

import dayjs from 'dayjs';
import { formatNumber } from '@/utils';
import { Invoice } from '@prisma/client';
import useInvoices from '@/hooks/useInvoices';
import NotificationsWrapper from './NotificationsWrapper';
import Notification from './Notification';

export default function InvoiceDetails({
  invoice: initialInvoice,
}: {
  invoice: Invoice;
}) {
  const { invoice, events, setEvents } = useInvoices(null, initialInvoice);
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
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    General Information
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {invoice.bitpay_id}
                        <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium capitalize text-gray-800">
                          {invoice.status}
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Price
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {invoice.price && invoice.currency_code
                          ? formatNumber(invoice.price, invoice.currency_code)
                          : null}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {dayjs(invoice.created_date).format('YYYY-MM-DD HH:MM')}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Order ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {invoice.bitpay_order_id}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
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

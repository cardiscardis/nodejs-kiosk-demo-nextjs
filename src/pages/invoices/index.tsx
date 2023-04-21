import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { Invoice } from '@prisma/client';
import { formatNumber } from '@/utils';
import useInvoices from '@/hooks/useInvoices';
import PageHeader from '@/components/PageHeader';
import Notification from '@/components/Notification';
import NotificationsWrapper from '@/components/NotificationsWrapper';
import logger from '@/utils/logger';

interface InvoicesPageProps {
  data: Invoice[];
  next: { page: number; limit: number } | null;
  prev: { page: number; limit: number } | null;
  total: number;
  page: number;
  limit: number;
}

const Invoices: NextPage<InvoicesPageProps> = ({
  data,
  total,
  next,
  prev,
  page,
  limit,
}) => {
  const { invoices, events, setEvents } = useInvoices(data);
  const cols = [
    { label: 'ID' },
    { label: 'Price' },
    { label: 'Description' },
    { label: 'Status' },
  ];
  const showingFrom = invoices.length ? (page - 1) * limit + 1 : 0;
  const showingTo = (page - 1) * limit + invoices.length;

  const onNotificationClose = (index: number) => {
    const updatedEvent = { ...events[index], showed: true };
    const newEvents = [...events];
    newEvents[index] = updatedEvent;
    setEvents(newEvents);
  };

  return (
    <>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <PageHeader title="Invoices" />
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
                            <td
                              className="text-center py-20"
                              colSpan={cols.length}
                            >
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
            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing
                  <span className="font-medium mx-1">{showingFrom}</span>
                  to
                  <span className="font-medium mx-1">{showingTo}</span>
                  of
                  <span className="font-medium mx-1">{total}</span>
                  results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                {prev && (
                  <Link
                    href={`/invoices?page=${prev.page}&limit=${prev.limit}`}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Link>
                )}
                {next && (
                  <Link
                    href={`/invoices?page=${next?.page}&limit=${next.limit}`}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </main>
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
};

export default Invoices;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices?page=${page}&limit=${limit}`
  );

  const { data, total, next, prev } = await res.json();

  logger.info({
    code: 'INVOICE_GRID_GET',
    message: 'Loaded invoice grid',
    context: {
      page,
    },
  });

  return {
    props: {
      data,
      total,
      next,
      prev,
      page,
      limit,
    },
  };
};

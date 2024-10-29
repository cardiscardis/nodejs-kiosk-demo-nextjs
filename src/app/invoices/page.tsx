import InvoicesTable from '@/components/InvoicesTable';
import PageHeader from '@/components/PageHeader';
import InvoicesPagination from '@/components/InvoicesPagination';
import { Invoice } from '@prisma/client';
import logger from '@/utils/logger';

export default async function Invoices(
  props: {
    searchParams: Promise<{ [key: string]: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page) || 1;
  const limit = parseInt(searchParams.limit) || 10;
  const { data: invoices, total, next, prev } = await getInvoices(page, limit);

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <PageHeader title="Invoices" />
        <InvoicesTable invoices={invoices} />
        <InvoicesPagination
          data={{ total, prev, next, page, limit, length: invoices.length }}
        />
      </div>
    </div>
  );
}

const getInvoices = async (page: number, limit: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices?page=${page}&limit=${limit}`,
    {
      cache: 'no-cache',
    }
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
    data,
    total,
    next,
    prev,
  } as {
    data: Invoice[];
    total: number;
    next: {
      page: number;
      limit: number;
    } | null;
    prev: {
      page: number;
      limit: number;
    } | null;
  };
};

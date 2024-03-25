import InvoiceDetails from '@/components/InvoiceDetails';
import PageHeader from '@/components/PageHeader';
import logger from '@/utils/logger';
import { Invoice } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function Invoice({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(parseInt(params.id));

  if (!invoice) {
    redirect('/invoices');
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <PageHeader title="Invoice Details" />
        <InvoiceDetails invoice={invoice} />
      </div>
    </div>
  );
}

const getInvoice = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${id}`
  );
  const { data } = await res.json();

  logger.info({
    code: 'INVOICE_GET',
    message: 'Loaded invoice',
    context: {
      id,
    },
  });

  return data as Invoice;
};

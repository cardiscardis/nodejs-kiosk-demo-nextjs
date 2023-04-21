import { useCallback, useEffect, useState } from 'react';
import { Invoice } from '@prisma/client';

const useInvoices = (
  initialInvoicesState?: Invoice[] | null,
  initialInvoiceState?: Invoice | null
) => {
  const [invoices, setInvoices] = useState<Invoice[]>(
    initialInvoicesState || []
  );
  const [invoice, setInvoice] = useState<Partial<Invoice>>(
    initialInvoiceState || {}
  );
  const [eventData, setEventData] = useState<Partial<Invoice> | null>(null);

  const handleInvoiceUpdate = useCallback(
    (data: Partial<Invoice>) => {
      const invoiceIndex = invoices.findIndex(
        (invoice) => invoice.id === data.id
      );
      const updatedInvoice = { ...invoices[invoiceIndex], ...data };
      const newInvoices = [...invoices];
      newInvoices[invoiceIndex] = updatedInvoice;
      setInvoices(newInvoices);

      if (invoice && invoice.id === data.id) {
        setInvoice(updatedInvoice);
      }
    },
    [invoices, invoice]
  );

  useEffect(() => {
    const sse = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/sse`
    );

    sse.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setEventData(data);
      handleInvoiceUpdate(data);
    };

    return () => {
      sse.close();
    };
  }, [invoices, eventData, handleInvoiceUpdate]);

  return {
    invoices,
    invoice,
    eventData,
  };
};

export default useInvoices;

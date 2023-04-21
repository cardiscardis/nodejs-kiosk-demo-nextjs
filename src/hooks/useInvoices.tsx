import { useCallback, useEffect, useState } from 'react';
import { Invoice } from '@prisma/client';

export type InvoiceEvent = {
  eventName: string;
  eventCode: number;
  invoice: Partial<Invoice>;
  message: {
    type: 'Good' | 'Bad' | null;
    content: string | null;
  };
  showed: boolean;
};

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
  const [events, setEvents] = useState<InvoiceEvent[]>([]);

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
      const data: InvoiceEvent = JSON.parse(e.data);
      setEventData(data.invoice);
      setEvents([...events, { ...data, showed: false }]);
      handleInvoiceUpdate(data.invoice);
    };

    return () => {
      sse.close();
    };
  }, [invoices, eventData, events, handleInvoiceUpdate]);

  return {
    invoices,
    invoice,
    eventData,
    events,
    setEvents,
  };
};

export default useInvoices;

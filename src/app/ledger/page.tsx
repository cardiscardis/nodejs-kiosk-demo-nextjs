import Error from '@/components/Error';
import LedgerReportTable from '@/components/LedgerReportTable';
import LedgerReportTableToolbar from '@/components/LedgerReportTableToolbar';
import PageHeader from '@/components/PageHeader';
import { bitpayClient } from '@/lib/bitpay';
import { Currency } from 'bitpay-sdk';
import { redirect } from 'next/navigation';
import dayjs from 'dayjs';

export default async function LedgerReport(props: {
  searchParams: Promise<{
    startDate: string;
    endDate: string;
    currency: string;
  }>;
}) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const searchParams = await props.searchParams;
  let { startDate, endDate, currency } = searchParams;

  if (!startDate && !endDate && !currency) {
    startDate = dayjs(oneMonthAgo).format('YYYY-MM-DD');
    endDate = dayjs(tomorrow).format('YYYY-MM-DD');
    currency = Currency.USD;

    return redirect(
      `/ledger?startDate=${startDate}&endDate=${endDate}&currency=${currency}`
    );
  }

  try {
    const ledgerReport = await bitpayClient.getLedgerEntries(
      currency,
      new Date(startDate),
      new Date(endDate)
    );

    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <PageHeader title="Ledger Report" />
          <div className="px-6 lg:px-8 mt-10">
            <div className="mt-8 flow-root">
              <LedgerReportTableToolbar
                startDate={startDate}
                endDate={endDate}
                currency={currency}
                data={ledgerReport}
              />
              <LedgerReportTable ledgerReport={ledgerReport} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: unknown) {
    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <PageHeader title="Ledger Report" />
          <div className="px-6 lg:px-8 mt-10">
            <LedgerReportTableToolbar
              startDate={startDate}
              endDate={endDate}
              currency={currency}
              data={[]}
            />
            <div className="mt-8 flow-root">
              <Error>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </Error>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

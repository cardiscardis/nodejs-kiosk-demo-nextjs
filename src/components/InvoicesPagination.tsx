import Link from 'next/link';

export default function InvoicesPagination({
  data,
}: {
  data: {
    total: number;
    page: number;
    limit: number;
    length: number;
    prev: { page: number; limit: number } | null;
    next: { page: number; limit: number } | null;
  };
}) {
  const { total, page, limit, length, next, prev } = data;
  const showingFrom = length ? (page - 1) * limit + 1 : 0;
  const showingTo = (page - 1) * limit + length;

  return (
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
        <Link
          href={`/invoices?page=${prev?.page}&limit=${prev?.limit}`}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all select-none ${
            !prev ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Previous
        </Link>

        <Link
          href={`/invoices?page=${next?.page}&limit=${next?.limit}`}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all select-none ${
            !next ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}

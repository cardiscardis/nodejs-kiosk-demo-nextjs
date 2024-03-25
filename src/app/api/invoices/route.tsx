import { invoiceService } from '@/services/invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') as string) || 1;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') as string) || 10;

  try {
    const { invoices, count, next, prev } = await invoiceService.getInvoices(
      page,
      limit
    );

    return NextResponse.json({
      data: invoices,
      total: count,
      next,
      prev,
    });
  } catch (e) {
    return new Response(JSON.stringify(e), { status: 500 });
  }
}

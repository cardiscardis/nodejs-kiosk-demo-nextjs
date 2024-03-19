import { invoiceService } from '@/services/invoice';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const invoice = await invoiceService.findInvoiceById(id);
    return NextResponse.json({ data: invoice });
  } catch (e) {
    return new Response(JSON.stringify(e), {
      status: 500,
    });
  }
}

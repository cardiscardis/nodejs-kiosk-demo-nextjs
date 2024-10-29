import { invoiceService } from '@/services/invoice';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

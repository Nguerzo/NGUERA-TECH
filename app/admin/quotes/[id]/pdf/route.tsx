import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { QuoteDocument, type QuotePdfData } from "@/lib/pdf/QuoteDocument";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["ADMIN", "TEAM"]);
  const { id } = await params;

  const quote = await db.quote.findUnique({
    where: { id },
    include: { client: true, items: { orderBy: { position: "asc" } } },
  });

  if (!quote) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

  const data: QuotePdfData = {
    number: quote.number,
    status: quote.status,
    createdAt: quote.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    validUntil: quote.validUntil ? quote.validUntil.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null,
    currency: quote.currency,
    clientName: quote.client.fullName,
    clientEmail: quote.client.email,
    clientCompany: quote.client.companyName,
    notes: quote.notes,
    items: quote.items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    })),
  };

  const buffer = await renderToBuffer(<QuoteDocument data={data} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quote.number}.pdf"`,
    },
  });
}

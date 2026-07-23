import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { InvoiceDocument, type InvoicePdfData } from "@/lib/pdf/InvoiceDocument";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["ADMIN", "TEAM"]);
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { client: true, project: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const data: InvoicePdfData = {
    number: invoice.number,
    status: invoice.status,
    createdAt: invoice.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    dueDate: invoice.dueDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    amount: Number(invoice.amount),
    currency: invoice.currency,
    clientName: invoice.client.fullName,
    clientEmail: invoice.client.email,
    clientCompany: invoice.client.companyName,
    projectTitle: invoice.project.title,
  };

  const buffer = await renderToBuffer(<InvoiceDocument data={data} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.number}.pdf"`,
    },
  });
}

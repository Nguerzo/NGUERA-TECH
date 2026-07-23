import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  brand: { fontSize: 16, fontWeight: 700 },
  brandSub: { fontSize: 9, color: "#6B7280", marginTop: 2 },
  docTitle: { fontSize: 20, fontWeight: 700, textAlign: "right" },
  docMeta: { fontSize: 9, color: "#6B7280", textAlign: "right", marginTop: 4 },
  section: { marginBottom: 24 },
  label: { fontSize: 8, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  value: { fontSize: 10.5 },
  table: { marginTop: 12, borderTop: "1 solid #E5E7EB" },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #E5E7EB", paddingVertical: 8 },
  tableHeaderRow: { flexDirection: "row", paddingVertical: 8, borderBottom: "1 solid #111827" },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  headerCell: { fontSize: 8, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B7280" },
  totalsBlock: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", gap: 24, marginBottom: 4 },
  totalLabel: { fontSize: 10, color: "#6B7280" },
  totalValue: { fontSize: 10, width: 90, textAlign: "right" },
  grandTotalValue: { fontSize: 13, fontWeight: 700, width: 90, textAlign: "right" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, fontSize: 8, color: "#9CA3AF", textAlign: "center" },
  notes: { marginTop: 24, fontSize: 9.5, color: "#4B5563", lineHeight: 1.5 },
});

export type QuotePdfData = {
  number: string;
  status: string;
  createdAt: string;
  validUntil: string | null;
  currency: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  notes: string | null;
  items: { description: string; quantity: number; unitPrice: number }[];
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function QuoteDocument({ data }: { data: QuotePdfData }) {
  const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Document title={`Devis ${data.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NGUERA SENEGALENSIS TECH</Text>
            <Text style={styles.brandSub}>Serving clients in the United Kingdom and internationally</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>DEVIS</Text>
            <Text style={styles.docMeta}>{data.number}</Text>
            <Text style={styles.docMeta}>Émis le {data.createdAt}</Text>
            {data.validUntil && <Text style={styles.docMeta}>Valable jusqu&apos;au {data.validUntil}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Destinataire</Text>
          <Text style={styles.value}>{data.clientName}</Text>
          {data.clientCompany && <Text style={styles.value}>{data.clientCompany}</Text>}
          <Text style={styles.value}>{data.clientEmail}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, styles.colDescription]}>Description</Text>
            <Text style={[styles.headerCell, styles.colQty]}>Quantité</Text>
            <Text style={[styles.headerCell, styles.colPrice]}>Prix unitaire</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatMoney(item.unitPrice, data.currency)}</Text>
              <Text style={styles.colTotal}>{formatMoney(item.quantity * item.unitPrice, data.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatMoney(total, data.currency)}</Text>
          </View>
        </View>

        {data.notes && (
          <View style={styles.notes}>
            <Text style={styles.label}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Ce devis est indicatif et sujet à confirmation. NGUERA SENEGALENSIS TECH — nguera-tech.vercel.app
        </Text>
      </Page>
    </Document>
  );
}

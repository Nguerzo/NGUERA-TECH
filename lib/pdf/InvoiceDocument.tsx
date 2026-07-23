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
  amountBlock: { marginTop: 32, alignItems: "flex-end" },
  amountLabel: { fontSize: 10, color: "#6B7280" },
  amountValue: { fontSize: 22, fontWeight: 700, marginTop: 4 },
  statusBadge: { marginTop: 8, fontSize: 9, color: "#6B7280" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, fontSize: 8, color: "#9CA3AF", textAlign: "center" },
});

export type InvoicePdfData = {
  number: string;
  status: string;
  createdAt: string;
  dueDate: string;
  amount: number;
  currency: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  projectTitle: string;
};

const STATUS_LABEL: Record<string, string> = {
  BROUILLON: "Brouillon",
  ENVOYEE: "Envoyée",
  PAYEE: "Payée",
  EN_RETARD: "En retard",
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  return (
    <Document title={`Facture ${data.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NGUERA SENEGALENSIS TECH</Text>
            <Text style={styles.brandSub}>Serving clients in the United Kingdom and internationally</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>FACTURE</Text>
            <Text style={styles.docMeta}>{data.number}</Text>
            <Text style={styles.docMeta}>Émise le {data.createdAt}</Text>
            <Text style={styles.docMeta}>Échéance : {data.dueDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Destinataire</Text>
          <Text style={styles.value}>{data.clientName}</Text>
          {data.clientCompany && <Text style={styles.value}>{data.clientCompany}</Text>}
          <Text style={styles.value}>{data.clientEmail}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Projet</Text>
          <Text style={styles.value}>{data.projectTitle}</Text>
        </View>

        <View style={styles.amountBlock}>
          <Text style={styles.amountLabel}>Montant dû</Text>
          <Text style={styles.amountValue}>{formatMoney(data.amount, data.currency)}</Text>
          <Text style={styles.statusBadge}>Statut : {STATUS_LABEL[data.status] ?? data.status}</Text>
        </View>

        <Text style={styles.footer}>NGUERA SENEGALENSIS TECH — nguera-tech.vercel.app</Text>
      </Page>
    </Document>
  );
}

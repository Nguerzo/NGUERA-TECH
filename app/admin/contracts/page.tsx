import { db } from "@/lib/db";
import { getContractSignedUrl } from "@/lib/supabase/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileSignature } from "lucide-react";
import { NewContractDialog } from "@/components/portal/contracts/NewContractDialog";
import { ContractRowActions } from "@/components/portal/contracts/ContractRowActions";
import { CONTRACT_STATUS_LABEL, CONTRACT_STATUS_STYLE } from "@/lib/contracts/labels";
import { cn } from "@/lib/utils";

export const metadata = { title: "Contrats — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default async function ContractsPage() {
  const [contracts, clients, projects] = await Promise.all([
    db.contract.findMany({ orderBy: { createdAt: "desc" }, include: { client: true } }),
    db.user.findMany({ where: { role: "CLIENT" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true, email: true } }),
    db.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true, clientId: true } }),
  ]);

  const contractsWithUrl = await Promise.all(
    contracts.map(async (c) => ({ ...c, url: await getContractSignedUrl(c.filePath) }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Contrats</h1>
        </div>
        <NewContractDialog clients={clients} projects={projects} />
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <FileSignature className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Stockage sécurisé (accès restreint à l&apos;équipe). La signature électronique n&apos;est pas encore
        automatisée — un fournisseur (DocuSign, Yousign…) reste à intégrer ; en attendant, le statut
        &quot;Signé&quot; se marque manuellement.
      </div>

      {contractsWithUrl.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          {clients.length === 0 ? "Créez d'abord un client avant d'ajouter un contrat." : "Aucun contrat pour le moment."}
        </div>
      ) : (
        <div className="space-y-3">
          {contractsWithUrl.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {c.client.fullName} — {c.fileName} — {formatSize(c.fileSize)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={cn("border-0 font-medium", CONTRACT_STATUS_STYLE[c.status])}>
                    {CONTRACT_STATUS_LABEL[c.status]}
                  </Badge>
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                    <a href={c.url} target="_blank" rel="noopener noreferrer" download={c.fileName}>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <ContractRowActions contractId={c.id} initialStatus={c.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

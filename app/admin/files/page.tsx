import { db } from "@/lib/db";
import { getProjectDocumentSignedUrl, getContractSignedUrl, getLeadAttachmentSignedUrl } from "@/lib/supabase/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { NewDocumentDialog } from "@/components/portal/files/NewDocumentDialog";
import { DeleteDocumentButton } from "@/components/portal/files/DeleteDocumentButton";
import { categorize, CATEGORY_ICON, CATEGORY_LABEL, type FileCategory } from "@/lib/files/category";

export const metadata = { title: "Centre de fichiers — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

type UnifiedFile = {
  id: string;
  name: string;
  category: FileCategory;
  source: "Document" | "Contrat" | "Prospect";
  url: string;
  meta: string;
  createdAt: Date;
  onDelete?: React.ReactNode;
};

export default async function FileCenterPage() {
  const [documents, contracts, attachments, projects] = await Promise.all([
    db.document.findMany({ orderBy: { createdAt: "desc" }, include: { project: { select: { title: true } } } }),
    db.contract.findMany({ orderBy: { createdAt: "desc" }, include: { client: { select: { fullName: true } } } }),
    db.leadAttachment.findMany({ orderBy: { createdAt: "desc" }, include: { lead: { select: { id: true, fullName: true } } } }),
    db.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true } }),
  ]);

  const files: UnifiedFile[] = [
    ...(await Promise.all(
      documents.map(async (d) => ({
        id: `doc-${d.id}`,
        name: d.fileName,
        category: categorize(d.fileName),
        source: "Document" as const,
        url: await getProjectDocumentSignedUrl(d.fileUrl),
        meta: d.project.title,
        createdAt: d.createdAt,
        onDelete: <DeleteDocumentButton documentId={d.id} />,
      }))
    )),
    ...(await Promise.all(
      contracts.map(async (c) => ({
        id: `contract-${c.id}`,
        name: c.fileName,
        category: categorize(c.fileName),
        source: "Contrat" as const,
        url: await getContractSignedUrl(c.filePath),
        meta: c.client.fullName,
        createdAt: c.createdAt,
      }))
    )),
    ...(await Promise.all(
      attachments.map(async (a) => ({
        id: `lead-${a.id}`,
        name: a.fileName,
        category: categorize(a.fileName),
        source: "Prospect" as const,
        url: await getLeadAttachmentSignedUrl(a.filePath),
        meta: a.lead.fullName,
        createdAt: a.createdAt,
      }))
    )),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const categories: FileCategory[] = ["document", "image", "pdf"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Centre de fichiers</h1>
        </div>
        <NewDocumentDialog projects={projects} />
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          Aucun fichier pour le moment — documents, contrats et pièces jointes des prospects apparaîtront ici.
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tous ({files.length})</TabsTrigger>
            {categories.map((cat) => {
              const count = files.filter((f) => f.category === cat).length;
              return (
                <TabsTrigger key={cat} value={cat}>
                  {CATEGORY_LABEL[cat]} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-3 pt-4">
            {files.map((f) => (
              <FileRow key={f.id} file={f} />
            ))}
          </TabsContent>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-3 pt-4">
              {files
                .filter((f) => f.category === cat)
                .map((f) => (
                  <FileRow key={f.id} file={f} />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function FileRow({ file }: { file: UnifiedFile }) {
  const Icon = CATEGORY_ICON[file.category];
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="truncate text-xs text-muted-foreground">{file.meta}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            {file.source}
          </Badge>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" />
            </a>
          </Button>
          {file.onDelete}
        </div>
      </CardContent>
    </Card>
  );
}

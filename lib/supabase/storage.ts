import "server-only";
import { createSupabaseAdminClient } from "./admin";

const LEAD_ATTACHMENTS_BUCKET = "lead-attachments";

export async function uploadLeadAttachment(leadId: string, file: File) {
  const supabase = createSupabaseAdminClient();
  const path = `${leadId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { error } = await supabase.storage
    .from(LEAD_ATTACHMENTS_BUCKET)
    .upload(path, file, { contentType: file.type || "application/octet-stream" });

  if (error) throw error;
  return path;
}

export async function getLeadAttachmentSignedUrl(path: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(LEAD_ATTACHMENTS_BUCKET)
    .createSignedUrl(path, 60 * 10); // 10 minutes — just long enough to view/download

  if (error) throw error;
  return data.signedUrl;
}

export async function deleteLeadAttachment(path: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(LEAD_ATTACHMENTS_BUCKET).remove([path]);
  if (error) throw error;
}

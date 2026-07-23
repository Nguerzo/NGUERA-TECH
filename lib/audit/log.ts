import "server-only";
import { db } from "@/lib/db";

/**
 * Records a sensitive action for the audit trail (module 12). Deliberately
 * scoped to security-relevant events (role changes, account creation, lead
 * conversion) rather than every mutation — logging everything would drown
 * out what actually matters when an admin reviews it.
 */
export async function logAudit({
  actorId,
  action,
  entityType,
  entityId,
  detail,
}: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  detail?: string;
}) {
  try {
    await db.auditLog.create({ data: { actorId, action, entityType, entityId, detail } });
  } catch (err) {
    console.error("[audit] failed to record log:", err);
  }
}

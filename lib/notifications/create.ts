import "server-only";
import { db } from "@/lib/db";

/**
 * Fans a notification out to every internal (ADMIN/TEAM) user. Best-effort —
 * a failure here must never break the action that triggered it, so callers
 * should invoke this without awaiting-and-throwing (catch internally).
 */
export async function notifyStaff({ title, message, link }: { title: string; message: string; link?: string }) {
  try {
    const staff = await db.user.findMany({ where: { role: { in: ["ADMIN", "TEAM"] } }, select: { id: true } });
    if (staff.length === 0) return;
    await db.notification.createMany({
      data: staff.map((s) => ({ userId: s.id, title, message, link })),
    });
  } catch (err) {
    console.error("[notifications] failed to notify staff:", err);
  }
}

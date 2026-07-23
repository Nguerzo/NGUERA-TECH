"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function markNotificationRead(notificationId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  await db.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });

  revalidatePath("/admin");
}

export async function markAllNotificationsRead() {
  const user = await getCurrentUser();
  if (!user) return;

  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/admin");
}

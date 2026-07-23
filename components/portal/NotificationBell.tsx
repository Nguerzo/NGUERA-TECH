"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { markNotificationRead, markAllNotificationsRead } from "@/app/actions/notifications";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleClick(n: NotificationItem) {
    if (!n.read) {
      startTransition(async () => {
        await markNotificationRead(n.id);
        router.refresh();
      });
    }
    if (n.link) router.push(n.link);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <span className="text-sm font-medium">Notifications</span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() =>
                startTransition(async () => {
                  await markAllNotificationsRead();
                  router.refresh();
                })
              }
            >
              <Check className="h-3 w-3" />
              Tout marquer lu
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">Aucune notification.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n)}
                className="flex w-full flex-col gap-0.5 border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-secondary"
              >
                <div className="flex items-center gap-2">
                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-[11px] text-muted-foreground">{relativeTime(n.createdAt)}</p>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

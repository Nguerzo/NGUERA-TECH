import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewEventDialog } from "@/components/portal/calendar/NewEventDialog";
import { DeleteEventButton } from "@/components/portal/calendar/DeleteEventButton";
import { EVENT_TYPE_LABEL, EVENT_TYPE_STYLE } from "@/lib/calendar/labels";
import { cn } from "@/lib/utils";

export const metadata = { title: "Calendrier — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

const MONTH_LABEL = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function parseMonthParam(month?: string) {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function monthParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildGrid(monthStart: Date) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams;
  const monthStart = parseMonthParam(month);
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
  const prevMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);
  const nextMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);

  const [events, projects] = await Promise.all([
    db.calendarEvent.findMany({
      where: { startAt: { gte: monthStart, lt: monthEnd } },
      orderBy: { startAt: "asc" },
      include: { project: { select: { title: true } } },
    }),
    db.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true } }),
  ]);

  const eventsByDay = new Map<string, typeof events>();
  for (const ev of events) {
    const key = ev.startAt.toDateString();
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), ev]);
  }

  const today = new Date();
  const cells = buildGrid(monthStart);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Calendrier</h1>
        </div>
        <NewEventDialog projects={projects} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/admin/calendar?month=${monthParam(prevMonth)}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href={`/admin/calendar?month=${monthParam(nextMonth)}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="font-display text-lg font-semibold capitalize">{MONTH_LABEL.format(monthStart)}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/calendar">Aujourd&apos;hui</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            const isToday = date && date.toDateString() === today.toDateString();
            const dayEvents = date ? eventsByDay.get(date.toDateString()) ?? [] : [];
            return (
              <div key={i} className={cn("min-h-[100px] border-b border-r p-1.5 last:border-r-0", !date && "bg-muted/10")}>
                {date && (
                  <>
                    <span
                      className={cn(
                        "mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                        isToday && "bg-primary font-semibold text-primary-foreground"
                      )}
                    >
                      {date.getDate()}
                    </span>
                    <div className="space-y-1">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={cn("flex items-center justify-between gap-1 truncate rounded px-1.5 py-0.5 text-[11px]", EVENT_TYPE_STYLE[ev.type])}
                        >
                          <span className="truncate">{ev.title}</span>
                          <DeleteEventButton eventId={ev.id} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Événements du mois ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucun événement ce mois-ci.</p>
          ) : (
            <ul className="divide-y">
              {events.map((ev) => (
                <li key={ev.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ev.startAt.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                      {ev.project ? ` — ${ev.project.title}` : ""}
                    </p>
                  </div>
                  <span className={cn("shrink-0 rounded px-2 py-0.5 text-xs font-medium", EVENT_TYPE_STYLE[ev.type])}>
                    {EVENT_TYPE_LABEL[ev.type]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

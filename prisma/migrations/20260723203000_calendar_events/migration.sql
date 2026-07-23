CREATE TYPE "CalendarEventType" AS ENUM ('REUNION', 'DEADLINE', 'LIVRAISON');

CREATE TABLE "CalendarEvent" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "type" "CalendarEventType" NOT NULL,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3),
  "description" TEXT,
  "projectId" TEXT REFERENCES "Project"("id"),
  "createdById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "CalendarEvent_startAt_idx" ON "CalendarEvent" ("startAt");

ALTER TABLE "CalendarEvent" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calendar_event_team_all" ON "CalendarEvent"
  FOR ALL USING (current_user_role() IN ('TEAM', 'ADMIN'));

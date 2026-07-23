CREATE TABLE "Notification" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "link" TEXT,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification" ("userId", "read", "createdAt");

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_read_own" ON "Notification"
  FOR SELECT USING ("userId" = auth.uid()::text);
CREATE POLICY "notification_update_own" ON "Notification"
  FOR UPDATE USING ("userId" = auth.uid()::text);

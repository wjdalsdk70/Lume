-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "username" TEXT,
    "uiMode" TEXT NOT NULL DEFAULT 'light',
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'ocean',
    "externalBadgeUrl" TEXT,
    "baekjoonId" TEXT,
    "certBadgesInput" TEXT,
    "projectRowsInput" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_nodeId_key" ON "UserSettings"("nodeId");

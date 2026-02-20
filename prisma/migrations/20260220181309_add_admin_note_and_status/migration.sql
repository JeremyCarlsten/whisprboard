-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "authorName" TEXT NOT NULL DEFAULT 'Anonymous',
    "authorEmail" TEXT NOT NULL DEFAULT '',
    "score" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'New',
    "adminNote" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Feedback" ("authorEmail", "authorName", "body", "createdAt", "id", "productId", "score", "status", "title") SELECT "authorEmail", "authorName", "body", "createdAt", "id", "productId", "score", "status", "title" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
CREATE INDEX "Feedback_productId_idx" ON "Feedback"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

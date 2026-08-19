-- AlterTable
ALTER TABLE "ResearchingAssistant" ADD COLUMN     "repoUrl" TEXT,
ALTER COLUMN "lab" DROP NOT NULL,
ALTER COLUMN "supervisor" DROP NOT NULL;

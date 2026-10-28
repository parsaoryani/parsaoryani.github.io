-- CreateEnum
CREATE TYPE "ResearchContentStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "ResearchProposalKind" AS ENUM ('thesis_proposal', 'research_proposal', 'concept_note');

-- CreateEnum
CREATE TYPE "ResearchProposalStage" AS ENUM ('in_preparation', 'active', 'archived');

-- CreateTable
CREATE TABLE "ResearchAgenda" (
    "id" TEXT NOT NULL DEFAULT 'primary',
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "themes" JSONB NOT NULL,
    "description" TEXT,
    "documentUrl" TEXT,
    "status" "ResearchContentStatus" NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchAgenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchProposal" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "ResearchProposalKind" NOT NULL,
    "stage" "ResearchProposalStage" NOT NULL DEFAULT 'in_preparation',
    "year" INTEGER NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "themes" JSONB NOT NULL,
    "motivation" TEXT,
    "researchQuestion" TEXT,
    "approach" TEXT,
    "expectedContributions" TEXT,
    "limitations" TEXT,
    "pdfUrl" TEXT,
    "status" "ResearchContentStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ResearchProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchAgenda_status_idx" ON "ResearchAgenda"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchProposal_slug_key" ON "ResearchProposal"("slug");

-- CreateIndex
CREATE INDEX "ResearchProposal_status_deletedAt_featured_sortOrder_idx" ON "ResearchProposal"("status", "deletedAt", "featured", "sortOrder");

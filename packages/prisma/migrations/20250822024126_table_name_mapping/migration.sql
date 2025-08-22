/*
  Warnings:

  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExpenseSplit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LedgerBalance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetDebtSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settlement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_payerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExpenseSplit" DROP CONSTRAINT "ExpenseSplit_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExpenseSplit" DROP CONSTRAINT "ExpenseSplit_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LedgerBalance" DROP CONSTRAINT "LedgerBalance_creditorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LedgerBalance" DROP CONSTRAINT "LedgerBalance_debtorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NetDebtSummary" DROP CONSTRAINT "NetDebtSummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Settlement" DROP CONSTRAINT "Settlement_creditorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Settlement" DROP CONSTRAINT "Settlement_debtorId_fkey";

-- DropTable
DROP TABLE "public"."Expense";

-- DropTable
DROP TABLE "public"."ExpenseSplit";

-- DropTable
DROP TABLE "public"."LedgerBalance";

-- DropTable
DROP TABLE "public"."NetDebtSummary";

-- DropTable
DROP TABLE "public"."Settlement";

-- CreateTable
CREATE TABLE "public"."expense" (
    "id" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."expense_split" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "expense_split_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ledger_balance" (
    "id" TEXT NOT NULL,
    "debtorId" TEXT NOT NULL,
    "creditorId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ledger_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settlement" (
    "id" TEXT NOT NULL,
    "debtorId" TEXT NOT NULL,
    "creditorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "settledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."net_debt_summary" (
    "userId" TEXT NOT NULL,
    "totalYouOwe" DOUBLE PRECISION NOT NULL,
    "totalOwedToYou" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "net_debt_summary_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledger_balance_debtorId_creditorId_key" ON "public"."ledger_balance"("debtorId", "creditorId");

-- AddForeignKey
ALTER TABLE "public"."expense" ADD CONSTRAINT "expense_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense_split" ADD CONSTRAINT "expense_split_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense_split" ADD CONSTRAINT "expense_split_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ledger_balance" ADD CONSTRAINT "ledger_balance_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ledger_balance" ADD CONSTRAINT "ledger_balance_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."settlement" ADD CONSTRAINT "settlement_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."settlement" ADD CONSTRAINT "settlement_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."net_debt_summary" ADD CONSTRAINT "net_debt_summary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CANCELADO', 'AGUARDANDO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "MailActivate" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MailActivate_pkey" PRIMARY KEY ("id")
);

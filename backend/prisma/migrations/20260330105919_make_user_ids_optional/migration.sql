-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_player1UserId_fkey";

-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_player2UserId_fkey";

-- AlterTable
ALTER TABLE "GameResult" ALTER COLUMN "player1UserId" DROP NOT NULL,
ALTER COLUMN "player2UserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_player1UserId_fkey" FOREIGN KEY ("player1UserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_player2UserId_fkey" FOREIGN KEY ("player2UserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

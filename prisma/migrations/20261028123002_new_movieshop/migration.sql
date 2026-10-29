-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "tmdbId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "tmdbId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "tmdbId" DROP NOT NULL;

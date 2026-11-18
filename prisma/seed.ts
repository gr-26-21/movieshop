import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
 
const prisma = new PrismaClient({ adapter });



async function main() {
  await prisma.movie.createMany({
    data: [
      {
        title: "Testfilmen",
        description: "En testfilm för utveckling.",
        price: 99,
        releaseDate: new Date("2025-01-01"),
        imageUrl: "https://example.com/testfilm-1.jpg",
        stock: 10,
        runtime: 120,
      },
      {
        title: "Testfilmen 2",
        description: "En andra testfilm för utveckling.",
        price: 149,
        releaseDate: new Date("2025-02-01"),
        imageUrl: "https://example.com/testfilm-2.jpg",
        stock: 0,
        runtime: 95,
      },
      {
        title: "Testfilmen 3",
        description: "En tredje testfilm för utveckling.",
        price: 199,
        releaseDate: new Date("2025-03-01"),
        imageUrl: "https://example.com/testfilm-3.jpg",
        stock: 2,
        runtime: 140,
      },
    ],
  });

  const movies = await prisma.movie.findMany();


  console.log("Antal filmer i databasen:", movies.length);
  console.log(movies);
  console.log("Seed klar!");
}
 
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
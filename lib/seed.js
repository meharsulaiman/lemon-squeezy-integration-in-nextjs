// lib/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: await bcrypt.hash("password123", 10),
      name: "John Doe",
    },
  });

  console.log("Created user:", user.email);

  // Create sample products
  const products = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      return prisma.product.create({
        data: {
          name: `Product ${i + 1}`,
          description: `This is a description for product ${i + 1}`,
          price: Math.floor(Math.random() * 1000),
          image: `https://picsum.photos/id/${i + 10}/400/300`,
        },
      });
    })
  );

  console.log(`Created ${products.length} products`);

  // Create a cart for the user
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

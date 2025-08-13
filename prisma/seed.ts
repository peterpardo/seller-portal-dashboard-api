import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const salt = await genSalt(10);
  const adminPassword = await hash("admin123", salt);
  const sellerOnePassword = await hash("seller123", salt);
  const sellerTwoPassword = await hash("seller123", salt);

  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const seller1 = await prisma.user.create({
    data: {
      email: "seller1@test.com",
      password: sellerOnePassword,
      name: "Seller One",
      role: "SELLER",
      store: {
        create: {
          name: "Seller One's Store",
          slug: "seller-one",
          products: {
            create: [
              {
                name: "Product A1",
                description: "Description for Product A1",
                price: 99.99,
                sku: "SELLER-A1",
                quantity: 20,
                status: "ACTIVE",
              },
              {
                name: "Product A2",
                description: "Description for Product A2",
                price: 49.5,
                sku: "SELLER-A2",
                quantity: 10,
                status: "ACTIVE",
              },
            ],
          },
        },
      },
    },
    include: { store: { include: { products: true } } },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: "seller2@test.com",
      password: sellerTwoPassword,
      name: "Seller Two",
      role: "SELLER",
      store: {
        create: {
          name: "Seller Two's Store",
          slug: "seller-two",
          products: {
            create: [
              {
                name: "Product B1",
                description: "Description for Product B1",
                price: 129.0,
                sku: "SELLER2-B1",
                quantity: 5,
                status: "ACTIVE",
              },
              {
                name: "Product B2",
                description: "Description for Product B2",
                price: 15.75,
                sku: "SELLER2-B2",
                quantity: 30,
                status: "ACTIVE",
              },
            ],
          },
        },
      },
    },
    include: { store: { include: { products: true } } },
  });

  console.log("✅ Admin:", { id: admin.id, email: admin.email });
  console.log("✅ Seller1:", {
    id: seller1.id,
    email: seller1.email,
    store: seller1.store?.id,
  });
  console.log("✅ Seller2:", {
    id: seller2.id,
    email: seller2.email,
    store: seller2.store?.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

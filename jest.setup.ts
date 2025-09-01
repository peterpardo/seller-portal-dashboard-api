import dotenv from "dotenv";
import { prisma, truncateAll } from "./tests/utils/prismaTestUtils";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

// OPTION 1: Truncate once for speed
beforeAll(async () => {
  await truncateAll();
});

// OPTION 2: Reset before every test for isolation
// beforeEach(async () => {
//   await resetDatabase();
// });

afterAll(async () => {
  await prisma.$disconnect();
});

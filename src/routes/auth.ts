import { Router } from "express";
import { prisma } from "../lib/prisma";
import { genSalt, hash } from "bcryptjs";
import { generateSlug, generateUniqueStoreSlug } from "../utils/slug";

const router = Router();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string);

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const SELLER_ROLE = "SELLER";
      const salt = await genSalt(SALT_ROUNDS);
      const hashedPassword = await hash(password, salt);
      const slug = await generateUniqueStoreSlug(tx, name);
      const userRole = role || SELLER_ROLE;
      const store =
        userRole === SELLER_ROLE
          ? {
              create: {
                name: `${name}'s Store`,
                slug,
              },
            }
          : undefined;

      return await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: userRole,
          store,
        },
        include: { store: true },
      });
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../lib/prisma";
import { compare, genSalt, hash } from "bcryptjs";
import { generateUniqueStoreSlug } from "../utils/slug";
import jwt from "jsonwebtoken";

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
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { store: true },
    });

    // check if email exists
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // validate password
    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    // generate access token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

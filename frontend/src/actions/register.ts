"use server";

import bcrypt from "bcryptjs";
import { db } from "@/db";
import { user as userTable, account as accountTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Missing required fields" };
  }

  try {
    // Check if user exists
    const existingUser = await db.query.user.findFirst({
      where: eq(userTable.email, email),
    });

    if (existingUser) {
      const credentialAccount = await db.query.account.findFirst({
        where: and(
          eq(accountTable.userId, existingUser.id),
          eq(accountTable.providerId, "credential")
        ),
      });

      if (!credentialAccount || !credentialAccount.password) {
        return { error: "Account exists. Please sign in with Google." };
      }

      return { error: "Email already in use" };
    }

    // Hash and Insert into user and account tables (Better Auth format)
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(userTable).values({
      id: userId,
      name,
      email,
      emailVerified: false,
    });

    await db.insert(accountTable).values({
      id: uuidv4(),
      userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create account" };
  }
}


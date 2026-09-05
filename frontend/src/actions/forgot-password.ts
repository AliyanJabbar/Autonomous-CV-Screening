"use server";

import { db } from "@/db";
import { user as userTable, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";

export const resetPassword = async (formData: FormData) => {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  // 1. Check if user exists
  const existingUser = await db.query.user.findFirst({
    where: eq(userTable.email, email),
  });

  if (!existingUser) {
    return { error: "your email does not exist on this website." };
  }

  // 2. Generate Token
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  // 3. Delete existing verification tokens for this identifier (email)
  await db
    .delete(verification)
    .where(eq(verification.identifier, email));

  // 4. Insert new verification token
  await db.insert(verification).values({
    id: uuidv4(),
    identifier: email,
    value: token,
    expiresAt,
  });

  // 5. Send Email
  try {
    await sendPasswordResetEmail(email, token);
    return { success: "If an account exists, a reset email has been sent." };
  } catch (error) {
    return { error: "Failed to send email currently" };
  }
};


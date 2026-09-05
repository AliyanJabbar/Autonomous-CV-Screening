"use server";

import { db } from "@/db";
import { user as userTable, account as accountTable, verification } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface UpdatePasswordResponse {
  success?: string;
  error?: string;
}

export async function updatePassword(formData: FormData): Promise<UpdatePasswordResponse> {
  const token = formData.get("token") as string | null;
  const newPassword = formData.get("password") as string | null;

  if (!token || !newPassword) return { error: "Invalid request." };

  const tokenRecord = await db.query.verification.findFirst({
    where: eq(verification.value, token),
  });

  if (!tokenRecord) return { error: "Invalid or expired token." };
  if (tokenRecord.expiresAt < new Date()) return { error: "Reset link has expired." };

  const existingUser = await db.query.user.findFirst({
    where: eq(userTable.email, tokenRecord.identifier),
  });

  if (!existingUser) return { error: "User not found." };

  const hashed = await bcrypt.hash(newPassword, 10);

  // Check if account record exists for credentials
  const existingAccount = await db.query.account.findFirst({
    where: and(
      eq(accountTable.userId, existingUser.id),
      eq(accountTable.providerId, "credential")
    ),
  });

  if (existingAccount) {
    await db
      .update(accountTable)
      .set({ password: hashed, updatedAt: new Date() })
      .where(eq(accountTable.id, existingAccount.id));
  } else {
    // Create credential account record
    await db.insert(accountTable).values({
      id: uuidv4(),
      userId: existingUser.id,
      accountId: existingUser.id,
      providerId: "credential",
      password: hashed,
    });
  }

  await db.delete(verification).where(eq(verification.id, tokenRecord.id));

  return { success: "Password has been reset successfully!" };
}


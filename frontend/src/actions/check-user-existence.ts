"use server";

import { db } from "@/db";
import { user as userTable, account as accountTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function checkEmailStatus(email: string) {
  const existingUser = await db.query.user.findFirst({
    where: eq(userTable.email, email),
  });

  if (existingUser) {
    // Check if user has a password in the account table
    const credentialAccount = await db.query.account.findFirst({
      where: and(
        eq(accountTable.userId, existingUser.id),
        eq(accountTable.providerId, "credential")
      ),
    });

    if (!credentialAccount || !credentialAccount.password) {
      // User exists but has no credential password => Signed up with Google
      return { error: "Account exists. Please sign in with Google." };
    }
  }

  // Otherwise, safe to proceed with standard login attempt
  return { success: true };
}


#!/usr/bin/env tsx
/**
 * Generate a bcrypt hash for a password to use as ADMIN_PASSWORD_HASH in .env
 *
 * Usage:
 *   npx tsx scripts/hash-password.ts <password>
 *
 * Example:
 *   npx tsx scripts/hash-password.ts my-secret-password
 */

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  console.error("");
  console.error(
    "Copy the output hash into your .env file as ADMIN_PASSWORD_HASH."
  );
  process.exit(1);
}

const COST_FACTOR = 12;

bcrypt.hash(password, COST_FACTOR).then((hash) => {
  console.log(hash);
});

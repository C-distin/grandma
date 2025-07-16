import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Using fallback connection.")
  // Provide a fallback or mock connection for development
}

const client = databaseUrl ? postgres(databaseUrl) : null
export const db = drizzle(client, { schema })
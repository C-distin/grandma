import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const databaseUrl = process.env.DATABASE_URL as string

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Using fallback connection.")
}

const client = postgres(databaseUrl, { prepare: false })
export const db = drizzle({ client })

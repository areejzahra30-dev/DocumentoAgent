import { betterAuth } from "better-auth"
import { PostgresDialect } from "kysely"
import pg from "pg"

export const auth = betterAuth({
  database: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }),
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60,
  },
})

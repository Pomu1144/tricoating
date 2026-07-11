import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  createSession,
  requireDb,
  sessionCookie,
  verifyPassword,
} from "../../../lib/auth.server";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(200),
});

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const db = requireDb();
        if (!db) {
          return Response.json(
            { ok: false, error: "Accounts are temporarily unavailable." },
            { status: 503 },
          );
        }
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Enter your email and password." },
            { status: 400 },
          );
        }
        const { email, password } = parsed.data;

        const row = await db
          .prepare(
            "SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ?",
          )
          .bind(email)
          .first<{
            id: string;
            email: string;
            password_hash: string;
            first_name: string;
            last_name: string;
          }>();

        const valid = row ? await verifyPassword(password, row.password_hash) : false;
        if (!row || !valid) {
          return Response.json(
            { ok: false, error: "Email or password is incorrect." },
            { status: 401 },
          );
        }

        const token = await createSession(db, row.id);
        return Response.json(
          {
            ok: true,
            user: {
              id: row.id,
              email: row.email,
              firstName: row.first_name,
              lastName: row.last_name,
            },
          },
          { headers: { "set-cookie": sessionCookie(token), "cache-control": "no-store" } },
        );
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  createSession,
  hashPassword,
  requireDb,
  sessionCookie,
} from "../../../lib/auth.server";

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(200),
});

export const Route = createFileRoute("/api/auth/register")({
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
            { ok: false, error: "Check your details: all fields are required and the password needs at least 8 characters." },
            { status: 400 },
          );
        }
        const { firstName, lastName, email, password } = parsed.data;

        const existing = await db
          .prepare("SELECT id FROM users WHERE email = ?")
          .bind(email)
          .first();
        if (existing) {
          return Response.json(
            { ok: false, error: "An account with this email already exists. Sign in instead." },
            { status: 409 },
          );
        }

        const id = crypto.randomUUID();
        const passwordHash = await hashPassword(password);
        await db
          .prepare(
            "INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
          )
          .bind(id, email, passwordHash, firstName, lastName)
          .run();

        const token = await createSession(db, id);
        return Response.json(
          { ok: true, user: { id, email, firstName, lastName } },
          {
            status: 201,
            headers: { "set-cookie": sessionCookie(token), "cache-control": "no-store" },
          },
        );
      },
    },
  },
});

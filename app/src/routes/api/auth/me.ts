import { createFileRoute } from "@tanstack/react-router";
import { getUserByRequest } from "../../../lib/auth.server";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getUserByRequest(request);
        if (!user) {
          return Response.json(
            { ok: false },
            { status: 401, headers: { "cache-control": "no-store" } },
          );
        }
        return Response.json(
          { ok: true, user },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});

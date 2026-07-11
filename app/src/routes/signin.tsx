import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { notifyAuthChange } from "../lib/use-auth";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In | Triangle Coatings Inc." },
      {
        name: "description",
        content:
          "Sign in to your Triangle Coatings account, or create one. Qualified discounts are applied to your order after you sign in.",
      },
    ],
  }),
  component: SignInPage,
});

type Mode = "signin" | "register";

function SignInPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(mode === "signin" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          mode === "signin" ? { email: form.email, password: form.password } : form,
        ),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
        return;
      }
      notifyAuthChange();
      void navigate({ to: "/account" });
    } catch {
      setError("Network problem. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type: string,
    autoComplete: string,
  ) => (
    <label className="block">
      <span className="mb-1 block font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
        {label} <span className="text-tc-red">*</span>
      </span>
      <input
        type={type}
        required
        autoComplete={autoComplete}
        value={form[key]}
        onChange={set(key)}
        className="w-full border border-tc-line bg-tc-ink px-3 py-2.5 text-sm text-tc-bone outline-none transition-colors focus:border-tc-red"
      />
    </label>
  );

  return (
    <div className="tc-site min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-[520px] px-5 pb-24 pt-32 md:px-8">
        <h1 className="font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-5xl">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-tc-mute">
          Any discounts you qualify for, including Artist Oils volume
          discounts, are applied to your order requests after you sign in.
        </p>

        <div className="mt-8 flex border border-tc-line">
          {(["signin", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 py-2.5 font-tc-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                mode === m ? "bg-tc-red text-tc-bone" : "text-tc-mute hover:text-tc-bone"
              }`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {field("First name", "firstName", "text", "given-name")}
              {field("Last name", "lastName", "text", "family-name")}
            </div>
          ) : null}
          {field("Email", "email", "email", "email")}
          {field(
            "Password",
            "password",
            "password",
            mode === "signin" ? "current-password" : "new-password",
          )}
          {mode === "register" ? (
            <p className="font-tc-mono text-[11px] text-tc-mute">At least 8 characters.</p>
          ) : null}

          {error ? (
            <p className="border border-tc-red/50 bg-tc-red/10 px-3 py-2 font-tc-mono text-[11px] text-tc-red">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="group relative w-full overflow-hidden bg-tc-red py-3.5 font-tc-mono text-[12px] uppercase tracking-[0.18em] text-tc-bone transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            <span className="absolute inset-0 -skew-x-12 -translate-x-full bg-tc-red-deep transition-transform duration-500 group-hover:translate-x-0" />
            <span className="relative">
              {busy ? "Working" : mode === "signin" ? "Sign in" : "Create account"}
            </span>
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

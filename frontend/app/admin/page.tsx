"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminConsole } from "@/components/admin/admin-console";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clearSession = useCallback((message = "") => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_expires_at");
    setToken("");
    setRole("editor");
    setError(message);
  }, []);

  const revokeAndClear = useCallback(
    async (message = "") => {
      const storedToken = sessionStorage.getItem("admin_token") ?? "";
      try {
        if (storedToken) {
          await fetch(`${API_URL}/admin/logout`, {
            method: "POST",
            headers: { Accept: "application/json", Authorization: `Bearer ${storedToken}` },
          });
        }
      } finally {
        clearSession(message);
      }
    },
    [clearSession],
  );

  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin_token") ?? "";
    const expiresAt = sessionStorage.getItem("admin_expires_at");
    if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
      clearSession("Your eight-hour admin session has expired. Please sign in again.");
      setReady(true);
      return;
    }
    if (!storedToken) {
      setReady(true);
      return;
    }
    fetch(`${API_URL}/admin/me`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${storedToken}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const payload = await response.json();
        setRole(payload.user.role);
        setToken(storedToken);
      })
      .catch(() => clearSession("Your admin session has expired. Please sign in again."))
      .finally(() => setReady(true));
  }, [clearSession]);

  useEffect(() => {
    const handleExpired = () => clearSession("Your admin session has expired. Please sign in again.");
    window.addEventListener("admin-auth-expired", handleExpired);
    return () => window.removeEventListener("admin-auth-expired", handleExpired);
  }, [clearSession]);

  useEffect(() => {
    if (!token) return;

    let idleTimer = window.setTimeout(() => undefined, IDLE_TIMEOUT_MS);
    let lastHeartbeat = Date.now();
    const expireForInactivity = () => {
      void revokeAndClear("You were signed out after 30 minutes of inactivity.");
    };
    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(expireForInactivity, IDLE_TIMEOUT_MS);
      if (Date.now() - lastHeartbeat >= HEARTBEAT_INTERVAL_MS) {
        lastHeartbeat = Date.now();
        fetch(`${API_URL}/admin/me`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        }).then((response) => {
          if (response.status === 401) clearSession("Your admin session has expired. Please sign in again.");
        });
      }
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    const expiresAt = sessionStorage.getItem("admin_expires_at");
    const absoluteTimer = expiresAt
      ? window.setTimeout(
          () => void revokeAndClear("Your eight-hour admin session has expired. Please sign in again."),
          Math.max(0, Date.parse(expiresAt) - Date.now()),
        )
      : undefined;

    return () => {
      window.clearTimeout(idleTimer);
      if (absoluteTimer !== undefined) window.clearTimeout(absoluteTimer);
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
    };
  }, [clearSession, revokeAndClear, token]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? "")
            .trim()
            .toLowerCase(),
          password: String(form.get("password") ?? ""),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Unable to sign in.");
      sessionStorage.setItem("admin_token", payload.token);
      sessionStorage.setItem("admin_expires_at", payload.expires_at);
      setRole(payload.user.role);
      setToken(payload.token);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  const logout = useCallback(() => {
    void revokeAndClear();
  }, [revokeAndClear]);

  if (!ready) return <div className="min-h-screen bg-slate-100 dark:bg-slate-950" />;
  if (token) return <AdminConsole token={token} role={role} onLogout={logout} />;

  return (
    <section
      aria-labelledby="admin-login-title"
      className="grid min-h-[calc(100vh-5rem)] place-items-center bg-slate-100 px-5 py-16 dark:bg-slate-950"
    >
      <form
        onSubmit={login}
        aria-describedby={error ? "admin-login-error" : undefined}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900"
      >
        <span
          aria-hidden="true"
          className="grid h-12 w-12 place-items-center rounded-xl bg-brand-teal-aa text-xl font-black text-white"
        >
          S
        </span>
        <h1
          id="admin-login-title"
          className="mt-6 font-display text-2xl font-bold text-slate-950 dark:text-white"
        >
          Admin sign in
        </h1>
        <p className="mt-2 text-sm">Manage website content, customers, media and live support.</p>
        <label htmlFor="admin-email" className="mt-7 block text-sm font-bold">
          Email
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="admin-input mt-2"
          />
        </label>
        <label htmlFor="admin-password" className="mt-4 block text-sm font-bold">
          Password
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="admin-input mt-2"
          />
        </label>
        {error && (
          <p
            id="admin-login-error"
            role="alert"
            className="mt-4 text-sm font-medium text-red-700 dark:text-red-300"
          >
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
          {submitting ? "Signing in…" : "Secure login"}
        </button>
      </form>
    </section>
  );
}

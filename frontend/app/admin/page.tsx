"use client";
import { useEffect, useState } from "react";
import { BarChart3, FileText, Inbox, LogOut, Plus, Users } from "lucide-react";
const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
type Stats = {
  content: Record<string, number>;
  enquiries: { total: number; new: number; this_month: number };
  recent: { id: number; name: string; kind: string; status: string; created_at: string }[];
};
export default function Admin() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const t = sessionStorage.getItem("admin_token") ?? "";
    setToken(t);
    if (t) load(t);
  }, []);
  async function load(t: string) {
    const r = await fetch(`${api}/admin/analytics`, {
      headers: { Authorization: `Bearer ${t}`, Accept: "application/json" },
    });
    if (r.ok) setStats(await r.json());
    else logout();
  }
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const d = new FormData(e.currentTarget);
    try {
      const r = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: String(d.get("email") ?? "")
            .trim()
            .toLowerCase(),
          password: String(d.get("password") ?? ""),
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.message ?? "Unable to sign in.");
        return;
      }
      sessionStorage.setItem("admin_token", j.token);
      setToken(j.token);
      load(j.token);
    } catch {
      setError("The API is unavailable. Confirm the Laravel server is running on port 8000.");
    }
  }
  function logout() {
    sessionStorage.removeItem("admin_token");
    setToken("");
    setStats(null);
  }
  if (!token)
    return (
      <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-slate-100 px-5 dark:bg-slate-950">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-teal text-xl font-black text-white">
            S
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-slate-950 dark:text-white">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm">Manage website content and enquiries.</p>
          <label className="mt-7 block text-sm font-bold">
            Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 dark:border-slate-700"
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 dark:border-slate-700"
            />
          </label>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
          <button className="btn-primary mt-6 w-full">Secure login</button>
        </form>
      </main>
    );
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="container-site py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Content management</p>
            <h1 className="heading text-3xl">Admin dashboard</h1>
          </div>
          <button onClick={logout} className="flex gap-2 text-sm font-bold">
            <LogOut size={17} /> Sign out
          </button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [Inbox, "New enquiries", stats?.enquiries.new ?? "—"],
            [BarChart3, "This month", stats?.enquiries.this_month ?? "—"],
            [
              FileText,
              "Published content",
              stats ? Object.values(stats.content).reduce((a, b) => a + b, 0) : "—",
            ],
          ].map(([Icon, l, v]) => {
            const I = Icon as typeof Inbox;
            return (
              <div className="card" key={l as string}>
                <I className="text-brand-teal" />
                <b className="mt-6 block text-3xl text-slate-950 dark:text-white">{v as number}</b>
                <span className="text-sm">{l as string}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_.5fr]">
          <section className="card overflow-x-auto">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Recent enquiries</h2>
            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="py-3">Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent.map((x) => (
                  <tr key={x.id} className="border-b last:border-0 dark:border-slate-800">
                    <td className="py-4 font-bold">{x.name}</td>
                    <td>{x.kind}</td>
                    <td>
                      <span className="rounded-full bg-teal-50 px-2 py-1 text-xs text-teal-700">
                        {x.status}
                      </span>
                    </td>
                    <td>{new Date(x.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <aside className="card">
            <h2 className="font-bold text-slate-950 dark:text-white">Content</h2>
            <div className="mt-5 space-y-3">
              {Object.entries(stats?.content ?? {}).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm capitalize dark:bg-slate-800"
                >
                  <span>{k}</span>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <button className="btn-primary mt-6 w-full">
              <Plus size={16} /> New content
            </button>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-bold">
              <Users size={16} /> Manage users
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

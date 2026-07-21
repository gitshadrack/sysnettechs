"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Database,
  Download,
  FileText,
  Image as ImageIcon,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
type Tab = "dashboard" | "chat" | "content" | "media" | "seo" | "users" | "backups";

async function api<T>(token: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    cache: "no-store",
  });
  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? "The request could not be completed.");
  return payload as T;
}

const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "dashboard", label: "Analytics", icon: BarChart3 },
  { id: "chat", label: "Live chat", icon: MessageSquare },
  { id: "content", label: "Content", icon: FileText },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "seo", label: "SEO", icon: Search },
  { id: "users", label: "Users", icon: Users },
  { id: "backups", label: "Backups", icon: Database },
];

export function AdminConsole({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <section aria-labelledby="admin-title" className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="container-site py-8">
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Secure administration</p>
            <h1 id="admin-title" className="heading text-3xl">Control centre</h1>
          </div>
          <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 text-sm font-bold">
            <LogOut aria-hidden="true" size={17} /> Sign out
          </button>
        </header>

        <nav aria-label="Administration modules" className="my-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                tab === id
                  ? "bg-brand-navy text-white"
                  : "bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              <Icon aria-hidden="true" size={17} /> {label}
            </button>
          ))}
        </nav>

        {tab === "dashboard" && <AnalyticsModule token={token} />}
        {tab === "chat" && <ChatModule token={token} />}
        {tab === "content" && <ContentModule token={token} />}
        {tab === "media" && <MediaModule token={token} />}
        {tab === "seo" && <SeoModule token={token} />}
        {tab === "users" && <UsersModule token={token} />}
        {tab === "backups" && <BackupsModule token={token} />}
      </div>
    </section>
  );
}

function ModuleHeader({ title, description }: { title: string; description: string }) {
  return <header className="mb-6"><h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{title}</h2><p className="mt-2 text-sm">{description}</p></header>;
}

function Notice({ message, error = false }: { message: string; error?: boolean }) {
  if (!message) return null;
  return <p role={error ? "alert" : "status"} className={`mb-5 rounded-xl p-3 text-sm font-medium ${error ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-100"}`}>{message}</p>;
}

type Analytics = {
  content: Record<string, number>;
  enquiries: { total: number; new: number; this_month: number };
  chats: { open: number; total: number };
  recent: { id: number; name: string; kind: string; status: string; created_at: string }[];
};

function AnalyticsModule({ token }: { token: string }) {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<Analytics>(token, "/admin/analytics").then(setData).catch((reason) => setError(reason.message)); }, [token]);
  return <section aria-labelledby="analytics-title"><ModuleHeader title="Analytics dashboard" description="A current overview of website content, enquiries, and support demand." /><Notice message={error} error />
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{[
      ["New enquiries", data?.enquiries.new ?? "—"],
      ["Enquiries this month", data?.enquiries.this_month ?? "—"],
      ["Open live chats", data?.chats.open ?? "—"],
      ["Published content", data ? Object.values(data.content).reduce((sum, count) => sum + count, 0) : "—"],
    ].map(([label, value]) => <article className="card" key={label}><b className="block text-3xl text-slate-950 dark:text-white">{value}</b><span className="mt-2 block text-sm">{label}</span></article>)}</div>
    <article className="card mt-7 overflow-x-auto"><h3 className="font-bold text-slate-950 dark:text-white">Recent enquiries</h3><table className="mt-5 w-full min-w-[600px] text-left text-sm"><caption className="sr-only">Recent website enquiries</caption><thead><tr className="border-b dark:border-slate-700"><th className="py-3">Name</th><th>Type</th><th>Status</th><th>Date</th></tr></thead><tbody>{data?.recent.map((item) => <tr key={item.id} className="border-b last:border-0 dark:border-slate-800"><td className="py-4 font-bold">{item.name}</td><td>{item.kind}</td><td>{item.status}</td><td>{new Date(item.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></article>
  </section>;
}

type AdminConversation = { id: number; visitor_name: string; visitor_email?: string; status: "open" | "pending" | "closed"; last_message_at: string; unread_count: number; messages?: AdminMessage[] };
type AdminMessage = { id: number; sender_type: "visitor" | "operator"; sender_name: string; body: string; created_at: string };

function ChatModule({ token }: { token: string }) {
  const [items, setItems] = useState<AdminConversation[]>([]);
  const [selected, setSelected] = useState<AdminConversation | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [error, setError] = useState("");
  const loadList = useCallback(async () => { const payload = await api<{ data: AdminConversation[] }>(token, "/admin/chats"); setItems(payload.data); setSelected((current) => current ?? payload.data[0] ?? null); }, [token]);
  const loadChat = useCallback(async (id: number) => { const payload = await api<{ conversation: AdminConversation; messages: AdminMessage[] }>(token, `/admin/chats/${id}`); setSelected(payload.conversation); setMessages(payload.messages); }, [token]);
  useEffect(() => { loadList().catch((reason) => setError(reason.message)); const timer = window.setInterval(() => loadList().catch(() => undefined), 5000); return () => clearInterval(timer); }, [loadList]);
  useEffect(() => { if (!selected?.id) return; loadChat(selected.id).catch((reason) => setError(reason.message)); const timer = window.setInterval(() => loadChat(selected.id).catch(() => undefined), 4000); return () => clearInterval(timer); }, [loadChat, selected?.id]);
  async function reply(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!selected) return; const form = event.currentTarget; const body = String(new FormData(form).get("message") ?? "").trim(); if (!body) return; try { await api(token, `/admin/chats/${selected.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: body }) }); form.reset(); await loadChat(selected.id); await loadList(); } catch (reason) { setError((reason as Error).message); } }
  async function changeStatus(status: AdminConversation["status"]) { if (!selected) return; try { await api(token, `/admin/chats/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); await loadChat(selected.id); await loadList(); } catch (reason) { setError((reason as Error).message); } }
  return <section aria-labelledby="chat-admin-title"><ModuleHeader title="Live chat inbox" description="Read and reply to active website conversations. Updates arrive every few seconds." /><Notice message={error} error />
    <div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-slate-200 dark:border-slate-800 lg:border-b-0 lg:border-r"><h3 className="border-b p-4 font-bold dark:border-slate-800">Conversations</h3><div className="max-h-80 overflow-y-auto lg:max-h-[510px]">{items.length ? items.map((chat) => <button type="button" key={chat.id} onClick={() => setSelected(chat)} className={`block w-full border-b p-4 text-left dark:border-slate-800 ${selected?.id === chat.id ? "bg-teal-50 dark:bg-teal-950" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}><span className="flex items-center justify-between gap-3"><b>{chat.visitor_name}</b>{chat.unread_count > 0 && <span className="rounded-full bg-red-700 px-2 py-0.5 text-xs text-white">{chat.unread_count}</span>}</span><small className="mt-1 block capitalize">{chat.status} · {chat.last_message_at ? new Date(chat.last_message_at).toLocaleString() : "New"}</small></button>) : <p className="p-5 text-sm">No conversations yet.</p>}</div></aside>
      <section aria-label="Selected conversation" className="flex min-h-[500px] flex-col">{selected ? <><header className="flex flex-wrap items-center justify-between gap-3 border-b p-4 dark:border-slate-800"><div><h3 className="font-bold">{selected.visitor_name}</h3><p className="text-xs">{selected.visitor_email || "No email supplied"}</p></div><label className="text-xs font-bold">Status<select value={selected.status} onChange={(event) => changeStatus(event.target.value as AdminConversation["status"])} className="ml-2 rounded-lg border bg-transparent px-2 py-1.5 dark:border-slate-600"><option value="open">Open</option><option value="pending">Pending</option><option value="closed">Closed</option></select></label></header><div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950">{messages.map((message) => <article key={message.id} className={`max-w-[80%] rounded-2xl p-3 text-sm ${message.sender_type === "operator" ? "ml-auto bg-brand-navy text-white" : "bg-white shadow-sm dark:bg-slate-800"}`}><b className="text-xs">{message.sender_name}</b><p className="mt-1 whitespace-pre-wrap">{message.body}</p><time className="mt-1 block text-[10px] opacity-70" dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time></article>)}</div><form onSubmit={reply} className="flex gap-2 border-t p-4 dark:border-slate-800"><label htmlFor="admin-chat-reply" className="sr-only">Reply message</label><input id="admin-chat-reply" name="message" disabled={selected.status === "closed"} className="admin-input flex-1" placeholder={selected.status === "closed" ? "Reopen to reply" : "Write a reply…"} /><button type="submit" disabled={selected.status === "closed"} className="btn-primary px-4 disabled:opacity-50" aria-label="Send reply"><Send aria-hidden="true" size={17} /></button></form></> : <div className="grid flex-1 place-items-center p-8 text-sm">Select a conversation.</div>}</section>
    </div>
  </section>;
}

type ContentItem = { id: number; type: string; title: string; excerpt?: string; status: string; meta_title?: string; meta_description?: string };
function ContentModule({ token }: { token: string }) {
  const [items, setItems] = useState<ContentItem[]>([]); const [editing, setEditing] = useState<ContentItem | null>(null); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  const load = useCallback(() => api<{ data: ContentItem[] }>(token, "/admin/content").then((payload) => setItems(payload.data)), [token]); useEffect(() => { load().catch((reason) => setError(reason.message)); }, [load]);
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); try { await api(token, editing ? `/admin/content/${editing.id}` : "/admin/content", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); setNotice(editing ? "Content updated." : "Content created."); setEditing(null); form.reset(); await load(); } catch (reason) { setError((reason as Error).message); } }
  async function remove(item: ContentItem) { if (!confirm(`Delete “${item.title}”?`)) return; try { await api(token, `/admin/content/${item.id}`, { method: "DELETE" }); setNotice("Content deleted."); await load(); } catch (reason) { setError((reason as Error).message); } }
  return <section aria-labelledby="content-title"><ModuleHeader title="Content management" description="Create, publish, edit, and archive website content." /><Notice message={notice} /><Notice message={error} error /><div className="grid gap-7 xl:grid-cols-[.75fr_1.25fr]"><form key={editing?.id ?? "new"} onSubmit={save} className="card grid gap-4"><h3 className="font-bold text-slate-950 dark:text-white">{editing ? "Edit content" : "New content"}</h3><label className="admin-label">Type<select name="type" defaultValue={editing?.type ?? "posts"} className="admin-input mt-2"><option value="services">Service</option><option value="projects">Project</option><option value="products">Product</option><option value="posts">Blog post</option><option value="testimonials">Testimonial</option><option value="careers">Career</option><option value="faqs">FAQ</option></select></label><label className="admin-label">Title<input name="title" defaultValue={editing?.title} required maxLength={255} className="admin-input mt-2" /></label><label className="admin-label">Summary<textarea name="excerpt" defaultValue={editing?.excerpt} maxLength={1000} rows={4} className="admin-input mt-2" /></label><label className="admin-label">SEO title<input name="meta_title" defaultValue={editing?.meta_title} maxLength={70} className="admin-input mt-2" /></label><label className="admin-label">SEO description<textarea name="meta_description" defaultValue={editing?.meta_description} maxLength={170} rows={3} className="admin-input mt-2" /></label><label className="admin-label">Status<select name="status" defaultValue={editing?.status ?? "draft"} className="admin-input mt-2"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><div className="flex gap-2"><button type="submit" className="btn-primary">{editing ? "Save changes" : "Create content"}</button>{editing && <button type="button" onClick={() => setEditing(null)} className="rounded-full border px-5 py-3 text-sm font-bold">Cancel</button>}</div></form><article className="card overflow-x-auto"><h3 className="font-bold text-slate-950 dark:text-white">Content library</h3><table className="mt-5 w-full min-w-[620px] text-left text-sm"><caption className="sr-only">Managed website content</caption><thead><tr className="border-b dark:border-slate-700"><th className="py-3">Title</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b last:border-0 dark:border-slate-800"><td className="py-4 font-bold">{item.title}</td><td className="capitalize">{item.type}</td><td className="capitalize">{item.status}</td><td><div className="flex gap-2"><button type="button" onClick={() => setEditing(item)} className="font-bold text-brand-navy dark:text-teal-300">Edit</button><button type="button" onClick={() => remove(item)} className="font-bold text-red-700 dark:text-red-300">Delete</button></div></td></tr>)}</tbody></table></article></div></section>;
}

function MediaModule({ token }: { token: string }) {
  const [result, setResult] = useState<{ path: string; url: string } | null>(null); const [error, setError] = useState(""); const [uploading, setUploading] = useState(false);
  async function upload(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setUploading(true); setError(""); try { const data = new FormData(event.currentTarget); const payload = await api<{ path: string; url: string }>(token, "/admin/uploads", { method: "POST", body: data }); setResult(payload); event.currentTarget.reset(); } catch (reason) { setError((reason as Error).message); } finally { setUploading(false); } }
  return <section aria-labelledby="media-title"><ModuleHeader title="Image uploads" description="Upload optimized website imagery up to 5 MB in JPG, PNG, WebP, or AVIF format." /><Notice message={error} error /><div className="grid gap-7 lg:grid-cols-2"><form onSubmit={upload} className="card"><label className="admin-label" htmlFor="media-image">Select image<input id="media-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className="mt-3 block w-full rounded-xl border border-dashed border-slate-400 p-5 text-sm" /></label><button type="submit" disabled={uploading} className="btn-primary mt-5 disabled:opacity-60">{uploading ? "Uploading…" : "Upload image"}</button></form>{result && <article className="card"><h3 className="font-bold text-slate-950 dark:text-white">Upload complete</h3><img src={result.url} alt="Preview of the newly uploaded website asset" className="mt-4 max-h-64 w-full rounded-xl object-contain" /><label className="admin-label mt-4">Stored path<input readOnly value={result.path} className="admin-input mt-2" onFocus={(event) => event.currentTarget.select()} /></label></article>}</div></section>;
}

type SeoSettings = { site_title: string; meta_description: string; og_image?: string; google_analytics_id?: string; facebook_url?: string; instagram_url?: string; linkedin_url?: string };
function SeoModule({ token }: { token: string }) {
  const [settings, setSettings] = useState<SeoSettings | null>(null); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  useEffect(() => { api<SeoSettings>(token, "/admin/seo-settings").then(setSettings).catch((reason) => setError(reason.message)); }, [token]);
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); try { const data = Object.fromEntries(new FormData(event.currentTarget)); const payload = await api<SeoSettings>(token, "/admin/seo-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); setSettings(payload); setNotice("SEO settings saved."); } catch (reason) { setError((reason as Error).message); } }
  return <section aria-labelledby="seo-title"><ModuleHeader title="SEO settings" description="Manage global search and social-sharing defaults. Page-specific metadata remains attached to each content item." /><Notice message={notice} /><Notice message={error} error />{settings && <form onSubmit={save} className="card grid max-w-3xl gap-5"><label className="admin-label">Site title <span className="font-normal">(maximum 70 characters)</span><input name="site_title" defaultValue={settings.site_title} maxLength={70} required className="admin-input mt-2" /></label><label className="admin-label">Meta description <span className="font-normal">(maximum 170 characters)</span><textarea name="meta_description" defaultValue={settings.meta_description} maxLength={170} required rows={4} className="admin-input mt-2" /></label><label className="admin-label">Open Graph image path<input name="og_image" defaultValue={settings.og_image} className="admin-input mt-2" /></label><label className="admin-label">Google Analytics measurement ID<input name="google_analytics_id" defaultValue={settings.google_analytics_id} placeholder="G-XXXXXXXXXX" className="admin-input mt-2" /></label>{["facebook_url", "instagram_url", "linkedin_url"].map((key) => <label key={key} className="admin-label capitalize">{key.replace("_", " ")}<input name={key} type="url" defaultValue={settings[key as keyof SeoSettings]} className="admin-input mt-2" /></label>)}<button type="submit" className="btn-primary w-fit">Save SEO settings</button></form>}</section>;
}

type AdminUser = { id: number; name: string; email: string; role: string; created_at: string };
function UsersModule({ token }: { token: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]); const [notice, setNotice] = useState(""); const [error, setError] = useState(""); const load = useCallback(() => api<{ data: AdminUser[] }>(token, "/admin/users").then((payload) => setUsers(payload.data)), [token]); useEffect(() => { load().catch((reason) => setError(reason.message)); }, [load]);
  async function create(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; try { await api(token, "/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); setNotice("User created."); await load(); } catch (reason) { setError((reason as Error).message); } }
  async function remove(user: AdminUser) { if (!confirm(`Delete ${user.name}?`)) return; try { await api(token, `/admin/users/${user.id}`, { method: "DELETE" }); setNotice("User deleted."); await load(); } catch (reason) { setError((reason as Error).message); } }
  return <section aria-labelledby="users-title"><ModuleHeader title="User management" description="Create administrators and editors. Passwords require at least 12 characters." /><Notice message={notice} /><Notice message={error} error /><div className="grid gap-7 lg:grid-cols-[.7fr_1.3fr]"><form onSubmit={create} className="card grid gap-4"><h3 className="font-bold text-slate-950 dark:text-white">New user</h3><label className="admin-label">Name<input name="name" required className="admin-input mt-2" /></label><label className="admin-label">Email<input name="email" type="email" required className="admin-input mt-2" /></label><label className="admin-label">Password<input name="password" type="password" minLength={12} autoComplete="new-password" required className="admin-input mt-2" /></label><label className="admin-label">Role<select name="role" defaultValue="editor" className="admin-input mt-2"><option value="editor">Editor</option><option value="admin">Administrator</option></select></label><button type="submit" className="btn-primary">Create user</button></form><article className="card overflow-x-auto"><h3 className="font-bold text-slate-950 dark:text-white">Authorised users</h3><table className="mt-5 w-full min-w-[560px] text-left text-sm"><caption className="sr-only">Administration users</caption><thead><tr className="border-b dark:border-slate-700"><th className="py-3">Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b last:border-0 dark:border-slate-800"><td className="py-4 font-bold">{user.name}</td><td>{user.email}</td><td className="capitalize">{user.role}</td><td><button type="button" onClick={() => remove(user)} aria-label={`Delete ${user.name}`} className="text-red-700 dark:text-red-300"><Trash2 aria-hidden="true" size={17} /></button></td></tr>)}</tbody></table></article></div></section>;
}

type Backup = { name: string; size: number; created_at: string };
function BackupsModule({ token }: { token: string }) {
  const [items, setItems] = useState<Backup[]>([]); const [notice, setNotice] = useState(""); const [error, setError] = useState(""); const [creating, setCreating] = useState(false); const load = useCallback(() => api<Backup[]>(token, "/admin/backups").then(setItems), [token]); useEffect(() => { load().catch((reason) => setError(reason.message)); }, [load]);
  async function create() { setCreating(true); try { await api(token, "/admin/backups", { method: "POST" }); setNotice("Private data backup created."); await load(); } catch (reason) { setError((reason as Error).message); } finally { setCreating(false); } }
  async function download(file: string) { try { const response = await fetch(`${API_URL}/admin/backups/${encodeURIComponent(file)}`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error("Backup download failed."); const url = URL.createObjectURL(await response.blob()); const anchor = document.createElement("a"); anchor.href = url; anchor.download = file; anchor.click(); URL.revokeObjectURL(url); } catch (reason) { setError((reason as Error).message); } }
  return <section aria-labelledby="backups-title"><ModuleHeader title="Backup management" description="Create and securely download private JSON snapshots of application data." /><Notice message={notice} /><Notice message={error} error /><button type="button" onClick={create} disabled={creating} className="btn-primary mb-6 disabled:opacity-60"><RefreshCw aria-hidden="true" size={17} className={creating ? "animate-spin" : ""} />{creating ? "Creating backup…" : "Create backup now"}</button><article className="card overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><caption className="sr-only">Available private backups</caption><thead><tr className="border-b dark:border-slate-700"><th className="py-3">File</th><th>Size</th><th>Created</th><th>Download</th></tr></thead><tbody>{items.map((item) => <tr key={item.name} className="border-b last:border-0 dark:border-slate-800"><td className="py-4 font-mono text-xs">{item.name}</td><td>{Math.max(1, Math.round(item.size / 1024))} KB</td><td>{new Date(item.created_at).toLocaleString()}</td><td><button type="button" onClick={() => download(item.name)} aria-label={`Download ${item.name}`} className="text-brand-navy dark:text-teal-300"><Download aria-hidden="true" size={18} /></button></td></tr>)}</tbody></table>{!items.length && <p className="py-5 text-sm">No backups created yet.</p>}</article></section>;
}

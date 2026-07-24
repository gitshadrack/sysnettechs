"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
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
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
type Tab = "dashboard" | "orders" | "chat" | "content" | "media" | "seo" | "users" | "backups";

async function api<T>(token: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    cache: "no-store",
  });
  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-auth-expired"));
  }
  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? "The request could not be completed.");
  return payload as T;
}

function publicImageUrl(image: string) {
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL.replace(/\/api\/?$/, "")}/${image.replace(/^\//, "")}`;
}

const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "dashboard", label: "Analytics", icon: BarChart3 },
  { id: "orders", label: "Store", icon: ShoppingBag },
  { id: "chat", label: "Live chat", icon: MessageSquare },
  { id: "content", label: "Content", icon: FileText },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "seo", label: "SEO", icon: Search },
  { id: "users", label: "Users", icon: Users },
  { id: "backups", label: "Backups", icon: Database },
];

export function AdminConsole({
  token,
  role,
  onLogout,
}: {
  token: string;
  role: "admin" | "editor";
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <section aria-labelledby="admin-title" className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="container-site py-8">
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Secure administration</p>
            <h1 id="admin-title" className="heading text-3xl">
              Control centre
            </h1>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-sm font-bold"
          >
            <LogOut aria-hidden="true" size={17} /> Sign out
          </button>
        </header>

        <nav aria-label="Administration modules" className="my-6 flex gap-2 overflow-x-auto pb-2">
          {tabs
            .filter(({ id }) => role === "admin" || !["users", "backups"].includes(id))
            .map(({ id, label, icon: Icon }) => (
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
        {tab === "orders" && <OrdersModule token={token} />}
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
  return (
    <header className="mb-6">
      <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm">{description}</p>
    </header>
  );
}

function Notice({ message, error = false }: { message: string; error?: boolean }) {
  if (!message) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`mb-5 rounded-xl p-3 text-sm font-medium ${error ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-100"}`}
    >
      {message}
    </p>
  );
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
  useEffect(() => {
    api<Analytics>(token, "/admin/analytics")
      .then(setData)
      .catch((reason) => setError(reason.message));
  }, [token]);
  return (
    <section aria-labelledby="analytics-title">
      <ModuleHeader
        title="Analytics dashboard"
        description="A current overview of website content, enquiries, and support demand."
      />
      <Notice message={error} error />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["New enquiries", data?.enquiries.new ?? "—"],
          ["Enquiries this month", data?.enquiries.this_month ?? "—"],
          ["Open live chats", data?.chats.open ?? "—"],
          [
            "Published content",
            data ? Object.values(data.content).reduce((sum, count) => sum + count, 0) : "—",
          ],
        ].map(([label, value]) => (
          <article className="card" key={label}>
            <b className="block text-3xl text-slate-950 dark:text-white">{value}</b>
            <span className="mt-2 block text-sm">{label}</span>
          </article>
        ))}
      </div>
      <article className="card mt-7 overflow-x-auto">
        <h3 className="font-bold text-slate-950 dark:text-white">Recent enquiries</h3>
        <table className="mt-5 w-full min-w-[600px] text-left text-sm">
          <caption className="sr-only">Recent website enquiries</caption>
          <thead>
            <tr className="border-b dark:border-slate-700">
              <th className="py-3">Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.recent.map((item) => (
              <tr key={item.id} className="border-b last:border-0 dark:border-slate-800">
                <td className="py-4 font-bold">{item.name}</td>
                <td>{item.kind}</td>
                <td>{item.status}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}

type AdminConversation = {
  id: number;
  visitor_name: string;
  visitor_email?: string;
  status: "open" | "pending" | "closed";
  last_message_at: string;
  unread_count: number;
  messages?: AdminMessage[];
};
type AdminMessage = {
  id: number;
  sender_type: "visitor" | "operator";
  sender_name: string;
  body: string;
  created_at: string;
};

function ChatModule({ token }: { token: string }) {
  const [items, setItems] = useState<AdminConversation[]>([]);
  const [selected, setSelected] = useState<AdminConversation | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [error, setError] = useState("");
  const loadList = useCallback(async () => {
    const payload = await api<{ data: AdminConversation[] }>(token, "/admin/chats");
    setItems(payload.data);
    setSelected((current) => current ?? payload.data[0] ?? null);
  }, [token]);
  const loadChat = useCallback(
    async (id: number) => {
      const payload = await api<{ conversation: AdminConversation; messages: AdminMessage[] }>(
        token,
        `/admin/chats/${id}`,
      );
      setSelected(payload.conversation);
      setMessages(payload.messages);
    },
    [token],
  );
  useEffect(() => {
    loadList().catch((reason) => setError(reason.message));
    const timer = window.setInterval(() => loadList().catch(() => undefined), 5000);
    return () => clearInterval(timer);
  }, [loadList]);
  useEffect(() => {
    if (!selected?.id) return;
    loadChat(selected.id).catch((reason) => setError(reason.message));
    const timer = window.setInterval(() => loadChat(selected.id).catch(() => undefined), 4000);
    return () => clearInterval(timer);
  }, [loadChat, selected?.id]);
  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const body = String(new FormData(form).get("message") ?? "").trim();
    if (!body) return;
    try {
      await api(token, `/admin/chats/${selected.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body }),
      });
      form.reset();
      await loadChat(selected.id);
      await loadList();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  async function changeStatus(status: AdminConversation["status"]) {
    if (!selected) return;
    try {
      await api(token, `/admin/chats/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadChat(selected.id);
      await loadList();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <section aria-labelledby="chat-admin-title">
      <ModuleHeader
        title="Live chat inbox"
        description="Read and reply to active website conversations. Updates arrive every few seconds."
      />
      <Notice message={error} error />
      <div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-slate-200 dark:border-slate-800 lg:border-b-0 lg:border-r">
          <h3 className="border-b p-4 font-bold dark:border-slate-800">Conversations</h3>
          <div className="max-h-80 overflow-y-auto lg:max-h-[510px]">
            {items.length ? (
              items.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => setSelected(chat)}
                  className={`block w-full border-b p-4 text-left dark:border-slate-800 ${selected?.id === chat.id ? "bg-teal-50 dark:bg-teal-950" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <b>{chat.visitor_name}</b>
                    {chat.unread_count > 0 && (
                      <span className="rounded-full bg-red-700 px-2 py-0.5 text-xs text-white">
                        {chat.unread_count}
                      </span>
                    )}
                  </span>
                  <small className="mt-1 block capitalize">
                    {chat.status} ·{" "}
                    {chat.last_message_at ? new Date(chat.last_message_at).toLocaleString() : "New"}
                  </small>
                </button>
              ))
            ) : (
              <p className="p-5 text-sm">No conversations yet.</p>
            )}
          </div>
        </aside>
        <section aria-label="Selected conversation" className="flex min-h-[500px] flex-col">
          {selected ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4 dark:border-slate-800">
                <div>
                  <h3 className="font-bold">{selected.visitor_name}</h3>
                  <p className="text-xs">{selected.visitor_email || "No email supplied"}</p>
                </div>
                <label className="text-xs font-bold">
                  Status
                  <select
                    value={selected.status}
                    onChange={(event) => changeStatus(event.target.value as AdminConversation["status"])}
                    className="ml-2 rounded-lg border bg-transparent px-2 py-1.5 dark:border-slate-600"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </header>
              <div
                role="log"
                aria-live="polite"
                className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950"
              >
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`max-w-[80%] rounded-2xl p-3 text-sm ${message.sender_type === "operator" ? "ml-auto bg-brand-navy text-white" : "bg-white shadow-sm dark:bg-slate-800"}`}
                  >
                    <b className="text-xs">{message.sender_name}</b>
                    <p className="mt-1 whitespace-pre-wrap">{message.body}</p>
                    <time className="mt-1 block text-[10px] opacity-70" dateTime={message.created_at}>
                      {new Date(message.created_at).toLocaleString()}
                    </time>
                  </article>
                ))}
              </div>
              <form onSubmit={reply} className="flex gap-2 border-t p-4 dark:border-slate-800">
                <label htmlFor="admin-chat-reply" className="sr-only">
                  Reply message
                </label>
                <input
                  id="admin-chat-reply"
                  name="message"
                  disabled={selected.status === "closed"}
                  className="admin-input flex-1"
                  placeholder={selected.status === "closed" ? "Reopen to reply" : "Write a reply…"}
                />
                <button
                  type="submit"
                  disabled={selected.status === "closed"}
                  className="btn-primary px-4 disabled:opacity-50"
                  aria-label="Send reply"
                >
                  <Send aria-hidden="true" size={17} />
                </button>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-sm">Select a conversation.</div>
          )}
        </section>
      </div>
    </section>
  );
}

type ContentItem = {
  id: number;
  type: string;
  title: string;
  excerpt?: string;
  body?: string;
  status: string;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  data?: {
    employment_type?: string;
    location?: string;
    category?: string;
    capabilities?: string[];
    featured?: boolean;
    client?: string;
    download_path?: string;
    download_name?: string;
  };
};
function ContentModule({ token }: { token: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [contentType, setContentType] = useState("careers");
  const [contentFilter, setContentFilter] = useState("careers");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<HTMLFormElement>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await api<{ data: ContentItem[] }>(token, "/admin/content");
      setItems(payload.data);
      setError("");
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, [load]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const type = String(formData.get("type") ?? "posts");
    const data: Record<string, unknown> = {
      type,
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      body: formData.get("body"),
      meta_title: formData.get("meta_title"),
      meta_description: formData.get("meta_description"),
      status: formData.get("status"),
      sort_order: Number(formData.get("sort_order") ?? 0),
    };
    if (type === "careers") {
      data.data = {
        employment_type: formData.get("career_employment_type"),
        location: formData.get("career_location"),
      };
    } else if (type === "services") {
      data.data = {
        category: formData.get("service_category"),
        capabilities: String(formData.get("service_capabilities") ?? "")
          .split("\n")
          .map((capability) => capability.trim())
          .filter(Boolean),
        featured: formData.get("service_featured") === "on",
      };
    } else if (type === "projects") {
      let downloadPath = editing?.data?.download_path;
      let downloadName = editing?.data?.download_name;
      const file = formData.get("project_file");

      if (file instanceof File && file.size > 0) {
        try {
          const uploadData = new FormData();
          uploadData.set("file", file);
          const upload = await api<{ path: string; name: string }>(token, "/admin/uploads/portfolio", {
            method: "POST",
            body: uploadData,
          });
          downloadPath = upload.path;
          downloadName = upload.name;
        } catch (reason) {
          setError((reason as Error).message);
          return;
        }
      }
      if (formData.get("remove_project_file") === "on") {
        downloadPath = undefined;
        downloadName = undefined;
      }
      data.data = {
        client: formData.get("project_client"),
        category: formData.get("project_category"),
        download_path: downloadPath,
        download_name: downloadName,
      };
    } else if (type === "posts") {
      data.data = {
        category: formData.get("blog_category"),
      };
    }
    try {
      await api(token, editing ? `/admin/content/${editing.id}` : "/admin/content", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setNotice(editing ? "Content updated." : "Content created.");
      setEditing(null);
      setContentType(contentFilter === "all" ? "posts" : contentFilter);
      form.reset();
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  async function remove(item: ContentItem) {
    if (!confirm(`Delete “${item.title}”?`)) return;
    try {
      await api(token, `/admin/content/${item.id}`, { method: "DELETE" });
      setNotice("Content deleted.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  const filteredContentItems =
    contentFilter === "all" ? items : items.filter((item) => item.type === contentFilter);
  const contentSections = [
    ["careers", "Careers"],
    ["services", "Services"],
    ["projects", "Portfolio"],
    ["posts", "Blog"],
    ["testimonials", "Testimonials"],
    ["team", "Team"],
    ["faqs", "FAQs"],
    ["all", "All content"],
  ];
  const activeSectionLabel = contentSections.find(([value]) => value === contentFilter)?.[1] ?? "Content";
  const sectionCount = (type: string) =>
    type === "all" ? items.length : items.filter((item) => item.type === type).length;
  return (
    <section aria-labelledby="content-title">
      <ModuleHeader
        title="Content management"
        description="Create, publish, edit, and archive website content."
      />
      <Notice message={notice} />
      <Notice message={error} error />
      <nav aria-label="Content sections" className="mb-6 flex flex-wrap gap-2">
        {contentSections.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={contentFilter === value}
            onClick={() => {
              setContentFilter(value);
              setNotice("");
              setError("");
              if (value !== "all") {
                setEditing(null);
                setContentType(value);
              }
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              contentFilter === value
                ? "bg-brand-navy text-white"
                : "border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
            }`}
          >
            {label} ({sectionCount(value)})
          </button>
        ))}
      </nav>
      {loading && <p className="mb-5 text-sm">Loading website content…</p>}
      <div className="grid gap-7 xl:grid-cols-[1.25fr_.75fr]">
        <form
          ref={editorRef}
          key={editing?.id ?? `new-${contentType}`}
          onSubmit={save}
          className="card order-2 grid scroll-mt-24 gap-4"
        >
          <h3 className="font-bold text-slate-950 dark:text-white">
            {editing
              ? `Edit: ${editing.title}`
              : `Add ${contentSections.find(([value]) => value === contentType)?.[1] ?? "content"}`}
          </h3>
          <label className="admin-label">
            Type
            <select
              name="type"
              value={contentType}
              onChange={(event) => setContentType(event.target.value)}
              className="admin-input mt-2"
            >
              <option value="services">Service</option>
              <option value="projects">Project</option>
              <option value="products">Product</option>
              <option value="posts">Blog post</option>
              <option value="testimonials">Testimonial</option>
              <option value="careers">Career</option>
              <option value="faqs">FAQ</option>
            </select>
          </label>
          <label className="admin-label">
            Title
            <input
              name="title"
              defaultValue={editing?.title}
              required
              maxLength={255}
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            Summary
            <textarea
              name="excerpt"
              defaultValue={editing?.excerpt}
              maxLength={1000}
              rows={4}
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            {contentType === "careers" ? "Role description and requirements" : "Full content"}
            <textarea name="body" defaultValue={editing?.body} rows={8} className="admin-input mt-2" />
          </label>
          {contentType === "careers" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="admin-label">
                Employment type
                <input
                  name="career_employment_type"
                  defaultValue={editing?.data?.employment_type ?? "Full-time"}
                  placeholder="Full-time, contract or internship"
                  maxLength={100}
                  className="admin-input mt-2"
                  required
                />
              </label>
              <label className="admin-label">
                Location
                <input
                  name="career_location"
                  defaultValue={editing?.data?.location ?? "Nairobi"}
                  placeholder="Nairobi, hybrid or remote"
                  maxLength={120}
                  className="admin-input mt-2"
                  required
                />
              </label>
            </div>
          )}
          {contentType === "services" && (
            <div className="grid gap-4">
              <label className="admin-label">
                Service category
                <input
                  name="service_category"
                  defaultValue={editing?.data?.category}
                  list="service-category-options"
                  placeholder="Select or enter a category"
                  maxLength={100}
                  className="admin-input mt-2"
                />
                <datalist id="service-category-options">
                  <option value="business-systems" />
                  <option value="security-infrastructure" />
                  <option value="tracking-automation" />
                  <option value="cloud-presence" />
                  <option value="advisory-managed" />
                </datalist>
              </label>
              <label className="admin-label">
                Capabilities <span className="font-normal">(one per line)</span>
                <textarea
                  name="service_capabilities"
                  defaultValue={editing?.data?.capabilities?.join("\n")}
                  rows={7}
                  className="admin-input mt-2"
                  placeholder={"Installation\nConfiguration\nTraining\nOngoing support"}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input
                  name="service_featured"
                  type="checkbox"
                  defaultChecked={editing?.data?.featured ?? false}
                />
                Feature this service
              </label>
            </div>
          )}
          {contentType === "projects" && (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="admin-label">
                  Client or organisation
                  <input
                    name="project_client"
                    defaultValue={editing?.data?.client}
                    placeholder="Client name"
                    maxLength={150}
                    className="admin-input mt-2"
                  />
                </label>
                <label className="admin-label">
                  Portfolio category
                  <input
                    name="project_category"
                    defaultValue={editing?.data?.category}
                    placeholder="POS Systems, CCTV, Networking..."
                    maxLength={100}
                    className="admin-input mt-2"
                  />
                </label>
              </div>
              <label className="admin-label">
                Downloadable portfolio file
                <input
                  name="project_file"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                  className="admin-input mt-2"
                />
                <span className="mt-2 block text-xs font-normal">
                  PDF, Word, PowerPoint, Excel or ZIP; maximum 20 MB.
                </span>
              </label>
              {editing?.data?.download_name && (
                <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  Current download: <b>{editing.data.download_name}</b>
                  <label className="mt-2 flex items-center gap-2">
                    <input name="remove_project_file" type="checkbox" /> Remove this file
                  </label>
                </div>
              )}
            </div>
          )}
          {contentType === "posts" && (
            <label className="admin-label">
              Blog category
              <input
                name="blog_category"
                defaultValue={editing?.data?.category}
                placeholder="Business Technology, Cybersecurity..."
                maxLength={100}
                className="admin-input mt-2"
              />
            </label>
          )}
          <label className="admin-label">
            Display order
            <input
              name="sort_order"
              type="number"
              min="0"
              defaultValue={editing?.sort_order ?? 0}
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            SEO title
            <input
              name="meta_title"
              defaultValue={editing?.meta_title}
              maxLength={70}
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            SEO description
            <textarea
              name="meta_description"
              defaultValue={editing?.meta_description}
              maxLength={170}
              rows={3}
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            Status
            <select name="status" defaultValue={editing?.status ?? "draft"} className="admin-input mt-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editing ? "Save changes" : "Create content"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setContentType(contentFilter === "all" ? "posts" : contentFilter);
                }}
                className="rounded-full border px-5 py-3 text-sm font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <article className="card order-1 overflow-x-auto">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white">{activeSectionLabel} entries</h3>
              <p className="mt-1 text-xs">
                {filteredContentItems.length} {filteredContentItems.length === 1 ? "record" : "records"}
              </p>
            </div>
            {contentFilter !== "all" && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setContentType(contentFilter);
                  setNotice("");
                  setError("");
                  window.setTimeout(
                    () => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    0,
                  );
                }}
                className="btn-primary"
              >
                <Plus aria-hidden="true" size={16} /> Add new {activeSectionLabel.toLowerCase()}
              </button>
            )}
          </header>
          <table className="mt-5 w-full min-w-[620px] text-left text-sm">
            <caption className="sr-only">Managed website content</caption>
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="py-3">Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContentItems.map((item) => (
                <tr key={item.id} className="border-b last:border-0 dark:border-slate-800">
                  <td className="py-4 font-bold">{item.title}</td>
                  <td className="capitalize">{item.type}</td>
                  <td className="capitalize">{item.status}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          setContentType(item.type);
                          setNotice("");
                          setError("");
                          window.setTimeout(
                            () => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                            0,
                          );
                        }}
                        className="font-bold text-brand-navy dark:text-teal-300"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        className="font-bold text-red-700 dark:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredContentItems.length && (
            <p className="py-8 text-center text-sm">
              No {contentSections.find(([value]) => value === contentFilter)?.[1]?.toLowerCase() ?? "content"}{" "}
              exists in this section yet. Use the editor to add the first entry.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

function MediaModule({ token }: { token: string }) {
  const [result, setResult] = useState<{ path: string; url: string } | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setError("");
    try {
      const data = new FormData(event.currentTarget);
      const payload = await api<{ path: string; url: string }>(token, "/admin/uploads", {
        method: "POST",
        body: data,
      });
      setResult(payload);
      event.currentTarget.reset();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setUploading(false);
    }
  }
  return (
    <section aria-labelledby="media-title">
      <ModuleHeader
        title="Image uploads"
        description="Upload optimized website imagery up to 5 MB in JPG, PNG, WebP, or AVIF format."
      />
      <Notice message={error} error />
      <div className="grid gap-7 lg:grid-cols-2">
        <form onSubmit={upload} className="card">
          <label className="admin-label" htmlFor="media-image">
            Select image
            <input
              id="media-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              required
              className="mt-3 block w-full rounded-xl border border-dashed border-slate-400 p-5 text-sm"
            />
          </label>
          <button type="submit" disabled={uploading} className="btn-primary mt-5 disabled:opacity-60">
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </form>
        {result && (
          <article className="card">
            <h3 className="font-bold text-slate-950 dark:text-white">Upload complete</h3>
            <img
              src={result.url}
              alt="Preview of the newly uploaded website asset"
              className="mt-4 max-h-64 w-full rounded-xl object-contain"
            />
            <label className="admin-label mt-4">
              Stored path
              <input
                readOnly
                value={result.path}
                className="admin-input mt-2"
                onFocus={(event) => event.currentTarget.select()}
              />
            </label>
          </article>
        )}
      </div>
    </section>
  );
}

type SeoSettings = {
  site_title: string;
  meta_description: string;
  og_image?: string;
  google_analytics_id?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
};
function SeoModule({ token }: { token: string }) {
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api<SeoSettings>(token, "/admin/seo-settings")
      .then(setSettings)
      .catch((reason) => setError(reason.message));
  }, [token]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const payload = await api<SeoSettings>(token, "/admin/seo-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSettings(payload);
      setNotice("SEO settings saved.");
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <section aria-labelledby="seo-title">
      <ModuleHeader
        title="SEO settings"
        description="Manage global search and social-sharing defaults. Page-specific metadata remains attached to each content item."
      />
      <Notice message={notice} />
      <Notice message={error} error />
      {settings && (
        <form onSubmit={save} className="card grid max-w-3xl gap-5">
          <label className="admin-label">
            Site title <span className="font-normal">(maximum 70 characters)</span>
            <input
              name="site_title"
              defaultValue={settings.site_title}
              maxLength={70}
              required
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            Meta description <span className="font-normal">(maximum 170 characters)</span>
            <textarea
              name="meta_description"
              defaultValue={settings.meta_description}
              maxLength={170}
              required
              rows={4}
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            Open Graph image path
            <input name="og_image" defaultValue={settings.og_image} className="admin-input mt-2" />
          </label>
          <label className="admin-label">
            Google Analytics measurement ID
            <input
              name="google_analytics_id"
              defaultValue={settings.google_analytics_id}
              placeholder="G-XXXXXXXXXX"
              className="admin-input mt-2"
            />
          </label>
          {["facebook_url", "instagram_url", "linkedin_url"].map((key) => (
            <label key={key} className="admin-label capitalize">
              {key.replace("_", " ")}
              <input
                name={key}
                type="url"
                defaultValue={settings[key as keyof SeoSettings]}
                className="admin-input mt-2"
              />
            </label>
          ))}
          <button type="submit" className="btn-primary w-fit">
            Save SEO settings
          </button>
        </form>
      )}
    </section>
  );
}

type AdminUser = { id: number; name: string; email: string; role: string; created_at: string };
function UsersModule({ token }: { token: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(
    () => api<{ data: AdminUser[] }>(token, "/admin/users").then((payload) => setUsers(payload.data)),
    [token],
  );
  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, [load]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await api(token, "/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      form.reset();
      setNotice("User created.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  async function remove(user: AdminUser) {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await api(token, `/admin/users/${user.id}`, { method: "DELETE" });
      setNotice("User deleted.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <section aria-labelledby="users-title">
      <ModuleHeader
        title="User management"
        description="Create administrators and editors. Passwords require at least 12 characters."
      />
      <Notice message={notice} />
      <Notice message={error} error />
      <div className="grid gap-7 lg:grid-cols-[.7fr_1.3fr]">
        <form onSubmit={create} className="card grid gap-4">
          <h3 className="font-bold text-slate-950 dark:text-white">New user</h3>
          <label className="admin-label">
            Name
            <input name="name" required className="admin-input mt-2" />
          </label>
          <label className="admin-label">
            Email
            <input name="email" type="email" required className="admin-input mt-2" />
          </label>
          <label className="admin-label">
            Password
            <input
              name="password"
              type="password"
              minLength={12}
              autoComplete="new-password"
              required
              className="admin-input mt-2"
            />
          </label>
          <label className="admin-label">
            Role
            <select name="role" defaultValue="editor" className="admin-input mt-2">
              <option value="editor">Editor</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <button type="submit" className="btn-primary">
            Create user
          </button>
        </form>
        <article className="card overflow-x-auto">
          <h3 className="font-bold text-slate-950 dark:text-white">Authorised users</h3>
          <table className="mt-5 w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Administration users</caption>
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 dark:border-slate-800">
                  <td className="py-4 font-bold">{user.name}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => remove(user)}
                      aria-label={`Delete ${user.name}`}
                      className="text-red-700 dark:text-red-300"
                    >
                      <Trash2 aria-hidden="true" size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}

type Backup = { name: string; size: number; created_at: string };
function BackupsModule({ token }: { token: string }) {
  const [items, setItems] = useState<Backup[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const load = useCallback(() => api<Backup[]>(token, "/admin/backups").then(setItems), [token]);
  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, [load]);
  async function create() {
    setCreating(true);
    try {
      await api(token, "/admin/backups", { method: "POST" });
      setNotice("Private data backup created.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setCreating(false);
    }
  }
  async function download(file: string) {
    try {
      const response = await fetch(`${API_URL}/admin/backups/${encodeURIComponent(file)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        window.dispatchEvent(new Event("admin-auth-expired"));
      }
      if (!response.ok) throw new Error("Backup download failed.");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <section aria-labelledby="backups-title">
      <ModuleHeader
        title="Backup management"
        description="Create and securely download private JSON snapshots of application data."
      />
      <Notice message={notice} />
      <Notice message={error} error />
      <button
        type="button"
        onClick={create}
        disabled={creating}
        className="btn-primary mb-6 disabled:opacity-60"
      >
        <RefreshCw aria-hidden="true" size={17} className={creating ? "animate-spin" : ""} />
        {creating ? "Creating backup…" : "Create backup now"}
      </button>
      <article className="card overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">Available private backups</caption>
          <thead>
            <tr className="border-b dark:border-slate-700">
              <th className="py-3">File</th>
              <th>Size</th>
              <th>Created</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="border-b last:border-0 dark:border-slate-800">
                <td className="py-4 font-mono text-xs">{item.name}</td>
                <td>{Math.max(1, Math.round(item.size / 1024))} KB</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => download(item.name)}
                    aria-label={`Download ${item.name}`}
                    className="text-brand-navy dark:text-teal-300"
                  >
                    <Download aria-hidden="true" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <p className="py-5 text-sm">No backups created yet.</p>}
      </article>
    </section>
  );
}

type StoreOrder = {
  id: number;
  reference: string;
  customer_name: string;
  email: string;
  phone: string;
  payment_method: string;
  payment_status: string;
  fulfilment_status: string;
  total: string;
  currency: string;
  items: { id: number; product_name: string; quantity: number }[];
};
type StoreProduct = {
  id: number;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: string;
  stock_quantity: number;
  image: string | null;
  is_active: boolean;
};

const productCategories = [
  "Cameras",
  "Switches",
  "Routers",
  "Hard drives",
  "POS hardware",
  "Fingerprint scanners",
  "Barcode scanners",
  "Network accessories",
];

function OrdersModule({ token }: { token: string }) {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [newProductImagePreview, setNewProductImagePreview] = useState("");
  const [productSearchInput, setProductSearchInput] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const load = useCallback(async () => {
    const [orderResult, productResult] = await Promise.all([
      api<{ data: StoreOrder[] }>(token, "/admin/orders"),
      api<{ data: StoreProduct[] }>(token, "/admin/products"),
    ]);
    setOrders(orderResult.data);
    setProducts(productResult.data);
  }, [token]);
  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, [load]);
  const normalizedProductSearch = productSearch.trim().toLowerCase();
  const filteredProducts = normalizedProductSearch
    ? products.filter((product) =>
        [product.name, product.sku, product.category, product.description].some((value) =>
          value.toLowerCase().includes(normalizedProductSearch),
        ),
      )
    : products;
  async function update(order: StoreOrder, field: "payment_status" | "fulfilment_status", value: string) {
    setError("");
    setNotice("");
    try {
      await api(token, `/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setNotice(`${order.reference} updated.`);
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  async function saveProduct(event: FormEvent<HTMLFormElement>, product: StoreProduct) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setNotice("");
    try {
      let image = product.image;
      const imageFile = form.get("image");
      if (imageFile instanceof File && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.set("image", imageFile);
        const upload = await api<{ url: string }>(token, "/admin/uploads", {
          method: "POST",
          body: uploadData,
        });
        image = upload.url;
      }
      await api(token, `/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: String(form.get("sku") ?? "").trim() || undefined,
          name: form.get("name"),
          category: form.get("category"),
          description: form.get("description"),
          price: Number(form.get("price")),
          stock_quantity: Number(form.get("stock_quantity")),
          image,
          is_active: form.get("is_active") === "on",
        }),
      });
      setNotice(`${product.name} inventory updated.`);
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setCreating(true);
    setError("");
    setNotice("");
    try {
      let image: string | null = null;
      const imageFile = form.get("image");
      if (imageFile instanceof File && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.set("image", imageFile);
        const upload = await api<{ url: string }>(token, "/admin/uploads", {
          method: "POST",
          body: uploadData,
        });
        image = upload.url;
      }
      await api(token, "/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: String(form.get("sku") ?? "").trim() || undefined,
          name: form.get("name"),
          category: form.get("category"),
          description: form.get("description"),
          price: Number(form.get("price")),
          stock_quantity: Number(form.get("stock_quantity")),
          image,
          is_active: form.get("is_active") === "on",
        }),
      });
      formElement.reset();
      setNewProductImagePreview("");
      setNotice("Product added to the catalogue.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setCreating(false);
    }
  }
  function previewProductImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setNewProductImagePreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setNewProductImagePreview(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  }
  async function removeProduct(product: StoreProduct) {
    if (!confirm(`Remove ${product.name} from the catalogue?`)) return;
    setError("");
    try {
      await api(token, `/admin/products/${product.id}`, { method: "DELETE" });
      setNotice(`${product.name} removed.`);
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }
  return (
    <section aria-labelledby="orders-title">
      <ModuleHeader
        title="Store management"
        description="Add products, manage inventory, verify payments and fulfil customer orders."
      />
      <Notice message={notice} />
      <Notice message={error} error />
      <form
        onSubmit={createProduct}
        className="card mb-8 grid gap-4 md:grid-cols-2"
        aria-labelledby="add-product-title"
      >
        <header className="md:col-span-2">
          <h3
            id="add-product-title"
            className="font-display text-xl font-bold text-slate-950 dark:text-white"
          >
            Add a product
          </h3>
          <p className="mt-1 text-sm">Create a product and publish it directly to the online catalogue.</p>
        </header>
        <label className="admin-label" htmlFor="new-product-name">
          Product name
          <input id="new-product-name" name="name" className="admin-input mt-2" required maxLength={160} />
        </label>
        <label className="admin-label" htmlFor="new-product-sku">
          SKU <span className="font-normal">(optional)</span>
          <input
            id="new-product-sku"
            name="sku"
            className="admin-input mt-2"
            maxLength={60}
            placeholder="Generated automatically when blank"
          />
        </label>
        <label className="admin-label" htmlFor="new-product-category">
          Category
          <input
            id="new-product-category"
            name="category"
            list="product-category-options"
            className="admin-input mt-2"
            required
            maxLength={100}
            placeholder="Select or enter a new category"
          />
          <datalist id="product-category-options">
            {productCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        <label className="admin-label" htmlFor="new-product-image">
          Product image
          <input
            id="new-product-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={previewProductImage}
            className="admin-input mt-2"
          />
          {newProductImagePreview && (
            <span className="mt-3 block overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
              <img
                src={newProductImagePreview}
                alt="Selected product preview"
                width={640}
                height={480}
                className="aspect-[4/3] w-full object-cover"
              />
            </span>
          )}
        </label>
        <label className="admin-label" htmlFor="new-product-price">
          Price (KES)
          <input
            id="new-product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className="admin-input mt-2"
            required
          />
        </label>
        <label className="admin-label" htmlFor="new-product-stock">
          Opening stock
          <input
            id="new-product-stock"
            name="stock_quantity"
            type="number"
            min="0"
            step="1"
            className="admin-input mt-2"
            required
          />
        </label>
        <label className="admin-label md:col-span-2" htmlFor="new-product-description">
          Description
          <textarea
            id="new-product-description"
            name="description"
            className="admin-input mt-2 min-h-28"
            required
            maxLength={2000}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input name="is_active" type="checkbox" defaultChecked /> Publish immediately
        </label>
        <button
          type="submit"
          disabled={creating}
          className="btn-primary md:justify-self-end disabled:opacity-60"
        >
          {creating ? "Adding product…" : "Add product"}
        </button>
      </form>
      <section aria-labelledby="inventory-title" className="mb-8">
        <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h3
              id="inventory-title"
              className="font-display text-xl font-bold text-slate-950 dark:text-white"
            >
              Product inventory
            </h3>
            <p className="mt-1 text-sm">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <form
            className="flex w-full max-w-xl gap-2"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              setProductSearch(productSearchInput);
            }}
          >
            <label className="sr-only" htmlFor="admin-product-search">
              Search products
            </label>
            <input
              id="admin-product-search"
              type="search"
              value={productSearchInput}
              onChange={(event) => setProductSearchInput(event.target.value)}
              placeholder="Search name, SKU, category or description"
              className="admin-input"
            />
            <button type="submit" className="btn-primary shrink-0">
              <Search aria-hidden="true" size={17} /> Search
            </button>
            {productSearch && (
              <button
                type="button"
                className="rounded-full border px-4 text-sm font-bold"
                onClick={() => {
                  setProductSearch("");
                  setProductSearchInput("");
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <form className="card" key={product.id} onSubmit={(event) => saveProduct(event, product)}>
              <div className="mb-5 grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                {product.image ? (
                  <img
                    src={publicImageUrl(product.image)}
                    alt={`${product.name} product photo`}
                    width={640}
                    height={480}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon aria-hidden="true" size={48} className="text-slate-400" />
                )}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-teal-aa dark:text-teal-300">
                {product.category} · {product.sku}
              </p>
              <h4 className="mt-2 font-bold text-slate-950 dark:text-white">{product.name}</h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="admin-label sm:col-span-2" htmlFor={`name-${product.id}`}>
                  Product name
                  <input
                    id={`name-${product.id}`}
                    name="name"
                    defaultValue={product.name}
                    maxLength={160}
                    className="admin-input mt-2"
                    required
                  />
                </label>
                <label className="admin-label" htmlFor={`sku-${product.id}`}>
                  SKU
                  <input
                    id={`sku-${product.id}`}
                    name="sku"
                    defaultValue={product.sku}
                    maxLength={60}
                    className="admin-input mt-2"
                    required
                  />
                </label>
                <label className="admin-label" htmlFor={`category-${product.id}`}>
                  Category
                  <input
                    id={`category-${product.id}`}
                    name="category"
                    list="product-category-options"
                    defaultValue={product.category}
                    className="admin-input mt-2"
                    maxLength={100}
                    required
                  />
                </label>
                <label className="admin-label sm:col-span-2" htmlFor={`description-${product.id}`}>
                  Description
                  <textarea
                    id={`description-${product.id}`}
                    name="description"
                    defaultValue={product.description}
                    maxLength={2000}
                    rows={4}
                    className="admin-input mt-2"
                    required
                  />
                </label>
                <label className="admin-label sm:col-span-2" htmlFor={`image-${product.id}`}>
                  Replace product image
                  <input
                    id={`image-${product.id}`}
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="admin-input mt-2"
                  />
                </label>
                <label className="admin-label" htmlFor={`price-${product.id}`}>
                  Price (KES)
                  <input
                    id={`price-${product.id}`}
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={product.price}
                    className="admin-input mt-2"
                    required
                  />
                </label>
                <label className="admin-label" htmlFor={`stock-${product.id}`}>
                  Stock
                  <input
                    id={`stock-${product.id}`}
                    name="stock_quantity"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={product.stock_quantity}
                    className="admin-input mt-2"
                    required
                  />
                </label>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm font-bold">
                <input name="is_active" type="checkbox" defaultChecked={product.is_active} /> Visible in store
              </label>
              <button type="submit" className="btn-primary mt-4 w-full">
                Save inventory
              </button>
              <button
                type="button"
                onClick={() => removeProduct(product)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 text-sm font-bold text-red-700 dark:text-red-300"
                aria-label={`Remove ${product.name}`}
              >
                <Trash2 aria-hidden="true" size={16} /> Remove product
              </button>
            </form>
          ))}
        </div>
      </section>
      <h3 className="mb-4 font-display text-xl font-bold text-slate-950 dark:text-white">Customer orders</h3>
      <div className="grid gap-5">
        {orders.map((order) => (
          <article className="card" key={order.id}>
            <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700 sm:flex-row">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white">{order.reference}</h3>
                <p className="mt-1 text-sm">
                  {order.customer_name} · {order.email} · {order.phone}
                </p>
              </div>
              <strong className="text-brand-navy dark:text-teal-300">
                {new Intl.NumberFormat("en-KE", { style: "currency", currency: order.currency }).format(
                  Number(order.total),
                )}
              </strong>
            </header>
            <ul className="my-4 text-sm">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity} × {item.product_name}
                </li>
              ))}
            </ul>
            <div className="grid gap-4 sm:grid-cols-3">
              <p className="admin-label">
                Payment method
                <span className="mt-2 block font-normal capitalize">
                  {order.payment_method.replace("_", " ")}
                </span>
              </p>
              <label className="admin-label" htmlFor={`payment-${order.id}`}>
                Payment status
                <select
                  id={`payment-${order.id}`}
                  className="admin-input mt-2"
                  value={order.payment_status}
                  onChange={(event) => update(order, "payment_status", event.target.value)}
                >
                  {["pending", "paid", "failed", "refunded"].map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-label" htmlFor={`fulfilment-${order.id}`}>
                Fulfilment
                <select
                  id={`fulfilment-${order.id}`}
                  className="admin-input mt-2"
                  value={order.fulfilment_status}
                  onChange={(event) => update(order, "fulfilment_status", event.target.value)}
                >
                  {["new", "processing", "ready", "shipped", "completed", "cancelled"].map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))}
        {!orders.length && <p className="card text-sm">No store orders yet.</p>}
      </div>
    </section>
  );
}

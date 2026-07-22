"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Loader2, MessageCircle, Send, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const SESSION_KEY = "sysnettech_chat_session";

type Conversation = {
  id: number;
  visitor_name: string;
  status: "open" | "pending" | "closed";
  last_message_at: string | null;
};

type ChatMessage = {
  id: number;
  sender_type: "visitor" | "operator";
  sender_name: string;
  body: string;
  created_at: string;
};

type ChatSession = { conversationId: number; token: string };

function readSession(): ChatSession | null {
  try {
    const value = sessionStorage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as ChatSession) : null;
  } catch {
    return null;
  }
}

export function FloatingTools() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(0);
  const openRef = useRef(open);
  const lastMessageId = useRef(0);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openRef.current = open;
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setConversation(null);
    setMessages([]);
    lastMessageId.current = 0;
  }, []);

  const mergeMessages = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;
    setMessages((current) => {
      const known = new Set(current.map(({ id }) => id));
      const fresh = incoming.filter(({ id }) => !known.has(id));
      if (!openRef.current)
        setUnread((count) => count + fresh.filter((item) => item.sender_type === "operator").length);
      const merged = [...current, ...fresh].sort((a, b) => a.id - b.id);
      lastMessageId.current = merged.at(-1)?.id ?? lastMessageId.current;
      return merged;
    });
  }, []);

  const loadConversation = useCallback(
    async (activeSession: ChatSession, incremental = false) => {
      const path = incremental
        ? `/chat/conversations/${activeSession.conversationId}/messages?after_id=${lastMessageId.current}`
        : `/chat/conversations/${activeSession.conversationId}`;
      const response = await fetch(`${API_URL}${path}`, {
        headers: { Accept: "application/json", "X-Chat-Token": activeSession.token },
        cache: "no-store",
      });
      if (response.status === 403 || response.status === 404) {
        clearSession();
        throw new Error("Your previous chat session expired. Please start a new conversation.");
      }
      if (!response.ok) throw new Error("Chat is temporarily unavailable.");
      const payload = await response.json();
      setConversation(payload.conversation);
      mergeMessages(payload.messages ?? []);
    },
    [clearSession, mergeMessages],
  );

  useEffect(() => {
    const stored = readSession();
    if (!stored) return;
    setSession(stored);
    setLoading(true);
    loadConversation(stored)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [loadConversation]);

  useEffect(() => {
    if (!session) return;
    const interval = window.setInterval(
      () => {
        loadConversation(session, true).catch(() => undefined);
      },
      open ? 4000 : 10000,
    );
    return () => window.clearInterval(interval);
  }, [loadConversation, open, session]);

  async function startConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim() || null,
          message: String(data.get("message") ?? "").trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Unable to start chat.");
      const nextSession = { conversationId: payload.conversation.id, token: payload.token };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setConversation(payload.conversation);
      mergeMessages([payload.message]);
      event.currentTarget.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to start chat.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || conversation?.status === "closed") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = String(data.get("message") ?? "").trim();
    if (!body) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/chat/conversations/${session.conversationId}/messages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Chat-Token": session.token,
        },
        body: JSON.stringify({ message: body }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Message could not be sent.");
      mergeMessages([payload.message]);
      form.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <aside aria-label="Customer support">
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254700000000"}?text=Hello%20Sysnettech,%20I%20need%20help%20with%20an%20ICT%20solution.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#128C4A] text-white shadow-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#128C4A] focus:ring-offset-2"
        aria-label="Chat with Sysnettech on WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-24 z-40 grid h-12 w-12 place-items-center rounded-full bg-brand-navy text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2"
        aria-label={open ? "Close live chat" : "Open live chat"}
        aria-expanded={open}
        aria-controls="support-dialog"
      >
        {open ? <X aria-hidden="true" size={20} /> : <Headphones aria-hidden="true" size={20} />}
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-700 px-1 text-xs font-bold">
            <span className="sr-only">Unread messages: </span>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <section
          id="support-dialog"
          role="dialog"
          aria-modal="false"
          aria-labelledby="support-title"
          className="fixed bottom-24 right-5 z-40 flex max-h-[min(620px,calc(100vh-8rem))] w-[calc(100%-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="bg-brand-navy p-5 text-white">
            <h2 id="support-title" className="font-bold">
              Sysnettech Support
            </h2>
            <p className="text-xs text-white/80">
              {conversation?.status === "closed"
                ? "Conversation closed"
                : "Replies typically arrive in a few minutes"}
            </p>
          </header>

          {loading && !conversation ? (
            <div role="status" className="grid min-h-52 place-items-center p-6">
              <Loader2 aria-hidden="true" className="animate-spin text-brand-teal-aa" />
              <span className="sr-only">Loading chat</span>
            </div>
          ) : conversation ? (
            <>
              <div
                ref={messageListRef}
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
                className="min-h-52 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950"
              >
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                      message.sender_type === "visitor"
                        ? "ml-auto bg-brand-navy text-white"
                        : "bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                    }`}
                  >
                    <p className="mb-1 text-xs font-bold opacity-80">{message.sender_name}</p>
                    <p className="whitespace-pre-wrap break-words">{message.body}</p>
                    <time className="mt-1 block text-[10px] opacity-70" dateTime={message.created_at}>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </article>
                ))}
              </div>
              <form onSubmit={sendMessage} className="border-t border-slate-200 p-4 dark:border-slate-700">
                <label htmlFor="support-message" className="sr-only">
                  Chat message
                </label>
                <div className="flex gap-2">
                  <input
                    id="support-message"
                    name="message"
                    maxLength={2000}
                    disabled={sending || conversation.status === "closed"}
                    className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand-teal-aa focus:outline-none focus:ring-2 focus:ring-brand-teal-aa/30 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950"
                    placeholder={
                      conversation.status === "closed" ? "This chat is closed" : "Type a message..."
                    }
                  />
                  <button
                    type="submit"
                    disabled={sending || conversation.status === "closed"}
                    className="grid h-10 w-10 place-items-center rounded-full bg-brand-teal-aa text-white disabled:opacity-60"
                    aria-label="Send chat message"
                  >
                    {sending ? (
                      <Loader2 aria-hidden="true" className="animate-spin" size={17} />
                    ) : (
                      <Send aria-hidden="true" size={17} />
                    )}
                  </button>
                </div>
                {conversation.status === "closed" && (
                  <button
                    type="button"
                    onClick={clearSession}
                    className="mt-3 text-sm font-bold text-brand-navy underline dark:text-teal-300"
                  >
                    Start a new conversation
                  </button>
                )}
              </form>
            </>
          ) : (
            <form onSubmit={startConversation} className="grid gap-4 p-5">
              <p className="text-sm leading-6">
                Tell us who you are and how we can help. Your chat is kept for this browser session.
              </p>
              <label htmlFor="chat-name" className="text-sm font-bold">
                Name
                <input
                  id="chat-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 font-normal focus:border-brand-teal-aa focus:outline-none focus:ring-2 focus:ring-brand-teal-aa/30 dark:border-slate-600"
                />
              </label>
              <label htmlFor="chat-email" className="text-sm font-bold">
                Email <span className="font-normal text-slate-500 dark:text-slate-300">(optional)</span>
                <input
                  id="chat-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={160}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 font-normal focus:border-brand-teal-aa focus:outline-none focus:ring-2 focus:ring-brand-teal-aa/30 dark:border-slate-600"
                />
              </label>
              <label htmlFor="chat-first-message" className="text-sm font-bold">
                How can we help?
                <textarea
                  id="chat-first-message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 font-normal focus:border-brand-teal-aa focus:outline-none focus:ring-2 focus:ring-brand-teal-aa/30 dark:border-slate-600"
                />
              </label>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" size={17} /> Connecting…
                  </>
                ) : (
                  "Start live chat"
                )}
              </button>
            </form>
          )}

          {error && (
            <p
              role="alert"
              className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
            >
              {error}
            </p>
          )}
        </section>
      )}
    </aside>
  );
}

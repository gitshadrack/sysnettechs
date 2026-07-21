"use client";
import { Headphones, MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
export function FloatingTools() {
  const [chat, setChat] = useState(false);
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
        onClick={() => setChat(!chat)}
        className="fixed bottom-5 right-24 z-40 grid h-12 w-12 place-items-center rounded-full bg-brand-navy text-white shadow-xl"
        aria-label={chat ? "Close live chat" : "Open live chat"}
        aria-expanded={chat}
        aria-controls="support-dialog"
      >
        {chat ? <X aria-hidden="true" size={20} /> : <Headphones aria-hidden="true" size={20} />}
      </button>
      {chat && (
        <section
          id="support-dialog"
          role="dialog"
          aria-modal="false"
          aria-labelledby="support-title"
          className="fixed bottom-24 right-5 z-40 w-[calc(100%-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="bg-brand-navy p-5 text-white">
            <h2 id="support-title" className="font-bold">
              Sysnettech Support
            </h2>
            <p className="text-xs text-white/80">Typically replies in a few minutes</p>
          </header>
          <div className="p-5">
            <p aria-live="polite" className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
              Hello! How can we help your business today?
            </p>
            <form className="mt-4 flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="support-message" className="sr-only">
                Chat message
              </label>
              <input
                id="support-message"
                className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-full bg-brand-teal-aa text-white"
                aria-label="Send chat message"
              >
                <Send aria-hidden="true" size={17} />
              </button>
            </form>
          </div>
        </section>
      )}
    </aside>
  );
}

"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitForm } from "@/lib/api";
import { services } from "@/lib/data";

type Kind = "contact" | "quotes" | "service-requests" | "applications";
export function LeadForm({ kind = "contact", compact = false }: { kind?: Kind; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const prefix = `${kind}-form`;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      await submitForm(kind, form);
      setStatus("done");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }
  if (status === "done")
    return (
      <section
        role="status"
        aria-live="polite"
        className="rounded-3xl bg-teal-50 p-8 text-center dark:bg-teal-950/30"
      >
        <CheckCircle2
          aria-hidden="true"
          className="mx-auto text-brand-teal-aa dark:text-teal-300"
          size={42}
        />
        <h3 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
          Thank you — request received.
        </h3>
        <p className="mt-2 text-sm">Our team will contact you within one business day.</p>
      </section>
    );
  return (
    <form
      onSubmit={submit}
      aria-busy={status === "loading"}
      className="grid gap-5"
      encType="multipart/form-data"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${prefix}-name`} name="name" label="Full name" autoComplete="name" required />
        <Field
          id={`${prefix}-company`}
          name="company"
          label="Company or organisation"
          autoComplete="organization"
        />
        <Field
          id={`${prefix}-email`}
          name="email"
          label="Work email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          id={`${prefix}-phone`}
          name="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          required
        />
      </div>
      {kind !== "contact" && kind !== "applications" && (
        <label className="block" htmlFor={`${prefix}-service`}>
          <span className="mb-2 block text-sm font-bold">Solution needed</span>
          <select
            id={`${prefix}-service`}
            name="service"
            required
            className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-brand-teal-aa focus:ring-2 focus:ring-brand-teal-aa/30 dark:border-slate-600"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      )}
      {kind === "applications" && (
        <>
          <Field id={`${prefix}-position`} name="position" label="Position applying for" required />
          <label htmlFor={`${prefix}-cv`}>
            <span className="mb-2 block text-sm font-bold">CV or résumé</span>
            <input
              id={`${prefix}-cv`}
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              aria-describedby={`${prefix}-cv-help`}
              required
              className="w-full rounded-xl border border-dashed border-slate-400 p-4 text-sm dark:border-slate-600"
            />
            <small id={`${prefix}-cv-help`} className="mt-2 block text-slate-600 dark:text-slate-300">
              PDF, DOC or DOCX. Maximum 5 MB.
            </small>
          </label>
        </>
      )}
      <label htmlFor={`${prefix}-message`}>
        <span className="mb-2 block text-sm font-bold">
          {kind === "applications" ? "Cover note" : "Tell us about your requirements"}
        </span>
        <textarea
          id={`${prefix}-message`}
          name="message"
          required
          rows={compact ? 3 : 5}
          className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-brand-teal-aa focus:ring-2 focus:ring-brand-teal-aa/30 dark:border-slate-600"
          placeholder="How can we help?"
        />
      </label>
      <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <input type="checkbox" required className="mt-0.5 accent-brand-teal-aa" />I agree to the privacy
        policy and consent to being contacted about this request.
      </label>
      {status === "error" && (
        <p role="alert" aria-live="assertive" className="text-sm font-medium text-red-700 dark:text-red-300">
          Something went wrong. Please call or email us, or try again.
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-fit disabled:opacity-60">
        {status === "loading" ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" size={18} /> Sending…
          </>
        ) : (
          <>
            Send request <ArrowRight aria-hidden="true" size={17} />
          </>
        )}
      </button>
    </form>
  );
}
function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id}>
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-brand-teal-aa focus:ring-2 focus:ring-brand-teal-aa/30 dark:border-slate-600"
      />
    </label>
  );
}

export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
    >
      {done ? (
        <p role="status" aria-live="polite" className="font-bold text-white">
          You’re subscribed. Welcome aboard!
        </p>
      ) : (
        <>
          <label className="sr-only" htmlFor="newsletter">
            Newsletter email address
          </label>
          <input
            id="newsletter"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Your email address"
            className="min-w-0 flex-1 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-white placeholder:text-white/70 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </>
      )}
    </form>
  );
}

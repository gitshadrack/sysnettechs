import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Verification",
  description: "Secure payment verification for a Sysnettech Solutions ICT equipment order.",
  robots: { index: false, follow: false },
};

export default function PaymentCompletePage() {
  return (
    <main className="container-site grid min-h-[65vh] place-items-center py-20">
      <section className="card max-w-2xl text-center" aria-labelledby="payment-title">
        <CheckCircle2 aria-hidden="true" className="mx-auto text-brand-teal-aa" size={54} />
        <h1
          id="payment-title"
          className="mt-5 font-display text-3xl font-bold text-slate-950 dark:text-white"
        >
          Payment received for verification
        </h1>
        <p className="mt-4 leading-7">
          Your secure payment response has been received. Our team will confirm payment and fulfilment by
          email or phone after the provider completes verification.
        </p>
        <Link href="/products" className="btn-primary mt-7">
          Return to products
        </Link>
      </section>
    </main>
  );
}

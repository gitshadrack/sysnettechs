export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-40" />
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" />
      <div className="container-site relative">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
      </div>
    </section>
  );
}

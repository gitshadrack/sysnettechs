"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Camera,
  Cable,
  CheckCircle2,
  CreditCard,
  Fingerprint,
  HardDrive,
  Loader2,
  Minus,
  Network,
  Plus,
  Router,
  ScanBarcode,
  ShoppingCart,
  Trash2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: string;
  stock_quantity: number;
  image?: string | null;
};
type Cart = Record<number, number>;
type Bank = { name: string; account_name: string; account_number: string; branch: string };

const money = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});
const icons: Record<string, typeof Camera> = {
  Cameras: Camera,
  Switches: Network,
  Routers: Router,
  "Hard drives": HardDrive,
  "POS hardware": CreditCard,
  "Fingerprint scanners": Fingerprint,
  "Barcode scanners": ScanBarcode,
  "Network accessories": Cable,
};
function productImageUrl(image: string) {
  if (/^https?:\/\//i.test(image)) return image;
  const apiOrigin = API_URL.replace(/\/api\/?$/, "");
  return `${apiOrigin}/${image.replace(/^\//, "")}`;
}

export function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("All products");
  const [cart, setCart] = useState<Cart>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cartNotice, setCartNotice] = useState("");
  const [confirmation, setConfirmation] = useState<{ reference: string; bank: Bank } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sysnettech_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        localStorage.removeItem("sysnettech_cart");
      }
    }
    fetch(`${API_URL}/store/products`, { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("The product catalogue is temporarily unavailable.");
        return response.json();
      })
      .then((payload) => {
        setProducts(payload.data);
        setCategories(payload.categories);
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  function updateCart(id: number, quantity: number) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[id];
      else next[id] = Math.min(quantity, product.stock_quantity, 25);
      try {
        localStorage.setItem("sysnettech_cart", JSON.stringify(next));
      } catch {
        // The cart remains usable for this session when browser storage is unavailable.
      }
      return next;
    });
    setCartNotice(
      quantity <= 0 ? `${product.name} removed from your cart.` : `${product.name} added to your cart.`,
    );
  }

  function viewCart() {
    document.getElementById("store-cart")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const visible =
    category === "All products" ? products : products.filter((item) => item.category === category);
  const cartItems = useMemo(
    () => products.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] })),
    [products, cart],
  );
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setConfirmation(null);
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const response = await fetch(`${API_URL}/store/checkout`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          items: cartItems.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const validation = payload.errors ? Object.values(payload.errors).flat().join(" ") : "";
        throw new Error(validation || payload.message || "Checkout could not be completed.");
      }
      if (payload.next_action === "redirect") {
        window.location.assign(payload.redirect_url);
        return;
      }
      setConfirmation({ reference: payload.order.reference, bank: payload.bank });
      setCart({});
      localStorage.removeItem("sysnettech_cart");
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="py-16 sm:py-20" aria-labelledby="catalogue-title">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Online catalogue</p>
              <h2
                id="catalogue-title"
                className="font-display text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl"
              >
                Professional ICT hardware, ready to order.
              </h2>
            </div>
            <button
              type="button"
              onClick={viewCart}
              className="flex items-center gap-2 rounded-full border border-brand-navy/20 px-4 py-2 font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white dark:border-teal-300/40 dark:text-teal-300"
              aria-label={`View cart with ${itemCount} items`}
            >
              <ShoppingCart aria-hidden="true" size={20} /> {itemCount} {itemCount === 1 ? "item" : "items"}
            </button>
          </div>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-3" aria-label="Product categories">
            {["All products", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
          {loading && (
            <p className="mt-10 flex items-center gap-2" role="status">
              <Loader2 className="animate-spin" aria-hidden="true" /> Loading products…
            </p>
          )}
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product) => {
              const Icon = icons[product.category] ?? ShoppingCart;
              return (
                <article className="card flex flex-col p-0" key={product.id}>
                  <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    {product.image ? (
                      <img
                        src={productImageUrl(product.image)}
                        alt={`${product.name} product photo`}
                        width={640}
                        height={480}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <Icon
                        aria-hidden="true"
                        size={64}
                        className="text-brand-navy/35 dark:text-teal-300/50"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-teal-aa dark:text-teal-300">
                      {product.category}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold text-slate-950 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6">{product.description}</p>
                    <p className="mt-5 text-xl font-black text-brand-navy dark:text-white">
                      {money.format(Number(product.price))}
                    </p>
                    <p className="mt-1 text-xs">
                      {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                    </p>
                    <button
                      type="button"
                      disabled={!product.stock_quantity}
                      onClick={() => updateCart(product.id, (cart[product.id] ?? 0) + 1)}
                      className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart aria-hidden="true" size={17} />{" "}
                      {cart[product.id] ? `In cart: ${cart[product.id]}` : "Add to cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <p className="sr-only" role="status" aria-live="polite">
        {cartNotice}
      </p>
      <section
        id="store-cart"
        className="scroll-mt-24 bg-slate-50 py-16 dark:bg-slate-950 sm:py-20"
        aria-labelledby="checkout-title"
      >
        <div className="container-site grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <article className="card self-start">
            <h2
              id="checkout-title"
              className="font-display text-2xl font-bold text-slate-950 dark:text-white"
            >
              Your cart
            </h2>
            {!cartItems.length && (
              <p className="mt-5">Your cart is empty. Add a product to begin checkout.</p>
            )}
            <ul className="mt-5 space-y-5">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-slate-200 pb-5 last:border-0 dark:border-slate-700"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950 dark:text-white">{item.name}</h3>
                      <p className="text-sm">{money.format(Number(item.price))} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateCart(item.id, 0)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-red-700 dark:text-red-300"
                    >
                      <Trash2 aria-hidden="true" size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full border p-2"
                      onClick={() => updateCart(item.id, item.quantity - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus aria-hidden="true" size={15} />
                    </button>
                    <span className="min-w-6 text-center font-bold" aria-label={`${item.quantity} selected`}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="rounded-full border p-2"
                      onClick={() => updateCart(item.id, item.quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus aria-hidden="true" size={15} />
                    </button>
                    <strong className="ml-auto text-brand-navy dark:text-white">
                      {money.format(Number(item.price) * item.quantity)}
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between border-t border-slate-300 pt-5 text-xl font-black dark:border-slate-700">
              <span>Subtotal</span>
              <span>{money.format(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs">Delivery, if required, is confirmed separately before fulfilment.</p>
          </article>
          <article className="card">
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Secure checkout
            </h2>
            <p className="mt-2 text-sm">Prices and stock are verified securely when you place the order.</p>
            {error && (
              <p
                className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800 dark:bg-red-950 dark:text-red-200"
                role="alert"
              >
                {error}
              </p>
            )}
            {confirmation ? (
              <div
                className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"
                role="status"
              >
                <CheckCircle2 aria-hidden="true" size={32} />
                <h3 className="mt-3 text-xl font-bold">Order {confirmation.reference} reserved</h3>
                <p className="mt-2">
                  Use your order reference as the transfer narration. We will confirm the order after funds
                  clear.
                </p>
                <dl className="mt-5 grid gap-2 text-sm">
                  <div>
                    <dt className="font-bold">Bank</dt>
                    <dd>{confirmation.bank.name}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">Account name</dt>
                    <dd>{confirmation.bank.account_name}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">Account number</dt>
                    <dd>{confirmation.bank.account_number}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">Branch</dt>
                    <dd>{confirmation.bank.branch}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={checkout}>
                <Field name="customer_name" label="Full name" autoComplete="name" />
                <Field name="email" label="Email address" type="email" autoComplete="email" />
                <Field
                  name="phone"
                  label="Kenyan mobile number"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0712 345 678"
                />
                <Field name="city" label="Town or city" autoComplete="address-level2" />
                <div className="sm:col-span-2">
                  <Field name="address" label="Delivery or billing address" autoComplete="street-address" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="admin-label">
                    Order notes <span className="font-normal">(optional)</span>
                  </label>
                  <textarea id="notes" name="notes" maxLength={1000} className="admin-input mt-2 min-h-24" />
                </div>
                <fieldset className="sm:col-span-2">
                  <legend className="admin-label">Payment method</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <Payment value="mpesa" label="M-Pesa" image="/images/payments/mpesa.svg" />
                    <Payment
                      value="card"
                      label="Visa / Mastercard"
                      image="/images/payments/visa-mastercard.svg"
                    />
                    <Payment
                      value="bank_transfer"
                      label="Bank transfer"
                      image="/images/payments/bank-transfer.svg"
                      defaultChecked
                    />
                  </div>
                  <p className="mt-3 text-xs">
                    M-Pesa and cards continue through secure hosted checkout. No card or M-Pesa credentials
                    are stored on this website.
                  </p>
                </fieldset>
                <button
                  disabled={!cartItems.length || submitting}
                  className="btn-primary sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-50"
                  type="submit"
                >
                  {submitting ? (
                    <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                  ) : (
                    <CreditCard aria-hidden="true" size={18} />
                  )}
                  {submitting ? "Processing…" : `Place order — ${money.format(subtotal)}`}
                </button>
              </form>
            )}
          </article>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  ...props
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="admin-label" htmlFor={name}>
      {label}
      <input
        className="admin-input mt-2"
        id={name}
        name={name}
        type={type}
        required
        maxLength={255}
        {...props}
      />
    </label>
  );
}
function Payment({
  value,
  label,
  image,
  defaultChecked = false,
}: {
  value: string;
  label: string;
  image: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="relative flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-300 p-3 font-bold transition hover:border-brand-teal-aa has-[:checked]:border-brand-teal-aa has-[:checked]:bg-teal-50 has-[:checked]:ring-2 has-[:checked]:ring-brand-teal-aa/20 dark:border-slate-600 dark:has-[:checked]:bg-teal-950">
      <span className="flex items-center gap-2">
        <input type="radio" name="payment_method" value={value} defaultChecked={defaultChecked} required />
        <span>{label}</span>
      </span>
      <span className="grid h-14 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700">
        <img
          src={image}
          alt={`${label} payment option`}
          width={230}
          height={64}
          className="h-11 w-full object-contain"
        />
      </span>
    </label>
  );
}

import { useCallback, useEffect, useState } from "react";
import { PRODUCTS, type Product } from "./products";
import { SITE } from "./site";

export type RequestItem = { productId: string; qty: number };

const KEY = "tc-request-list";
const EVENT = "tc-request-list-change";

function read(): RequestItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RequestItem[];
    return Array.isArray(parsed)
      ? parsed.filter((i) => PRODUCTS.some((p) => p.id === i.productId) && i.qty > 0)
      : [];
  } catch {
    return [];
  }
}

function write(items: RequestItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useRequestList() {
  const [items, setItems] = useState<RequestItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((productId: string) => {
    const items = read();
    const found = items.find((i) => i.productId === productId);
    if (found) found.qty += 1;
    else items.push({ productId, qty: 1 });
    write(items);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    let items = read();
    if (qty <= 0) items = items.filter((i) => i.productId !== productId);
    else {
      const found = items.find((i) => i.productId === productId);
      if (found) found.qty = qty;
      else items.push({ productId, qty });
    }
    write(items);
  }, []);

  const clear = useCallback(() => write([]), []);

  const detailed = items
    .map((i) => ({
      ...i,
      product: PRODUCTS.find((p) => p.id === i.productId) as Product,
    }))
    .filter((i) => i.product);

  const subtotal = detailed.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items: detailed, add, setQty, clear, subtotal, count };
}

export function artistOilDiscount(items: { product: Product; qty: number }[]): {
  artistSubtotal: number;
  pct: number;
  amount: number;
} {
  const artistSubtotal = items
    .filter((i) => i.product.category === "artist")
    .reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const pct = artistSubtotal > 1499 ? 15 : artistSubtotal > 999 ? 10 : artistSubtotal > 499 ? 5 : 0;
  return { artistSubtotal, pct, amount: (artistSubtotal * pct) / 100 };
}

export function buildOrderMailto(args: {
  items: { product: Product; qty: number }[];
  subtotal: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  accountEmail?: string;
  discount?: { pct: number; amount: number };
}): string {
  const lines = [
    "Order request from the Triangle Coatings website.",
    "This is a request for pricing and availability, not a completed purchase.",
    "",
    `Name: ${args.firstName} ${args.lastName}`,
    `Email: ${args.email}`,
    `Phone: ${args.phone}`,
    `Shipping address: ${args.address}`,
    "",
    "Requested items:",
    ...args.items.map(
      (i) =>
        `- ${i.product.name}${i.product.code ? ` (${i.product.code})` : ""}${i.product.size ? `, ${i.product.size}` : ""} x ${i.qty} @ $${i.product.price.toFixed(2)} reference`,
    ),
    "",
    `Estimated list subtotal (reference only): $${args.subtotal.toFixed(2)}`,
    "",
    "Please confirm current pricing, availability, lead time, and shipping.",
  ];
  const subject = encodeURIComponent("Website Order Request");
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${SITE.ordersEmail}?subject=${subject}&body=${body}`;
}

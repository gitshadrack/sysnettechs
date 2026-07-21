import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({
  title: "Administration",
  description: "Secure Sysnettech Solutions content administration.",
  path: "/admin",
  noIndex: true,
});
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

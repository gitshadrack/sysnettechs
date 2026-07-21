import { Camera, Code2, Fingerprint, Network, ShoppingCart } from "lucide-react";

export const company = {
  name: "Sysnettech Solutions Ltd",
  phone: "+254 700 000 000",
  email: "info@sysnettechs.co.ke",
  address: "Nairobi, Kenya",
  whatsapp: "254700000000",
};

export const services = [
  {
    slug: "pos-systems",
    title: "POS Systems",
    icon: ShoppingCart,
    summary: "Smart, reliable sales and inventory solutions built for Kenyan businesses.",
    items: [
      "Retail POS",
      "Restaurant POS",
      "Hotel POS",
      "Pharmacy POS",
      "Inventory Management",
      "Barcode Systems",
      "Receipt Printers",
      "Cash Drawers",
      "POS Software",
      "M-Pesa Integration",
      "Installation",
      "Training",
      "Support",
    ],
  },
  {
    slug: "cctv-surveillance",
    title: "CCTV & Surveillance",
    icon: Camera,
    summary: "Protect people, property and operations with intelligent, remote-ready security.",
    items: [
      "HD Cameras",
      "IP Cameras",
      "Wireless CCTV",
      "DVR/NVR Installation",
      "Remote Viewing",
      "Video Analytics",
      "Office Surveillance",
      "Home Security",
      "Industrial Security",
      "Maintenance Contracts",
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    icon: Code2,
    summary: "Fast, scalable digital experiences and business applications that deliver results.",
    items: [
      "Corporate Websites",
      "E-commerce",
      "School Systems",
      "Hospital Systems",
      "Hotel Booking Systems",
      "ERP Development",
      "CRM Systems",
      "Custom Web Applications",
      "Website Maintenance",
      "SEO",
      "UI/UX Design",
    ],
  },
  {
    slug: "biometric-systems",
    title: "Biometric Systems",
    icon: Fingerprint,
    summary: "Accurate attendance and access control, integrated with your workflows.",
    items: [
      "Fingerprint Attendance",
      "Face Recognition",
      "Access Control",
      "Time Attendance",
      "Payroll Integration",
      "Visitor Management",
    ],
  },
  {
    slug: "computer-networking",
    title: "Computer Networking",
    icon: Network,
    summary: "Secure, resilient connectivity engineered for uptime and business growth.",
    items: [
      "LAN Installation",
      "WAN Setup",
      "Structured Cabling",
      "Fiber Installation",
      "Wireless Networks",
      "MikroTik Configuration",
      "Cisco Networking",
      "VPN",
      "Firewall Setup",
      "Server Installation",
      "Network Security",
      "Network Maintenance",
    ],
  },
];

export const projects = [
  {
    title: "Multi-Branch Retail POS",
    category: "POS Systems",
    client: "Kenyan Retail Group",
    tone: "from-[#09265e] to-[#00a99d]",
  },
  {
    title: "Smart Factory Surveillance",
    category: "CCTV",
    client: "Industrial Manufacturer",
    tone: "from-slate-900 to-[#0a2a66]",
  },
  {
    title: "Hospital Operations Portal",
    category: "Web Development",
    client: "Private Healthcare Network",
    tone: "from-[#00a99d] to-cyan-800",
  },
  {
    title: "Enterprise Network Upgrade",
    category: "Networking",
    client: "Professional Services Firm",
    tone: "from-[#0a2a66] to-indigo-700",
  },
  {
    title: "Biometric Access Rollout",
    category: "Biometrics",
    client: "Education Institution",
    tone: "from-orange-500 to-[#0a2a66]",
  },
  {
    title: "Restaurant M-Pesa POS",
    category: "POS Systems",
    client: "Hospitality Group",
    tone: "from-teal-600 to-slate-900",
  },
];

export const products = [
  {
    name: "All-in-One Touch POS",
    category: "POS",
    desc: "Commercial-grade touchscreen terminal for fast, dependable checkout.",
  },
  {
    name: "Thermal Receipt Printer",
    category: "POS",
    desc: "High-speed 80mm thermal printing with USB and network connectivity.",
  },
  {
    name: "4K IP Camera",
    category: "Security",
    desc: "Intelligent night vision, motion detection and secure remote viewing.",
  },
  {
    name: "8-Channel NVR Kit",
    category: "Security",
    desc: "Complete expandable surveillance recording solution for growing sites.",
  },
  {
    name: "Face & Fingerprint Terminal",
    category: "Biometric",
    desc: "Contactless attendance and access control with reporting integration.",
  },
  {
    name: "Enterprise Wi-Fi Access Point",
    category: "Networking",
    desc: "Fast, stable coverage with centralized cloud-ready management.",
  },
];

export const posts = [
  {
    slug: "choose-the-right-pos-system",
    title: "How to Choose the Right POS System for Your Business",
    category: "Business Technology",
    date: "15 Jul 2026",
    publishedAt: "2026-07-15",
    excerpt: "A practical guide to features, integrations and support considerations for Kenyan retailers.",
    content: [
      "A point-of-sale platform should support the way your business actually operates. Begin with daily workflows: checkout speed, stock receiving, returns, reporting, user permissions and branch management.",
      "For Kenyan businesses, payment integration and dependable local support matter as much as feature lists. Confirm how the system handles M-Pesa reconciliation, offline trading, tax configuration and backups before committing.",
      "Choose a platform that can grow without forcing a complete replacement. Ask for a structured demonstration using your real scenarios, a documented implementation plan and clear post-installation support terms.",
    ],
  },
  {
    slug: "strengthen-office-network-security",
    title: "7 Ways to Strengthen Your Office Network Security",
    category: "Cybersecurity",
    date: "02 Jul 2026",
    publishedAt: "2026-07-02",
    excerpt: "Simple, high-impact controls that protect your team, devices and customer data.",
    content: [
      "Strong network security starts with accurate visibility. Maintain an inventory of routers, switches, access points, servers and connected devices, then remove or isolate anything no longer required.",
      "Use unique administrator credentials, multi-factor authentication where supported, current firmware and separate networks for staff, guests and operational devices.",
      "Backups, monitoring and an incident response contact are equally important. Security is an operating discipline, so schedule regular reviews and test recovery procedures.",
    ],
  },
  {
    slug: "ip-vs-analog-cctv",
    title: "IP vs Analog CCTV: What Should You Install?",
    category: "Surveillance",
    date: "19 Jun 2026",
    publishedAt: "2026-06-19",
    excerpt: "Compare image quality, scalability and total ownership cost before investing.",
    content: [
      "Modern analog systems can be cost-effective for straightforward upgrades that reuse existing coaxial cabling. IP cameras provide greater resolution, flexible network deployment and stronger support for analytics.",
      "The correct choice depends on coverage, retention, lighting, bandwidth, remote access and future expansion. Camera resolution alone does not determine evidential quality.",
      "Request a site survey and a retention calculation before procurement. A professional design should document camera purpose, recording duration, user access and maintenance responsibilities.",
    ],
  },
];

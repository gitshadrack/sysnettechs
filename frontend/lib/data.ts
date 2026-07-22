import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  BriefcaseBusiness,
  Building2,
  Camera,
  Cloud,
  Code2,
  DatabaseBackup,
  Fingerprint,
  Globe2,
  HeartPulse,
  House,
  Mail,
  MapPin,
  Network,
  School,
  ServerCog,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UsersRound,
} from "lucide-react";

export const company = {
  name: "Sysnettech Solutions Ltd",
  phone: "+254 700 000 000",
  email: "info@sysnettechs.co.ke",
  address: "Nairobi, Kenya",
  whatsapp: "254700000000",
};

export const serviceCategories = [
  {
    id: "business-systems",
    title: "Business Systems",
    summary: "Connected software that brings operations, people and reporting into one dependable platform.",
  },
  {
    id: "security-infrastructure",
    title: "Security & Infrastructure",
    summary: "Secure physical and digital foundations designed for visibility, resilience and growth.",
  },
  {
    id: "tracking-automation",
    title: "Tracking & Automation",
    summary: "Intelligent control and real-time insight across vehicles, homes and workplaces.",
  },
  {
    id: "cloud-presence",
    title: "Cloud & Digital Presence",
    summary: "Reliable platforms for websites, domains, business email and cloud workloads.",
  },
  {
    id: "advisory-managed",
    title: "Advisory & Managed IT",
    summary: "Practical expertise and ongoing support that keeps technology aligned with the business.",
  },
] as const;

export type ServiceCategoryId = (typeof serviceCategories)[number]["id"];

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  items: string[];
  category: ServiceCategoryId;
  visible: boolean;
  featured: boolean;
};

// Keep every service in this catalog so pages, navigation and forms stay in sync.
// Set `visible` to false only when an offering should be temporarily unpublished.
export const serviceCatalog: Service[] = [
  {
    slug: "pos-systems",
    title: "POS Systems",
    icon: ShoppingCart,
    category: "business-systems",
    visible: true,
    featured: true,
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
    category: "security-infrastructure",
    visible: true,
    featured: true,
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
    category: "cloud-presence",
    visible: true,
    featured: true,
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
    category: "security-infrastructure",
    visible: true,
    featured: true,
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
    category: "security-infrastructure",
    visible: true,
    featured: true,
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
  {
    slug: "school-management-systems",
    title: "School Management Systems",
    icon: School,
    category: "business-systems",
    visible: true,
    featured: false,
    summary: "Unified administration, learning, finance and parent communication for modern schools.",
    items: ["Admissions", "Student Records", "Fees & Billing", "Timetables", "Parent Portals"],
  },
  {
    slug: "hospital-management-systems",
    title: "Hospital Management Systems",
    icon: HeartPulse,
    category: "business-systems",
    visible: true,
    featured: false,
    summary: "Secure clinical and operational workflows for hospitals, clinics and medical centres.",
    items: ["Patient Records", "Appointments", "Billing", "Pharmacy", "Laboratory Workflows"],
  },
  {
    slug: "erp-solutions",
    title: "ERP Solutions",
    icon: Boxes,
    category: "business-systems",
    visible: true,
    featured: false,
    summary: "Integrated finance, inventory, procurement and operations built around one source of truth.",
    items: ["Finance", "Procurement", "Inventory", "HR", "Business Reporting"],
  },
  {
    slug: "fleet-tracking",
    title: "Fleet Tracking",
    icon: Truck,
    category: "tracking-automation",
    visible: true,
    featured: false,
    summary: "Live fleet visibility, driver insights and operational controls that reduce risk and cost.",
    items: ["Live Vehicle Location", "Driver Behaviour", "Fuel Monitoring", "Route History", "Alerts"],
  },
  {
    slug: "gps-tracking",
    title: "GPS Tracking",
    icon: MapPin,
    category: "tracking-automation",
    visible: true,
    featured: false,
    summary: "Dependable location monitoring and alerts for vehicles, equipment and valuable assets.",
    items: ["Asset Tracking", "Geofencing", "Movement Alerts", "Location History", "Mobile Access"],
  },
  {
    slug: "smart-home-automation",
    title: "Smart Home Automation",
    icon: House,
    category: "tracking-automation",
    visible: true,
    featured: false,
    summary: "Convenient, secure control of lighting, access, climate and entertainment at home.",
    items: ["Smart Lighting", "Access Control", "Climate Control", "Energy Monitoring", "Remote Control"],
  },
  {
    slug: "smart-office-solutions",
    title: "Smart Office Solutions",
    icon: Building2,
    category: "tracking-automation",
    visible: true,
    featured: false,
    summary: "Connected workplace technology that improves comfort, security and resource efficiency.",
    items: ["Meeting Rooms", "Smart Access", "Energy Management", "Occupancy Insights", "Automation"],
  },
  {
    slug: "cloud-hosting",
    title: "Cloud Hosting",
    icon: Cloud,
    category: "cloud-presence",
    visible: true,
    featured: false,
    summary: "Secure, scalable hosting for websites, applications and critical business workloads.",
    items: ["Managed Hosting", "SSL", "Monitoring", "Scaling", "Migration"],
  },
  {
    slug: "domain-registration",
    title: "Domain Registration",
    icon: Globe2,
    category: "cloud-presence",
    visible: true,
    featured: false,
    summary: "Professional domain registration, renewal and DNS management for your digital identity.",
    items: ["Domain Search", "Registration", "Renewals", "DNS Management", "Domain Transfers"],
  },
  {
    slug: "email-hosting",
    title: "Email Hosting",
    icon: Mail,
    category: "cloud-presence",
    visible: true,
    featured: false,
    summary: "Reliable business email with professional addresses, security and administration support.",
    items: ["Business Mailboxes", "Spam Protection", "Mobile Setup", "Migration", "Administration"],
  },
  {
    slug: "cybersecurity-services",
    title: "Cybersecurity Services",
    icon: ShieldCheck,
    category: "security-infrastructure",
    visible: true,
    featured: false,
    summary: "Layered protection, monitoring and practical controls for systems, users and business data.",
    items: ["Security Assessments", "Endpoint Protection", "Firewalls", "Monitoring", "Awareness Training"],
  },
  {
    slug: "data-backup-disaster-recovery",
    title: "Data Backup & Disaster Recovery",
    icon: DatabaseBackup,
    category: "security-infrastructure",
    visible: true,
    featured: false,
    summary: "Tested backup and recovery plans that keep essential operations ready for disruption.",
    items: ["Cloud Backup", "On-site Backup", "Recovery Planning", "Restore Testing", "Retention Policies"],
  },
  {
    slug: "it-consultancy",
    title: "IT Consultancy",
    icon: BriefcaseBusiness,
    category: "advisory-managed",
    visible: true,
    featured: false,
    summary: "Independent technology guidance grounded in business priorities, risk and return.",
    items: ["IT Strategy", "Technology Audits", "Solution Design", "Procurement Advice", "Project Oversight"],
  },
  {
    slug: "it-outsourcing",
    title: "IT Outsourcing",
    icon: UsersRound,
    category: "advisory-managed",
    visible: true,
    featured: false,
    summary: "Flexible technical expertise that extends your team without adding unnecessary overhead.",
    items: ["Helpdesk", "Technical Staffing", "Project Support", "Vendor Coordination", "On-site Support"],
  },
  {
    slug: "managed-it-services",
    title: "Managed IT Services",
    icon: ServerCog,
    category: "advisory-managed",
    visible: true,
    featured: false,
    summary: "Proactive monitoring, maintenance and support under one accountable service relationship.",
    items: ["Monitoring", "Preventive Maintenance", "User Support", "Patch Management", "Service Reporting"],
  },
];

export const services = serviceCatalog.filter((service) => service.visible);
export const featuredServices = services.filter((service) => service.featured);
export const serviceGroups = serviceCategories
  .map((category) => ({
    ...category,
    services: services.filter((service) => service.category === category.id),
  }))
  .filter((category) => category.services.length > 0);
export const featuredServiceGroups = serviceGroups
  .map((category) => ({
    ...category,
    services: category.services.filter((service) => service.featured),
  }))
  .filter((category) => category.services.length > 0);
export const additionalServiceGroups = serviceGroups
  .map((category) => ({
    ...category,
    services: category.services.filter((service) => !service.featured),
  }))
  .filter((category) => category.services.length > 0);

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

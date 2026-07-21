"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
const faqs=[
  ["Do you provide support outside Nairobi?","Yes. We deliver projects across Kenya, with remote support nationwide and scheduled on-site support where required."],
  ["Can your POS systems integrate with M-Pesa?","Yes. We implement secure M-Pesa payment workflows and can integrate supported tills, paybills and reconciliation processes."],
  ["Do you offer maintenance contracts?","Yes. Flexible preventive and corrective maintenance plans are available for CCTV, networks, POS and biometric systems."],
  ["How long does a typical implementation take?","Timelines depend on scope. Small installations may take days, while multi-site or custom software projects follow a phased delivery plan."],
  ["Can you work with our existing infrastructure?","Absolutely. We begin with an assessment, retain what is reliable, and propose upgrades only where they add value or reduce risk."]
];
export function FAQ(){const [open,setOpen]=useState(0);return <div className="mx-auto max-w-3xl divide-y divide-slate-200 dark:divide-slate-800">{faqs.map(([q,a],i)=><div key={q}><button onClick={()=>setOpen(open===i?-1:i)} className="flex w-full items-center justify-between gap-5 py-5 text-left font-bold text-slate-950 dark:text-white" aria-expanded={open===i}>{q}<ChevronDown className={`shrink-0 transition ${open===i?"rotate-180 text-brand-teal":""}`} size={19}/></button>{open===i&&<p className="pb-5 leading-7 text-slate-600 dark:text-slate-400">{a}</p>}</div>)}</div>}

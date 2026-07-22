"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function Analytics() {
  const [id, setId] = useState(process.env.NEXT_PUBLIC_GA_ID ?? "");

  useEffect(() => {
    if (id) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
    fetch(`${apiUrl}/settings/seo`, { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => settings?.google_analytics_id && setId(settings.google_analytics_id))
      .catch(() => undefined);
  }, [id]);

  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

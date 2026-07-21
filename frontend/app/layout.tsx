import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingTools } from "@/components/floating-tools";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@/components/analytics";
const manrope=Manrope({subsets:["latin"],variable:"--font-manrope",display:"swap"});const jakarta=Plus_Jakarta_Sans({subsets:["latin"],variable:"--font-plus-jakarta",display:"swap"});
export const metadata:Metadata={metadataBase:new URL("https://sysnettechs.co.ke"),title:{default:"Sysnettech Solutions Ltd | ICT Solutions Kenya",template:"%s | Sysnettech Solutions"},description:"Leading ICT solutions provider in Kenya for POS systems, CCTV, web development, biometric systems and secure computer networks.",keywords:["ICT company Kenya","POS systems Kenya","CCTV installation Nairobi","web development Kenya","biometric systems Kenya","networking company Nairobi"],openGraph:{type:"website",locale:"en_KE",siteName:"Sysnettech Solutions Ltd",title:"Smart ICT Solutions for Modern Businesses",description:"Reliable technology solutions designed, installed and supported in Kenya.",images:["/images/hero-ict.png"]},twitter:{card:"summary_large_image"},robots:{index:true,follow:true}};
const schema={"@context":"https://schema.org","@type":"LocalBusiness",name:"Sysnettech Solutions Ltd",url:"https://sysnettechs.co.ke",email:"info@sysnettechs.co.ke",telephone:"+254700000000",address:{"@type":"PostalAddress",addressLocality:"Nairobi",addressCountry:"KE"},areaServed:"Kenya",description:"Innovative ICT Solutions for Modern Businesses."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body className={`${manrope.variable} ${jakarta.variable}`}><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-3">Skip to content</a><Header/><main id="main">{children}</main><Footer/><FloatingTools/><CookieConsent/><Analytics/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/data";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import "./globals.css";
const inter = localFont({src:"../fonts/InterTight.woff2",variable:"--font-inter",weight:"100 900",display:"swap"});
const serif = localFont({src:[{path:"../fonts/InstrumentSerif.woff2",weight:"400",style:"normal"},{path:"../fonts/InstrumentSerif-Italic.woff2",weight:"400",style:"italic"}],variable:"--font-serif",display:"swap"});
const mono = localFont({src:"../fonts/JetBrainsMono.woff2",variable:"--font-mono",weight:"100 800",display:"swap"});
export const metadata: Metadata = {metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://abhi-portfolio-hazel.vercel.app"),title:`${PROFILE.shortName} — ${PROFILE.role}`,description:PROFILE.intro,openGraph:{title:`${PROFILE.name} — ${PROFILE.role}`,description:PROFILE.intro,images:[{url:"/og.jpg",width:1200,height:630}]},icons:{icon:"/favicon.svg"}};
export const viewport: Viewport = {themeColor:"#f4f2ee"};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:THEME_BOOTSTRAP}}/></head><body className={`${inter.variable} ${serif.variable} ${mono.variable}`}><a className="skip" href="#main">Skip to content</a>{children}</body></html>}

"use client";
import {useEffect,useState} from "react";
import {applyTheme,THEME_KEY} from "@/lib/theme";
export default function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const sync=()=>{const active=document.documentElement.dataset.theme==="dark";setDark(active);document.querySelector('meta[name="theme-color"]')?.setAttribute("content",active?"#121313":"#f4f2ee");};
    sync();
    const stored=(event:StorageEvent)=>{if(event.key===THEME_KEY){const theme=event.newValue==="dark"?"dark":"light";document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;sync();}};
    window.addEventListener("storage",stored);return()=>window.removeEventListener("storage",stored);
  },[]);
  const toggle=()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";applyTheme(next);setDark(next==="dark");};
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode" aria-pressed={dark} title={dark?"Switch to light mode":"Switch to dark mode"}>
    <svg className="theme-moon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg>
    <svg className="theme-sun" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
  </button>;
}

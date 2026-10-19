"use client";
import {useEffect} from "react";
import Lenis from "lenis";
let lenis:Lenis|null=null;
export function scrollToTarget(id:string){const target=document.getElementById(id);if(!target)return;const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;if(lenis&&!reduced)lenis.scrollTo(target,{offset:-96});else target.scrollIntoView({behavior:reduced?"instant":"smooth"});history.replaceState(null,"",`#${id}`)}
export function SmoothScroll(){useEffect(()=>{const media=matchMedia("(prefers-reduced-motion: reduce)");let raf=0;const sync=()=>{cancelAnimationFrame(raf);lenis?.destroy();lenis=null;if(media.matches)return;lenis=new Lenis({duration:1.1,smoothWheel:true,anchors:false});const loop=(time:number)=>{lenis?.raf(time);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop)};sync();media.addEventListener("change",sync);const lock=(e:Event)=>{const open=(e as CustomEvent<boolean>).detail;open?lenis?.stop():lenis?.start()};addEventListener("portfolio-menu",lock);return()=>{cancelAnimationFrame(raf);lenis?.destroy();lenis=null;media.removeEventListener("change",sync);removeEventListener("portfolio-menu",lock)}},[]);return null}

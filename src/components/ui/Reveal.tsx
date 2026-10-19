"use client";
import {useEffect} from "react";
export function RevealObserver(){useEffect(()=>{const nodes=document.querySelectorAll(".rv,.rv-mask");document.documentElement.classList.add("motion-ready");const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-in");observer.unobserve(e.target)}}),{threshold:.08});nodes.forEach(n=>observer.observe(n));return()=>{observer.disconnect();document.documentElement.classList.remove("motion-ready")}},[]);return null}

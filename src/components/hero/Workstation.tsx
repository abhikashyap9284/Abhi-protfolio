"use client";
import {useEffect,useRef,useState} from "react";
import type {WorkstationController} from "./avatar-scene";
import type {AvatarAction} from "@/lib/avatar-motion";
import {useReducedMotion} from "@/lib/hooks";

const actions:{id:AvatarAction;label:string;description:string}[]=[
  {id:"auto",label:"Auto",description:"Play a day at the desk"},
  {id:"typing",label:"Typing",description:"Type at the laptop"},
  {id:"coffee",label:"Coffee",description:"Take a coffee break"},
  {id:"stretch",label:"Stretch",description:"Stand up and stretch"},
  {id:"wave",label:"Hello",description:"Wave hello"},
];
export default function Workstation({visible}:{visible:boolean}){
  const host=useRef<HTMLDivElement>(null),controller=useRef<WorkstationController|null>(null);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[paused,setPaused]=useState(false),[action,setAction]=useState<AvatarAction>("auto");
  const [tabVisible,setTabVisible]=useState(true);
  const reduced=useReducedMotion();
  const settings=useRef({visible,paused,reduced,tabVisible,action});settings.current={visible,paused,reduced,tabVisible,action};
  useEffect(()=>{
    let cancelled=false;let cleanup:(()=>void)|undefined;
    const initialize=async()=>{
      try{
        const {createWorkstation}=await import("./avatar-scene");
        if(cancelled||!host.current)return;
        const instance=createWorkstation(host.current,{onReady:()=>{if(!cancelled)setReady(true);},onError:()=>{if(!cancelled){setFailed(true);setReady(false);}}});
        controller.current=instance;cleanup=()=>instance.dispose();
        const s=settings.current;instance.setAction(s.action);instance.setReducedMotion(s.reduced);instance.setRunning(s.visible&&!s.paused&&s.tabVisible);
      }catch{if(!cancelled){setFailed(true);setReady(false);}}
    };
    // Start after the page's first paint; text, links and the still preview arrive first.
    const timeout=window.setTimeout(initialize,180);
    return()=>{cancelled=true;window.clearTimeout(timeout);cleanup?.();controller.current=null;};
  },[]);
  useEffect(()=>{controller.current?.setRunning(visible&&!paused&&tabVisible);},[visible,paused,tabVisible]);
  useEffect(()=>{controller.current?.setReducedMotion(reduced);},[reduced]);
  useEffect(()=>{const update=()=>setTabVisible(!document.hidden);update();document.addEventListener("visibilitychange",update);return()=>document.removeEventListener("visibilitychange",update);},[]);
  const choose=(next:AvatarAction)=>{setAction(next);controller.current?.setAction(next);};
  return <div className={`studio ${ready&&!failed?"studio-ready":""}`}>
    <div className="studio-heading"><span className="eyebrow">A day at my desk</span><span className="studio-caption">{failed?"At the keyboard":reduced?"Still preview":"Code. Coffee. Create."}</span></div>
    <div className="studio-art" role="img" aria-label="A stylized 3D avatar of Abhi, with swept dark hair and a white shirt, working at a laptop, taking a coffee break, standing to stretch and waving hello.">
      <div className="studio-fallback"/>
      <div className="studio-canvas" ref={host}/>
    </div>
    {!failed&&<div className="studio-controls" role="group" aria-label="Character animation controls">
      <div className="studio-modes">{actions.map(a=><button key={a.id} onClick={()=>choose(a.id)} aria-pressed={action===a.id} title={a.description}>{a.label}</button>)}</div>
      {!reduced&&<button className="studio-pause" aria-label={paused?"Resume character animation":"Pause character animation"} aria-pressed={paused} onClick={()=>setPaused(v=>!v)} title={paused?"Resume animation":"Pause animation"}>{paused?<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="m6 3 10 7L6 17Z" fill="currentColor"/></svg>:<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 4h3v12H5zm7 0h3v12h-3z" fill="currentColor"/></svg>}</button>}
    </div>}
    <style>{`
.studio{position:relative;width:100%;height:100%;isolation:isolate}.studio-heading{position:absolute;top:5%;left:14%;right:6%;display:flex;justify-content:space-between;gap:12px;align-items:center;z-index:2}.studio-heading>.eyebrow{font-size:8px}.studio-caption{font:italic 17px var(--font-serif);color:#858178}.studio-art{position:absolute;inset:4% -3% 3%;}.studio-canvas{position:absolute;inset:0;opacity:0;transition:opacity .65s}.studio-canvas>canvas{display:block;width:100%;height:100%;touch-action:pan-y}.studio-fallback{position:absolute;height:88%;aspect-ratio:1/2;left:50%;top:6%;transform:translateX(-50%);background-image:url('/hero/laptop-work-sprites.png');background-size:400% 200%;background-position:0 0;background-repeat:no-repeat;transition:opacity .4s}.studio-ready .studio-canvas{opacity:1}.studio-ready .studio-fallback{opacity:0;pointer-events:none}.studio-controls{position:absolute;left:50%;bottom:0;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:6px;background:#faf9f5e6;border:1px solid #13131312;border-radius:100px;backdrop-filter:blur(8px);box-shadow:0 8px 25px #00000004;z-index:3;white-space:nowrap}.studio-modes{display:flex;gap:1px}.studio-modes>button{padding:0 13px;height:38px;border-radius:30px;font-size:10px;color:var(--mute);transition:background .2s,color .2s}.studio-modes>button[aria-pressed=true]{background:var(--ink);color:white}.studio-modes>button:hover{background:var(--soft);color:var(--ink)}.studio-modes>button[aria-pressed=true]:hover{background:#333;color:white}.studio-pause{width:38px;height:38px;border-left:1px solid var(--line);display:grid;place-items:center;border-radius:50%;color:var(--mute);flex-shrink:0}.studio-pause:hover{color:var(--ink);background:white}@media(max-width:1100px){.studio-heading{left:10%;right:7%}.studio-caption{font-size:15px}.studio-modes>button{padding:0 10px}.studio-controls{gap:4px}.studio-heading>.eyebrow{font-size:7px}}@media(max-width:900px){.studio-heading{top:0;left:10%;right:10%}.studio-art{inset:-2% -3% 5%}.studio-controls{bottom:0}.studio-modes>button{padding:0 13px}}@media(max-width:520px){.studio-heading{left:2%;right:2%}.studio-heading>.eyebrow{font-size:7px}.studio-modes>button{padding:0 10px;font-size:9px;height:38px}.studio-controls{padding:4px;gap:3px}.studio-caption{font-size:15px}.studio-pause{width:34px;height:38px}.studio-art{inset:0 -10% 6%}}@media(prefers-reduced-motion:reduce){.studio-canvas,.studio-fallback{transition:none}}
    `}</style>
  </div>;
}

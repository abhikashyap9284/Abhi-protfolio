"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, UI } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.intersectionRatio >= .2);
    }, { threshold: [0, .2, 1] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="hero" id="hero" ref={section} aria-labelledby="hero-title">
      <div className="hero-ghost" aria-hidden="true">{PROFILE.shortName.toUpperCase()}</div>
      <div className="hero-copy">
        <p className="eyebrow">{UI.heroLabel}</p>
        <h1 id="hero-title">{PROFILE.role.split(" ").slice(0, -1).join(" ")}<br /><em>{PROFILE.role.split(" ").at(-1)}.</em></h1>
        <p className="hero-summary">{PROFILE.intro}</p>
        <div className="hero-actions">
          <a className="btn primary" href="#work" onClick={e => { e.preventDefault(); scrollToTarget("work"); }}>{UI.workLabel} <span>↗</span></a>
          <a className="btn" href={`mailto:${PROFILE.email}`}>{UI.contactLabel} <span>↗</span></a>
          <a className="resume-link" href={PROFILE.resume} download>{UI.resumeLabel}</a>
        </div>
      </div>
      <div className="hero-workstation">
        <div className="work-sprite" role="img" aria-label={`${PROFILE.shortName} quietly working at a laptop`} style={{ animationPlayState: paused || !visible ? "paused" : "running" }} />
        <button className="animation-control" onClick={() => setPaused(p => !p)} aria-label={paused ? "Resume laptop animation" : "Pause laptop animation"} aria-pressed={paused} title={paused ? "Resume animation" : "Pause animation"}>{paused ? "▶" : "❚❚"}</button>
      </div>
      <div className="hero-bottom">
        <span className="eyebrow">{PROFILE.location}</span>
        <a className="eyebrow" href="#about" onClick={e => { e.preventDefault(); scrollToTarget("about"); }}>Scroll to explore ↓</a>
      </div>
      <style>{`
        .hero{position:relative;min-height:800px;height:min(100svh,1040px);overflow:hidden;padding-top:140px}
        .hero-ghost{position:absolute;left:50%;top:17%;transform:translateX(-50%);font-size:clamp(180px,30vw,470px);line-height:1;font-weight:750;letter-spacing:-.065em;color:transparent;-webkit-text-stroke:1px var(--hero-outline);white-space:nowrap}
        .hero-copy{position:absolute;left:var(--gutter);top:31%;z-index:2;width:46%;max-width:650px}
        .hero-copy h1{font-size:clamp(64px,7.3vw,112px);font-weight:700;line-height:.96;letter-spacing:-.055em;margin:30px 0}
        .hero-copy h1 em{font-weight:400;letter-spacing:-.04em}
        .hero-summary{max-width:360px;line-height:1.6;font-size:16px;color:var(--ink-2)}
        .hero-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:32px}
        .resume-link{font-size:13px;padding:12px;border-bottom:1px solid var(--line)}
        .hero-workstation{position:absolute;right:0%;bottom:85px;width:54%;height:80%;display:flex;justify-content:center;align-items:flex-end}
        .work-sprite{height:100%;max-width:100%;aspect-ratio:1/2;background-image:url('/hero/laptop-work-sprites.png');background-size:400% 200%;background-repeat:no-repeat;background-position:0 0;animation:laptop-work 2.8s steps(1,end) infinite;}
        .animation-control{position:absolute;right:15%;bottom:4%;width:38px;height:38px;border-radius:50%;background:var(--paper);border:1px solid var(--line);color:var(--ink);display:grid;place-items:center;font-size:11px;transition:background .3s;z-index:3}
        .animation-control:hover{background:var(--card)}
        .hero-bottom{position:absolute;bottom:32px;left:var(--gutter);right:var(--gutter);display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:20px}
        .hero-bottom .eyebrow{font-size:10px}
        @keyframes laptop-work{0%{background-position:0% 0%}12.5%{background-position:33.333333% 0%}25%{background-position:66.666667% 0%}37.5%{background-position:100% 0%}50%{background-position:0% 100%}62.5%{background-position:33.333333% 100%}75%{background-position:66.666667% 100%}87.5%{background-position:100% 100%}100%{background-position:0% 0%}}
        @media(min-width:1700px){.hero-copy{left:calc((100vw - 1320px)/2)}}
        @media(max-width:900px){.hero{height:auto;min-height:1000px;padding:135px var(--gutter) 100px}.hero-ghost{top:48%;font-size:36vw}.hero-copy{position:relative;left:auto;top:auto;width:100%;text-align:center;max-width:none}.hero-copy h1{font-size:clamp(56px,10vw,90px);margin:22px 0}.hero-summary{margin:auto}.hero-actions{justify-content:center}.hero-workstation{position:relative;right:auto;bottom:auto;width:100%;height:480px;margin-top:28px}.animation-control{right:20%;bottom:5%}.hero-bottom .eyebrow{font-size:9px}}
        @media(max-width:520px){.hero{min-height:960px;padding-top:120px}.hero-copy h1{font-size:60px}.hero-actions{gap:8px}.hero-actions .btn{font-size:12px;padding:13px 18px}.hero-summary{font-size:14px}.hero-workstation{height:440px;margin-top:25px}.hero-bottom{bottom:22px}.hero-bottom a{max-width:130px;text-align:right}.animation-control{right:10%}}
        @media(prefers-reduced-motion:reduce){.work-sprite{animation:none!important;background-position:0% 0%}.animation-control{display:none}}
      `}</style>
    </section>
  );
}

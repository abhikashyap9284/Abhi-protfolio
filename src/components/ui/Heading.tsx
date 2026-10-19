import {SECTION_TEXT} from "@/lib/data";
export default function Heading({section}:{section:keyof typeof SECTION_TEXT}){const s=SECTION_TEXT[section];return <header className="section-heading rv"><p className="eyebrow">{s.tag}</p><h2>{s.title} <em>{s.accent}</em></h2></header>}

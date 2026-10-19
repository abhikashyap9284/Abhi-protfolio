// Resume supplied 19 October 2026; live links and internship attribution confirmed by Abhi.
export const PROFILE = {
 name:"Abhishek Kashyap",shortName:"Abhi",initials:"AK",role:"Full Stack Developer",
 email:"abhikashyap9284@gmail.com",phone:"+91-9284593779",phoneHref:"tel:+919284593779",
 location:"Meerut, Uttar Pradesh",github:"https://github.com/abhikashyap9284",
 linkedin:"https://www.linkedin.com/in/abhishek-kashyap-411a473b9/",
 gfg:"https://www.geeksforgeeks.org/profile/abhikash7ju1",resume:"/resume.pdf",
 resumeSummary:"Full-Stack Developer with internship experience and projects using React, Next.js, TypeScript and Node.js. Skilled in responsive interfaces, REST APIs, authentication, PostgreSQL and MongoDB.",
 intro:"Building thoughtful interfaces and full-stack applications with React, Next.js, TypeScript and Node.js.",
 quote:"Thoughtful interfaces. Practical solutions. Built with care.",
};
export const EDUCATION = [
 {year:"2024–2026",title:"Master of Computer Applications",place:"JP Institute of Engineering and Technology, Meerut",detail:"CGPA 7.71 · Meerut, Uttar Pradesh",endYear:"2026"},
 {year:"2024",title:"Bachelor of Computer Applications",place:"DAV College",detail:"Muzaffarnagar, Uttar Pradesh",endYear:"2024"},
];
export const EXPERIENCE = [{
 year:"2026",title:"Full-Stack Developer Intern",place:"Unified Mentor",
 details:[
  "Built CivicPulse, the Ex-Servicemen Portal and Chroma Studio during my internship at Unified Mentor.",
  "Developed CivicPulse for photo-based infrastructure reporting, map locations, role-based dashboards and repair progress tracking.",
  "Built the Ex-Servicemen Portal for veteran careers, training, skills and application management.",
  "Created Chroma Studio with room-photo wall selection, paint previews, before/after comparison and design export.",
  "Also developed a Q&A application with authentication, search and voting-based answer ranking, and built responsive interfaces using HTML, CSS and JavaScript.",
 ],projects:["civicpulse","veerpath","chroma"],
}];
export type Project = {
 id:string;index:string;year:string;title:string;kicker:string;description:string;
 features:string[];tech:string[];github:string;live:string;
 kind:"civic"|"veterans"|"paint"|"team"|"heritage";internship?:boolean;
};
export const PROJECTS:Project[] = [
 {id:"civicpulse",index:"01",year:"2026",title:"CivicPulse",kicker:"Infrastructure Reporting Platform",kind:"civic",internship:true,
 description:"A citizen-to-city workspace that turns photo-based infrastructure reports into trackable repairs, with dedicated citizen, organization and administrator dashboards.",
 features:["Photo reports & map locations","Repair assignment & progress","Role-based access & approvals","Search, filters & CSV exports"],
 tech:["Next.js","React","TypeScript","PostgreSQL","Leaflet"],
 live:"https://public-infrastructure-damage-report-azure.vercel.app/",
 github:"https://github.com/abhikashyap9284/Public-Infrastructure-Damage-Reporting-System"},
 {id:"veerpath",index:"02",year:"2026",title:"Ex-Servicemen Portal",kicker:"VeerPath · Veteran Career Platform",kind:"veterans",internship:true,
 description:"A responsive platform that brings veteran careers, training, skills and applications into one accessible, authenticated workspace.",
 features:["Jobs & career opportunities","Training & skills","Application management","Authenticated workspaces"],
 tech:["Next.js","React","TypeScript","MongoDB"],
 live:"https://ex-servicemen-portal.vercel.app/",github:"https://github.com/abhikashyap9284/EX-Servicemen-Portal"},
 {id:"chroma",index:"03",year:"2026",title:"Smart Wall Paint Visualizer",kicker:"Chroma Studio · Interior Design Tool",kind:"paint",internship:true,
 description:"An interactive room-photo editor for trying paint shades and patterns before painting, with precise wall selection and saved design projects.",
 features:["Polygon & brush selection","Shade and pattern previews","Undo/redo & before/after","PNG export & cloud projects"],
 tech:["Angular","TypeScript","HTML Canvas","Express","PostgreSQL"],
 live:"https://public-infrastructure-damage-report-inky.vercel.app/",github:"https://github.com/abhikashyap9284/Smart-Wall-Paint-Visualizer"},
 {id:"teamflow",index:"04",year:"2026",title:"TeamFlow Pro",kicker:"Project Management Workspace",kind:"team",
 description:"A team workspace for managing projects, assigning tasks and following priorities, status boards and overview metrics in a responsive dashboard.",
 features:["Projects & task assignments","Priorities & status boards","Overview metrics","Admin & member permissions"],
 tech:["Next.js","React","TypeScript","Prisma","PostgreSQL"],
 live:"https://teamflow-pro-one.vercel.app/",github:"https://github.com/abhikashyap9284/teamflow-pro"},
 {id:"heritage",index:"05",year:"2026",title:"Heritage Atlas",kicker:"Interactive Heritage Guide",kind:"heritage",
 description:"A digital guide for exploring heritage through curated trails, interactive maps and spoken stories, with QR access and artistic 3D landmark previews.",
 features:["Curated heritage trails","Interactive route maps","English & Hindi narration","QR access & 3D previews"],
 tech:["Next.js","React","TypeScript"],
 live:"https://heritage-atlas-gray.vercel.app/",github:"https://github.com/abhikashyap9284/Heritage-Atlas-"},
];
export const CERTIFICATIONS = [{title:"Full Stack Developer",issuer:"Unified Mentor"},{title:"Mastering Data Structure and Algorithms",issuer:"Udemy"},{title:"Web Development",issuer:"Udemy"}];
export const ACHIEVEMENTS:{label:string;detail:string;value?:number}[] = [];
export type Skill={name:string;symbol:string;family:string};
const group=(family:string,entries:[string,string][])=>({family,skills:entries.map(([name,symbol])=>({name,symbol,family}))});
export const SKILL_GROUPS:{family:string;skills:Skill[]}[] = [
 group("Languages",[["JavaScript","Js"],["TypeScript","Ts"],["SQL","Sq"],["C++","Cp"]]),
 group("Frontend",[["React","Re"],["Next.js","Nx"],["Angular","Ng"],["HTML5","Ht"],["CSS3","Cs"],["Bootstrap","Bs"]]),
 group("Backend",[["Node.js","No"],["Express","Ex"],["REST APIs","Ap"]]),
 group("Databases",[["PostgreSQL","Pg"],["MongoDB","Mo"],["Prisma","Pr"]]),
 group("Tools",[["Git","Gt"],["GitHub","Gh"],["Vercel","Ve"],["VS Code","Vs"]]),
 group("Concepts",[["JWT","Jw"],["Role-based access","Ra"],["Authentication","Au"]]),
];
export const NAV=[{id:"about",label:"About"},{id:"skills",label:"Skills"},{id:"work",label:"Work"},{id:"experience",label:"Experience"},{id:"contact",label:"Contact"}];
export const SECTION_TEXT={about:{tag:"01 — A little introduction",title:"The person behind the",accent:"code."},skills:{tag:"02 — My toolkit",title:"The periodic table of my",accent:"stack."},work:{tag:"03 — Selected work",title:"Ideas, brought",accent:"to life."},certifications:{tag:"04 — Certifications",title:"Always",accent:"learning."},experience:{tag:"05 — Education & experience",title:"Every step, a little",accent:"further."},contact:{tag:"06 — Get in touch",title:"Let’s build something",accent:"together."}};
export const UI={heroLabel:"Developer / Portfolio",workLabel:"Explore work",contactLabel:"Let’s talk",resumeLabel:"Résumé ↓",idFront:"DEVELOPER ID",idBack:"WHAT I AM",skillsNote:"Select an element to explore the stack.",next:"Next — Your team?",illustration:"UI preview",footer:"Built with Next.js"};

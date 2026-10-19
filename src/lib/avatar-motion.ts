export type AvatarAction = "auto" | "typing" | "coffee" | "stretch" | "wave";
export type Point3 = [number, number, number];
const clamp = (v:number) => Math.max(0,Math.min(1,v));
const ease = (v:number) => { const x=clamp(v);return x*x*(3-2*x); };
export const blendPoint=(a:Point3,b:Point3,t:number):Point3=>a.map((v,i)=>v+(b[i]-v)*t) as Point3;
export const MUG_REST:Point3=[.66,1.145,.38];
export function actionAt(action:AvatarAction,seconds:number) {
  if(action!=="auto") return {action,local:seconds%({typing:14,coffee:7,stretch:9,wave:6}[action]),duration:({typing:14,coffee:7,stretch:9,wave:6}[action])};
  const schedule:[Exclude<AvatarAction,"auto">,number][]=[["typing",14],["coffee",7],["typing",9],["stretch",9],["typing",9],["wave",6]];
  let local=seconds%54;
  for(const [name,duration] of schedule){if(local<duration)return {action:name,local,duration};local-=duration;}
  return {action:"typing" as const,local:0,duration:14};
}
export function poseAt(action:AvatarAction,seconds:number) {
  const phase=actionAt(action,seconds);
  const ramp=phase.action==="stretch"?1.8:1.25;
  const envelope=ease(phase.local/ramp)*ease((phase.duration-phase.local)/ramp);
  const standing=phase.action==="stretch"?envelope:0;
  const sipping=phase.action==="coffee"?envelope:0;
  const waving=phase.action==="wave"?envelope:0;
  const hips:Point3=[0,.82+standing*.47,-.17-standing*.10];
  const shoulderY=hips[1]+.69;
  const typing=phase.action==="typing"?1:1-envelope;
  const leftBase:Point3=[-.19,1.145+Math.sin(seconds*10)*.007*typing,.49];
  const rightBase:Point3=[.19,1.145+Math.sin(seconds*10+1.6)*.007*typing,.49];
  const mug=blendPoint(MUG_REST,[.10,hips[1]+.74,.28],sipping);
  const pickup=phase.action==="coffee"?ease(phase.local/.45)*ease((phase.duration-phase.local)/.45):0;
  let right=blendPoint(rightBase,[mug[0]+.12,mug[1]+.03,mug[2]],pickup);
  right=blendPoint(right,[.63,shoulderY+.40,.05+Math.sin(seconds*7)*.025],waving);
  const left=blendPoint(leftBase,[-.49,shoulderY+.51,hips[2]+.04],standing);
  right=blendPoint(right,[.49,shoulderY+.51,hips[2]+.04],standing);
  return {phase,hips,shoulderY,typing,standing,sipping,waving,mug,left,right};
}
// Two-bone IK keeps elbows connected and limits reach to physical arm lengths.
export function solveArm(shoulder:Point3,target:Point3,side:number):{elbow:Point3;wrist:Point3} {
  const upper=.37,lower=.38;
  const d=target.map((v,i)=>v-shoulder[i]);
  const raw=Math.hypot(...d)||.001;
  const distance=Math.min(upper+lower-.001,Math.max(.03,raw));
  const dir=d.map(v=>v/raw);
  const along=(upper*upper-lower*lower+distance*distance)/(2*distance);
  const height=Math.sqrt(Math.max(0,upper*upper-along*along));
  const bend=[side,.06,.04];
  const dot=bend.reduce((v,x,i)=>v+x*dir[i],0);
  const normal=bend.map((v,i)=>v-dir[i]*dot);
  const n=Math.hypot(...normal)||1;
  const elbow=shoulder.map((v,i)=>v+dir[i]*along+normal[i]/n*height) as Point3;
  const wrist=shoulder.map((v,i)=>v+dir[i]*distance) as Point3;
  return {elbow,wrist};
}

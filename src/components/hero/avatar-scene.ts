import * as THREE from "three";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";
import {poseAt,solveArm,blendPoint,type AvatarAction,type Point3} from "@/lib/avatar-motion";

export type WorkstationController={setRunning:(v:boolean)=>void;setAction:(v:AvatarAction)=>void;setReducedMotion:(v:boolean)=>void;dispose:()=>void};
type Options={onReady:()=>void;onError:()=>void};
export function createWorkstation(host:HTMLDivElement,options:Options):WorkstationController {
  const scene=new THREE.Scene();
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setClearColor(0x000000,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
  renderer.domElement.setAttribute("aria-hidden","true");
  host.appendChild(renderer.domElement);
  const camera=new THREE.OrthographicCamera(-2,2,1.65,-1.65,.1,30);
  camera.position.set(3.5,2.9,6.8);camera.lookAt(0,1.33,.12);
  scene.add(new THREE.HemisphereLight(0xfff7ed,0xc5c9cb,2.4));
  const key=new THREE.DirectionalLight(0xfff4e9,3.8);key.position.set(-3,6,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=4;key.shadow.camera.bottom=-2;key.shadow.normalBias=.025;key.shadow.bias=-.0004;scene.add(key);
  const fill=new THREE.DirectionalLight(0xdce7ff,1.4);fill.position.set(4,3,-1);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffffff,2);rim.position.set(-1,4,-4);scene.add(rim);
  const materials:THREE.Material[]=[];const textures:THREE.Texture[]=[];
  const material=(color:string,roughness=.7,metalness=0)=>{const m=new THREE.MeshStandardMaterial({color,roughness,metalness});materials.push(m);return m;};
  const skin=material("#be8b67",.72),skinWarm=material("#bb805c"),hair=material("#24201f",.9),hairLight=material("#302927",.9);
  const white=material("#f5f3ef"),cloth=material("#e5e3dd"),pants=material("#27282b"),dark=material("#222326"),chairMat=material("#71716e"),metal=material("#6b6d70",.35,.7),deskMat=material("#efede5",.47),eyeWhite=material("#f0e9e1",.45),iris=material("#453326",.38);
  const sphereGeo=new THREE.SphereGeometry(1,28,20);
  const cylinderGeo=new THREE.CylinderGeometry(1,1,1,16);
  function mesh(geo:THREE.BufferGeometry,mat:THREE.Material,parent:THREE.Object3D=scene){const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function ellipsoid(parent:THREE.Object3D,mat:THREE.Material,position:Point3,scale:Point3){const m=mesh(sphereGeo,mat,parent);m.position.set(...position);m.scale.set(...scale);return m;}
  function box(parent:THREE.Object3D,mat:THREE.Material,position:Point3,size:Point3,radius=.04){const m=mesh(new RoundedBoxGeometry(...size,3,radius),mat,parent);m.position.set(...position);return m;}
  function segment(parent:THREE.Object3D,mat:THREE.Material,radius:number){const m=mesh(cylinderGeo,mat,parent);m.scale.set(radius,1,radius);return m;}
  const up=new THREE.Vector3(0,1,0),a=new THREE.Vector3(),b=new THREE.Vector3(),direction=new THREE.Vector3();
  function connect(m:THREE.Mesh,from:Point3,to:Point3,radius:number){a.set(...from);b.set(...to);direction.subVectors(b,a);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,direction.clone().normalize());m.scale.set(radius,direction.length(),radius);}
  const floor=mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({opacity:.14}));materials.push(floor.material as THREE.Material);floor.rotation.x=-Math.PI/2;floor.position.y=.012;floor.castShadow=false;
  // Desk and laptop are separate from the character, so standing never moves the furniture.
  const desk=new THREE.Group();scene.add(desk);
  box(desk,deskMat,[0,1.055,.62],[2.16,.085,1.03],.035);
  for(const x of [-.93,.93]) for(const z of [.21,1.02]) box(desk,white,[x,.52,z],[.055,1.03,.055],.012);
  box(desk,cloth,[0,.91,.25],[1.89,.14,.04],.01);
  const deskPad=material("#d2d0c9");box(desk,deskPad,[0,1.102,.60],[1.30,.012,.73],.045);
  const laptop=new THREE.Group();laptop.position.set(-.10,1.122,.52);desk.add(laptop);
  box(laptop,metal,[0,0,.04],[.94,.035,.62],.025);
  box(laptop,dark,[0,.021,.0],[.81,.008,.32],.015);
  const keyMat=material("#414247",.4);
  for(let row=0;row<4;row++) for(let col=0;col<11;col++) box(laptop,keyMat,[-.355+col*.071,.029,-.115+row*.069],[.057,.005,.049],.004);
  box(laptop,metal,[0,.023,.217],[.30,.007,.125],.012);
  const screen=new THREE.Group();screen.position.set(0,.005,.34);screen.rotation.x=-.18;laptop.add(screen);
  box(screen,dark,[0,.295,0],[.95,.61,.038],.025);
  const code=document.createElement("canvas");code.width=640;code.height=400;const ctx=code.getContext("2d")!;
  ctx.fillStyle="#1f2428";ctx.fillRect(0,0,640,400);ctx.fillStyle="#30363b";ctx.fillRect(0,0,640,35);
  for(let i=0;i<3;i++){ctx.fillStyle=["#b2a292","#c4bbaa","#a4b6a2"][i];ctx.beginPath();ctx.arc(17+i*17,17,4,0,7);ctx.fill();}
  ctx.font="17px monospace";ctx.fillStyle="#8e9b8f";ctx.fillText("portfolio.tsx",80,24);
  const lines=["const developer = {","  name: 'Abhi',","  focus: 'Thoughtful interfaces',","  stack: ['React', 'Next.js'],","};","","function buildSomething() {","  return <Ideas comeToLife />;","}"];
  lines.forEach((line,i)=>{ctx.fillStyle=i%3===0?"#d7b58d":"#b8c5b6";ctx.fillText(line,45,80+i*31);});
  const screenTexture=new THREE.CanvasTexture(code);screenTexture.colorSpace=THREE.SRGBColorSpace;textures.push(screenTexture);
  const screenMat=new THREE.MeshBasicMaterial({map:screenTexture});materials.push(screenMat);
  const display=mesh(new THREE.PlaneGeometry(.87,.53),screenMat,screen);display.position.set(0,.30,-.022);display.rotation.y=Math.PI;
  const monogram=document.createElement("canvas");monogram.width=256;monogram.height=256;const logo=monogram.getContext("2d")!;
  logo.clearRect(0,0,256,256);logo.strokeStyle="#aaa9a4";logo.lineWidth=4;logo.beginPath();logo.arc(128,128,85,0,7);logo.stroke();logo.fillStyle="#c6c4bd";logo.font="500 64px sans-serif";logo.textAlign="center";logo.textBaseline="middle";logo.fillText("AK",128,132);
  const logoTexture=new THREE.CanvasTexture(monogram);textures.push(logoTexture);const logoMat=new THREE.MeshBasicMaterial({map:logoTexture,transparent:true});materials.push(logoMat);
  const laptopLogo=mesh(new THREE.PlaneGeometry(.17,.17),logoMat,screen);laptopLogo.position.set(0,.31,.023);laptopLogo.castShadow=false;
  // A small plant anchors the composition without competing with the face.
  const potMat=material("#b5afa4"),leafMat=material("#616b55");
  const pot=mesh(new THREE.CylinderGeometry(.085,.065,.15,24),potMat,desk);pot.position.set(-.85,1.19,.93);
  for(let i=0;i<7;i++){const angle=i*2.4;const leaf=ellipsoid(desk,leafMat,[-.85+Math.cos(angle)*.05,1.31+(i%3)*.025,.93+Math.sin(angle)*.05],[.025,.10,.045]);leaf.rotation.set(Math.sin(angle)*.5,angle,Math.cos(angle)*.55);}
  const chair=new THREE.Group();scene.add(chair);box(chair,chairMat,[0,.74,-.19],[.69,.14,.63],.10);box(chair,chairMat,[0,1.12,-.47],[.68,.73,.11],.11);
  for(const x of [-.28,.28]) for(const z of [-.43,.03]) box(chair,dark,[x,.38,z],[.038,.71,.038],.012);
  const mug=new THREE.Group();scene.add(mug);const mugMat=material("#ded9cc",.32);
  const cupWall=mesh(new THREE.CylinderGeometry(.079,.063,.15,32,1,true),mugMat,mug);cupWall.position.y=.028;
  const rimGeo=new THREE.TorusGeometry(.078,.006,10,32);const mugRim=mesh(rimGeo,mugMat,mug);mugRim.rotation.x=Math.PI/2;mugRim.position.y=.103;
  const coffee=mesh(new THREE.CircleGeometry(.072,32),material("#38261c",.25),mug);coffee.rotation.x=-Math.PI/2;coffee.position.y=.091;
  const handle=mesh(new THREE.TorusGeometry(.048,.012,10,22),mugMat,mug);handle.position.set(.091,.033,0);handle.rotation.y=Math.PI/2;
  const bottom=mesh(new THREE.CircleGeometry(.063,24),mugMat,mug);bottom.rotation.x=-Math.PI/2;bottom.position.y=-.046;
  const body=new THREE.Group();scene.add(body);
  const pelvis=ellipsoid(body,pants,[0,.86,-.15],[.25,.17,.20]);
  const torso=new THREE.Group();scene.add(torso);
  ellipsoid(torso,white,[0,.34,0],[.30,.40,.19]);
  box(torso,white,[0,.08,.015],[.46,.22,.31],.08);
  const placket=box(torso,cloth,[0,.37,.182],[.024,.49,.012],.006);
  for(let i=0;i<4;i++) ellipsoid(torso,cloth,[.007,.17+i*.13,.197],[.012,.012,.005]);
  for(const s of [-1,1]){const collar=box(torso,white,[s*.077,.67,.125],[.12,.16,.045],.025);collar.rotation.z=s*.43;}
  const neck=ellipsoid(torso,skin,[0,.73,0],[.105,.16,.10]);
  const head=new THREE.Group();torso.add(head);head.position.set(0,.99,0);head.scale.setScalar(.92);
  ellipsoid(head,skin,[0,.015,0],[.285,.345,.265]);
  ellipsoid(head,skin,[0,-.185,.015],[.225,.175,.216]);
  for(const side of [-1,1]){ellipsoid(head,skin,[side*.282,-.012,-.005],[.047,.081,.045]);ellipsoid(head,skinWarm,[side*.300,-.013,.018],[.019,.048,.025]);}
  ellipsoid(head,skinWarm,[0,-.010,.261],[.037,.071,.045]);ellipsoid(head,skin,[0,-.047,.284],[.05,.033,.034]);
  const eyelids:THREE.Group[]=[];const pupils:THREE.Mesh[]=[];
  for(const side of [-1,1]){
    const eye=new THREE.Group();eye.position.set(side*.103,.055,.243);head.add(eye);eyelids.push(eye);
    ellipsoid(eye,eyeWhite,[0,0,0],[.056,.025,.019]);ellipsoid(eye,iris,[side*.002,-.001,.018],[.022,.022,.006]);
    pupils.push(ellipsoid(eye,dark,[side*.002,-.001,.024],[.013,.017,.003]));ellipsoid(eye,white,[-.007,.007,.028],[.005,.005,.002]);
    const brow=ellipsoid(head,hair,[side*.104,.119,.228],[.077,.013,.018]);brow.rotation.z=side*.06;
    const mustache=ellipsoid(head,hair,[side*.037,-.104,.253],[.052,.012,.012]);mustache.rotation.z=side*.08;
  }
  ellipsoid(head,material("#9f6651",.8),[0,-.145,.246],[.062,.009,.012]);
  ellipsoid(head,skin,[0,-.170,.232],[.060,.009,.014]);
  // A smooth jawline and swept fringe reflect the supplied portrait's hair and beard.
  const jaw=new THREE.CatmullRomCurve3([new THREE.Vector3(-.24,-.05,.10),new THREE.Vector3(-.215,-.19,.14),new THREE.Vector3(-.12,-.265,.17),new THREE.Vector3(0,-.29,.18),new THREE.Vector3(.12,-.265,.17),new THREE.Vector3(.215,-.19,.14),new THREE.Vector3(.24,-.05,.10)]);
  mesh(new THREE.TubeGeometry(jaw,40,.023,10,false),hairLight,head);
  for(const side of [-1,1]) for(let i=0;i<6;i++)ellipsoid(head,hairLight,[side*(.24-i*.002),-.04-i*.022,.106+i*.012],[.019,.023,.021]);
  ellipsoid(head,hair,[0,.19,-.05],[.29,.24,.24]);
  for(let i=0;i<26;i++){
    const angle=i*2.39996;const r=Math.sqrt((i+.5)/26);const x=Math.cos(angle)*r*.28,z=Math.sin(angle)*r*.22-.015;
    const curl=ellipsoid(head,i%4===0?hairLight:hair,[x,.34+(1-r)*.08,z],[.12,.055,.073]);curl.rotation.z=-.35+Math.sin(i)*.12;curl.rotation.y=.2;
  }
  for(let i=0;i<6;i++){const lock=ellipsoid(head,i%2?hair:hairLight,[-.22+i*.075,.25+Math.sin(i*.55)*.055,.17],[.105,.043,.09]);lock.rotation.z=-.38;}
  const limbs=[-1,1].map(side=>{
    const upper=segment(scene,white,.083),forearm=segment(scene,skin,.057),cuff=segment(scene,cloth,.067);
    const shoulder=ellipsoid(scene,white,[0,0,0],[.092,.10,.09]);
    const elbow=ellipsoid(scene,skin,[0,0,0],[.058,.058,.058]);
    const hand=new THREE.Group();scene.add(hand);ellipsoid(hand,skin,[0,0,0],[.060,.031,.082]);
    const fingers:THREE.Mesh[]=[];
    for(let j=0;j<4;j++){const finger=ellipsoid(hand,skin,[-.039+j*.024,-.007,.087],[.012,.016,.053-(Math.abs(1.4-j))*.006]);fingers.push(finger);}
    const thumb=ellipsoid(hand,skin,[side*.064,-.002,.022],[.020,.024,.044]);thumb.rotation.y=side*.5;
    const thigh=segment(scene,pants,.107),shin=segment(scene,pants,.084),knee=ellipsoid(scene,pants,[0,0,0],[.099,.10,.096]);
    const shoe=new THREE.Group();scene.add(shoe);box(shoe,white,[0,.018,.060],[.18,.14,.37],.06);box(shoe,cloth,[0,-.043,.067],[.19,.041,.38],.018);
    for(let j=0;j<3;j++)box(shoe,cloth,[0,.082,.02+j*.045],[.105,.006,.012],.004);
    return {side,upper,forearm,cuff,shoulder,elbow,hand,fingers,thigh,shin,knee,shoe};
  });
  let elapsed=0,action:AvatarAction="auto",running=false,reduced=false,disposed=false,raf=0,last=0,drawAt=0;
  let pointerX=0,pointerY=0;
  function renderPose(time:number){
    const p=poseAt(action,time);
    pelvis.position.set(p.hips[0],p.hips[1]+.02,p.hips[2]);
    torso.position.set(...p.hips);torso.position.y+=Math.sin(time*1.8)*.004;
    torso.rotation.z=Math.sin(time*.9)*.006*(1-p.standing);torso.rotation.x=.035*(1-p.standing);
    head.rotation.y=.18+Math.sin(time*.47)*.025+pointerX*.10;
    head.rotation.x=.055+p.sipping*-.12+p.standing*-.10+pointerY*.025;
    head.rotation.z=Math.sin(time*.8)*.018*(1-p.sipping);
    const blinkTime=time%4.7;const blink=blinkTime<.16?1-Math.sin(blinkTime/.16*Math.PI)*.95:1;
    eyelids.forEach(e=>e.scale.y=blink);pupils.forEach(e=>e.position.x=pointerX*.008);
    mug.position.set(...p.mug);mug.rotation.x=p.sipping*-.36;mug.rotation.z=p.sipping*.18;
    chair.position.z=-p.standing*.14;
    for(const l of limbs){
      const s:Point3=[l.side*.285,p.shoulderY,p.hips[2]+.025];
      const target=l.side<0?p.left:p.right;
      const arm=solveArm(s,target,l.side);
      connect(l.upper,s,arm.elbow,.081);connect(l.forearm,arm.elbow,arm.wrist,.054);
      connect(l.cuff,blendPoint(s,arm.elbow,.82),arm.elbow,.077);
      l.shoulder.position.set(...s);l.elbow.position.set(...arm.elbow);l.hand.position.set(...arm.wrist);
      l.hand.rotation.set(-.06+p.standing*.7+(l.side>0?p.waving*-.9:0),0,l.side*.07+(l.side>0?Math.sin(time*8)*p.waving*.28:0));
      l.fingers.forEach((f,j)=>f.rotation.x=Math.sin(time*11+j*1.7+l.side)*.14*p.typing);
      const hip:Point3=[l.side*.145,p.hips[1]-.02,p.hips[2]+.02];
      const knee=blendPoint([l.side*.20,.49,.29],[l.side*.19,.68,-.23],p.standing);
      const ankle=blendPoint([l.side*.22,.14,.33],[l.side*.22,.14,-.16],p.standing);
      connect(l.thigh,hip,knee,.103);connect(l.shin,knee,ankle,.079);l.knee.position.set(...knee);l.shoe.position.set(...ankle);l.shoe.position.y=.09;l.shoe.rotation.y=l.side*.10;
    }
    renderer.render(scene,camera);
  }
  function tick(now:number){
    if(disposed||!running||reduced)return;
    const delta=Math.min((now-last)/1000,.06);last=now;elapsed+=delta;
    if(now-drawAt>=1000/30){renderPose(elapsed);drawAt=now;}
    raf=requestAnimationFrame(tick);
  }
  function setRunning(value:boolean){
    running=value;cancelAnimationFrame(raf);
    if(running&&!reduced&&!disposed){last=performance.now();raf=requestAnimationFrame(tick);}
  }
  function resize(){
    if(disposed)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    renderer.setSize(w,h);const aspect=w/h;const halfHeight=Math.max(1.49,1.67/aspect);
    camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();renderPose(elapsed);
  }
  const observer=new ResizeObserver(resize);observer.observe(host);
  const move=(event:PointerEvent)=>{const rect=host.getBoundingClientRect();pointerX=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));pointerY=(event.clientY-rect.top)/rect.height*2-1;};
  const leave=()=>{pointerX=0;pointerY=0;};
  const lost=(event:Event)=>{event.preventDefault();setRunning(false);options.onError();};
  host.addEventListener("pointermove",move);host.addEventListener("pointerleave",leave);renderer.domElement.addEventListener("webglcontextlost",lost);
  resize();renderPose(2);options.onReady();
  return {
    setRunning,
    setAction(value){action=value;elapsed=reduced?2:0;renderPose(elapsed);},
    setReducedMotion(value){reduced=value;setRunning(running);if(value)renderPose(2);},
    dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();host.removeEventListener("pointermove",move);host.removeEventListener("pointerleave",leave);renderer.domElement.removeEventListener("webglcontextlost",lost);const geometries=new Set<THREE.BufferGeometry>();scene.traverse(o=>{if(o instanceof THREE.Mesh)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();},
  };
}

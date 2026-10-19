import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import Module from 'node:module';
import ts from 'typescript';
import vm from 'node:vm';
function loadTS(file){const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const m=new Module(file);m._compile(code,file);return m.exports;}
const data=loadTS('src/lib/data.ts');
const theme=loadTS('src/lib/theme.ts');
for(const stored of ['dark','light',null,'invalid','blocked']){
 const root={dataset:{},style:{}};
 const localStorage={getItem(){if(stored==='blocked')throw new Error('Storage disabled');return stored;}};
 vm.runInNewContext(theme.THEME_BOOTSTRAP,{document:{documentElement:root},localStorage});
 assert.equal(root.dataset.theme,stored==='dark'?'dark':'light');
 assert.equal(root.style.colorScheme,root.dataset.theme);
}
const themeRoot={dataset:{},style:{}};let savedTheme;let chromeColor;
globalThis.document={documentElement:themeRoot,querySelector(){return {setAttribute(k,v){chromeColor=v;}};}};
globalThis.localStorage={setItem(key,value){assert.equal(key,theme.THEME_KEY);savedTheme=value;}};
for(const mode of ['dark','light']){theme.applyTheme(mode);assert.equal(themeRoot.dataset.theme,mode);assert.equal(savedTheme,mode);assert.equal(chromeColor,mode==='dark'?'#121313':'#f4f2ee');}
globalThis.localStorage.setItem=()=>{throw new Error('Storage disabled');};
assert.doesNotThrow(()=>theme.applyTheme('dark'));assert.equal(themeRoot.dataset.theme,'dark');
delete globalThis.document;delete globalThis.localStorage;
assert.equal(data.PROJECTS.length,5);
const expected=['https://public-infrastructure-damage-report-azure.vercel.app/','https://ex-servicemen-portal.vercel.app/','https://public-infrastructure-damage-report-inky.vercel.app/','https://teamflow-pro-one.vercel.app/','https://heritage-atlas-gray.vercel.app/'];
assert.deepEqual(data.PROJECTS.map(p=>p.live),expected);
assert.deepEqual(data.EXPERIENCE[0].projects,data.PROJECTS.slice(0,3).map(p=>p.id));
for(const p of data.PROJECTS){assert.equal(new URL(p.github).host,'github.com');assert.equal(p.features.length,4);}
const html=fs.readFileSync('out/index.html','utf8');
for(const p of data.PROJECTS){assert(html.includes(`id="project-${p.id}"`));assert(html.includes(`href="${p.live}"`));assert(html.includes(`href="${p.github}"`));}
assert.equal((html.match(/class="portfolio-project /g)||[]).length,5);
assert(html.includes('Full-Stack Developer Intern'));
assert(html.includes('Bachelor of Computer Applications'));
assert(data.CERTIFICATIONS.some(c=>c.title==='Full Stack Developer'&&c.issuer==='Unified Mentor'));
assert.equal(data.CERTIFICATIONS.length,3);
assert(html.includes('class="work-sprite"'));
assert(html.includes('Toggle dark mode'));
assert(!fs.readFileSync('src/components/hero/Hero.tsx','utf8').includes('import Workstation'));
assert(html.includes('laptop-work 2.8s steps(1,end) infinite'));
assert(html.includes('prefers-reduced-motion:reduce'));
assert(html.includes(theme.THEME_KEY));
assert(!/Myntra-Inspired|Netflix-Inspired|Experience document/.test(html));
assert(!/<(?:video|audio)[ >]/.test(html));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/resume.pdf')).digest('hex'),crypto.createHash('sha256').update(fs.readFileSync('out/resume.pdf')).digest('hex'));
console.log('Passed: all project links, resume, original sprite animation, Unified Mentor certification, theme persistence and storage-denied fallback.');

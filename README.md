# Abhi — Full Stack Developer portfolio

Updated 19 October 2026 using the supplied resume and Abhi's project links. The original off-white, black and gray visual style, local fonts, identity card, skills table and contact section are retained.

## Run

Requires Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Production verification:

```bash
npm run typecheck
npm run build
npm run verify
```

This project exports a static site to `out/`. The downloadable resume at `/resume.pdf` is the exact supplied PDF, unchanged.

## What's updated

- Five projects: CivicPulse, Ex-Servicemen Portal (VeerPath), Smart Wall Paint Visualizer (Chroma Studio), TeamFlow Pro, and Heritage Atlas.
- Each project has a clickable preview and name, a Live website button, and its verified public GitHub repository. External links open in a new tab.
- The card illustrations are labeled **UI preview**. They are portfolio illustrations, not screenshots or live dashboards.
- The first three projects in Abhi's supplied order are attributed to the Unified Mentor internship: CivicPulse, Ex-Servicemen Portal and Chroma Studio. TeamFlow and Heritage Atlas are presented as selected projects without that attribution.
- Summary, skills, MCA/BCA education and the internship role now match the latest resume. Internship project attribution is from Abhi's explicit instruction.
- No invented employment dates, certificate links, client statistics, awards or proficiency percentages.
- The original eight-frame laptop typing/blinking animation is restored using the exact original sprite sheet. The larger hero placement is retained, with the original pause/resume control and offscreen/reduced-motion behavior.
- Light and dark themes are available from the sun/moon button in the navigation. Light remains the default; a saved choice is restored before paint and survives reloads. The toggle works even when browser storage is disabled.
- Project cards rise and scale smoothly on hover or keyboard focus, with a larger preview, floating open-site label and soft shadow. Reduced motion disables these transforms.
- Certifications now include **Full Stack Developer — Unified Mentor**, alongside the existing Udemy entries. No certificate URL or date was invented.

## Deploy to the existing Vercel project

Use the existing Vercel project for `abhi-portfolio-hazel.vercel.app`; do not create a replacement project if you want to retain that address.

From this project directory in PowerShell:

```powershell
npm ci
npm run build
npx vercel link
npx vercel --prod
```

When linking, choose the existing project connected to the portfolio address. For a Git-connected project, copy these source files into the repository and push to its production branch instead. Keep `.git`, `.vercel` and existing environment files from your own checkout; never copy or commit another account's deployment credentials.

The framework is Next.js. The build command is `npm run build`; static output is `out`. `vercel.json` includes these settings. The site needs no database or server secrets. Optional `NEXT_PUBLIC_SITE_URL` sets the absolute URL used by social metadata; the default is the supplied Vercel address.

## Editing

| File | Purpose |
| --- | --- |
| `src/lib/data.ts` | Profile, projects, live/repository links, education, skills, internship |
| `public/resume.pdf` | Resume download |
| `src/components/sections/Work.tsx` | Project cards and labeled UI illustrations |
| `src/components/hero/Hero.tsx` | Hero layout and artwork size |
| `src/components/ui/ThemeToggle.tsx` | Theme switch |
| `src/lib/theme.ts` | Saved preference, pre-paint restoration and storage fallback |
| `src/app/globals.css` | Shared colors, typography and spacing |

## Verification

Executed for this update:

- TypeScript and Next.js production export.
- Content checks for all five live/repository links, internship attribution, original sprite animation and three certifications.
- Theme checks for saved dark/light preferences, invalid values and storage-denied behavior.
- The resume and original sprite assets are retained unchanged.

Interactive browser, desktop/mobile appearance and Lighthouse checks remain unverified in this environment. Optional Playwright checks are included in `scripts/browser-check.mjs` and require Playwright installed separately.

Manual review:

1. Check desktop, tablet and phone layouts for horizontal scrolling.
2. Play/pause the original laptop animation and enable reduced motion.
3. Switch to dark mode, reload, switch to light mode and check the mobile navigation.
4. Hover or keyboard-focus a project card, then open its live and code links.
5. Download the resume and confirm all three certifications appear.

## Credits

The portrait, original video and resume were supplied by the user. The original generated laptop sprite is used in the hero; its original prompt is in `source-assets/`. The UI illustrations were authored for this project. Devicon assets and licenses remain in `public/logos/`; the font OFL licenses remain in `src/fonts/`. Product names and logos belong to their respective owners.

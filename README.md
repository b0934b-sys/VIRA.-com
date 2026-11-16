# VIRAStudiopro — International flagship site

English, Awwwards-level website for **VIRAStudiopro**, a digital studio that builds
websites, digital systems and AI products. Projects start at $1,000.

Design reference: the LUSION hero — a giant golden-ringed 3D rock over a black
cinematic sky, editorial Didone serif headlines, black & champagne-gold identity.

## Stack (all free, MIT)

- Vite 8 + React 19
- Three.js + React Three Fiber + Drei (procedural 3D — no paid assets)
- GSAP + ScrollTrigger (hero slider, scroll reveals, camera moves)
- Playfair Display + Inter (self-hosted via Fontsource)

## Sections

Hero (4-slide 3D slider) · Services · Work (6 live projects) · Studio story ·
Process (3 steps) · Contact (WhatsApp + email)

## Run

```bash
npm install
npm run dev      # local preview
npm run build    # production build -> dist/
```

## Deploy (Vercel)

Connect this repo to Vercel, or deploy the `dist/` output with the Vercel CLI.
No environment variables, no APIs, no paid services.

## Performance

- The Three.js scene is code-split (`React.lazy`) — the main bundle is ~118 KB gzip.
- The WebGL loop pauses when the hero scrolls off-screen.
- Mobile gets a lighter scene (fewer particles, lower DPR, pulled-back camera).
- `prefers-reduced-motion` disables the slider autoplay and GSAP motion.
- If WebGL is unavailable, a CSS gradient hero is shown instead.

## Owner

VIRAStudiopro — Damascus, Syria · virastudiopro@gmail.com · WhatsApp +963 982 238 734

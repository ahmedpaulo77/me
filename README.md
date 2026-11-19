# Ahmed Abdelmaqsoud — Portfolio

Personal portfolio for **Ahmed Abdelmaqsoud (Ahmed Paulo)** — front-end developer specialized in **React.js & Firebase**.

Live: https://ahmedpaulo77.github.io/me/

## Stack

- **React 19** (Create React App)
- **Firebase** (Auth / Firestore) across production projects
- **Vite** for newer projects (SaaS PRO, Elkwayra, Law Office, Shiny Dental)
- **CSS** with custom design system (no UI framework)
- **GitHub Pages** for hosting (`gh-pages`)

## Sections

| Section | Description |
| --- | --- |
| Hero | Typing headline, quick links (GitHub, WhatsApp, Email) |
| About | Bio, role, education, availability |
| Skills | HTML/CSS/JS, React, React Router, Firebase, Vite, Git, Framer Motion, Three.js, GSAP, Vitest |
| Projects | 14 live projects with stack tags and direct links |
| Contact | WhatsApp, email, GitHub |

## Featured projects

1. **SaaS PRO** — multi-tenant business platform: invoices, inventory, POS, tasks, 7 roles, 11 industries, Firebase rules + composite indexes.
2. **Elkwayra** — 7 bilingual football party games, 1,000+ content items, zero-backend static site.
3. **Law Office** — 3D visuals with React Three Fiber + GSAP.
4. **BookFlow** — multi-branch booking system with conflict-free scheduling.
5. **RWCON** — contracting & landscaping company site: 9 pages, 49-product catalog.

## Scripts

```bash
npm start      # local dev server
npm test       # smoke tests (Jest + React Testing Library)
npm run build  # production build
npm run deploy # publish to GitHub Pages
```

## Structure

```
src/
  components/   Navbar, Footer, ScrollAnimation, WhatsAppButton
  sections/     Hero, About, Skills, Projects, Contact
  App.js        language state (AR/EN) + document lang/dir sync
public/
  index.html    SEO, Open Graph, JSON-LD
  sitemap.xml   generated manually (single-page site)
```

## Notes

- The site is fully bilingual (Arabic / English) and switches `dir` automatically.
- Scroll reveals are progressive enhancement: content stays visible if JS fails.
- Project links point to live deployments; a few client projects are not open source.

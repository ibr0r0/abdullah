# Abdullah Alotaibi — Portfolio

Personal portfolio for Abdullah Turki Alotaibi, Human Resources professional in Riyadh.
Static site: no build step, no dependencies. Dark mode by default with a light-mode toggle.

## Run locally

```bash
npx serve .
```

Then open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project**, import the repo, and leave **Framework Preset** as *Other*.
3. Deploy. No build command or output directory is needed.

Or from the terminal:

```bash
npx vercel
```

## Edit content

- `index.html` — all text, sections and links.
- `styles.css` — colours are CSS variables at the top of the file (`:root` for dark, `html[data-theme="light"]` for light).
- `main.js` — theme toggle, scroll reveals, counters, timeline and hover effects.
- `assets/Abdullah-Alotaibi-CV.pdf` — the downloadable CV. Replace the file to update it.
- `assets/og-image.png` — social share preview image.

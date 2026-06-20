# Graspins — Static (Vanilla) Version

A lightweight, framework-free rebuild of the Graspins website. Same content,
same look, no React, no build step.

## Stack
- Plain HTML (`index.html`, `careers.html`)
- Tailwind CSS via CDN (config inlined in each page's `<head>`)
- Custom gradients/animations in `css/styles.css`
- ~30 lines of vanilla JS for the mobile menu (`js/main.js`)

## Run it
No install, no build. Either:
- Double-click `index.html`, or
- Serve the folder, e.g. `npx serve static` or `python -m http.server` from this folder.

## Files
```
static/
  index.html      # Home (Hero, Stats, Services, Solutions, CardDeal, Testimonials, Clients, CTA, Footer)
  careers.html    # Careers page
  css/styles.css  # Custom gradient/animation classes + Poppins import
  js/main.js      # Mobile menu toggle
  assets/         # Images & SVG icons
```

## Note on Tailwind CDN
The CDN script compiles utilities in the browser, which is perfect for a
zero-build site. For a fully self-contained production build (no external
script), compile Tailwind once into a static CSS file and drop the CDN
`<script>`.

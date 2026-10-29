# Accessibility

Accessible movie directory project. The static website lives in `b/`; GitHub Actions tests it and publishes that folder to GitHub Pages.

## Quick start

Requires Node.js 22 or later.

```powershell
npm ci
npm run start
```

Open `http://127.0.0.1:8767/b/`.

Run the browser tests; Playwright starts its own local server:

```powershell
npx playwright install chromium
npm test
```

See [reademe.md](./reademe.md) for feature details, form behavior, and deployment notes. Enable GitHub Pages with **GitHub Actions** as the source in repository settings.
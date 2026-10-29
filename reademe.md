# Movies Directory

An accessible, responsive movie directory built with native HTML, CSS, and JavaScript. The app loads its movie catalogue from `b/movies.json`; it does not require a build step.

## Features

- Search eight movies by title, genre, year, or director.
- Open movie details in a native dialog; close it with the Close button, Escape, or the backdrop.
- Save and remove movies from a watchlist persisted in browser local storage.
- Sign-up form with name, email, genre, and consent validation.
- Keyboard navigation, a skip link, visible focus indicators, live result/status announcements, descriptive poster alt text, and responsive layouts.

## Run the website

Requires Node.js 22 or later. From the repository directory, install dependencies and start the included static server:

```powershell
npm ci
npm run start
```

Open `http://127.0.0.1:8767/b/`.

The app fetches `movies.json`, so it must be served over HTTP; opening `b/index.html` directly as a `file:` URL will not load the catalogue in browsers that block local fetch requests.

## Sign-up behavior

The form submits when the name is present, the email is valid, a genre is selected, and consent is checked. An empty or invalid submission displays field-specific errors. A successful submission displays an on-page confirmation and resets the form.

This is a front-end demonstration: submissions are not sent to a mailing-list service or stored on a server.

## Run accessibility tests

Install the test dependencies and Chromium if they are not already installed:

```powershell
npx playwright install chromium
npm test
```

The Playwright configuration starts the static server automatically for tests. To test a different deployment URL, set `MOVIE_SITE_URL`:

```powershell
$env:MOVIE_SITE_URL = "https://example.com/"
npm test
```

The suite covers the keyboard-only search/dialog/watchlist/sign-up flow, required-field validation and successful button submission, visible focus, and serious or critical Axe violations. The suite's Axe test excludes color contrast; a separate full Axe scan including color contrast also completed with no violations.

## GitHub Pages deployment

The `.github/workflows/pages.yml` workflow publishes the contents of `b/` as the website root after a push to `main` or `master`, and also supports manual runs. Before its first run, open the repository's **Settings → Pages** and select **GitHub Actions** as the build and deployment source. `actions/configure-pages` needs the Pages site to exist. Its optional automatic-enablement mode requires a separate token with repository administration/Pages permissions; the default `GITHUB_TOKEN` is not sufficient.

## Project files

- `b/index.html` — semantic page structure and accessible form/dialog markup.
- `b/styles.css` — responsive layout, focus styles, and reduced-motion handling.
- `b/app.js` — search, dialog, watchlist, dataset validation, and sign-up behavior.
- `b/movies.json` — the movie catalogue.
- `tests/accessibility.spec.js` — Playwright accessibility and interaction checks.
- `b/test-results.md` — recorded test outcomes and interaction checks.

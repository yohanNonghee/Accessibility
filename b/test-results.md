# Test Results

## Final run

Command: `npx playwright test tests/accessibility.spec.js`

Result: **5 passed, 0 failed**

Dependencies were installed from the lockfile with `npm ci`; npm reported 0 known vulnerabilities in the six installed packages.

- **Keyboard-only main task:** passed. Verified skip-link-first keyboard access, movie search, opening the details dialog, Escape dismissal, focus returning to the original result, saving with the keyboard, and successful sign-up.
- **Project homepage and report:** passed. Verified the landing page links to both movie directories and the English-language report, and that Projects A and B and the report load.
- **Sign-up button validation and submission:** passed. Empty submission reports the four required-field errors; a normal button click with valid values displays a confirmation.
- **Visible focus indicators:** passed. The focused interactive element displays a visible outline or shadow.
- **Axe accessibility scan:** passed. No serious or critical violations were reported. The test excludes the color-contrast rule.
- **Supplementary full Axe scan:** passed with color contrast enabled; no violations were reported.
- **320 px mobile viewport:** passed; no horizontal overflow or interactive targets smaller than 24 × 24 px were found.

## Issues found and resolved during testing

- The test initially used a relative URL that did not reliably resolve to the `b/` site. It now targets the local test server's `b/` URL.
- The first test expected the search input to be the second tab stop, but the page has navigation links before the search field. The test now follows the actual keyboard order.
- The test originally focused a non-focusable movie article instead of its poster button. It now opens the dialog from the result button.
- The save interaction replaces the original results button, so the test now checks the updated saved button in the watchlist.
- The form has multiple live regions; the test now checks the specific sign-up message.
- Axe reported a mismatch between the brand link's visible text and its `aria-label`. The conflicting label was removed.
- Playwright and its Chromium browser were missing initially; they were installed for the test run.

All five tests passed after these fixes.

## Button and link interaction check

Project B was opened in the browser and the following controls were located by their accessible role/name and clicked successfully:

| Control | Result | Click time |
|---|---|---:|
| Search & results navigation | Scrolled to search section | 152 ms |
| Movie poster / details opener | Opened the movie dialog | 287 ms |
| Dialog Close button | Closed the dialog | 29 ms |
| Save Inception button | Added the movie to the watchlist | 34 ms |
| Remove saved movie button | Removed the movie from the watchlist | 30 ms |
| Newsletter navigation | Scrolled to the sign-up form | 15 ms |
| Sign me up button | Submitted successfully; confirmation appeared | 290 ms |
| Back to top link | Returned to the main content | 40 ms |

**Outcome:** All 8 controls were found and clicked without locator timeouts or interaction errors. The timings are observed browser click durations for this run, not performance guarantees.

# Test Results

## Passed

- JavaScript syntax check (`node --check app.js`).
- Movie dataset JSON parsing and minimum-size check: 8 movies loaded.
- HTML heading check: exactly one `<h1>`.
- Browser load: all 8 movie cards rendered.
- Search: searching for “matrix” returned 1 matching film.
- Details dialog: focus moved to the dialog heading on open and returned to the original poster button on close.
- Watchlist: save and remove actions updated the saved count and announced the change without replacing the search-result count.
- Sign-up form: submitting empty fields displayed validation errors; submitting valid values displayed the success message.

## Failed attempts and reasons

- The first Node.js server returned 404 for the site root because it did not map `/` to `index.html`. Updated the server mapping; the site then loaded and the browser checks passed.
- The letters in "finding" (fi) look too close together.
- The text "Stories worth sta" in the Hero section cannot be read in its entirety

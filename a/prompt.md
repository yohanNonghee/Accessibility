# Prompt for Creating an Accessible Website for Popular Movies

Build a single-page application (SPA) for searching and managing movie information, ensuring full accessibility compliance with WCAG standards. Use a JSON dataset containing at least 8 movies. The webpage must follow this structure:

1. Include essential landmarks: `<header>`, `<nav>`, `<main>`, and `<footer>`.
2. Provide a "skip link" within the `<header>` to allow users to jump directly to the main content (`<main>`).
3. Ensure there is exactly one `<h1>` heading, and maintain a logical, sequential heading hierarchy (no skipped levels).

The page must consist of three main sections:
- **Search and Results:** Include a search input with a label reading "Search." As the user types, each search result should display the movie title (as a heading), a poster image, and a "save" button (represented by an icon) with a clear accessible name—for example, "Save [Movie Title]." Display the total number of results and ensure that any changes to this count are announced to screen readers.
- **Details Dialog:** Clicking on a movie result should open a dialog window containing further details. Upon opening, the focus must immediately shift into the dialog. The dialog can be closed via a "Close" button or by pressing the `Escape` key. Once closed, the focus must return to the specific element (button) that the user originally clicked to open the dialog.
- **Sign-up Form:** Include a registration form with fields for name and email, a selection mechanism (radio buttons or a dropdown menu) for preferred movie genres, and a checkbox for consent. Error messages must appear as text adjacent to the relevant input field only after the user has attempted to submit the form. A success message should be displayed upon successful form submission. Additional requirements:
- Design using native HTML buttons, links, forms, and dialogs.
- All buttons and controls must have an accessible name.
- Clearly visible focus indicators must always be present.
- Touch targets must be at least 24x24 px in size.
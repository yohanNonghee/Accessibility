# Specification & Accessibility Decisions

## 1. Heading Outline
- <h1> Movies Directory
- <h2> Search & Results
- <h2> Movie Details (Dialog – hidden via CSS until opened)
- <h2> Newsletter Sign-up Form

## 2. Landmarks
- `<header>`: Website header containing the logo, navigation links to the three main sections, and a "Skip Link."
- `<nav>`: Shortcut menu for navigating to different sections.
- `<main>`: The primary content area of ​​the webpage.
- `<footer>`: Copyright information and website footer.

## 3. Focus Order (For Main Tasks: Searching for movies, viewing details, saving, and signing up)
1. Pressing Tab for the first time moves focus to the **Skip Link**.
2. Press Tab to reach the **"Search"** input field and enter a movie title.
3. Press Tab to reach the first search result, then press **Enter/Space** to open the details dialog.
4. Focus automatically shifts inside the dialog—landing on the **"Close"** button or the dialog heading.
5. Press the **"Close"** button to close the dialog; focus returns to the original search result item.
6. Press Tab to reach the **"Save [Movie Title]"** button and press Enter to save.
7. Continue pressing Tab to navigate to the sign-up form; enter your name and email, select a movie genre, check the consent box, and press the Submit button.

## 4. Image Alt Text Strategy
- Movie posters: Include descriptive Alt Text, e.g., `alt="Poster for the movie [Movie Title]"`
- Decorative icons (e.g., standalone search or save icons): Use `alt=""` or `aria-hidden="true"` Because the main button already includes a text label or an accessible name.

## 5. Colour Contrast Ratios (WCAG AA Compliance)
- Main text colour against background: Dark black `#111111` on a white background `#FFFFFF` (Contrast Ratio > 12:1 – meets the 4.5:1 requirement)
- Icon and button border colour: `#4A5568` on a white background (Contrast Ratio > 4.5:1 – meets the 3:1 requirement)
- Focus ring colour: A distinct, high-contrast dark blue `#005FCC`
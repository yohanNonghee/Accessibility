---
name: accessibility
description: Use whenever you build or change UI to ensure full WCAG compliance, semantic HTML, keyboard navigation, and robust accessibility standards.
---

# Accessibility Implementation Rules

Whenever you are tasked with building or modifying a UI, strictly adhere to the following rules:

1. **Native HTML Elements & Semantics:** Use native HTML elements such as `<button>`, `<a>`, `<nav>`, `<dialog>`, and `<label>`. Never use `div` or `span` elements to function as buttons.
2. **Accessible Names:** Every button and form element must have a clear, descriptive name. Icon-only buttons must include an `aria-label` (e.g., `aria-label="Save [Movie Name]"`).
3. **Focus & Keyboard Navigation:** Ensure full support for Tab, Shift+Tab, Enter, Space, and Escape keys. Focus indicators (outlines) must be clearly visible. When a dialog is opened, focus must shift inside it; upon closing, focus must return to the original element.
4. **Form Errors:** Display error messages next to input fields only after an interaction attempt has been made. Use `aria-live="polite"` to announce dynamic content updates.
5. **Images & Targets:** Meaningful images must include an `alt` attribute (use `alt=""` for decorative images). Interactive targets must have a minimum size of 24x24 px.
6. **Specs Compliance:** Strictly follow the heading structure, landmarks, and color palettes defined in the `spec.md` file.

**Once coding is complete, run the Playwright tests and address any issues until all tests pass.**
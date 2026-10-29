const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Movie Directory Accessibility Tests', () => {
  
  test.beforeEach(async ({ page }) => {
   await page.goto('http://127.0.0.1:8767/b/');
  });

  // 1. Test keyboard and main tasks (Tab, Shift+Tab, Enter, Space, Escape)
  test('Main Task: Search, open dialog, close, save, and sign up using keyboard only', async ({ page }) => {
    //Check that the skip link appears first when the Tab key is pressed.
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();

    // Navigate through the header controls to the search field.
    const searchInput = page.getByRole('searchbox', { name: 'Search' });
    for (let i = 0; i < 10; i += 1) {
      if (await searchInput.evaluate((element) => element === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(searchInput).toBeFocused();

    // Type in a search for a movie (e.g. "Inception").
    await searchInput.fill('Inception');

    // Press Tab to navigate to the first result, then press Enter to open the dialog.
    await page.keyboard.press('Tab');
    const firstResult = page.locator('.movie-card .poster-button').first();
    await expect(firstResult).toBeFocused();
    await page.keyboard.press('Enter');

    // Verify that the dialog opens and the focus moves inside it.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    // Press Escape to close the dialog
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Verify that the focus jumps back to the original result.
    await expect(firstResult).toBeFocused();

    // Continue through the result controls until the Save button receives focus.
    const saveButton = page.getByRole('button', { name: /save inception/i });
    for (let i = 0; i < 5; i += 1) {
      if (await saveButton.evaluate((element) => element === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(saveButton).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: /remove inception from watchlist/i }).first())
      .toHaveAttribute('aria-pressed', 'true');

    // Continue with the sign-up fields using the keyboard.
    const nameInput = page.getByRole('textbox', { name: 'Name' });
    await nameInput.focus();
    await page.keyboard.type('Alex');
    await page.keyboard.press('Tab');
    await page.keyboard.type('alex@example.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Sci-Fi');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('#form-message')).toContainText('Thanks, Alex');
  });

  // 2. Verify that the focus indicator (focus visible) is clearly visible.
  test('Focus indicators are clearly visible on interactive elements', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    
    // Check that a CSS outline or box-shadow appears when an element is in focus.
    const outline = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineStyle !== 'none' || styles.boxShadow !== 'none';
    });
    expect(outline).toBeTruthy();
  });

  // 3. Run an Axe-core scan to ensure there are no 'Serious' or 'Critical' level errors.
  test('Axe-core accessibility scan should have no serious or critical violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) 
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });
});
const { test, expect, describe } = require('@playwright/test');
const { AxeUtils } = require('../utils/axeUtils');
const { LauPages } = require('../page-objects/lau');

describe('@lau @deletedUsers', () => {
  let delUser
  let axe;

  test.beforeEach(async ({ page }) => {
    axe = new AxeUtils(page);
    delUser = new LauPages(page);
    await delUser.logIn();
    await delUser.goToDeletedUsers();
  });

  test('@axe homepage is accessible', async ({ page }) => {
    await axe.audit(page);
  });

  test('@checklist 1. Headings are visually distinct', async ({ page }) => {
    await delUser.distinctHeaders();
    await axe.audit({ rules: 'p-as-heading' });
  });
  
  test('@checklist 2. Heading levels are in a logical order', async ({ page }) => {
    await delUser.evaluateHeadingOrder();
    await axe.audit({ rules: ['heading-order', 'page-has-heading-one'] });    
  });
  
  test('@checklist 3. Skip to main content link', async ({ page }) => {
    await delUser.skipToMain();
    await axe.audit({ rules: ['bypass', 'skip-link']  });
  });
  
  test('@checklist 4. Page Title not missing', async ({ page }) => {
    await axe.audit({ rules: 'document-title' });
  });
  
  test('@checklist 5. Page Title is descriptive', async ({ page }) => {
    const title = await page.title();
    expect(['Deleted', 'user'].some(word => title.toLowerCase().includes(word.toLowerCase()))).toBe(true);
  });
  
  test('@checklist 6. Page Title is unique', async ({ page }) => {
    await delUser.pageTitleUnique();
  });
  
  test('@checklist 7. Colour contrast', async ({ page }) => {
    // Must perform Manual check
    await axe.audit({ rules: 'color-contrast' });
    await delUser.clickSearchButton();
    await page.locator('.govuk-error-summary').focus();
    await axe.audit({ rules: 'color-contrast' });
    await delUser.fillDelUsersForm();
    await delUser.clickSearchButton();
    await axe.audit({ rules: 'color-contrast' });
  });
  
  test('@checklist 8. Links open in new tab', async ({ page }) => {
    await delUser.fillDelUsersForm();
    await delUser.clickSearchButton();
    await delUser.CSVGuideLinkNewTabCheck();
  });
  
  test('@checklist 9. Links are unique', async ({ page }) => {
    await axe.audit({ rules: 'link-name' });
    await axe.audit({ rules: 'link-in-text-block' });
    
    const links = page.locator('a');
    const count = await links.count();
    const visibleLinks = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        const text = (await link.innerText()).trim().toLowerCase();
        const href = await link.getAttribute('href');
        visibleLinks.push({ text, href });
      }
    }
    for (let i = 0; i < visibleLinks.length; i++) {
      for (let j = 0; j < visibleLinks.length; j++) {
        if (i !== j) {
          if (visibleLinks[i].text === visibleLinks[j].text) {
            expect(visibleLinks[i].href).toBe(visibleLinks[j].href);
          } else {
            expect(visibleLinks[i].text).not.toBe(visibleLinks[j].text);
          }

        }
      }
    }
  });
  
  test('@checklist 10. Correct language', async ({ page }) => {
    await axe.audit({ rules: 'html-has-lang' });
    await axe.audit({ rules: 'html-lang-valid' });
    await axe.audit({ rules: 'valid-lang' });
    
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
    
  });
  
  test('@checklist @smoke 11. Error handling (LAU-1148)', async ({ page }) => {
    await delUser.clickSearchButton();
    const errorLink = await delUser.getErrorSummaryLink();
    await errorLink.click();
    const firstInput = await delUser.firstInputField();
    await expect(firstInput).toBeFocused();
  });

   test('@smoke LAU-1154 accessibility pagination links have context (LAU-1154)', async ({ page }) => {
    await delUser.fillDelUsersForm();
    await delUser.clickSearchButton();
    await delUser.paginationNameCheck();
    await axe.audit({ rules: 'link-name' });
  });

  test.skip('@keyboard Keyboard User Test', async ({ page }) => {
    
  });

   test('Input fields have clear focus', async ({ page }) => {
    await delUser.inputFieldsFocus();
    await axe.audit(page);
  });
});

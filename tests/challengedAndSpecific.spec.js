const { test, expect, describe } = require('@playwright/test');
const { AxeUtils } = require('../utils/axeUtils');
const { LauPages } = require('../page-objects/lau');

describe('@lau @challengedSpecific', () => {
  let cSAccess;
  let axe;

  test.beforeEach(async ({ page }) => {
    axe = new AxeUtils(page);
    cSAccess = new LauPages(page);
    await cSAccess.logIn();
    await cSAccess.goToChallengedSpecificAccess();
  });

  test('@axe homepage is accessible', async ({ page }) => {
    await axe.audit(page);
  });

  test('@checklist 1. Headings are visually distinct', async ({}) => {
    await cSAccess.distinctHeaders();
    await axe.audit({ rules: 'p-as-heading' });
  });

  test('@checklist 2. Heading levels are in a logical order', async ({}) => {
    await cSAccess.evaluateHeadingOrder();
    await axe.audit({ rules: ['heading-order', 'page-has-heading-one'] });
  });

  test('@checklist 3. Skip to main content link', async ({}) => {
    await cSAccess.skipToMain();
    await axe.audit({ rules: ['bypass', 'skip-link'] });
  });

  test('@checklist 4. Page Title not missing', async ({}) => {
    await axe.audit({ rules: 'document-title' });
  });

  test('@checklist 5. Page Title is descriptive', async ({ page }) => {
    const title = await page.title();
    expect(
      ['Challenged', 'Specific', 'Access'].some((word) =>
        title.toLowerCase().includes(word.toLowerCase()),
      ),
    ).toBe(true);
  });

  test('@checklist 6. Page Title is unique', async ({}) => {
    await cSAccess.pageTitleUnique();
  });

  test('@checklist 7. Colour contrast', async ({ page }) => {
    // Must perform Manual check
    await axe.audit({ rules: 'color-contrast' });
    await cSAccess.clickSearchButton();
    await page.locator('.govuk-error-summary').focus();
    await axe.audit({ rules: 'color-contrast' });
    await cSAccess.fillChallengedSpecificAccessForm();
    await cSAccess.clickSearchButton();
    await axe.audit({ rules: 'color-contrast' });
  });

  test('@checklist 8. Links open in new tab', async ({}) => {
    await cSAccess.fillChallengedSpecificAccessForm();
    await cSAccess.clickSearchButton();
    await cSAccess.CSVGuideLinkNewTabCheck();
  });

  test('@checklist 9. Links are unique', async ({}) => {
    await axe.audit({ rules: 'link-name' });
    await axe.audit({ rules: 'link-in-text-block' });
    await cSAccess.uniqueLinksCheck();
  });

  test('@checklist 10. Correct language', async ({ page }) => {
    await axe.audit({ rules: 'html-has-lang' });
    await axe.audit({ rules: 'html-lang-valid' });
    await axe.audit({ rules: 'valid-lang' });

    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });

  test('@checklist @smoke 11. Error handling (LAU-1148)', async ({}) => {
    await cSAccess.clickSearchButton();
    await cSAccess.errorHandle();
  });

  test('@smoke LAU-1154 accessibility pagination links have context (LAU-1154)', async ({}) => {
    await cSAccess.fillChallengedSpecificAccessForm();
    await cSAccess.clickSearchButton();
    await cSAccess.paginationNameCheck();
    await axe.audit({ rules: 'link-name' });
  });

  test.skip('@keyboard Keyboard User Test', async ({}) => {});
});

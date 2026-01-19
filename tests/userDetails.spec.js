const { test, expect, describe } = require('@playwright/test');
const { AxeUtils } = require('../utils/axeUtils');
const { LauPages } = require('../page-objects/lau');
const data = require('../data/lauData.json');

describe('@lau @userDetails', () => {
  let userDetails;
  let axe;

  test.beforeEach(async ({ page }) => {
    axe = new AxeUtils(page);
    userDetails = new LauPages(page);
    await userDetails.logIn();
    await userDetails.goToUserDetails();
  });

  test('@axe homepage is accessible', async ({ page }) => {
    await axe.audit(page);
  });

  test('@checklist 1. Headings are visually distinct', async ({}) => {
    await userDetails.distinctHeaders();
    await axe.audit({ rules: 'p-as-heading' });
  });

  test('@checklist 2. Heading levels are in a logical order', async ({}) => {
    await userDetails.evaluateHeadingOrder();
    await axe.audit({ rules: ['heading-order', 'page-has-heading-one'] });
  });

  test('@checklist 3. Skip to main content link', async ({}) => {
    await userDetails.skipToMain();
    await axe.audit({ rules: ['bypass', 'skip-link'] });
  });

  test('@checklist 4. Page Title not missing', async ({}) => {
    await axe.audit({ rules: 'document-title' });
  });

  test('@checklist 5. Page Title is descriptive', async ({ page }) => {
    expect(await page.title()).toMatch(new RegExp(data.elementNames.userDetailsH1, 'i'));
  });

  test('@checklist 6. Page Title is unique', async ({}) => {
    await userDetails.pageTitleUnique();
  });

  test('@checklist 7. Colour contrast', async ({ page }) => {
    await axe.audit({ rules: 'color-contrast' });
    await userDetails.clickSearchButton();
    await page.locator('.govuk-error-summary').focus();
    await axe.audit({ rules: 'color-contrast' });
    await userDetails.fillUserDetailsSearchForm();
    await userDetails.clickSearchButton();
    await axe.audit({ rules: 'color-contrast' });
  });

  test.skip('@checklist 8. Links open in new tab', async ({}) => {
    await userDetails.fillUserDetailsSearchForm();
    await userDetails.clickSearchButton();
    await userDetails.CSVGuideLinkNewTabCheck();
  });

  test('@checklist 9. Links are unique', async ({}) => {
    await axe.audit({ rules: 'link-name' });
    await axe.audit({ rules: 'link-in-text-block' });
    await userDetails.uniqueLinksCheck();
  });

  test('@checklist 10. Correct language', async ({ page }) => {
    await axe.audit({ rules: 'html-has-lang' });
    await axe.audit({ rules: 'html-lang-valid' });
    await axe.audit({ rules: 'valid-lang' });

    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });

  test('@checklist @smoke 11. Error handling (LAU-1148)', async ({}) => {
    await userDetails.clickSearchButton();
    await userDetails.errorHandle();
  });

  test('@smoke LAU-1154 accessibility pagination links have context (LAU-1154)', async ({}) => {
    await userDetails.fillUserDetailsSearchForm;
    await userDetails.clickSearchButton();
    await userDetails.paginationNameCheck();
    await axe.audit({ rules: 'link-name' });
  });

  test('Keyboard User Test', async ({}) => {
    await userDetails.fillUserDetailsSearchFormKeyboard();
  });
});

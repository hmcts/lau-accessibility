const { test, expect, describe } = require('@playwright/test');
const { AxeUtils } = require('../utils/axeUtils');
const { LauPages } = require('../page-objects/lau');

describe('@lau @deletedUsers', () => {
  let delUser;
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

  test('@checklist 1. Headings are visually distinct', async ({}) => {
    await delUser.distinctHeaders();
    await axe.audit({ rules: 'p-as-heading' });
  });

  test('@checklist 2. Heading levels are in a logical order', async ({}) => {
    await delUser.evaluateHeadingOrder();
    await axe.audit({ rules: ['heading-order', 'page-has-heading-one'] });
  });

  test('@checklist 3. Skip to main content link', async ({}) => {
    await delUser.skipToMain();
    await axe.audit({ rules: ['bypass', 'skip-link'] });
  });

  test('@checklist 4. Page Title not missing', async ({}) => {
    await axe.audit({ rules: 'document-title' });
  });

  test('@checklist 5. Page Title is descriptive', async ({ page }) => {
    const title = await page.title();
    expect(
      ['Deleted', 'user'].some((word) => title.toLowerCase().includes(word.toLowerCase())),
    ).toBe(true);
  });

  test('@checklist 6. Page Title is unique', async ({}) => {
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

  test('@checklist 8. Links open in new tab', async ({}) => {
    await delUser.fillDelUsersForm();
    await delUser.clickSearchButton();
    await delUser.CSVGuideLinkNewTabCheck();
  });

  test('@checklist 9. Links are unique', async ({}) => {
    await axe.audit({ rules: 'link-name' });
    await axe.audit({ rules: 'link-in-text-block' });
    await delUser.uniqueLinksCheck();
  });

  test('@checklist 10. Correct language', async ({ page }) => {
    await axe.audit({ rules: 'html-has-lang' });
    await axe.audit({ rules: 'html-lang-valid' });
    await axe.audit({ rules: 'valid-lang' });

    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });

  test('@checklist @smoke 11. Error handling (LAU-1148)', async ({}) => {
    await delUser.clickSearchButton();
    await delUser.errorHandle();
  });

  test('@smoke LAU-1154 accessibility pagination links have context (LAU-1154)', async ({}) => {
    await delUser.fillDelUsersForm();
    await delUser.clickSearchButton();
    await delUser.paginationNameCheck();
    await axe.audit({ rules: 'link-name' });
  });

  test.skip('@keyboard Keyboard User Test', async ({}) => {});
});

const { test, expect, describe } = require('@playwright/test');
const { AxeUtils } = require('../utils/axeUtils');
const { LauPages } = require('../page-objects/lau');
const data = require('../data/lauData.json');

describe('@lau @caseAudit', () => {
  let caseAudit;
  let axe;

  test.beforeEach(async ({ page }) => {
    axe = new AxeUtils(page);
    caseAudit = new LauPages(page);
    await caseAudit.logIn();
  });

  test('@axe homepage is accessible', async ({ page }) => {
    await axe.audit(page);
  });

  
  test('@checklist 1. Headings are visually distinct', async ({ page }) => {
    await caseAudit.distinctHeaders();
    await axe.audit({ rules: 'p-as-heading' });
    
  });
  
  test('@checklist 2. Heading levels are in a logical order', async ({ page }) => {
    await caseAudit.evaluateHeadingOrder();
    await axe.audit({ rules: ['heading-order', 'page-has-heading-one'] });    
  });
  
  test('@checklist 3. Skip to main content link', async ({ page }) => {
    await caseAudit.skipToMain();
    await axe.audit({ rules: ['bypass', 'skip-link']  });
  });
  
  test('@checklist 4. Page Title not missing', async ({ page }) => {
    await axe.audit({ rules: 'document-title' });
  });
  
  test('@checklist 5. Page Title is descriptive', async ({ page }) => {
    expect(await page.title()).toMatch(new RegExp(data.elementNames.caseAuditH1, 'i'));
  });
  
  test('@checklist 6. Page Title is unique', async ({ page }) => {
    await caseAudit.pageTitleUnique();
  });
  
  test('@checklist 7. Colour contrast', async ({ page }) => {
    // Must perform Manual check
    await axe.audit({ rules: 'color-contrast' });
    await caseAudit.clickSearchButton();
    await page.locator('.govuk-error-summary').focus();
    await axe.audit({ rules: 'color-contrast' });
    await caseAudit.fillCaseAuditSearchForm();
    await caseAudit.clickSearchButton();
    await axe.audit({ rules: 'color-contrast' });
  });
  
  test('@checklist 8. Links open in new tab', async ({ page }) => {
    await caseAudit.fillCaseAuditSearchForm();
    await caseAudit.clickSearchButton();
    await caseAudit.CSVGuideLinkNewTabCheck();
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
    await caseAudit.clickSearchButton();
    const errorLink = await caseAudit.getErrorSummaryLink();
    await errorLink.click();
    const firstInput = await caseAudit.firstInputField();
    await expect(firstInput).toBeFocused();
  });
  
  test('@smoke LAU-1154 accessibility pagination links have context (LAU-1154)', async ({ page }) => {
    await caseAudit.fillCaseAuditSearchForm();
    await caseAudit.clickSearchButton();
    await caseAudit.paginationNameCheck();
    await axe.audit({ rules: 'link-name' });
  });
  
  test('Keyboard User Test', async ({ page }) => {
    await caseAudit.fillCaseAuditSearchFormKeyboard();
  });

  test('Input fields have clear focus', async ({ page }) => {
    await caseAudit.inputFieldsFocus();
    await axe.audit(page);
  });
});
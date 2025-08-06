const { expect } = require('@playwright/test');
const data = require('../data/lauData.json');

class LauPages {
  constructor(page) {
    this.page = page;
    this.urls = data.urls;
    this.locators = data.locators;
    this.inputs = data.inputs;
    this.elementNames = data.elementNames;
    this.links = data.links;
    this.texts = data.texts;
  }

  async logIn() {
    await this.page.goto('/')
    await this.page.locator(this.locators.usernameInput).fill(this.inputs.username);
    await this.page.locator(this.locators.passwordInput).fill(this.inputs.password);
    await this.page.getByRole('button', { name: this.elementNames.signInBtn }).click();
    await this.page.waitForURL(this.urls.caseAudit);
    await this.page.pause();
  }

  async clickSearchButton() {
    await this.page.getByRole('button', { name: new RegExp(this.elementNames.searchBtn, 'i') }).click();
  }

  async getErrorSummaryLink() {
    return this.page.locator(this.links.errorSummaryLink).first();
  }


  async goToChallengedSpecificAccess() {
    await this.page.getByRole('link', { name: new RegExp(this.links.challengedSpecficAccess, 'i') }).click();
  }

  async goToLogOnsAudit() {
    await this.page.getByRole('link', { name: new RegExp(this.links.logOnsAudit, 'i') }).click();
  }

  async goToDeletedUsers() {
    await this.page.getByRole('link', { name: new RegExp(this.links.deletedUsers, 'i') }).click();
  }

  async firstInputField() {
    return this.page.locator(this.locators.firstInputField);
  }

  async fillChallengedSpecificAccessForm() {
    await this.page.getByRole('textBox', { name: this.elementNames.userId}).fill(this.inputs.userId);
    await this.page.locator(this.locators.startDate).fill(this.inputs.startDate);
    await this.page.locator(this.locators.endDate).fill(this.inputs.endDate);
  }

  async fillCaseAuditSearchForm(){
    await this.page.getByRole('combobox', { name: this.elementNames.caseTypeID }).fill(this.inputs.caseTypeId);
    await this.page.locator(this.locators.startDate).fill(this.inputs.startDate);
    await this.page.locator(this.locators.endDate).fill(this.inputs.endDate);
  }

  async fillLogOnsAuditForm(){
    await this.page.getByRole('textbox', { name: this.elementNames.userId}).fill(this.inputs.logOnsUserId);
    await this.page.locator(this.locators.startDate).fill(this.inputs.startDate);
    await this.page.locator(this.locators.endDate).fill(this.inputs.endDate);
  }

  async fillDelUsersForm(){
    await this.page.getByRole('textbox', { name: this.elementNames.userId}).fill(this.inputs.deletedUserId);
    await this.page.locator(this.locators.startDate).fill(this.inputs.deleteSearchStartDate);
    await this.page.locator(this.locators.endDate).fill(this.inputs.endDate);
  }

  async fillCaseAuditSearchFormKeyboard(){
    const CaseTypeIDInput = await this.page.getByRole('combobox', { name: new RegExp(this.elementNames.caseTypeID, 'i')});
    await expect(CaseTypeIDInput).toBeVisible();
    await CaseTypeIDInput.pressSequentially(this.inputs.caseTypeId);
    await CaseTypeIDInput.press('Enter');
    for (let i = 0; i < 2; i++) {
      await this.page.keyboard.press('Tab');
    }
    const startTime = await this.page.locator(this.locators.startDate);
    await expect(startTime).toBeVisible();
    await startTime.pressSequentially(this.inputs.startDateTyped);
    await startTime.press('Tab');
    await startTime.pressSequentially(this.inputs.startTimeTyped);
    for (let i = 0; i < 2; i++) {
      await this.page.keyboard.press('Tab');
    };
    const endTime = await this.page.locator(this.locators.endDate);
    await expect(endTime).toBeVisible();;
    await endTime.pressSequentially(this.inputs.endDateTyped);
    await endTime.press('Tab');
    await endTime.pressSequentially(this.inputs.endTimeTyped);
    for (let i = 0; i < 3; i++) {
      await this.page.keyboard.press('Tab');
    } 
    await this.page.keyboard.press('Enter');
    const results = await this.page.getByRole('heading', { name: new RegExp(this.elementNames.resultsHeader, 'i') });
    await expect(results).toBeVisible();
  }

  async CSVGuideLinkNewTabCheck() {
    const guideLink = this.page.getByRole('link', { name: new RegExp(this.links.csvGuideLink, 'i') });
    expect(await guideLink.getAttribute('target')).toBe('_blank');
    const visibleText = await guideLink.textContent();
    expect(visibleText.toLowerCase()).toContain(this.texts.newTabWarning);
  }

  async paginationNameCheck() {
    const nextPageLink = this.page.getByRole('link', { name: new RegExp(this.links.nextPage, 'i') });
    await expect(nextPageLink).toBeVisible();
    const lastPageLink = this.page.getByRole('link', { name: new RegExp(this.links.lastPage, 'i') });
    await expect(lastPageLink).toBeVisible();
    const prevPageLink = this.page.getByRole('link', { name: new RegExp(this.links.previousPage, 'i') });
    if (await prevPageLink.count() > 0) {
      await expect(prevPageLink).toBeVisible();
    }
  }

  async inputFieldsFocus() {
    const inputSelectors = [
      this.locators.firstInputField,
      this.locators.caseRefInputField,
      this.locators.caseTypeIdInputField,
      this.locators.jurisdictionInputField,
      this.locators.startDate,
      this.locators.endDate,
      this.locators.activitySelect
    ];
    for (const selector of inputSelectors) {
    const input = this.page.locator(selector);
    await input.click();
    await expect(input).toBeFocused();
    await this.focusColourCheck(input);
    }
  }

  async distinctHeaders() {
    const currentUrl = this.page.url();
    let heading1, heading2, paragraph;
    let h1Name, h2Name, pText;

    if (currentUrl.includes('/case-audit')) {
      h1Name = this.elementNames.caseAuditH1;
      h2Name = this.elementNames.caseAuditH2;
      pText = this.elementNames.caseAuditP;
    } else if (currentUrl.includes('/challenged-specific-access')) {
      h1Name = this.elementNames.challengedSpecificAccessH1;
      h2Name = this.elementNames.caseAuditH2;
      pText = this.elementNames.caseAuditP;
    } else if (currentUrl.includes('/logon-audit')) {
      h1Name = this.elementNames.logonAuditH1;
      h2Name = this.elementNames.caseAuditH2;
      pText = this.elementNames.caseAuditP;
    } else if (currentUrl.includes('/user-deletion-audit')) {
      h1Name = this.elementNames.userDeletionAuditH1;
      h2Name = this.elementNames.caseAuditH2;
      pText = this.elementNames.caseAuditP;
    }

    heading1 = this.page.getByRole('heading', { name: h1Name });
    const fontSizeh1 = await heading1.evaluate(el => parseInt(getComputedStyle(el).fontSize, 10));
    heading2 = this.page.getByRole('heading', { name: h2Name, exact: true });
    const fontSizeh2 = await heading2.evaluate(el => parseInt(getComputedStyle(el).fontSize, 10));
    paragraph = this.page.locator('p').filter({ hasText: pText });
    const fontSizep = await paragraph.evaluate(el => parseInt(getComputedStyle(el).fontSize, 10));
    expect(fontSizeh1).toBeGreaterThan(fontSizeh2);
    expect(fontSizeh2).toBeGreaterThan(fontSizep);
  }

  async evaluateHeadingOrder() {
    const main = this.page.locator('main');
    const first = main.getByRole('heading').nth(0);
    const second = main.getByRole('heading').nth(1);
    const firstTag = await first.evaluate(el => el.tagName.toLowerCase());
    const secondTag = await second.evaluate(el => el.tagName.toLowerCase());
    expect(firstTag).toBe('h1');
    expect(secondTag).toBe('h2');
  }

  async skipToMain() {
    const skipLink = this.page.getByRole('link', { name: this.elementNames.skipToMain });
    await expect(skipLink).toBeVisible();
    await expect(await skipLink.getAttribute('href')).toBe(this.locators.mainContent);
  }

  async pageTitleUnique() {
    const titles = [];
    // await this.page.goto(this.urls.caseAudit);
    // titles.push(await this.page.title());
    // await this.page.goto(this.urls.challengedSpecficAccess);
    // titles.push(await this.page.title());
    // await this.page.goto(this.urls.logOns);
    // titles.push(await this.page.title());
    // await this.page.goto(this.urls.deletedUsers);
    // titles.push(await this.page.title());

    await this.page.goto('/case-audit');
    titles.push(await this.page.title());
    await this.page.goto('/challenged-specific-access');
    titles.push(await this.page.title());
    await this.page.goto('/logon-audit');
    titles.push(await this.page.title());
    await this.page.goto('/user-deletion-audit');
    titles.push(await this.page.title());

    for (let i = 0; i < titles.length; i++) {
      for (let j = 0; j < titles.length; j++) {
        if (i !== j) {
          expect(titles[i]).not.toBe(titles[j]);
        }
      }
    }
  } 
}

module.exports = { LauPages };

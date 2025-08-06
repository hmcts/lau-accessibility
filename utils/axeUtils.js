const { AxeBuilder } = require("@axe-core/playwright");
const { expect } = require("@playwright/test");

class AxeUtils {
  constructor(page) {
    this.page = page;
    this.DEFAULT_TAGS = [
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22a",
      "wcag22aa",
    ];
  }

  /**
   * Run the AxeBuilder checks using the pre-determined tags
   * @param {Object} [options] - Optional config such as excluding element(s)
   * @param {string|string[]} [options.exclude]
   * @param {string|string[]} [options.disableRules]
   */
  async audit(options = {}) {
    const builder = new AxeBuilder({ page: this.page }).withTags(this.DEFAULT_TAGS);
    if (options.rules) {
        if (Array.isArray(options.rules)) {
        builder.withRules(options.rules);
        } else {
        builder.withRules([options.rules]);
        }   
    }
    if (options.exclude) {
      if (Array.isArray(options.exclude)) {
        options.exclude.forEach((selector) => builder.exclude(selector));
      } else {
        builder.exclude(options.exclude);
      }
    }
    if (options.disableRules) builder.disableRules(options.disableRules);
    const results = await builder.analyze();

    if (process.env.PWDEBUG) {
      if (results.violations.length > 0) {
        console.log(`Accessibility issues found on ${this.page.url()}:`);
        results.violations.forEach((violation) => {
          console.log(`${violation.id}: ${violation.description}`);
          console.log(`Impact: ${violation.impact}`);
          console.log(
            `Affected nodes:`,
            violation.nodes.map((node) => node.html).join("\n")
          );
        });
      }
    }

    expect.soft(results.violations).toEqual([]);
  }
}

module.exports = { AxeUtils };

import { describe, expect, it } from "vitest";

import { parseGoldBullionRates } from "@/lib/gold-bullion";

const page = `
  <table class="prices-table">
    <tr class="header"><td>السعر</td><td>شراء</td><td>بيع</td></tr>
    <tr><td>جرام عيار 24</td><td class="num" data-val="7063">7063</td><td class="num td-arrow" data-val="7029">7029</td></tr>
    <tr><td>جرام عيار 21</td><td class="num" data-val="6180">6180</td><td class="num td-arrow" data-val="6150">6150</td></tr>
    <tr><td>جرام عيار 18</td><td class="num" data-val="5297">5297</td><td class="num td-arrow" data-val="5271">5271</td></tr>
  </table>
`;

describe("parseGoldBullionRates", () => {
  it("uses the Gold Bullion buy prices, not the sell prices", () => {
    expect(parseGoldBullionRates(page)?.rates).toEqual({
      "24K": 7063,
      "21K": 6180,
      "18K": 5297,
    });
  });

  it("returns null if a karat rate is missing or invalid", () => {
    expect(parseGoldBullionRates(page.replace('data-val="6180"', 'data-val="0"'))).toBeNull();
    expect(
      parseGoldBullionRates(page.replace(/<tr><td>جرام عيار 18[\s\S]*?<\/tr>/, "")),
    ).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { toShopSettings } from "./catalog.server";

describe("toShopSettings location defaults", () => {
  it("replaces the old Cairo defaults", () => {
    const settings = toShopSettings({
      "shop.tagline": "Fine gold jewelry in Cairo",
      "shop.taglineAr": "مجوهرات ذهب فاخرة في القاهرة",
      "shop.address": "Khan el-Khalili, El-Gamaleya, Cairo",
      "shop.addressAr": "خان الخليلي، الجمالية، القاهرة",
    });

    expect(settings.address).toBe("Dekernes, Dakahlia, Egypt");
    expect(settings.addressAr).toBe("دكرنس، الدقهلية، مصر");
    expect(settings.tagline).toContain("Dekernes");
    expect(settings.taglineAr).toContain("دكرنس");
  });

  it("preserves custom shop locations", () => {
    const settings = toShopSettings({
      "shop.address": "Custom English address",
      "shop.addressAr": "عنوان مخصص",
    });

    expect(settings.address).toBe("Custom English address");
    expect(settings.addressAr).toBe("عنوان مخصص");
  });
});

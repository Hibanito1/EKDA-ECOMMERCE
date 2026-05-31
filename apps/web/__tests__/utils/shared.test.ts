/**
 * Shared Package Utilities Tests
 */

import {
  formatCurrency,
  formatCompactCurrency,
  calculateOrderBreakdown,
  getCargoRecommendation,
  formatHSCode,
  isValidEmail,
  isValidHSCode,
  truncate,
  slugify,
  EKDA_COMMISSION_RATE,
  ESCROW_FIRST_RELEASE_RATE,
  ESCROW_SECOND_RELEASE_RATE,
} from "@ekda/shared";
import type { Product } from "@ekda/shared";

describe("formatCurrency", () => {
  it("formats NGN correctly", () => {
    expect(formatCurrency(8500, "NGN")).toBe("₦8,500.00");
    expect(formatCurrency(1000000, "NGN")).toBe("₦1,000,000.00");
  });

  it("formats USD correctly", () => {
    expect(formatCurrency(100, "USD")).toBe("$100.00");
  });

  it("formats GBP correctly", () => {
    expect(formatCurrency(50.5, "GBP")).toBe("£50.50");
  });
});

describe("calculateOrderBreakdown", () => {
  it("correctly calculates 10% commission", () => {
    const result = calculateOrderBreakdown(100000, 35000);
    expect(result.ekdaCommission).toBe(100000 * EKDA_COMMISSION_RATE);
    expect(result.ekdaCommission).toBe(10000);
  });

  it("vendor receives subtotal minus commission", () => {
    const result = calculateOrderBreakdown(100000, 35000);
    expect(result.vendorReceives).toBe(90000);
  });

  it("50/50 escrow split is correct", () => {
    const result = calculateOrderBreakdown(100000, 35000);
    expect(result.escrowFirstRelease).toBe(result.escrowSecondRelease);
    expect(result.escrowFirstRelease).toBe(45000);
  });

  it("total includes all components", () => {
    const result = calculateOrderBreakdown(100000, 35000);
    expect(result.total).toBe(100000 + 35000 + 10000);
  });
});

describe("EKDA business constants", () => {
  it("commission rate is 10%", () => {
    expect(EKDA_COMMISSION_RATE).toBe(0.1);
  });

  it("escrow releases sum to 100%", () => {
    expect(ESCROW_FIRST_RELEASE_RATE + ESCROW_SECOND_RELEASE_RATE).toBe(1.0);
  });
});

describe("getCargoRecommendation", () => {
  const mockProduct = (overrides: Partial<Product>): Product => ({
    id: "1",
    vendor_id: "v1",
    name: "Test Product",
    description: "Test",
    category: "groceries",
    marketplace_type: "export",
    images: [],
    price: 5000,
    currency: "NGN",
    unit: "kg",
    min_order_quantity: 1,
    stock_quantity: 100,
    origin_country: "NG",
    weight_kg: 1,
    cargo_recommendation: "sea",
    supports_bulk: false,
    is_active: true,
    rating: 4.5,
    review_count: 100,
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  });

  it("recommends sea freight for frozen produce", () => {
    const result = getCargoRecommendation(mockProduct({ category: "frozen_produce" }));
    expect(result.recommendation).toBe("sea");
    expect(result.isRestricted).toBe(true);
  });

  it("recommends sea freight for heavy items", () => {
    const result = getCargoRecommendation(mockProduct({ weight_kg: 150 }));
    expect(result.recommendation).toBe("sea");
    expect(result.isRestricted).toBe(false);
  });

  it("recommends air freight for light, high-value items", () => {
    const result = getCargoRecommendation(mockProduct({ weight_kg: 2, price: 1000 }));
    expect(result.recommendation).toBe("air");
  });
});

describe("formatHSCode", () => {
  it("formats 6-digit HS codes correctly", () => {
    expect(formatHSCode("030617")).toBe("0306.17");
    expect(formatHSCode("151110")).toBe("1511.10");
  });

  it("handles pre-formatted codes", () => {
    expect(formatHSCode("0306.17")).toBe("0306.17");
  });
});

describe("isValidEmail", () => {
  it("validates emails correctly", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidHSCode", () => {
  it("validates HS codes correctly", () => {
    expect(isValidHSCode("030617")).toBe(true);
    expect(isValidHSCode("0306.17")).toBe(true);
    expect(isValidHSCode("123")).toBe(false);
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
    expect(truncate("Short", 10)).toBe("Short");
  });
});

describe("slugify", () => {
  it("converts strings to URL-safe slugs", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("African Groceries & More!")).toBe("african-groceries-more");
    expect(slugify("Crayfish (Dried)")).toBe("crayfish-dried");
  });
});

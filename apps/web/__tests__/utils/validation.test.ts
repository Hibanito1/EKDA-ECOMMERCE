/**
 * EKDA Validation Library Tests
 */

import {
  email,
  password,
  phone,
  nigerianPhone,
  hsCode,
  positiveNumber,
  validateLogin,
  validateRegister,
  validateProduct,
} from "@/lib/validation";

describe("email validator", () => {
  it("accepts valid emails", () => {
    expect(email("user@example.com").valid).toBe(true);
    expect(email("trader+tag@ekda.io").valid).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(email("not-an-email").valid).toBe(false);
    expect(email("@ekda.io").valid).toBe(false);
    expect(email("").valid).toBe(false);
    expect(email("user@").valid).toBe(false);
  });
});

describe("password validator", () => {
  it("accepts strong passwords", () => {
    expect(password("StrongPass1").valid).toBe(true);
    expect(password("Abc12345!").valid).toBe(true);
  });

  it("rejects weak passwords", () => {
    expect(password("short1A").valid).toBe(false); // too short
    expect(password("alllowercase1").valid).toBe(false); // no uppercase
    expect(password("AllUppercase").valid).toBe(false); // no number
    expect(password("").valid).toBe(false);
  });
});

describe("nigerianPhone validator", () => {
  it("accepts valid Nigerian phone numbers", () => {
    expect(nigerianPhone("+2348012345678").valid).toBe(true);
    expect(nigerianPhone("08012345678").valid).toBe(true);
    expect(nigerianPhone("07012345678").valid).toBe(true);
    expect(nigerianPhone("+234 801 234 5678").valid).toBe(true);
  });

  it("rejects invalid numbers", () => {
    expect(nigerianPhone("1234567890").valid).toBe(false);
    expect(nigerianPhone("+44 7911 123456").valid).toBe(false);
  });

  it("allows empty (optional field)", () => {
    expect(nigerianPhone("").valid).toBe(true);
  });
});

describe("hsCode validator", () => {
  it("accepts valid HS codes", () => {
    expect(hsCode("0306.17").valid).toBe(true);
    expect(hsCode("1511.10").valid).toBe(true);
    expect(hsCode("87032310").valid).toBe(true);
  });

  it("rejects invalid codes", () => {
    expect(hsCode("abc").valid).toBe(false);
    expect(hsCode("12345").valid).toBe(false); // too short
    expect(hsCode("12345678901").valid).toBe(false); // too long
  });

  it("allows empty (optional)", () => {
    expect(hsCode("").valid).toBe(true);
  });
});

describe("positiveNumber validator", () => {
  it("accepts positive numbers", () => {
    expect(positiveNumber(1).valid).toBe(true);
    expect(positiveNumber("100").valid).toBe(true);
    expect(positiveNumber(0.01).valid).toBe(true);
  });

  it("rejects non-positive values", () => {
    expect(positiveNumber(0).valid).toBe(false);
    expect(positiveNumber(-1).valid).toBe(false);
    expect(positiveNumber("abc").valid).toBe(false);
  });
});

describe("validateLogin", () => {
  it("returns no errors for valid data", () => {
    const errors = validateLogin({ email: "user@example.com", password: "password123" });
    expect(errors.email).toBeUndefined();
    expect(errors.password).toBeUndefined();
  });

  it("returns errors for invalid data", () => {
    const errors = validateLogin({ email: "invalid-email", password: "" });
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });
});

describe("validateRegister", () => {
  it("validates all required fields", () => {
    const errors = validateRegister({
      full_name: "",
      email: "bad-email",
      password: "weak",
      role: "",
    });
    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.full_name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
    expect(errors.role).toBeTruthy();
  });

  it("passes with valid data", () => {
    const errors = validateRegister({
      full_name: "Adaeze Okonkwo",
      email: "adaeze@example.com",
      password: "StrongPass1",
      role: "customer",
    });
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("validateProduct", () => {
  it("requires all mandatory fields", () => {
    const errors = validateProduct({
      name: "",
      description: "short",
      price: -100,
      category: "",
      stock_quantity: 0,
      weight_kg: 0,
      min_order_quantity: 1,
    });
    expect(errors.name).toBeTruthy();
    expect(errors.description).toBeTruthy();
    expect(errors.price).toBeTruthy();
    expect(errors.category).toBeTruthy();
  });

  it("passes for valid product", () => {
    const errors = validateProduct({
      name: "Dried Crayfish",
      description: "Sun-dried freshwater crayfish from Badagry Creek, rich in protein",
      price: 8500,
      category: "dried_produce",
      stock_quantity: 100,
      weight_kg: 1,
      min_order_quantity: 1,
    });
    expect(Object.keys(errors).length).toBe(0);
  });
});

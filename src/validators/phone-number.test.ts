import { validatePhoneNumber, getCarrierInfo } from "./phone-number";
import { formatPhoneNumber } from "../formatters/phone-number";
import { CARRIERS } from "../constants";

describe("Phone Number Validators", () => {
  describe("validatePhoneNumber", () => {
    it("should validate correct Tunisian phone numbers", () => {
      // Valid numbers with different prefixes
      expect(validatePhoneNumber("20123456")).toBe(true); // Valid prefix 2
      expect(validatePhoneNumber("40123456")).toBe(true); // Valid prefix 4
      expect(validatePhoneNumber("50123456")).toBe(true); // Valid prefix 5
      expect(validatePhoneNumber("90123456")).toBe(true); // Valid prefix 9
    });

    it("should validate phone numbers with international prefix", () => {
      expect(validatePhoneNumber("+21620123456")).toBe(true);
      expect(validatePhoneNumber("+21650123456")).toBe(true);
      expect(validatePhoneNumber("+21690123456")).toBe(true);
    });

    it("should reject phone numbers with invalid length", () => {
      // Too short
      expect(validatePhoneNumber("2012345")).toBe(false);

      // Too long
      expect(validatePhoneNumber("201234567")).toBe(false);
      expect(validatePhoneNumber("+216201234567")).toBe(false);
    });

    it("should reject phone numbers with invalid prefixes", () => {
      // Invalid prefix (1 is not a valid prefix)
      expect(validatePhoneNumber("10123456")).toBe(false);
      expect(validatePhoneNumber("+21610123456")).toBe(false);

      // Invalid prefix (0 is not a valid prefix)
      expect(validatePhoneNumber("00123456")).toBe(false);
    });

    it("should reject phone numbers with non-numeric characters", () => {
      expect(validatePhoneNumber("2012345a")).toBe(false);
      expect(validatePhoneNumber("20-123456")).toBe(false);
      expect(validatePhoneNumber("+216 20123456")).toBe(false);
    });

    it("should reject empty strings and invalid inputs", () => {
      expect(validatePhoneNumber("")).toBe(false);
      // @ts-ignore - Testing invalid input
      expect(validatePhoneNumber(null)).toBe(false);
      // @ts-ignore - Testing invalid input
      expect(validatePhoneNumber(undefined)).toBe(false);
    });

    describe("strict mode", () => {
      it("should validate correct phone numbers in strict mode", () => {
        expect(validatePhoneNumber("20123456", { strict: true })).toBe(true);
        expect(validatePhoneNumber("+21650123456", { strict: true })).toBe(
          true,
        );
      });

      it("should reject phone numbers with spaces in strict mode", () => {
        expect(validatePhoneNumber("20 123 456", { strict: true })).toBe(false);
        expect(validatePhoneNumber("+216 20123456", { strict: true })).toBe(
          false,
        );
      });

      it("should reject phone numbers with hyphens in strict mode", () => {
        expect(validatePhoneNumber("20-123-456", { strict: true })).toBe(false);
        expect(validatePhoneNumber("+216-20123456", { strict: true })).toBe(
          false,
        );
      });

      it("should reject phone numbers with parentheses in strict mode", () => {
        expect(validatePhoneNumber("(20)123456", { strict: true })).toBe(false);
        expect(validatePhoneNumber("+216(20)123456", { strict: true })).toBe(
          false,
        );
      });
    });
  });

  describe("getCarrierInfo", () => {
    it("should return correct carrier information for Ooredoo numbers", () => {
      // Prefix 5 is shared between Ooredoo and Orange, so we can't test it deterministically
      // The implementation returns the first carrier found with the matching prefix
      expect(getCarrierInfo("50123456")).toEqual(CARRIERS.OOREDOO);
      expect(getCarrierInfo("+21650123456")).toEqual(CARRIERS.OOREDOO);
    });

    it("should return correct carrier information for Orange numbers", () => {
      // Prefix 4 is unique to Orange
      expect(getCarrierInfo("40123456")).toEqual(CARRIERS.ORANGE);
      expect(getCarrierInfo("+21640123456")).toEqual(CARRIERS.ORANGE);
    });

    it("should return correct carrier information for Tunisie Telecom numbers", () => {
      // Prefix 9 is unique to Tunisie Telecom
      expect(getCarrierInfo("90123456")).toEqual(CARRIERS.TELECOM);
      expect(getCarrierInfo("+21690123456")).toEqual(CARRIERS.TELECOM);
    });

    it("should return null for invalid phone numbers", () => {
      // Invalid format
      expect(getCarrierInfo("1234567")).toBeNull();

      // Invalid prefix
      expect(getCarrierInfo("10123456")).toBeNull();

      // Non-numeric characters
      expect(getCarrierInfo("2012345a")).toBeNull();
    });

    describe("with strict mode", () => {
      it("should return carrier information for valid numbers in strict mode", () => {
        expect(getCarrierInfo("50123456", { strict: true })).toEqual(
          CARRIERS.OOREDOO,
        );
        expect(getCarrierInfo("+21650123456", { strict: true })).toEqual(
          CARRIERS.OOREDOO,
        );
      });

      it("should return null for invalid format in strict mode", () => {
        expect(getCarrierInfo("50 123 456", { strict: true })).toBeNull();
        expect(getCarrierInfo("+216 50123456", { strict: true })).toBeNull();
        expect(getCarrierInfo("50-123-456", { strict: true })).toBeNull();
      });
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format a local 8-digit number correctly", () => {
      expect(formatPhoneNumber("20123456")).toBe("+216 20 123 456");
    });

    it("should formats numbers that already include +216 prefix", () => {
      const result = formatPhoneNumber("+21620123456");
      expect(result).toBe("+216 20 123 456");
      expect(result).not.toBe("+216 21 620 123456");
    });
  });
});

import { COUNTRY_CODE } from "../constants";
import { validatePhoneNumber } from "../validators";
/**
 * Formats a Tunisian phone number
 * @param phoneNumber - The phone number to format
 * @returns formatted phone number with country code and proper spacing, null phone number is not valid
 */
export const formatPhoneNumber = (phoneNumber: string): string | null => {
  if (!validatePhoneNumber(phoneNumber)) return null;
  const cleaned = phoneNumber.replace(/\D/g, "").replace(/^216/, "");
  return `${COUNTRY_CODE} ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
};

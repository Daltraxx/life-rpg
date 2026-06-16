import { SecureCookiePayload } from "@/utils/types/cookies";

/**
 * Type guard function that validates if a payload is a valid SecureCookiePayload.
 * @param payload - The unknown payload to validate
 * @returns True if the payload is a valid SecureCookiePayload, false otherwise
 */
export const isValidCookiePayload = (payload: unknown): payload is SecureCookiePayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "value" in payload &&
    typeof payload.value === "string" &&
    "exp" in payload &&
    typeof payload.exp === "number" &&
    "nonce" in payload &&
    typeof payload.nonce === "string"
  );
};

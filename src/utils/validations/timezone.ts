/**
 * Checks if a given timezone string is a valid IANA timezone.
 *
 * @param timezone - The timezone string to validate (e.g., "America/New_York")
 * @returns True if the timezone is valid, false otherwise
 */
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

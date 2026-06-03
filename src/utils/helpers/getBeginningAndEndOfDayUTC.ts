import { TZDate } from "@date-fns/tz";
import { endOfDay, startOfDay } from "date-fns";

/**
 * Represents the UTC day boundaries.
 * @property {string} beginningOfDayUTC - The ISO string timestamp for the start of the day in UTC.
 * @property {string} endOfDayUTC - The ISO string timestamp for the end of the day in UTC.
 */
export interface UTCDayBoundaries {
  beginningOfDayUTC: string;
  endOfDayUTC: string;
}

/**
 * Calculates the beginning and end of the current day in UTC, based on the user's timezone.
 *
 * @param userTimezone - The user's timezone string (e.g., 'America/New_York')
 * @returns An object containing the ISO string timestamps for the start and end of the day in UTC
 * @throws {Error} If the timezone is invalid or day boundary calculation fails
 *
 * @example
 * const boundaries = getBeginningAndEndOfDayUTC('America/New_York');
 * console.log(boundaries.beginningOfDayUTC); // "2024-01-15T05:00:00.000Z"
 * console.log(boundaries.endOfDayUTC);       // "2024-01-16T04:59:59.999Z"
 */
export default function getBeginningAndEndOfDayUTC(
  userTimezone: string,
): UTCDayBoundaries {
  try {
    const nowInUserTZ = new TZDate(new Date(), userTimezone);

    // Start/end of the current day in the user's timezone
    const beginningOfDayUserTZ = startOfDay(nowInUserTZ);
    const endOfDayUserTZ = endOfDay(nowInUserTZ);

    // UTC timestamps for the start and end of the day in the user's timezone
    const beginningOfDayUTC = beginningOfDayUserTZ.toISOString();
    const endOfDayUTC = endOfDayUserTZ.toISOString();

    return { beginningOfDayUTC, endOfDayUTC };
  } catch (error) {
    console.error("Error calculating day boundaries:", error);
    throw new Error("Failed to calculate day boundaries", { cause: error });
  }
}

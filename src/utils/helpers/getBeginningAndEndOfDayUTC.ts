import { TZDate } from "@date-fns/tz";
import {
  startOfDay,
  subHours,
  setHours,
  subMilliseconds,
  addDays,
} from "date-fns";
import { DAY_BOUNDARY_HOUR_OFFSET } from "@/utils/constants/gameConstants";

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
 * Includes the hour offset for day boundaries as defined in game constants.
 * 
 * Flow:
 * 1. Get the current date and time in the user's timezone.
 * 2. Adjust the time by subtracting the day boundary hour offset, 
 *    ensuring that even if time is after midnight but before the boundary hour, 
 *    it is considered part of the previous day.
 * 3. Calculate the start and end of the day in the user's timezone, anchored at the wall-clock boundary hour.
 *    This takes into account time changes due to daylight saving time and other timezone-specific rules.
 * 4. Convert these times to UTC and return them as ISO string timestamps.
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
    // Adjust for the day boundary hour offset
    // For example, if DAY_BOUNDARY_HOUR_OFFSET is 2, and it is currently 1 AM in the user's timezone,
    // we consider it still part of the previous day.
    const adjustedTime = subHours(nowInUserTZ, DAY_BOUNDARY_HOUR_OFFSET);

    // Start/end of the current day in the user's timezone, anchored at the wall-clock boundary hour
    const beginningOfDayUserTZ = setHours(
      startOfDay(adjustedTime),
      DAY_BOUNDARY_HOUR_OFFSET
    );
    
    const endOfDayUserTZ = subMilliseconds(addDays(beginningOfDayUserTZ, 1), 1);

    // UTC timestamps for the start and end of the day in the user's timezone
    const beginningOfDayUTC = new Date(beginningOfDayUserTZ.getTime()).toISOString();
    const endOfDayUTC = new Date(endOfDayUserTZ.getTime()).toISOString();

    return { beginningOfDayUTC, endOfDayUTC };
  } catch (error) {
    console.error("Error calculating day boundaries:", error);
    throw new Error("Failed to calculate day boundaries", { cause: error });
  }
}

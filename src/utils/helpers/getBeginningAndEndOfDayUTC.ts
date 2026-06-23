import { TZDate } from "@date-fns/tz";
import { endOfDay, startOfDay, addHours, subHours } from "date-fns";
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

    // Start/end of the current day in the user's timezone shifted by the day boundary hour offset
    const beginningOfDayUserTZ = addHours(
      startOfDay(adjustedTime),
      DAY_BOUNDARY_HOUR_OFFSET,
    );
    const endOfDayUserTZ = addHours(endOfDay(adjustedTime), DAY_BOUNDARY_HOUR_OFFSET);

    // UTC timestamps for the start and end of the day in the user's timezone
    const beginningOfDayUTC = beginningOfDayUserTZ.toISOString();
    const endOfDayUTC = endOfDayUserTZ.toISOString();

    return { beginningOfDayUTC, endOfDayUTC };
  } catch (error) {
    console.error("Error calculating day boundaries:", error);
    throw new Error("Failed to calculate day boundaries", { cause: error });
  }
}

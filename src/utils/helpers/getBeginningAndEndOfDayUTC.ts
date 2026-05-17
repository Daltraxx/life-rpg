import { TZDate } from "@date-fns/tz";
import { endOfDay, startOfDay } from "date-fns";

export interface UTCDayBoundaries {
  beginningOfDayUTC: string;
  endOfDayUTC: string;
}
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
    throw new Error("Failed to calculate day boundaries");
  }
}

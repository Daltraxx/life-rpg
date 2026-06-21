"use client";

import { updateTimezone } from "@/utils/actions/update-timezone";
import { useEffect } from "react";

/**
 * TimezoneUpdater component that automatically detects and updates the user's timezone in the database.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactElement} The children wrapped in a timezone detection wrapper
 *
 * @remarks
 * - Detects the user's timezone on component mount using the Intl API
 * - Updates the timezone every 4 hours via a recurring interval
 * - Only updates the timezone in the database if it has changed since the last check
 * - Automatically cleans up the interval on component unmount
 */
export default function TimezoneUpdater({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let prevTimezone: string | null = null;
    const updateUserTimezone = () => {
      const updatedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (prevTimezone !== updatedTimezone) {
        prevTimezone = updatedTimezone;
        updateTimezone(updatedTimezone);
      }
    };

    // Run on component mount
    updateUserTimezone();

    const interval = setInterval(updateUserTimezone, 4 * 60 * 60 * 1000); // Update every 4 hours

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <>{children}</>;
}

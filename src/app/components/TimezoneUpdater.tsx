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
 * - Automatically cleans up the interval on component unmount
 */
export default function TimezoneUpdater({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const updateUserTimezone = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      updateTimezone(timezone);
    };

    // Run on component mount
    updateUserTimezone();

    const interval = setInterval(updateUserTimezone, 4 * 60 * 60 * 1000); // Update every 4 hours

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <>{children}</>;
}

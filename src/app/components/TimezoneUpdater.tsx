"use client";

import { updateTimezone } from "@/utils/actions/update-timezone";
import { useEffect } from "react";

export default function TimezoneUpdater({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const updateUserTimezone = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      updateTimezone(timezone);
      console.log("User timezone updated to:", timezone);
    };

    // Run on component mount
    updateUserTimezone();

    const interval = setInterval(updateUserTimezone, 4 * 60 * 60 * 1000); // Update every 4 hours

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <>{children}</>;
}

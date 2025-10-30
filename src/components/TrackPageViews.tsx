"use client";

import { useEffect } from "react";

export function TrackPageView({ userId }: { userId: string }): null {
  useEffect(() => {
    fetch("/api/analytics/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(console.error);
  }, [userId]);

  return null;
}

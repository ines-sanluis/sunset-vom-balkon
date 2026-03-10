"use client";

import { useCallback } from "react";

export function InviteInesButton({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  const onClick = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Einladung zum Sonnenuntergang",
          text: message,
        });
        return;
      }
    } catch {
      // user cancelled share; just return silently
    }

    // Fallback: show the text so it can be selected / shared manuell
    // eslint-disable-next-line no-alert
    alert(message);
  }, [message]);

  return (
    <button type="button" onClick={onClick} className={className}>
      Inés einladen
    </button>
  );
}



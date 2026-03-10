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
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Einladung zum Sonnenuntergang",
          text: message,
        });
      } catch {
        // user cancelled or share failed; do nothing
      }
      return;
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



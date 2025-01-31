"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAppExit(roomId: string, isRandom?: boolean) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isRandom) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only end conversation if actually closing tab/browser
      // or truly unloading the page (not just a client-side route change)
      if (e.type === "beforeunload") {
        const data = JSON.stringify({ roomId });
        navigator.sendBeacon("/api/chat/end_convo", data);

        e.preventDefault();
        e.returnValue = "";
      }
    };

    // If you are on a /chat route in the browser, then attach the unload handler
    if (pathname.startsWith("/chat")) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // We do nothing else on unmount, so that navigating from /chat/abc → /chat/xyz
      // does NOT trigger the conversation to end.
    };
  }, [roomId, pathname, isRandom]);
}

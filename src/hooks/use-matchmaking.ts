"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface MatchState {
  isSearching: boolean;
  handleConnect: () => Promise<void>;
  handleCancelSearch: () => Promise<void>;
}

export function useMatchmaking(isRandom: boolean, isBlitz = false): MatchState {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [matchInterval, setMatchInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  if (!isRandom && !isBlitz) {
    return {
      isSearching: false,
      handleConnect: async () => {},
      handleCancelSearch: async () => {},
    };
  }

  const checkMatch = useCallback(async () => {
    try {
      if (isBlitz) {
        const response = await fetch("/api/chat/match/blitz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("Match check response:", data);

        if (data.status === "matched" && data.matchedUser) {
          setIsSearching(false);
          if (matchInterval) {
            clearInterval(matchInterval);
            setMatchInterval(null);
          }
          router.push(
            `/chat/${data.room_id}?username=${data.matchedUser.username}&isRandom=true&isBlitz=true`
          );
          return true;
        }

        return false;
      }

      const response = await fetch("/api/chat/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Match check response:", data);

      if (data.status === "matched" && data.matchedUser) {
        setIsSearching(false);
        if (matchInterval) {
          clearInterval(matchInterval);
          setMatchInterval(null);
        }
        router.push(
          `/chat/${data.room_id}?username=${data.matchedUser.username}&isRandom=true`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Match check error:", error);
      return false;
    }
  }, [matchInterval, router, isBlitz]);

  const handleConnect = useCallback(async () => {
    setIsSearching(true);
    const interval = setInterval(async () => {
      const matched = await checkMatch();
      if (matched) {
        clearInterval(interval);
        setMatchInterval(null);
      }
    }, 3000);
    setMatchInterval(interval);
  }, [checkMatch]);

  const handleCancelSearch = useCallback(async () => {
    setIsSearching(false);
    if (matchInterval) {
      clearInterval(matchInterval);
      setMatchInterval(null);
    }

    try {
      const response = await fetch("/api/chat/cancel-match", {
        method: "POST",
      });
      const data = await response.json();
      console.log("Cancelled search:", data);
    } catch (error) {
      console.error("Error cancelling search:", error);
    }
  }, [matchInterval]);

  useEffect(() => {
    return () => {
      if (matchInterval) {
        clearInterval(matchInterval);
      }
    };
  }, [matchInterval]);

  return {
    isSearching,
    handleConnect,
    handleCancelSearch,
  };
}

"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface RoomDeletionProps {
  roomId: string;
  setStatus: (status: string) => void;
  isRandom?: boolean;
  isBlitz?: boolean;
}

export function useRoomDeletion({
  roomId,
  setStatus,
  isRandom,
  isBlitz,
}: RoomDeletionProps) {
  const supabase = createClient();

  useEffect(() => {
    // Return if neither random nor blitz
    if (!isRandom && !isBlitz) return;

    const channel = supabase
      .channel("room_deletion")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_rooms",
          filter: `id=eq.${roomId}`,
        },
        () => {
          setStatus("ended");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase, setStatus, isRandom, isBlitz]);
}

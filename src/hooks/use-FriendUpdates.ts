import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/supabase";
type User = Tables<"profiles">;

export function useFriendUpdates(
  setFriendRequests: (users: User[]) => void,
  setContacts: (users: User[]) => void
) {
  useEffect(() => {
    const supabase = createClient();

    // Subscribe to friend requests
    const friendRequestsChannel = supabase
      .channel("friend-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
          filter: `status=eq.pending`,
        },
        async () => {
          const response = await fetch("/api/friend?status=pending");
          const data = await response.json();
          setFriendRequests(data.friendRequests);
        }
      )
      .subscribe();

    // Subscribe to accepted friends
    const acceptedFriendsChannel = supabase
      .channel("accepted-friends")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
          filter: `status=eq.accepted`,
        },
        async () => {
          const response = await fetch("/api/friend?status=accepted");
          const data = await response.json();
          setContacts(data.acceptedFriends);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "friendships",
        },
        async () => {
          // Refresh contacts list after unfriend
          const response = await fetch("/api/friend?status=accepted");
          const data = await response.json();
          setContacts(data.acceptedFriends);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendRequestsChannel);
      supabase.removeChannel(acceptedFriendsChannel);
    };
  }, [setFriendRequests, setContacts]);
}

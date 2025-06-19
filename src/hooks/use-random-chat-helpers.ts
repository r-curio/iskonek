import { useMatchmaking } from "./use-matchmaking";
import { useAppExit } from "./use-app-exit";
import { useRoomDeletion } from "./use-room-delete";

export function useRandomChatHelpers(
  isRandom: boolean,
  roomId: string,
  setStatus: (status: string) => void
) {
  // Always call useMatchmaking with required parameters
  const matchmaking = useMatchmaking(isRandom, false);

  // Always call useAppExit and useRoomDeletion hooks
  useAppExit(roomId, isRandom);
  useRoomDeletion({ roomId, setStatus, isRandom });

  return {
    isSearching: matchmaking.isSearching,
    handleConnect: matchmaking.handleConnect,
    handleCancelSearch: matchmaking.handleCancelSearch,
  };
}

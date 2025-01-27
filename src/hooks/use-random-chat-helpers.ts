import { useMatchmaking } from './use-matchmaking'
import { useAppExit } from './use-app-exit'
import { useRoomDeletion } from './use-room-delete'

export function useRandomChatHelpers(isRandom: boolean, roomId: string, setStatus: (status: string) => void) {
    const matchmaking = isRandom ? useMatchmaking() : null
    
    // Only set up effects if this is a random chat
    useEffect(() => {
        if (!isRandom) return

        const cleanup = useAppExit(roomId)
        useRoomDeletion({ roomId, setStatus })

        return () => {
            cleanup?.()
        }
    }, [isRandom, roomId, setStatus])

    return {
        isSearching: matchmaking?.isSearching || false,
        handleConnect: matchmaking?.handleConnect || (() => {}),
        handleCancelSearch: matchmaking?.handleCancelSearch || (() => {})
    }
}
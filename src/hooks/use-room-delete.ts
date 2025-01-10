'use client'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface RoomDeletionProps {
    roomId: string
    setStatus: (status: string) => void
}

export function useRoomDeletion({ roomId, setStatus }: RoomDeletionProps) {
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase.channel('room_deletion')
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_rooms',
                filter: `id=eq.${roomId}`
            }, () => {
                setStatus('ended') // Match this with the check in ChatWindow
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, supabase, setStatus])
}
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function useRoomDeletion(roomId: string) {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase.channel('room_deletion')
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_rooms',
                filter: `id=eq.${roomId}`
            }, () => {
                router.push('/chat')
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, router, supabase])
}
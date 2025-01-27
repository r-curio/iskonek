interface handleAddFriendProps {
    recipientUsername: string | undefined
}

export async function handleAddFriend({ recipientUsername }: handleAddFriendProps) {
    
    console.log('recipientUsername:', recipientUsername)

    if (!recipientUsername) {
        throw new Error('Recipient username is required')
    }

    try {
        const response = await fetch('/api/friend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'username': recipientUsername
            }
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error)
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error))
        return { success: false, error }
    }

    return { success: true }
}

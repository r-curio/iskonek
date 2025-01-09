'use client'
import { Button } from '@/components/ui/button'
import LoadingScreen from './loading'
import { useMatchmaking } from '@/hooks/use-matchmaking'

export default function Page() {
    const { isSearching, handleConnect, handleCancelSearch } = useMatchmaking()

    return (
        <div>
            <h1>Chat Page</h1>
            <div>
                <Button onClick={handleConnect}>Connect</Button>
                <Button onClick={handleCancelSearch}>Cancel</Button>
                {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch} />}
            </div>
        </div>
    )
}
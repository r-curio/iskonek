import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BsGearFill } from "react-icons/bs"


interface UserProfileProps {
    avatarUrl: string;
    name: string;
}

export default function UserProfile({ avatarUrl, name }: UserProfileProps) {
    return (
        <div className="p-4 flex items-center space-x-4">
            <Avatar>
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {name}
                </p>
            </div>
            <Button variant="ghost" size="icon">
                <BsGearFill />
                <span className="sr-only">Settings</span>
            </Button>
        </div>
    )
}
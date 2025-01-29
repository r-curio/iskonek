import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BsGearFill } from "react-icons/bs"
import SettingsView from "@/components/profilesetting/settings-view"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarSelectView from "@/components/profilesetting/avatar-select-view" // Import the new component

interface UserProfileProps {
  avatarUrl: string
  name: string
}

export default function UserProfile({ avatarUrl, name }: UserProfileProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAvatarSelectOpen, setIsAvatarSelectOpen] = useState(false)

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true)
  }

  const handleAvatarClick = () => {
    setIsSettingsOpen(false)
    setIsAvatarSelectOpen(true)
  }

  return (
    <div className="p-4 flex items-center space-x-4">
      <Avatar onClick={handleAvatarClick} className="cursor-pointer">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSettingsOpen}>
        <BsGearFill />
        <span className="sr-only">Settings</span>
      </Button>

      <SettingsView open={isSettingsOpen} onOpenChange={setIsSettingsOpen} onAvatarClick={handleAvatarClick} />
      <AvatarSelectView open={isAvatarSelectOpen} onOpenChange={setIsAvatarSelectOpen} />
    </div>
  )
}


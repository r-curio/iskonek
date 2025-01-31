import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BsGearFill } from "react-icons/bs";
import SettingsView from "@/components/profilesetting/settings-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarSelectView from "@/components/profilesetting/avatar-select-view"; // Import the new component

interface UserProfileProps {
  avatarUrl: string;
  name: string;
  department: string;
  bgColor: string;
}

export default function UserProfile({
  avatarUrl,
  name,
  department,
  bgColor,
}: UserProfileProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarSelectOpen, setIsAvatarSelectOpen] = useState(false);

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleAvatarClick = () => {
    setIsSettingsOpen(false);
    setIsAvatarSelectOpen(true);
  };

  const handleAvatarSelectClose = () => {
    setIsAvatarSelectOpen(false);
    setIsSettingsOpen(true);
  };

  return (
    <div className="p-3.5 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar
            onClick={handleSettingsOpen}
            className="cursor-pointer w-10 h-10 ring-2 ring-white hover:ring-primary/20 transition-all duration-200"
          >
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary/10">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate hover:text-primary transition-colors duration-200">
            {name}
          </p>
          <p className="text-xs text-gray-500 truncate">{department}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSettingsOpen}
          className="hover:bg-[#682A43] hover:text-white transition-colors duration-200"
        >
          <BsGearFill className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>

      <SettingsView
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onAvatarClick={handleAvatarClick}
        username={name}
        department={department}
        avatarUrl={avatarUrl}
        bgColor={bgColor}
      />
      <AvatarSelectView
        open={isAvatarSelectOpen}
        onOpenChange={setIsAvatarSelectOpen}
        onClose={handleAvatarSelectClose}
      />
    </div>
  );
}

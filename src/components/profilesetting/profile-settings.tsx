'use client'

import { Button } from "@/components/ui/button"
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";

interface ProfileSettingsProps {
  activeView: string
  onViewChange: (view: string) => void
}

export default function ProfileSettings({ activeView, onViewChange }: ProfileSettingsProps) {
  return (
    <div className="w-48 border-r h-full bg-background flex flex-col justify-between">
  <div className="flex flex-col space-y-1 p-2">
    <h2 className="text-lg font-semibold px-4 py-2">Settings</h2>
    <Button
      variant={activeView === 'profile' ? 'secondary' : 'ghost'}
      className="justify-start"
      onClick={() => onViewChange('profile')}
      style={{
        backgroundColor: activeView === 'profile' ? '#682A43' : 'transparent',
        color: activeView === 'profile' ? '#FFFFFF' : 'inherit'
      }}
    >
      <CgProfile className="mr-2 h-4 w-4" style={{ color: '#FFFFFF' }} />
      Profile
    </Button>
  </div>
  <div className="p-2">
    <Button variant="ghost" className="justify-start text-destructive">
      <CiLogout className="mr-2 h-4 w-4" />
      Logout
    </Button>
  </div>
</div>
  )
}


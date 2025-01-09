'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import ProfileSettings from "@/components/profilesetting/profile-settings"
import ProfileView from "@/components/profilesetting/profile-view"
import  PasswordSettings  from "@/components/profilesetting/password-settings"

interface SettingsViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsView({ open, onOpenChange }: SettingsViewProps) {
  const [activeView, setActiveView] = useState('profile')
  const [isPasswordView, setIsPasswordView] = useState(false)

  const handlePasswordEdit = () => {
    setIsPasswordView(true)
  }

  const handlePasswordCancel = () => {
    setIsPasswordView(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <div className="flex">
          <ProfileSettings activeView={activeView} onViewChange={setActiveView} />
          {isPasswordView ? (
            <PasswordSettings onCancel={handlePasswordCancel} />
          ) : (
            <ProfileView onPasswordEdit={handlePasswordEdit} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
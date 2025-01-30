"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ProfileSettings from "@/components/profilesetting/profile-settings"
import ProfileView from "@/components/profilesetting/profile-view"
import PasswordSettings from "@/components/profilesetting/password-settings"
import ManageAccount from "@/components/profilesetting/manage-account"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { DialogTitle } from "@radix-ui/react-dialog"

interface SettingsViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAvatarClick: () => void
  username: string
  department: string
  avatarUrl?: string
}

export default function SettingsView({ open, onOpenChange, onAvatarClick, username, department, avatarUrl }: SettingsViewProps) {
  const [activeView, setActiveView] = useState("profile")
  const [isPasswordView, setIsPasswordView] = useState(false)

  useEffect(() => {
    if (!open) {
      // Reset the view when the dialog closes
      setActiveView("profile")
      setIsPasswordView(false)
    }
  }, [open])

  const handlePasswordEdit = () => {
    setIsPasswordView(true)
  }

  const handlePasswordCancel = () => {
    setIsPasswordView(false)
  }

  const handleViewChange = (view: string) => {
    setIsPasswordView(false)
    setActiveView(view)
  }

  const renderRightComponent = () => {
    switch (activeView) {
      case "profile":
        return isPasswordView ? (
          <PasswordSettings onCancel={handlePasswordCancel} />
        ) : (
          <ProfileView 
            onPasswordEdit={handlePasswordEdit} 
            onAvatarClick={onAvatarClick} 
            name={username} 
            department={department}
            avatarUrl={avatarUrl}
        />
        )
      case "manage-account":
        return <ManageAccount />
      default:
        return <ProfileView onPasswordEdit={handlePasswordEdit} onAvatarClick={onAvatarClick} name={username} department={department} avatarUrl={avatarUrl} />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden.Root>
        <DialogTitle>Settings</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className="max-w-3xl p-0 gap-0 h-[550px] rounded-lg overflow-hidden border-none">
        <div className="flex h-full bg-white">
          <ProfileSettings activeView={activeView} onViewChange={handleViewChange}/>
          <div className="flex-1 overflow-y-auto transition-all duration-300">{renderRightComponent()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
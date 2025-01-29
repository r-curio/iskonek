'use client'

import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { createAvatar } from '@dicebear/core'
import { funEmoji } from '@dicebear/collection'
import { avatarsList } from "@/utils/avatars"
import { Check } from "lucide-react"

interface AvatarSelectViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void

}

export default function AvatarSelectView({ open, onOpenChange }: AvatarSelectViewProps) {
  const [selectedAvatarName, setSelectedAvatarName] = useState<string | null>(null)

  const handleAvatarSelect = (avatarName: string) => {
    setSelectedAvatarName(avatarName)
    console.log('Selected avatar:', avatarName)
  }

  const handleConfirm = async () => {
    if (selectedAvatarName) {
      onOpenChange(false)
    }

    // Send the selected avatar to the server
    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'avatar': selectedAvatarName || ''
        }
      })
      const data = await response.json()
      console.log('Avatar update response:', data)
    } catch (error) {
      console.error('Error updating avatar:', error)
    }

  }



  useEffect(() => {
    if (!open) {
      setSelectedAvatarName(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl">
        <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-4">
          Choose Your Avatar
        </DialogTitle>
        <div className="grid grid-cols-4 gap-6 py-6 px-2">
          {avatarsList.map((avatarName, index) => {
            const avatarImage = createAvatar(funEmoji, { seed: avatarName })
            const dataUri = avatarImage.toDataUri()
            
            return (
              <div
                key={avatarName}
                className="relative flex items-center justify-center"
              >
                <Avatar
                  className={`h-20 w-20 transition-all duration-200 cursor-pointer hover:scale-105 ${
                    selectedAvatarName === avatarName
                      ? 'ring-4 ring-blue-500 ring-offset-2'
                      : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
                  }`}
                  onClick={() => handleAvatarSelect(avatarName)}
                >
                  <AvatarImage src={dataUri} alt={`Avatar option ${avatarName}`} />
                  <AvatarFallback>{index + 1}</AvatarFallback>
                </Avatar>
                {selectedAvatarName === avatarName && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <DialogFooter className="sm:justify-center mt-6">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedAvatarName}
            className=" text-white bg-accent hover:bg-accent/90"
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
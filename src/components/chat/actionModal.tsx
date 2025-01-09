import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  interface ActionModalProps {
    isOpen: boolean
    onClose: () => void
    onEndChat: () => void
    username: string
  }
  
  export function ActionModal({
    isOpen,
    onClose,
    onEndChat,
    username
  }: ActionModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm your Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to end your chat with {username}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onEndChat} className="bg-[#682A43] text-white">
              End Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  
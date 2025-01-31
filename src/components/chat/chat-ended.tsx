"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, UserPlus, RefreshCcw } from "lucide-react";

interface ChatEndedOptionsProps {
  onGoHome: () => void;
  onAddFriend: () => void;
  onNewChat: () => void;
  partnerName: string | undefined;
}

export function ChatEndedOptions({
  onGoHome,
  onAddFriend,
  onNewChat,
  partnerName,
}: ChatEndedOptionsProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-yellow-100 border-yellow-300">
      <CardContent className="p-4">
        <p className="text-center font-semibold mb-4">
          Your conversation with {partnerName} has ended.
        </p>
        <p className="text-center text-sm text-gray-600 mb-4">
          What would you like to do next?
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full justify-start"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
          <Button
            onClick={onAddFriend}
            variant="outline"
            className="w-full justify-start"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add {partnerName} as Friend
          </Button>
          <Button
            onClick={onNewChat}
            variant="default"
            className="w-full justify-start"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Start a New Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

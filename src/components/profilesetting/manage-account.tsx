"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageAccount() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete account",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Account Deletion
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone.</p>
        </div>

        <div className="flex items-start space-x-3 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-800">Warning</p>
            <p className="text-xs sm:text-sm text-red-600">
              Deleting your account will permanently remove all your data,
              including your profile, settings, and activity history.
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              className="h-10 sm:h-11 border-gray-200 focus:border-red-300 focus:ring-red-200 text-sm sm:text-base"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
              type="password"
              className="h-10 sm:h-11 border-gray-200 focus:border-red-300 focus:ring-red-200 text-sm sm:text-base"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="mt-0.5"
            />
            <label
              htmlFor="confirm"
              className="text-xs sm:text-sm text-gray-600 leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that this action is permanent and irreversible
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex justify-end">
        <Button
          disabled={!isConfirmed}
          className="bg-red-600 text-white hover:bg-red-700 h-10 sm:h-11 px-6 sm:px-8 transition-colors text-sm w-full sm:w-auto"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}

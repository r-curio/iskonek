"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";
import { FaUserGear } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

interface ProfileSettingsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function ProfileSettings({
  activeView,
  onViewChange,
}: ProfileSettingsProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleViewChange = (view: string) => {
    onViewChange(view);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.replace("/auth/login");
        router.refresh();
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <div className="w-64 border-r border-gray-100 h-full bg-[#FAF9F6] flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-semibold px-4 py-4 text-gray-800">
          Settings
        </h2>
      </div>

      {/* Fixed height container for navigation buttons */}
      <div className="flex-1 px-4 pb-4">
        <div className="space-y-2">
          <Button
            className={`w-full justify-start h-12 rounded-lg transition-all duration-200 ${
              activeView === "profile"
                ? "bg-[#682A43] text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-[#682A43] hover:text-white"
            }`}
            onClick={() => handleViewChange("profile")}
          >
            <CgProfile className="mr-3 h-5 w-5" />
            Profile
          </Button>
          <Button
            className={`w-full justify-start h-12 rounded-lg transition-all duration-200 ${
              activeView === "manage-account"
                ? "bg-[#682A43] text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-[#682A43] hover:text-white"
            }`}
            onClick={() => handleViewChange("manage-account")}
          >
            <FaUserGear className="mr-3 h-5 w-5" />
            Manage Account
          </Button>
        </div>
      </div>

      {/* Fixed bottom section */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-[#693d52] hover:bg-[#532e40] hover:text-white transition-colors rounded-lg"
          onClick={handleLogoutClick}
          disabled={isLoading}
        >
          <CiLogout className="mr-3 h-5 w-5" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-red-50">
                <CiLogout className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Sign Out
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to sign out of your account?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                className="min-w-[100px] bg-gray-100 hover:bg-gray-200 text-gray-700"
                variant="secondary"
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="min-w-[100px] bg-[#693d52] hover:bg-[#532e40]"
                onClick={handleConfirmClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                    <span>Signing out...</span>
                  </div>
                ) : (
                  "Sign out"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

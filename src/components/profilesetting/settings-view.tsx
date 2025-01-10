'use client'

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProfileSettings from "@/components/profilesetting/profile-settings";
import ProfileView from "@/components/profilesetting/profile-view";
import PasswordSettings from "@/components/profilesetting/password-settings";
import ManageAccount from "@/components/profilesetting/manage-account";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";

interface SettingsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsView({ open, onOpenChange }: SettingsViewProps) {
  const [activeView, setActiveView] = useState('profile');
  const [isPasswordView, setIsPasswordView] = useState(false);

  const handlePasswordEdit = () => {
    setIsPasswordView(true);
  };

  const handlePasswordCancel = () => {
    setIsPasswordView(false);
  };

  const handleViewChange = (view: string) => {
    setIsPasswordView(false);
    setActiveView(view);
  };

  const renderRightComponent = () => {
    switch (activeView) {
      case 'profile':
        return isPasswordView ? <PasswordSettings onCancel={handlePasswordCancel} /> : <ProfileView onPasswordEdit={handlePasswordEdit} />;
      case 'manage-account':
        return <ManageAccount />;
      default:
        return <ProfileView onPasswordEdit={handlePasswordEdit} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden.Root>
        <DialogTitle>Settings</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className="max-w-3xl p-0 gap-0 h-[550px]">
        <div className="flex h-full">
          <ProfileSettings activeView={activeView} onViewChange={handleViewChange} />
          <div className="flex-1 overflow-y-auto">
            {renderRightComponent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
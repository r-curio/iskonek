'use client'

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProfileSettings from "@/components/profilesetting/profile-settings";
import ProfileView from "@/components/profilesetting/profile-view";
import PasswordSettings from "@/components/profilesetting/password-settings";
import ManageAccount from "@/components/profilesetting/manage-account";

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
      <DialogContent className="max-w-3xl p-0 gap-0">
        <div className="flex">
          <ProfileSettings activeView={activeView} onViewChange={handleViewChange} />
          {renderRightComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
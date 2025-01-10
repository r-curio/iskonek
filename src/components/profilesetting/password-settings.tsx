'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface PasswordSettingsProps {
  onCancel: () => void;
}

export default function PasswordSettings({ onCancel }: PasswordSettingsProps) {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Change Password</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Password</label>
          <Input type="password" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <Input type="password" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <Input type="password" />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <Button onClick={onCancel} className="hover:bg-[#919192] hover:text-white" variant="secondary">
          Cancel
        </Button>
        <Button className="bg-[#682A43] text-white hover:bg-[#532e40]" variant="default">
          Save
        </Button>
      </div>
    </div>
  );
}
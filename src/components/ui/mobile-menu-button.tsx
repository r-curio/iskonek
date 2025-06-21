"use client";
import { Button } from "@/components/ui/button";
import { BsList, BsX } from "react-icons/bs";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MobileMenuButton({ 
  isOpen, 
  onToggle, 
  className = "" 
}: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={`bg-white shadow-lg rounded-lg ${className}`}
    >
      {isOpen ? (
        <BsX className="h-6 w-6" />
      ) : (
        <BsList className="h-6 w-6" />
      )}
    </Button>
  );
} 
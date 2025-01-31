import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { IconType } from "react-icons";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconType;
  placeholder: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { icon: Icon, placeholder, className = "", value, onChange, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={`pl-10 pr-4 py-2 w-full rounded-lg ${className}`}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

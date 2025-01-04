import React from 'react'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType
  containerClassName?: string
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, icon: Icon, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <Input
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
      </div>
    )
  }
)

CustomInput.displayName = "CustomInput"

export { CustomInput }


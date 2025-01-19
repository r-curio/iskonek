'use client'
import CardWrapper from "./card-wrapper"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { resetPasswordSchema } from "@/schema"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/app/auth/reset-password/action"
import { useRouter } from "next/navigation"

export default function ResetPasswordForm(): JSX.Element {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(formData: FormData) {
        const response = await resetPassword(formData);
    
        if (response?.error) {
            toast({
                title: "Error",
                description: response.error.toString(),
                variant: "destructive",
            });
            return;
        }
    
        toast({
            title: "Success",
            description: "Password reset successfully. Please go back to the Login Page.",
        });
    
        setTimeout(() => {
            router.push('/auth/login');
        }, 3000);
    }

    return (
        <CardWrapper 
            label="Reset Password"
            title="Change your password"
            footerText="Remember your password? "
            backButtonText="Login here."
            backButtonPath="/auth/login"
        >
            <Form {...form}>
                <form action={onSubmit} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} placeholder="New Password"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} placeholder="Confirm New Password"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Change Password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
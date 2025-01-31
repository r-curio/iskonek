'use client'
import { useEffect, useState } from 'react';
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
import { useRouter } from "next/navigation"
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordForm(): JSX.Element {
    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()
    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: { newPassword: string, confirmPassword: string }) {
        if (data.newPassword !== data.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: data.newPassword,
        });

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Success",
            description: "Password reset successfully. Redirecting to login...",
        });

        router.push('/auth/login');
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
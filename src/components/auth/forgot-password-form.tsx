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
import { forgotPasswordSchema } from "@/schema"
import { useToast } from "@/hooks/use-toast"
import { forgotPassword } from "@/app/auth/forgot-password/action"

export function EmailVerificationForm(): JSX.Element {
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: { email: string }) {
        const response = await forgotPassword(values) // Pass plain object

        if (response?.error) {
            toast({
                title: "Error",
                description: response.error.toString(),
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Success",
            description: "Password reset instructions sent to your email.",
            variant: "success",
        })

        form.reset()
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <CardWrapper
                label="Reset Password"
                title="Reset your password"
                footerText="Remember your password? "
                backButtonText="Back to login"
                backButtonPath="/auth/login"
                className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">PUP WebMail</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="johndoe@iskolarngbayan.pup.edu.ph"
                                            {...field}
                                            className="h-11 text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-11">
                            Send Reset Instructions
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}

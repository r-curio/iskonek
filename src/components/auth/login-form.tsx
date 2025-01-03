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
import { loginSchema } from "@/schema"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { z } from "zod"

export default function LoginForm(): JSX.Element {

    const { toast } = useToast()
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async(values: z.infer<typeof loginSchema>): Promise<void> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
    
            const data = await response.json();
            
            if (response.ok) {
                toast({
                    title: "Success",
                    description: "You have successfully logged in.",
                    variant: "default",
                });
    
                await new Promise(resolve => setTimeout(resolve, 100));

                router.push("/chat");
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: data.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        }
    };

    return (
        <CardWrapper 
            label="Sign In"
            title="Sign in to an account"
            backButtonText="Don't have an account? Register Here" 
            backButtonPath="/auth/register"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******"{...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Sign In</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
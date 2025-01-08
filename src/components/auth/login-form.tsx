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
import { login } from "@/app/auth/login/actions"

export default function LoginForm(): JSX.Element {

    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(formData: FormData) {
        const response = await login(formData)

        if (response?.error) {
            toast({
                title: "Error",
                description: response.error.toString(),
                variant: "destructive",
            })
            return
        }

    }

    return (
        <CardWrapper 
            label="Sign In"
            title="Sign in to an account"
            footerText="Don't have an account? "
            backButtonText="Register here." 
            backButtonPath="/auth/register"
        >
            <Form {...form}>
                <form action={onSubmit} className="space-y-8">
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PUP WebMail</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="johndoe@iskolarngbayan.pup.edu.ph" {...field} />
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
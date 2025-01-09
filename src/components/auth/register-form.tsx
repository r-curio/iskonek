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
import { registerSchema } from "@/schema"
import { useToast } from "@/hooks/use-toast"
import { signup } from "@/app/auth/register/actions"
import { useRouter } from "next/navigation"

export default function RegisterForm(): JSX.Element {
    
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(formData: FormData) {        
        const response = await signup(formData)

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
            description: "Please check your email to verify your account",
        })
        
        setTimeout(() => {
            router.push('/auth/login?verified=false')
        }, 3000)
    }

    return (
        <CardWrapper 
            label="Register"
            title="Create an account"
            footerText="Already have an account? "
            backButtonText="Login here."
            backButtonPath="/auth/login"
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
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe" {...field} />
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
                                    <Input type="password" {...field} placeholder="******"/>
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
                                    <Input type="password" {...field} placeholder="******"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
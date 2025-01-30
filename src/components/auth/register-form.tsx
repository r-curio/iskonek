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
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from "@/components/ui/select"
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
            department: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: Record<string, string>) {
        // Create FormData from the form values
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value as string)
        })
                
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CAF">College of Accountancy and Finance (CAF)</SelectItem>
                                        <SelectItem value="CADBE">College of Architecture, Design and the Built Environment (CADBE)</SelectItem>
                                        <SelectItem value="CAL">College of Arts and Letters (CAL)</SelectItem>
                                        <SelectItem value="CBA">College of Business Administration (CBA)</SelectItem>
                                        <SelectItem value="COC">College of Communication (COC)</SelectItem>
                                        <SelectItem value="CCIS">College of Computer and Information Sciences (CCIS)</SelectItem>
                                        <SelectItem value="COED">College of Education (COED)</SelectItem>
                                        <SelectItem value="COE">College of Engineering (COE)</SelectItem>
                                        <SelectItem value="CHK">College of Human Kinetics (CHK)</SelectItem>
                                        <SelectItem value="CL">College of Law (CL)</SelectItem>
                                        <SelectItem value="CPSPA">College of Political Science and Public Administration (CPSPA)</SelectItem>
                                        <SelectItem value="CSSD">College of Social Sciences and Development (CSSD)</SelectItem>
                                        <SelectItem value="CS">College of Science (CS)</SelectItem>
                                        <SelectItem value="CTHTM">College of Tourism, Hospitality, and Transportation Management (CTHTM)</SelectItem>
                                    </SelectContent>
                                </Select>
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
                    <Button type="submit" className="w-full bg-accent">
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
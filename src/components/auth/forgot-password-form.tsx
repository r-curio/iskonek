"use client";
import CardWrapper from "./card-wrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/schema";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword } from "@/app/auth/forgot-password/action";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm(): JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(formData: FormData) {
    const response = await forgotPassword(formData);

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
      description: "Password reset instructions sent to your email",
    });
  }

  return (
    <CardWrapper
      label="Forgot Password"
      title="Reset your password"
      footerText="Remember your password? "
      backButtonText="Back to login"
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
                  <Input
                    type="email"
                    placeholder="juandelacruz@iskolarngbayan.pup.edu.ph"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-accent">
            Send Instructions
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

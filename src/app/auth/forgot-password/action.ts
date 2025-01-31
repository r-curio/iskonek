"use server";
import { forgotPasswordSchema } from "@/schema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
  };

  const result = forgotPasswordSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { email } = result.data;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

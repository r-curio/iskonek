import * as z from 'zod';

export const registerSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email address"
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters long"
    }),
    department: z.string().min(3, {
        message: "Select a department"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
});

export const loginSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email address"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
});
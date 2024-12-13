import * as z from 'zod';

export const registerSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email address"
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters long"
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

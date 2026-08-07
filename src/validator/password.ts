import { z } from "zod";

const password = z.string().min(4, "Password must be at least 4 characters long");

export const passwordSchema = z.strictObject({ password });

export const resetPasswordSchema = z.strictObject({
  oldPassword: password,
  newPassword: password,
  confirmPassword: password
}).refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, "Confirm your new password ❗");


export type PasswordFormData = z.infer<typeof passwordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
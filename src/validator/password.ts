import { z } from "zod";

const password = z.string().min(4, "Password must be at least 4 characters long");

export const passwordSchema = z.strictObject({ password });

export const passwordSetupSchema = z.strictObject({
  password,
  confirmPassword: password
}).refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  {
    path: ["confirmPassword"],
    error: "Confirm your password."
  }
);

export const resetPasswordSchema = z.strictObject({
  oldPassword: password,
  newPassword: password,
  confirmPassword: password
}).superRefine(({ oldPassword, newPassword, confirmPassword }, ctx) => {
  if (newPassword !== confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Confirm your new password.",
      path: ["confirmPassword"],
    });
  }

  if (newPassword === oldPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Old and new password can't be same.",
      path: ["newPassword"],
    });
  }
});
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type PasswordSetupFormData = z.infer<typeof passwordSetupSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

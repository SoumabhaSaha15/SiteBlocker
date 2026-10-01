import { useEffect, useState } from 'react';
import Save from '@mui/icons-material/Save';
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from '@mui/material';
import PasswordInputField from '@/shared/PasswordInputField';
import { useForm, type SubmitHandler } from "react-hook-form";
import { enqueueSnackbar, type OptionsObject } from "notistack";
import { resetPasswordSchema, type ResetPasswordSchema } from '@/validator/password';
import { setAppPassword, verifyAppPassword, getPasswordProtected } from "@/utils/password";

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
}
export default function Password() {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema)
  });

  useEffect(() => {
    getPasswordProtected()
      .then((data) => setIsDisabled(!data));
  }, [])

  const formSubmit: SubmitHandler<ResetPasswordSchema> = async ({ oldPassword, newPassword }) => {
    const verified = await verifyAppPassword(oldPassword);
    if (verified) {
      setAppPassword(newPassword);
      reset();
      enqueueSnackbar({
        key: crypto.randomUUID(),
        message: "Password updated ✅",
        ...SNACK_OPTION
      });
    }
    else {
      enqueueSnackbar({
        key: crypto.randomUUID(),
        message: "Incorrect password ❌",
        ...SNACK_OPTION
      });
    }
  }

  return (
    <Box className="min-h-[calc(100dvh-4rem)] grid place-items-center p-4">
      <Box
        component={"form"}
        className="flex flex-col items-center w-full max-w-160 p-4 gap-4 rounded-xl"
        sx={{ backgroundColor: "background.paper" }}
        onSubmit={handleSubmit(formSubmit)}
      >
        <Typography
          variant='h5'
          component="h5"
          sx={{ borderColor: "divider", borderWidth: 1, backgroundColor: "secondary.main", color: "secondary.contrastText" }}
          className='w-full max-w-160 p-2 rounded-lg text-center'
          children={"Reset password 🔐"}
        />

        <PasswordInputField
          {...register("oldPassword")}
          slotProps={{ input: { className: "rounded-lg" } }}
          sx={{ minWidth: "min(640px,100%)" }}
          label="Current password"
          variant='outlined'
          disabled={isDisabled || isSubmitting}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message}
        />
        <PasswordInputField
          {...register("newPassword")}
          slotProps={{ input: { className: "rounded-lg" } }}
          sx={{ minWidth: "min(640px,100%)" }}
          label="New password"
          variant='outlined'
          disabled={isDisabled || isSubmitting}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />
        <PasswordInputField
          {...register("confirmPassword")}
          slotProps={{ input: { className: "rounded-lg" } }}
          sx={{ minWidth: "min(640px,100%)" }}
          label="Confirm password"
          variant='outlined'
          disabled={isDisabled || isSubmitting}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          variant='contained'
          sx={{ minWidth: "min(640px,100%)" }}
          size='large'
          className='rounded-lg'
          disabled={isDisabled || isSubmitting}
          type='submit'
          startIcon={<Save />}
          children={(isDisabled) ? "Enable the app-lock first" : "Save"}
        />
      </Box>
    </Box>
  );
}

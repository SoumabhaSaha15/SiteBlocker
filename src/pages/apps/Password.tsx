import Save from '@mui/icons-material/Save';
import { enqueueSnackbar, type OptionsObject } from "notistack";
import PasswordIcon from '@mui/icons-material/Lock';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, TextField, Button, Typography } from '@mui/material';
import { verifyAppPassword, setAppPassword } from "@/utils/password";
import { resetPasswordSchema, type ResetPasswordSchema } from '@/validator/password';

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
}
export default function Password() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema)
  });

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
    <>
      <Box component={"form"} className="flex flex-col min-h-full justify-around items-center" onSubmit={handleSubmit(formSubmit)} >
        <Typography variant='h5' component="h5" sx={{ minWidth: "min(400px,80%)" }}>
          {"Reset password 🔐"}
        </Typography>

        <TextField
          {...register("oldPassword")}
          slotProps={{
            input: {
              endAdornment: <PasswordIcon />
            }
          }}
          type='password'
          sx={{ minWidth: "min(400px,80%)" }}
          label="Current password"
          variant='outlined'
          disabled={isSubmitting}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message}
        />
        <TextField
          type='password'
          {...register("newPassword")}
          slotProps={{
            input: {
              endAdornment: <PasswordIcon />
            }
          }}
          sx={{ minWidth: "min(400px,80%)" }}
          label="New password"
          variant='outlined'
          disabled={isSubmitting}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />
        <TextField
          {...register("confirmPassword")}
          slotProps={{
            input: {
              endAdornment: <PasswordIcon />
            }
          }}
          type='password'
          sx={{ minWidth: "min(400px,80%)" }}
          label="Confirm password"
          variant='outlined'
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          variant='contained'
          sx={{ minWidth: "min(400px,80%)" }}
          size='large'
          type='submit'
          startIcon={<Save />}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

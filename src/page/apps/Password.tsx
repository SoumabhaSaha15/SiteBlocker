import Save from '@mui/icons-material/Save';
import PasswordIcon from '@mui/icons-material/Lock';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { enqueueSnackbar, type OptionsObject } from "notistack";
import {  Box,Button,TextField,Typography} from '@mui/material';
import { setAppPassword, verifyAppPassword, getPasswordProtected } from "@/utils/password";
import { resetPasswordSchema, type ResetPasswordSchema } from '@/validator/password';
import { useEffect, useState } from 'react';

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
}
export default function Password() {
  const [isDisabled,setIsDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema)
  });

  useEffect(()=>{
    getPasswordProtected()
      .then((data)=>setIsDisabled(!data));
  },[])

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
    <Box
      component={"form"}
      className="flex flex-col min-h-full items-center w-full p-4 gap-6"
      onSubmit={handleSubmit(formSubmit)}
    >
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", borderWidth: 1, backgroundColor: "secondary.main", color: "secondary.contrastText" }}
        className='w-full max-w-160 p-2 rounded-lg text-center'
        children={"Reset password 🔐"}
      />
      <TextField
        {...register("oldPassword")}
        slotProps={{
          input: {
            className: "rounded-lg",
            endAdornment: <PasswordIcon />
          }
        }}
        type='password'
        sx={{ minWidth: "min(640px,100%)" }}
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
            className: "rounded-lg",
            endAdornment: <PasswordIcon />
          }
        }}
        sx={{ minWidth: "min(640px,100%)" }}
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
            className: "rounded-lg",
            endAdornment: <PasswordIcon />
          }
        }}
        type='password'
        sx={{ minWidth: "min(640px,100%)" }}
        label="Confirm password"
        variant='outlined'
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
      >
        Save
      </Button>
    </Box>
  );
}

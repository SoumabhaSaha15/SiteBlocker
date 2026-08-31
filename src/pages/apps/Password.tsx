import Save from '@mui/icons-material/Save';
import PasswordIcon from '@mui/icons-material/Lock';
import Android12Switch from '@/pages/shared/Switch';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, type ChangeEvent } from "react";
import { enqueueSnackbar, type OptionsObject } from "notistack";
import { getPasswordProtected, setAppPassword, setPasswordProtected, verifyAppPassword } from "@/utils/password";
import { passwordSetupSchema, resetPasswordSchema, type PasswordSetupFormData, type ResetPasswordSchema } from '@/validator/password';
import { Box, TextField, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { theme } from 'webextension-polyfill';

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
}
export default function Password() {
  const [passwordProtected, setPasswordProtectedState] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    getPasswordProtected().then(setPasswordProtectedState);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const {
    register: registerSetup,
    handleSubmit: handleSetupSubmit,
    reset: resetSetup,
    formState: { errors: setupErrors, isSubmitting: isSettingUp },
  } = useForm<PasswordSetupFormData>({
    resolver: zodResolver(passwordSetupSchema)
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

  const setupPassword: SubmitHandler<PasswordSetupFormData> = async ({ password }) => {
    await setAppPassword(password);
    await setPasswordProtected(true);
    setPasswordProtectedState(true);
    setSetupOpen(false);
    resetSetup();
    enqueueSnackbar({
      key: crypto.randomUUID(),
      message: "Password protection enabled ✅",
      ...SNACK_OPTION
    });
  };

  const handleProtectionChange = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSetupOpen(true);
    } else {
      setPasswordProtected(false);
      setPasswordProtectedState(false);
    }
  };

  return (
    <>
      <Box component={"form"} className="flex flex-col min-h-full items-center w-full p-4 gap-6" onSubmit={handleSubmit(formSubmit)} >
        <List
          dense={false}
          className="w-full max-w-160 rounded-2xl p-1"
          sx={{
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <ListItem
            className="h-14 px-3"
            secondaryAction={
              <Android12Switch
                checked={passwordProtected}
                onChange={handleProtectionChange}
              />
            }>
            <ListItemAvatar className="min-w-0 mr-3">
              <Avatar
                variant="rounded"
                className="w-12 h-12 rounded-xl"
                sx={{ bgcolor: (passwordProtected ? "green" : "red") }}
              >
                <PasswordIcon fontSize='medium' />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id="switch-list-label-password"
              primary={
                <Typography variant="body1" className="font-medium">
                  Protected
                </Typography>
              }
              secondary={
                <Typography
                  variant="body2"
                  className="font-medium"
                >
                  {passwordProtected ? "Yes" : "No"}
                </Typography>
              }
            />
          </ListItem>
        </List>
        <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />
        <Typography
          variant='h5'
          component="h5"
          sx={{ borderColor: "divider", borderWidth: 1 }}
          className='w-full max-w-160 p-2 rounded-xl text-center'
          children={"Reset password 🔐"}
        />
        <TextField
          {...register("oldPassword")}
          slotProps={{
            input: {
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
          type='submit'
          startIcon={<Save />}
        >
          Save
        </Button>
      </Box>

      <Dialog open={setupOpen} onClose={() => setSetupOpen(false)}>
        <DialogTitle>Set password</DialogTitle>
        <DialogContent>
          <Box component="form" id="password-setup-form" onSubmit={handleSetupSubmit(setupPassword)}>
            <TextField
              {...registerSetup("password")}
              autoFocus
              fullWidth
              margin="dense"
              label="Password"
              type="password"
              disabled={isSettingUp}
              error={!!setupErrors.password}
              helperText={setupErrors.password?.message}
            />
            <TextField
              {...registerSetup("confirmPassword")}
              fullWidth
              margin="dense"
              label="Confirm password"
              type="password"
              disabled={isSettingUp}
              error={!!setupErrors.confirmPassword}
              helperText={setupErrors.confirmPassword?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions className="flex w-full justify-center items-center" >
          <Button
            type="submit"
            form="password-setup-form"
            variant="contained"
            disabled={isSettingUp}
            sx={{ width: "100%" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

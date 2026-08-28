import Save from '@mui/icons-material/Save';
import PasswordIcon from '@mui/icons-material/Lock';
import Android12Switch from '@/pages/shared/Switch';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, type ChangeEvent } from "react";
import { enqueueSnackbar, type OptionsObject } from "notistack";
import { getPasswordProtected, setAppPassword, setPasswordProtected, verifyAppPassword } from "@/utils/password";
import { passwordSetupSchema, resetPasswordSchema, type PasswordSetupFormData, type ResetPasswordSchema } from '@/validator/password';
import { Box, TextField, Button, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
      <Box component={"form"} className="flex flex-col min-h-full justify-around items-center" onSubmit={handleSubmit(formSubmit)} >
        <List
          dense={false}
          sx={{
            minWidth: "min(640px,80%)",
            borderRadius: 1,
            borderWidth: 1,
            borderColor: (theme) => theme.palette.text.disabled
          }}
        >
          <ListItem sx={{ padding: 1, height: 56, }}>
            <ListItemIcon>
              <PasswordIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-password" primary="Protection"
              secondary={passwordProtected ? "On" : "Off"} />
            <Android12Switch checked={passwordProtected} onChange={handleProtectionChange} />
          </ListItem>
        </List>

        <Typography variant='h5' component="h5" sx={{ minWidth: "min(640px,80%)" }}>
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
          sx={{ minWidth: "min(640px,80%)" }}
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
          sx={{ minWidth: "min(640px,80%)" }}
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
          sx={{ minWidth: "min(640px,80%)" }}
          label="Confirm password"
          variant='outlined'
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          variant='contained'
          sx={{ minWidth: "min(640px,80%)" }}
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

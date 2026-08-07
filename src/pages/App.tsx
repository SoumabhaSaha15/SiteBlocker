import { useState } from 'react';
import BrandIcon from "./../icon.svg?react";
import Typography from '@mui/material/Typography';
import { zodResolver } from "@hookform/resolvers/zod";
import ListItemIcon from '@mui/material/ListItemIcon';
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar, type OptionsObject } from 'notistack';
import { AppList, MENU_LIST, APP_MAP } from '@/utils/constants';
import { verifyAppPassword, DEFAULT_PASSWORD } from "@/utils/password";
import { passwordSchema, type PasswordFormData } from "@/validator/password";
import { Drawer, AppBar, SvgIcon, Toolbar, ListItem, ListItemText, ListItemButton, Box, List, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
}

const drawerWidth = 'w-60';

type PasswordProtectorProps = {
  app: AppList,
  execute: (value: boolean | ((prevState: boolean) => boolean)) => void,
  open: boolean
}
export default function App() {
  const [isAppDisabled, setIsAppDisabled] = useState<boolean>(true);
  const [app, setApp] = useState<AppList>(AppList.DEFAULT);
  return (
    <Box className="flex">
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <SvgIcon className='text-3xl mx-1.5' viewBox='0 0 32 32' component={BrandIcon} />
          <Typography variant="h6" noWrap component="div">
            Site Blocker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={`${drawerWidth} shrink-0`}
        slotProps={{ paper: { className: `${drawerWidth}  box-border` } }}
      >
        <Toolbar />
        <Box className="overflow-auto">
          <List>
            {MENU_LIST.map(({ name, icon, appKey }) => (
              <ListItem key={name} disablePadding>
                <ListItemButton disabled={isAppDisabled} onClick={() => {
                  setApp(appKey);
                }}>
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" className='grow p-6'>
        <Toolbar />
        <PasswordProtection app={app} open={isAppDisabled} execute={setIsAppDisabled} />
      </Box>
    </Box>
  );
}

function PasswordProtection(props: PasswordProtectorProps) {

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit: SubmitHandler<PasswordFormData> = async (data: PasswordFormData) => {
    const isValid = await verifyAppPassword(data.password);
    if (isValid) {
      props.execute(false);
      reset();
      enqueueSnackbar({
        key: crypto.randomUUID(),
        message: "App Unlocked ✅",
        ...SNACK_OPTION
      });
    } else {
      enqueueSnackbar({
        key: crypto.randomUUID(),
        message: "Incorrect password ❌",
        ...SNACK_OPTION
      });
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: DEFAULT_PASSWORD,
    },
  });

  return (
    <>
      {(!props.open) && APP_MAP[props.app]}
      <Dialog
        open={props.open}
        onClose={() => { }}
        slotProps={{
          paper: {
            className: "min-w-96"
          }
        }}
      >
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}
            method='dialog'
            id='password-form'
          >
            <TextField
              {...register("password")}
              autoFocus
              margin="dense"
              id="Password"
              name="Password"
              label="Password"
              type="password"
              fullWidth
              variant="filled"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </form>
        </DialogContent>
        <DialogActions className='flex w-full justify-center items-center'>
          <Button type="button" variant='contained' className='w-full'>
            export
          </Button>
          <Button variant='contained' type='submit' className='w-full' form='password-form'>
            submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
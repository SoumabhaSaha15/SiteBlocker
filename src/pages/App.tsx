import { useState } from 'react';
import BrandIcon from "@/icon.svg?react";
import { DevTool } from "@hookform/devtools";
import DoneIcon from '@mui/icons-material/Done';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import { zodResolver } from "@hookform/resolvers/zod";
import ListItemIcon from '@mui/material/ListItemIcon';
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar, type OptionsObject } from 'notistack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { AppList, MENU_LIST, APP_MAP } from '@/utils/constants';
import { verifyAppPassword, DEFAULT_PASSWORD, isPasswordUpdated } from "@/utils/password";
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
  const [app, setApp] = useState<AppList>(AppList.HOME);
  return (
    <Box className="flex">
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => theme.palette.primary.main
      }}>
        <Toolbar>
          <SvgIcon className='text-3xl mx-1.5' viewBox='0 0 32 32' component={BrandIcon} sx={{ border: (theme) => theme.palette.primary.contrastText }} />
          <Typography variant="h6" noWrap component="div" sx={{ color: (theme) => theme.palette.primary.contrastText }}>
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
              <ListItem key={name} disablePadding >
                <ListItemButton disabled={isAppDisabled} onClick={() => {
                  setApp(appKey);
                }}>
                  <ListItemIcon sx={{ color: (theme) => theme.palette.primary.dark }}>
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
    control,
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
              label="Password"
              type="password"
              fullWidth
              slotProps={{
                input: {
                  endAdornment: <LockIcon />
                }
              }}
              variant="outlined"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </form>
        </DialogContent>
        <DialogActions
          className='flex w-full justify-center items-center'
        >
          <Button
            type="button"
            variant='outlined'
            startIcon={<FileDownloadIcon />}
            // sx={{ backgroundColor: (theme) => theme.palette.secondary.dark }}
            className='w-full'
          >
            export
          </Button>
          <Button
            type='submit'
            variant='contained'
            startIcon={<DoneIcon />}
            className='w-full'
            form='password-form'
          >
            submit
          </Button>
        </DialogActions>
      </Dialog >
      <DevTool control={control} />
    </>
  );
}

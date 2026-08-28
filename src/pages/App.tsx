import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import BrandIcon from "@/icon.svg?react";
import MenuIcon from '@mui/icons-material/Menu';
import DoneIcon from '@mui/icons-material/Done';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import { zodResolver } from "@hookform/resolvers/zod";
import ListItemIcon from '@mui/material/ListItemIcon';
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar, type OptionsObject } from 'notistack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { AppList, MENU_LIST, APP_MAP } from '@/utils/constants';
import { getPasswordProtected, verifyAppPassword } from "@/utils/password";
import { passwordSchema, type PasswordFormData } from "@/validator/password";
import {
  Drawer,
  AppBar,
  SvgIcon,
  Toolbar,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from '@mui/material';

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
};

const DRAWER_WIDTH = 240;

type PasswordProtectorProps = {
  passwordProtected: boolean;
  unlocked: boolean;
  setUnlocked: (value: boolean) => void;
  dismissed: boolean;
  setDismissed: (value: boolean) => void;
};

interface AppProps {
  window?: () => Window;
}

export default function App(props: AppProps) {
  const { window } = props;
  const [passwordProtected, setPasswordProtectedState] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [isPasswordStateLoaded, setIsPasswordStateLoaded] = useState(false);
  const [passwordDialogDismissed, setPasswordDialogDismissed] = useState(false);
  const [app, setApp] = useState<AppList>(AppList.HOME);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  useEffect(() => {
    getPasswordProtected().then((protectedState) => {
      setPasswordProtectedState(protectedState);
      setIsUnlocked(!protectedState);
      setIsPasswordStateLoaded(true);
    });

    const handleStorageChange = (changes: Record<string, { newValue?: unknown }>) => {
      const change = changes.PasswordProtected;
      if (change) {
        const protectedState = change.newValue === true;
        setPasswordProtectedState(protectedState);
        setIsUnlocked(!protectedState);
        setPasswordDialogDismissed(false);
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const isAppLocked = passwordProtected && !isUnlocked;

  const drawerContent = (
    <div>
      <Toolbar />
      <Box className="overflow-auto">
        <List>
          {MENU_LIST.map(({ name, icon, appKey }) => (
            <ListItem key={name} disablePadding>
              <ListItemButton
                disabled={!isPasswordStateLoaded || isAppLocked}
                onClick={() => {
                  setApp(appKey);
                  setMobileOpen(false);
                }}
              >
                <ListItemIcon sx={{ color: (theme) => theme.palette.primary.dark }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Responsive AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <SvgIcon
            className="text-3xl mr-1"
            viewBox="0 0 32 32"
            component={BrandIcon}
            sx={{ border: (theme) => theme.palette.primary.contrastText }}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: (theme) => theme.palette.primary.contrastText }}
          >
            Site Blocker
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Responsive Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="site blocker navigation"
      >
        {/* Mobile Drawer (Temporary) */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Optimizes mobile open performance
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        {isPasswordStateLoaded && (isAppLocked ? <ExportData /> : APP_MAP[app])}
        <PasswordProtection
          passwordProtected={passwordProtected}
          unlocked={isUnlocked}
          setUnlocked={setIsUnlocked}
          dismissed={passwordDialogDismissed}
          setDismissed={setPasswordDialogDismissed}
        />
      </Box>
    </Box>
  );
}

function PasswordProtection(props: PasswordProtectorProps) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit: SubmitHandler<PasswordFormData> = async (data: PasswordFormData) => {
    const isValid = await verifyAppPassword(data.password);
    if (isValid) {
      props.setUnlocked(true);
      reset();
      enqueueSnackbar({
        key: crypto.randomUUID(),
        message: "App Unlocked ✅",
        ...SNACK_OPTION,
      });
    } else {
      enqueueSnackbar({
        key: crypto.randomUUID(),
        message: "Incorrect password ❌",
        ...SNACK_OPTION,
      });
    }
  };

  return (
    <>
      <Dialog
        open={props.passwordProtected && !props.unlocked && !props.dismissed}
        onClose={() => props.setDismissed(true)}
        slotProps={{
          paper: {
            className: "min-w-96",
          },
        }}
      >
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} id="password-form">
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
                  endAdornment: <LockIcon />,
                },
              }}
              variant="outlined"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </form>
        </DialogContent>
        <DialogActions className="flex w-full justify-center items-center">
          <Button
            type="submit"
            variant="contained"
            startIcon={<DoneIcon />}
            className="w-full"
            form="password-form"
            disabled={isSubmitting}
          >
            submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ExportData() {
  const exportData = async () => {
    const data = await browser.storage.local.get(null);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'site-blocker-data.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box className="flex min-h-full items-center justify-center">
      <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={exportData}>
        Export data
      </Button>
    </Box>
  );
}

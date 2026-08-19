import { useState } from 'react';
import BrandIcon from "@/icon.svg?react";
import { DevTool } from "@hookform/devtools";
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
import { verifyAppPassword, DEFAULT_PASSWORD } from "@/utils/password";
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
  app: AppList;
  execute: (value: boolean | ((prevState: boolean) => boolean)) => void;
  open: boolean;
};

interface AppProps {
  window?: () => Window;
}

export default function App(props: AppProps) {
  const { window } = props;
  const [isAppDisabled, setIsAppDisabled] = useState<boolean>(true);
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

  const drawerContent = (
    <div>
      <Toolbar />
      <Box className="overflow-auto">
        <List>
          {MENU_LIST.map(({ name, icon, appKey }) => (
            <ListItem key={name} disablePadding>
              <ListItemButton
                disabled={isAppDisabled}
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
        <PasswordProtection app={app} open={isAppDisabled} execute={setIsAppDisabled} />
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: DEFAULT_PASSWORD,
    },
  });

  const onSubmit: SubmitHandler<PasswordFormData> = async (data: PasswordFormData) => {
    const isValid = await verifyAppPassword(data.password);
    if (isValid) {
      props.execute(false);
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
      {!props.open && APP_MAP[props.app]}
      <Dialog
        open={props.open}
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
            type="button"
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            className="w-full"
          >
            export
          </Button>
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
      <DevTool control={control} />
    </>
  );
}

import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { zodResolver } from "@hookform/resolvers/zod";
import ListItemIcon from '@mui/material/ListItemIcon';
import { TransitionGroup } from 'react-transition-group';
import { useSnackbar, type OptionsObject } from 'notistack';
import { AppList, MenuList, AppMap } from '@/page/apps/index';
import { getSyncedData, downloadJSONFile } from "@/utils/sync";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PasswordInputField from "@/components/PasswordInputField";
import { useForm, SubmitHandler, UseFormReset } from "react-hook-form";
import { passwordSchema, type PasswordFormData } from "@/validator/password";
import { getPasswordProtected, verifyAppPassword, listenProtectionChanges } from "@/utils/password";
import {
  Box,
  List,
  Button,
  Drawer,
  AppBar,
  Toolbar,
  Collapse,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress
} from '@mui/material';

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
};

const DRAWER_WIDTH = 240;

function App() {

  const [app, setApp] = useState<AppList>(AppList.HOME);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);

  const handleDrawerToggle = () => (!isClosing) && setMobileOpen(!mobileOpen);

  const drawerContent = (
    <div>
      <Toolbar />
      <Box className="overflow-auto">
        <List>
          {MenuList.map(({ name, icon, appKey }) => (
            <ListItem key={name} disablePadding>
              <ListItemButton
                selected={app === appKey}
                onClick={() => {
                  setApp(appKey);
                  setMobileOpen(false);
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: "action.selected",
                    '&:hover': {
                      backgroundColor: "action.hover",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: (theme) => theme.palette.primary.main }} className="mr-2">
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

  return (
    <Box className="flex">
      {/* Responsive AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "primary.main",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
            children={<MenuIcon />}
          />
          <Typography
            noWrap
            variant="h6"
            component="h6"
            sx={{ color: "primary.contrastText" }}
            children={"Site Blocker"}
          />
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
        className="grow p-0 w-[calc(100%-15rem)]" // DRAWER_WIDTH = 15rem || 240px
      >
        <Toolbar />
        <TransitionGroup>
          <Collapse timeout={{ enter: 500, exit:500 }} key={app}>
            {AppMap[app]}
          </Collapse>
        </TransitionGroup>
      </Box>
    </Box>
  );
}

function PasswordForm({ setData }: {
  setData: (data: PasswordFormData, reset: UseFormReset<PasswordFormData>) => void | Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const formSubmit: SubmitHandler<PasswordFormData> = async (data) => void setData(data, reset);

  return (
    <Box
      className="grid min-h-dvh place-items-center w-full p-4 gap-6"
      sx={{ backgroundColor: theme => theme.palette.background.default }}
    >
      <Box
        component={"form"}
        className="flex flex-col max-w-160 items-center w-full p-4 gap-4 rounded-xl"
        onSubmit={handleSubmit(formSubmit, console.dir)}
        sx={{ backgroundColor: "background.paper" }}
      >
        <Typography
          variant='h5'
          component="h5"
          sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
          className='w-full max-w-160 p-2 rounded-lg text-center'
          children={"App locked! 🔒"}
        />

        <PasswordInputField
          {...register("password")}
          autoFocus
          margin="dense"
          id="Password"
          label="Password"
          fullWidth
          sx={{ maxWidth: "min(640px,100%)" }}
          slotProps={{ input: { className: "rounded-lg" } }}
          variant="outlined"
          disabled={isSubmitting}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          sx={{ minWidth: "min(640px,100%)" }}
          type="submit"
          size="large"
          variant="contained"
          startIcon={<DoneIcon />}
          className="rounded-lg"
          disabled={isSubmitting}
          children="Submit"
        />

        <Button
          type="button"
          size="large"
          variant="contained"
          className="rounded-lg"
          startIcon={<FileDownloadIcon />}
          color="error"
          sx={{ minWidth: "min(640px,100%)" }}
          onClick={() => {
            getSyncedData()
              .then(data => downloadJSONFile('site_blocker.json', data));
          }}
          children="Export data"
        />

      </Box>
    </Box>
  );
}

export default function PasswordProtectedApp() {

  const { enqueueSnackbar } = useSnackbar();
  const [protection, setProtection] = useState<null | boolean>(null);
  const [lock, setLock] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false; //used to get rid of race condition occurs for slow-fetch [not likely]
    getPasswordProtected()
      .then((protectedState) => {
        if (cancelled) return;
        setProtection(protectedState);
        setLock(protectedState);
      })
      .catch((err: Error) => {
        if (!cancelled) enqueueSnackbar({ key: crypto.randomUUID(), message: err.message, ...SNACK_OPTION });
      });

    const unsubscribe = listenProtectionChanges((change) => {
      cancelled = true; // a live change is authoritative from here on
      setProtection(change);
      setLock(change);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [enqueueSnackbar]);

  return (
    <TransitionGroup>
      {protection === null ? (
        <Collapse timeout={{ enter: 500, exit:500  }} key="app-loading" unmountOnExit>
          <Box className="grid min-h-dvh place-items-center">
            <CircularProgress aria-label="Loading…" />
          </Box>
        </Collapse>
      ) : (
        (protection && lock) ? (
          <Collapse timeout={{ enter: 500, exit:500  }} key="password-guard" unmountOnExit>
            <PasswordForm
              setData={async (data, reset) => {
                try {
                  const isverified = await verifyAppPassword(data.password);
                  setLock(!isverified);
                  if (isverified) {
                    reset();
                    enqueueSnackbar({ key: crypto.randomUUID(), message: "App Unlocked ✅", ...SNACK_OPTION });
                  } else enqueueSnackbar({ key: crypto.randomUUID(), message: "Incorrect password ❌", ...SNACK_OPTION });
                } catch (err) {
                  enqueueSnackbar({ key: crypto.randomUUID(), message: (err as Error).message, ...SNACK_OPTION });
                }
              }}
            />
          </Collapse>
        ) : (
          <Collapse timeout={{ enter: 500, exit:500 }} key="app" unmountOnExit>
            <App />
          </Collapse>
        ))}
    </TransitionGroup>
  )
}

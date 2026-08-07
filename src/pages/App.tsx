import React, { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import BrandIcon from "./../icon.svg?react";
import HomeIcon from '@mui/icons-material/Home';
import SyncIcon from '@mui/icons-material/Sync';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import RepeatIcon from '@mui/icons-material/Repeat';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import ListItemIcon from '@mui/material/ListItemIcon';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExtraSettingsIcon from '@mui/icons-material/SettingsSuggest';
import { Avatar, Drawer, AppBar, SvgIcon, Toolbar, ListItem, ListItemText, ListItemButton, Box, List, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, } from '@mui/material';
import Home from './Home';
import Rules from './Rules';
import ExtraConfig from './ExtraConfig';
import Redirect from './Redirect';
import TimeConfig from './TimeConfig';
import BlockByKeys from './BlockByKeys';
import Sync from './Sync';
import AboutUs from './AboutUs';
import Password from './Password';
const drawerWidth = 'w-60';
enum AppList {
  HOME,
  RULES,
  EXTRA_CONFIG,
  REDIRECT,
  TIME_CONFIG,
  BLOCK_KEYS,
  SYNC,
  PASSWORD,
  ABOUT_US,
  DEFAULT,
};

const AppMap: Record<AppList, React.JSX.Element> = {
  0: <Home />,
  1: <Rules />,
  2: <ExtraConfig />,
  3: <Redirect />,
  4: <TimeConfig />,
  5: <BlockByKeys />,
  6: <Sync />,
  7: <Password />,
  8: <AboutUs />,
  9: <Home />
}

const MENU_LIST = [
  { name: 'Home', icon: <HomeIcon />, appKey: AppList.HOME },
  { name: 'Rules', icon: <SettingsIcon />, appKey: AppList.RULES },
  { name: 'Extra config', icon: <ExtraSettingsIcon />, appKey: AppList.EXTRA_CONFIG },
  { name: 'Redirect', icon: <RepeatIcon />, appKey: AppList.REDIRECT },
  { name: 'Time Config', icon: <AccessTimeIcon />, appKey: AppList.TIME_CONFIG },
  { name: 'Block keys', icon: <KeyOffIcon />, appKey: AppList.BLOCK_KEYS },
  { name: 'Sync', icon: <SyncIcon />, appKey: AppList.SYNC },
  { name: 'Password', icon: <LockIcon />, appKey: AppList.PASSWORD },
  { name: 'About us', icon: <Avatar alt="Soumabha Saha" src="/picture.png" className='size-6' />, appKey: AppList.ABOUT_US },
];

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
  return (
    <>
      {AppMap[props.app]}
      <Dialog
        open={props.open}
        onClose={() => {
          enqueueSnackbar({
            key: crypto.randomUUID(),
            message: "App Unlocked ✅",
            autoHideDuration: 2000,
            variant: "default",
            anchorOrigin: { horizontal: "center", vertical: "bottom" }
          });
        }}
        slotProps={{
          paper: {
            className: "min-w-96"
          }
        }}
      >
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.execute(false);
          }}
            // ref={formRef}
            id='password-form'
          >
            <TextField
              autoFocus
              required
              defaultValue={2003}
              margin="dense"
              id="Password"
              name="Password"
              label="Password"
              type="password"
              fullWidth
              variant="filled"
            />
          </form>
        </DialogContent>
        <DialogActions className='flex w-full justify-center items-center'>
          <Button type="button" variant='contained' className='w-full'>
            export
          </Button>
          <Button variant='contained' type='submit' className='w-full' form='password-form'
          // onClick={() => {
          //   props.execute(false);
          // }}
          >
            submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
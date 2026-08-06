import Box from '@mui/material/Box';
import List from '@mui/material/List';
import BrandIcon from "./../icon.svg?react";
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import SvgIcon from '@mui/material/SvgIcon';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import HomeIcon from '@mui/icons-material/Home';
import SyncIcon from '@mui/icons-material/Sync';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import RepeatIcon from '@mui/icons-material/Repeat';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import ListItemButton from '@mui/material/ListItemButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExtraSettingsIcon from '@mui/icons-material/SettingsSuggest';

const drawerWidth = 'w-60';

const MENU_LIST = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Rules', icon: <SettingsIcon /> },
  { name: 'Extra config', icon: <ExtraSettingsIcon /> },
  { name: 'Redirect', icon: <RepeatIcon /> },
  { name: 'Time Config', icon: <AccessTimeIcon /> },
  { name: 'Block keys', icon: <KeyOffIcon /> },
  { name: 'Sync', icon: <SyncIcon /> },
  { name: 'Password', icon: <LockIcon /> },
  { name: 'About us', icon: <Avatar alt="Soumabha Saha" src="/picture.png" className='size-6' /> },
];

export default function App() {
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
            {MENU_LIST.map(({ name, icon }) => (
              <ListItem key={name} disablePadding>
                <ListItemButton>
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
        <Typography className='mb-4'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia velit at fuga? Eos ab laborum voluptate pariatur accusamus, cum qui esse perferendis praesentium molestiae amet officia commodi aliquid dolor aspernatur.
        </Typography>
        <Typography className='mb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis exercitationem quis necessitatibus, deserunt adipisci veniam voluptates, delectus obcaecati fugit amet blanditiis? Quos nostrum sunt praesentium maiores libero obcaecati tempore adipisci.
        </Typography>
      </Box>
    </Box>
  );
}

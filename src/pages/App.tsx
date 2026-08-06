import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import RepeatIcon from '@mui/icons-material/Repeat';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import ListItemButton from '@mui/material/ListItemButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 240;

const MENU_LIST = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Rules', icon: <SettingsIcon /> },
  { name: 'Redirect', icon: <RepeatIcon /> },
  { name: 'Time Config', icon: <AccessTimeIcon /> }
];

export default function ClippedDrawer() {
  return (
    <Box className="flex">
      {/* <CssBaseline /> */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Site Blocker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia velit at fuga? Eos ab laborum voluptate pariatur accusamus, cum qui esse perferendis praesentium molestiae amet officia commodi aliquid dolor aspernatur.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis exercitationem quis necessitatibus, deserunt adipisci veniam voluptates, delectus obcaecati fugit amet blanditiis? Quos nostrum sunt praesentium maiores libero obcaecati tempore adipisci.
        </Typography>
      </Box>
    </Box>
  );
}

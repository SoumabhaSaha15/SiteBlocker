import { Fragment } from 'react';
import { getIcon } from '@/utils/links';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import {
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  Chip
} from '@mui/material';

const PRIMARY_LINKS = [
  {
    tooltip: "My website",
    link: 'https://soumabha-saha15.vercel.app',
    image: LanguageIcon,
  },
  {
    tooltip: "My gmail",
    link: 'mailto:soumabhasaha1509+portfolio@gmail.com',
    image: EmailIcon,
  },
];

const MY_LINKS = [
  'https://leetcode.com/u/SoumabhaSaha',
  'https://github.com/soumabhasaha15',
  'https://www.linkedin.com/in/soumabha-saha-663816253',
  'https://hashnode.com/@soumabhasaha15',
  'https://x.com/SoumabhaSaha15',
  'https://www.instagram.com/webdude1509',
  'https://www.facebook.com/WebDude1509',
];

const openLink = (url: string) => window.open(url, '_blank')?.focus();

export default function AboutUs() {
  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full">
      {/* Profile Card */}
      <Card
        elevation={0}
        className="flex flex-row-reverse w-full max-w-160 rounded-2xl overflow-hidden"
        sx={{
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box className="flex flex-col flex-1 min-w-0 justify-between p-2">
          <CardContent className="p-4 pb-2">
            <Typography variant="h6" className="font-semibold">
              Soumabha Saha
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mt-1">
              Welcome to my site-blocker browser extension. My links are provided below.
            </Typography>
          </CardContent>

          {/* Primary Action Buttons */}
          <Box className="flex items-center gap-1.5 px-4 pb-3">
            {PRIMARY_LINKS.map((item) => (
              <Tooltip title={item.tooltip} key={item.link} placement='top'>
                <IconButton
                  onClick={() => openLink(item.link)}
                  size="small"
                >
                  <Avatar
                    // alt={item.link}
                    // src={item.image}
                    className="w-10 h-10 rounded-full"
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      bgcolor: theme => theme.palette.background.paper,
                    }}
                    children={<item.image sx={{ color: "primary.dark" }} />}
                  />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <CardMedia
          component="img"
          image="/picture.png"
          alt="Soumabha Saha"
          className="w-36 sm:w-44 object-cover shrink-0"
        />
      </Card>

      <Divider className="w-full max-w-160" children={<Chip label="Other links" size="small" />} sx={{ borderColor: (theme) => theme.palette.text.disabled }} />

      {/* Social / Portfolio Links List */}
      <List
        dense={false}
        className="w-full max-w-160 rounded-2xl overflow-clip"
        sx={{
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {MY_LINKS.map((item, index) => {
          const { hostname, href, origin } = new URL(item);
          return (
            <Fragment key={item}>
              <ListItem
                className="px-3"
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => openLink(item)}
                    className='rounded-md!'
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemAvatar className="min-w-0 mr-3">
                  <Avatar
                    alt={hostname}
                    src={getIcon(origin)}
                    variant='square'
                    className="w-10 h-10 rounded-xl"
                    sx={{
                      bgcolor: theme => theme.palette.background.paper,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" className="font-medium">
                      {hostname}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className="truncate max-w-70 sm:max-w-none block"
                    >
                      {href}
                    </Typography>
                  }
                />
              </ListItem>
              {MY_LINKS.length - 1 !== index && (
                <Divider component="li" sx={{ borderColor: 'divider', width: "100%" }} />
              )}
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}

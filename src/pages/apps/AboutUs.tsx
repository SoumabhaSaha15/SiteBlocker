import { Fragment } from 'react';
import { getIcon } from '@/utils/links';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Divider, List, ListItemAvatar, ListItem, ListItemText, Avatar, IconButton, Typography, Card, CardContent, CardMedia } from "@mui/material";

const MY_LINKS = [
  // "mailto://soumabhasaha1509+portfolio@gmail.com",
  "https://github.com/soumabhasaha15",
  "https://www.linkedin.com/in/soumabha-saha-663816253",
  "https://hashnode.com/@soumabhasaha15",
  "https://x.com/SoumabhaSaha15",
  "https://www.instagram.com/webdude1509",
  "https://www.facebook.com/WebDude1509",
];
const WEBSITE = "https://soumabha-saha15.vercel.app"
const LEETCODE = "https://leetcode.com/u/SoumabhaSaha";
export default function AboutUs() {
  return (
    <Box className="flex flex-col min-h-full justify-around items-center">
      <Card
        sx={{
          display: 'flex',
          flexDirection: "row-reverse",
          maxWidth: "min(640px,80%)",
          borderWidth: 1,
          borderRadius: 1,
          borderColor: (theme) => theme.palette.text.disabled
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0
          }}
        >
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              Soumabha Saha
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: 'text.secondary' }}
            >
              Welcome to my site-blocker browser extension. My links are provided below.
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <IconButton aria-label="previous" onClick={() => window.open(WEBSITE, '_blank')?.focus()}>
              <Avatar
                alt={WEBSITE}
                src={"https://soumabha-saha15.vercel.app/logo.svg"}
                sx={{
                  borderRadius: "50%",
                  backgroundColor: (theme) => theme.palette.background.default,
                }}
              />
            </IconButton>
            <IconButton aria-label="previous" onClick={() => window.open(LEETCODE, '_blank')?.focus()}>
              <Avatar
                alt={LEETCODE}
                src={"https://leetcode.com/favicon.ico"}
                sx={{
                  borderRadius: "50%",
                  backgroundColor: (theme) => theme.palette.background.default,
                }}
              />
            </IconButton>
          </Box>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 'min(240px,60%)', flexShrink: 0 }}
          image="/picture.png"
          alt="Soumabha Saha"
        />
      </Card>
      <Divider
        sx={{
          minWidth: "min(640px,80%)",
          borderColor: (theme) => theme.palette.text.disabled,
        }}
      />
      <List
        dense={false}
        sx={{
          minWidth: "min(640px,80%)",
          borderWidth: 1,
          borderRadius: 1,
          borderColor: (theme) => theme.palette.text.disabled
        }}
      >
        {MY_LINKS.map((item, index) => {
          const urlObject = new URL(item);
          console.log(item, urlObject.hostname);
          return (
            <Fragment key={`my-links-${index}`}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="start"
                    aria-label="delete"
                    onClick={() => window.open(item, '_blank')?.focus()}
                    color="default"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                }
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: 56,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={urlObject.host}
                    src={getIcon(urlObject.hostname)}
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: (theme) => theme.palette.common.white,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={urlObject.hostname}
                  secondary={urlObject.href}
                />
              </ListItem>
              {((MY_LINKS.length - 1) !== index) && (<Divider component={"li"} sx={{ borderColor: (theme) => theme.palette.text.disabled }} />)}
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}

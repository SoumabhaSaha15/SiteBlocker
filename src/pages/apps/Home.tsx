import z from "zod";
import { useState, useEffect, Fragment } from "react";
import Add from "@mui/icons-material/AddRounded";
import Android12Switch from "@/pages/shared/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { getIcon, getLinks, setLinks } from "@/utils/links";
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { Box, TextField, Button, Divider, List, ListItemAvatar, ListItem, ListItemText, Avatar, IconButton, InputAdornment } from "@mui/material";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [sites, setSites] = useState<string[]>([]);

  const addUrl = () => {
    try {
      z.url().parse(url);
      setSites(prev => {
        const linkSet = Array.from(new Set([...prev, url]));
        setLinks(linkSet);
        return linkSet;
      });
      setError(false);
      setErrorText("");
      setUrl("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrorText(z.prettifyError(err));
        setError(true);
      }
    }
  }

  const deleteUrl = (selectedUrl: string) => {
    setSites(prev => {
      const linkSet = prev.filter(item => item !== selectedUrl);
      setLinks(linkSet);
      return linkSet;
    });
  }

  useEffect(() => void getLinks().then(setSites), []);

  return (<>
    <Box className="flex flex-col min-h-full justify-around items-center">
      <List
        dense={false}
        sx={{
          minWidth: "min(640px,80%)",
        }}
      >
        <ListItem
          secondaryAction={<Android12Switch />}
          sx={{
            padding: 1,
            height: 56,
            borderRadius: 1,
            borderWidth: 1,
            borderColor: (theme) => theme.palette.text.disabled
          }}
        >
          <ListItemAvatar>
            <Avatar variant="rounded" sx={{ borderRadius: .5 }}>
              <PowerSettingsNewIcon fontSize="medium" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText id="switch-list-label-working-status" primary="Working status" />
        </ListItem>
      </List>
      <TextField
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="medium"
                  edge="start"
                  sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    borderRadius: 0.5,
                    ":hover": {
                      backgroundColor: "primary.main"
                    }
                  }}
                  children={<Add fontSize="medium" color="inherit" />}
                  onClick={addUrl}
                />
              </InputAdornment>
            )
          }
        }}
        onChange={({ target }) => setUrl(target.value)}
        onKeyUp={({ key }) => (key === "Enter") && addUrl()}
        type='url'
        value={url}
        sx={{ minWidth: "min(640px,80%)" }}
        label="Add sites"
        variant='outlined'
        placeholder="xyz.com"
        error={error}
        helperText={errorText}
      />
      <Divider sx={{ minWidth: "min(640px,80%)", borderWidth: 1 }} />
      <List
        dense={false}
        sx={{
          minWidth: "min(640px,80%)",
          borderWidth: 1,
          borderRadius: 1,
          borderColor: (theme) => theme.palette.text.disabled
        }}
      >
        {(!sites.length) && (
          <ListItem
            sx={{
              padding: 1,
              borderRadius: 1,
              height: 56,
            }}
          >
            <ListItemAvatar>
              <Avatar children={<NotInterestedIcon />} variant="rounded" sx={{ borderRadius: .5 }} />
            </ListItemAvatar>
            <ListItemText
              primary={"Empty list"}
              secondary={"There is no blacklisted site."}
            />
          </ListItem>
        )}
        {sites.map((item, index) => {
          const urlObject = new URL(item);

          return (
            <Fragment key={index}>
              <ListItem
                secondaryAction={
                  <IconButton edge="start" aria-label="delete" onClick={() => deleteUrl(item)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: 56,
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={urlObject.host} src={getIcon(urlObject.hostname)} sx={{ borderRadius: 0.5 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={urlObject.hostname}
                  secondary={urlObject.href}
                />
              </ListItem>
              {((sites.length - 1) !== index) && (<Divider component={"li"} sx={{ borderColor: (theme) => theme.palette.text.disabled }} />)}
            </Fragment>
          )
        })}
      </List>
    </Box>
  </>);
}

import z from "zod";
import { type Sites } from "@/validator/sites";
import Add from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { TransitionGroup } from "react-transition-group";
import { useState, useEffect } from "react";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import {
  blacklistSite,
  getIcon,
  getBlockedSites,
  setBlockedSites,
  listenBlockedSitesChanges,
} from "@/utils/sites";
import {
  Box,
  TextField,
  Divider,
  List,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  InputAdornment,
  Typography,
  Link,
  Collapse,
} from "@mui/material";

interface SiteListProps {
  sites: Sites;
}

function SiteList({ sites }: SiteListProps) {
  return (
    <List
      dense={false}
      className="w-full max-w-160 rounded-lg overflow-clip border"
      sx={{ borderColor: "divider", backgroundColor: "background.paper" }}
    >
      <TransitionGroup>
        {!sites.length ? (
          <Collapse>
            <ListItem className="px-2">
              <ListItemAvatar className="min-w-0 mr-3">
                <Avatar
                  variant="square"
                  className="w-10 h-10 rounded-md"
                  sx={{ backgroundColor: "red" }}
                >
                  <NotInterestedIcon fontSize="medium" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    className="font-medium truncate"
                    color="text.secondary"
                  >
                    Empty list
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.disabled" className="block truncate">
                    There is no blacklisted site.
                  </Typography>
                }
              />
            </ListItem>
          </Collapse>
        ) : (
          sites.map((item, index) => {
            const urlObject = new URL(item);
            return (
              <Collapse key={item}>
                <ListItem
                  className="px-2"
                  sx={{ "&:hover": { bgcolor: "action.hover" } }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      aria-label="delete"
                      onClick={() => {
                        setBlockedSites(sites.filter((site) => item !== site)).catch(console.error);
                      }}
                      sx={{ borderRadius: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar className="min-w-0 mr-3">
                    <Avatar
                      alt={urlObject.host}
                      src={getIcon(urlObject.href)}
                      variant="square"
                      className="w-10 h-10 rounded-md"
                      slotProps={{ img: { className: "object-cover" } }}
                      sx={{ bgcolor: "background.paper" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" className="font-medium truncate">
                        {urlObject.hostname}
                      </Typography>
                    }
                    secondary={
                      <Link
                        variant="caption"
                        href={urlObject.href}
                        className="truncate max-w-70 sm:max-w-none block"
                        target="_blank"
                        children={urlObject.host}
                      />
                    }
                  />
                </ListItem>
                {sites.length - 1 !== index && (
                  <Divider
                    component="li"
                    className="border w-full"
                    sx={{ borderColor: "divider" }}
                  />
                )}
              </Collapse>
            );
          })
        )}
      </TransitionGroup>
    </List>
  );
}

export default function BlockedSites() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [sites, setSites] = useState<Sites>([]);

  const addUrl = (urlString: string) => {
    blacklistSite(urlString)
      .then(() => {
        setUrl("");
        setError(null);
      })
      .catch((err: Error) => {
        const msg = err instanceof z.ZodError ? z.prettifyError(err) : err.message;
        setError(msg);
      });
  };

  useEffect(() => {
    getBlockedSites().then(setSites).catch(console.error);
    return listenBlockedSitesChanges(setSites);
  }, []);

  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full min-h-[calc(100dvh-4rem)]">
      <Typography
        variant="h5"
        component="h5"
        sx={{
          borderColor: "divider",
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
        }}
        className="w-full max-w-160 p-2 rounded-lg text-center truncate"
        children={"Blocked Sites"}
      />
      {/* URL Input */}
      <TextField
        fullWidth
        className="max-w-160"
        slotProps={{
          input: {
            className: "rounded-lg",
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="start"
                  disabled={!url}
                  onClick={() => addUrl(url)}
                  sx={{
                    borderRadius: 1,
                    color: "primary.contrastText",
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onChange={({ target }) => setUrl(target.value)}
        onKeyUp={({ key }) => key === "Enter" && addUrl(url)}
        type="url"
        value={url}
        label="Add sites"
        variant="outlined"
        placeholder="https://example.com"
        error={!!error}
        helperText={error}
      />
      <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />
      <SiteList sites={sites} />
    </Box>
  );
}

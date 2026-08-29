import z from "zod";
import Add from "@mui/icons-material/AddRounded";
import Android12Switch from "@/pages/shared/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, Fragment } from "react";
import { getIcon, getLinks, setLinks } from "@/utils/links";
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { getWorkingStatus, setWorkingStatus, type WorkingStatus } from "@/utils/blocker";
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
} from "@mui/material";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [sites, setSites] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<WorkingStatus>("OFF");

  const addUrl = () => {
    try {
      z.url().parse(url);
      setSites((prev) => {
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
  };

  const deleteUrl = (selectedUrl: string) => {
    setSites((prev) => {
      const linkSet = prev.filter((item) => item !== selectedUrl);
      setLinks(linkSet);
      return linkSet;
    });
  };

  useEffect(() => void getLinks().then(setSites), []);
  useEffect(() => void getWorkingStatus().then(setIsActive), []);

  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full">
      {/* Working Status Toggle */}
      <List
        dense={false}
        className="w-full max-w-160 rounded-2xl p-1"
        sx={{
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <ListItem
          className="h-14 px-3"
          secondaryAction={<Android12Switch onChange={(_, checked) => setWorkingStatus(checked ? "ON" : "OFF").then(setIsActive)} checked={isActive == "ON"} />}
        >
          <ListItemAvatar className="min-w-0 mr-3">
            <Avatar
              variant="rounded"
              className="w-12 h-12 rounded-box"
              sx={{ bgcolor: (isActive == "ON" ? "green" : "red") }}
            >
              <PowerSettingsNewIcon fontSize="medium" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id="switch-list-label-working-status"
            primary={
              <Typography variant="body1" className="font-medium">
                Working status
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                className="font-medium"
                sx={{
                  textTransform: "lowercase",
                  "::first-letter": {
                    textTransform: "capitalize"
                  }
                }}
              >
                {isActive}
              </Typography>
            }
          />
        </ListItem>
      </List>

      {/* URL Input */}
      <TextField
        fullWidth
        className="max-w-160"
        slotProps={{
          input: {
            className: "rounded-2xl",
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="start"
                  disabled={!url}
                  onClick={addUrl}
                  className="rounded-lg! transition-all"
                  sx={{
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
        onKeyUp={({ key }) => key === "Enter" && addUrl()}
        type="url"
        value={url}
        label="Add sites"
        variant="outlined"
        placeholder="https://example.com"
        error={error}
        helperText={errorText}
      />

      <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />

      {/* Blocked Sites List */}
      <List
        dense={false}
        className="w-full max-w-160 rounded-2xl overflow-clip"
        sx={{
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {!sites.length && (
          <ListItem className="h-14">
            <ListItemAvatar className="min-w-0 mr-3">
              <Avatar
                variant="rounded"
                className="w-10 h-10 rounded-lg"
                sx={{ bgcolor: "action.hover", color: "text.secondary" }}
              >
                <NotInterestedIcon fontSize="small" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" className="font-medium" color="text.secondary">
                  Empty list
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.disabled" className="block">
                  There is no blacklisted site.
                </Typography>
              }
            />
          </ListItem>
        )}

        {sites.map((item, index) => {
          const urlObject = new URL(item);

          return (
            <Fragment key={item}>
              <ListItem
                className="px-3"
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label="delete"
                    onClick={() => deleteUrl(item)}
                    color="error"
                    className="rounded-md!"
                    sx={{ "&:hover": { bgcolor: "error.lighter" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemAvatar className="min-w-0 mr-3">
                  <Avatar
                    alt={urlObject.host}
                    src={getIcon(urlObject.hostname)}
                    variant="square"
                    className="w-10 h-10 rounded-md"
                    slotProps={{ img: { className: "object-contain" } }}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      bgcolor: (theme) => theme.palette.common.white,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" className="font-medium capitalize truncate">
                      {urlObject.hostname}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className="truncate max-w-70 sm:max-w-none block"
                    >
                      {urlObject.href}
                    </Typography>
                  }
                />
              </ListItem>
              {sites.length - 1 !== index && (
                <Divider component="li" sx={{ borderColor: "divider", width: "100%", borderWidth: 1 }} />
              )}
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}

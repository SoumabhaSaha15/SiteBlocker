import z from "zod";
import Add from "@mui/icons-material/AddRounded";
import Android12Switch from "@/pages/shared/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useState, useEffect, useCallback, Fragment, memo } from "react";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { getWorkingStatus, setWorkingStatus, type WorkingStatus } from "@/utils/blocker";
import { blacklistSite, getIcon, getBlockedSites, type Sites, setBlockedSites } from "@/utils/links";
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
} from "@mui/material";

interface SiteListProps {
  sites: Sites;
  onDelete: (url: string) => void;
}

const SiteList = memo(function SiteList({ sites, onDelete }: SiteListProps) {
  return (
    <List
      dense={false}
      className="w-full max-w-160 rounded-2xl overflow-clip"
      sx={{ border: 1, borderColor: "divider", bgcolor: "background.paper" }}
    >
      {!sites.length && (
        <ListItem className="h-14">
          <ListItemAvatar className="min-w-0 mx-3">
            <Avatar variant="rounded" className="w-10 h-10 rounded-xl" sx={{ backgroundColor: "red" }}>
              <NotInterestedIcon fontSize="medium" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="body2" className="font-medium" color="text.secondary">Empty list</Typography>}
            secondary={<Typography variant="caption" color="text.disabled" className="block">There is no blacklisted site.</Typography>}
          />
        </ListItem>
      )}

      {sites.map((item, index) => {
        const urlObject = new URL(item);
        return (
          <Fragment key={item}>
            <ListItem
              className="px-3"
              sx={{ "&:hover": { bgcolor: "action.hover" } }}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="delete"
                  onClick={() => onDelete(item)}
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
                  src={getIcon(urlObject.href)}
                  variant="square"
                  className="w-10 h-10 rounded-xl"
                  slotProps={{ img: { className: "object-contain" } }}
                  sx={{ bgcolor: (theme) => theme.palette.background.paper }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body2" className="font-medium">{urlObject.hostname}</Typography>}
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
              <Divider component="li" sx={{ borderColor: "divider", width: "100%", borderWidth: 1 }} />
            )}
          </Fragment>
        );
      })}
    </List>
  );
});

export default function Home() {

  const [url, setUrl] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [sites, setSites] = useState<Sites>([]);
  const [isActive, setIsActive] = useState<WorkingStatus>(false);

  const addUrl = (urlString: string) => {
    blacklistSite(urlString)
      .then((data) => {
        setUrl("");
        setError(null);
        setSites(data);
      })
      .catch((err: Error) => {
        const msg = err instanceof z.ZodError ? z.prettifyError(err) : err.message;
        setError(msg);
      });
  };

  const deleteUrl = useCallback((selectedUrl: string) => {
    setBlockedSites(sites.filter(item => item !== selectedUrl))
      .then(setSites)
      .catch(console.error);
  }, [sites]);

  useEffect(() => {
    getBlockedSites().then(setSites);
    getWorkingStatus().then(setIsActive);
  }, []);


  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full">
      {/* Working Status Toggle */}
      <List
        dense={false}
        className="w-full max-w-160 rounded-2xl py-2"
        sx={{
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <ListItem
          className="h-14 px-3"
          secondaryAction={
            <Android12Switch
              onChange={(_, checked) => setWorkingStatus(checked).then(setIsActive)}
              checked={isActive}
            />
          }
        >
          <ListItemAvatar className="min-w-0 mr-3">
            <Avatar
              variant="rounded"
              className="w-12 h-12 rounded-xl"
              sx={{ bgcolor: (isActive ? "green" : "red") }}
            >
              <PowerSettingsNewIcon fontSize="medium" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id="switch-list-label-working-status"
            primary={
              <Typography variant="body1" className="font-medium">
                Running
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                className="font-medium"
              >
                {isActive ? "Yes" : "No"}
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
                  onClick={() => { addUrl(url); }}
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
      <SiteList sites={sites} onDelete={deleteUrl} />
    </Box>
  );
}






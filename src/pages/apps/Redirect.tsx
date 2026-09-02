import z from "zod";
import { useState, useEffect, useCallback, memo } from "react";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LinkIcon from "@mui/icons-material/Link";
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
  Link,
  Menu,
  MenuItem,
  InputAdornment,
  Typography,
  ListItemIcon,
} from "@mui/material";
import { setRedirect, deleteRedirect, getRedirect, type Redirect } from "@/utils/redirect";

interface RedirectSiteProps {
  site: Redirect | null;
  setUrl: (value: string | ((prevState: string) => string)) => void;
}

const RedirectSite = memo(function RedirectSite({ site, setUrl }: RedirectSiteProps) {
  const id = "redirect";
  const buttonId = `${id}-button`, menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [link, setLink] = useState<URL | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = useCallback(() => {
    deleteRedirect()
      .then(() => {
        setLink(null);
        handleClose();
      });
  }, [site]);


  const handleEdit = useCallback(() => {
    if (site) {
      setUrl(site);
      handleClose();
    }
  }, [site, setUrl]);

  useEffect(() => {
    if (site) {
      try {
        setLink(new URL(site));
      } catch (e) {
        setLink(null);
      }
    }
  }, [site]);

  return (
    <List
      dense={false}
      className="w-full max-w-160 rounded-2xl overflow-clip"
      sx={{ border: 1, borderColor: "divider", bgcolor: "background.paper" }}
    >
      {(!link) ? (
        <ListItem className="h-14">
          <ListItemAvatar className="min-w-0 mx-3">
            <Avatar variant="rounded" className="w-10 h-10 rounded-xl" sx={{ backgroundColor: "red" }}>
              <LinkIcon fontSize="medium" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="body2" className="font-medium" color="text.secondary">
                Redirects unavailable
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.disabled" className="block">
                There is no redirect site provided.
              </Typography>
            }
          />
        </ListItem>
      ) : (
        <ListItem className="h-14"
          secondaryAction={
            <>
              <IconButton
                edge="end"
                size="small"
                aria-label="delete"
                id={buttonId}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={handleClick}
                className="rounded-md!"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  list: {
                    'aria-labelledby': buttonId,
                  },
                }}
              >
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon sx={{ color: "error.main", }}>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    Remove
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    Edit
                  </ListItemText>
                </MenuItem>
              </Menu>
            </>
          }
        >
          <ListItemAvatar className="min-w-0 mx-3">
            <Avatar variant="rounded" className="w-10 h-10 rounded-xl" sx={{ backgroundColor: "green" }}>
              <LinkIcon fontSize="medium" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="body2" className="font-medium" color="text.secondary">
                {link.hostname}
              </Typography>
            }
            secondary={
              <Link variant="caption" color="text.disabled" className="block" href={link.href} target="_blank" rel="noopener noreferrer">
                {link.origin}
              </Link>
            }
          />
        </ListItem>)}
    </List>);
});

export default function Redirect() {
  const [url, setUrl] = useState<string>("");
  const [redirectSite, setRedirectSite] = useState<Redirect | null>(null);
  const [error, setError] = useState<null | string>(null);

  const setRedirectUrl = (urL: string) => {
    setRedirect(urL)
      .then((url) => {
        setRedirectSite(url);
        setUrl("");
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof z.ZodError ? (z.prettifyError(err)) : (err.message));
      });
  };

  useEffect(() => { getRedirect().then(setRedirectSite); }, []);

  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full">
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
                  onClick={() => { }}
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
                  <SaveIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onChange={({ target }) => setUrl(target.value)}
        onKeyUp={({ key }) => key === "Enter" && setRedirectUrl(url)}
        type="url"
        value={url}
        label="Set Redirect URL"
        variant="outlined"
        placeholder="https://example-redirect.com"
        error={!!error}
        helperText={error}
      />
      <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />
      <RedirectSite site={redirectSite} setUrl={setUrl} />
    </Box>
  );
}

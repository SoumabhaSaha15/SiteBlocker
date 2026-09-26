import Switch from '@/shared/Switch';
import { useState, useEffect } from 'react';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { getWorkingStatus, setWorkingStatus, type WorkingStatus, listenStatusChanges } from "@/utils/blocker";
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';

export default function Settings() {
  const [isActive, setIsActive] = useState<WorkingStatus>(false);

  useEffect(() => {
    getWorkingStatus().then(setIsActive);
    return listenStatusChanges(setIsActive);
  }, []);

  return (
    <Box
      className="flex flex-col min-h-full items-center w-full p-4 gap-6"
      color="secondary"
    >
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-lg text-center'
        children={"Settings"}
      />

      <List
        dense={false}
        className="w-full max-w-160 rounded-2xl py-1.5"
        sx={{
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >

        <ListItem
          className="h-14 px-3"
          secondaryAction={
            <Switch
              onChange={(_, checked) => setWorkingStatus(checked)}
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
        <Divider component="li" sx={{ borderColor: "divider", width: "100%", borderWidth: 1, my: 0.5 }} />
        <ListItem
          className="h-14 px-3"
          secondaryAction={
            <Switch />
          }>
          <ListItemAvatar className="min-w-0 mr-3">
            <Avatar
              variant="rounded"
              className="w-12 h-12 rounded-xl"
            // sx={{ bgcolor: (field.value ? "green" : "red") }}
            >
              <PowerSettingsNewIcon fontSize='medium' />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id="switch-list-label-password"
            primary={
              <Typography variant="body1" className="font-medium">
                Is rule active?
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                className="font-medium"
              >
                {/* {field.value ? "Yes" : "No"} */}
              </Typography>
            }
          />
        </ListItem>
        <Divider component="li" sx={{ borderColor: "divider", width: "100%", borderWidth: 1, my: 0.5 }} />
        <ListItem
          className="h-14 px-3"
          secondaryAction={
            <Switch checked />
          }>
          <ListItemAvatar className="min-w-0 mr-3">
            <Avatar
              variant="rounded"
              className="w-12 h-12 rounded-xl"
            >
              <RemoveCircleTwoToneIcon fontSize='medium' />
              {/* {(field.value) ? <RemoveCircleTwoToneIcon fontSize='medium' /> : <DoneIcon fontSize='medium' />} */}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id="switch-list-label-password"
            primary={
              <Typography variant="body1" className="font-medium">
                Preffered action
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                className="font-medium"
              >
                Block
                {/* {field.value ? "Block" : "Allow"} */}
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Box >
  )
}

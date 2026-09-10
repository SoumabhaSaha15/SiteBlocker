import React from 'react';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import Switch from '@/pages/shared/Switch';
import { Box, TextField, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Divider, Autocomplete, Fab, IconButton, Menu, MenuItem, ListItemIcon, Stack } from '@mui/material';
export default function ExtraConfig() {
  return (
    <Box
      className="flex flex-col min-h-full items-center w-full p-4 gap-6"
      color="secondary"
    >
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-xl text-center'
        children={"Extra Config"}
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
        {/* <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
          )}
        /> */}
        <ListItem
          className="h-14 px-3"
          secondaryAction={
            <Switch
            // {...field} checked={Boolean(field.value)}
            />
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
    </Box>
  )
}

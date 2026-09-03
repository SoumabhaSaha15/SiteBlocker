// import React from 'react'
import Switch from '@/pages/shared/Switch';
import Save from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';
import { zodResolver } from "@hookform/resolvers/zod";
import { rulesSchema, type Rules } from '@/utils/rules';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { Box, TextField, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
export default function Rules() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, control } = useForm<Rules>({ resolver: zodResolver(rulesSchema) });
  return (
    <Box
      component={"form"}
      className="flex flex-col min-h-full items-center w-full p-4 gap-6"
    // onSubmit={handleSubmit(formSubmit)}
    >
      <TextField
        {...register("site")}
        slotProps={{
          input: {
            endAdornment: <LinkIcon />
          }
        }}
        type='url'
        sx={{ minWidth: "min(640px,100%)" }}
        label="Site URL"
        variant='outlined'
        disabled={isSubmitting}
        error={!!(errors.site)}
        helperText={errors.site?.message}
      />

      <List
        dense={false}
        className="w-full max-w-160 rounded-2xl py-1"
        sx={{
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (

            <ListItem
              className="h-14 px-3"
              secondaryAction={
                <Switch {...field} checked={field.value} />
              }>
              <ListItemAvatar className="min-w-0 mr-3">
                <Avatar
                  variant="rounded"
                  className="w-12 h-12 rounded-xl"
                  sx={{ bgcolor: (field.value ? "green" : "red") }}
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
                    {field.value ? "Yes" : "No"}
                  </Typography>
                }
              />
            </ListItem>
          )}
        />
        <Divider component="li" sx={{ borderColor: "divider", width: "100%", borderWidth: 1, my: 0.5 }} />
        <Controller
          name="blocked"
          control={control}
          render={({ field }) => (
            <ListItem
              className="h-14 px-3"
              secondaryAction={
                <Switch {...field} checked={field.value} />
              }>
              <ListItemAvatar className="min-w-0 mr-3">
                <Avatar
                  variant="rounded"
                  className="w-12 h-12 rounded-xl"
                  sx={{ bgcolor: "primary.main" }}
                >
                  {(field.value) ? <RemoveCircleTwoToneIcon fontSize='medium' /> : <DoneIcon fontSize='medium' />}
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
                    {field.value ? "Block" : "Allow"}
                  </Typography>
                }
              />
            </ListItem>
          )}
        />
      </List>

      <Button
        variant='contained'
        sx={{ minWidth: "min(640px,100%)" }}
        size='large'
        type='submit'
        startIcon={<Save />}
      >
        Save
      </Button>
    </Box>
  )
}

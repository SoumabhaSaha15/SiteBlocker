import { useEffect, Fragment } from 'react';
import { Activity, useState } from 'react';
import Switch from '@/pages/shared/Switch';
import Save from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';
import { zodResolver } from "@hookform/resolvers/zod";
import { rulesSchema, type RulesType } from '@/validator/rules';
import AddIcon from '@mui/icons-material/FormatListBulletedAdd';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { useForm, Controller, SubmitHandler, UseFormReset } from "react-hook-form";
import { Box, TextField, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Divider, Autocomplete, Fab } from '@mui/material';

export default function Rules() {

  const [rules, setRules] = useState<RulesType[]>([]);
  const [mode, setMode] = useState<"visible" | "hidden">("hidden");
  const [formData, setFormData] = useState<RulesType>({ blocked: false, blockedKeys: [], isActive: false, site: "" });

  useEffect(() => { }, []);

  return (
    <>
      <Activity mode={mode} >
        <RulesForm
          defaultData={formData}
          setData={(data, resetData) => {
            console.log(data);
            setFormData(data);
            resetData();
          }}
        />
      </Activity>

      <Activity mode={mode === "hidden" ? "visible" : "hidden"}>
        <Box className="flex flex-col min-h-full items-center w-full p-4 gap-6">
          <Typography
            variant='h5'
            component="h5"
            sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
            className='w-full max-w-160 p-2 rounded-xl text-center'
            children={"Rules list"}
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
            {(!rules.length) ? (
              <ListItem className="h-14 px-3">
                <ListItemAvatar className="min-w-0 mr-3">
                  <Avatar variant="square" className="w-12 h-12 rounded-xl" sx={{ backgroundColor: "red" }}>
                    <AddIcon fontSize="medium" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" className="font-medium" color="text.secondary">No Rules</Typography>}
                  secondary={<Typography variant="caption" color="text.disabled" className="block">No rules created</Typography>}
                />
              </ListItem>
            ) : rules.map((item, index) => (<Fragment key={index}> {item.site}</Fragment>))}
          </List>

        </Box>
      </Activity>

      <Fab
        variant="extended"
        color='primary'
        sx={{ position: 'absolute', bottom: 16, right: 16, borderRadius: 1 }}
        onClick={() => setMode(prev => prev === "hidden" ? "visible" : "hidden")}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add rules
      </Fab>
    </>
  );
}

const RulesForm = ({ defaultData, setData }: {
  defaultData: RulesType, setData: (data: RulesType, reset: UseFormReset<RulesType>) => void
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
    control
  } = useForm<RulesType>({
    resolver: zodResolver(rulesSchema),
    defaultValues: defaultData
  });

  const formSubmit: SubmitHandler<RulesType> = async (data) => void setData(data, reset);
  return (
    <Box
      component={"form"}
      className="flex flex-col min-h-full items-center w-full p-4 gap-6"
      onSubmit={handleSubmit(formSubmit, console.dir)}
    >
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-xl text-center'
        children={"Rules form"}
      />

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

      <Controller
        name="blockedKeys"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => {
          return (
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={field.value}
              sx={{ minWidth: "min(640px,100%)" }}
              onChange={(_, newValue) => field.onChange(newValue)}
              renderValue={(props, getProps) => (props.map((option, index) => {
                const { key, ...tagProps } = getProps({ index });
                return (<Chip label={option} size="small" key={key} {...tagProps} />);
              }))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="URL Contains (keywords)"
                  error={invalid}
                  helperText={Array.isArray(error) ? error.map(e => e.message).filter(item => item !== "").join(",") : error?.message}
                />
              )}
            />
          )
        }}
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
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <ListItem
              className="h-14 px-3"
              secondaryAction={
                <Switch {...field} checked={Boolean(field.value)} />
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
                <Switch {...field} checked={Boolean(field.value)} />
              }>
              <ListItemAvatar className="min-w-0 mr-3">
                <Avatar
                  variant="rounded"
                  className="w-12 h-12 rounded-xl"
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
        disabled={isSubmitting || !isDirty}
        startIcon={<Save />}
      >
        Save
      </Button>
    </Box>
  )
}

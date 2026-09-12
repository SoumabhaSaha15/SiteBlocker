import { getIcon } from '@/utils/links';
import Switch from '@/pages/shared/Switch';
import Save from '@mui/icons-material/Save';
import { enqueueSnackbar } from 'notistack';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from "@mui/icons-material/Delete";
import { zodResolver } from "@hookform/resolvers/zod";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RuleIcon from '@mui/icons-material/FormatListBulleted';
import { rulesSchema, type RulesType } from '@/validator/rules';
import AddRuleIcon from '@mui/icons-material/FormatListBulletedAdd';
import { useEffect, useState, Fragment, Activity, useId, } from 'react';
import { saveRule, fetchRuleList, listenRulesChanges } from "@/utils/rules";
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { useForm, Controller, SubmitHandler, UseFormReset } from "react-hook-form";
import { Box, TextField, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Divider, Autocomplete, Fab, IconButton, Menu, MenuItem, ListItemIcon, Stack } from '@mui/material';

const EMPTY_RULE: RulesType = { blocked: false, blockedKeys: [], isActive: false, site: "" };

export default function Rules() {
  const [mode, setMode] = useState<boolean>(false);
  const [rules, setRules] = useState<RulesType[]>([]);
  const [formData, setFormData] = useState<RulesType>(EMPTY_RULE);

  useEffect(() => {
    fetchRuleList().then(data => setRules(data));
    const removeListener = listenRulesChanges(setRules);
    return removeListener;
  }, []);

  return (
    <>
      {mode ? (<RulesForm
        defaultData={formData}
        setData={(data, resetData) => {
          console.log(data);
          saveRule(data)
            .then(() => {
              resetData();
              enqueueSnackbar("Rule saved ✅.");
            })
            .catch((err: Error) => {
              enqueueSnackbar(err.message, { variant: "error" });
            })
            .finally(() => { setMode(prev => !prev); });
        }}
      />) : (
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
                    <RuleIcon fontSize="medium" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" className="font-medium" color="text.secondary">No Rules</Typography>}
                  secondary={<Typography variant="caption" color="text.disabled" className="block">No rules created</Typography>}
                />
              </ListItem>
            ) : rules.map((item, index) => (
              <Fragment key={index}>
                <RulePreview rule={item} handleDelete={() => { }} handleEdit={() => {
                  console.log("message");
                  setFormData(item);
                  setMode(prev => !prev);
                }} />
                {rules.length - 1 !== index && (
                  <Divider component="li" sx={{ borderColor: "divider", width: "100%", borderWidth: 1 }} />
                )}
              </Fragment>
            ))}
          </List>
        </Box>)}

      <Fab
        variant="extended"
        color='primary'
        sx={{ position: 'absolute', bottom: 16, right: 16, borderRadius: 1 }}
        onClick={() => {
          setMode(prev => !prev);
          setFormData(EMPTY_RULE);
        }}
      >
        {mode ? (
          <>
            <RuleIcon sx={{ mr: 1 }} />
            See rules
          </>
        ) : (
          <>
            <AddRuleIcon sx={{ mr: 1 }} />
            Add rule
          </>
        )}
      </Fab>
    </>
  );
}

type RulePreviewProps = {
  rule: RulesType,
  handleDelete: () => void,
  handleEdit: () => void,
};

const RulePreview = ({ rule, handleDelete, handleEdit }: RulePreviewProps) => {

  const id = useId();
  const buttonId = `${id}-button`, menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<>
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
            <MenuItem onClick={() => {
              handleDelete();
              handleClose();
            }}>
              <ListItemIcon sx={{ color: "error.main", }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Remove
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleEdit();
              handleClose();
            }}>
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
        <Avatar
          alt={rule.site}
          src={getIcon(rule.site)}
          variant="square"
          className="w-12 h-12 rounded-xl"
          slotProps={{ img: { className: "object-contain" } }}
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" className="font-medium" color="text.secondary">
            {rule.site}
          </Typography>
        }
        secondary={
          <Typography component="div" variant="body2" color="text.secondary">
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip label={`censored: ${rule.blockedKeys.length}`} color="primary" size="small" />
              <Chip label={rule.blocked ? "blocked" : "allowed"} size="small" />
              <Chip
                label={rule.isActive ? "active" : "inactive"}
                color={rule.isActive ? "success" : "error"}
                size="small"
              />
            </Stack>
          </Typography>
        }
      />
    </ListItem>
  </>);
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

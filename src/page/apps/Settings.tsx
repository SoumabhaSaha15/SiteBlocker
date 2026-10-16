import Switch from "@/components/Switch";
import { useState, useEffect } from "react";
import DoneIcon from "@mui/icons-material/Done";
import PasswordIcon from "@mui/icons-material/Lock";
import { zodResolver } from "@hookform/resolvers/zod";
import SecurityIcon from "@mui/icons-material/Security";
import ExtensionIcon from "@mui/icons-material/Extension";
import { type OptionsObject, enqueueSnackbar } from "notistack";
import PasswordInputField from "@/components/PasswordInputField";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNewTwoTone";
import {
  getContextMenuStatus,
  setContextMenuStatus,
  listenContextMenuStatusChanges,
  getExtensionPageBlockStatus,
  setExtensionPageBlockStatus,
  listenExtensionPageBlockStatusChanges,
} from "@/utils/settings";
import { useForm, type SubmitHandler, type UseFormReset } from "react-hook-form";
import { passwordSetupSchema, type PasswordSetupFormData } from "@/validator/password";
import {
  getWorkingStatus,
  setWorkingStatus,
  type WorkingStatus,
  listenStatusChanges,
} from "@/utils/blocker";
import {
  getPasswordProtected,
  listenProtectionChanges,
  setAppPassword,
  setPasswordProtected,
} from "@/utils/password";
import {
  Box,
  List,
  Button,
  Avatar,
  Dialog,
  Divider,
  ListItem,
  Typography,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemAvatar,
} from "@mui/material";

const SNACK_OPTION: OptionsObject = {
  variant: "default",
  autoHideDuration: 2000,
  anchorOrigin: { horizontal: "center", vertical: "bottom" },
};

function PasswordDialog({
  dialogOpen,
  setData,
  dialogOnClose,
}: {
  dialogOpen: boolean;
  setData: (
    data: PasswordSetupFormData,
    reset: UseFormReset<PasswordSetupFormData>,
  ) => Promise<void>;
  dialogOnClose: (e: Record<string, unknown>, reason: "backdropClick" | "escapeKeyDown") => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSetupFormData>({
    resolver: zodResolver(passwordSetupSchema),
  });

  const setupPassword: SubmitHandler<PasswordSetupFormData> = async (data) =>
    await setData(data, reset);

  return (
    <Dialog
      open={dialogOpen}
      onClose={dialogOnClose}
      slotProps={{ paper: { className: "rounded-lg" } }}
    >
      <DialogTitle className="p-2">
        <Typography
          variant="h5"
          component="h5"
          sx={{
            borderColor: "divider",
            backgroundColor: "secondary.main",
            color: "secondary.contrastText",
          }}
          className="w-full p-2 rounded-lg text-center"
          children={"Setup password"}
        />
      </DialogTitle>
      <DialogContent className="px-2 py-1">
        <Box
          component="form"
          id="password-setup-form"
          onSubmit={handleSubmit(setupPassword, console.dir)}
        >
          <PasswordInputField
            {...register("password")}
            autoFocus
            fullWidth
            margin="dense"
            label="Password"
            disabled={isSubmitting}
            slotProps={{ input: { className: "rounded-lg" } }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <PasswordInputField
            {...register("confirmPassword")}
            fullWidth
            margin="dense"
            label="Confirm password"
            slotProps={{ input: { className: "rounded-lg" } }}
            disabled={isSubmitting}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Box>
      </DialogContent>
      <DialogActions className="flex w-full justify-center items-center px-2">
        <Button
          type="submit"
          form="password-setup-form"
          variant="contained"
          size="large"
          className="rounded-lg w-full"
          disabled={isSubmitting}
          startIcon={<DoneIcon />}
          children="Submit"
        />
      </DialogActions>
    </Dialog>
  );
}

export default function Settings() {
  const [isActive, setIsActive] = useState<WorkingStatus>(false);
  const [protection, setProtection] = useState<boolean | null>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isExtensionPageBlocked, setIsExtensionPageBlocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false; //used to get rid of race condition occurs for slow-fetch [not likely]
    getPasswordProtected()
      .then((protectedState) => {
        if (cancelled) return;
        setProtection(protectedState);
      })
      .catch((err: Error) => {
        if (!cancelled)
          enqueueSnackbar(err.message, {
            ...SNACK_OPTION,
          });
      });

    const unsubscribe = listenProtectionChanges((change) => {
      cancelled = true; // a live change is authoritative from here on
      setProtection(change);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getWorkingStatus().then(setIsActive).catch(console.error);
    getContextMenuStatus().then(setIsContextMenuVisible).catch(console.error);
    getExtensionPageBlockStatus().then(setIsExtensionPageBlocked).catch(console.error);
    const unsubscribeWorkingStatus = listenStatusChanges(setIsActive);
    const unsubscribeContextMenuVisibleStatus =
      listenContextMenuStatusChanges(setIsContextMenuVisible);
    const unsubscribeExtensionPageStatus =
      listenExtensionPageBlockStatusChanges(setIsExtensionPageBlocked);
    return () => {
      unsubscribeWorkingStatus();
      unsubscribeExtensionPageStatus();
      unsubscribeContextMenuVisibleStatus();
    };
  }, []);

  return (
    <>
      <Box
        className="flex flex-col min-h-[calc(100dvh-4rem)] items-center w-full p-4 gap-6"
        color="secondary"
      >
        <Typography
          variant="h5"
          component="h5"
          sx={{
            borderColor: "divider",
            backgroundColor: "secondary.main",
            color: "secondary.contrastText",
          }}
          className="w-full max-w-160 p-2 rounded-lg text-center"
          children={"Settings"}
        />

        <List
          dense={false}
          className="w-full max-w-160 rounded-lg border"
          sx={{
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <ListItem
            className="h-14 px-2"
            secondaryAction={
              <Switch onChange={(_, checked) => setWorkingStatus(checked)} checked={isActive} />
            }
          >
            <ListItemAvatar className="min-w-0 mr-3">
              <Avatar className="w-10 h-10 rounded-md" sx={{ bgcolor: isActive ? "green" : "red" }}>
                <PowerSettingsNewIcon fontSize="medium" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id="switch-list-label-working-status"
              primary={
                <Typography variant="body1" className="font-medium truncate">
                  App Running
                </Typography>
              }
              secondary={
                <Typography variant="body2" className="font-medium">
                  {isActive ? "Yes" : "No"}
                </Typography>
              }
            />
          </ListItem>
          <Divider
            component="li"
            className="w-full my-0.5 border"
            sx={{ borderColor: "divider" }}
          />
          <ListItem
            className="h-14 px-2"
            secondaryAction={
              <Switch
                onChange={(_, check) => {
                  if (check == true) {
                    setIsOpen(true);
                  } else {
                    setPasswordProtected(false).then().catch(console.error);
                  }
                }}
                checked={!!protection}
                disabled={protection === null}
              />
            }
          >
            <ListItemAvatar className="min-w-0 mr-3">
              <Avatar
                className="w-10 h-10 rounded-md"
                sx={{
                  backgroundColor: protection === null ? "gray" : protection ? "green" : "red",
                }}
              >
                <PasswordIcon fontSize="medium" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id="switch-list-label-password"
              primary={
                <Typography variant="body1" className="font-medium truncate">
                  App lock
                </Typography>
              }
              secondary={
                <Typography variant="body2" className="font-medium truncate">
                  {protection === null ? "Loading..." : protection ? "Enabled" : "Disabled"}
                </Typography>
              }
            />
          </ListItem>
          <Divider
            component="li"
            className="w-full my-0.5 border"
            sx={{ borderColor: "divider" }}
          />
          <ListItem
            className="h-14 px-2"
            secondaryAction={
              <Switch
                onChange={(_, check) => {
                  setExtensionPageBlockStatus(check)
                    .then(() => {
                      enqueueSnackbar(`Extension page ${check ? "Blocked" : "Unblocked"}`, {
                        ...SNACK_OPTION,
                      });
                    })
                    .catch(console.log);
                }}
                checked={isExtensionPageBlocked}
              />
            }
          >
            <ListItemAvatar className="min-w-0 mr-3">
              <Avatar
                className="w-10 h-10 rounded-md"
                sx={{ bgcolor: isExtensionPageBlocked ? "green" : "red" }}
              >
                <ExtensionIcon fontSize="medium" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id="switch-list-label-password"
              primary={
                <Typography variant="body1" className="font-medium truncate">
                  Block entension page
                </Typography>
              }
              secondary={
                <Typography variant="body2" className="font-medium truncate">
                  {isExtensionPageBlocked ? "Yes" : "No"}
                </Typography>
              }
            />
          </ListItem>
          <Divider
            component="li"
            className="w-full my-0.5 border"
            sx={{ borderColor: "divider" }}
          />
          <ListItem
            className="h-14 px-2"
            secondaryAction={
              <Switch
                onChange={(_, checked) => {
                  setContextMenuStatus(checked)
                    .then(() => {
                      enqueueSnackbar(`Context menu ${checked ? "enabled" : "disabled"}.`, {
                        ...SNACK_OPTION,
                      });
                    })
                    .catch(console.error);
                }}
                checked={isContextMenuVisible}
              />
            }
          >
            <ListItemAvatar className="min-w-0 mr-3">
              <Avatar
                className="w-10 h-10 rounded-md"
                sx={{
                  backgroundColor: isContextMenuVisible ? "green" : "red",
                }}
              >
                <SecurityIcon fontSize="medium" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id="switch-list-label-password"
              primary={
                <Typography variant="body1" className="font-medium truncate">
                  Context menu shortcut
                </Typography>
              }
              secondary={
                <Typography variant="body2" className="font-medium truncate">
                  {isContextMenuVisible ? "Enabled" : "Disabled"}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Box>

      <PasswordDialog
        dialogOpen={isOpen}
        setData={async (data, reset) => {
          try {
            await setAppPassword(data.password);
            await setPasswordProtected(true);
            reset();
            setIsOpen(false);
            enqueueSnackbar(`Password updated.`, {
              ...SNACK_OPTION,
            });
          } catch (error) {
            console.error(error);
            enqueueSnackbar(`An error occured`, {
              ...SNACK_OPTION,
            });
          }
        }}
        dialogOnClose={(_, reason) => {
          enqueueSnackbar(`Dialog closed: ${reason}.`, {
            ...SNACK_OPTION,
          });
          setIsOpen(false);
        }}
      />
    </>
  );
}

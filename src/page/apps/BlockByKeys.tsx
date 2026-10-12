import Add from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import AbcIcon from "@mui/icons-material/Abc";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Keyword } from "@/validator/keywords";
import { TransitionGroup } from "react-transition-group";
import {
  getRestrictedKeywords,
  addRestrictedKeywords,
  listenBlockedKeywordChanges,
  setRestrictedKeywords,
} from "@/utils/keywords";
import {
  Box,
  List,
  Avatar,
  Divider,
  Collapse,
  ListItem,
  TextField,
  IconButton,
  Typography,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
} from "@mui/material";
import { prettifyError, ZodError } from "zod";

function KeywordsView({ keywords }: { keywords: Keyword[] }) {
  return (
    <List
      dense
      className="w-full max-w-160 rounded-lg overflow-clip border"
      sx={{ borderColor: "divider", backgroundColor: "background.paper" }}
    >
      <TransitionGroup>
        {!keywords.length ? (
          <Collapse>
            <ListItem className="px-1">
              <ListItemAvatar className="min-w-0 mr-3">
                <Avatar
                  variant="square"
                  className="w-10 h-10 rounded-md"
                  sx={{ backgroundColor: "red" }}
                >
                  <AbcIcon fontSize="medium" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    className="font-medium truncate"
                    color="text.secondary"
                  >
                    No Keyword
                  </Typography>
                }
              />
            </ListItem>
          </Collapse>
        ) : (
          keywords.map((item, index) => {
            console.log(typeof item);
            return (
              <Collapse key={item}>
                <ListItem
                  className="px-1"
                  sx={{ "&:hover": { bgcolor: "action.hover" } }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      aria-label="delete"
                      onClick={() => {
                        console.log(keywords);
                        setRestrictedKeywords(
                          keywords.filter((key) => {
                            console.log(typeof key);
                            return key !== item;
                          }),
                        )
                          .then(() => {
                            enqueueSnackbar(`${item} deleted.`, {
                              anchorOrigin: {
                                horizontal: "center",
                                vertical: "bottom",
                              },
                            });
                          })
                          .catch((error: unknown) => {
                            enqueueSnackbar(
                              `${prettifyError(error as ZodError)} deleted.`,
                              {
                                anchorOrigin: {
                                  horizontal: "center",
                                  vertical: "bottom",
                                },
                              },
                            );
                          });
                      }}
                      sx={{ borderRadius: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar className="min-w-0 mr-3">
                    <Avatar variant="square" className="w-10 h-10 rounded-md">
                      <AbcIcon fontSize="medium" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        className="font-medium truncate"
                      >
                        {item}
                      </Typography>
                    }
                  />
                </ListItem>
                {keywords.length - 1 !== index && (
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

export default function BlockByKeys() {
  const [word, setWord] = useState<Keyword>("");
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  const addKeyword = (keyword: Keyword) => {
    addRestrictedKeywords(keyword)
      .then(() => setWord(""))
      .catch(console.error);
  };

  useEffect(() => {
    getRestrictedKeywords().then(setKeywords);
    return listenBlockedKeywordChanges(setKeywords);
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
        children="Block Keys/Words"
      />
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
                  onClick={() => addKeyword(word)}
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
        onChange={({ target }) => setWord(target.value)}
        onKeyUp={({ key }) => key === "Enter" && addKeyword(word)}
        type="text"
        label="Add Keyword"
        variant="outlined"
        placeholder="xyz"
      />
      <Divider
        className="w-full max-w-160"
        sx={{ borderColor: "divider", borderWidth: 1 }}
      />
      <KeywordsView keywords={keywords} />
    </Box>
  );
}

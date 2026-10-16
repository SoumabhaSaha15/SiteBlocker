import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import TabContext from "@mui/lab/TabContext";
import { prettifyError, ZodError } from "zod";
import { darkTheme } from "@uiw/react-json-view/dark";
import DownloadIcon from "@mui/icons-material/Download";
import { lightTheme } from "@uiw/react-json-view/light";
import UploadIcon from "@mui/icons-material/SyncRounded";
import { enqueueSnackbar, type SnackbarOrigin } from "notistack";
import { Box, Tab, Paper, Button, useTheme, Typography } from "@mui/material";
import {
  getSyncedData,
  downloadJSONFile,
  listenDataChanges,
  importDataAsJson,
} from "@/utils/sync";

const ANCHOR_ORIGIN: SnackbarOrigin = {
  horizontal: "center",
  vertical: "bottom",
};
export default function Sync() {
  const theme = useTheme();
  const [value, setValue] = useState("1");
  const [jsonInput, setJsonInput] = useState("");
  const isDarkMode = theme.palette.mode === "dark";
  const [data, setData] = useState<Record<string, unknown>>({});
  const handleChange = (_event: React.SyntheticEvent, newValue: string) =>
    setValue(newValue);

  useEffect(() => {
    getSyncedData().then(setData);
    return listenDataChanges(setData);
  }, []);

  return (
    <Box className="flex flex-col gap-6 p-4 w-full items-center-safe min-h-[calc(100dvh-4rem)]">
      <Typography
        variant="h5"
        component="h5"
        sx={{
          borderColor: "divider",
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
        }}
        className="w-full max-w-160 p-2 rounded-lg text-center"
        children={"Data Sync"}
      />
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="lab tabs"
          className="min-w-[min(640px,80%)]"
          sx={{ borderBottom: 1, borderColor: "divider", borderRadius: 1 }}
        >
          <Tab label="Export Data" value="1" className="rounded-l-sm" />
          <Tab label="Import Data" value="2" />
        </TabList>
        <TabPanel value="1" tabIndex={0} className="min-w-[min(640px,80%)] p-1">
          <Paper
            elevation={0}
            className="w-full rounded-lg p-2"
            variant="outlined"
            sx={{
              borderColor: "divider",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflowX: "auto",
              "& .w-rjv": {
                backgroundColor: "transparent !important", // Inherit MUI background into the viewer
              },
            }}
          >
            <JsonView
              value={data}
              style={isDarkMode ? darkTheme : lightTheme}
              collapsed={2}
              displayDataTypes={false}
              enableClipboard={true}
            />
          </Paper>
          <br />
          <Button
            variant="contained"
            className="w-full rounded-lg"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={() => downloadJSONFile("site_blocker.json", data)}
            children="Download as json"
          />
        </TabPanel>
        <TabPanel value="2" tabIndex={0} className="min-w-[min(640px,80%)] p-1">
          <Paper
            elevation={0}
            className="w-full rounded-lg p-2 text-sm font-mono font-medium"
            variant="outlined"
            rows={4}
            component={"textarea"}
            value={jsonInput}
            onChange={({ target }) => setJsonInput(target.value)}
            placeholder="place your json here"
            sx={{
              resize: "vertical",
              borderColor: "divider",
              outline: "none",
              "&:focus": {
                outline: "none",
              },
              "&:focus-visible": {
                outline: "none",
              },
            }}
          />
          <br />
          <br />
          <Button
            variant="contained"
            className="w-full rounded-lg"
            size="large"
            startIcon={<UploadIcon />}
            children="Sync json"
            onClick={() => {
              try {
                importDataAsJson(jsonInput);
              } catch (error) {
                if (error instanceof ZodError) {
                  prettifyError(error)
                    .split("✖")
                    .filter((msg) => !!msg.length)
                    .forEach((msg) =>
                      enqueueSnackbar(`✖ ${msg}`, {
                        anchorOrigin: ANCHOR_ORIGIN,
                      }),
                    );
                } else if (error instanceof Error)
                  enqueueSnackbar(error.message, {
                    anchorOrigin: ANCHOR_ORIGIN,
                  });
                else console.error(error);
              }
            }}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

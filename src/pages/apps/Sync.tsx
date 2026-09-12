import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import TabContext from '@mui/lab/TabContext';
import { darkTheme } from "@uiw/react-json-view/dark";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/FileUpload';
import { lightTheme } from "@uiw/react-json-view/light";
import { getSyncedData, downloadJSONFile, listenDataChanges } from "@/utils/sync";
import { Paper, useTheme, Box, Tab, Button } from "@mui/material";

export default function Sync() {
  const theme = useTheme();
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const isDarkMode = theme.palette.mode === "dark";
  const [data, setData] = useState<Record<string, any>>({});
  useEffect(() => {
    getSyncedData().then(setData);
    let removeListener = listenDataChanges(setData);
    return removeListener;
  }, []);

  return (
    <Box className="flex flex-col gap-6 p-4 w-full items-center-safe">
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="lab tabs"
          className='min-w-[calc(min(640px,80%))]'
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Export Data" value="1" />
          <Tab label="Import Data" value="2" />
        </TabList>
        <TabPanel value="1" tabIndex={0} className='min-w-[calc(min(640px,80%))]'>
          <Paper
            elevation={0}
            className="w-full rounded-2xl"
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: isDarkMode
                ? theme.palette.grey[900]
                : theme.palette.grey[50],
              borderColor: theme.palette.divider,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflowX: "auto",
              "& .w-rjv": {
                backgroundColor: "transparent !important",  // Inherit MUI background into the viewer
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
            variant='contained'
            className='w-full'
            size='large'
            type='submit'
            color='secondary'
            startIcon={<DownloadIcon />}
            onClick={() => downloadJSONFile('site_blocker.json', data)}
          >
            Download as json
          </Button>
        </TabPanel>
        <TabPanel value="2" tabIndex={0} className='min-w-[calc(min(640px,80%))]'>
          <Button
            variant='contained'
            className='w-full'
            size='large'
            type='submit'
            color='secondary'
            startIcon={<UploadIcon />}
          >
            Upload json
          </Button>
        </TabPanel>
      </TabContext>
    </Box>
  )
}

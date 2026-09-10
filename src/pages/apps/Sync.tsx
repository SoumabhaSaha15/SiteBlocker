import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { getSyncedData } from "@/utils/sync";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import { Paper, useTheme, Box, Typography, Divider } from "@mui/material";

export default function Sync() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [data, setData] = useState<Record<string, any>>({});
  useEffect(() => {
    getSyncedData().then((sd) => {
      setData(sd);
      console.log(sd);
    });
  }, []);

  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full">
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-xl text-center'
        children={"Export Data"}
      />

      <Paper
        elevation={0}
        className="w-full max-w-160 rounded-2xl"
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
          // Inherit MUI background into the viewer
          "& .w-rjv": {
            backgroundColor: "transparent !important",
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
      <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-xl text-center'
        children={"Import Data"}
      />
    </Box>
  )
}

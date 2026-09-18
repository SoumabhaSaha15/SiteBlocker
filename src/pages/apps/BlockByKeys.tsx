// import React from 'react'
import { TextField, Divider, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import Add from '@mui/icons-material/Add';
export default function BlockByKeys() {
  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full">
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-xl text-center'
        children={"Block Keys/Words"}
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
                  // disabled={!url}
                  // onClick={() => { addUrl(url); }}
                  className="rounded-lg! transition-all"
                  sx={{
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
        // onChange={({ target }) => setUrl(target.value)}
        // onKeyUp={({ key }) => key === "Enter" && addUrl(url)}
        type="url"
        // value={url}
        label="Add sites"
        variant="outlined"
        placeholder="https://example.com"
      // error={!!error}
      // helperText={error}
      />

      <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />
    </Box>
  )
}

import Add from '@mui/icons-material/Add';
import { TextField, Divider, InputAdornment, IconButton, Box, Typography } from '@mui/material';
export default function BlockByKeys() {
  return (
    <Box className="flex flex-col items-center gap-6 p-4 w-full min-h-[calc(100dvh-4rem)]">
      <Typography
        variant='h5'
        component="h5"
        sx={{ borderColor: "divider", backgroundColor: "secondary.main", color: "secondary.contrastText", }}
        className='w-full max-w-160 p-2 rounded-lg text-center truncate'
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
                  sx={{
                    borderRadius:1,
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
        type="url"
        label="Add sites"
        variant="outlined"
        placeholder="https://example.com"
      />

      <Divider className="w-full max-w-160" sx={{ borderColor: "divider", borderWidth: 1 }} />
    </Box>
  )
}

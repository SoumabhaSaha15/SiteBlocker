import {Button} from '@mui/material';
import type { ResolvedResult } from "@/types/interfaces";

function App(props:Required<ResolvedResult>) {
  console.log(props);
  return (
      <Button
        variant="contained"
        color='primary'
      >
      </Button>
  )
}

export default App

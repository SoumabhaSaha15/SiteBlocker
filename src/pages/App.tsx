import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

export default function () {

  return (
    <Card sx={{ width: 400, height: 400 }} className="grid items-stretch justify-stretch">
      <CardMedia
        className="w-full aspect-square"
        image="/icon-with-shadow.svg"
        title="green iguana"
      />
      <CardActions sx={{ backgroundColor: "background.paper", width: "100%" }} className=" justify-center">
        <Button variant="contained">
          go to options
        </Button>
      </CardActions>
    </Card>
  );
}

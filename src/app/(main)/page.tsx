import { Box, Button, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box className="flex flex-wrap place-content-center space-x-4">
      <div className=" ">
        <Typography className="bg-cyan-500">Hello, Lucky Digits</Typography>
        <Button variant="contained">Click</Button>
      </div>
    </Box>
  );
}

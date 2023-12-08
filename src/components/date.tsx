import getFormattedDate from "@/lib/utils/getFormattedDate";
import { Spacer } from "@nextui-org/react";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Typography } from "@mui/material";
interface DateProps {
  date: string;
}
export default function Date({ date }: DateProps) {
  const pubDate = getFormattedDate(date);

  return (
    <Box sx={{ display: "flex" }}>
      <CalendarMonthIcon />
      <Spacer x={2} />
      <Typography>{pubDate}</Typography>
    </Box>
  );
}

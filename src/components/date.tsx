import getFormattedDate from "@/lib/utils/getFormattedDate";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Typography } from "@mui/material";
interface DateProps {
  date: string;
}
export default function Date({ date }: DateProps) {
  const pubDate = getFormattedDate(date);

  return (
    <Box sx={{ display: "flex", gap: "4" }}>
      <CalendarMonthIcon />
      <Typography>{pubDate}</Typography>
    </Box>
  );
}

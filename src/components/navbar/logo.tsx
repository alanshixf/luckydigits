import { Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { Space_Mono } from "next/font/google";
interface LogoProps {
  size: number;
}
const monospace = Space_Mono({
  subsets: ["latin"],
  variable: "--font-monospace",
  display: "swap",
  weight: "700",
});
function Logo({ size }: LogoProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={logo} alt="LKC logo" width={size} height={size} priority />
      <Typography
        fontSize={12}
        noWrap
        sx={{
          fontFamily: monospace.style,
          fontWeight: 700,
          color: "white",
          textDecoration: "none",
        }}
      >
        LUCKY DIGITS
      </Typography>
    </Box>
  );
}

export default Logo;

import { JetBrains_Mono } from "@next/font/google";
import { createTheme } from "@mui/material/styles";
import { green, red, yellow } from "@mui/material/colors";

export const jetbrainsMono = JetBrains_Mono({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5b75eb",
    },
    secondary: {
      main: "#16e0ce",
    },
    error: {
      main: red.A400,
    },
    warning: {
      main: yellow.A100,
    },
    success: {
      main: green.A200,
    },
  },
  typography: {
    fontFamily: jetbrainsMono.style.fontFamily,
  },
});

export default theme;

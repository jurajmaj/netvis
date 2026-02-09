import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          width: "230px",
          background: "#f1f1f1",
        },
      },
    },
  },
});
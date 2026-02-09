import { tooltipClasses } from "@mui/material/Tooltip";

export const tooltipStyles = {
  popper: {
    sx: {
      [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
        {
          backgroundColor: "#212121",
          fontFamily: "Monospace",
          fontSize: "11px",
        },
      [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.arrow}`]:
        {
          color: "#212121",
        },
    },
  },
};
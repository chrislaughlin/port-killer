// theme.ts
import { createTheme, alpha } from "@mui/material/styles";

const accent = {
  main: "#7C3AED", // violet 600-ish
  light: "#A78BFA",
  dark: "#5B21B6",
};

const base = {
  bg: "#0B0F14",        // app background
  paper: "#0F172A",     // surfaces/cards
  paper2: "#111827",    // slightly lighter surface
  border: "#1F2937",    // borders/dividers
  text: "#E5E7EB",      // primary text
  textMuted: "#9CA3AF", // secondary text
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: accent,
    secondary: { main: "#22C55E" }, // optional success-y secondary
    background: {
      default: base.bg,
      paper: base.paper,
    },
    text: {
      primary: base.text,
      secondary: base.textMuted,
    },
    divider: base.border,
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    info: { main: "#38BDF8" },
    success: { main: "#22C55E" },
  },

  shape: {
    borderRadius: 12, // modern, slightly rounded like shadcn
  },

  typography: {
    fontFamily: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "Apple Color Emoji",
      "Segoe UI Emoji",
    ].join(","),
    h6: { fontWeight: 650, letterSpacing: -0.2 },
    button: { textTransform: "none", fontWeight: 600 },
  },

  shadows: [
    "none",
    "0px 1px 2px rgba(0,0,0,0.35)",
    "0px 2px 6px rgba(0,0,0,0.35)",
    "0px 4px 14px rgba(0,0,0,0.35)",
    ...Array(21).fill("0px 8px 30px rgba(0,0,0,0.35)"),
  ] as any,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          colorScheme: "dark",
        },
        body: {
          backgroundColor: base.bg,
        },
        // subtle scrollbars for the popover window
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: alpha("#FFFFFF", 0.14),
          borderRadius: 999,
          border: `3px solid ${base.bg}`,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha("#FFFFFF", 0.2),
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha(base.border, 0.9)}`,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha(base.border, 0.9)}`,
          boxShadow: "0px 8px 30px rgba(0,0,0,0.35)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: base.paper,
          borderBottom: `1px solid ${alpha(base.border, 0.9)}`,
          boxShadow: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 12,
          paddingBlock: 8,
        },
        contained: {
          boxShadow: "none",
        },
        outlined: {
          borderColor: alpha("#FFFFFF", 0.14),
          "&:hover": {
            borderColor: alpha("#FFFFFF", 0.22),
            backgroundColor: alpha("#FFFFFF", 0.04),
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&:hover": {
            backgroundColor: alpha("#FFFFFF", 0.06),
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: "small" },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: alpha("#FFFFFF", 0.03),
          border: `1px solid ${alpha(base.border, 0.9)}`,
          transition: "border-color 120ms ease, box-shadow 120ms ease",
          "&:hover": {
            borderColor: alpha("#FFFFFF", 0.18),
          },
          "&.Mui-focused": {
            borderColor: alpha(accent.main, 0.7),
            boxShadow: `0 0 0 3px ${alpha(accent.main, 0.18)}`,
          },
        },
        input: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { border: "none" }, // we’re handling border on root
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha(base.border, 0.9),
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha("#0B0F14", 0.95),
          border: `1px solid ${alpha("#FFFFFF", 0.12)}`,
          boxShadow: "0px 12px 30px rgba(0,0,0,0.45)",
          borderRadius: 10,
          padding: "8px 10px",
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: base.paper,
          border: `1px solid ${alpha(base.border, 0.9)}`,
          borderRadius: 12,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&.Mui-selected": {
            backgroundColor: alpha(accent.main, 0.16),
            "&:hover": { backgroundColor: alpha(accent.main, 0.22) },
          },
          "&:hover": { backgroundColor: alpha("#FFFFFF", 0.06) },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: alpha("#FFFFFF", 0.06),
          border: `1px solid ${alpha("#FFFFFF", 0.12)}`,
        },
      },
    },
  },
});

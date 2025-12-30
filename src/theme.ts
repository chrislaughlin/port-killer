// theme.ts
import { createTheme, alpha } from "@mui/material/styles";

const accent = {
  main: "#7C3AED", // violet
  light: "#A78BFA",
  dark: "#5B21B6",
};

const danger = {
  main: "#EF4444",
};

const base = {
  // tuned for more depth + separation
  bg: "#0A0F14",         // deeper background
  paper: "#0F172A",      // main surface
  paper2: "#111B31",     // slightly lifted surface
  border: "#273244",     // brighter than before (premium feel)
  text: "#E5E7EB",
  textMuted: "#9CA3AF",
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: accent,
    secondary: { main: "#22C55E" },

    background: {
      default: base.bg,
      paper: base.paper,
    },

    text: {
      primary: base.text,
      secondary: base.textMuted,
    },

    divider: alpha(base.border, 0.9),

    error: danger,
    warning: { main: "#F59E0B" },
    info: { main: "#38BDF8" },
    success: { main: "#22C55E" },
  },

  shape: {
    borderRadius: 12,
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
    body1: { letterSpacing: -0.1 },
    body2: { letterSpacing: -0.1 },
    button: { textTransform: "none", fontWeight: 600 },
  },

  shadows: [
    "none",
    "0px 1px 2px rgba(0,0,0,0.35)",
    "0px 2px 6px rgba(0,0,0,0.35)",
    "0px 4px 14px rgba(0,0,0,0.35)",
    ...Array(21).fill("0px 12px 40px rgba(0,0,0,0.45)"),
  ] as any,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": { colorScheme: "dark" },
        html: { height: "100%" },
        body: {
          height: "100%",
          backgroundColor: base.bg,
        },
        "#root": { height: "100%" },

        // subtle scrollbars (popover-friendly)
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: alpha("#FFFFFF", 0.14),
          borderRadius: 999,
          border: `3px solid ${base.bg}`,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha("#FFFFFF", 0.22),
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha(base.border, 0.95)}`,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: base.paper2,
          border: `1px solid ${alpha(base.border, 0.95)}`,
          boxShadow: "0px 12px 40px rgba(0,0,0,0.45)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha(base.paper, 0.88),
          // uncomment for "glass" (looks great in popovers)
          backdropFilter: "blur(16px)",
          border: 'none',
          boxShadow: "none",
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingLeft: 12,
          paddingRight: 12,
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
          transition: "background-color 120ms ease, color 120ms ease",
          "&:hover": {
            backgroundColor: alpha("#FFFFFF", 0.06),
          },
          // You can apply className="danger" to kill buttons for consistent styling
          "&.danger:hover": {
            backgroundColor: alpha(danger.main, 0.14),
          },
          "&.danger:hover svg": {
            color: danger.main,
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
          border: `1px solid ${alpha(base.border, 0.95)}`,
          transition: "border-color 120ms ease, box-shadow 120ms ease",
          "&:hover": {
            borderColor: alpha("#FFFFFF", 0.18),
          },
          "&.Mui-focused": {
            borderColor: alpha(accent.main, 0.75),
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
        notchedOutline: { border: "none" },
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
          boxShadow: "0px 16px 44px rgba(0,0,0,0.55)",
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
          border: `1px solid ${alpha(base.border, 0.95)}`,
          borderRadius: 12,
        },
      },
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 12,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid transparent`,
          transition:
            "background-color 120ms ease, border-color 120ms ease, transform 120ms ease",
          "&:hover": {
            backgroundColor: alpha("#FFFFFF", 0.05),
            borderColor: alpha(base.border, 0.7),
            transform: "translateY(-1px)",
          },
          "&.Mui-selected": {
            backgroundColor: alpha(accent.main, 0.14),
            borderColor: alpha(accent.main, 0.35),
            "&:hover": {
              backgroundColor: alpha(accent.main, 0.18),
              borderColor: alpha(accent.main, 0.45),
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: alpha("#FFFFFF", 0.06),
          border: `1px solid ${alpha("#FFFFFF", 0.12)}`,
          fontWeight: 600,
        },
        outlined: {
          backgroundColor: "transparent",
          borderColor: alpha("#FFFFFF", 0.14),
        },
        label: {
          paddingLeft: 10,
          paddingRight: 10,
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          // helps text look a touch crisper in compact UIs
          textRendering: "optimizeLegibility",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${alpha(base.border, 0.95)}`,
          backgroundImage: "none",
        },
      },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${alpha(base.border, 0.95)}`,
          backgroundImage: "none",
          backgroundColor: base.paper2,
        },
      },
    },
  },
});

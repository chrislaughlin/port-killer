import { AppBar, Box, TextField, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function AppHeader({
  appState,
  searchTerm,
  setSearchTerm,
}: {
  appState: "loading" | "ready" | "killing";
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  
  return (
    <AppBar position="sticky" elevation={0}>
      {/* Top toolbar */}
      <Toolbar
        disableGutters
        sx={{
          px: 1.5,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ letterSpacing: -0.2 }}
        >
          Process Killer{" "}
          {appState === "loading" ? "⏳" : appState === "killing" ? "💥" : ""}
        </Typography>
      </Toolbar>

      {/* Search row */}
      <Box sx={{ px: 1.5, pb: 1.25 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by port, PID, or command…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete='off'
          type='text'
          InputProps={{
            startAdornment: (
              <SearchIcon fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
            ),
          }}
          
        />
      </Box>
    </AppBar>
  );
}

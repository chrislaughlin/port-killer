import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

import mockInvokes from "./mockInvokes";
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AppHeader from "./AppHeader";
import { KillButton } from "./killButton";
import { openUrl } from "@tauri-apps/plugin-opener";

export interface ProcessInfo {
  pid: number;
  port: number;
  command: string;
}

function invokeWrapper<T>(name: string, args?: any): Promise<T> {
  if (window.__TAURI_INTERNALS__ !== undefined) {
    return invoke(name, args) as Promise<T>;
  } else {
    return mockInvokes[name as keyof typeof mockInvokes]() as Promise<T>;
  }
}

function App() {
  const [runningPorts, setRunningPorts] = useState<ProcessInfo[]>([]);
  const [appState, setAppState] = useState<"loading" | "ready" | "killing">(
    "loading"
  );

  useEffect(() => {
    invokeWrapper("init");
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      console.log(document.hidden ? "hidden" : "visible");
      if (!document.hidden) {
        fetchRunningPorts();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  async function fetchRunningPorts() {
    setAppState("loading");
    const response: ProcessInfo[] = await invokeWrapper("get_running_ports");
    setRunningPorts(response);
    setAppState("ready");
  }

  return (
    <Box className="container" component="div" sx={{ background: "#0F172A" }}>
      <AppHeader appState={appState} />
      <List
        disablePadding
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {runningPorts
          .sort((a, b) => a.port - b.port)
          .map(({ pid, port, command }, index) => (
            <ListItemButton
              key={`${pid}-${port}-${index}`}
              sx={{ borderRadius: 2, mb: 0.75, alignItems: "flex-start" }}
            >
              <Stack direction="row" spacing={1.25} sx={{ width: "100%" }}>
                <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`Port ${port}`}
                      onClick={() => {
                        void openUrl(`http://localhost:${port}`);
                      }}
                    />
                    <Typography fontWeight={650} noWrap sx={{ minWidth: 0 }}>
                      Process Id: {pid}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {command.length > 30
                      ? `...${command.substring(command.length - 30)}`
                      : command}
                  </Typography>
                </Stack>

                <Tooltip title="Kill process">
                  <IconButton
                    size="small"
                    sx={{
                      mt: 0.25,
                      bgcolor: "rgba(239, 68, 68, 0.14)",
                      color: "#EF4444",
                    }}
                  >
                    <KillButton
                      onKill={async () => {
                        setAppState("killing");
                        await invokeWrapper("kill_port", { portNumber: port });
                        await fetchRunningPorts();
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Stack>
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}

export default App;

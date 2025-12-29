import { use, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

import mockInvokes from "./mockInvokes";
import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import WebIcon from "@mui/icons-material/Web";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import DangerousIcon from "@mui/icons-material/Dangerous";

export interface ProcessInfo {
  pid: number;
  port: number;
  command: string;
}

function invokeWrapper<T>(name: string): Promise<T> {
  if (window.__TAURI_INTERNALS__ !== undefined) {
    return invoke(name);
  } else {
    return mockInvokes[name as keyof typeof mockInvokes]() as Promise<T>;
  }
}

function App() {
  const [runningPorts, setRunningPorts] = useState<ProcessInfo[]>([]);

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
    const response: ProcessInfo[] = await invokeWrapper("get_running_ports");
    setRunningPorts(response);
  }

  return (
    <div className="container">
      <h2>Process Killer</h2>
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
          .map((process, index) => (
            <ListItem
              sx={{
                display: "grid",
                gridTemplateColumns: "90px 90px 1fr 44px",
                gap: 1,
                alignItems: "center",
                px: 1,
                py: 0.5,
              }}
              key={index}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                <TerminalIcon fontSize="small" />
                <Typography variant="body2" noWrap>
                  {process.pid}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                <WebIcon fontSize="small" />
                <Typography variant="body2" noWrap>
                  {process.port}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                <ElectricalServicesIcon fontSize="small" />
                <Typography variant="body2" noWrap title={process.command}>
                  {process.command.length > 20
                    ? `...${process.command.substring(
                        process.command.length - 20
                      )}`
                    : process.command}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  justifyContent: "flex-end",
                }}
              >
                <IconButton size="small">
                  <DangerousIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
      </List>
    </div>
  );
}

export default App;

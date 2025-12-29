import { use, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

import mockInvokes from './mockInvokes';
import { Button, List, ListItem } from '@mui/material';

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
  const [greeting, setGreeting] = useState<ProcessInfo[]>([]);
  const [openedDataTime, setOpenedDataTime] = useState<number | null>(null);
  const [visibleLog, setVisibleLog] = useState<boolean[]>([]);

  useEffect(() => {
    const handle = () => {
      setOpenedDataTime(new Date().getTime());
    };
    handle();
    return () => {
      handle();
    };
  }, []);

  useEffect(() => {
    invokeWrapper("init");
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      setVisibleLog((prev) => [...prev, !document.hidden]);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [])

  async function fetchGreeting() {
    const response:ProcessInfo[] = await invokeWrapper("greet");
    setGreeting(response);
  }

  return (
    <div className="container">
      <h1>Menubar App</h1>
      <span>Width: {window.outerWidth}</span>
      <br />
      <span>Height: {window.outerHeight}</span>
      <br />
      {/* <ul>
        {visibleLog.map((visible, index) => (
          <li key={index}>
            {visible ? "visible" : "hidden"}
          </li>
        ))}
      </ul> */}
      <Button variant="contained" onClick={fetchGreeting}>Greet</Button>
      <List>
        {greeting.map((process, index) => (
          <ListItem key={index}>
            PID: {process.pid}, Port: {process.port}, Command: {process.command}
          </ListItem>
        ))}
      </List>
      <pre>
        <code>{JSON.stringify(greeting, null, 2)}</code>
      </pre>
    </div>
  );
}

export default App;

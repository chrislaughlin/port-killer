import { use, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

function App() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    invoke("init");
  }, []);

  // useEffect(() => {
  //   async function fetchGreeting() {
  //     const response = await invoke("greet", { name: "Chris" });
  //     setGreeting(response as string);
  //   }
  //   fetchGreeting();
  // }, []);

  async function fetchGreeting() {
    const response = await invoke("greet", { name: "Chris" });
    setGreeting(response as string);
  }

  return (
    <div className="container">
      <h1>Menubar App</h1>
      <button onClick={fetchGreeting}>Greet</button>
      <p>{greeting}</p>
    </div>
  );
}

export default App;

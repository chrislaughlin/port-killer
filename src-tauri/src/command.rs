use std::sync::Once;

use std::process::Command;

use tauri_nspanel::ManagerExt;

use serde::Serialize;

use std::collections::HashMap;

use crate::fns::{
    setup_menubar_panel_listeners, swizzle_to_menubar_panel, update_menubar_appearance,
};

#[derive(Debug, Serialize)]
struct ListeningProcess {
    pid: u32,
    port: u16,
}

#[derive(Debug, Serialize)]
pub struct ProcessInfo {
    pid: u32,
    port: u16,
    command: String,
}

static INIT: Once = Once::new();

#[tauri::command]
pub fn init(app_handle: tauri::AppHandle) {
    INIT.call_once(|| {
        swizzle_to_menubar_panel(&app_handle);

        update_menubar_appearance(&app_handle);

        setup_menubar_panel_listeners(&app_handle);
    });
}

#[tauri::command]
pub fn show_menubar_panel(app_handle: tauri::AppHandle) {
    let panel = app_handle.get_webview_panel("main").unwrap();

    panel.show();
}

fn split_pid_command(line: &str) -> Option<(u32, &str)> {
    let line = line.trim_start();
    let idx = line.find(|c: char| c.is_whitespace())?;
    let (pid_str, rest) = line.split_at(idx);
    let pid = pid_str.parse::<u32>().ok()?;
    Some((pid, rest.trim_start()))
}

#[tauri::command]
pub fn greet() -> Result<Vec<ProcessInfo>, String> {
     use std::str;
    let output = match Command::new("lsof")
        .args([
            "-nP",
            "-iTCP",
            "-sTCP:LISTEN",
            "-FpPn",
        ])
        .output() {
            Ok(o) => o,
            Err(e) => return Err(e.to_string()),
        };

    if !output.status.success() {
        eprintln!("lsof failed: {}", String::from_utf8_lossy(&output.stderr));
        return Err("lsof exited with error".to_string());
    }

    let stdout = match str::from_utf8(&output.stdout) {
        Ok(s) => s,
        Err(_) => return Err("failed to parse output".to_string()),
    };

    let mut processes = Vec::new();
    let mut current_pid: Option<u32> = None;

    for line in stdout.lines() {
        if let Some(pid) = line.strip_prefix('p') {
            current_pid = pid.parse::<u32>().ok();
        } else if let Some(name) = line.strip_prefix('n') {
            if let Some(pid) = current_pid {
                if let Some(port_str) = name.split(':').last() {
                    if let Ok(port) = port_str.parse::<u16>() {
                        processes.push(ListeningProcess { pid, port });
                    }
                }
            }
        }
    }

    let all_pids: Vec<u32> = processes.iter().map(|p| p.pid).collect();
    let pids_str = all_pids.iter().map(|p| p.to_string()).collect::<Vec<_>>().join(",");
    println!("Listening processes: {}", pids_str);

    let port_commands = match Command::new("ps")
        .args([
            "-p",
            pids_str.as_str(),
            "-o",
            "pid=,command=",
        ])
        .output()
    {
        Ok(o) => o,
        Err(e) => return Err(e.to_string()),
    };

    if !port_commands.status.success() {
        eprintln!("lsof failed: {}", String::from_utf8_lossy(&output.stderr));
        return Ok(Vec::new());
    }

    let port_commands_stdout = String::from_utf8_lossy(&port_commands.stdout);
    println!("{port_commands_stdout}");

    let mut ports_by_pid: HashMap<u32, Vec<u16>> = HashMap::new();
    for p in &processes {
        ports_by_pid.entry(p.pid).or_default().push(p.port);
    }

    let mut infos = Vec::new();
    for line in port_commands_stdout.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        let (pid, command) = match split_pid_command(line) {
            Some(v) => v,
            None => continue,
        };

        if let Some(ports) = ports_by_pid.get(&pid) {
            for port in ports {
                infos.push(ProcessInfo {
                    pid,
                    port: *port,
                    command: command.to_string(),
                });
            }
        }
    }

    let json = serde_json::to_string_pretty(&infos).unwrap_or_else(|_| "[]".to_string());
    println!("{json}");

    Ok(infos)
}

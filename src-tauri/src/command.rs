use std::{collections::HashSet, sync::Once};

use std::process::Command;

use tauri_nspanel::ManagerExt;

use serde::Serialize;

use std::collections::HashMap;

use crate::fns::{
    setup_menubar_panel_listeners, swizzle_to_menubar_panel, update_menubar_appearance,
};

#[derive(Debug, Serialize)]
pub struct ProcessInfo {
    pid: u32,
    port: u16,
    command: String,
}

static INIT: Once = Once::new();

#[tauri::command]
pub fn init(app_handle: tauri::AppHandle) {
    println!("[init] Initializing menubar app");
    INIT.call_once(|| {
        swizzle_to_menubar_panel(&app_handle);
        println!("[init] Swizzled to menubar panel");

        update_menubar_appearance(&app_handle);
        println!("[init] Updated menubar appearance");

        setup_menubar_panel_listeners(&app_handle);
        println!("[init] Set up menubar listeners");
    });
}

#[tauri::command]
pub fn show_menubar_panel(app_handle: tauri::AppHandle) {
    println!("[show_menubar_panel] Showing panel");
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

fn running_ports() -> Result<Vec<u8>, String> {
    println!("[get_running_ports] Collecting listening ports");
    let output = match Command::new("lsof")
        .args([
            "-nP",
            "-iTCP",
            "-sTCP:LISTEN",
            "-FpPn",
        ])
        .output() {
            Ok(o) => o,
            Err(e) => {
                eprintln!("[get_running_ports] Failed to run lsof: {e}");
                return Err(e.to_string());
            },
        };

    if !output.status.success() {
        eprintln!("[get_running_ports] lsof failed: {}", String::from_utf8_lossy(&output.stderr));
        return Err("lsof exited with error".to_string());
    }

    Ok(output.stdout)
}

#[tauri::command]
pub fn get_running_ports() -> Result<Vec<ProcessInfo>, String> {
     use std::str;
    println!("[get_running_ports] Collecting listening ports");
    let all_running_ports = running_ports()?;

    let all_running_ports_stdout = match str::from_utf8(&all_running_ports) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("[get_running_ports] Failed to parse lsof output");
            return Err("failed to parse output".to_string());
        },
    };

    let mut processes: Vec<ProcessInfo> = Vec::new();
    let mut seen_ports: HashSet<(u32, u16)> = HashSet::new();
    let mut current_pid: Option<u32> = None;

    for line in all_running_ports_stdout.lines() {
        if let Some(pid) = line.strip_prefix('p') {
            current_pid = pid.parse::<u32>().ok();
        } else if let Some(name) = line.strip_prefix('n') {
            if let Some(pid) = current_pid {
                if let Some(port_str) = name.split(':').last() {
                    if let Ok(port) = port_str.parse::<u16>() {
                        // Prevent duplicate (pid, port) rows.
                        if seen_ports.insert((pid, port)) {
                            processes.push(ProcessInfo {
                                pid,
                                port,
                                command: String::new(),
                            });
                        }
                    }
                }
            }
        }
    }

    let all_pids: Vec<u32> = processes.iter().map(|p| p.pid).collect();
    let pids_str = all_pids.iter().collect::<HashSet<_>>().into_iter().map(|p| p.to_string()).collect::<Vec<_>>().join(",");
    println!("[get_running_ports] Listening PIDs: {}", pids_str);

    if pids_str.is_empty() {
        println!("[get_running_ports] No listening processes found");
        return Ok(Vec::new());
    }

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
        Err(e) => {
            eprintln!("[get_running_ports] Failed to run ps: {e}");
            return Err(e.to_string());
        },
    };

    if !port_commands.status.success() {
        eprintln!("[get_running_ports] ps failed: {}", String::from_utf8_lossy(&port_commands.stderr));
        return Ok(Vec::new());
    }

    let port_commands_stdout = String::from_utf8_lossy(&port_commands.stdout);
    // println!("[get_running_ports] ps output:\n{port_commands_stdout}");

    // Map each pid to its command string.
    let mut command_by_pid: HashMap<u32, String> = HashMap::new();
    for line in port_commands_stdout.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        let (pid, command) = match split_pid_command(line) {
            Some(v) => v,
            None => continue,
        };

        command_by_pid.insert(pid, command.to_string());
    }

    // Attach commands to processes by pid.
    for process in processes.iter_mut() {
        if let Some(command) = command_by_pid.get(&process.pid) {
            process.command = command.clone();
        }
    }

    // let json = serde_json::to_string_pretty(&infos).unwrap_or_else(|_| "[]".to_string());
    // println!("[get_running_ports] Resulting processes: {json}");
    let json = serde_json::to_string_pretty(&processes).unwrap_or_else(|_| "[]".to_string());
    println!("[get_running_ports] Resulting processes: {json}");

    Ok(processes)
}

#[tauri::command]
pub fn kill_port(port_number: u16) -> Result<(), String> {
    println!("[kill_port] Attempting to kill processes on port {port_number}");
    let lsof_output = Command::new("lsof")
        .args(["-ti", &format!(":{}", port_number)])
        .output()
        .map_err(|e| e.to_string())?;

    if !lsof_output.status.success() {
        let err = String::from_utf8_lossy(&lsof_output.stderr);
        eprintln!("[kill_port] lsof failed: {err}");
        return Err(format!("lsof failed: {err}"));
    }

    let pids: Vec<String> = String::from_utf8_lossy(&lsof_output.stdout)
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .map(ToOwned::to_owned)
        .collect();

    if pids.is_empty() {
        eprintln!("[kill_port] No process found on port {port_number}");
        return Err(format!("No process found listening on port {}", port_number));
    }

    println!("[kill_port] Found PIDs on port {port_number}: {:?}", pids);
    for pid in pids {
        let kill_output = Command::new("kill")
            .args(["-9", pid.as_str()])
            .output()
            .map_err(|e| e.to_string())?;

        if !kill_output.status.success() {
            let err = String::from_utf8_lossy(&kill_output.stderr);
            eprintln!("[kill_port] Failed to kill pid {pid}: {err}");
            return Err(format!("Failed to kill pid {}: {}", pid, err));
        }

        println!("[kill_port] Successfully killed pid {pid}");
    }

    Ok(())
}

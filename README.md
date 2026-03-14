# Port Killer (macOS menubar, Tauri v2)

![Gif recording of the process killer application in us .](demo.gif)

macOS menubar popover built with Tauri v2 + React. It lists every listening TCP port on your machine, shows the owning PID/command, lets you open the port in a browser, and can immediately kill any process bound to a port. The UI is styled with MUI and runs inside a non-activating NSPanel via `tauri-nspanel`.

## Features
- Menubar popover: tray icon toggles the panel; it hides when focus moves away so it behaves like a native menu.
- Port inventory: `lsof` + `ps` combine to list listening TCP ports with PID and command, sorted by port.
- Quick actions: click a port chip to open `http://localhost:<port>` (via `tauri-plugin-opener`); hit the kill button to send `kill -9` to any process on that port.
- Search and status: filter by port/PID/command, with loading/kill status indicators (⏳ / 💥) and auto-refresh when the popover regains focus.

## Requirements
- macOS (the menubar behavior relies on macOS-only private APIs).
- Node.js 18+ with [pnpm](https://pnpm.io) (corepack works fine).
- Rust toolchain (via [rustup](https://rustup.rs)) for building the Tauri side; Xcode Command Line Tools must be installed.
- No global Tauri CLI needed—the repo includes `@tauri-apps/cli`.

## Run the menubar app locally
```bash
pnpm install
pnpm tauri dev
```
- Vite runs on port 1420 (see `src-tauri/tauri.conf.json`), and the compiled app places a tray icon in the macOS menubar.
- Click the tray icon to show/hide the panel. Use the search box to filter, click a port chip to open it in your browser, or use the kill button to terminate the process bound to that port.
- Killing uses `kill -9`; ensure you have permission to terminate the target process.

## Build a release
```bash
pnpm tauri build
```
The bundle is written to `src-tauri/target/release/bundle/macos/`. Builds must run on macOS because of the private menubar APIs.

## Notarized macOS releases
The repo now ships the macOS bundle with an explicit hardened-runtime config and a minimal, non-sandbox entitlements file at `src-tauri/Entitlements.plist`. Keeping the entitlements empty is intentional: this app shells out to `lsof`, `ps`, and `kill`, so adding App Sandbox entitlements would break the core behavior.

GitHub Actions release builds expect these repository secrets:
- `APPLE_CERTIFICATE`: base64-encoded `.p12` for your `Developer ID Application` certificate.
- `APPLE_CERTIFICATE_PASSWORD`: password used when exporting that `.p12`.
- `APPLE_SIGNING_IDENTITY`: exact certificate subject, for example `Developer ID Application: Your Name (TEAMID)`.
- `APPLE_API_KEY`: App Store Connect API key ID.
- `APPLE_API_ISSUER`: App Store Connect issuer UUID.
- `APPLE_API_KEY_CONTENT`: contents of `AuthKey_<APPLE_API_KEY>.p8`.
- `APPLE_TEAM_ID`: optional, but useful if the Apple account belongs to multiple teams.

The release workflow uses Tauri’s built-in signing/notarization for the `.app`, then runs Apple’s `notarytool submit --wait` + `stapler staple` flow against the generated `.dmg` so the outer distribution artifact is stapled too.

To notarize a locally built DMG with the same flow:
```bash
pnpm tauri build --bundles app,dmg
export APPLE_API_KEY=...
export APPLE_API_ISSUER=...
export APPLE_API_KEY_PATH=/absolute/path/to/AuthKey_<KEY_ID>.p8
pnpm notarize:macos -- src-tauri/target/release/bundle/dmg/Port\ Killer_0.2.4_aarch64.dmg
```

Useful local verification commands after signing/notarization:
```bash
spctl -a -vv --type exec src-tauri/target/release/bundle/macos/Port\ Killer.app
xcrun stapler validate src-tauri/target/release/bundle/macos/Port\ Killer.app
xcrun stapler validate src-tauri/target/release/bundle/dmg/*.dmg
```

## Related
- [tauri-nspanel](https://github.com/ahkohd/tauri-nspanel/tree/main/examples/vanilla): converts a Tauri window into a non-activating menubar panel.

## License
MIT — see `LICENSE.md`.

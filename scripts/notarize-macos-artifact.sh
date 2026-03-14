#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF' >&2
Usage: scripts/notarize-macos-artifact.sh [path-to-dmg]

Environment:
  APPLE_API_KEY         App Store Connect API key ID
  APPLE_API_ISSUER      App Store Connect issuer ID
  APPLE_API_KEY_PATH    Absolute path to AuthKey_<KEY_ID>.p8
EOF
  exit 1
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

: "${APPLE_API_KEY:?APPLE_API_KEY must be set to the App Store Connect key ID}"
: "${APPLE_API_ISSUER:?APPLE_API_ISSUER must be set to the App Store Connect issuer ID}"
: "${APPLE_API_KEY_PATH:?APPLE_API_KEY_PATH must point to AuthKey_<KEY_ID>.p8}"

if [[ ! -f "${APPLE_API_KEY_PATH}" ]]; then
  echo "APPLE_API_KEY_PATH does not point to a readable file: ${APPLE_API_KEY_PATH}" >&2
  exit 1
fi

artifact_path="${1:-}"

if [[ -z "${artifact_path}" ]]; then
  artifact_path="$(
    find src-tauri/target -type f -path '*/bundle/dmg/*.dmg' | sort | tail -n 1
  )"
fi

if [[ -z "${artifact_path}" || ! -f "${artifact_path}" ]]; then
  echo "Could not find a DMG to notarize. Pass the DMG path explicitly." >&2
  exit 1
fi

app_path="$(
  find src-tauri/target -type d -path '*/bundle/macos/*.app' | sort | tail -n 1 || true
)"

echo "Submitting ${artifact_path} to Apple notarization..."
xcrun notarytool submit "${artifact_path}" \
  --key "${APPLE_API_KEY_PATH}" \
  --key-id "${APPLE_API_KEY}" \
  --issuer "${APPLE_API_ISSUER}" \
  --wait

echo "Stapling notarization ticket to ${artifact_path}..."
xcrun stapler staple "${artifact_path}"

echo "Validating stapled ticket on ${artifact_path}..."
xcrun stapler validate "${artifact_path}"

echo "Running Gatekeeper assessment on ${artifact_path}..."
spctl -a -vv --type open "${artifact_path}"

if [[ -n "${app_path}" ]]; then
  echo "Validating notarized app bundle at ${app_path}..."
  xcrun stapler validate "${app_path}"
  spctl -a -vv --type exec "${app_path}"
fi

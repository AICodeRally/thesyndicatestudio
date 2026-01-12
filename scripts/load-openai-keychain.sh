#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="com.aicoderally.dev"
ACCOUNT_NAME="OPENAI_API_KEY"

# Only load from keychain on macOS - on other systems (like Vercel),
# OPENAI_API_KEY should already be set as an environment variable
if ! command -v security >/dev/null 2>&1; then
  echo "Not on macOS - skipping keychain load (OPENAI_API_KEY should be set in environment)."
  exit 0
fi

OPENAI_API_KEY="$(security find-generic-password -s "$SERVICE_NAME" -a "$ACCOUNT_NAME" -w 2>/dev/null || true)"

if [ -z "$OPENAI_API_KEY" ]; then
  echo "OPENAI_API_KEY not found in keychain ($SERVICE_NAME / $ACCOUNT_NAME)."
  exit 1
fi

export OPENAI_API_KEY
echo "OPENAI_API_KEY loaded from keychain. Length: ${#OPENAI_API_KEY}"

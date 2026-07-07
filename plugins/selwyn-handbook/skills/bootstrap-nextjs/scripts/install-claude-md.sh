#!/usr/bin/env bash
#
# install-claude-md.sh, the bootstrap half of the Next.js scaffold skill.
#
# Fetches the live handbook rules from the site and writes them to the project
# root as CLAUDE.md so every future agent session inherits them. If a CLAUDE.md
# already exists, the fetched rules are appended under a marker rather than
# overwriting what is there, so local rules survive.
#
# Usage: bash install-claude-md.sh [project-root]   (defaults to cwd)

set -euo pipefail

URL="https://selwynuy.dev/claude.md"
ROOT="${1:-.}"
DEST="$ROOT/CLAUDE.md"
MARKER="<!-- selwyn-handbook: begin fetched rules -->"

fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$URL"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "$URL"
  else
    echo "install-claude-md: need curl or wget on PATH" >&2
    exit 2
  fi
}

RULES="$(fetch)"

if [ ! -s "$DEST" ]; then
  printf '%s\n' "$RULES" > "$DEST"
  echo "install-claude-md: wrote $DEST"
  exit 0
fi

if grep -qF "$MARKER" "$DEST" 2>/dev/null; then
  echo "install-claude-md: $DEST already contains the handbook rules, skipping."
  exit 0
fi

{
  printf '\n\n%s\n' "$MARKER"
  printf '%s\n' "$RULES"
} >> "$DEST"
echo "install-claude-md: appended handbook rules to existing $DEST"

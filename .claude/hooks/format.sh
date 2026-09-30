#!/bin/bash
# Run Prettier on the file Claude just edited. Never blocks the edit on failure.
f=$(jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
[ -n "$f" ] && [ -f "$f" ] || exit 0
case "$f" in
  *.astro|*.js|*.mjs|*.ts|*.json|*.css|*.md)
    [ -x "$CLAUDE_PROJECT_DIR/node_modules/.bin/prettier" ] &&
      "$CLAUDE_PROJECT_DIR/node_modules/.bin/prettier" --write "$f" >/dev/null 2>&1
    ;;
esac
exit 0

#!/bin/bash
# Wrapper script to load .env and start webhook server

# Set PATH and basic env
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Source .env file carefully (handles multiline values with newlines)
if [ -f "/Users/laurenz/.openclaw/.env" ]; then
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ "$key" == "#"* ]] || [ -z "$key" ]; then
      continue
    fi
    
    # Remove leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Remove quotes if present
    value="${value%\"}"
    value="${value#\"}"
    
    # Set the environment variable
    export "$key=$value"
  done < "/Users/laurenz/.openclaw/.env"
fi

# Start webhook server
exec /opt/homebrew/bin/node /Users/laurenz/.openclaw/workspace/services/subagent-webhook/server.js "$@"

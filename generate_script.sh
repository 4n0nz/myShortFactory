#!/bin/bash
# generate_script.sh <repo_url> <agent_dir>
# Usage: ./generate_script.sh https://github.com/owner/repo agent_myrepo

set -e

REPO_URL="$1"
AGENT_DIR="$2"
VIDGEN="/home/anon/videogen"

if [ -z "$REPO_URL" ] || [ -z "$AGENT_DIR" ]; then
  echo "Usage: $0 <repo_url> <agent_dir>"
  exit 1
fi

mkdir -p "$VIDGEN/$AGENT_DIR"
cd "$VIDGEN/$AGENT_DIR"

echo "=== AGENT 1 : SCOUT ===" | tee scout.log
echo "Repo: $REPO_URL" | tee -a scout.log

~/.npm-global/bin/claude -p "$(cat $VIDGEN/SPEC_scout.md)

Repo à analyser : $REPO_URL

Écris le résultat dans facts.json." \
  --dangerously-skip-permissions >> scout.log 2>&1

if [ ! -f facts.json ]; then
  echo "ERREUR: facts.json non généré" | tee -a scout.log
  exit 1
fi

echo "" | tee -a scout.log
echo "facts.json généré ($(wc -c < facts.json) bytes)" | tee -a scout.log
echo ""

echo "=== AGENT 2 : NARRATOR ===" | tee narrator.log

~/.npm-global/bin/claude -p "$(cat $VIDGEN/SPEC_narrator.md)

Voici les faits extraits du repo :
$(cat facts.json)

Écris le script dans script_qc.json." \
  --dangerously-skip-permissions >> narrator.log 2>&1

if [ ! -f script_qc.json ]; then
  echo "ERREUR: script_qc.json non généré" | tee -a narrator.log
  exit 1
fi

SCENES=$(python3 -c "import json; d=json.load(open('script_qc.json')); print(len(d))" 2>/dev/null || echo "?")
echo "script_qc.json généré — $SCENES scènes" | tee -a narrator.log
echo "==== SCRIPT DONE ===="

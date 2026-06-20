# myShortFactory

Pipeline de génération de **shorts explicatifs** (motion graphics + voix off + avatar host) à partir d'un **dépôt GitHub**. Tourne sur serveur Linux (GPU pour la voix XTTS).

> Séparé de `myVidFactory` qui fait le *remix* de vidéos existantes (swap d'avatar, audio gardé). Ici c'est l'inverse : **repo GitHub → vidéo générée de zéro**.

## Comment ça marche
**Input = URL d'un repo GitHub.** Deux agents Claude écrivent le script, puis Remotion + XTTS rendent la vidéo.

### 1. Écrire le script
```bash
./generate_script.sh <repo_url> <agent_dir>
```
- **SCOUT** (`SPEC_scout.md`) : clone `--depth 1`, explore (README, arbo, manifests, entrypoints) -> `facts.json`
- **NARRATOR** (`SPEC_narrator.md`) : `facts.json` -> `script_qc.json`. Le code montre DOIT etre du vrai code du repo (chemins reels).

### 2. Rendre
```bash
./render_master_xtts.sh
```
1. `build_audio_xtts.py script_qc.json boss_voice_ref.wav` -> voix off + `render-manifest.json`
2. `build_cues.py` -> cues des scenes `action`
3. `gen_captions.py script_qc.json` -> sous-titres
4. `npx remotion render src/index.ts Tutorial out/master_xtts.mp4`

## Avatar (champ `host` du script)
- `hero` = avatar plein ecran (sur chaque `chapter`)
- `pip` = avatar dans le coin (defaut : titres + contenu technique)
- `off` = pas d'avatar

## Setup
```bash
# Node / Remotion
npm install
# Voix XTTS (GPU) dans un venv separe
python -m venv .venv-xtts && . .venv-xtts/bin/activate
pip install TTS    # pin transformers<5
```
### Assets requis (NON versionnes — voir .gitignore)
- `boss_voice_ref.wav` — clip de reference pour le clone de voix
- `public/` — avatar masque + b-roll (matrix_rain, etc.)

## Style narration
**Franglais** : base francaise, tutoiement direct, anglicismes tech naturels (screen, run, live...). Structure en **5 temps** : Accroche -> Contexte -> Probleme -> Contenu -> Transformation. Encode dans `SPEC_narrator.md`.

## Formats
30s / 60s, 16:9 et 9:16 (vertical Insta/TikTok).

## License voix
XTTS v2 = **Coqui Public Model License (NON-COMMERCIALE)**. Pour la prod monetisee : basculer F5-TTS / Piper / Kokoro / Azure, ou prendre une license.

## Exemple
`examples/fluxion/` — le SPEC et le `script_qc.json` generes pour la video Fluxion (repo wifi-attack -> short securite).

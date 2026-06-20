# SPEC SCOUT — Agent 1 : Extraction des faits

Ton seul job : **lire le repo et extraire les faits bruts**. Tu ne rédiges pas de narration. Tu fournis de la matière première.

## Instructions

1. Clone le repo fourni dans le répertoire courant (depth 1).
2. Lis : README, fichiers principaux, modules, structure des dossiers.
3. Extrait les faits ci-dessous.
4. Écris le résultat dans `facts.json` (format strict ci-dessous).

## Format facts.json

```json
{
  "repo": "owner/name",
  "url": "https://github.com/owner/name",
  "stars": 0,
  "language": "Python",
  "description": "une phrase, ce que c'est",
  "problem_solved": "le problème concret que ce tool résout (2-3 phrases)",
  "hook": "la chose la plus surprenante ou impressionnante — ce qui va accrocher le spectateur",
  "architecture": "comment ça marche en 3-5 phrases, les composants clés",
  "stats": {
    "note": "chiffres marquants : nombre de fichiers, lignes de code, modules, langues supportées, etc."
  },
  "features": [
    {
      "name": "nom de la feature",
      "description": "ce que ça fait concrètement, sans parler du code"
    }
  ],
  "chapters": [
    "thème du chapitre 1",
    "thème du chapitre 2",
    "thème du chapitre 3",
    "thème du chapitre 4",
    "thème du chapitre 5"
  ],
  "transformation": "ce que le spectateur peut faire après avoir regardé (valeur concrète)"
}
```

## Règles

- `features` : 6 à 10 features. Décris ce que ça fait pour l'utilisateur — pas comment c'est implémenté. Pas de code, pas de noms de fonctions, pas de noms de variables.
- `hook` : une seule phrase, la plus punchy possible. Ce qui différencie ce repo de 1000 autres.
- `problem_solved` : la douleur concrète AVANT ce tool. Qu'est-ce que les gens faisaient avant ?
- `chapters` : 5 thèmes progressifs pour structurer la vidéo. Du global vers le détail.
- Sois factuel et concis. Juste le JSON.

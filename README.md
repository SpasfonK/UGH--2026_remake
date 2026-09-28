# UGH! — Prehistoric Space Taxi — V11

V11 remplace le rotor d'hélicoptère (hérité de V7) par une paire
d'ailes battantes conforme à la section "Flap-Copter" du brief
d'origine. Détail dans `ARCHITECTURE-v11.md` et `CRITIC-v11.md`. Le
smoke test CI est passé et le site est déployé sur GitHub Pages —
premier vrai retour visuel possible, à toi de vérifier le battement.

## ✅ CI validée, à vérifier maintenant : le rendu des ailes
Le smoke test Chromium headless passe et le site est déployé sur GitHub
Pages (voir section CI/CD ci-dessous pour l'historique des correctifs).
Toutes les itérations précédentes (V8-V10) ont été écrites sans jamais
pouvoir être vues dans un vrai navigateur ; ce n'est plus le cas. Pour
V11 en particulier (ailes battantes, voir `CRITIC-v11.md`), vérifie à
l'œil que le battement a l'air naturel et pas saccadé, et à l'oreille
que le whoosh de `audio.js` (`wingFlap()`) tombe bien sur le battement
descendant.

## CI/CD GitHub Actions
`.github/workflows/build-deploy.yml` fait tourner, sur chaque push et
pull request :
1. **validate** — `node --check` sur chaque module de `src/`.
2. **smoke-test** (informatif, ne bloque pas encore le déploiement) —
   ouvre réellement la page dans Chromium headless via Playwright et
   échoue si une erreur console/JS apparaît ou si le canvas WebGL n'est
   jamais créé. C'est le premier test de ce projet qui vérifie un rendu
   réel plutôt qu'une relecture de code (voir l'alerte de
   `CRITIC-v10.md`) — mais la config WebGL en headless CI pouvant être
   capricieuse selon le runner, il reste `continue-on-error: true`
   jusqu'à ce que tu l'aies vu passer plusieurs fois de suite sans faux
   négatif. Une fois confiant, ajoute `smoke-test` au `needs:` du job
   `deploy` pour le rendre bloquant.
3. **deploy** (uniquement sur push vers `main`) — publie le dossier tel
   quel sur GitHub Pages (aucune étape de build : c'est déjà du HTML/JS
   servi tel quel).

**Corrigé après le premier run réel sur GitHub** (les trois lignes
ci-dessous sont les bugs réellement rencontrés, pas des précautions
théoriques) :
- `configure-pages` échouait avec `HttpError: Not Found` sur un dépôt où
  Pages n'avait jamais été activé → `enablement: true` explicite dans le
  `with:` de cette étape, pour qu'elle crée le site Pages elle-même au
  lieu de simplement échouer.
- Le smoke test échouait (`exit code 1`) : `npx playwright install`
  télécharge le navigateur mais ne rend pas le paquet `playwright`
  importable par le script → ajout d'un `npm init -y && npm install
  playwright` avant l'installation du navigateur.
- `actions/checkout@v4` et `actions/setup-node@v4` déclenchaient un
  avertissement de dépréciation Node 20 → bump vers `@v5` (compatibles
  Node 24).

**Si `configure-pages` échoue quand même malgré `enablement: true`**
(certains réglages d'organisation bloquent la création automatique) :
Settings → Pages → "Build and deployment" → Source = **GitHub Actions**
à la main, une seule fois.

Si tu gardes le dossier `ugh-remake/` imbriqué dans un repo plus large
au lieu de le mettre à la racine du repo, adapte le `path: "."` de
l'étape `upload-pages-artifact` en `path: "ugh-remake"`.

## Lancer le jeu
```
npx serve .
# ou
python3 -m http.server 8080
```
Puis ouvrir `index.html` servi par ce serveur (les modules ES et les
textures canvas ne fonctionnent pas en `file://` direct).

## Contrôles
Clavier : A/D ou ←/→, W/↑ pédaler, S/↓ frein, P/Échap pause.
Mobile : joystick gauche direction, joystick droit pédalage/freinage.

## Nouveau en V11
- Le rotor d'hélicoptère (rotation continue) est remplacé par une paire
  d'ailes battantes (`wingL`/`wingR`), conforme à la section
  "Flap-Copter" du brief : membrane en `THREE.Shape` + spar en os, sur
  une charnière à l'épaule, battement borné piloté par une phase
  sinusoïdale plutôt qu'un angle cumulé.
- Nouveau son `wingFlap()` : un whoosh discret sur chaque battement
  descendant, en plus de la texture de fond continue déjà existante.
- Nouveau matériau `wing` (cuir brun-rouge translucide) dans `world.js`.

## Historique
- V10 : pipeline de post-traitement (`EffectComposer` + `UnrealBloomPass`
  + vignette/grade maison + `OutputPass`, tone mapping ACES), rais de
  lumière additifs, matériaux eau/mousse émissifs, import map.
- V9 : interpolation de rendu entre pas physiques fixes (le craft ne
  saute plus visuellement d'un pas de 1/120s à l'autre).
- V8 : particules réellement animées, stamina qui ne recharge qu'au
  sol, vrai shake caméra, textures procédurales, audio enrichi.

## Limites connues (voir CRITIC-v11.md)
- Rendu des ailes battantes pas encore confirmé à l'œil/à l'oreille —
  priorité avant la prochaine itération visuelle.
- Un seul passager actif à la fois.
- Three.js encore chargé via CDN jsDelivr, pas vendorisé localement.
- Réglages de bloom choisis par raisonnement, pas encore ajustés à l'œil.
- Géométrie du décor toujours primitive (dodécaèdres, cônes, capsules).

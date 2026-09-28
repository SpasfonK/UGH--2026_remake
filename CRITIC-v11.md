# CRITIC V11

## Alerte V10 close
Le smoke test Playwright est passé, et le déploiement GitHub Pages a
fonctionné après l'activation manuelle de Pages. C'est la première
confirmation réelle (pas déduite du code) que la scène Three.js,
l'import map et le pipeline de post-traitement (bloom, vignette,
tone mapping) fonctionnent dans un vrai navigateur. L'alerte prioritaire
du `CRITIC-v10.md` est donc levée.

## Correction livrée cette itération
Le rotor d'hélicoptère (hérité de V7, jamais remis en question) est
remplacé par une paire d'ailes battantes, conformément à la section
"Flap-Copter" du brief d'origine. C'est un défaut de fidélité au cahier
des charges qui n'avait jamais été détecté dans les audits précédents —
ils se concentraient sur des bugs de comportement (particules figées,
stamina, caméra), pas sur un écart entre le brief et un choix de design
qui "marchait" très bien de manière fonctionnelle.

## Vérification effectuée
`node --check` sur les 10 modules, `grep` confirmant qu'aucune référence
à l'ancien `rotor` ne subsiste. Comme pour V8-V10, ceci ne remplace pas
un rendu réel — voir "à vérifier" dans `ARCHITECTURE-v11.md`.

## Statut
Vertical slice cohérent, avec pour la première fois un canal de
vérification visuelle/auditive réel disponible (Pages déployé). C'est le
bon moment pour t'appuyer dessus avant d'empiler une itération de plus :
regarde et écoute le battement d'aile avant de me dire si je continue
sur autre chose ou si je corrige ce que tu y vois.

## Déficience n°1 à traiter ensuite (backlog, en attente de ton retour visuel)
Un seul passager actif à la fois — le brief ne l'exige pas explicitement
en plusieurs exemplaires, mais une économie à 2-3 passagers simultanés
(avec priorités et bonus de correspondance) rapprocherait le jeu du
"accomplished, polished arcade game" visé. Je la garde en attente : pas
la peine d'ajouter de la profondeur de jeu par-dessus une mécanique de
vol dont l'aspect visuel n'est pas encore confirmé.

## Autres manques connus (backlog, non bloquants)
- Three.js encore chargé via CDN, pas vendorisé localement.
- Géométrie toujours primitive pour le reste du décor (dodécaèdres,
  cônes, capsules) — le style low-poly reste défendable, mais loin de
  la finition Trine/Rayman Legends visée par le brief.
- Réglages de bloom choisis par raisonnement, jamais ajustés à l'œil.

# Architecture V11

V11 ne répond pas à un défaut technique flagué par le Critique, mais à
une relecture du brief d'origine contre le code existant : la section 1
du cahier des charges s'appelle "Core Physics & Flight Dynamics (The
'Flap-Copter')" et demande des "flapping pterodactyl-wing blades". Le
code hérité de V7 avait un rotor d'hélicoptère qui tourne en continu à
360° — jamais remis en question dans les audits V8/V9/V10, qui se sont
concentrés sur des bugs plus visibles (particules, stamina, caméra,
post-traitement).

## Le changement
- `craft.js` : le `Group` `rotor` (4 lames en croix, rotation continue)
  est remplacé par deux `wingL`/`wingR` — chacune un empan d'os (spar) +
  une membrane (silhouette via `THREE.Shape`/`ShapeGeometry`), montée sur
  une charnière à l'épaule.
- `game.js` : `flapPhase` est une phase continue (jamais un angle cumulé
  comme l'ancien `rotor.rotation.z += dt*20`) ; `sin(flapPhase)` pilote
  un battement borné entre les deux ailes, à une cadence qui suit le
  pédalage (12 rad/s en pédalant, 3.2 rad/s au repos — un battement lent
  et paresseux plutôt qu'un arrêt net).
- `audio.js` : un `wingFlap()` déclenché sur chaque battement descendant
  (bruit filtré en bande, balayage 900→220 Hz), en plus — pas à la place
  — de la texture de fond continue déjà existante (`updateRotor`). Le
  brief demande un "wing flap flutter" ; un simple bourdonnement continu
  ne rendait pas justice à ce terme.
- `world.js` : nouveau matériau `wing` (cuir brun-rouge, semi-transparent,
  double face) pour la membrane, distinct du `cloth` du corps.

## Ce qui reste à vérifier à l'œil (et à l'oreille)
C'est la première itération visuelle depuis que le déploiement Pages
fonctionne : pour la première fois, une vérification réelle est possible
avant la prochaine itération. Ce qui n'a pas pu être confirmé depuis cet
environnement de développement :
- Le sens du battement (montée/descente) est cohérent visuellement, pas
  juste "ça bouge dans un sens ou dans l'autre".
- L'aile arrière (`mirrorDepth: true`, `scale.z = -1`) ne provoque pas
  d'éclairage incohérent (une normale inversée mal gérée peut donner une
  face qui semble "sombre" malgré `side: THREE.DoubleSide`).
- La cadence du whoosh (`wingFlap()`) ne se déclenche pas de façon
  saccadée ou inaudible selon le frame rate réel.

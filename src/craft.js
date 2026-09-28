// Appareil du joueur : caveman pédaleur à ailes battantes. Groupe
// unique dont on expose les sous-parties animées (ailes, jambes) pour
// que le module de jeu puisse les faire bouger sans connaître la
// hiérarchie interne.
//
// V11 : le brief demande explicitement des "flapping pterodactyl-wing
// blades" (section "Flap-Copter" du cahier des charges) — pas un rotor
// d'hélicoptère qui tourne en continu à 360°, ce que V7 à V10 avaient
// hérité sans que ça soit jamais remis en cause. Chaque aile est
// maintenant montée sur une charnière à l'épaule qui bat de haut en bas
// (rotation.z oscillante pilotée par game.js), pas une rotation continue.

export function createCraft(THREE, scene, mats) {
  const craft = new THREE.Group();
  scene.add(craft);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 1.1, 6, 10), mats.cloth);
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), mats.skin);
  head.position.set(0.75, 0.42, 0.1);
  head.castShadow = true;

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), mats.hair);
  hair.position.set(0.72, 0.7, 0.1);
  hair.scale.set(1, 0.6, 1);

  // Une aile = un empan d'os (spar, le long du bord d'attaque) + une
  // membrane (silhouette de type ptérosaure via THREE.Shape). Montée
  // dans un groupe-charnière pivotant à l'épaule.
  function makeWing(mirrorDepth) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.05);
    shape.quadraticCurveTo(0.5, 0.62, 1.4, 0.32);
    shape.quadraticCurveTo(1.05, 0.02, 0.82, -0.08);
    shape.quadraticCurveTo(0.45, -0.18, 0, -0.05);
    shape.closePath();
    const membrane = new THREE.Mesh(new THREE.ShapeGeometry(shape, 10), mats.wing);
    membrane.castShadow = true;

    const spar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.04), mats.bone);
    spar.position.set(0.65, 0.18, 0.01);
    spar.rotation.z = 0.18;

    const pivot = new THREE.Group();
    pivot.add(membrane, spar);
    if (mirrorDepth) pivot.scale.z = -1; // aile arrière, symétrique en profondeur
    return pivot;
  }
  const wingL = makeWing(false);
  const wingR = makeWing(true);
  wingL.position.set(-0.35, 0.5, 0.12);
  wingR.position.set(-0.35, 0.5, -0.12);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.7), mats.bone);
  seat.position.set(-0.2, -0.55, 0.05);

  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.7, 4, 6), mats.skin);
  legL.position.set(-0.2, -0.72, 0.15);
  const legR = legL.clone();
  legR.position.z = -0.15;

  craft.add(body, head, hair, wingL, wingR, seat, legL, legR);
  craft.position.set(-11, -2.4, 2);

  return { group: craft, wingL, wingR, legL, legR };
}

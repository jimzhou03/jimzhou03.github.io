import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { mulberry32 } from "./math";

type AsteroidProfile = {
  seed: number;
  detail: 2 | 3;
  axes: [number, number, number];
  displacement: number;
  craters: number;
  chip: number;
};

const profiles: AsteroidProfile[] = [
  { seed: 19, detail: 2, axes: [1.12, 0.88, 0.96], displacement: 0.17, craters: 3, chip: 0.07 },
  { seed: 47, detail: 2, axes: [0.82, 1.18, 0.93], displacement: 0.2, craters: 4, chip: 0.1 },
  { seed: 83, detail: 3, axes: [1.32, 0.76, 0.84], displacement: 0.15, craters: 5, chip: 0.08 },
  { seed: 131, detail: 2, axes: [1.02, 0.58, 1.18], displacement: 0.19, craters: 3, chip: 0.14 },
  { seed: 173, detail: 2, axes: [0.76, 1.08, 1.28], displacement: 0.18, craters: 4, chip: 0.09 },
  { seed: 229, detail: 3, axes: [1.2, 1.02, 0.7], displacement: 0.14, craters: 6, chip: 0.06 },
  { seed: 281, detail: 2, axes: [0.92, 0.72, 1.38], displacement: 0.21, craters: 4, chip: 0.12 },
  { seed: 337, detail: 2, axes: [1.42, 0.52, 0.78], displacement: 0.16, craters: 2, chip: 0.18 },
];

function smoothCurve(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function directionalFbm(direction: THREE.Vector3, seed: number) {
  let amplitude = 0.58;
  let frequency = 1.65;
  let total = 0;
  let weight = 0;

  for (let octave = 0; octave < 4; octave += 1) {
    const phase = seed * (0.37 + octave * 0.19);
    const waveA = Math.sin(
      (direction.x * 0.83 + direction.y * 0.47 - direction.z * 0.31) * frequency + phase,
    );
    const waveB = Math.cos(
      (direction.x * -0.41 + direction.y * 0.92 + direction.z * 0.57) * frequency * 1.17 - phase * 0.73,
    );
    const waveC = Math.sin(
      (direction.x + direction.y * -0.62 + direction.z * 0.79) * frequency * 0.71 + phase * 1.31,
    );
    total += (waveA * waveB * 0.68 + waveC * 0.32) * amplitude;
    weight += amplitude;
    amplitude *= 0.51;
    frequency *= 2.03;
  }

  return total / weight;
}

function createCraterDirections(profile: AsteroidProfile) {
  const random = mulberry32(profile.seed * 7919);
  return Array.from({ length: profile.craters }, () => ({
    direction: new THREE.Vector3(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize(),
    radius: 0.08 + random() * 0.14,
    depth: 0.075 + random() * 0.11,
  }));
}

function deformGeometry(profile: AsteroidProfile) {
  const source = new THREE.IcosahedronGeometry(1, profile.detail);
  const geometry = mergeVertices(source, 1e-5);
  source.dispose();

  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const craters = createCraterDirections(profile);
  const random = mulberry32(profile.seed * 3571);
  const erosionFields = Array.from({ length: 2 }, () => ({
    direction: new THREE.Vector3(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize(),
    radius: 0.16 + random() * 0.14,
    depth: 0.08 + random() * 0.09,
  }));
  const chipDirection = new THREE.Vector3(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize();
  const axes = new THREE.Vector3(...profile.axes);
  const vertex = new THREE.Vector3();
  const direction = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    direction.copy(vertex).normalize();

    let radius = 1 + directionalFbm(direction, profile.seed) * profile.displacement;
    for (const crater of craters) {
      const distance = Math.max(0, 1 - direction.dot(crater.direction));
      const bowl = 1 - smoothCurve(distance / crater.radius);
      const rimDistance = Math.abs(distance - crater.radius * 0.76) / (crater.radius * 0.22);
      const rim = 1 - smoothCurve(rimDistance);
      radius -= bowl * crater.depth;
      radius += rim * crater.depth * 0.24;
    }

    for (const erosion of erosionFields) {
      const distance = Math.max(0, 1 - direction.dot(erosion.direction));
      radius -= (1 - smoothCurve(distance / erosion.radius)) * erosion.depth;
    }

    const chipAlignment = direction.dot(chipDirection);
    if (chipAlignment > 0.7) {
      radius -= smoothCurve((chipAlignment - 0.7) / 0.3) * profile.chip;
    }

    vertex.copy(direction).multiplyScalar(radius).multiply(axes);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function createAsteroidGeometries() {
  return profiles.map(deformGeometry);
}

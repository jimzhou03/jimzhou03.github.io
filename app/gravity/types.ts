import type * as THREE from "three";

export type GravityBody = {
  kind: "main" | "micro" | "foreground";
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  streamY: number;
  rotation: THREE.Quaternion;
  angularAxis: THREE.Vector3;
  angularSpeed: number;
  scale: THREE.Vector3;
  baseSpeed: number;
  depth: number;
  seed: number;
};

export type DustBody = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  streamY: number;
  baseSpeed: number;
  seed: number;
};

export type VocabularyBody = GravityBody & {
  sprite: THREE.Sprite;
  labelIndex: number;
  baseWidth: number;
  baseHeight: number;
};

export type SceneTier = "mobile" | "tablet" | "desktop";

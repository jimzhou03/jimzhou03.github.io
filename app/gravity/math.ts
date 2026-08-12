export function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / Math.max(0.00001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function coherentNoise(x: number, y: number, z: number, seed: number) {
  const low = Math.sin(x * 2.17 + seed * 0.91) * Math.cos(y * 1.83 - seed * 0.37);
  const medium = Math.sin((x + z) * 4.31 + seed * 1.73) * 0.48;
  const high = Math.cos((y - z) * 7.07 - seed * 0.63) * 0.2;
  return (low + medium + high) / 1.68;
}


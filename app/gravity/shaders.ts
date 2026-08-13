export const screenVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const asteroidVertexShader = /* glsl */ `
  precision highp float;

  varying vec3 vLocalPosition;
  varying vec3 vViewNormal;
  varying vec3 vInstanceColor;

  void main() {
    vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
    vec3 instanceNormal = normalize(mat3(instanceMatrix) * normal);
    vLocalPosition = position;
    vViewNormal = normalize(normalMatrix * instanceNormal);
    vInstanceColor = instanceColor;
    gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
  }
`;

export const asteroidFragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vLocalPosition;
  varying vec3 vViewNormal;
  varying vec3 vInstanceColor;

  float hash31(vec3 point) {
    point = fract(point * 0.1031);
    point += dot(point, point.yzx + 33.33);
    return fract((point.x + point.y) * point.z);
  }

  float noise3(vec3 point) {
    vec3 cell = floor(point);
    vec3 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float n000 = hash31(cell + vec3(0.0, 0.0, 0.0));
    float n100 = hash31(cell + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(cell + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(cell + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(cell + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(cell + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(cell + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(cell + vec3(1.0, 1.0, 1.0));
    float lower = mix(mix(n000, n100, local.x), mix(n010, n110, local.x), local.y);
    float upper = mix(mix(n001, n101, local.x), mix(n011, n111, local.x), local.y);
    return mix(lower, upper, local.z);
  }

  float fbm3(vec3 point) {
    float value = 0.0;
    float amplitude = 0.56;
    for (int octave = 0; octave < 4; octave += 1) {
      value += noise3(point) * amplitude;
      point = point * 2.07 + vec3(3.7, 1.9, 5.1);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 normal = normalize(vViewNormal);
    vec3 keyDirection = normalize(vec3(-0.58, 0.72, 0.66));
    vec3 fillDirection = normalize(vec3(0.72, -0.28, 0.54));
    float key = max(dot(normal, keyDirection), 0.0);
    float fill = max(dot(normal, fillDirection), 0.0) * 0.22;
    float rim = pow(1.0 - max(normal.z, 0.0), 2.2) * 0.12;

    float broadSurface = fbm3(vLocalPosition * 2.75 + vInstanceColor.xxx * 8.0);
    float fineSurface = fbm3(vLocalPosition * 8.5 + vec3(4.1, 7.7, 2.3));
    float geologicalTone = mix(0.76, 1.13, broadSurface) * mix(0.91, 1.05, fineSurface);
    float illumination = 0.34 + key * 0.82 + fill + rim;

    vec3 graphite = vec3(vInstanceColor.r, vInstanceColor.g, vInstanceColor.b);
    vec3 color = graphite * geologicalTone * illumination;
    color = max(color, vec3(0.075, 0.073, 0.068));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const lensingFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform float uHoleRadius;
  uniform float uMotion;
  uniform vec2 uHoleCenter;
  varying vec2 vUv;

  float line(float value, float width) {
    return 1.0 - smoothstep(width, width * 2.1, abs(fract(value) - 0.5));
  }

  float ring(float radius, float target, float width) {
    return 1.0 - smoothstep(width, width * 2.0, abs(radius - target));
  }

  void main() {
    vec2 aspectScale = vec2(uAspect, 1.0);
    vec2 p = (vUv - uHoleCenter) * aspectScale;
    float radius = length(p);
    float angle = atan(p.y, p.x);
    float influence = 1.0 - smoothstep(uHoleRadius * 1.15, uHoleRadius * 4.8, radius);
    float safeRadius = max(radius, uHoleRadius * 0.72);
    vec2 direction = p / safeRadius;
    float bend = influence * influence * uHoleRadius * 0.16;
    vec2 warped = vUv + direction * bend / aspectScale;
    warped += vec2(-direction.y, direction.x) * sin(angle * 3.0 + uTime * 0.035 * uMotion)
      * influence * uHoleRadius * 0.009 / aspectScale;

    vec2 gridScale = vec2(30.0 * uAspect, 18.0);
    float vertical = line(warped.x * gridScale.x, 0.015);
    float horizontal = line(warped.y * gridScale.y, 0.015);
    float grid = max(vertical, horizontal) * influence;

    float technicalRing = ring(radius, uHoleRadius * 2.2, 0.0012)
      + ring(radius, uHoleRadius * 2.82, 0.0008) * 0.55;
    float arcGate = smoothstep(-0.5, 0.8, sin(angle * 5.0 - 0.3));
    technicalRing *= mix(0.22, 1.0, arcGate);

    float alpha = grid * 0.07 + technicalRing * 0.11;
    alpha *= 0.72 + 0.28 * sin(angle * 2.0 + 1.2);
    gl_FragColor = vec4(vec3(0.035), clamp(alpha, 0.0, 0.22));
  }
`;

export const blackHoleFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform float uHoleRadius;
  uniform float uMotion;
  uniform vec2 uHoleCenter;
  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float a = hash21(cell);
    float b = hash21(cell + vec2(1.0, 0.0));
    float c = hash21(cell + vec2(0.0, 1.0));
    float d = hash21(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.56;
    mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);
    for (int octave = 0; octave < 5; octave += 1) {
      value += noise(point) * amplitude;
      point = rotation * point * 2.03 + vec2(7.3, 3.1);
      amplitude *= 0.5;
    }
    return value;
  }

  float ring(float radius, float target, float width) {
    return 1.0 - smoothstep(width, width * 2.0, abs(radius - target));
  }

  float annulus(float radius, float innerRadius, float outerRadius, float softness) {
    return smoothstep(innerRadius - softness, innerRadius + softness, radius)
      * (1.0 - smoothstep(outerRadius - softness, outerRadius + softness, radius));
  }

  float band(float value, float halfWidth, float feather) {
    return 1.0 - smoothstep(halfWidth, halfWidth + feather, abs(value));
  }

  void main() {
    vec2 p = (vUv - uHoleCenter) * vec2(uAspect, 1.0);
    float radius = length(p);
    float angle = atan(p.y, p.x);
    float slowTime = uTime * uMotion;
    float edgeField = fbm(vec2(angle * 1.32 - slowTime * 0.012, 4.7));
    float breathing = 1.0 + sin(slowTime * 0.095) * 0.003;
    float edgeNoise = (edgeField - 0.5) * uHoleRadius * 0.012
      + sin(angle * 7.0 + slowTime * 0.075) * uHoleRadius * 0.0025;
    float horizonRadius = uHoleRadius * breathing + edgeNoise;

    float diskTilt = -0.055;
    mat2 diskRotation = mat2(cos(diskTilt), -sin(diskTilt), sin(diskTilt), cos(diskTilt));
    vec2 diskPoint = diskRotation * p / max(uHoleRadius, 0.0001);
    float broadWarp = (fbm(vec2(diskPoint.x * 0.29 - slowTime * 0.009, 3.7)) - 0.5) * 0.17;
    float localWarp = (fbm(vec2(diskPoint.x * 0.78 - slowTime * 0.018, 8.2)) - 0.5) * 0.075;
    float centerLine = broadWarp + localWarp + sin(diskPoint.x * 1.12 + slowTime * 0.014) * 0.025;
    float crossSection = diskPoint.y - centerLine;

    float widthNoise = fbm(vec2(diskPoint.x * 0.42 + 11.2, slowTime * 0.006 + 2.4));
    float matterWidth = mix(0.22, 0.31, widthNoise);
    float broadBand = band(crossSection, matterWidth, 0.2);
    float innerBand = band(crossSection, matterWidth * 0.43, 0.12);

    vec2 flowCoordinates = vec2(
      diskPoint.x * 0.68 - slowTime * 0.022,
      crossSection * 6.4 + slowTime * 0.008
    );
    float broadFlow = fbm(flowCoordinates * vec2(0.52, 0.72) + vec2(4.8, 1.3));
    float filamentFlow = fbm(flowCoordinates + vec2(12.7, 6.4));
    float fineFlow = fbm(flowCoordinates * vec2(1.68, 1.34) + vec2(1.9, 14.2));
    float density = clamp(0.19 + broadFlow * 0.42 + filamentFlow * 0.28 + fineFlow * 0.12, 0.0, 1.0);
    float filament = smoothstep(0.47, 0.82, filamentFlow) * broadBand;

    float leftExtent = 1.0 - smoothstep(3.55, 4.65, -diskPoint.x);
    float rightExtent = 1.0 - smoothstep(2.7, 3.75, diskPoint.x);
    float streamExtent = leftExtent * rightExtent;
    float centralWeight = 1.0 - smoothstep(1.1, 4.15, abs(diskPoint.x));
    float densityField = broadBand * streamExtent * density;
    densityField *= mix(0.68, 1.0, centralWeight);
    densityField += innerBand * streamExtent * (0.13 + filament * 0.24);

    float rearGate = smoothstep(-0.17, 0.17, crossSection);
    float frontGate = 1.0 - smoothstep(-0.16, 0.2, crossSection);
    float rearMatter = densityField * rearGate;
    float frontMatter = densityField * frontGate;

    float normalizedArcX = p.x / max(uHoleRadius * 1.58, 0.0001);
    float arcSpan = 1.0 - smoothstep(0.86, 1.0, abs(normalizedArcX));
    float arcHeight = uHoleRadius * (0.2 + 0.92 * sqrt(max(0.0, 1.0 - normalizedArcX * normalizedArcX)));
    float arcWarp = (fbm(vec2(normalizedArcX * 1.7 - slowTime * 0.011, 9.4)) - 0.5)
      * uHoleRadius * 0.12;
    float lensedArc = 1.0 - smoothstep(
      uHoleRadius * 0.045,
      uHoleRadius * 0.14,
      abs(p.y - arcHeight - arcWarp)
    );
    float arcTexture = 0.34 + fbm(vec2(normalizedArcX * 1.45 - slowTime * 0.012, 8.7)) * 0.5;
    lensedArc *= arcSpan * arcTexture;

    float photonRing = ring(radius, uHoleRadius * 1.025, uHoleRadius * 0.006);
    float outerCircle = ring(radius, uHoleRadius * 2.2, uHoleRadius * 0.002);
    outerCircle *= 0.42 + 0.58 * smoothstep(0.28, 0.72, noise(vec2(angle * 1.8, 4.2)));
    float massShell = annulus(
      radius,
      horizonRadius * 0.985,
      horizonRadius * 1.16,
      uHoleRadius * 0.024
    );
    float lensingShade = annulus(
      radius,
      horizonRadius * 1.09,
      horizonRadius * 1.38,
      uHoleRadius * 0.055
    );
    float horizon = 1.0 - smoothstep(horizonRadius, horizonRadius + uHoleRadius * 0.025, radius);
    float softRim = annulus(
      radius,
      horizonRadius * 0.995,
      horizonRadius * 1.085,
      uHoleRadius * 0.035
    );
    float rim = ring(radius, horizonRadius * 1.018, uHoleRadius * 0.0065);
    float innerRim = ring(radius, horizonRadius * 0.925, uHoleRadius * 0.005) * 0.08;

    vec3 paper = vec3(0.949, 0.937, 0.906);
    vec3 ink = vec3(0.008);
    vec3 color = paper;
    float alpha = 0.0;

    float rearAlpha = rearMatter * mix(0.5, 0.68, broadFlow);
    vec3 rearColor = mix(vec3(0.18), vec3(0.58), broadFlow);
    color = mix(color, rearColor, rearAlpha);
    alpha = max(alpha, rearAlpha);

    color = mix(color, vec3(0.17), lensedArc * 0.48);
    alpha = max(alpha, lensedArc * 0.48);
    color = mix(color, vec3(0.025), massShell * 0.32 + lensingShade * 0.055);
    alpha = max(alpha, massShell * 0.32 + lensingShade * 0.055);
    color = mix(color, vec3(0.11), outerCircle * 0.045);
    alpha = max(alpha, outerCircle * 0.045);
    color = mix(color, paper, softRim * 0.12 + photonRing * 0.26 + rim * 0.55);
    alpha = max(alpha, softRim * 0.12 + photonRing * 0.26 + rim * 0.55);
    color = mix(color, ink, horizon);
    alpha = max(alpha, horizon);
    color = mix(color, vec3(0.055), innerRim);
    alpha = max(alpha, innerRim);

    float frontStructure = clamp(broadFlow * 0.5 + filamentFlow * 0.35 + fineFlow * 0.15, 0.0, 1.0);
    float frontAlpha = frontMatter * mix(0.68, 0.88, filamentFlow);
    vec3 frontColor = mix(vec3(0.14), vec3(0.68), frontStructure);
    color = mix(color, frontColor, frontAlpha);
    alpha = max(alpha, frontAlpha);

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

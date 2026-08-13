import * as THREE from "three";
import { createAsteroidGeometries } from "./asteroidGeometry";
import {
  asteroidFragmentShader,
  asteroidVertexShader,
  blackHoleFragmentShader,
  lensingFragmentShader,
  screenVertexShader,
} from "./shaders";
import { clamp, mulberry32, smoothstep } from "./math";
import type { DustBody, GravityBody, SceneTier, VocabularyBody } from "./types";

const vocabulary = [
  "TOKEN",
  "EMBEDDING",
  "ATTENTION",
  "TRANSFORMER",
  "BERT",
  "LLM",
  "RAG",
  "RETRIEVAL",
  "RERANKING",
  "LoRA",
  "PEFT",
  "KNOWLEDGE GRAPH",
  "MULTIMODAL",
  "ALIGNMENT",
  "CONTEXT",
  "SEMANTICS",
  "SYNTAX",
  "REPRESENTATION",
  "INFERENCE",
  "DECODING",
  "ENCODER",
  "DECODER",
  "VECTOR",
  "LATENT SPACE",
  "CORPUS",
  "LANGUAGE MODEL",
  "REASONING",
];

type AsteroidField = {
  mesh: THREE.InstancedMesh;
  bodies: GravityBody[];
};

type GravitySceneOptions = {
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  blackHoleAnchor: HTMLElement;
  reducedMotion: boolean;
  onReady: () => void;
};

export class EditorialGravityScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly stage: HTMLElement;
  private readonly blackHoleAnchor: HTMLElement;
  private readonly reducedMotion: boolean;
  private readonly onReady: () => void;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  private readonly random = mulberry32(241103);
  private readonly dummy = new THREE.Object3D();
  private readonly quaternionStep = new THREE.Quaternion();
  private readonly toHole = new THREE.Vector3();
  private readonly fromPointer = new THREE.Vector3();
  private readonly displayPosition = new THREE.Vector3();
  private readonly pointer = new THREE.Vector2();
  private readonly pointerTarget = new THREE.Vector2();
  private readonly pointerWorld = new THREE.Vector3();
  private readonly geometries = createAsteroidGeometries();
  private readonly asteroidMaterial = new THREE.ShaderMaterial({
    vertexShader: asteroidVertexShader,
    fragmentShader: asteroidFragmentShader,
  });
  private readonly screenGeometry = new THREE.PlaneGeometry(2, 2);
  private readonly lensingMaterial: THREE.ShaderMaterial;
  private readonly blackHoleMaterial: THREE.ShaderMaterial;
  private readonly labelTextures = new Map<number, THREE.CanvasTexture>();
  private readonly fields: AsteroidField[] = [];
  private readonly words: VocabularyBody[] = [];
  private readonly dust: DustBody[] = [];
  private dustGeometry: THREE.BufferGeometry | null = null;
  private dustPoints: THREE.Points | null = null;
  private dustPositions: Float32Array | null = null;
  private animationFrame = 0;
  private lastReducedFrame = 0;
  private active = true;
  private disposed = false;
  private tier: SceneTier = "desktop";
  private worldWidth = 1;
  private worldHeight = 1;
  private holeRadius = 0.35;
  private influenceRadius = 2.5;
  private pointerRadius = 0.8;
  private pointerActive = false;
  private disturbedBodies = 0;
  private readonly holePosition = new THREE.Vector3();
  private elapsed = 0;
  private lastTimestamp = 0;

  constructor(options: GravitySceneOptions) {
    this.canvas = options.canvas;
    this.stage = options.stage;
    this.blackHoleAnchor = options.blackHoleAnchor;
    this.reducedMotion = options.reducedMotion;
    this.onReady = options.onReady;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera.position.set(0, 0, 6);

    const sharedUniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uHoleRadius: { value: 0.1 },
      uMotion: { value: this.reducedMotion ? 0.08 : 1 },
      uHoleCenter: { value: new THREE.Vector2(0.8, 0.5) },
    };
    this.lensingMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(sharedUniforms),
      vertexShader: screenVertexShader,
      fragmentShader: lensingFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.blackHoleMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(sharedUniforms),
      vertexShader: screenVertexShader,
      fragmentShader: blackHoleFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const lensingPlane = new THREE.Mesh(this.screenGeometry, this.lensingMaterial);
    lensingPlane.frustumCulled = false;
    lensingPlane.renderOrder = -20;
    this.scene.add(lensingPlane);

    const blackHolePlane = new THREE.Mesh(this.screenGeometry, this.blackHoleMaterial);
    blackHolePlane.frustumCulled = false;
    blackHolePlane.renderOrder = 20;
    this.scene.add(blackHolePlane);

    this.scene.add(new THREE.AmbientLight(0xf2efe7, 0.42));
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x68645c, 0.52));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.25);
    keyLight.position.set(-4.5, 5.2, 6.5);
    this.scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xc9c5bb, 1.32);
    rimLight.position.set(4.2, -1.8, 3.4);
    this.scene.add(rimLight);

    this.resize();
    this.rebuildPopulation();
    this.onReady();
  }

  private getTier(width: number): SceneTier {
    if (width < 720) return "mobile";
    if (width < 1180) return "tablet";
    return "desktop";
  }

  resize() {
    if (this.disposed) return;
    const bounds = this.stage.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;

    const nextTier = this.getTier(bounds.width);
    const pixelRatioCap = nextTier === "mobile" ? 1.15 : nextTier === "tablet" ? 1.35 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
    this.renderer.setSize(bounds.width, bounds.height, false);
    this.camera.aspect = bounds.width / bounds.height;
    this.camera.updateProjectionMatrix();

    this.worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * this.camera.position.z;
    this.worldWidth = this.worldHeight * this.camera.aspect;

    const anchorBounds = this.blackHoleAnchor.getBoundingClientRect();
    const centerX = anchorBounds.left - bounds.left + anchorBounds.width * 0.5;
    const centerY = anchorBounds.top - bounds.top + anchorBounds.height * 0.5;
    const normalizedCenter = new THREE.Vector2(
      clamp(centerX / bounds.width, 0, 1),
      clamp(1 - centerY / bounds.height, 0, 1),
    );
    const horizonRadiusPixels = anchorBounds.width * 0.25;
    const normalizedRadius = horizonRadiusPixels / bounds.height;

    this.holePosition.set(
      (normalizedCenter.x - 0.5) * this.worldWidth,
      (normalizedCenter.y - 0.5) * this.worldHeight,
      0,
    );
    this.holeRadius = normalizedRadius * this.worldHeight;
    this.influenceRadius = Math.max(this.holeRadius * 6.2, this.worldHeight * 0.46);
    const interactionRadiusPixels = nextTier === "mobile" ? 130 : nextTier === "tablet" ? 150 : 170;
    this.pointerRadius = (interactionRadiusPixels / bounds.height) * this.worldHeight;
    this.canvas.dataset.pointerRadius = String(interactionRadiusPixels);

    [this.lensingMaterial, this.blackHoleMaterial].forEach((material) => {
      material.uniforms.uAspect.value = this.camera.aspect;
      material.uniforms.uHoleRadius.value = normalizedRadius;
      material.uniforms.uHoleCenter.value.copy(normalizedCenter);
    });

    if (nextTier !== this.tier) {
      this.tier = nextTier;
      if (this.fields.length) this.rebuildPopulation();
    }
    this.render();
  }

  private populationForTier() {
    if (this.tier === "mobile") return { asteroids: 10, micro: 26, foreground: 0, dust: 24, words: 4 };
    if (this.tier === "tablet") return { asteroids: 20, micro: 52, foreground: 1, dust: 34, words: 6 };
    return { asteroids: 30, micro: 88, foreground: 1, dust: 38, words: 8 };
  }

  private clearPopulation() {
    this.fields.forEach(({ mesh }) => this.scene.remove(mesh));
    this.fields.length = 0;
    this.words.forEach(({ sprite }) => {
      this.scene.remove(sprite);
      (sprite.material as THREE.SpriteMaterial).dispose();
    });
    this.words.length = 0;
    if (this.dustPoints) this.scene.remove(this.dustPoints);
    this.dustPoints = null;
    this.dustGeometry?.dispose();
    this.dustGeometry = null;
    this.dustPositions = null;
    this.dust.length = 0;
  }

  private rebuildPopulation() {
    this.clearPopulation();
    const population = this.populationForTier();
    const kinds: GravityBody["kind"][] = [
      ...Array.from({ length: population.asteroids }, () => "main" as const),
      ...Array.from({ length: population.micro }, () => "micro" as const),
      ...Array.from({ length: population.foreground }, () => "foreground" as const),
    ];

    this.geometries.forEach((geometry, variant) => {
      const variantKinds = kinds.filter((_, index) => index % this.geometries.length === variant);
      if (!variantKinds.length) return;
      const mesh = new THREE.InstancedMesh(geometry, this.asteroidMaterial, variantKinds.length);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.renderOrder = 2;
      const bodies = variantKinds.map((kind, index) => {
        const body = this.createBody(kind, true);
        const palette = kind === "foreground"
          ? [0.43, 0.48, 0.53]
          : kind === "micro"
            ? [0.34, 0.41, 0.48, 0.55]
            : [0.38, 0.47, 0.55, 0.63, 0.71];
        const baseTone = palette[(variant + index * 3) % palette.length];
        const depthLift = clamp((body.position.z + 1.35) * 0.024, -0.025, 0.055);
        const tone = clamp(baseTone + depthLift, 0.32, 0.74);
        mesh.setColorAt(index, new THREE.Color(tone, tone * 0.985, tone * 0.95));
        return body;
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.fields.push({ mesh, bodies });
      this.scene.add(mesh);
    });

    this.createDust(population.dust);
    this.createWords(population.words);
    this.canvas.dataset.gravityTier = this.tier;
    this.canvas.dataset.asteroidCount = String(population.asteroids + population.foreground);
    this.canvas.dataset.microFragmentCount = String(population.micro);
    this.canvas.dataset.dustCount = String(population.dust);
    this.canvas.dataset.wordCount = String(population.words);
    this.updateScene(0);
  }

  private createBody(kind: GravityBody["kind"], firstPass: boolean): GravityBody {
    const body = {
      kind,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      streamY: 0,
      rotation: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(this.random() * Math.PI, this.random() * Math.PI, this.random() * Math.PI),
      ),
      angularAxis: new THREE.Vector3(
        this.random() * 2 - 1,
        this.random() * 2 - 1,
        this.random() * 2 - 1,
      ).normalize(),
      angularSpeed: (0.18 + this.random() * 0.65) * (this.random() > 0.5 ? 1 : -1),
      scale: new THREE.Vector3(),
      baseSpeed: 0,
      depth: 0,
      seed: this.random() * Math.PI * 2,
    };
    this.resetBody(body, firstPass);
    return body;
  }

  private resetBody(body: GravityBody, firstPass = false) {
    const foreground = body.kind === "foreground";
    const micro = body.kind === "micro";
    const left = -this.worldWidth * 0.56;
    const streamEnd = this.holePosition.x - this.holeRadius * (foreground ? 3.1 : micro ? 1.9 : 2.45);
    body.position.x = firstPass
      ? left + Math.pow(this.random(), 0.54) * Math.max(0.1, streamEnd - left)
      : left - this.worldWidth * (0.03 + this.random() * 0.12);
    body.position.y = (this.random() - 0.5) * this.worldHeight * (foreground ? 0.54 : micro ? 0.88 : 0.76);
    body.streamY = body.position.y;
    body.position.z = foreground ? 1.65 + this.random() * 0.45 : -1.25 + this.random() * 2.35;
    body.depth = body.position.z;
    body.baseSpeed = (foreground ? 0.9 : micro ? 0.82 : 0.54)
      + this.random() * (foreground ? 0.22 : micro ? 0.64 : 0.42);
    body.velocity.set(body.baseSpeed, (this.random() - 0.5) * 0.025, 0);

    const sizeRoll = this.random();
    const baseSize = foreground
      ? 0.095 + this.random() * 0.035
      : micro
        ? 0.007 + Math.pow(this.random(), 1.8) * 0.012
        : sizeRoll < 0.66
          ? 0.043 + this.random() * 0.019
          : sizeRoll < 0.94
            ? 0.07 + this.random() * 0.027
            : 0.105 + this.random() * 0.025;
    body.scale.set(
      baseSize * (0.82 + this.random() * 0.36),
      baseSize * (0.78 + this.random() * 0.42),
      baseSize * (0.8 + this.random() * 0.38),
    );
  }

  private createDust(count: number) {
    this.dustGeometry = new THREE.BufferGeometry();
    this.dustPositions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const body: DustBody = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        streamY: 0,
        baseSpeed: 0.86 + this.random() * 0.78,
        seed: this.random() * Math.PI * 2,
      };
      this.resetDust(body, true);
      this.dust.push(body);
      body.position.toArray(this.dustPositions, index * 3);
    }
    this.dustGeometry.setAttribute("position", new THREE.BufferAttribute(this.dustPositions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x343330,
      size: this.tier === "mobile" ? 0.017 : 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    this.dustPoints = new THREE.Points(this.dustGeometry, material);
    this.dustPoints.frustumCulled = false;
    this.dustPoints.renderOrder = 1;
    this.scene.add(this.dustPoints);
  }

  private resetDust(body: DustBody, firstPass = false) {
    const left = -this.worldWidth * 0.55;
    const right = this.holePosition.x - this.holeRadius * 1.35;
    body.position.set(
      firstPass ? left + this.random() * Math.max(0.1, right - left) : left - this.random() * 0.5,
      (this.random() - 0.5) * this.worldHeight * 0.9,
      -1.6 + this.random() * 3.1,
    );
    body.streamY = body.position.y;
    body.velocity.set(body.baseSpeed, (this.random() - 0.5) * 0.035, 0);
  }

  private createLabelTexture(index: number) {
    const cached = this.labelTextures.get(index);
    if (cached) return cached;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    let context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create vocabulary texture");
    context.font = '500 28px "Geist Mono", "Courier New", monospace';
    canvas.width = Math.ceil(context.measureText(vocabulary[index]).width + 32);
    context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to resize vocabulary texture");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(10,10,9,.92)";
    context.font = '500 28px "Geist Mono", "Courier New", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(vocabulary[index], canvas.width * 0.5, canvas.height * 0.5);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.userData.aspect = canvas.width / canvas.height;
    this.labelTextures.set(index, texture);
    return texture;
  }

  private createWords(count: number) {
    for (let index = 0; index < count; index += 1) {
      const labelIndex = Math.floor(this.random() * vocabulary.length);
      const material = new THREE.SpriteMaterial({
        map: this.createLabelTexture(labelIndex),
        color: 0xffffff,
        transparent: true,
        opacity: 0.58,
        depthTest: false,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.renderOrder = 5;
      const body: VocabularyBody = {
        ...this.createBody("main", true),
        sprite,
        labelIndex,
        baseWidth: 0.55,
        baseHeight: 0.16,
      };
      body.angularSpeed *= 0.14;
      this.resetWord(body, true);
      this.words.push(body);
      this.scene.add(sprite);
    }
  }

  private resetWord(body: VocabularyBody, firstPass = false) {
    const previousLabel = body.labelIndex;
    let labelIndex = Math.floor(this.random() * vocabulary.length);
    if (labelIndex === previousLabel) labelIndex = (labelIndex + 7) % vocabulary.length;
    body.labelIndex = labelIndex;
    (body.sprite.material as THREE.SpriteMaterial).map = this.createLabelTexture(labelIndex);
    (body.sprite.material as THREE.SpriteMaterial).needsUpdate = true;

    // Keep semantic labels inside the visual half of the hero. The solid debris
    // and dust establish the left-to-right stream; words enter later so they
    // never compete with the portfolio copy on wide screens.
    const left = this.tier === "mobile" ? -this.worldWidth * 0.16 : this.worldWidth * 0.015;
    const right = this.holePosition.x - this.holeRadius * 2.15;
    const lane = Math.floor((body.seed / (Math.PI * 2)) * 7) % 7;
    const laneY = -this.worldHeight * 0.32 + lane * (this.worldHeight * 0.64 / 6);
    body.position.set(
      firstPass ? left + this.random() * Math.max(0.1, right - left) : left - 0.45 - this.random() * 0.55,
      laneY + (this.random() - 0.5) * this.worldHeight * 0.035,
      -0.85 + this.random() * 1.55,
    );
    body.depth = body.position.z;
    body.streamY = body.position.y;
    body.baseSpeed = 0.15 + this.random() * 0.16;
    body.velocity.set(body.baseSpeed, (this.random() - 0.5) * 0.018, 0);
    const tierScale = this.tier === "mobile" ? 0.72 : this.tier === "tablet" ? 0.86 : 1;
    body.baseHeight = 0.18 * tierScale;
    body.baseWidth = body.baseHeight * Number(this.createLabelTexture(labelIndex).userData.aspect);
    body.sprite.material.rotation = (this.random() - 0.5) * 0.08;
  }

  private applyGravity(body: GravityBody | DustBody, delta: number, swirlMultiplier = 1) {
    this.toHole.copy(this.holePosition).sub(body.position);
    this.toHole.z = 0;
    const distance = Math.max(this.holeRadius * 0.72, this.toHole.length());
    const field = 1 - smoothstep(this.holeRadius * 1.2, this.influenceRadius, distance);
    const softenedDistance = distance * distance + this.holeRadius * this.holeRadius * 0.38;
    const gravity = (this.holeRadius * this.holeRadius * 4.8 * field * field) / softenedDistance;
    this.toHole.multiplyScalar(1 / distance);
    body.velocity.x += this.toHole.x * gravity * delta;
    body.velocity.y += this.toHole.y * gravity * delta;

    const orbitDirection = body.position.y >= this.holePosition.y ? -1 : 1;
    const tangential = gravity * field * 0.92 * swirlMultiplier;
    body.velocity.x += -this.toHole.y * tangential * orbitDirection * delta;
    body.velocity.y += this.toHole.x * tangential * orbitDirection * delta;

    const recovery = Math.pow(1 - field, 2);
    body.velocity.y += (body.streamY - body.position.y) * 0.82 * recovery * delta;
    body.velocity.y *= Math.exp(-0.52 * recovery * delta);
    body.velocity.x += (body.baseSpeed - body.velocity.x) * recovery * delta;
    body.velocity.y += Math.sin(this.elapsed * 0.16 + body.seed) * 0.004 * (1 - field) * delta;

    const maximumSpeed = 3.0 + field * 3.7;
    const speed = body.velocity.length();
    if (speed > maximumSpeed) body.velocity.multiplyScalar(maximumSpeed / speed);
    return { distance, field };
  }

  private applyPointerDisturbance(body: GravityBody | DustBody, delta: number, response: number) {
    if (!this.pointerActive) return false;
    this.fromPointer.copy(body.position).sub(this.pointerWorld);
    this.fromPointer.z = 0;
    const distance = this.fromPointer.length();
    if (distance >= this.pointerRadius) return false;

    const falloff = 1 - smoothstep(0, this.pointerRadius, distance);
    const directionScale = 1 / Math.max(distance, this.pointerRadius * 0.08);
    this.fromPointer.multiplyScalar(directionScale);
    body.velocity.addScaledVector(this.fromPointer, 1.48 * response * falloff * falloff * delta);
    this.disturbedBodies += 1;
    return true;
  }

  private updateAsteroids(delta: number) {
    this.fields.forEach((field) => {
      field.bodies.forEach((body, index) => {
        const foreground = body.kind === "foreground";
        const micro = body.kind === "micro";
        const gravityState = this.applyGravity(body, delta, foreground ? 0.34 : micro ? 0.82 : 1);
        this.applyPointerDisturbance(body, delta, foreground ? 0.18 : micro ? 1.18 : 0.64);
        body.position.addScaledVector(body.velocity, delta);
        this.quaternionStep.setFromAxisAngle(body.angularAxis, body.angularSpeed * delta);
        body.rotation.multiply(this.quaternionStep).normalize();

        if (
          gravityState.distance < this.holeRadius * (foreground ? 2.85 : micro ? 1.28 : 1.58) ||
          body.position.x > this.worldWidth * 0.64 ||
          Math.abs(body.position.y) > this.worldHeight * 0.78
        ) {
          this.resetBody(body);
        }

        this.displayPosition.copy(body.position);
        const depthFactor = clamp((body.depth + 1.4) / 3.8, 0, 1);
        this.displayPosition.x += this.pointer.x * (0.012 + depthFactor * 0.055) * this.worldWidth;
        this.displayPosition.y += this.pointer.y * (0.01 + depthFactor * 0.045) * this.worldHeight;

        if (body.depth < 0 && gravityState.field > 0.15) {
          const lensShift = this.holeRadius * 0.18 * gravityState.field * gravityState.field;
          this.displayPosition.y += Math.sign(body.position.y - this.holePosition.y || 1) * lensShift;
        }

        const captureFade = foreground
          ? smoothstep(this.holeRadius * 2.85, this.holeRadius * 3.55, gravityState.distance)
          : micro
            ? smoothstep(this.holeRadius * 1.28, this.holeRadius * 1.82, gravityState.distance)
            : smoothstep(this.holeRadius * 1.58, this.holeRadius * 2.55, gravityState.distance);
        const visualOnlyLayout = this.tier === "mobile";
        const visibilityStart = foreground
          ? -this.worldWidth * 0.05
          : visualOnlyLayout
            ? -this.worldWidth * 0.16
            : -this.worldWidth * 0.27;
        const visibilityEnd = foreground
          ? this.worldWidth * 0.18
          : visualOnlyLayout
            ? this.worldWidth * 0.04
            : -this.worldWidth * 0.08;
        const entryScale = foreground
          ? 0.015 + smoothstep(visibilityStart, visibilityEnd, body.position.x) * 0.985
          : 0.055 + smoothstep(visibilityStart, visibilityEnd, body.position.x) * 0.945;
        this.dummy.position.copy(this.displayPosition);
        this.dummy.quaternion.copy(body.rotation);
        this.dummy.scale
          .copy(body.scale)
          .multiplyScalar((0.76 + captureFade * 0.24) * entryScale);
        this.dummy.updateMatrix();
        field.mesh.setMatrixAt(index, this.dummy.matrix);
      });
      field.mesh.instanceMatrix.needsUpdate = true;
    });
  }

  private updateDust(delta: number) {
    if (!this.dustPositions || !this.dustGeometry) return;
    this.dust.forEach((body, index) => {
      const { distance } = this.applyGravity(body, delta, 0.62);
      this.applyPointerDisturbance(body, delta, 1.16);
      body.position.addScaledVector(body.velocity, delta);
      if (
        distance < this.holeRadius * 1.02 ||
        body.position.x > this.worldWidth * 0.62 ||
        Math.abs(body.position.y) > this.worldHeight * 0.72
      ) {
        this.resetDust(body);
      }
      body.position.toArray(this.dustPositions!, index * 3);
    });
    const position = this.dustGeometry.getAttribute("position") as THREE.BufferAttribute;
    position.needsUpdate = true;
  }

  private updateWords(delta: number) {
    this.words.forEach((body) => {
      const gravityState = this.applyGravity(body, delta, 0.86);
      body.position.addScaledVector(body.velocity, delta);
      if (
        gravityState.distance < this.holeRadius * 1.03 ||
        body.position.x > this.worldWidth * 0.62 ||
        Math.abs(body.position.y) > this.worldHeight * 0.72
      ) {
        this.resetWord(body);
        return;
      }

      const absorb = 1 - smoothstep(this.holeRadius * 1.08, this.holeRadius * 2.45, gravityState.distance);
      const depthAlpha = clamp(0.32 + (body.depth + 0.85) * 0.24, 0.28, 0.7);
      const fade = 1 - Math.pow(absorb, 1.7);
      const material = body.sprite.material as THREE.SpriteMaterial;
      material.opacity = depthAlpha * fade;
      material.rotation += body.angularSpeed * delta * (1 + absorb * 3.4);
      body.sprite.position.copy(body.position);
      body.sprite.position.x += this.pointer.x * 0.018 * this.worldWidth;
      body.sprite.position.y += this.pointer.y * 0.014 * this.worldHeight;
      body.sprite.scale.set(
        body.baseWidth * (1 + absorb * 1.38),
        body.baseHeight * (1 - absorb * 0.32),
        1,
      );
    });
  }

  private updateScene(delta: number) {
    const motionDelta = delta * (this.reducedMotion ? 0.09 : 1);
    this.elapsed += motionDelta;
    this.pointer.lerp(this.pointerTarget, 1 - Math.exp(-delta * 2.4));
    this.disturbedBodies = 0;
    this.updateAsteroids(motionDelta);
    this.updateDust(motionDelta);
    this.updateWords(motionDelta);
    this.canvas.dataset.disturbedCount = String(this.disturbedBodies);
    this.lensingMaterial.uniforms.uTime.value = this.elapsed;
    this.blackHoleMaterial.uniforms.uTime.value = this.elapsed;
  }

  private render = () => {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  };

  private animate = (timestamp: number) => {
    this.animationFrame = 0;
    if (!this.active || document.hidden || this.disposed) return;
    if (this.reducedMotion && timestamp - this.lastReducedFrame < 1000 / 12) {
      this.animationFrame = window.requestAnimationFrame(this.animate);
      return;
    }
    this.lastReducedFrame = timestamp;
    const delta = this.lastTimestamp
      ? Math.min((timestamp - this.lastTimestamp) / 1000, 1 / 24)
      : 1 / 60;
    this.lastTimestamp = timestamp;
    this.updateScene(delta);
    this.render();
    this.animationFrame = window.requestAnimationFrame(this.animate);
  };

  start() {
    if (this.animationFrame || !this.active || document.hidden || this.disposed) return;
    this.lastTimestamp = 0;
    this.animationFrame = window.requestAnimationFrame(this.animate);
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.lastTimestamp = 0;
  }

  setActive(active: boolean) {
    this.active = active;
    this.canvas.dataset.sceneActive = String(active);
    if (active) this.start();
    else this.stop();
  }

  setPointer(clientX: number, clientY: number) {
    const bounds = this.stage.getBoundingClientRect();
    const normalizedX = clamp((clientX - bounds.left) / bounds.width, 0, 1);
    const normalizedY = clamp((clientY - bounds.top) / bounds.height, 0, 1);
    this.pointerTarget.set(normalizedX - 0.5, 0.5 - normalizedY);
    this.pointerWorld.set(
      (normalizedX - 0.5) * this.worldWidth,
      (0.5 - normalizedY) * this.worldHeight,
      0,
    );
    this.pointerActive = true;
    this.canvas.dataset.pointerActive = "true";
  }

  clearPointer() {
    this.pointerTarget.set(0, 0);
    this.pointerActive = false;
    this.canvas.dataset.pointerActive = "false";
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.clearPopulation();
    this.geometries.forEach((geometry) => geometry.dispose());
    this.asteroidMaterial.dispose();
    this.screenGeometry.dispose();
    this.lensingMaterial.dispose();
    this.blackHoleMaterial.dispose();
    this.labelTextures.forEach((texture) => texture.dispose());
    this.labelTextures.clear();
    this.renderer.dispose();
  }
}

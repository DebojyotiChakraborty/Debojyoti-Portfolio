"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { getSoundManager } from "./SoundManager";

interface Indent {
    position: THREE.Vector3;
    strength: number;
    createdAt: number;
}

// Simplified vertex shader for grass
const grassVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform vec3 uIndentPositions[20];
  uniform float uIndentStrengths[20];
  
  varying float vHeight;
  varying vec3 vWorldPos;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  void main() {
    vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
    float heightFactor = position.y;
    vHeight = heightFactor;
    vec3 pos = position;
    
    float windNoise = noise(instancePos.xz * 0.3 + uTime * 0.5);
    float windStrength = windNoise * 0.5 + 0.5;
    float bendAmount = heightFactor * heightFactor * windStrength * 0.4;
    pos.x += sin(uTime * 2.0 + instancePos.x * 0.5) * bendAmount;
    pos.z += cos(uTime * 1.5 + instancePos.z * 0.5) * bendAmount * 0.5;
    
    vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    
    vec2 grassPos2D = worldPos.xz;
    float distToMouse = distance(grassPos2D, uMouse);
    float mouseInfluence = 1.0 - smoothstep(0.0, uMouseRadius, distToMouse);
    
    if (mouseInfluence > 0.0 && distToMouse > 0.01) {
      vec2 pushDir = normalize(grassPos2D - uMouse);
      float pushStrength = mouseInfluence * heightFactor * 1.2;
      worldPos.x += pushDir.x * pushStrength;
      worldPos.z += pushDir.y * pushStrength;
      worldPos.y -= mouseInfluence * heightFactor * 0.2;
    }
    
    for (int i = 0; i < 20; i++) {
      if (uIndentStrengths[i] > 0.01) {
        vec2 indentPos = uIndentPositions[i].xz;
        float distToIndent = distance(grassPos2D, indentPos);
        float indentRadius = 1.0;
        float indentInfluence = (1.0 - smoothstep(0.0, indentRadius, distToIndent)) * uIndentStrengths[i];
        if (indentInfluence > 0.0 && distToIndent > 0.01) {
          vec2 pushDir = normalize(grassPos2D - indentPos);
          worldPos.x += pushDir.x * indentInfluence * heightFactor * 1.2;
          worldPos.z += pushDir.y * indentInfluence * heightFactor * 1.2;
          worldPos.y -= indentInfluence * heightFactor * 0.5;
        }
      }
    }
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const grassFragmentShader = `
  uniform vec3 uColorBase;
  uniform vec3 uColorTip;
  
  varying float vHeight;
  varying vec3 vWorldPos;
  
  void main() {
    vec3 color = mix(uColorBase, uColorTip, vHeight);
    float variation = sin(vWorldPos.x * 5.0 + vWorldPos.z * 5.0) * 0.03;
    color += variation;
    float light = 0.7 + vHeight * 0.3;
    color *= light;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function GrassField() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const cloudsRef = useRef<THREE.Group[]>([]);
    const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(1000, 1000));
    const indentsRef = useRef<Indent[]>([]);
    const rafRef = useRef<number>(0);
    const soundManager = getSoundManager();
    const lastMousePosRef = useRef<THREE.Vector2>(new THREE.Vector2());
    const isDraggingRef = useRef(false);
    const lastDragPosRef = useRef<THREE.Vector3 | null>(null);

    // Detect mobile/tablet for performance optimization
    const isMobile = useRef(false);
    useEffect(() => {
        isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    }, []);

    // Create grass blade geometry
    const createGrassField = useCallback(() => {
        const bladeHeight = 0.6;
        const bladeWidth = 0.06;
        const positions: number[] = [];
        const segments = 4;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = t * bladeHeight;
            const width = bladeWidth * (1 - t * 0.9);
            positions.push(-width, y, 0);
            positions.push(width, y, 0);
        }

        const indices: number[] = [];
        for (let i = 0; i < segments; i++) {
            const base = i * 2;
            indices.push(base, base + 1, base + 2);
            indices.push(base + 1, base + 3, base + 2);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.ShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(1000, 1000) },
                uMouseRadius: { value: 2.0 },
                uIndentPositions: { value: Array(20).fill(null).map(() => new THREE.Vector3(1000, 0, 1000)) },
                uIndentStrengths: { value: Array(20).fill(0) },
                uColorBase: { value: new THREE.Color(0x1a5c1a) },
                uColorTip: { value: new THREE.Color(0x7cb342) },
            },
            side: THREE.DoubleSide,
        });

        materialRef.current = material;

        // Reduce grass count on mobile for better performance
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
        const grassCount = isMobileDevice ? 12000 : 25000;
        const fieldSize = 30;
        const mesh = new THREE.InstancedMesh(geometry, material, grassCount);
        const dummy = new THREE.Object3D();

        for (let i = 0; i < grassCount; i++) {
            const x = (Math.random() - 0.5) * fieldSize;
            const z = (Math.random() - 0.5) * fieldSize;
            dummy.position.set(x, 0, z);
            dummy.rotation.y = Math.random() * Math.PI * 2;
            const scaleXZ = 0.8 + Math.random() * 0.5;
            const scaleY = 0.6 + Math.random() * 0.8;
            dummy.scale.set(scaleXZ, scaleY, scaleXZ);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
        return mesh;
    }, []);

    // Create bush geometry - branches with leaves at tips
    const createBush = useCallback((color: THREE.Color) => {
        const bushGroup = new THREE.Group();

        // Branch material (brown)
        const branchMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3728 });

        // Create a single oval leaf shape
        const createLeaf = () => {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.quadraticCurveTo(0.025, 0.05, 0, 0.1);
            shape.quadraticCurveTo(-0.025, 0.05, 0, 0);
            const geometry = new THREE.ShapeGeometry(shape);
            return geometry;
        };

        // Create a branch with leaves
        const createBranch = (length: number, thickness: number, leafCount: number, leafColor: THREE.Color) => {
            const branchGroup = new THREE.Group();

            // Main branch cylinder
            const branchGeom = new THREE.CylinderGeometry(thickness * 0.5, thickness, length, 4);
            const branch = new THREE.Mesh(branchGeom, branchMaterial);
            branch.position.y = length / 2;
            branchGroup.add(branch);

            // Add leaves along upper part of branch
            for (let i = 0; i < leafCount; i++) {
                const leafMat = new THREE.MeshLambertMaterial({
                    color: leafColor.clone().offsetHSL(0, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
                    side: THREE.DoubleSide
                });
                const leafGeom = createLeaf();
                const leaf = new THREE.Mesh(leafGeom, leafMat);

                const t = 0.5 + (i / leafCount) * 0.5;
                const posY = length * t;
                const ang = (i / leafCount) * Math.PI * 3 + Math.random();
                const spread = 0.015 + Math.random() * 0.02;

                leaf.position.set(Math.cos(ang) * spread, posY, Math.sin(ang) * spread);
                leaf.rotation.set(Math.random() * 0.4 - 0.2, ang, Math.random() * 0.3);
                leaf.scale.setScalar(0.7 + Math.random() * 0.5);
                branchGroup.add(leaf);
            }

            return branchGroup;
        };

        const baseHsl = { h: 0, s: 0, l: 0 };
        color.getHSL(baseHsl);

        // Outer branches (tilted outward)
        for (let i = 0; i < 18; i++) {
            const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.2;
            const tilt = 0.4 + Math.random() * 0.4;
            const len = 0.2 + Math.random() * 0.15;
            const thick = 0.006 + Math.random() * 0.004;
            const leafCol = new THREE.Color().setHSL(baseHsl.h, baseHsl.s, baseHsl.l);

            const br = createBranch(len, thick, 5 + Math.floor(Math.random() * 3), leafCol);
            br.rotation.x = tilt;
            br.rotation.y = angle;
            bushGroup.add(br);
        }

        // Inner branches (more upright)
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const tilt = Math.random() * 0.25;
            const len = 0.25 + Math.random() * 0.1;
            const thick = 0.005 + Math.random() * 0.003;
            const leafCol = new THREE.Color().setHSL(baseHsl.h, baseHsl.s, baseHsl.l - 0.05);

            const br = createBranch(len, thick, 4 + Math.floor(Math.random() * 3), leafCol);
            br.rotation.x = tilt;
            br.rotation.y = angle;
            bushGroup.add(br);
        }

        return bushGroup;
    }, []);

    // Create flower geometry
    const createFlower = useCallback((petalColor: THREE.Color) => {
        const group = new THREE.Group();

        // Taller stem to be visible above grass
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.7, 4);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5a27 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.35;
        group.add(stem);

        const petalGeometry = new THREE.CircleGeometry(0.1, 5);
        const petalMaterial = new THREE.MeshLambertMaterial({ color: petalColor, side: THREE.DoubleSide });

        for (let i = 0; i < 5; i++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            const angle = (i / 5) * Math.PI * 2;
            petal.position.set(Math.cos(angle) * 0.07, 0.72, Math.sin(angle) * 0.07);
            petal.rotation.x = Math.PI / 2 - 0.3;
            petal.rotation.z = angle;
            group.add(petal);
        }

        const centerGeometry = new THREE.SphereGeometry(0.05, 6, 6);
        const centerMaterial = new THREE.MeshLambertMaterial({ color: 0xffeb3b });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.72;
        group.add(center);

        return group;
    }, []);

    // Create rock geometry
    const createRock = useCallback((size: number) => {
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const noise = 0.8 + Math.random() * 0.4;
            positions.setXYZ(i, x * noise, y * noise * 0.7, z * noise);
        }
        geometry.computeVertexNormals();

        const grayValue = 0.3 + Math.random() * 0.3;
        const material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(grayValue, grayValue * 0.95, grayValue * 0.9),
            flatShading: true
        });
        return new THREE.Mesh(geometry, material);
    }, []);

    // Create the sun
    const createSun = useCallback(() => {
        const sunGroup = new THREE.Group();

        // Sun core
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd44,
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sunGroup.add(sun);

        // Sun glow (larger transparent sphere)
        const glowGeometry = new THREE.SphereGeometry(4.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffeeaa,
            transparent: true,
            opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sunGroup.add(glow);

        // Outer glow
        const outerGlowGeometry = new THREE.SphereGeometry(6, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.15,
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        sunGroup.add(outerGlow);

        return sunGroup;
    }, []);

    // Create a single fluffy cloud using spheres
    const createCloud = useCallback((scale: number) => {
        const cloudGroup = new THREE.Group();
        const cloudMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95,
        });

        const spherePositions = [
            { x: 0, y: 0, z: 0, r: 1.0 },
            { x: 1.2, y: 0.2, z: 0, r: 0.8 },
            { x: -1.0, y: 0.1, z: 0.2, r: 0.9 },
            { x: 0.5, y: 0.5, z: 0, r: 0.7 },
            { x: -0.5, y: 0.4, z: -0.1, r: 0.75 },
            { x: 1.8, y: 0, z: 0.1, r: 0.6 },
            { x: -1.6, y: -0.1, z: 0, r: 0.65 },
        ];

        spherePositions.forEach(pos => {
            const geometry = new THREE.SphereGeometry(pos.r * scale, 8, 6);
            const sphere = new THREE.Mesh(geometry, cloudMaterial);
            sphere.position.set(pos.x * scale, pos.y * scale, pos.z * scale);
            cloudGroup.add(sphere);
        });

        return cloudGroup;
    }, []);

    // Initialize scene
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0x87ceeb, 30, 100);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
        camera.position.set(0, 3, 12);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x3d7a3d, flatShading: true });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.05;
        scene.add(ground);

        // Create rolling hills on the horizon
        const createHill = (width: number, height: number, depth: number) => {
            const hillGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            hillGeometry.scale(width, height, depth);
            const hillMaterial = new THREE.MeshLambertMaterial({
                color: 0x2d6a2d,
                flatShading: false
            });
            return new THREE.Mesh(hillGeometry, hillMaterial);
        };

        // Back row of hills (further, taller, more blue-green from fog)
        const hillConfigs = [
            { x: -35, z: -50, w: 25, h: 8, d: 15 },
            { x: 0, z: -55, w: 30, h: 10, d: 18 },
            { x: 40, z: -48, w: 22, h: 7, d: 14 },
            { x: -60, z: -45, w: 20, h: 6, d: 12 },
            { x: 65, z: -52, w: 25, h: 9, d: 16 },
            // Mid row
            { x: -20, z: -35, w: 18, h: 5, d: 10 },
            { x: 25, z: -38, w: 20, h: 6, d: 12 },
            { x: -50, z: -32, w: 15, h: 4, d: 8 },
            { x: 55, z: -35, w: 18, h: 5, d: 10 },
        ];

        hillConfigs.forEach(cfg => {
            const hill = createHill(cfg.w, cfg.h, cfg.d);
            hill.position.set(cfg.x, -0.5, cfg.z);
            scene.add(hill);
        });

        const grassField = createGrassField();
        scene.add(grassField);

        const bushColors = [0x2d5a27, 0x3d6b37, 0x4a7c4a, 0x1e4d1e];
        for (let i = 0; i < 40; i++) {
            const bush = createBush(new THREE.Color(bushColors[Math.floor(Math.random() * bushColors.length)]));
            bush.position.set((Math.random() - 0.5) * 28, 0, (Math.random() - 0.5) * 28);
            bush.scale.setScalar(1.5 + Math.random() * 2.5); // Much bigger bushes
            bush.rotation.y = Math.random() * Math.PI * 2;
            scene.add(bush);
        }

        const flowerColors = [0xff4444, 0xffffff, 0xffdd44, 0xff88aa, 0xaaddff];
        for (let i = 0; i < 80; i++) {
            const flower = createFlower(new THREE.Color(flowerColors[Math.floor(Math.random() * flowerColors.length)]));
            flower.position.set((Math.random() - 0.5) * 26, 0, (Math.random() - 0.5) * 26);
            flower.scale.setScalar(0.5 + Math.random() * 0.5);
            flower.rotation.y = Math.random() * Math.PI * 2;
            scene.add(flower);
        }

        for (let i = 0; i < 25; i++) {
            const size = 0.1 + Math.random() * 0.3;
            const rock = createRock(size);
            rock.position.set((Math.random() - 0.5) * 28, size * 0.3, (Math.random() - 0.5) * 28);
            rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(rock);
        }

        for (let i = 0; i < 8; i++) {
            const size = 0.3 + Math.random() * 0.5;
            const rock = createRock(size);
            rock.position.set((Math.random() - 0.5) * 25, size * 0.4, (Math.random() - 0.5) * 25);
            rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(rock);
        }

        const clouds: THREE.Group[] = [];
        for (let i = 0; i < 12; i++) {
            const scale = 1.5 + Math.random() * 2;
            const cloud = createCloud(scale);
            cloud.position.set((Math.random() - 0.5) * 80, 12 + Math.random() * 8, -20 - Math.random() * 30);
            cloud.userData.speed = 0.3 + Math.random() * 0.4;
            scene.add(cloud);
            clouds.push(cloud);
        }
        cloudsRef.current = clouds;

        // Add sun to the sky
        const sun = createSun();
        sun.position.set(15, 18, -25);
        scene.add(sun);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        directionalLight.position.set(10, 30, 10);
        scene.add(directionalLight);

        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3d7a3d, 0.5);
        scene.add(hemiLight);

        const startTime = Date.now();

        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);
            const elapsedTime = (Date.now() - startTime) / 1000;

            if (materialRef.current) {
                materialRef.current.uniforms.uTime.value = elapsedTime;
                materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);

                const now = Date.now();
                const indentDuration = 3000;
                indentsRef.current = indentsRef.current.filter((indent) => now - indent.createdAt < indentDuration);

                while (indentsRef.current.length > 20) {
                    indentsRef.current.shift();
                }

                const positions = materialRef.current.uniforms.uIndentPositions.value;
                const strengths = materialRef.current.uniforms.uIndentStrengths.value;

                for (let i = 0; i < 20; i++) {
                    if (i < indentsRef.current.length) {
                        const indent = indentsRef.current[i];
                        const age = (now - indent.createdAt) / indentDuration;
                        positions[i].copy(indent.position);
                        strengths[i] = indent.strength * (1 - age);
                    } else {
                        strengths[i] = 0;
                    }
                }
            }

            clouds.forEach((cloud) => {
                cloud.position.x += cloud.userData.speed * 0.02;
                if (cloud.position.x > 50) {
                    cloud.position.x = -50;
                    cloud.position.z = -20 - Math.random() * 30;
                    cloud.position.y = 12 + Math.random() * 8;
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(rafRef.current);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [createGrassField, createBush, createFlower, createRock, createCloud, createSun]);

    const getWorldPosition = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !cameraRef.current) return null;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        const intersected = raycaster.ray.intersectPlane(groundPlane, intersection);

        // Return null if no intersection or if intersection is outside the grass field bounds
        if (!intersected) return null;
        const fieldRadius = 15; // Grass field is roughly 30x30, so 15 from center
        if (Math.abs(intersection.x) > fieldRadius || Math.abs(intersection.z) > fieldRadius) {
            return null;
        }
        // Also check if the intersection is too far behind camera (clicking on sky)
        if (intersection.z < -20) return null;

        return intersection;
    }, []);

    // Get world position from touch event
    const getTouchWorldPosition = useCallback((touch: React.Touch) => {
        if (!containerRef.current || !cameraRef.current) return null;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        const intersected = raycaster.ray.intersectPlane(groundPlane, intersection);

        // Return null if no intersection or if intersection is outside the grass field bounds
        if (!intersected) return null;
        const fieldRadius = 15;
        if (Math.abs(intersection.x) > fieldRadius || Math.abs(intersection.z) > fieldRadius) {
            return null;
        }
        if (intersection.z < -20) return null;

        return intersection;
    }, []);

    const addIndent = useCallback((position: THREE.Vector3, strength: number = 1.0) => {
        indentsRef.current.push({
            position: position.clone(),
            strength,
            createdAt: Date.now(),
        });
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const intersection = getWorldPosition(event);
        if (!intersection) return;

        const prevMouse = lastMousePosRef.current.clone();
        mouseRef.current.set(intersection.x, intersection.z);

        const mouseSpeed = mouseRef.current.distanceTo(prevMouse);
        lastMousePosRef.current.copy(mouseRef.current);

        if (mouseSpeed > 0.02) {
            soundManager.playRustle(Math.min(mouseSpeed * 2, 1));
        }

        if (isDraggingRef.current && lastDragPosRef.current) {
            const dist = intersection.distanceTo(lastDragPosRef.current);
            if (dist > 0.3) {
                addIndent(intersection, 0.8);
                lastDragPosRef.current = intersection.clone();
                soundManager.playRustle(0.5);
            }
        }
    }, [soundManager, getWorldPosition, addIndent]);

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        soundManager.initialize();
        isDraggingRef.current = true;

        const intersection = getWorldPosition(event);
        if (intersection) {
            lastDragPosRef.current = intersection.clone();
            addIndent(intersection, 1.0);
            soundManager.playIndent();
        }
    }, [soundManager, getWorldPosition, addIndent]);

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;
        lastDragPosRef.current = null;
    }, []);

    const handleMouseLeave = useCallback(() => {
        isDraggingRef.current = false;
        lastDragPosRef.current = null;
    }, []);

    // Touch event handlers for mobile
    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        soundManager.initialize();
        isDraggingRef.current = true;

        const touch = event.touches[0];
        const intersection = getTouchWorldPosition(touch);
        if (intersection) {
            lastDragPosRef.current = intersection.clone();
            mouseRef.current.set(intersection.x, intersection.z);
            lastMousePosRef.current.copy(mouseRef.current);
            addIndent(intersection, 1.0);
            soundManager.playIndent();
        }
    }, [soundManager, getTouchWorldPosition, addIndent]);

    const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        const touch = event.touches[0];
        const intersection = getTouchWorldPosition(touch);
        if (!intersection) return;

        const prevMouse = lastMousePosRef.current.clone();
        mouseRef.current.set(intersection.x, intersection.z);

        const moveSpeed = mouseRef.current.distanceTo(prevMouse);
        lastMousePosRef.current.copy(mouseRef.current);

        if (moveSpeed > 0.02) {
            soundManager.playRustle(Math.min(moveSpeed * 2, 1));
        }

        // Leave trail while dragging
        if (isDraggingRef.current && lastDragPosRef.current) {
            const dist = intersection.distanceTo(lastDragPosRef.current);
            if (dist > 0.25) {
                addIndent(intersection, 0.8);
                lastDragPosRef.current = intersection.clone();
            }
        }
    }, [soundManager, getTouchWorldPosition, addIndent]);

    const handleTouchEnd = useCallback(() => {
        isDraggingRef.current = false;
        lastDragPosRef.current = null;
        // Move mouse position off-screen so grass springs back
        mouseRef.current.set(1000, 1000);
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => soundManager.initialize()}
            onClick={() => soundManager.initialize()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: "none" }}
        />
    );
}

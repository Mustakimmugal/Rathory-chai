import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Chai3DCanvas() {
  const mountRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 520;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    currentMount.appendChild(renderer.domElement);

    // Root Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Luxury Architectural Marble / Stone Podium
    const podiumGeometry = new THREE.CylinderGeometry(1.65, 1.8, 0.35, 64);
    const podiumMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8ECF2,
      roughness: 0.25,
      metalness: 0.1,
    });
    const podium = new THREE.Mesh(podiumGeometry, podiumMaterial);
    podium.position.y = -0.95;
    podium.receiveShadow = true;
    mainGroup.add(podium);

    // Subtle Gold Inset Ring around podium base
    const ringGeo = new THREE.TorusGeometry(1.68, 0.02, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.78;
    mainGroup.add(ring);

    // 2. Modern 3D Cafe Cup
    const cupGroup = new THREE.Group();
    mainGroup.add(cupGroup);

    // Cup Body Lathe Geometry (Modern curved ceramic cup)
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.65, 0));
    points.push(new THREE.Vector2(0.68, 0.1));
    points.push(new THREE.Vector2(0.72, 0.4));
    points.push(new THREE.Vector2(0.82, 0.8));
    points.push(new THREE.Vector2(0.96, 1.3));
    points.push(new THREE.Vector2(1.02, 1.6));
    points.push(new THREE.Vector2(0.98, 1.62));
    points.push(new THREE.Vector2(0.92, 1.55));
    points.push(new THREE.Vector2(0.8, 1.0));
    points.push(new THREE.Vector2(0.68, 0.4));
    points.push(new THREE.Vector2(0.58, 0.15));
    points.push(new THREE.Vector2(0, 0.15));

    const cupGeometry = new THREE.LatheGeometry(points, 64);
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: 0x9A4822, // Rich terracotta / baked clay luxury finish
      roughness: 0.35,
      metalness: 0.15,
    });

    const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupMesh.position.y = -0.75;
    cupGroup.add(cupMesh);

    // Modern Gold Brand Emblem on the cup
    const emblemGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.35, 32, 1, true, 0, Math.PI * 0.4);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xFDE68A,
      roughness: 0.3,
      metalness: 0.9,
      side: THREE.DoubleSide,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.set(0, 0.05, 0);
    emblem.rotation.y = -Math.PI * 0.2;
    cupGroup.add(emblem);

    // Hot Spiced Chai / Coffee Liquid
    const liquidGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.05, 48);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xC88E5E, // Warm creamy froth
      roughness: 0.2,
      metalness: 0.15,
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.set(0, 0.76, 0);
    cupGroup.add(liquid);

    // Cardamom & Saffron specks on foam
    const spiceCount = 18;
    const saffronGeo = new THREE.BoxGeometry(0.06, 0.01, 0.015);
    const saffronMat = new THREE.MeshStandardMaterial({ color: 0xDC2626 });
    for (let i = 0; i < spiceCount; i++) {
      const sp = new THREE.Mesh(saffronGeo, saffronMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.65;
      sp.position.set(Math.cos(angle) * radius, 0.79, Math.sin(angle) * radius);
      sp.rotation.y = Math.random() * Math.PI;
      cupGroup.add(sp);
    }

    // 3. Floating Fresh Green Tea Leaves
    const leavesGroup = new THREE.Group();
    mainGroup.add(leavesGroup);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.2, 0.3, 0.05, 0.6);
    leafShape.quadraticCurveTo(0, 0.7, -0.05, 0.6);
    leafShape.quadraticCurveTo(-0.2, 0.3, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x22C55E, // Vibrant emerald fresh tea leaf
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const leaves = [];
    const leafConfigs = [
      { x: -1.4, y: 1.1, z: 0.6, rotX: 0.4, rotY: 0.5, speed: 1.2 },
      { x: 1.5, y: 0.8, z: 0.8, rotX: -0.3, rotY: 0.8, speed: 0.9 },
      { x: -1.1, y: 0.2, z: 1.2, rotX: 0.6, rotY: -0.4, speed: 1.1 },
      { x: 1.3, y: 1.6, z: -0.4, rotX: 0.2, rotY: 1.1, speed: 1.3 },
    ];

    leafConfigs.forEach((cfg) => {
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.position.set(cfg.x, cfg.y, cfg.z);
      leafMesh.rotation.set(cfg.rotX, cfg.rotY, 0);
      leafMesh.scale.set(1.2, 1.2, 1.2);
      leavesGroup.add(leafMesh);
      leaves.push({ mesh: leafMesh, ...cfg });
    });

    // 4. Floating Roasted Coffee Beans
    const beansGroup = new THREE.Group();
    mainGroup.add(beansGroup);

    const beanGeo = new THREE.SphereGeometry(0.12, 16, 16);
    beanGeo.scale(1, 1.4, 0.75);
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x3E1E0E, // Roasted Arabica bean
      roughness: 0.5,
      metalness: 0.1,
    });

    const beans = [];
    const beanConfigs = [
      { x: 1.4, y: -0.2, z: 0.9, rotSpeed: 0.015 },
      { x: -1.3, y: 1.5, z: 0.4, rotSpeed: -0.012 },
      { x: 1.1, y: 0.3, z: 1.3, rotSpeed: 0.018 },
    ];

    beanConfigs.forEach((cfg) => {
      const beanMesh = new THREE.Mesh(beanGeo, beanMat);
      beanMesh.position.set(cfg.x, cfg.y, cfg.z);
      beansGroup.add(beanMesh);
      beans.push({ mesh: beanMesh, ...cfg });
    });

    // 5. Rising Ethereal Steam Particles
    const steamParticleCount = 48;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamParticleCount * 3);
    const steamVelocities = [];

    for (let i = 0; i < steamParticleCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.5;
      steamPos[i * 3 + 1] = 0.8 + Math.random() * 1.6;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      steamVelocities.push({
        y: 0.007 + Math.random() * 0.009,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));

    // Dynamic radial canvas texture for smooth smoke puff
    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 64;
    steamCanvas.height = 64;
    const sCtx = steamCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.5, 'rgba(230, 240, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);

    const steamTex = new THREE.CanvasTexture(steamCanvas);
    const steamMat = new THREE.PointsMaterial({
      size: 0.48,
      map: steamTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });

    const steamParticles = new THREE.Points(steamGeo, steamMat);
    cupGroup.add(steamParticles);

    // 6. Studio Lighting - Apple / Modern Luxury Rig
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.4);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xFDFEFE, 2.2);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cyan / Purple Cool Rim Light
    const rimLight = new THREE.DirectionalLight(0x38BDF8, 2.4);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Warm Sunset Glow from below
    const warmBounce = new THREE.PointLight(0xF97316, 1.8, 6);
    warmBounce.position.set(0, -0.6, 2);
    scene.add(warmBounce);

    // Interaction Controls
    let targetRotationY = 0;
    let targetRotationX = 0.12;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        const rect = currentMount.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / height - 0.5) * 2;
        targetRotationY = normX * 0.45;
        targetRotationX = 0.12 + normY * 0.2;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth group rotation & gentle breathing float
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05 + 0.002;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
      mainGroup.position.y = Math.sin(elapsed * 1.6) * 0.05;

      // Floating Leaves undulating
      leaves.forEach((l, idx) => {
        l.mesh.position.y = l.y + Math.sin(elapsed * l.speed + idx) * 0.08;
        l.mesh.rotation.z = Math.sin(elapsed * 0.8 + idx) * 0.2;
      });

      // Floating Coffee Beans rotating
      beans.forEach((b) => {
        b.mesh.rotation.y += b.rotSpeed;
        b.mesh.rotation.x += b.rotSpeed * 0.5;
      });

      // Animate Steam particles upward
      const positions = steamGeo.attributes.position.array;
      for (let i = 0; i < steamParticleCount; i++) {
        const vel = steamVelocities[i];
        positions[i * 3 + 1] += vel.y;
        positions[i * 3] += Math.sin(elapsed * 2 + vel.swayOffset) * 0.003;

        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = 0.8;
          positions[i * 3] = (Math.random() - 0.5) * 0.4;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const nw = currentMount.clientWidth;
      const nh = currentMount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cupGeometry.dispose();
      cupMaterial.dispose();
      podiumGeometry.dispose();
      podiumMaterial.dispose();
      steamGeo.dispose();
      steamMat.dispose();
      steamTex.dispose();
    };
  }, []);

  return (
    <div
      className="modern-3d-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          touchAction: 'none',
        }}
      />
      <div
        className="glass-card"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          boxShadow: 'var(--shadow-md)',
          opacity: isHovered ? 1 : 0.8,
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ color: 'var(--color-primary)' }}>✦</span>
        <span>Interactive 3D Chai & Coffee Lounge • Drag to explore</span>
      </div>
    </div>
  );
}

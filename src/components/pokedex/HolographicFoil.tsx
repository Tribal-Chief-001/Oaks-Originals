"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface HolographicFoilProps {
  isHovered: boolean;
  mousePos: { x: number; y: number };
}

export const HolographicFoil: React.FC<HolographicFoilProps> = ({ isHovered, mousePos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Interpolation variables for smooth gliding shine
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetMouse.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 150;
    const height = containerRef.current.clientHeight || 150;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Shader Material for Iridescence
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHover;

      void main() {
        // Center UV coordinates
        vec2 p = vUv - vec2(0.5);
        float dist = length(p);

        // Holographic color spectrum mapping based on coordinates and cursor positions
        float speed = uTime * 0.8;
        float wave = sin(vUv.x * 6.0 + uMouse.x * 3.0 + speed) * 
                     cos(vUv.y * 6.0 + uMouse.y * 3.0 + speed);
                     
        // Iridescent color formula
        vec3 color1 = vec3(0.9, 0.4, 0.85); // Purple
        vec3 color2 = vec3(0.3, 0.75, 0.95); // Cyan
        vec3 color3 = vec3(0.95, 0.85, 0.3); // Yellow
        
        vec3 rainbow = color1 * sin(vUv.x * 2.0 + wave) + 
                       color2 * cos(vUv.y * 2.0 - wave) + 
                       color3 * sin(wave * 1.5);
        
        rainbow = clamp(rainbow, 0.0, 1.0);

        // Highlight shine follow-spot
        vec2 lightSource = uMouse * 0.5 + vec2(0.5);
        float shine = smoothstep(0.35, 0.0, length(vUv - lightSource));
        
        // Final blended foil color
        vec3 finalColor = mix(rainbow, vec3(1.0), shine * 0.5);

        // Dynamic opacity based on hover and center proximity
        float baseFoilOpacity = 0.12;
        float hoverFoilOpacity = 0.35;
        float targetOpacity = mix(baseFoilOpacity, hoverFoilOpacity, uHover);
        
        // Soft vignette mask around the edges
        float edgeMask = 1.0 - smoothstep(0.42, 0.52, dist);

        gl_FragColor = vec4(finalColor, targetOpacity * edgeMask);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uHover: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    materialRef.current = material;

    // Plane Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    const startTime = performance.now();
    let hoverState = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      
      // Smooth interpolation for mouse position (lerp)
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.1;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.1;

      // Smooth interpolation for hover opacity transition
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverState += (targetHover - hoverState) * 0.15;

      if (material) {
        material.uniforms.uTime.value = elapsed;
        material.uniforms.uMouse.value.set(currentMouse.current.x, currentMouse.current.y);
        material.uniforms.uHover.value = hoverState;
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup WebGL contexts
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // Element might have been removed already
        }
      }
    };
  }, [isHovered]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none rounded-lg z-10 mix-blend-color-dodge"
      style={{ opacity: isHovered ? 1.0 : 0.4, transition: "opacity 0.5s ease" }}
    />
  );
};

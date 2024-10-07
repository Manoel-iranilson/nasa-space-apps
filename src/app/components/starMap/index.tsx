/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { animated, useSpring } from "@react-spring/three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";
import PlanetModal from "../planetModal";
import { planets } from "@/app/constants/planets";

function SphereWithTexture({ position, texturePath, onClick }: any) {
  const texture = useLoader(THREE.TextureLoader, texturePath);

  // Adiciona rotação contínua
  const meshRef = useRef<THREE.Mesh | null>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[1, 32, 32]} /> {/* Ajustar raio se necessário */}
      <meshStandardMaterial
        map={Array.isArray(texture) ? texture[0] : texture}
      />
    </mesh>
  );
}

export default function StarMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);

  // Animação suave para a posição da câmera
  const { cameraPosition } = useSpring({
    cameraPosition: targetPosition,
    config: { mass: 1, tension: 170, friction: 26 }, // Ajuste da suavidade
  });

  // Texturas dos planetas
  const planetTextures = ["/terra.webp", "/planetaAzul.png", "/marte.png"];

  const openModal = (planet: any, position?: any) => {
    setTargetPosition(position);
    setTimeout(() => {
      setSelectedPlanet(planet);
      setIsModalOpen(true);
    }, 500);
  };

  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <Canvas>
        <animated.perspectiveCamera position={cameraPosition as any}>
          <OrbitControls />
          <ambientLight intensity={2} />
          <Stars />

          <Physics>
            <SphereWithTexture
              position={[0, 0, 0]} // O Sol está no centro
              texturePath="/sol.png"
              rotationSpeed={0.002} // Ajuste a velocidade de rotação do Sol
              onClick={() =>
                openModal({
                  name: "Sol",
                  description: "O Sol é a estrela central do Sistema Solar.",
                  size: 5, // Tamanho do Sol

                  texturePath: "/sol.png",
                })
              }
            />

            {/* Planetas ao redor do Sol */}
            {planets.map((planet, index) => {
              const distance = 10 + index * 5; // Distância do Sol (aumenta para cada planeta)
              const angle = (index * (Math.PI / 4)) % (2 * Math.PI); // Ângulo para posicionar os planetas em uma órbita circular

              // Calcula as coordenadas X e Z para cada planeta
              const posX = distance * Math.cos(angle);
              const posZ = distance * Math.sin(angle);

              return (
                <SphereWithTexture
                  key={planet.pl_name}
                  position={[posX, 0, posZ]} // Planeta posicionado ao redor do Sol
                  texturePath={planetTextures[index % planetTextures.length]}
                  rotationSpeed={0.01} // Ajuste a velocidade de rotação de cada planeta
                  onClick={() =>
                    openModal(
                      {
                        ...planet,
                        texturePath:
                          planetTextures[index % planetTextures.length],
                      },
                      [-posX, 0, -posZ]
                    )
                  }
                />
              );
            })}
          </Physics>
        </animated.perspectiveCamera>
      </Canvas>

      <PlanetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => {
            setTargetPosition([0, 0, 0]);
          }, 200);
        }}
        planetData={selectedPlanet}
      />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Grid,
  Box,
} from "@chakra-ui/react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Componente para a esfera com textura
function SphereWithTexture({ position, texturePath, args }: any) {
  const texture = useLoader(THREE.TextureLoader, texturePath);

  const meshRef = useRef<THREE.Mesh | null>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={args} />
      <meshStandardMaterial
        map={Array.isArray(texture) ? texture[0] : texture}
      />
    </mesh>
  );
}

// Componente do modal do planeta
const PlanetModal = ({ isOpen, onClose, planetData }: any) => {
  if (!planetData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay
        bg="blackAlpha.800" // Fundo preto com opacidade
        backdropFilter="blur(10px)" // Efeito de desfoque no fundo
      />
      <ModalContent
        maxW="600px" // Largura máxima do modal
        bg="gray.900" // Fundo cinza escuro
        color="white" // Texto branco
        borderRadius="lg"
        gap={20}
        boxShadow="lg"
      >
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          {planetData.name}
        </ModalHeader>
        <ModalBody>
          <Grid templateColumns="1fr 1fr" gap={5}>
            <Box p={4} className="w-96">
              <h2 className="text-3xl font-semibold pb-4">
                {planetData.pl_name}
              </h2>
              <p className="text-gray-300 text-lg">{planetData.description}</p>
              <p className="text-gray-400 text-lg">
                Distância do Sol: {planetData.distance} unidades
              </p>
              <p className="text-gray-400 text-lg">
                Tamanho: {planetData.size} vezes a Terra
              </p>
              <p className="text-gray-400 text-lg">
                Data de descoberta: {planetData.disc_year}
              </p>
              <p className="text-gray-400 text-lg">
                Telescopio que foi descoberto: {planetData.disc_telescope}
              </p>
            </Box>

            {/* Planeta 3D */}
            <Box>
              <Canvas style={{ height: "500px" }}>
                <ambientLight intensity={2} />
                <SphereWithTexture
                  args={[2, 32, 32]} // Tamanho do planeta
                  position={[0, 0, 0]}
                  scale
                  texturePath={planetData.texturePath}
                />
              </Canvas>
            </Box>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlanetModal;

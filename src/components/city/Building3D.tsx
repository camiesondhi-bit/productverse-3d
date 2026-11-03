import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingInfo } from '../../types';
import { soundFx } from '../../services/audio';

interface Building3DProps {
  building: BuildingInfo;
  isSelected: boolean;
  onSelect: (building: BuildingInfo) => void;
  onEnter: (building: BuildingInfo) => void;
}

export const Building3D: React.FC<Building3DProps> = ({
  building,
  isSelected,
  onSelect,
  onEnter,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle floating and rotation animations
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.8;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15,
        delta * 5
      );
    } else if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        0,
        delta * 5
      );
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundFx.playSelectBuilding();
    onSelect(building);
  };

  const [x, y, z] = building.position;
  const color = new THREE.Color(building.color);
  const accentColor = new THREE.Color(building.accentColor);

  return (
    <group
      ref={meshRef}
      position={[x, y, z]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        soundFx.playCyberClick();
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base platform */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[building.width * 0.7, building.width * 0.8, 0.4, 8]} />
        <meshStandardMaterial
          color="#0c1226"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Glowing base ring */}
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[building.width * 0.6, building.width * 0.68, 32]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.5}
        />
      </mesh>

      {/* Main Procedural Building Mesh according to building ID */}
      {building.id === 'innovation-lab' && (
        // Hexagonal Dome with inner energy core
        <group position={[0, building.height / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[building.width * 0.5, building.width * 0.65, building.height, 6]} />
            <meshStandardMaterial
              color="#0d1b3e"
              metalness={0.9}
              roughness={0.15}
              wireframe={false}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[0, building.height * 0.55, 0]}>
            <sphereGeometry args={[building.width * 0.4, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {building.id === 'user-research' && (
        // Twin Towers connected with glowing bridges
        <group position={[0, building.height / 2, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <boxGeometry args={[building.width * 0.4, building.height, building.depth * 0.4]} />
            <meshStandardMaterial color="#1a1230" metalness={0.85} roughness={0.2} transparent opacity={0.9} />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <boxGeometry args={[building.width * 0.4, building.height, building.depth * 0.4]} />
            <meshStandardMaterial color="#1a1230" metalness={0.85} roughness={0.2} transparent opacity={0.9} />
          </mesh>
          {/* Bridge 1 */}
          <mesh position={[0, building.height * 0.2, 0]}>
            <boxGeometry args={[2.4, 0.6, 0.8]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.8} />
          </mesh>
          {/* Bridge 2 */}
          <mesh position={[0, building.height * -0.2, 0]}>
            <boxGeometry args={[2.4, 0.6, 0.8]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {building.id === 'strategy-tower' && (
        // Soaring spire skyscraper
        <group position={[0, building.height / 2, 0]}>
          <mesh position={[0, -2, 0]}>
            <boxGeometry args={[building.width * 0.7, building.height - 4, building.depth * 0.7]} />
            <meshStandardMaterial color="#161233" metalness={0.9} roughness={0.1} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, building.height / 2 - 2, 0]}>
            <coneGeometry args={[building.width * 0.4, 4, 4]} />
            <meshStandardMaterial color="#22184a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Antenna spire */}
          <mesh position={[0, building.height / 2 + 1.5, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 3, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      )}

      {building.id === 'design-studio' && (
        // Asymmetric geometric crystal prism
        <group position={[0, building.height / 2, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[building.width * 0.35, building.width * 0.55, building.height, 5]} />
            <meshStandardMaterial color="#0c233c" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
          </mesh>
          {/* Floating glowing design rings */}
          <mesh ref={ringRef} position={[0, 1, 0]}>
            <torusGeometry args={[building.width * 0.65, 0.1, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {building.id === 'development-hub' && (
        // Stepped Cyber-Pyramid with Agile Sprint tiers
        <group position={[0, building.height / 2, 0]}>
          <mesh position={[0, -building.height * 0.3, 0]}>
            <boxGeometry args={[building.width, building.height * 0.4, building.depth]} />
            <meshStandardMaterial color="#0b241b" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[building.width * 0.75, building.height * 0.35, building.depth * 0.75]} />
            <meshStandardMaterial color="#0e2e22" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, building.height * 0.3, 0]}>
            <boxGeometry args={[building.width * 0.5, building.height * 0.3, building.depth * 0.5]} />
            <meshStandardMaterial color="#143e2e" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      )}

      {building.id === 'analytics-centre' && (
        // Cylindrical data observatory with rotating exterior rings
        <group position={[0, building.height / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[building.width * 0.45, building.width * 0.5, building.height, 24]} />
            <meshStandardMaterial color="#12183d" metalness={0.9} roughness={0.1} transparent opacity={0.85} />
          </mesh>
          <mesh ref={ringRef} position={[0, 0, 0]}>
            <torusGeometry args={[building.width * 0.65, 0.12, 16, 48]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, building.height / 2, 0]}>
            <sphereGeometry args={[building.width * 0.35, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {building.id === 'launch-arena' && (
        // Futuristic rocket launchpad with angled fins
        <group position={[0, building.height / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[building.width * 0.35, building.width * 0.55, building.height, 8]} />
            <meshStandardMaterial color="#2e1d09" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Angled launch fins */}
          <mesh position={[building.width * 0.5, -building.height * 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.3, building.height * 0.5, building.depth * 0.3]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[-building.width * 0.5, -building.height * 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.3, building.height * 0.5, building.depth * 0.3]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      )}

      {building.id === 'growth-centre' && (
        // Double helix spiral spire
        <group position={[0, building.height / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[building.width * 0.3, building.width * 0.45, building.height, 12]} />
            <meshStandardMaterial color="#2d0b1a" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh ref={ringRef} position={[0, 2, 0]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[building.width * 0.6, 0.1, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, -2, 0]} rotation={[-0.4, 0, 0]}>
            <torusGeometry args={[building.width * 0.55, 0.1, 16, 32]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {/* Vertical light beam beacon for selected/hovered building */}
      {(hovered || isSelected) && (
        <mesh position={[0, building.height + 6, 0]}>
          <cylinderGeometry args={[0.15, 0.4, 12, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Floating 3D HTML Billboard Label */}
      <Html
        position={[0, building.height + 1.2, 0]}
        center
        distanceFactor={28}
        zIndexRange={[10, 0]}
      >
        <div
          onClick={handleClick}
          className={`cursor-pointer transition-all duration-300 transform select-none pointer-events-auto ${
            hovered || isSelected ? 'scale-110 -translate-y-1' : 'opacity-85'
          }`}
        >
          <div
            className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-2 transition-all ${
              isSelected
                ? 'bg-[#0f152d]/95 border-cyan-400 shadow-neon-cyan text-cyan-300'
                : hovered
                ? 'bg-[#0c1126]/90 border-purple-400/80 shadow-neon-purple text-purple-200'
                : 'bg-[#090d1f]/80 border-slate-700/70 text-slate-200'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: building.color }}
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold font-display tracking-wide whitespace-nowrap">
                {building.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight whitespace-nowrap">
                {building.category} · +{building.xpReward} XP
              </span>
            </div>
            {(hovered || isSelected) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playSuccessChime();
                  onEnter(building);
                }}
                className="ml-1 px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] uppercase tracking-wider"
              >
                ENTER
              </button>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

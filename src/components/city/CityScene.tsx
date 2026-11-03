import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingInfo } from '../../types';
import { BUILDINGS_DATA } from '../../data/buildings';
import { Building3D } from './Building3D';
import { IsometricCity } from './IsometricCity';
import { soundFx } from '../../services/audio';
import {
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CitySceneProps {
  onEnterBuilding: (building: BuildingInfo) => void;
  selectedBuilding: BuildingInfo | null;
  onSelectBuilding: (building: BuildingInfo | null) => void;
}

// Camera Lerper that flies smoothly toward a selected building
const CameraRig: React.FC<{ selectedBuilding: BuildingInfo | null }> = ({ selectedBuilding }) => {
  const targetPos = useRef(new THREE.Vector3(0, 22, 38));
  const targetLook = useRef(new THREE.Vector3(0, 2, 0));

  useFrame((state, delta) => {
    if (selectedBuilding) {
      const [bx, , bz] = selectedBuilding.position;
      // Position camera at an elevated cinematic offset from building
      targetPos.current.set(bx + 8, selectedBuilding.height + 6, bz + 12);
      targetLook.current.set(bx, selectedBuilding.height * 0.4, bz);
    } else {
      // Default overview position
      targetPos.current.set(0, 22, 38);
      targetLook.current.set(0, 2, 0);
    }

    state.camera.position.lerp(targetPos.current, delta * 2.5);
    state.camera.lookAt(targetLook.current);
  });

  return null;
};

// Cyber reflective ground grid
const CyberGround: React.FC = () => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Dark reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#050713"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Grid lines helper */}
      <gridHelper
        args={[100, 40, '#00f7ff', '#16234b']}
        position={[0, 0.05, 0]}
      />

      {/* Concentric energy rings in center of city */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[6, 6.3, 64]} />
        <meshBasicMaterial color="#00f7ff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[12, 12.3, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const CityScene: React.FC<CitySceneProps> = ({
  onEnterBuilding,
  selectedBuilding,
  onSelectBuilding,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isOrbiting, setIsOrbiting] = useState(false);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] bg-[#060814] overflow-hidden select-none">
      {/* 2D/3D Mode Switcher Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0d142d]/85 backdrop-blur-md p-1.5 rounded-xl border border-cyan-500/30 shadow-glass">
        <button
          onClick={() => {
            soundFx.playCyberClick();
            setViewMode('3d');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '3d'
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-neon-cyan'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>3D Orbit View</span>
        </button>

        <button
          onClick={() => {
            soundFx.playCyberClick();
            setViewMode('2d');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '2d'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tactical Map</span>
        </button>

        {selectedBuilding && (
          <button
            onClick={() => {
              soundFx.playCyberClick();
              onSelectBuilding(null);
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-cyan-200 px-2 py-1 ml-1 bg-cyan-950/40 rounded border border-cyan-800/60"
          >
            <Compass className="w-3 h-3" />
            <span>Reset Camera</span>
          </button>
        )}
      </div>

      {/* Buildings Quick-Jump HUD on Top Right */}
      <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col gap-1.5 bg-[#0a0f26]/80 backdrop-blur-md p-2 rounded-xl border border-slate-800/80 max-h-[80vh] overflow-y-auto scrollbar-none">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Direct Access Districts</span>
        </div>
        {BUILDINGS_DATA.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              soundFx.playSelectBuilding();
              onSelectBuilding(b);
            }}
            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
              selectedBuilding?.id === b.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="truncate max-w-[140px]">{b.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">+{b.xpReward}</span>
          </button>
        ))}
      </div>

      {/* Main View: 3D Canvas OR 2D Isometric View */}
      {viewMode === '3d' ? (
        <Canvas
          shadows
          camera={{ position: [0, 22, 38], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={['#060814']} />
          <fog attach="fog" args={['#060814', 30, 95]} />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[25, 40, 20]}
            intensity={1.2}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-15, 20, -10]} intensity={1.5} color="#00f7ff" />
          <pointLight position={[15, 20, 10]} intensity={1.5} color="#a855f7" />

          {/* Background Stars / Space particle dust */}
          <Stars
            radius={80}
            depth={50}
            count={2500}
            factor={4}
            saturation={0.5}
            fade
            speed={1.2}
          />

          <Suspense fallback={null}>
            {/* Ground */}
            <CyberGround />

            {/* 8 Procedural Interactive Buildings */}
            {BUILDINGS_DATA.map((building) => (
              <Building3D
                key={building.id}
                building={building}
                isSelected={selectedBuilding?.id === building.id}
                onSelect={onSelectBuilding}
                onEnter={onEnterBuilding}
              />
            ))}

            {/* Camera transition rig */}
            <CameraRig selectedBuilding={selectedBuilding} />

            {/* Orbit Controls (disabled while transitioning/clicking) */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2.05} // prevent going below ground
              minDistance={10}
              maxDistance={70}
              onStart={() => setIsOrbiting(true)}
              onEnd={() => setIsOrbiting(false)}
            />
          </Suspense>
        </Canvas>
      ) : (
        <IsometricCity
          selectedBuilding={selectedBuilding}
          onSelectBuilding={onSelectBuilding}
          onEnterBuilding={onEnterBuilding}
        />
      )}

      {/* Bottom Floating Building Inspector Drawer (When a building is selected in 3D) */}
      {viewMode === '3d' && selectedBuilding && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl bg-[#0c1228]/95 backdrop-blur-xl border border-cyan-500/40 shadow-neon-cyan p-4 rounded-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg mt-0.5"
                style={{
                  backgroundColor: `${selectedBuilding.color}20`,
                  color: selectedBuilding.color,
                  border: `1.5px solid ${selectedBuilding.color}`,
                }}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-lg text-slate-100">
                    {selectedBuilding.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {selectedBuilding.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedBuilding.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => onSelectBuilding(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  soundFx.playSuccessChime();
                  onEnterBuilding(selectedBuilding);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:brightness-110 text-slate-950 font-extrabold text-xs tracking-wider shadow-neon-cyan flex items-center justify-center gap-2 transition-all"
              >
                <span>ENTER LAB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

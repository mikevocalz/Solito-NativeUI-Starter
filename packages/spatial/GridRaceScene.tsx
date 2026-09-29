'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroMaterials,
  ViroPolyline,
  ViroScene,
  ViroText,
} from './viro';

ViroMaterials.createMaterials({
  raceCyan: { diffuseColor: '#00f3ff', lightingModel: 'Constant' },
  raceOrange: { diffuseColor: '#ff8a00', lightingModel: 'Constant' },
  raceWhite: { diffuseColor: '#fff6cf', lightingModel: 'Constant' },
  raceDark: { diffuseColor: '#030507', lightingModel: 'Blinn' },
});

const LANES = [-2.4, 0, 2.4] as const;
const GRID_X = Array.from({ length: 19 }, (_, index) => index - 9);
const GRID_Z = Array.from({ length: 34 }, (_, index) => index);

export function GridRaceScene() {
  const [lane, setLane] = useState(1);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDistance((value) => value + 0.18);
      setScore((value) => value + 1);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const obstacles = useMemo(() => [
    { lane: 0, z: 18 },
    { lane: 2, z: 30 },
    { lane: 1, z: 44 },
    { lane: 0, z: 58 },
  ], []);

  const playerX = LANES[lane] ?? 0;
  const shiftLane = (delta: number) => {
    setLane((value) => Math.max(0, Math.min(2, value + delta)));
  };

  return (
    <ViroScene>
      <ViroAmbientLight color="#72f7ff" intensity={180} />
      <ViroDirectionalLight color="#ffb34a" intensity={240} direction={[0, -1, -0.4]} />

      {GRID_X.map((offset) => (
        <ViroPolyline
          key={`gx-${offset}`}
          points={[[offset, -1.55, -1], [offset, -1.55, -72]]}
          thickness={0.016}
          materials={['raceCyan']}
        />
      ))}
      {GRID_Z.map((index) => {
        const z = -1 - ((index * 2.2 - (distance % 2.2) + 72) % 72);
        return (
          <ViroPolyline
            key={`gz-${index}`}
            points={[[-9, -1.55, z], [9, -1.55, z]]}
            thickness={0.014}
            materials={['raceCyan']}
          />
        );
      })}

      <ViroPolyline points={[[-9, 4.8, -46], [9, 4.8, -46]]} thickness={0.025} materials={['raceOrange']} />
      {[-7.5, -4.5, -1.5, 1.5, 4.5, 7.5].map((x) => (
        <ViroBox key={x} position={[x, 0.15, -46]} scale={[0.08, 4.6, 0.08]} materials={['raceOrange']} />
      ))}

      {obstacles.map((obstacle, index) => {
        const loop = 70;
        const z = -4 - ((obstacle.z - distance + loop) % loop);
        const x = LANES[obstacle.lane] ?? 0;
        return (
          <ViroBox
            key={index}
            position={[x, -0.88, z]}
            scale={[0.32, 0.58, 0.08]}
            materials={index % 2 === 0 ? ['raceOrange'] : ['raceWhite']}
          />
        );
      })}

      <ViroBox position={[playerX, -1.03, -4]} scale={[0.58, 0.22, 1.1]} materials={['raceCyan']} />
      <ViroBox position={[playerX, -0.86, -4.58]} scale={[0.18, 0.2, 0.46]} materials={['raceWhite']} />
      <ViroPolyline
        points={[[playerX, -1.0, -4.8], [playerX, -0.98, -12]]}
        thickness={0.08}
        materials={['raceCyan']}
      />

      <ViroBox position={[-2.8, -0.1, -3]} scale={[0.55, 0.24, 0.08]} materials={['raceDark']} onClick={() => shiftLane(-1)} />
      <ViroText text="LEFT" position={[-2.8, -0.08, -2.9]} width={1.2} height={0.35} style={{ fontSize: 18, color: '#00f3ff', textAlign: 'center' }} />
      <ViroBox position={[2.8, -0.1, -3]} scale={[0.55, 0.24, 0.08]} materials={['raceDark']} onClick={() => shiftLane(1)} />
      <ViroText text="RIGHT" position={[2.8, -0.08, -2.9]} width={1.2} height={0.35} style={{ fontSize: 18, color: '#ff8a00', textAlign: 'center' }} />

      <ViroText
        text={`GRID RACE  •  ${score.toString().padStart(5, '0')}`}
        position={[0, 2.3, -5]}
        width={5}
        height={0.7}
        style={{ fontSize: 22, color: '#fff6cf', textAlign: 'center' }}
      />
    </ViroScene>
  );
}

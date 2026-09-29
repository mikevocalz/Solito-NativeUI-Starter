'use client';

import { useCallback, useState } from 'react';
import {
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroGameLoop,
  ViroMaterials,
  ViroNode,
  ViroPolyline,
  ViroScene,
  ViroText,
} from './viro';
import { gridRace, useGridRaceStore } from './gridRaceStore';

ViroMaterials.createMaterials({
  raceCyan: { diffuseColor: '#00f3ff', lightingModel: 'Constant' },
  raceOrange: { diffuseColor: '#ff8a00', lightingModel: 'Constant' },
  raceWhite: { diffuseColor: '#fff6cf', lightingModel: 'Constant' },
  raceDark: { diffuseColor: '#020407', lightingModel: 'Constant' },
});

const GRID_X = Array.from({ length: 21 }, (_, index) => index - 10);
const GRID_Z = Array.from({ length: 38 }, (_, index) => index);
const TRACK_LOOP = 78;
const GRID_STEP = 2.2;

const OBSTACLES = [
  { x: -2.4, offset: 18, tone: 'raceOrange' },
  { x: 2.2, offset: 30, tone: 'raceWhite' },
  { x: 0.2, offset: 44, tone: 'raceOrange' },
  { x: -1.8, offset: 58, tone: 'raceWhite' },
] as const;

const SKYLINE = [
  { x: -8.2, width: 1.7, height: 3.3, tone: 'raceCyan' },
  { x: -5.8, width: 2.2, height: 5.8, tone: 'raceOrange' },
  { x: -2.9, width: 1.5, height: 4.1, tone: 'raceCyan' },
  { x: -0.2, width: 2.6, height: 7.2, tone: 'raceOrange' },
  { x: 3.2, width: 1.8, height: 4.8, tone: 'raceCyan' },
  { x: 6.2, width: 2.5, height: 6.2, tone: 'raceOrange' },
] as const;

type RaceFrame = {
  x: number;
  distance: number;
  hits: number;
  hitCooldown: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const positiveModulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

const obstacleZ = (offset: number, distance: number) =>
  -4 - positiveModulo(offset - distance, TRACK_LOOP);

function GridWorld({ distance }: { distance: number }) {
  return (
    <>
      {GRID_X.map((offset) => (
        <ViroPolyline
          key={`gx-${offset}`}
          points={[[offset, -1.55, -1], [offset, -1.55, -82]]}
          thickness={0.014}
          materials={['raceCyan']}
        />
      ))}
      {GRID_Z.map((index) => {
        const z = -1 - positiveModulo(index * GRID_STEP - distance, TRACK_LOOP);
        return (
          <ViroPolyline
            key={`gz-${index}`}
            points={[[-10, -1.55, z], [10, -1.55, z]]}
            thickness={0.012}
            materials={['raceCyan']}
          />
        );
      })}

      <ViroPolyline
        points={[[-10, 4.9, -58], [10, 4.9, -58]]}
        thickness={0.024}
        materials={['raceOrange']}
      />

      {SKYLINE.map((building, index) => {
        const left = building.x - building.width / 2;
        const right = building.x + building.width / 2;
        const bottom = -1.52;
        const top = bottom + building.height;
        return (
          <ViroPolyline
            key={`city-${index}`}
            points={[
              [left, bottom, -58],
              [left, top, -58],
              [right, top, -58],
              [right, bottom, -58],
            ]}
            thickness={0.025}
            materials={[building.tone]}
          />
        );
      })}
    </>
  );
}

function Gateway() {
  return (
    <>
      <ViroText
        text="GRID ACCESS"
        position={[0, 2.35, -6.2]}
        width={5}
        height={0.8}
        style={{ fontSize: 24, color: '#fff6cf', textAlign: 'center' }}
      />
      <ViroText
        text="SELECT THE GATE TO ENTER"
        position={[0, 1.75, -6.2]}
        width={5}
        height={0.5}
        style={{ fontSize: 15, color: '#00f3ff', textAlign: 'center' }}
      />

      <ViroBox position={[-2.7, 0.45, -8]} scale={[0.09, 2.1, 0.09]} materials={['raceOrange']} />
      <ViroBox position={[2.7, 0.45, -8]} scale={[0.09, 2.1, 0.09]} materials={['raceOrange']} />
      <ViroBox position={[0, 2.55, -8]} scale={[2.79, 0.09, 0.09]} materials={['raceOrange']} />
      <ViroBox
        position={[0, 0.35, -8.05]}
        scale={[2.55, 1.95, 0.035]}
        materials={['raceDark']}
        onClick={gridRace.startRace}
      />

      {[-1.7, -0.85, 0, 0.85, 1.7].map((x) => (
        <ViroPolyline
          key={x}
          points={[[x, -1.4, -7.95], [x, 2.35, -7.95]]}
          thickness={0.012}
          materials={['raceCyan']}
        />
      ))}
    </>
  );
}

export function GridRaceScene() {
  const phase = useGridRaceStore((state) => state.phase);
  const [frame, setFrame] = useState<RaceFrame>({
    x: 0,
    distance: 0,
    hits: 0,
    hitCooldown: 0,
  });

  const onFixedUpdate = useCallback(({ dt }: { dt: number }) => {
    const input = gridRace.getState();
    if (input.phase !== 'race') return;

    setFrame((current) => {
      const boost = Math.max(0, input.throttle);
      const speed = 8.5 + boost * 6;
      const nextDistance = current.distance + speed * dt;
      let nextX = clamp(current.x + input.steer * 5.2 * dt, -3.2, 3.2);
      let hits = current.hits;
      let hitCooldown = Math.max(0, current.hitCooldown - dt);

      const collision = OBSTACLES.some((obstacle) => {
        const z = obstacleZ(obstacle.offset, nextDistance);
        return z > -4.9 && z < -3.25 && Math.abs(obstacle.x - nextX) < 0.7;
      });

      if (collision && hitCooldown <= 0) {
        hits += 1;
        hitCooldown = 1.1;
        nextX = clamp(nextX + (nextX <= 0 ? 0.8 : -0.8), -3.2, 3.2);
      }

      return { x: nextX, distance: nextDistance, hits, hitCooldown };
    });
  }, []);

  const nudge = (delta: number) => {
    setFrame((current) => ({
      ...current,
      x: clamp(current.x + delta, -3.2, 3.2),
    }));
  };

  const score = Math.max(0, Math.floor(frame.distance * 12) - frame.hits * 50);

  return (
    <ViroScene>
      <ViroAmbientLight color="#7cf8ff" intensity={135} />
      <ViroDirectionalLight color="#ff9b33" intensity={180} direction={[0, -1, -0.35]} />
      <ViroGameLoop fixedHz={30} onFixedUpdate={onFixedUpdate} />

      <GridWorld distance={phase === 'race' ? frame.distance : 0} />

      {phase === 'gateway' ? (
        <Gateway />
      ) : (
        <>
          {OBSTACLES.map((obstacle, index) => (
            <ViroBox
              key={index}
              position={[obstacle.x, -0.9, obstacleZ(obstacle.offset, frame.distance)]}
              scale={[0.34, 0.62, 0.09]}
              materials={[obstacle.tone]}
            />
          ))}

          <ViroNode position={[frame.x, 0, 0]}>
            <ViroBox position={[0, -1.02, -4]} scale={[0.62, 0.19, 1.18]} materials={['raceCyan']} />
            <ViroBox position={[0, -0.84, -4.62]} scale={[0.2, 0.18, 0.46]} materials={['raceWhite']} />
            <ViroBox position={[0, -0.49, -2.8]} scale={[0.045, 0.62, 1.15]} materials={['raceCyan']} />
            <ViroPolyline
              points={[[0, -1.18, -4.72], [0, -1.18, -1.65]]}
              thickness={0.075}
              materials={['raceCyan']}
            />
          </ViroNode>

          <ViroBox
            position={[-3.2, -0.15, -3]}
            scale={[0.58, 0.26, 0.08]}
            materials={['raceDark']}
            onClick={() => nudge(-0.95)}
          />
          <ViroText
            text="LEFT"
            position={[-3.2, -0.11, -2.9]}
            width={1.2}
            height={0.35}
            style={{ fontSize: 17, color: '#00f3ff', textAlign: 'center' }}
          />
          <ViroBox
            position={[3.2, -0.15, -3]}
            scale={[0.58, 0.26, 0.08]}
            materials={['raceDark']}
            onClick={() => nudge(0.95)}
          />
          <ViroText
            text="RIGHT"
            position={[3.2, -0.11, -2.9]}
            width={1.2}
            height={0.35}
            style={{ fontSize: 17, color: '#ff8a00', textAlign: 'center' }}
          />

          <ViroText
            text={`GRID RUN  •  ${score.toString().padStart(5, '0')}  •  HITS ${frame.hits}`}
            position={[0, 2.35, -5]}
            width={6}
            height={0.7}
            style={{ fontSize: 20, color: '#fff6cf', textAlign: 'center' }}
          />
        </>
      )}
    </ViroScene>
  );
}

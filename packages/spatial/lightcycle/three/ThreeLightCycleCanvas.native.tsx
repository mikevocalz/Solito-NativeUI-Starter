'use client';

import { useEffect, useRef } from 'react';
import { PixelRatio } from 'react-native';
import type { CanvasRef } from 'react-native-webgpu';
import { Canvas, useDevice } from 'react-native-webgpu';
import type { LightCycleMatchState } from '../tabletopCore';
import { ThreeLightCycleRenderer } from './ThreeLightCycleRenderer';

export type ThreeLightCycleCanvasProps = {
  state: LightCycleMatchState;
  assetUri?: string;
  style?: object;
};

export function ThreeLightCycleCanvas({
  state,
  assetUri,
  style,
}: ThreeLightCycleCanvasProps) {
  const canvasRef = useRef<CanvasRef>(null);
  const rendererRef = useRef<ThreeLightCycleRenderer | null>(null);
  const stateRef = useRef(state);
  const { device } = useDevice();

  stateRef.current = state;

  useEffect(() => {
    if (!device || !canvasRef.current) return;

    let cancelled = false;
    let frame = 0;

    const start = async () => {
      const context = canvasRef.current?.getContext('webgpu');
      if (!context || cancelled) return;

      const canvas = context.canvas as unknown as {
        width: number;
        height: number;
        clientWidth: number;
        clientHeight: number;
      };
      const dpr = PixelRatio.get();
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      context.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied',
      });

      const renderer = new ThreeLightCycleRenderer({
        context,
        device,
        width: canvas.width,
        height: canvas.height,
        assetUri,
      });
      rendererRef.current = renderer;
      await renderer.init(assetUri);
      if (cancelled) {
        renderer.dispose();
        return;
      }

      const tick = (now: number) => {
        renderer.render(stateRef.current, now);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    void start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [assetUri, device]);

  return (
    <Canvas
      ref={canvasRef}
      opaque={false}
      style={[{ flex: 1 }, style]}
    />
  );
}

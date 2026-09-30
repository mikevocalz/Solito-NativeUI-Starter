'use client';

import { useEffect, useRef } from 'react';
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
  const stateRef = useRef(state);
  const { device } = useDevice();

  stateRef.current = state;

  useEffect(() => {
    if (!device || !canvasRef.current) return;

    let disposed = false;
    let frame = 0;
    let renderer: ThreeLightCycleRenderer | null = null;

    void (async () => {
      const context = canvasRef.current?.getContext('webgpu');
      if (!context || disposed) return;

      const canvas = context.canvas as unknown as {
        width: number;
        height: number;
        clientWidth: number;
        clientHeight: number;
      };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      context.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied',
      });

      renderer = new ThreeLightCycleRenderer({
        context,
        device,
        width: canvas.width,
        height: canvas.height,
        assetUri,
      });
      await renderer.init(assetUri);
      if (disposed) {
        renderer.dispose();
        return;
      }

      const tick = (now: number) => {
        renderer?.render(stateRef.current, now);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      renderer?.dispose();
    };
  }, [assetUri, device]);

  return <Canvas ref={canvasRef} opaque={false} style={[{ flex: 1 }, style]} />;
}

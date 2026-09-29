'use client';

import type { GridFloorProps } from './GridFloor.types';

/**
 * NeonBlade-inspired perspective grid background.
 *
 * Raw DOM stays inside /ui by design. Consumers only see the GridFloor
 * semantic component, never canvas/div implementation details.
 */
export function GridFloor({
  className,
  children,
  lineColor = '#2cf6ff',
  backgroundColor = '#03040a',
  glowColor = '#8b5cf6',
}: GridFloorProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        minHeight: '100%',
        background:
          `radial-gradient(circle at 50% 42%, ${glowColor}33 0, transparent 28%), ${backgroundColor}`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-25%',
          right: '-25%',
          bottom: '-38%',
          height: '92%',
          transform: 'perspective(540px) rotateX(66deg)',
          transformOrigin: '50% 100%',
          backgroundImage:
            `linear-gradient(to right, ${lineColor}66 1px, transparent 1px), linear-gradient(to bottom, ${lineColor}66 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          boxShadow: `0 -22px 70px ${glowColor}38`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 100%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(3,4,10,.15) 0%, rgba(3,4,10,.05) 48%, rgba(3,4,10,.8) 100%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      {children}
    </div>
  );
}

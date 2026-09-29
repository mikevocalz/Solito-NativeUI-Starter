'use client';

import Svg, { Line, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { View } from './tw';
import type { GridFloorProps } from './GridFloor.types';

const VERTICAL = Array.from({ length: 15 }, (_, index) => index);
const HORIZONTAL = Array.from({ length: 12 }, (_, index) => index);

export function GridFloor({
  className,
  children,
  lineColor = '#2cf6ff',
  backgroundColor = '#03040a',
  glowColor = '#8b5cf6',
}: GridFloorProps) {
  return (
    <View className={`relative flex-1 overflow-hidden ${className ?? ''}`} style={{ backgroundColor }}>
      <View pointerEvents="none" className="absolute inset-0">
        <Svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="spatialFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={glowColor} stopOpacity="0.02" />
              <Stop offset="0.42" stopColor={glowColor} stopOpacity="0.16" />
              <Stop offset="1" stopColor={backgroundColor} stopOpacity="0.92" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="1000" height="1000" fill="url(#spatialFade)" />
          {VERTICAL.map((index) => {
            const x = 500 + (index - 7) * 82;
            return <Line key={`v-${index}`} x1="500" y1="420" x2={x} y2="1000" stroke={lineColor} strokeOpacity="0.36" strokeWidth="2" />;
          })}
          {HORIZONTAL.map((index) => {
            const t = index / 11;
            const y = 430 + Math.pow(t, 1.7) * 570;
            return <Line key={`h-${index}`} x1="0" y1={y} x2="1000" y2={y} stroke={lineColor} strokeOpacity={0.15 + t * 0.35} strokeWidth="2" />;
          })}
        </Svg>
      </View>
      {children}
    </View>
  );
}

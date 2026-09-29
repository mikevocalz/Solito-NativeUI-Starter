'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

type ModuleWithDefault<P extends object> = { default: ComponentType<P> };

export function SkiaWebGate<P extends object>({
  load,
  props,
  fallback,
}: {
  load: () => Promise<ModuleWithDefault<P>>;
  props: P;
  fallback?: ReactNode;
}) {
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    let active = true;
    void LoadSkiaWeb({ locateFile: (file) => `/canvaskit/${file}` })
      .then(load)
      .then((module) => {
        if (active) setComponent(() => module.default);
      });
    return () => {
      active = false;
    };
  }, [load]);

  return Component ? <Component {...props} /> : (fallback ?? null);
}

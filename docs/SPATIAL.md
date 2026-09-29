# Spatial-Solotio-Starter runtime

This branch turns the Solito NativeUI starter into a spatial-first Expo SDK 58
starter while keeping one application/component model across ordinary screens,
WebXR/WebGL, Quest and Pico.

## Runtime layers

- **Universal app UI:** all application UI still comes through `@acme/ui`.
  `@acme/ui/html` owns semantic web elements; Expo UI owns native controls.
- **Grid Floor:** `@acme/ui` exports `GridFloor`, a NeonBlade-inspired
  perspective floor. Web uses the browser rendering layer only inside `/ui`;
  native uses SVG; immersive scenes draw the same cyan grid with Viro geometry.
- **Viro scene:** `@acme/spatial` owns a shared `SpatialViroExperience`
  used by both Next and Expo. Viro's web renderer sidecars are copied from
  `@reactvision/viro-web-renderer` to each app's public `/viro` directory
  during postinstall.
- **Rive:** `RiveStage` has a single public API. Native uses
  `@rive-app/react-native` (Nitro); web uses `@rive-app/react-webgl2`.
- **System spatial windows:** `ForkSpatialLayout` detects the optional
  `ViroSpatialSceneProvider` / `ViroSpatialWindow` exports from the
  mikevocalz Viro fork. On Meta Horizon OS those delegate to Meta VR Layout
  SDK. On Pico, WebXR and ordinary hosts the same content falls back inline and
  Viro owns immersive placement.
- **XR Rive surface:** `SpatialRivePanel` detects the fork's Nitro-backed
  `ViroRivePanel`. Stock Viro shows an explicit placeholder; the fork renders
  compiled Rive bytes directly onto the Viro surface.

## Use the mikevocalz Viro fork

The repository intentionally locks to public `@reactvision/react-viro@3.0.1`
so a fresh public clone can install without credentials. For the full fork
feature set, add this override to `pnpm-workspace.yaml`:

```yaml
overrides:
  "@reactvision/react-viro": "github:mikevocalz/viro#decax9-three-panel"
```

Then run:

```bash
pnpm install
pnpm spatial:prepare-web
```

The application code does not change when the override is active: the optional
fork exports are discovered by `@acme/spatial`.

## Quest + Meta VR Layout SDK

The Expo app declares `@metavr/layout-compat` and
`@metavr/layout-window-compat` directly, as Meta requires. The Viro fork
configuration is:

```ts
[
  '@reactvision/react-viro',
  {
    provider: 'none',
    android: {
      xRMode: ['AR', 'QUEST', 'PICO'],
      metaSpatialLayout: true,
      metaSpatialLayoutBomVersion: '1.2026.0.0',
      questArm64Only: true,
    },
  },
]
```

Quest uses Meta system spatial windows when available. Pico does **not** pretend
to implement Meta's window manager; it uses the shared Viro/OpenXR scene and
inline layout fallback.

## Assets / Metro

`apps/mobile/metro.config.js` starts with Expo SDK 58's default resolver and
adds authored spatial formats as assets: Rive, GLB/GLTF, VRX, OBJ/MTL/FBX,
binary buffers, HDR/EXR textures, KTX/KTX2, splat data and WASM. It never
replaces Expo's package-exports or web/server condition handling.

## Routes

- Next: `/spatial`
- Expo: drawer → **Spatial**

The same `SpatialScreen` is mounted by both.


### Next/Turbopack sidecar handling

`@reactvision/viro-web-renderer@1.0.0` ships runtime fallbacks written as
package-relative `new URL("../wasm/", import.meta.url)` and
`new URL("../slam/", import.meta.url)` expressions. Next/Turbopack eagerly
tries to resolve those asset directories as JavaScript modules even when the
navigator is supplied an explicit public asset base.

The root postinstall therefore performs two narrow, exact-string rewrites in
the installed renderer so those unused fallbacks point at `/viro/wasm/` and
`/viro/slam/`, then copies the package's sidecars to those public locations.
The script resolves the renderer from `apps/web/package.json` so it works with
pnpm 12's strict workspace dependency isolation.

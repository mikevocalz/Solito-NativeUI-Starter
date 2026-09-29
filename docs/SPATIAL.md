# Spatial-Solotio-Starter runtime

Spatial-Solotio-Starter is a spatial-first Expo SDK 58 / Next starter with a deliberately layered renderer:

- **Tailwind 4 + Uniwind** for ordinary product UI on native.
- **React Native Skia 2.13** for universal GPU-drawn 2D scenes on iOS, Android and web.
- **Rive** for interactive animated UI surfaces.
- **Viro / OpenXR** for immersive 3D on Quest, Pico, web and supported native targets.

## Universal Skia graphics

`@acme/ui` includes three related procedural backgrounds:

- `GridFloor` — scrolling perspective floor.
- `GridScene` — mirrored ceiling + floor planes around a shared horizon.
- `GlyphCity` — deterministic neon city silhouettes, glyph-like vector cells, antenna lights and flying traffic.

The drawing implementations live in `*.skia.tsx` and are shared. Native imports them directly. Web wrappers only initialize CanvasKit and then load the same Skia component. There is no separate CSS/SVG rendering path.

CanvasKit is copied to `/canvaskit` for Next, Storybook and Expo web during postinstall by `tooling/copy-skia-web-assets.mjs`. `SkiaWebGate` caches that initialization so multiple backgrounds do not load CanvasKit repeatedly.

The default Grid composition intentionally layers:

1. `GridScene` as the full-screen floor/ceiling field.
2. `GlyphCity` as a transparent lower-horizon city layer.
3. Normal semantic application UI above both.

## Futuristic UI kit

The starter exports `CircuitButton` and `GridCard`. They are universal semantic controls styled through the existing Tailwind 4 / Uniwind boundary; Skia remains reserved for scene graphics.

Storybook contains **Spatial / Grid World** stories for:

- the complete Grid gateway composition;
- Grid Scene + Glyph City;
- Grid Floor;
- cyan/orange CircuitButton variants;
- futuristic GridCard variants.

## XR entryway and light-cycle race

The `/spatial` route and Expo Spatial drawer screen act as a gateway rather than dropping directly into a game.

The Viro world uses an early-1980s computer-world visual grammar without shipping film logos, characters, audio, models or copied production assets: black void, cyan vector floor grid, warm orange geometry, light walls/trails, sparse skyline outlines and minimal HUD typography.

`GridRaceScene` is a playable Viro starter:

- a selectable in-world **GRID ACCESS** gate;
- `ViroGameLoop` fixed-step simulation at 30 Hz;
- analog steering and boost from `ViroVirtualJoystick` on web and flat native previews;
- controller/hand-clickable LEFT/RIGHT pads inside the 3D world for headset fallback;
- continuous track movement, obstacle wrapping, collisions, hit count and distance score;
- a procedural player cycle silhouette and vertical light wall/trail;
- sparse outlined horizon architecture designed to read like an early vector-computer world.

The old Viro AR Driving Car sample informed the input/simulation direction: acceleration, steering and continuously updated transforms are much closer to a light-cycle game than a static Viro scene. The starter does not copy the sample's art or vehicle assets.

## Immersive routing

`SpatialViroExperience.native.tsx` separates headset entry from ordinary app previews:

- **Quest** uses `ViroXRSceneNavigator`, which hands the virtual scene to the headset VR activity.
- **Pico** uses the same XR navigator when the mikevocalz fork is enabled; that fork adds PICO detection/routing and floor-origin support.
- **iOS / ordinary Android** keep the scene in a `Viro3DSceneNavigator` preview with the same race module and virtual joystick.
- **Web** uses Viro Web Renderer with the same race scene and the web `ViroVirtualJoystick`.

The headset scene remains usable without the 2D joystick because the steering pads live inside the world.

## System spatial windows

`ForkSpatialLayout` detects optional `ViroSpatialSceneProvider`, `ViroSpatialWindow` and layout-support exports from the mikevocalz Viro fork.

- Quest can use Meta Layout system windows when the fork is enabled.
- Pico uses the shared Viro/OpenXR scene and inline window fallback.
- Web uses the Viro browser renderer.

## Use the mikevocalz Viro fork

The Quest/PICO development target is `mikevocalz/viro#decax9-three-panel`. Because this starter repository is public while that fork is private, the checked-in catalog keeps `@reactvision/react-viro@3.0.1` as an unauthenticated install/CI fallback. For real headset development, enable the private fork so PICO routing, OpenXR additions, spatial windows and the native Viro/Rive surface are active:

```yaml
overrides:
  "@reactvision/react-viro": "github:mikevocalz/viro#decax9-three-panel"
```

Then run:

```bash
pnpm install
pnpm spatial:prepare-web
pnpm skia:prepare-web
```

## Quest + Meta Layout SDK

The Expo app declares `@metavr/layout-compat` and `@metavr/layout-window-compat` directly. The Viro plugin config enables AR, Quest and Pico, with Meta spatial layouts enabled for Quest and inline/Viro fallback elsewhere.

## Assets / Metro

`apps/mobile/metro.config.js` keeps Expo SDK 58's resolver and adds authored spatial formats including `.riv`, GLB/GLTF, OBJ/MTL/FBX, HDR/EXR, KTX/KTX2, splat data and WASM.

## Routes

- Next: `/spatial`
- Expo: drawer → **Spatial**

Both mount the same `SpatialScreen`.

## Design and interaction references

- NeonBlade Grid Scene: https://neonbladeui.neuronrush.com/components/backgrounds/grid-scene
- NeonBlade Glyph City: https://neonbladeui.neuronrush.com/components/backgrounds/glyph-city
- ReactVision Viro sample app AR Car Driving: https://github.com/ReactVision/sample-app/tree/main/Screens/ARDrivingCarDemo
- Legacy Viro AR Driving Car sample: https://github.com/viromedia/viro/tree/master/code-samples/js/ARDrivingCarDemo

These are implementation references only. The starter's Skia backgrounds, product UI and Viro race are newly authored.

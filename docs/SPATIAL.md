# Spatial-Solotio-Starter runtime

Spatial-Solotio-Starter is a spatial-first Expo SDK 58 / Next starter with a deliberately layered renderer:

- **Tailwind 4 + Uniwind** for ordinary product UI on native.
- **React Native Skia 2.13** for universal GPU-drawn 2D scenes on iOS, Android and web.
- **Rive** for interactive animated UI surfaces.
- **Viro / OpenXR** for immersive 3D on Quest, Pico, web and supported native targets.

## Universal Skia graphics

`@acme/ui` includes three related backgrounds:

- `GridFloor` — scrolling perspective floor.
- `GridScene` — mirrored ceiling + floor planes around a shared horizon.
- `GlyphCity` — deterministic neon city silhouettes, glyph-like vector cells, antenna lights and flying traffic.

The drawing implementations live in `*.skia.tsx` and are shared. Native imports them directly. Web wrappers only load CanvasKit and then load the same Skia component. There is no second CSS/SVG renderer.

CanvasKit is copied to `/canvaskit` for Next, Storybook and Expo web during postinstall by `tooling/copy-skia-web-assets.mjs`.

## Futuristic UI kit

The starter exports `CircuitButton` and `GridCard`. They are normal semantic UI components styled through the existing Tailwind 4 / Uniwind boundary; Skia is reserved for scene graphics.

Storybook includes a **Future Grid** section demonstrating Grid Floor, Grid Scene, the layered Glyph City composition, and futuristic controls/cards.

## XR entryway and Grid race

The `/spatial` route and Expo Spatial drawer screen are an entryway into the immersive sample.

The Viro scene uses an early-computer-world visual grammar without shipping film logos, characters, audio, models or copied production assets: black void, cyan vector grid, warm orange opponent geometry, emissive towers, sparse HUD typography and hard geometric silhouettes.

`GridRaceScene` is a playable starter race:

- auto-forward three-lane cycle motion;
- controller/mouse-click LEFT and RIGHT pads;
- looping obstacle field and score counter;
- cyan player cycle and light trail;
- period-inspired horizon/tower geometry.

For a production racing game, move movement/collision into a deterministic fixed-step simulation and use Viro physics/controller hooks rather than React state as the simulation clock.

## Viro research reference

Viro Media's original sample suite included **AR Driving Car Demo**, which placed a car on a detected surface and let the user drive it around the scene. ReactVision's maintained sample app still lists **AR Car Driving** as functional. That sample is useful as historical input/vehicle reference; the Grid race here is newly authored for Viro/OpenXR.

## System spatial windows

`ForkSpatialLayout` detects optional `ViroSpatialSceneProvider`, `ViroSpatialWindow` and layout-support exports from the mikevocalz Viro fork.

- Quest can use Meta Layout system windows when the fork is enabled.
- Pico uses the shared Viro/OpenXR scene and inline window fallback.
- Web uses the Viro browser renderer.

## Use the mikevocalz Viro fork

The public starter keeps `@reactvision/react-viro@3.0.1` so unauthenticated clones install cleanly. To enable the full fork feature set:

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

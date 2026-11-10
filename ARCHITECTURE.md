# BIT Campus Energy Digital Twin — Architecture & Technical Specification

Bangalore Institute of Technology (BIT) Energy Twin is an institutional microgrid intelligence and automated energy-conservation platform.

```
                           +---------------------------+
                           |  BIT Microgrid Telemetry  |
                           |   (Grid, Solar, Blocks)   |
                           +-------------+-------------+
                                         |
                                         v
+-----------------------+     +-----------------------+     +-----------------------+
|  Edge Computer Vision | --> | Node/Express Backend  | <-- |  Agent-Based Schedule |
| (COCO-SSD / Phone IP) |     |  Synthetic IoT Engine |     |   (1000+ Students)    |
+-----------------------+     +-----------+-----------+     +-----------------------+
                                          |
                               WebSocket / REST
                                          |
                                          v
                              +-----------------------+
                              |   React + Vite Client |
                              |  (Zustand State Store)|
                              +-----------+-----------+
                                          |
              +---------------------------+---------------------------+
              |                           |                           |
              v                           v                           v
     Command Center 2D             Aura AI Energy Coach          Carbon ESG Passport
   Interactive BIT Map            (Gemini + Local Rules)       (Scope 1/2/3 PDF Audit)
```

## 1. System Components

- **Frontend Client (`/client`)**:
  - React 18 with Vite build tooling and Tailwind CSS.
  - Zustand for zero-latency reactive state management (`useCampusStore`, `useTwin3DStore`, `useAuthStore`).
  - Three.js & React Three Fiber modular 3D campus twin.
  - Strata dark glass aesthetic with institutional classic typography (`Plus Jakarta Sans`, `Outfit`, `Cinzel`, `JetBrains Mono`).

- **Backend API & IoT Engine (`/server`)**:
  - Node.js & Express server operating on port 5000.
  - Rule-based synthetic IoT generator simulating 8 campus blocks, solar rooftop generation, and ghost load anomalies.
  - Google Gemini API integration with automatic fallback to offline deterministic heuristic recommendations.
  - WebAuthn passkey demo simulation with role-based governance (Principal, HOD, Faculty, Student, Technician).

## 2. Institutional Telemetry Model

- **Campus Center**: 12.9552° N, 77.5743° E (V.V. Puram, Bengaluru, Karnataka - 560004).
- **Baseline Tariff**: BESCOM HT commercial power at ₹8.25 / kWh.
- **Emission Factor**: Central Electricity Authority (CEA) grid baseline of 0.71 kg CO₂e / kWh.

## 3. Modular 3D Architecture & Dedicated Class View

- **Modular Square Block Classrooms (`Classroom3D.jsx`)**:
  - Distinct architectural room enclosures with warm slate/terrazzo floors and perimeter skirting.
  - Low-cutaway front walls (0.32m) providing 100% unobstructed camera sightlines into the room interior.
  - Smoothly rotating 3-blade aerodynamic ceiling fans (`useFrame`).
  - Seated humanoid student figures with varied department attire, open notebooks, and glowing laptops.
  - Animated teacher figure gesturing at the green chalkboard with chalk stick and swivel motion.
  - Complete electrical infrastructure: Sub-Distribution Board (DB) with circuit breakers, Smart IoT Energy Meter with real-time digital kW readout and pulsing green LED, and EMT conduit pipe runs.
  - Architectural PBR glass windows with aluminum framing and vertical mullions.
  - Ultra-compact floor view micro-pills (`~20px` height) that auto-hide completely during Class View, eliminating all 3D viewport obstruction.

- **Dedicated Class View & Corner HUD Panel (`BitCampus3D.jsx`, `CameraRig.jsx`)**:
  - Smooth cinematic camera transition directly into individual classrooms upon selection.
  - **Corner Telemetry HUD Card**: Docked non-intrusively in the viewport's top-right corner to display live power draw, department, fan status, attendance percentage, and head count while leaving 100% of the 3D scene, glass windows, and interior visible.
  - One-click Class View switcher pills in `TwinNavigationBreadcrumb.jsx` and `CampusFunctionsDock.jsx`.

- **Atmospheric Celestial Sun & Lighting (`scene/environment.jsx`)**:
  - Visible 3D Sun disc and radial golden solar corona at `[75, 110, 65]`.
  - Realistic atmospheric sky dome with horizon radiance.
  - 3-point architectural exterior lighting: warm sunlight (intensity `2.6`), sky ambient fill (`0.95`), cool bluish fill (`0.65`), and warm interior classroom point lights.

## 4. Unslop Design System Guidelines

Adheres to the architectural unslop methodology (`heydamir/unslop`):
- **Core Philosophy**: Chrome is quiet; the real-time interactive 3D digital twin and precision microgrid power curves are the single bright moment.
- **Palette**: Neutral graphite ramp (`#090a0f`, `#0d0c11`, `#131219`) with technical cyan (`#9ff0ec`) and institutional cobalt (`#006bff`) reserved strictly for active states, load heatmaps, and telemetry data. Artificial purple-to-violet gala gradients are strictly forbidden.
- **Typography**: Solid, high-contrast typography (`text-white`, `#d3d3d7`, `#b9b8bb`). Zero gradient text masking (`bg-clip-text text-transparent`). Monospace (`font-mono`) with tabular figures for power (kW), energy (kWh), currency (₹), and occupancy counts.
- **Elevation & Shadows**: Deep dark elevation shadows (`0 1px 3px rgba(0,0,0,0.4)` and `0 12px 32px rgba(0,0,0,0.6)`). Colored glowing box-shadow halos (`shadow-[0_0_...]`) eliminated across cards, buttons, and HUD panels.
- **Border Radii Math**: Calibrated nested geometry:
  - Outer Cards: `12px` to `16px` (`rounded-xl` / `rounded-2xl`)
  - Controls & Inputs: `8px` (`rounded-lg`)
  - Badges & Tags: `6px` (`rounded-md`)
  - `rounded-full` reserved solely for circular avatar photos and status telemetry dots.
- **Controls & Docking**: Zero organic SVG blob shapes. Crisp architectural cards, docked HUD panels, and predictable grid alignments.
- **Motion & Micro-interactions**: Zero jittery hover scaling (`hover:scale-105`), bouncing alerts (`animate-bounce`), or rapid pinging (`animate-ping`). Transitions are subtle, predictable, and fast (`150ms`).
- **Iconography**: Crisp line icons from Lucide. Zero decorative emojis in interface headers, labels, or navigation chrome.
- **Institutional Copy**: Clear, factual, and dignified terminology representing Bangalore Institute of Technology microgrid telemetry without AI marketing buzzwords.

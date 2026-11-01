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
  - Zustand for zero-latency reactive state management (`useCampusStore`, `useAuthStore`, `useIslandStore`).
  - Lucide React iconography and Recharts for time-series power analytics.
  - Strata dark glass aesthetic with subtle ambient canvas particle layers.

- **Backend API & IoT Engine (`/server`)**:
  - Node.js & Express server operating on port 5000.
  - Rule-based synthetic IoT generator simulating 8 campus blocks, solar rooftop generation, and ghost load anomalies.
  - Google Gemini API integration with automatic fallback to offline deterministic heuristic recommendations.
  - WebAuthn passkey demo simulation with role-based governance (Principal, HOD, Faculty, Student, Technician).

## 2. Institutional Telemetry Model

- **Campus Center**: 12.9552° N, 77.5743° E (V.V. Puram, Bengaluru, Karnataka - 560004).
- **Baseline Tariff**: BESCOM HT commercial power at ₹8.25 / kWh.
- **Emission Factor**: Central Electricity Authority (CEA) grid baseline of 0.71 kg CO₂e / kWh.
- **Blocks Monitored**:
  1. BIT Main Block
  2. Administration Block
  3. Engineering Block A
  4. Engineering Block B
  5. Sports Complex & Amenities
  6. Campus Hostel & Mess
  7. EV Charging & Microgrid Hub

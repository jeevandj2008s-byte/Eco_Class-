# AuraSync BIT Energy Twin 🌐⚡

> **Next-Generation Campus Digital Twin for Real-Time Microgrid Telemetry, 3D Architectural Simulation, AI Optimization & Verifiable ESG Governance.**  
> Built for **Bangalore Institute of Technology (BIT)**, Bengaluru, Karnataka, India.  
> Developed with pride by **Eco_Class, BIT**.

---

## 📌 Executive Summary

**AuraSync BIT Energy Twin** is a high-performance, full-stack software platform engineered to transform modern educational campuses into sustainable, self-optimizing microgrids. 

By pairing a real-time **Procedural 3D Architectural Digital Twin** with an intelligent **Ghost Twin Telemetry Engine** and **Privacy-Preserving Edge Computer Vision**, AuraSync continuously calculates the delta between actual institutional energy consumption and occupancy-derived ideal demand. This deterministic insight empowers campus administrators, heads of departments (HODs), faculty, and maintenance crews to isolate phantom electrical loads, automate HVAC/lighting schedules, dispatch maintenance tasks, and produce audit-ready ESG sustainability reports.

---

## ✨ Core Platform Capabilities

### 1. 🏢 Procedural 3D Campus Digital Twin (Three.js & React Three Fiber)
- **Volumetric Solid Architecture:** Accurate procedural 3D models representing the 8 core facilities of the BIT campus:
  - **BIT Main Block:** 4-storey block featuring an open central atrium void, solid extruded walls, interior corridors, entrance canopy, steps, and parapets.
  - **BIT Block 2, Block 3, Block 4, & Block 5:** 3-storey departmental classroom and laboratory wings with recessed reflective glass windows and floor slabs.
  - **BIT Mechanical Block:** Dedicated 2-storey engineering block.
  - **BIT Parking Lot:** Multi-bay vehicle parking facility with EV charging infrastructure and landscaped green zones.
  - **BIT Guest House:** 2-storey residential and administrative guest facility.
- **Level 3 Isometric Floor Cutaway ("Dollhouse View"):** Seamlessly focus on any floor to reveal internal spatial layouts, including classroom boundary walls, doorways, instructor podiums, green/blackboards, ceiling fans, and neat rows of wooden student benches with seated student figures.
- **Axonometric Floor Exploder & X-Ray Vision:** Interactive sliders allow users to vertically explode building floors apart for level-by-level inspection or toggle translucent exterior shells for internal structure tracing.
- **Smart Non-Colliding Billboards:** Low-profile 3D status indicators render minimal pills (`[● BLK-A]`) in broad campus view, expanding into rich telemetry badges (kW draw, live occupancy, floor count) only on hover or selection.

### 2. 🎨 AuraSync Digital Twin Architecture UI System
- **Elevated Dark Glass Surfaces:** High-contrast, clean dark glass panels (`#131219/80`) featuring backdrop blur filters, subtle dual-tone gradient accents, and responsive layout scaling across mobile and desktop.
- **Organized Viewport Dock:** The 3D campus viewer occupies a dedicated hero frame, with all building controllers, hierarchy trees, and telemetry feeds docked neatly underneath without overlapping canvas controls.
- **Signature Organic Blob Buttons:** Tactile action triggers with smooth curved geometry and glowing hover states (`Focus Block →`).
- **Multi-View Control Center:** Modular tabs for **Campus Blocks**, **3D Studio Controls**, **Live Telemetry**, and the **Active Floor Cutaway Inspector**.

### 3. 🗺️ Interactive 2D Spatial Campus Map
- **Geographic Campus Representation:** Vector layout aligned with the real-world footprint of Bangalore Institute of Technology.
- **Real-Time Data Overlays:**
  - **Live Power Heatmap:** Visualizes building-level energy intensity with dynamic color gradients.
  - **Occupancy Flow:** Live tracking of student density across departmental blocks.
  - **Solar Generation:** Rooftop solar PV performance and clean energy generation metrics.

### 4. 👻 Ghost Twin Telemetry & Microgrid Optimization
- **Deterministic Ghost Energy Isolation:** Automatically computes $\Delta \text{kW} = \text{Actual Meter Reading} - \text{Ideal Occupancy Baseline}$, identifying active power draw in unoccupied classrooms and after-hours idle circuits.
- **Autonomous Hierarchical Actuation:**
  - **Preset Modes:** Gentle (comfort-first, 20m delay), Balanced (BEE sweet spot, 15m delay, 24–25°C), and Aggressive (maximum savings, 8m delay, 26°C peak shed).
  - **Immune Critical Loads:** Protected software relays prevent accidental shutdown of critical infrastructure (Central Server Racks, Precision CRAC ACs, Elevator Cabins, Emergency Lighting, and Water Supply Boosters).
  - **Passkey PIN Safeguard:** Software digital relays are gated behind cryptographic PIN verification.

### 5. 👁️ Privacy-Preserving Edge Computer Vision ("Vision Lab")
- **100% In-Browser Local Inference:** Occupancy detection is processed entirely on the client device using lightweight models (TensorFlow.js / MediaPipe).
- **Zero Video Exfiltration:** No raw video streams, camera frames, or identifiable facial data are ever transmitted or saved to external servers, strictly safeguarding student and staff privacy.
- **Smartphone Camera WebRTC Pairing:** Seamless QR-code pairing to allow any authorized mobile device to function as an edge occupancy sensor.

### 6. 🛠️ Campus Incident Helpdesk & Action Center
- **3-Tap Waste Reporting:** Students and staff can rapidly report flickering lights, malfunctioning ACs, water leaks, or unattended equipment.
- **Role-Based Kanban Dispatch:** Administrative and HOD triage board with automated Smart-Assign to active campus maintenance personnel.
- **Evidence Verification:** Mandatory before/after photographic proof required prior to closing maintenance tickets.

### 7. 🌿 ESG & Carbon Accounting Hub
- **Scope 1, 2, and 3 Accounting:** Continuous greenhouse gas quantification calibrated to the Indian national grid emission factor ($0.71\text{ kg CO}_2\text{e/kWh}$) and BESCOM commercial HT electricity tariffs ($₹8.25\text{/kWh}$).
- **Automated Green Audit Reports:** One-click generation of institutional sustainability PDFs for accreditation and governance review.

---

## 🔒 Security & Privacy Architecture

Security and privacy are engineered into every layer of AuraSync:

| Security Vector | Implementation Details |
| :--- | :--- |
| **Zero Secrets in Repository** | All credentials, private tokens, and salts are stored exclusively in uncommitted `.env` files (enforced by `.gitignore`). |
| **No Exposed Public APIs** | Backend communication is strictly proxied and authenticated; no sensitive third-party API keys are exposed to the browser. |
| **Data Privacy & Compliance** | Video feeds analyzed by the Vision Lab are processed purely in client-side volatile memory; zero frames are persisted or exfiltrated. |
| **Relay Actuation Protection** | High-voltage load sheds and campus operational preset modifications require PIN / Passkey authorization. |
| **Defensive HTTP Headers** | Express backend utilizes **Helmet** for HTTP security headers and strict Content Security Policies. |
| **Rate Limiting & Sanitization** | `express-rate-limit` prevents brute-force attempts on API endpoints, paired with `express-validator` payload sanitization. |
| **Authentication & Tokens** | Short-lived JSON Web Tokens (JWT) paired with secure HTTP-only refresh token rotation. |

---

## 🛠️ Technology Stack

### Frontend Client
- **Framework:** React 18 with Vite
- **3D Graphics & Animation:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling & Motion:** Tailwind CSS, Framer Motion, Lucide Icons
- **State Management:** Zustand
- **Edge AI:** `@tensorflow/tfjs`, `@tensorflow-models/coco-ssd`
- **Charting & Exports:** Recharts, jsPDF, jsPDF-AutoTable

### Backend Server
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4
- **Real-Time Layer:** Socket.io (bi-directional WebSocket telemetry stream)
- **Security:** Helmet, CORS, bcryptjs, jsonwebtoken, otplib, express-rate-limit
- **AI Synthesis:** Google GenAI SDK (`@google/genai`) with offline rule-based fallback

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** `v18.x` or `v20.x+`
- **npm:** `v9.x` or `v10.x+`

### 2. Installation
Clone the repository and install all workspace dependencies:
```bash
# 1. Clone repository
git clone https://github.com/[YOUR-ORGANIZATION]/bit-energy-twin.git
cd bit-energy-twin

# 2. Install root, server, and client dependencies
npm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory from the provided template:
```bash
cp server/.env.example server/.env
```

Open `server/.env` and configure your local development parameters:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Authentication Secrets (generate random strings for local development)
JWT_SECRET=your_local_jwt_secret_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_local_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d
PASSKEY_SALT=your_local_passkey_salt_here

# Optional: Google Gemini API Key for Aura AI Coach (offline fallback is built-in)
GEMINI_API_KEY=

# Institutional Energy Parameters
DEFAULT_EMISSION_FACTOR=0.71
DEFAULT_TARIFF_INR=8.25
SANCTIONED_DEMAND_KVA=750
```

### 4. Database Seeding (Local Development)
Populate mock telemetry streams, campus building assets, student rosters, and demo role accounts:
```bash
npm run seed
```

### 5. Running the Application
Launch both the backend API server and the Vite client concurrently:
```bash
npm run dev
```

- **Frontend Client:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## 🏗️ Production Build & Verification

To verify that the frontend and backend build cleanly for production deployment:
```bash
# Build the client for production
npm run build:client

# Start production server
npm start
```

---

## 👥 Local Demo Roles (Evaluation Only)

When evaluating the platform locally after running `npm run seed`, the application includes role-specific test personas accessible via 1-click test chips on `/login`:

- **Demo Principal (Admin):** Full institutional overview, microgrid preset overrides, passkey-protected relay actuation.
- **Demo HOD (AIML):** Departmental telemetry, student occupancy heatmaps, maintenance triage dispatch.
- **Demo Faculty:** Classroom-level environmental controls and schedule monitoring.
- **Demo Student:** Energy waste reporting, personal eco-score, and campus sustainability announcements.
- **Demo Maintenance Worker:** Mobile action ticket checklist, before/after photographic resolution submission.

*(Note: For production deployments, all test accounts must be cleared and replaced with enterprise SSO or LDAP authentication.)*

---

## 📂 Project Structure

```text
bit-energy-twin/
├── client/                               # Frontend React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── campus/                  # 3D and 2D Campus visualizers
│   │   │   │   ├── twin3d/              # Three.js procedural building models & shaders
│   │   │   │   │   ├── CampusScene.jsx  # Main 3D canvas scene & lighting
│   │   │   │   │   ├── Building3D.jsx   # Volumetric building geometry & windows
│   │   │   │   │   ├── Floor3D.jsx      # Isometric floor cutaway & classroom layout
│   │   │   │   │   ├── ParkingLot.jsx   # EV parking bay & vehicle models
│   │   │   │   │   └── CampusFunctionsDock.jsx # AuraSync Digital Twin Architecture dock
│   │   │   │   ├── BitCampus3D.jsx      # Responsive 3D viewport container
│   │   │   │   └── CampusMap2D.jsx      # Vector 2D spatial map
│   │   │   ├── common/                  # Reusable navigation, footer & dialog components
│   │   │   └── dynamic-island/          # Physics-based HUD notification island
│   │   ├── config/                      # Procedural building footprints & campus data
│   │   ├── store/                       # Zustand state management
│   │   └── utils/                       # Carbon math & formatting helpers
│   └── package.json
│
├── server/                               # Backend Express & IoT simulation engine
│   ├── src/
│   │   ├── config/                      # Institution statements, grid factors & tariff config
│   │   ├── controllers/                 # Route controllers for telemetry, auth, and tickets
│   │   ├── middleware/                  # JWT auth, RBAC, rate-limiting & error handlers
│   │   ├── routes/                      # RESTful API endpoints
│   │   ├── scripts/                     # Mock database seeder
│   │   └── server.js                    # Server entrypoint with Socket.io engine
│   ├── .env.example                     # Sanitized environment template
│   └── package.json
│
├── package.json                          # Workspace orchestration scripts
└── README.md                             # Platform documentation
```

---

## 🏛️ Institutional Credit & Governance

- **Institution:** [Bangalore Institute of Technology (BIT)](https://bit-bangalore.edu.in/)
- **Campus Address:** K.R. Road, V.V. Puram, Bengaluru, Karnataka, India - 560004
- **Curated By:** **Eco_Class, BIT**
- **Default Regulatory Framework:** Central Electricity Authority (CEA) India CO₂ emission factors & BESCOM Commercial HT-2A tariff structures.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — engineered for institutional sustainability research, smart campus innovation, and open energy data governance.

<div align="center">
  <img src="public/banner.png" alt="STEM-X Engine Banner" width="100%" />
</div>

# ⚛️ STEM-X: Interactive Academic STEM Simulation Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-8E75B2?logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

An interactive, high-precision STEM simulation engine and pedagogical learning platform built entirely around the **Vietnamese High School Grade 10 Physics curriculum (GDPT 2018)**, with synchronized dual-textbook mapping for *Kết nối tri thức với cuộc sống (KNTT)* and *Chân trời sáng tạo (CTST)*.

---

## 📚 Topics Covered

STEM-X contains **8 curriculum chapters and 27 structured lessons** in `src/data/curriculumData.ts`, with theory notes, formulas, quizzes, textbook references, and linked laboratory activities.

| Curriculum area | Topics and lessons |
| :--- | :--- |
| **Introduction** | Getting started with physics; physics-lab safety rules; measurement and experimental-error analysis. The introduction also surveys mechanics, electricity and electromagnetism, optics, acoustics, thermal physics, nuclear and quantum physics, and relativity. |
| **Kinematics** | Displacement and distance; speed and velocity; measuring the speed of a moving object; displacement-time graphs; changing motion and acceleration; uniformly accelerated linear motion; free fall; measuring gravitational acceleration; projectile motion. |
| **Dynamics** | Vector addition and resolution of forces; force equilibrium; Newton's first law; Newton's second law and inclined-plane motion; Newton's third law. |
| **Energy, Work, and Power** | Energy and mechanical work; power and efficiency; mechanical energy and the law of conservation of mechanical energy. |
| **Momentum** | Linear momentum and impulse; conservation of momentum; air-track collisions. |
| **Circular Motion** | Uniform circular motion and centripetal force; centripetal acceleration and force. |
| **Solids and Fluids** | Elastic deformation and Hooke's law; density and fluid pressure; hydrostatic pressure; Archimedes' buoyant force. |
| **Circuits and Mechanical Waves** | Ohm's law; series and parallel DC circuits; electrical power/Joule heating; mechanical waves; wavelength, frequency, and period; two-source wave interference. |

The simulation library extends the curriculum with relative-velocity river crossing, orbital mechanics, and the photoelectric effect.

---

## 📸 Preview

<br />

| Lab Overview | Dynamic Simulation & Analysis |
| :---: | :---: |
| ![Dashboard & Explorer](public/image-5.png) | ![Lab Simulation Canvas](public/image.png) |
| **Curriculum Cross-Mapping** | **Real-Time Data Visualization** |
| ![Textbook Comparison](public/image-1.png) | ![Interactive Graphing](public/image-2.png) |

---

## 🧪 Interactive Simulation Labs

### 1. 🚀 Projectile Motion Lab (`projectile-motion`)
* **Physics Domain:** 2D Kinematics, vector decomposition, launch angles, and gravitational trajectories.
* **Curriculum Alignment:** KNTT Bài 12 (Tr. 49) • CTST Bài 9 (Tr. 50).
* **Core Model:**
  $$x(t) = v_0 \cos(\alpha) \cdot t, \quad y(t) = h + v_0 \sin(\alpha) \cdot t - \frac{1}{2}gt^2$$
  $$L = \frac{v_0^2 \sin(2\alpha)}{g}, \quad H = \frac{v_0^2 \sin^2(\alpha)}{2g}$$

### 2. 🧱 Newton's Dynamics & Friction Lab (`newton-dynamics`)
* **Physics Domain:** Newton's Laws 1–3, free-body force analysis, kinetic friction, and inclined plane mechanics.
* **Curriculum Alignment:** KNTT Bài 14–20 (Tr. 60) • CTST Bài 10–13 (Tr. 55).
* **Core Model:**
  $$F_{\text{net}} = m \cdot a, \quad F_{\text{ms}} = \mu N = \mu m g \cos(\alpha), \quad a = g(\sin\alpha - \mu\cos\alpha)$$

### 3. 🎢 Mechanical Energy Conservation Lab (`energy-conservation`)
* **Physics Domain:** Kinetic energy, gravitational potential energy, conservative fields, simple pendulums, and roller coaster tracks.
* **Curriculum Alignment:** KNTT Bài 25–26 (Tr. 99) • CTST Bài 17 (Tr. 105).
* **Core Model:**
  $$W = W_đ + W_t = \frac{1}{2}mv^2 + mgh = \text{constant}$$

### 4. 💥 Momentum & Air Track Collision Lab (`momentum-collision`)
* **Physics Domain:** Linear momentum vectors, isolated systems, elastic vs. inelastic (soft) collisions with photogate timing.
* **Curriculum Alignment:** KNTT Bài 28–30 (Tr. 110) • CTST Bài 18–19 (Tr. 114).
* **Core Model:**
  $$\vec{p} = m\vec{v}, \quad m_1 v_1 + m_2 v_2 = (m_1 + m_2)v', \quad F\Delta t = \Delta p$$

### 5. 🔄 Uniform Circular Motion & Centripetal Force (`circular-motion`)
* **Physics Domain:** Angular velocity, tangential velocity, centripetal acceleration, and vehicle road-banking safety limits.
* **Curriculum Alignment:** KNTT Bài 31–32 (Tr. 120) • CTST Bài 20–21 (Tr. 126).
* **Core Model:**
  $$v = \omega r, \quad a_{\text{ht}} = \frac{v^2}{r} = \omega^2 r, \quad F_{\text{ht}} = m \frac{v^2}{r}, \quad v_{\text{max}} = \sqrt{\mu g r}$$

### 6. 🪢 Elastic Deformation & Hooke's Law Lab (`hooke-elasticity`)
* **Physics Domain:** Solid deformation, vertical spring-mass equilibrium, stiffness coefficient ($k$), and elastic energy.
* **Curriculum Alignment:** KNTT Bài 33 (Tr. 128) • CTST Bài 22–23 (Tr. 136).
* **Core Model:**
  $$F_{\text{dh}} = k \cdot |\Delta l|, \quad k \Delta l = mg, \quad W_{\text{dh}} = \frac{1}{2} k (\Delta l)^2$$

### 7. 📈 Displacement-Time & Error Analysis Lab (`displacement-time`)
* **Physics Domain:** 1D/2D displacement vs. distance, real-time $d-t$ kinematic slope interpretation, and experimental error propagation.
* **Curriculum Alignment:** KNTT Bài 3–7 (Tr. 15–34) • CTST Bài 3–4 (Tr. 16–28).
* **Core Model:**
  $$v = \frac{\Delta d}{\Delta t}, \quad \bar{A} = \frac{1}{n}\sum_{i=1}^n A_i, \quad \delta A = \frac{\Delta A}{\bar{A}} \times 100\%$$

### 8. ⚡ DC Electric Circuit & Ohm's Law Lab (`electric-circuit`)
* **Physics Domain:** DC circuit analysis, series and parallel topologies, branch currents, and Joule heating dissipation.
* **Curriculum Alignment:** KNTT & CTST Chuyên đề Mạch điện một chiều.
* **Core Model:**
  $$I = \frac{U}{R}, \quad P = UI = I^2 R = \frac{U^2}{R}, \quad \frac{1}{R_{\text{parallel}}} = \frac{1}{R_1} + \frac{1}{R_2}$$

### 9. 🌊 Mechanical Waves & Wave Interference Lab (`wave-interference`)
* **Physics Domain:** Sinusoidal wave propagation, wavelength, frequency, and coherent two-source interference fringes.
* **Curriculum Alignment:** KNTT & CTST Chuyên đề Sóng cơ học.
* **Core Model:**
  $$\lambda = v \cdot T = \frac{v}{f}, \quad \text{Constructive: } \Delta d = k\lambda, \quad \text{Destructive: } \Delta d = (k + 0.5)\lambda$$

### 10. 🪐 Orbital Mechanics Lab (`orbital-mechanics`)
* **Physics Domain:** Newtonian universal gravitation, orbital velocity, Keplerian motion, and gravitational potential wells.
* **Core Model:**
  $$F_g = G \frac{M m}{r^2}, \quad v_{\text{orbit}} = \sqrt{\frac{GM}{r}}$$

### 11. 📏 Experimental Uncertainty & Pisa Tower Drop Lab (`measurement-error`)
* **Physics Domain:** Instrumental and random error, repeated measurements, uncertainty propagation, Galileo's experimental method, and free-fall comparison with air resistance.

### 12. 🛶 Relative Velocity & River Crossing Vector Lab (`vector-velocity`)
* **Physics Domain:** Relative and absolute velocity, vector addition, current drift, crossing time, and the heading needed for a perpendicular crossing.

### 13. 🚦 Digital Photogate Timer MC-964 Lab (`photogate-mc964`)
* **Physics Domain:** Photogate timing modes, instantaneous velocity, average velocity, and acceleration from measured passage times.

### 14. 📈 Uniformly Accelerated Motion Graphing Studio (`motion-graph`)
* **Physics Domain:** Acceleration and real-time $v-t$, $d-t$, and $a-t$ graphs for uniform motion, speeding up, slowing down, and turning points.

### 15. 🪂 Free-Fall & Gravitational Acceleration Lab (`free-fall`)
* **Physics Domain:** Vacuum free fall, Newton's tube, photogate timing, the $h-t^2$ relationship, and experimental determination of $g$.

### 16. 🌊 Hydrostatic Pressure & Archimedes Lab (`fluid-pressure`)
* **Physics Domain:** Density, gauge and absolute fluid pressure, U-tube manometers, hydrostatic pressure with depth, and buoyancy.

### 17. 💡 Photoelectric Effect Lab (`photoelectric-effect`)
* **Physics Domain:** Photon energy, work function, threshold wavelength and frequency, photoelectron kinetic energy, stopping potential, photocurrent, and Einstein's photoelectric equation.

---

## 🎥 YouTube Learning Videos

The simulation learning materials include a related video or companion simulation
resource for guided pre-lab study. Topics 9 and 12 only include simulations
because a dedicated walkthrough is not included.

| # | Lab topic | Video or companion resource |
| :---: | :--- | :--- |
| 1 | Projectile Motion | [Khan Academy: Projectile motion](https://www.youtube.com/watch?v=txJP95lBv98) |
| 2 | Newton's Dynamics & Friction | [Forces on an Inclined Plane](https://www.youtube.com/watch?v=e8QzglecJmM) |
| 3 | Mechanical Energy Conservation | [Conservation of Energy & LOL Diagrams](https://www.youtube.com/watch?v=nEOEP3WwNxw) |
| 4 | Momentum & Collisions | [1D Collision Simulation](https://www.youtube.com/watch?v=zqB0zt8-N6g) |
| 5 | Circular Motion | [Orbital Motion Explained](https://www.youtube.com/watch?v=FhM9SeQwsMw) |
| 6 | Hooke's Law | [Intro to Springs and Hooke's Law](https://www.youtube.com/watch?v=Xvf8HAbXQEE) |
| 7 | Displacement-Time | [Moving Man Activity Walkthrough](https://www.youtube.com/watch?v=AJBaLUn3ooQ) |
| 8 | DC Circuits & Ohm's Law | [Introduction to DC Circuits](https://www.youtube.com/watch?v=R6Pys29oRaQ) |
| 10 | Orbital Mechanics | [Universal Gravity Lab Instructions](https://www.youtube.com/watch?v=Hu2qtWMJIxg) |
| 11 | Measurement Error | [Free Fall Physics Lab](https://www.youtube.com/watch?v=50UM3nxQ_Mw) |
| 13 | Photogate Timer MC-964 | [Photogate Timing Demonstration](https://www.youtube.com/watch?v=dpihw-OiKYQ) |
| 14 | Motion Graphing | [Moving Man Activity Walkthrough](https://www.youtube.com/watch?v=AJBaLUn3ooQ) |
| 15 | Free Fall | [Free Fall Physics Lab](https://www.youtube.com/watch?v=50UM3nxQ_Mw) |
| 16 | Fluid Pressure & Archimedes | [Fluid Mechanics Introduction](https://www.youtube.com/watch?v=nuohmaVci1Q) |
| 17 | Photoelectric Effect | [Photoelectric Effect — A Level Physics](https://www.youtube.com/watch?v=5gMNyahBaT8) |

The complete descriptions and quick-reference list are also available in
[`YOUTUBE.md`](YOUTUBE.md).

---

## 🏛️ System Architecture

STEM-X is a React single-page application with a dual server/API deployment model.
The architecture is organized into a client layer, physics rendering layer,
AI/knowledge layer, API layer, and local persistence layer. The text map below is
intentionally plain so it remains readable in GitHub, mobile browsers, terminal
viewers, and screen readers.

```text
STEMX PHYSICS LEARNING PLATFORM
+-- Client layer: React 19 + Vite 6 + Tailwind CSS v4
|   +-- React Router v7
|   +-- App Context and progress store
|   +-- Bilingual engine (Vietnamese / English)
|   +-- Simulation hub with 17 interactive labs
|   +-- Curriculum Explorer (KNTT vs CTST)
|   +-- Concept quizzes and mastery evaluator
|   +-- Page-aware RAG AI assistance chatbot
|
+-- Computation and rendering engines
|   +-- Interactive 60 FPS Canvas and vector physics
|   +-- Real-time Recharts kinematic plotter
|   +-- KaTeX LaTeX formula renderer
|   +-- DOMPurify and Marked Markdown parser
|
+-- AI and knowledge-grounding layer
|   +-- Current route, lesson, theory, formulas, and lab variables
|   +-- KNTT and CTST textbook PDFs in public/files/
|   +-- Gemini 2.5 Flash via @google/genai
|   +-- Google Search grounding when current information is needed
|   +-- Offline fallback pedagogical engine
|
+-- Backend and serverless API layer
|   +-- Express.js server route: POST /api/chat
|   +-- Vercel Serverless Function: /api/chat
|   +-- Health endpoints: GET /api/health
|
+-- Persistence layer
    +-- Client-side LocalStorage for profile and progress

Main connections:

Client App Context --> LocalStorage
AI Tutor Assistant --> POST /api/chat
POST /api/chat --> Express.js server or Vercel function
API layer --> Page context + curriculum context + textbook PDFs
API layer --> Gemini 2.5 Flash
Gemini 2.5 Flash --> Google Search grounding when needed
API layer --> Offline fallback when the AI service is unavailable
```

In everyday use, the flow is:

1. Students interact with simulations, curriculum content, quizzes, and the AI tutor in the React client.
2. The computation engines draw simulations, charts, formulas, and sanitized Markdown responses.
3. The AI tutor sends context-rich requests through either the Express server or the Vercel `/api/chat` function.
4. The API layer grounds Gemini with the current page context and both local curriculum textbook PDFs, and can enable Google Search grounding.
5. App profile and learning progress are saved locally in the browser with `localStorage`.

### 🤖 RAG AI Assistance Chatbot with Page Context

STEM-X includes a page-aware, textbook-grounded RAG-style AI assistance chatbot.
The floating tutor remains available while a student is reading theory or running a
simulation, so questions can be answered against the activity currently on screen.

The client builds the context package from the active page before calling
`POST /api/chat`:

* **Page context:** current route, page type, simulation ID, simulation title, and current language.
* **Curriculum context:** the matching KNTT and CTST lesson references from the curriculum data.
* **Learning context:** the active lesson theory, key formulas, quiz scope, and recent chat messages.
* **Live experiment context:** the current simulation variables registered by the lab.
* **Knowledge grounding:** `public/files/kntt.pdf` and `public/files/ctst.pdf` are loaded once per server process, converted to inline PDF data, and included in Gemini `generateContent` requests.

The API uses Gemini 2.5 Flash with Google Search grounding, responds in Vietnamese
or English according to the UI language, and falls back to a local pedagogical
response when `GEMINI_API_KEY` is unavailable. The current implementation is
document-grounded prompt retrieval: it does not use a vector database, embeddings,
or the Gemini Files API.

---

## 🔄 Complete User Flow

The application supports a repeating learn, experiment, assess, and review cycle.
This chart shows the main routes a student can take from opening STEM-X to
checking progress and choosing the next activity.

```text
[1. Open STEM-X]
        |
        v
[2. App shell loads]
    Load language, saved progress, navigation, and AI Tutor
        |
        v
[3. Dashboard]
    See overall progress, completed labs, recommended focus, and next lab
        |
        +--> [Curriculum Explorer]
        |         |
        |         v
        |     [Compare KNTT and CTST]
        |         |
        |         v
        |     [Select lesson or topic]
        |
        +--> [Simulation Hub]
        |         |
        |         v
        |     [Choose a physics lab]
        |         |
        |         v
        |     [Run the experiment]
        |
        +--> [Theory Notes]
        |         |
        |         v
        |     [Choose a chapter and read theory, formulas, and objectives]
        |
        \--> [Progress]
                  |
                  v
              [Review mastery, completion, and recent activity]

All learning routes continue to the active lesson or lab:

[Adjust controls and observe the experiment]
    Canvas, vectors, measurements, and charts
        |
        v
[Ask the page-aware RAG AI Tutor?]
        | No
        |------------------------------+
        |                              |
        | Yes                          v
        v                    [Take the Concept Quiz]
[Send current page and lesson context] |
        |                              v
        v                    [Answer each question]
[Receive guided explanation]            |
  Gemini/Search or offline fallback    v
        |                    [Immediate feedback and explanations]
        +------------------------------+
                       |
                       v
              [Quiz score and mastery update]
                   |                 |
                   | Score >= 50%    | Score < 50%
                   v                 v
            [Lab marked complete]  [Review theory and repeat
                   |                 the experiment]
                   +-----------------+
                            |
                            v
              [Save progress and activity]
              LocalStorage + optional sync
                            |
                            v
              [Return to Dashboard]
              [Choose the next recommended lab]
```

The AI Tutor remains available from the main learning views. It receives the
active lesson or simulation context, including relevant theory, formulas, and
variables, so the student can ask for guidance without leaving the activity.

---

## 🌟 Key Architecture Highlights

* **Dual Vietnamese Curriculum Mapping Engine (GDPT 2018):** Synchronized side-by-side mapping for all Grade 10 Physics chapters between the two official textbook series *Kết nối tri thức với cuộc sống (KNTT)* and *Chân trời sáng tạo (CTST)* with exact textbook pages, lesson IDs, and figures. The platform does not support Cambridge (IGCSE/A-Level) or AP curricula.
* **Page-aware RAG AI assistance chatbot:** A Gemini 2.5 Flash tutor powered by `@google/genai` that combines the current route, lesson theory, formulas, KNTT/CTST mappings, live simulation variables, and both local textbook PDFs. It supports Vietnamese/English responses, Google Search grounding, and an offline heuristic fallback.
* **Interactive 60 FPS Physics Engine:** Custom HTML5 Canvas and React state loop delivering real-time variable manipulation, trajectory trace paths, animated force vectors, and photogate sensor measurements.
* **Mastery Analytics & Anti-Double Counting:** Real-time concept mastery tracking, quiz scoring with textbook justification, and persistent progress logging.
* **Full Bilingual Internationalization (i18n):** Instant dynamic language switching between Vietnamese (`VN`) and English (`ENG`) across all interfaces, formulas, quizzes, and AI responses.
* **Dual Deployment Ready:** Seamlessly runs as a unified Node.js/Express server (via `server.ts` and `esbuild`) or as a Vite SPA with Vercel Serverless Functions (`api/chat.ts`). Both paths expose the same `/api/chat` contract.

---

## 🗂️ Project Directory Structure

```text
stemx/
├── api/                        # Vercel Serverless Functions
│   ├── chat.ts                 # Page-aware textbook-grounded AI endpoint
│   └── health.ts               # Health check endpoint
├── public/                     # Static assets, PDFs, and preview screenshots
│   └── files/
│       ├── ctst.pdf            # CTST textbook grounding source
│       └── kntt.pdf            # KNTT textbook grounding source
├── src/
│   ├── components/
│   │   ├── ai/                 # AI Tutor UI assistant & chat drawer
│   │   ├── common/             # LaTeX renderer (KaTeX) & Markdown components
│   │   ├── curriculum/         # KNTT & CTST Curriculum Explorer
│   │   ├── dashboard/          # Student dashboard & recommended focus
│   │   ├── layout/             # Responsive TopBar, Sidebar, and App Shell
│   │   ├── progress/           # Mastery progress & learning activity log
│   │   ├── quiz/               # Multi-question concept quizzes & evaluations
│   │   ├── simulations/        # 17 STEM interactive physics labs
│   │   └── theory/             # Structured lesson notes & formulas
│   ├── context/
│   │   └── AppContext.tsx      # Global state, theme, language, and progress
│   ├── data/
│   │   ├── curriculumData.ts   # 8 chapters / 27 Grade 10 lessons & quizzes
│   │   ├── mockData.ts         # Simulation metadata & formula registry
│   │   └── physicsTheoryData.ts# Detailed theoretical models & formulas
│   ├── lib/
│   │   ├── aiTutor.ts          # Context-aware AI API caller & live state bridge
│   │   └── supabaseClient.ts   # LocalStorage profile/progress adapter (Not yet Implemented)
│   ├── types/                  # TypeScript interface declarations
│   ├── App.tsx                 # Route declarations & layout provider
│   ├── i18n.ts                 # Vietnamese & English dictionary
│   ├── index.css               # Tailwind CSS v4 styling rules
│   └── main.tsx                # Application bootstrap entry point
├── server.ts                   # Express + Vite development & production server
├── vercel.json                 # Vercel routing & serverless configuration
├── vite.config.ts              # Vite 6 + React + Tailwind v4 bundler config
└── package.json                # Dependencies, scripts, and build targets
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: `>= 18.0.0`
* **npm**: `>= 9.0.0`

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Henrycoding-design/STEMX.git
   cd STEMX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   # Server Configuration
   PORT=3000

   # AI Tutor Integration (Optional - Fallback offline tutor activates if omitted)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Progress persistence is browser-local via localStorage.
   # No cloud persistence variables are required.
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Type Check & Lint:**
   ```bash
   npm run lint
   ```

6. **Build for Production:**
   ```bash
   npm run build
   ```

---

## ☁️ Deployment

### 1. Vercel (Recommended)
This repository includes a preconfigured `vercel.json` optimized for Vite SPAs and serverless functions in `/api`:
1. Connect the repository to your [Vercel Dashboard](https://vercel.com).
2. Set Framework Preset to **Vite**.
3. Add environment variables (`GEMINI_API_KEY`, etc.) in the Vercel project settings.
4. Deploy!

### 2. Node.js / Docker / Render
The application can run as a standalone full-stack Node.js server:
```bash
npm run build
npm run start
```

---

## 📜 License

This project is open-source and licensed under the [MIT License](./LICENSE).

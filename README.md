# Interactive Academic STEM Simulation Engine

An interactive STEM simulation engine designed for dual-curriculum exploration, mapping Cambridge (IGCSE 0625 & A-Level) and College Board (AP Physics, AP Chemistry, AP Calculus) benchmarks.

## 🚀 Features

- **8 Interactive Lab Simulations**:
  1. **Projectile Lab**: Kinematics, vector decomposition, launch height, air resistance drag ($F_d = \frac{1}{2}\rho v^2 C_d A$).
  2. **Wave Interference Lab**: Superposition, phase, frequency, two-source interference with path difference calculation.
  3. **Function & Transformation Lab**: Polynomial and trigonometric transformations ($a \cdot f(b(x - c)) + d$), domain/range analysis.
  4. **Chemical Equilibrium Lab**: Le Chatelier’s principle, Haber-Bosch reaction quotient ($Q_c$) vs. equilibrium constant ($K_c$).
  5. **Electric Circuit Lab**: Ohm's Law ($V = IR$), Joule heating power ($P = I^2 R$), Series vs. Parallel topologies.
  6. **Orbital Mechanics Lab**: Kepler's laws, Newtonian gravitational force ($F_g = \frac{G M m}{r^2}$), orbital and escape velocities.
  7. **Reaction Kinetics Lab**: Arrhenius equation ($k = A e^{-E_a / RT}$), Maxwell-Boltzmann molecular collision energy, catalyst effects.
  8. **Calculus & Motion Lab**: Real-time numerical derivatives connecting position $s(t)$, velocity $v(t) = s'(t)$, and acceleration $a(t) = v'(t)$.

- **Curriculum Synchronization**: Unified dual-mapping between Cambridge (IGCSE/A-Level) and AP benchmarks.
- **Dynamic Grading & Analytics**: Instant grading with prevention of double-counting, percentage calculations, mastery thresholds, and progress tracking.
- **Multilingual UI**: Instant switching between English (ENG), Vietnamese (VN), and French (FR).
- **AI STEM Tutor Widget**: Gemini-powered or offline fallback tutor answering academic questions in lab context.
- **Supabase & Local Persistence Adapter**: Seamless local caching with plug-and-play Supabase cloud synchronization.

---

## 🛠️ Getting Started Locally (VS Code)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide optional keys for Supabase or Gemini:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Type Check / Linter**:
   ```bash
   npm run lint
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ☁️ Deployment

### Vercel
- The project includes `vercel.json` with SPA rewrites out of the box.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### Render
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- Set `NODE_ENV=production`.

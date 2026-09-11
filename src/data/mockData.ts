import { SimulationInfo, TopicMapping, QuizQuestion, MockUser, UserProgress } from "../types";

export const mockUser: MockUser = {
  id: "u1",
  name: "Henry",
  grade: "Grade 10 / IGCSE",
};

export const simulationsData: SimulationInfo[] = [
  {
    id: "projectile-motion",
    title: "Projectile Lab",
    subject: "Physics",
    topic: "Kinematics, vectors, components, projectile motion",
    difficulty: "Beginner",
    curriculumCompatibility: ["IGCSE Physics 0625", "A-Level Physics", "AP Physics 1"],
    description: "Explore the parabolic trajectory of objects in flight under the influence of gravity.",
    formula: [
      "Range (R) = (v² sin 2θ) / g",
      "Max Height (H) = (v² sin² θ) / 2g",
      "Time of Flight (T) = (2v sin θ) / g"
    ],
    theory: "Projectile motion is a form of motion experienced by an object or particle that is projected near the Earth's surface and moves along a curved path under the action of gravity only."
  },
  {
    id: "wave-interference",
    title: "Wave Interference Lab",
    subject: "Physics",
    topic: "Superposition, wavelength, frequency, phase, interference",
    difficulty: "Intermediate",
    curriculumCompatibility: ["IGCSE Physics", "A-Level Physics", "AP Physics 1 / 2"],
    description: "Visualize constructive and destructive interference of overlapping sine waves.",
    formula: [
      "y(x,t) = A sin(kx - ωt)",
      "Constructive: Δφ = 2nπ",
      "Destructive: Δφ = (2n + 1)π"
    ],
    theory: "When two waves meet while traveling along the same medium, the principle of superposition states that the resulting displacement is the sum of the displacements of the individual waves."
  },
  {
    id: "electric-circuit",
    title: "Electric Circuit Lab",
    subject: "Physics",
    topic: "Ohm's law, resistance, series/parallel circuits, power",
    difficulty: "Intermediate",
    curriculumCompatibility: ["IGCSE Physics", "A-Level Physics", "AP Physics 1"],
    description: "Design and test circuits to understand current, voltage, and resistance relationships.",
    formula: [
      "V = IR",
      "P = IV = I²R = V²/R",
      "R_series = R₁ + R₂ + ...",
      "1/R_parallel = 1/R₁ + 1/R₂ + ..."
    ],
    theory: "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points."
  },
  {
    id: "orbital-mechanics",
    title: "Orbital Mechanics Sandbox",
    subject: "Physics",
    topic: "Gravity, circular motion, orbital velocity, energy",
    difficulty: "Advanced",
    curriculumCompatibility: ["A-Level Physics", "AP Physics C: Mechanics"],
    description: "Simulate planetary orbits, gravitational forces, and escape velocities.",
    formula: [
      "F_g = G(m₁m₂)/r²",
      "v = √(GM/r)",
      "T² = (4π²/GM)r³"
    ],
    theory: "Kepler's laws of planetary motion and Newton's law of universal gravitation govern the motion of bodies in space."
  },
  {
    id: "chemical-equilibrium",
    title: "Chemical Equilibrium Lab",
    subject: "Chemistry",
    topic: "Equilibrium, Le Chatelier's principle, concentration, temperature",
    difficulty: "Advanced",
    curriculumCompatibility: ["IGCSE Chemistry", "A-Level Chemistry", "AP Chemistry"],
    description: "Manipulate conditions to observe Le Chatelier's Principle in a reversible reaction.",
    formula: [
      "aA + bB ⇌ cC + dD",
      "K_c = [C]^c [D]^d / [A]^a [B]^b"
    ],
    theory: "Le Chatelier's Principle states that if a dynamic equilibrium is disturbed by changing the conditions, the position of equilibrium shifts to counteract the change."
  },
  {
    id: "reaction-kinetics",
    title: "Reaction Kinetics Lab",
    subject: "Chemistry",
    topic: "Collision theory, concentration, temperature, catalysts, reaction rate",
    difficulty: "Intermediate",
    curriculumCompatibility: ["A-Level Chemistry", "AP Chemistry"],
    description: "Explore how temperature and concentration affect reaction rates through collision theory.",
    formula: [
      "Rate = k[A]^m[B]^n",
      "k = Ae^(-Ea/RT)"
    ],
    theory: "The rate of a chemical reaction is proportional to the number of effective collisions between reactant molecules per second."
  },
  {
    id: "function-explorer",
    title: "Function & Transformation Explorer",
    subject: "Mathematics",
    topic: "Linear/quadratic/trigonometric functions, transformations, parameters",
    difficulty: "Intermediate",
    curriculumCompatibility: ["IGCSE Mathematics", "A-Level Mathematics 9709", "AP Precalculus"],
    description: "Graph linear, quadratic, and trigonometric functions dynamically.",
    formula: [
      "y = ax + b",
      "y = a(x - h)² + k",
      "y = A sin(B(x - C)) + D"
    ],
    theory: "Functions represent a relationship between input and output variables. Changing mathematical coefficients directly transforms the graphical representation."
  },
  {
    id: "calculus-motion",
    title: "Calculus Motion Lab",
    subject: "Mathematics",
    topic: "Derivatives, integrals, velocity, acceleration, displacement",
    difficulty: "Advanced",
    curriculumCompatibility: ["A-Level Mathematics 9709", "AP Calculus AB/BC"],
    description: "Connect position, velocity, and acceleration graphs through calculus operations.",
    formula: [
      "v(t) = s'(t) = ds/dt",
      "a(t) = v'(t) = dv/dt = d²s/dt²",
      "s(t) = ∫ v(t) dt"
    ],
    theory: "The derivative of position yields velocity, and the derivative of velocity yields acceleration. Integration reverses this process."
  }
];

export const curriculumMappings: TopicMapping[] = [
  {
    id: "m1",
    subject: "Physics",
    cambridgeLevel: "IGCSE 0625 / A-Level 9702",
    cambridgeTopic: "Kinematics & Projectile Motion",
    apLevel: "AP Physics 1",
    apTopic: "Kinematics in Two Dimensions",
    simulationId: "projectile-motion"
  },
  {
    id: "m2",
    subject: "Physics",
    cambridgeLevel: "IGCSE / A-Level 9702",
    cambridgeTopic: "Superposition & Wave Interference",
    apLevel: "AP Physics 1 / 2",
    apTopic: "Mechanical Waves & Sound",
    simulationId: "wave-interference"
  },
  {
    id: "m3",
    subject: "Physics",
    cambridgeLevel: "IGCSE 0625 / A-Level 9702",
    cambridgeTopic: "DC Circuits, Ohm's Law & Resistance",
    apLevel: "AP Physics 1 / 2",
    apTopic: "Electric Charge & DC Circuits",
    simulationId: "electric-circuit"
  },
  {
    id: "m4",
    subject: "Physics",
    cambridgeLevel: "A-Level Physics 9702",
    cambridgeTopic: "Gravitational Fields & Planetary Orbits",
    apLevel: "AP Physics C: Mechanics",
    apTopic: "Universal Gravitation & Orbits",
    simulationId: "orbital-mechanics"
  },
  {
    id: "m5",
    subject: "Chemistry",
    cambridgeLevel: "IGCSE / A-Level 9701",
    cambridgeTopic: "Chemical Equilibria & Le Chatelier",
    apLevel: "AP Chemistry",
    apTopic: "Unit 7: Equilibrium & Reaction Quotient",
    simulationId: "chemical-equilibrium"
  },
  {
    id: "m6",
    subject: "Chemistry",
    cambridgeLevel: "IGCSE / A-Level 9701",
    cambridgeTopic: "Reaction Kinetics & Collision Theory",
    apLevel: "AP Chemistry",
    apTopic: "Unit 5: Kinetics & Rate Laws",
    simulationId: "reaction-kinetics"
  },
  {
    id: "m7",
    subject: "Mathematics",
    cambridgeLevel: "IGCSE 0580 / A-Level 9709",
    cambridgeTopic: "Functions & Coordinate Geometry Transformations",
    apLevel: "AP Precalculus",
    apTopic: "Polynomial, Rational & Periodic Functions",
    simulationId: "function-explorer"
  },
  {
    id: "m8",
    subject: "Mathematics",
    cambridgeLevel: "A-Level Mathematics 9709",
    cambridgeTopic: "Kinematics with Differentiation & Integration",
    apLevel: "AP Calculus AB/BC",
    apTopic: "Unit 4: Contextual Applications of Differentiation",
    simulationId: "calculus-motion"
  }
];

export const quizzes: Record<string, QuizQuestion[]> = {
  "projectile-motion": [
    {
      id: "q1",
      simulationId: "projectile-motion",
      question: "If you increase the launch angle from 45° to 60° (keeping velocity constant), what happens to the maximum height and horizontal range?",
      options: [
        "Height increases, Range increases",
        "Height increases, Range decreases",
        "Height decreases, Range increases",
        "Height decreases, Range decreases"
      ],
      correctIndex: 1,
      explanation: "Max range is achieved at 45°. A 60° launch will go higher (greater sin θ) but cover less horizontal distance.",
      conceptTested: "Kinematics & Angles"
    },
    {
      id: "q2",
      simulationId: "projectile-motion",
      question: "What happens to the trajectory if gravity is doubled?",
      options: [
        "Both height and range are halved",
        "Only height is halved",
        "Both height and range are doubled",
        "The object never falls"
      ],
      correctIndex: 0,
      explanation: "Both formulas for Range and Max Height have 'g' in the denominator. Doubling gravity halves both.",
      conceptTested: "Gravitational Effects"
    }
  ],
  "wave-interference": [
    {
      id: "w1",
      simulationId: "wave-interference",
      question: "When two identical waves are completely out of phase (phase difference = 180° or π), what is the result?",
      options: [
        "A wave with double amplitude",
        "A wave with zero amplitude (complete cancellation)",
        "A wave with doubled frequency",
        "A wave traveling backwards"
      ],
      correctIndex: 1,
      explanation: "This is destructive interference. The crests of one wave align with the troughs of the other, cancelling out to zero.",
      conceptTested: "Destructive Interference"
    },
    {
      id: "w2",
      simulationId: "wave-interference",
      question: "Two coherent in-phase waves have individual amplitudes of 3 cm and 4 cm. What is the peak amplitude during constructive interference?",
      options: [
        "1 cm",
        "5 cm",
        "7 cm",
        "12 cm"
      ],
      correctIndex: 2,
      explanation: "According to the principle of superposition, during constructive interference the amplitudes add directly: 3 cm + 4 cm = 7 cm.",
      conceptTested: "Superposition Principle"
    }
  ],
  "electric-circuit": [
    {
      id: "ec1",
      simulationId: "electric-circuit",
      question: "According to Ohm's Law (V = IR), if the circuit resistance is doubled while the source voltage is held constant, what happens to the current and electric power?",
      options: [
        "Current is halved and power is halved",
        "Current is doubled and power quadruples",
        "Current is halved and power quadruples",
        "Current remains unchanged"
      ],
      correctIndex: 0,
      explanation: "Current I = V / R, so doubling R halves I. Power P = V² / R, so doubling R halves the power dissipated.",
      conceptTested: "Ohm's Law & Power"
    },
    {
      id: "ec2",
      simulationId: "electric-circuit",
      question: "In a circuit with two identical resistors connected in parallel (each R = 10 Ω), what is the equivalent total resistance?",
      options: [
        "20 Ω",
        "10 Ω",
        "5 Ω",
        "2.5 Ω"
      ],
      correctIndex: 2,
      explanation: "For two identical resistors in parallel, 1/Req = 1/10 + 1/10 = 2/10, so Req = 10 / 2 = 5 Ω.",
      conceptTested: "Parallel Resistance"
    }
  ],
  "orbital-mechanics": [
    {
      id: "om1",
      simulationId: "orbital-mechanics",
      question: "According to Kepler's Third Law (T² ∝ r³), if a satellite's orbital radius is quadrupled from r to 4r, how does its orbital period change?",
      options: [
        "Increases by a factor of 2",
        "Increases by a factor of 4",
        "Increases by a factor of 8",
        "Decreases by half"
      ],
      correctIndex: 2,
      explanation: "T ∝ r^(3/2). If r is multiplied by 4, T is multiplied by 4^(3/2) = (√4)³ = 2³ = 8 times.",
      conceptTested: "Kepler's Laws & Orbits"
    },
    {
      id: "om2",
      simulationId: "orbital-mechanics",
      question: "How is the escape velocity v_esc related to the stable circular orbital velocity v_circ at the same orbital radius?",
      options: [
        "v_esc = v_circ",
        "v_esc = √2 × v_circ (approx 1.414 × v_circ)",
        "v_esc = 2 × v_circ",
        "v_esc = 0.5 × v_circ"
      ],
      correctIndex: 1,
      explanation: "Circular velocity is √(GM/r) while escape velocity is √(2GM/r) = √2 × v_circ.",
      conceptTested: "Escape Velocity"
    }
  ],
  "chemical-equilibrium": [
    {
      id: "c1",
      simulationId: "chemical-equilibrium",
      question: "For an exothermic reaction A ⇌ B (ΔH < 0), what happens if the temperature of the system is increased?",
      options: [
        "Equilibrium shifts to produce more B",
        "Equilibrium shifts to produce more A (reactants)",
        "Equilibrium position remains unchanged",
        "The reaction stops entirely"
      ],
      correctIndex: 1,
      explanation: "Increasing temperature supplies heat, favoring the endothermic reverse direction. Thus, it shifts left to produce more A.",
      conceptTested: "Le Chatelier's Principle (Temp)"
    },
    {
      id: "c2",
      simulationId: "chemical-equilibrium",
      question: "For the Haber process N₂(g) + 3H₂(g) ⇌ 2NH₃(g), how does increasing the total pressure shift the equilibrium?",
      options: [
        "Shifts to the right towards 2NH₃(g)",
        "Shifts to the left towards N₂ and H₂",
        "Causes the equilibrium constant Kc to double",
        "Has no effect because both sides are gases"
      ],
      correctIndex: 0,
      explanation: "There are 4 moles of gas on the reactant side and 2 moles on the product side. Increasing pressure shifts towards fewer gas moles (right).",
      conceptTested: "Le Chatelier's Principle (Pressure)"
    }
  ],
  "reaction-kinetics": [
    {
      id: "rk1",
      simulationId: "reaction-kinetics",
      question: "According to collision theory and the Arrhenius equation k = Ae^(-Ea/RT), how does a catalyst accelerate a reaction?",
      options: [
        "By raising the kinetic temperature of the reactants",
        "By providing an alternative reaction pathway with lower activation energy (Ea)",
        "By shifting the equilibrium to favor products",
        "By increasing the volume of the reaction chamber"
      ],
      correctIndex: 1,
      explanation: "A catalyst lowers the activation energy Ea, meaning a significantly greater fraction of molecular collisions possess sufficient energy to react.",
      conceptTested: "Catalysts & Activation Energy"
    },
    {
      id: "rk2",
      simulationId: "reaction-kinetics",
      question: "Why does increasing the concentration of reactants increase the initial reaction rate?",
      options: [
        "It increases the velocity of each individual molecule",
        "It increases the collision frequency per unit time per unit volume",
        "It lowers the enthalpy of the reaction",
        "It changes the activation energy"
      ],
      correctIndex: 1,
      explanation: "Higher concentration packs more reactant particles into the space, directly increasing the collision frequency between them.",
      conceptTested: "Collision Theory"
    }
  ],
  "function-explorer": [
    {
      id: "f1",
      simulationId: "function-explorer",
      question: "In the quadratic function y = ax² + bx + c, what happens visually when the leading coefficient 'a' becomes negative?",
      options: [
        "The parabola shifts to the left",
        "The parabola shifts downwards",
        "The parabola opens downwards (reflection across horizontal axis)",
        "The parabola collapses into a linear line"
      ],
      correctIndex: 2,
      explanation: "The coefficient 'a' determines concavity. Positive 'a' opens upwards; negative 'a' reflects the curve downwards.",
      conceptTested: "Quadratic Coefficients"
    },
    {
      id: "f2",
      simulationId: "function-explorer",
      question: "For the trigonometric function y = A sin(Bx), what is the formula for the fundamental period?",
      options: [
        "Period = 2π × |B|",
        "Period = 2π / |B|",
        "Period = |A| / 2π",
        "Period = 1 / B²"
      ],
      correctIndex: 1,
      explanation: "The angular frequency B compresses or stretches the horizontal wave cycle, yielding Period T = 2π / |B|.",
      conceptTested: "Periodic Functions"
    }
  ],
  "calculus-motion": [
    {
      id: "cm1",
      simulationId: "calculus-motion",
      question: "If an object's displacement is s(t), its velocity is v(t) = s'(t), and acceleration is a(t) = v'(t). What physical event occurs when v(t) = 0 and changes sign?",
      options: [
        "The object reaches minimum speed",
        "The object instantaneously stops and changes its direction of motion",
        "The object has reached terminal velocity",
        "The acceleration must be zero"
      ],
      correctIndex: 1,
      explanation: "When velocity passes through zero with a sign change, displacement attains a local extremum (turning point) and the object reverses direction.",
      conceptTested: "Derivatives in Kinematics"
    },
    {
      id: "cm2",
      simulationId: "calculus-motion",
      question: "How is the net displacement between time t = 0 and t = T computed from the velocity function v(t)?",
      options: [
        "By taking the derivative: v'(T)",
        "By evaluating the definite integral: ∫ from 0 to T of v(t) dt",
        "By dividing v(T) by T",
        "By calculating [v(T) - v(0)] / T"
      ],
      correctIndex: 1,
      explanation: "By the Fundamental Theorem of Calculus, the definite integral of velocity with respect to time equals net displacement s(T) - s(0).",
      conceptTested: "Integration in Motion"
    }
  ]
};

// Initial progress state
export const initialProgress: UserProgress = {
  overall: 61,
  physics: 68,
  chemistry: 42,
  mathematics: 74,
  completedSimulations: [],
  conceptMastery: [
    { concept: "Projectile Motion", score: 82, status: "Strong" },
    { concept: "Equilibrium", score: 63, status: "Developing" },
    { concept: "Vectors", score: 54, status: "Needs Review" },
    { concept: "Differentiation", score: 91, status: "Strong" }
  ],
  recentActivity: [
    { id: "e1", type: "quiz_completed", topic: "Quadratic Functions", score: 82, timestamp: Date.now() - 86400000 },
    { id: "e2", type: "simulation_completed", simulationId: "chemical-equilibrium", timestamp: Date.now() - 4000000 }
  ]
};

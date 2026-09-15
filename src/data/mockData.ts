import { SimulationInfo, TopicMapping, QuizQuestion, MockUser, UserProgress } from "../types";

export const mockUser: MockUser = {
  id: "u1",
  name: "Học sinh Lớp 10",
  grade: "Vật lí 10 (KNTT & CTST)",
};

export const simulationsData: SimulationInfo[] = [
  {
    id: "projectile-motion",
    title: "Chuyển động ném ngang & ném xiên",
    titleEn: "Projectile & Launch Motion Lab",
    subject: "Physics",
    topic: "Chuyển động ném, phân tích vecto vận tốc, tầm bay cao và tầm bay xa",
    topicEn: "Projectile motion, velocity vector decomposition, max height & range",
    difficulty: "Cơ bản",
    difficultyEn: "Beginner",
    knttRef: "Chương II - Bài 12 (Trang 49-54)",
    ctstRef: "Chương 3 - Bài 9 (Trang 50-55)",
    curriculumCompatibility: ["KNTT Bài 12", "CTST Bài 9"],
    description: "Khảo sát chuyển động của vật bị ném trong trọng trường: ném ngang (vận tốc ban đầu v₀ song song mặt đất) và ném xiên (góc ném α).",
    descriptionEn: "Investigate horizontal launch and oblique projectile motion under gravity with vector components, max height and range calculations.",
    formula: [
      "Ném ngang: x = v₀·t, y = ½·g·t² => y = (g / 2v₀²)·x²",
      "Thời gian rơi: t = √(2H / g)",
      "Tầm xa ném ngang: L = v₀·√(2H / g)",
      "Ném xiên: Tầm cao H = (v₀²·sin²α) / 2g",
      "Tầm xa ném xiên: L = (v₀²·sin 2α) / g"
    ],
    theory: "Chuyển động ném có thể phân tích thành hai chuyển động thành phần vuông góc độc lập: chuyển động thẳng đều theo phương nằm ngang (Ox) và chuyển động rơi tự do theo phương thẳng đứng (Oy) với gia tốc g.",
    theoryEn: "Projectile motion is decomposed into two orthogonal independent motions: uniform linear motion along the horizontal axis (Ox) and free-fall under gravity along the vertical axis (Oy)."
  },
  {
    id: "newton-dynamics",
    title: "Ba định luật Newton & Mặt phẳng nghiêng",
    titleEn: "Newton's Laws & Friction on Incline",
    subject: "Physics",
    topic: "Định luật I, II, III Newton, lực ma sát trượt và chuyển động trên mặt nghiêng",
    topicEn: "Newton's Laws 1-3, kinetic friction, inclined plane dynamics",
    difficulty: "Trung bình",
    difficultyEn: "Intermediate",
    knttRef: "Chương III - Bài 14, 15, 16, 18, 20 (Trang 60-83)",
    ctstRef: "Chương 4 - Bài 10, 11, 13 (Trang 55-73, 80-86)",
    curriculumCompatibility: ["KNTT Bài 14-20", "CTST Bài 10-13"],
    description: "Khảo sát mối quan hệ giữa lực tác dụng F, khối lượng m và gia tốc a (a = F/m); lực ma sát trượt F_ms = μ·N và bài toán vật trượt trên mặt phẳng nghiêng góc α.",
    descriptionEn: "Explore acceleration under applied forces, Newton's 2nd Law (F = ma), friction forces (F_ms = μN), and motion on inclined planes.",
    formula: [
      "Định luật II Newton: a = F_hl / m (F_hl = m·a)",
      "Lực ma sát trượt: F_ms = μ·N = μ·m·g·cosα",
      "Gia tốc trên mặt phẳng nghiêng: a = g·(sinα - μ·cosα)",
      "Định luật III Newton: F_AB = -F_BA"
    ],
    theory: "Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật (SGK KNTT tr.63, CTST tr.61).",
    theoryEn: "The acceleration of an object is directly proportional to the net force acting on it, in the direction of the net force, and inversely proportional to its mass."
  },
  {
    id: "energy-conservation",
    title: "Cơ năng & Bảo toàn cơ năng (Con lắc & Tàu lượn)",
    titleEn: "Mechanical Energy Conservation",
    subject: "Physics",
    topic: "Động năng, thế năng trọng trường, công cơ học và bảo toàn cơ năng",
    topicEn: "Kinetic energy, gravitational potential energy, mechanical energy conservation",
    difficulty: "Trung bình",
    difficultyEn: "Intermediate",
    knttRef: "Chương IV - Bài 23, 25, 26 (Trang 91-105)",
    ctstRef: "Chương 6 - Bài 15, 16, 17 (Trang 94-113)",
    curriculumCompatibility: ["KNTT Bài 23-26", "CTST Bài 15-17"],
    description: "Mô phỏng sự chuyển hóa qua lại giữa động năng (Wđ = ½mv²) và thế năng (Wt = mgh) của con lắc đơn và vật trượt trên máng cong.",
    descriptionEn: "Simulate dynamic exchange between kinetic and gravitational potential energy for pendulums and coaster tracks under conservative forces.",
    formula: [
      "Động năng: Wđ = ½·m·v²",
      "Thế năng trọng trường: Wt = m·g·h",
      "Cơ năng toàn phần: W = Wđ + Wt = ½·m·v² + m·g·h = hằng số",
      "Vận tốc con lắc tại góc α: v = √(2g·l·(cosα - cosα₀))"
    ],
    theory: "Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực thì cơ năng của vật là một đại lượng bảo toàn: W = Wđ + Wt = const (SGK KNTT tr.103, CTST tr.110).",
    theoryEn: "When an object moves under the influence of gravity alone (conservative force), its total mechanical energy remains constant: E = Ek + Ep = const."
  },
  {
    id: "momentum-collision",
    title: "Động lượng & Thí nghiệm va chạm đệm khí",
    titleEn: "Momentum & Air Track Collisions",
    subject: "Physics",
    topic: "Vecto động lượng, bảo toàn động lượng, va chạm đàn hồi và va chạm mềm",
    topicEn: "Linear momentum vector, conservation of momentum, elastic vs inelastic collisions",
    difficulty: "Nâng cao",
    difficultyEn: "Advanced",
    knttRef: "Chương V - Bài 28, 29, 30 (Trang 110-119)",
    ctstRef: "Chương 7 - Bài 18, 19 (Trang 114-125)",
    curriculumCompatibility: ["KNTT Bài 28-30", "CTST Bài 18-19"],
    description: "Thí nghiệm va chạm 1 chiều giữa 2 xe trượt trên băng đệm khí có gắn cổng quang điện đo tốc độ: so sánh va chạm đàn hồi (bảo toàn Wđ) và va chạm mềm (dính vào nhau).",
    descriptionEn: "Air-track dual-glider collision experiment with photogates: investigate elastic collisions vs inelastic collisions and momentum conservation.",
    formula: [
      "Vecto động lượng: p = m·v (đơn vị: kg·m/s)",
      "Định luật bảo toàn động lượng (hệ kín): m₁v₁ + m₂v₂ = m₁v'₁ + m₂v'₂",
      "Va chạm mềm: v' = (m₁v₁ + m₂v₂) / (m₁ + m₂)",
      "Xung lượng của lực: F·Δt = Δp = p₂ - p₁"
    ],
    theory: "Động lượng toàn phần của một hệ kín là một đại lượng bảo toàn. Trong va chạm mềm, động lượng bảo toàn nhưng động năng của hệ giảm do chuyển thành nhiệt và năng lượng biến dạng (SGK KNTT tr.114, CTST tr.122).",
    theoryEn: "In an isolated system, the total linear momentum is strictly conserved. In inelastic collisions, kinetic energy converts into internal thermal and deformation energy."
  },
  {
    id: "circular-motion",
    title: "Chuyển động tròn đều & Lực hướng tâm",
    titleEn: "Uniform Circular Motion & Centripetal Force",
    subject: "Physics",
    topic: "Radian, tốc độ góc, gia tốc hướng tâm, lực hướng tâm và an toàn góc cua",
    topicEn: "Angular velocity, radians, centripetal acceleration, road banking safety",
    difficulty: "Trung bình",
    difficultyEn: "Intermediate",
    knttRef: "Chương VI - Bài 31, 32 (Trang 120-127)",
    ctstRef: "Chương 8 - Bài 20, 21 (Trang 126-135)",
    curriculumCompatibility: ["KNTT Bài 31-32", "CTST Bài 20-21"],
    description: "Quan sát vật chuyển động tròn đều: bán kính r, chu kì T, tốc độ góc ω, vecto vận tốc tiếp tuyến v và vecto gia tốc hướng tâm a_ht hướng vào tâm.",
    descriptionEn: "Visualize uniform circular motion: angular velocity, tangential velocity vector, centripetal acceleration, and centripetal force requirements.",
    formula: [
      "Tốc độ góc: ω = Δθ / Δt = 2π / T = 2π·f",
      "Vận tốc dài: v = ω·r",
      "Gia tốc hướng tâm: a_ht = v² / r = ω²·r",
      "Lực hướng tâm: F_ht = m·a_ht = m·v² / r = m·ω²·r",
      "Tốc độ an toàn khúc cua: v_max = √(μ·g·r)"
    ],
    theory: "Trong chuyển động tròn đều, độ lớn vận tốc tức thời không đổi nhưng hướng luôn thay đổi, do đó luôn có gia tốc hướng tâm hướng về tâm quỹ đạo (SGK KNTT tr.123, CTST tr.131).",
    theoryEn: "In uniform circular motion, tangential speed is constant while velocity direction continuously changes, producing a continuous center-directed centripetal acceleration."
  },
  {
    id: "hooke-elasticity",
    title: "Biến dạng của vật rắn & Định luật Hooke",
    titleEn: "Elastic Deformation & Hooke's Law",
    subject: "Physics",
    topic: "Biến dạng đàn hồi, độ dãn lò xo, hệ số đàn hồi k và đồ thị F - Δl",
    topicEn: "Elastic deformation, spring elongation, spring constant k, F-Δl graph",
    difficulty: "Cơ bản",
    difficultyEn: "Beginner",
    knttRef: "Chương VII - Bài 33 (Trang 128-131)",
    ctstRef: "Chương 9 - Bài 22, 23 (Trang 136-144)",
    curriculumCompatibility: ["KNTT Bài 33", "CTST Bài 22-23"],
    description: "Thí nghiệm treo gia trọng m vào lò xo thẳng đứng: xác định chiều dài ban đầu l₀, chiều dài l khi biến dạng, tính độ dãn Δl = l - l₀ và kiểm nghiệm F_dh = k·|Δl|.",
    descriptionEn: "Hang slotted weights on vertical springs: measure initial length l₀, elongation Δl, spring constant k, and verify Hooke's Law within elastic limits.",
    formula: [
      "Định luật Hooke: F_dh = k·|Δl| (đơn vị k: N/m)",
      "Độ biến dạng: Δl = l - l₀",
      "Điều kiện cân bằng treo thẳng đứng: F_dh = P => k·Δl = m·g",
      "Thế năng đàn hồi: W_dh = ½·k·(Δl)²"
    ],
    theory: "Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của lò xo: F_dh = k·|Δl|. Hệ số tỉ lệ k được gọi là độ cứng (hay hệ số đàn hồi) của lò xo (SGK KNTT tr.130, CTST tr.141).",
    theoryEn: "Within proportional elastic limits, restoring spring force is directly proportional to elongation: F = k|Δl|."
  },
  {
    id: "electric-circuit",
    title: "Mạch điện một chiều & Định luật Ohm",
    titleEn: "DC Electric Circuit & Ohm's Law",
    subject: "Physics",
    topic: "Định luật Ohm cho đoạn mạch, mạch mắc nối tiếp và song song, công suất tỏa nhiệt",
    topicEn: "Ohm's Law, series & parallel circuit branches, Joule heating power",
    difficulty: "Trung bình",
    difficultyEn: "Intermediate",
    knttRef: "Chương trình Vật lí - Dòng điện không đổi & Định luật Ohm",
    ctstRef: "Chương trình Vật lí - Mạch điện một chiều & Công suất điện",
    curriculumCompatibility: ["Vật lí 10 KNTT", "Vật lí 10 CTST"],
    description: "Thiết kế và mô phỏng mạch điện 1 chiều: nguồn điện, điện trở, bóng đèn mắc nối tiếp và song song nhánh đứng; quan sát dòng chuyển dời electron và kiểm chứng định luật Ohm I = U/R.",
    descriptionEn: "Simulate DC electric circuits: Ohm's law (I = V/R), Joule power dissipation, series and vertical dual-branch parallel circuits with independent lamp brightness.",
    formula: [
      "Định luật Ohm: I = U / R",
      "Mạch nối tiếp: R_td = R₁ + R₂; I = I₁ = I₂; U = U₁ + U₂",
      "Mạch song song: 1/R_td = 1/R₁ + 1/R₂; U = U₁ = U₂; I = I₁ + I₂",
      "Công suất tiêu thụ: P = U·I = I²·R = U² / R"
    ],
    theory: "Cường độ dòng điện chạy qua đoạn mạch tỉ lệ thuận với hiệu điện thế đặt vào hai đầu đoạn mạch và tỉ lệ nghịch với điện trở của đoạn mạch.",
    theoryEn: "Current flowing through an electric circuit branch is directly proportional to potential difference and inversely proportional to equivalent resistance."
  },
  {
    id: "wave-interference",
    title: "Sóng cơ & Giao thoa sóng",
    titleEn: "Mechanical Waves & Wave Interference",
    subject: "Physics",
    topic: "Sóng hình sin, bước sóng, chu kì, hiện tượng giao thoa của hai nguồn kết hợp",
    topicEn: "Sinusoidal waves, wavelength, frequency, two-source wave superposition",
    difficulty: "Trung bình",
    difficultyEn: "Intermediate",
    knttRef: "Chuyên đề Vật lí - Sóng cơ & Giao thoa",
    ctstRef: "Chuyên đề Vật lí - Truyền sóng & Giao thoa",
    curriculumCompatibility: ["Vật lí KNTT", "Vật lí CTST"],
    description: "Khảo sát sự truyền sóng cơ hình sin và hiện tượng giao thoa giữa hai nguồn đồng pha: quan sát các vân cực đại giao thoa và cực tiểu triệt tiêu.",
    descriptionEn: "Explore sinusoidal mechanical wave propagation and two-point coherent source wave interference patterns.",
    formula: [
      "Phương trình truyền sóng: u = A·cos(ωt - 2πx/λ)",
      "Bước sóng: λ = v·T = v / f",
      "Cực đại giao thoa: Δd = |d₁ - d₂| = k·λ (k ∈ Z)",
      "Cực tiểu giao thoa: Δd = |d₁ - d₂| = (k + 0,5)·λ"
    ],
    theory: "Hiện tượng hai sóng kết hợp khi gặp nhau tạo nên các vị trí tăng cường lẫn nhau (cực đại) và những vị trí làm suy yếu nhau (cực tiểu) gọi là hiện tượng giao thoa sóng.",
    theoryEn: "When two coherent waves overlap, constructive interference occurs at path difference kλ and destructive cancellation at (k+0.5)λ."
  }
];

export const curriculumMappings: TopicMapping[] = [
  {
    id: "m1",
    topicName: "Chuyển động ném ngang và ném xiên",
    topicNameEn: "Horizontal and Oblique Projectile Motion",
    knttChapter: "Chương II: Động học",
    knttLesson: "Chuyển động ném",
    knttLessonNum: "Bài 12",
    knttPage: 49,
    ctstChapter: "Chương 3: Chuyển động biến đổi",
    ctstLesson: "Chuyển động ném",
    ctstLessonNum: "Bài 9",
    ctstPage: 50,
    keyConcept: "Phân tích chuyển động ném thành Ox thẳng đều và Oy rơi tự do; công thức tầm cao H và tầm xa L.",
    keyConceptEn: "Decomposing into uniform horizontal motion and vertical free fall; range and maximum height formulas.",
    formulas: ["H = (v₀²·sin²α) / 2g", "L = v₀·√(2H/g)", "L_xiên = (v₀²·sin 2α) / g"],
    simulationId: "projectile-motion",
    textbookFigures: "KNTT Hình 12.1 (hai viên bi rơi cùng lúc); CTST Hình 9.2 & 9.4 (quỹ đạo parabol)"
  },
  {
    id: "m2",
    topicName: "Ba định luật Newton & Lực ma sát",
    topicNameEn: "Newton's Three Laws & Friction Dynamics",
    knttChapter: "Chương III: Động lực học",
    knttLesson: "Ba định luật Newton & Lực ma sát",
    knttLessonNum: "Bài 14, 15, 16, 18, 20",
    knttPage: 60,
    ctstChapter: "Chương 4: Ba định luật Newton. Một số lực trong thực tiễn",
    ctstLesson: "Ba định luật Newton & Một số lực trong thực tiễn",
    ctstLessonNum: "Bài 10, 11, 13",
    ctstPage: 55,
    keyConcept: "Định luật II Newton F = m·a, lực ma sát trượt F_ms = μ·N, gia tốc trượt dốc a = g(sinα - μ·cosα).",
    keyConceptEn: "Newton's 2nd Law F = ma, kinetic friction F_ms = μN, incline acceleration a = g(sinα - μcosα).",
    formulas: ["F = m·a", "F_ms = μ·N", "a = g·(sinα - μ·cosα)", "F_AB = -F_BA"],
    simulationId: "newton-dynamics",
    textbookFigures: "KNTT Hình 15.2 (xe đệm khí F = ma); CTST Hình 10.8 (xe trượt ròng rọc)"
  },
  {
    id: "m3",
    topicName: "Cơ năng & Định luật bảo toàn cơ năng",
    topicNameEn: "Mechanical Energy & Law of Conservation",
    knttChapter: "Chương IV: Năng lượng, công, công suất",
    knttLesson: "Động năng, thế năng. Định luật bảo toàn cơ năng",
    knttLessonNum: "Bài 25, 26",
    knttPage: 99,
    ctstChapter: "Chương 6: Năng lượng",
    ctstLesson: "Động năng và thế năng. Định luật bảo toàn cơ năng",
    ctstLessonNum: "Bài 17",
    ctstPage: 105,
    keyConcept: "Sự chuyển hóa qua lại giữa động năng Wđ = ½mv² và thế năng Wt = mgh; cơ năng bảo toàn W = const.",
    keyConceptEn: "Interconversion between kinetic and gravitational potential energy with total mechanical energy conservation.",
    formulas: ["W = Wđ + Wt = ½·m·v² + m·g·h = const", "v = √(2g·h)"],
    simulationId: "energy-conservation",
    textbookFigures: "KNTT Hình 26.2 (con lắc đồng hồ quả lắc); CTST Hình 17.7 (vận động viên trượt máng)"
  },
  {
    id: "m4",
    topicName: "Động lượng & Va chạm đệm khí",
    topicNameEn: "Linear Momentum & Air Track Collisions",
    knttChapter: "Chương V: Động lượng",
    knttLesson: "Động lượng, bảo toàn động lượng & Thực hành va chạm",
    knttLessonNum: "Bài 28, 29, 30",
    knttPage: 110,
    ctstChapter: "Chương 7: Động lượng",
    ctstLesson: "Động lượng, bảo toàn động lượng & Các loại va chạm",
    ctstLessonNum: "Bài 18, 19",
    ctstPage: 114,
    keyConcept: "Vecto động lượng p = mv, định luật bảo toàn động lượng trong hệ kín, va chạm đàn hồi và va chạm mềm.",
    keyConceptEn: "Momentum vector p = mv, conservation of linear momentum in isolated systems, elastic vs inelastic collisions.",
    formulas: ["p = m·v", "m₁v₁ + m₂v₂ = (m₁ + m₂)·v'", "F·Δt = Δp"],
    simulationId: "momentum-collision",
    textbookFigures: "KNTT Hình 30.2 (băng đệm khí va chạm mềm); CTST Hình 19.4 (thí nghiệm va chạm 2 xe)"
  },
  {
    id: "m5",
    topicName: "Động học & Động lực học chuyển động tròn đều",
    topicNameEn: "Uniform Circular Motion & Centripetal Acceleration",
    knttChapter: "Chương VI: Chuyển động tròn đều",
    knttLesson: "Động học chuyển động tròn & Lực hướng tâm",
    knttLessonNum: "Bài 31, 32",
    knttPage: 120,
    ctstChapter: "Chương 8: Chuyển động tròn",
    ctstLesson: "Động học chuyển động tròn & Lực hướng tâm",
    ctstLessonNum: "Bài 20, 21",
    ctstPage: 126,
    keyConcept: "Tốc độ góc ω = Δθ/Δt, gia tốc hướng tâm a_ht = v²/r = ω²r, lực hướng tâm F_ht = m·a_ht, góc cua an toàn.",
    keyConceptEn: "Angular speed, centripetal acceleration, center-directed force, and vehicle road-turn friction stability.",
    formulas: ["v = ω·r", "a_ht = v² / r = ω²·r", "F_ht = m·ω²·r", "v_max = √(μ·g·r)"],
    simulationId: "circular-motion",
    textbookFigures: "KNTT Hình 32.2 (gia tốc hướng tâm); CTST Hình 21.4 (xe chạy đường vòng ngang có ma sát)"
  },
  {
    id: "m6",
    topicName: "Biến dạng của vật rắn & Định luật Hooke",
    topicNameEn: "Solid Elastic Deformation & Hooke's Law",
    knttChapter: "Chương VII: Biến dạng của vật rắn",
    knttLesson: "Biến dạng của vật rắn. Đặc tính của lò xo",
    knttLessonNum: "Bài 33",
    knttPage: 128,
    ctstChapter: "Chương 9: Biến dạng của vật rắn",
    ctstLesson: "Biến dạng của vật rắn & Định luật Hooke",
    ctstLessonNum: "Bài 22, 23",
    ctstPage: 136,
    keyConcept: "Định luật Hooke F_dh = k·|Δl|, hệ số đàn hồi k của lò xo, độ dãn khi treo gia trọng m.",
    keyConceptEn: "Hooke's law F_dh = k|Δl|, elastic restoring force, spring stiffness constant k.",
    formulas: ["F_dh = k·|Δl|", "k·Δl = m·g", "W_dh = ½·k·(Δl)²"],
    simulationId: "hooke-elasticity",
    textbookFigures: "KNTT Hình 33.3 (đồ thị F - Δl); CTST Hình 23.1 (thí nghiệm treo quả nặng vào lò xo)"
  },
  {
    id: "m7",
    topicName: "Định luật Ohm & Mạch điện một chiều",
    topicNameEn: "Ohm's Law & DC Electric Circuit Branches",
    knttChapter: "Chuyên đề Vật lí: Dòng điện không đổi",
    knttLesson: "Đoạn mạch nối tiếp & song song",
    knttLessonNum: "Bài Mạch điện",
    knttPage: 14,
    ctstChapter: "Chuyên đề Vật lí: Dòng điện không đổi",
    ctstLesson: "Định luật Ohm và công suất điện",
    ctstLessonNum: "Bài Mạch điện",
    ctstPage: 16,
    keyConcept: "Định luật Ohm I = U/R, công suất Joule-Lenz P = U·I = I²R, tính chất mạch nối tiếp và mạch nhánh song song.",
    keyConceptEn: "Ohm's Law, power dissipation, series vs parallel branch behavior.",
    formulas: ["I = U / R", "P = U·I = I²·R", "R_series = R₁ + R₂", "1/R_parallel = 1/R₁ + 1/R₂"],
    simulationId: "electric-circuit",
    textbookFigures: "Sơ đồ mạch điện song song hai nhánh đứng có khóa K và điện trở"
  },
  {
    id: "m8",
    topicName: "Sóng cơ & Hiện tượng giao thoa sóng",
    topicNameEn: "Mechanical Waves & Wave Interference",
    knttChapter: "Chuyên đề Vật lí: Sóng cơ học",
    knttLesson: "Truyền sóng và giao thoa sóng",
    knttLessonNum: "Bài Sóng",
    knttPage: 28,
    ctstChapter: "Chuyên đề Vật lí: Sóng cơ học",
    ctstLesson: "Sóng kết hợp và giao thoa",
    ctstLessonNum: "Bài Sóng",
    ctstPage: 30,
    keyConcept: "Sự chồng chất sóng, hai nguồn kết hợp đồng pha, điều kiện vân cực đại và cực tiểu giao thoa.",
    keyConceptEn: "Superposition of coherent sinusoidal waves, constructive and destructive fringe condition.",
    formulas: ["λ = v·T", "Cực đại: d₁ - d₂ = k·λ", "Cực tiểu: d₁ - d₂ = (k + 0,5)·λ"],
    simulationId: "wave-interference",
    textbookFigures: "Hình ảnh vân giao thoa hai nguồn kết hợp trên mặt nước"
  }
];

export const quizzes: Record<string, QuizQuestion[]> = {
  "projectile-motion": [
    {
      id: "q_proj_1",
      simulationId: "projectile-motion",
      question: "Theo thí nghiệm Hình 12.1 SGK KNTT (trang 49) và Hình 9.2 CTST (trang 50), nếu đồng thời thả rơi tự do viên bi B và ném ngang viên bi A từ cùng độ cao H thì:",
      questionEn: "According to Experiment Figure 12.1 in KNTT and Figure 9.2 in CTST, if ball B is dropped freely while ball A is projected horizontally from the same height H:",
      options: [
        "Viên bi B chạm đất trước vì quãng đường ngắn hơn",
        "Cả hai viên bi A và B chạm đất cùng một lúc",
        "Viên bi A chạm đất trước vì có vận tốc ban đầu v₀",
        "Tùy thuộc vào khối lượng của hai viên bi"
      ],
      optionsEn: [
        "Ball B hits the ground first because its path is shorter",
        "Both ball A and ball B hit the ground simultaneously",
        "Ball A hits the ground first because of initial velocity v₀",
        "It depends on the relative masses of the two balls"
      ],
      correctIndex: 1,
      explanation: "Chuyển động rơi theo phương thẳng đứng Oy của cả hai viên bi đều là rơi tự do không vận tốc đầu với cùng gia tốc g: t = √(2H/g). Thời gian rơi chỉ phụ thuộc độ cao H, không phụ thuộc vận tốc ném ngang v₀.",
      explanationEn: "Both balls experience identical vertical free-fall acceleration g with zero initial vertical velocity: t = √(2H/g). Fall time is independent of horizontal speed v₀.",
      conceptTested: "Chuyển động ném ngang",
      textbookRef: "KNTT Bài 12 (Trang 49-50) & CTST Bài 9 (Trang 50)"
    },
    {
      id: "q_proj_2",
      simulationId: "projectile-motion",
      question: "Trong chuyển động ném xiên bỏ qua lực cản không khí, để đạt tầm xa cực đại L_max trên mặt đất phẳng với cùng vận tốc ban đầu v₀, góc ném α phải bằng:",
      questionEn: "In oblique projectile motion neglecting air resistance, what launch angle α yields the maximum horizontal range L_max?",
      options: [
        "30°",
        "45°",
        "60°",
        "90°"
      ],
      optionsEn: [
        "30°",
        "45°",
        "60°",
        "90°"
      ],
      correctIndex: 1,
      explanation: "Công thức tầm xa ném xiên: L = (v₀²·sin 2α) / g. Giá trị sin 2α đạt cực đại bằng 1 khi 2α = 90° => α = 45°.",
      explanationEn: "Range formula L = (v₀² sin 2α)/g reaches its maximum when sin 2α = 1, which occurs at 2α = 90° or α = 45°.",
      conceptTested: "Tầm xa ném xiên",
      textbookRef: "KNTT Bài 12 (Trang 53) & CTST Bài 9 (Trang 54)"
    }
  ],
  "newton-dynamics": [
    {
      id: "q_newt_1",
      simulationId: "newton-dynamics",
      question: "Theo định luật II Newton (SGK KNTT trang 63, CTST trang 61), biểu thức liên hệ giữa gia tốc a, hợp lực F tác dụng và khối lượng m của vật là:",
      questionEn: "According to Newton's Second Law, the relationship between acceleration a, net force F, and mass m is:",
      options: [
        "a = m / F",
        "a = F / m (F = m·a)",
        "F = a / m",
        "a = F · m"
      ],
      optionsEn: [
        "a = m / F",
        "a = F / m (F = m·a)",
        "F = a / m",
        "a = F · m"
      ],
      correctIndex: 1,
      explanation: "Định luật II Newton: Gia tốc a của một vật cùng hướng với lực tác dụng và có độ lớn a = F / m, hay F = m·a.",
      explanationEn: "Newton's 2nd Law states that acceleration is directly proportional to net force and inversely proportional to mass: a = F/m.",
      conceptTested: "Định luật II Newton",
      textbookRef: "KNTT Bài 15 (Trang 63) & CTST Bài 10 (Trang 61)"
    },
    {
      id: "q_newt_2",
      simulationId: "newton-dynamics",
      question: "Một vật có khối lượng m trượt xuống một mặt phẳng nghiêng góc α so với phương ngang, hệ số ma sát trượt là μ. Gia tốc của vật là:",
      questionEn: "An object of mass m slides down an inclined plane with angle α and kinetic friction coefficient μ. Its acceleration is:",
      options: [
        "a = g·(cosα - μ·sinα)",
        "a = g·(sinα - μ·cosα)",
        "a = g·(sinα + μ·cosα)",
        "a = g·sinα"
      ],
      optionsEn: [
        "a = g·(cosα - μ·sinα)",
        "a = g·(sinα - μ·cosα)",
        "a = g·(sinα + μ·cosα)",
        "a = g·sinα"
      ],
      correctIndex: 1,
      explanation: "Trọng lực phân tích thành P_x = mg·sinα kéo xuống và P_y = mg·cosα cân bằng phản lực N. Lực ma sát F_ms = μN = μmg·cosα. Phương trình: mg·sinα - μmg·cosα = m·a => a = g(sinα - μcosα) (Ví dụ 2 Bài 20 KNTT tr.82).",
      explanationEn: "Along the incline: mg sinα - μ mg cosα = ma, yielding a = g(sinα - μ cosα).",
      conceptTested: "Chuyển động trên mặt phẳng nghiêng",
      textbookRef: "KNTT Bài 20 (Trang 82) & CTST Bài 13 (Trang 82)"
    }
  ],
  "energy-conservation": [
    {
      id: "q_ener_1",
      simulationId: "energy-conservation",
      question: "Một con lắc đơn dao động trong trọng trường không ma sát (SGK KNTT Hình 26.2 trang 103). Khi quả nặng đi qua vị trí cân bằng (vị trí thấp nhất O) thì:",
      questionEn: "A simple pendulum oscillates in gravity without friction. When passing the lowest equilibrium point O:",
      options: [
        "Thế năng cực đại, động năng bằng 0",
        "Động năng cực đại, thế năng cực tiểu (bằng 0 nếu chọn mốc tại O)",
        "Cả động năng và thế năng đều bằng 0",
        "Cơ năng bị tiêu hao hoàn toàn"
      ],
      optionsEn: [
        "Potential energy is maximum, kinetic energy is zero",
        "Kinetic energy is maximum, potential energy is minimum (zero)",
        "Both kinetic and potential energy are zero",
        "Total mechanical energy is completely dissipated"
      ],
      correctIndex: 1,
      explanation: "Tại vị trí cân bằng thấp nhất O, độ cao h = 0 nên thế năng Wt = 0. Toàn bộ cơ năng chuyển hóa thành động năng cực đại: Wđ_max = ½mv_max² = W.",
      explanationEn: "At the lowest position, height h = 0 so potential energy Wt = 0. All mechanical energy converts into maximum kinetic energy: Wk_max = W.",
      conceptTested: "Chuyển hóa động năng - thế năng",
      textbookRef: "KNTT Bài 26 (Trang 103) & CTST Bài 17 (Trang 107)"
    },
    {
      id: "q_ener_2",
      simulationId: "energy-conservation",
      question: "Định luật bảo toàn cơ năng chỉ nghiệm đúng khi vật chuyển động dưới tác dụng của:",
      questionEn: "The law of conservation of mechanical energy strictly applies when the object moves solely under:",
      options: [
        "Lực ma sát và lực cản",
        "Chỉ trọng lực (hoặc lực đàn hồi - lực thế), không có lực ma sát cản trở",
        "Lực đẩy động cơ xe",
        "Bất kì loại lực nào"
      ],
      optionsEn: [
        "Frictional and drag forces",
        "Conservative forces (gravity or spring elastic force) only, without friction",
        "Engine propulsion forces",
        "Any arbitrary force"
      ],
      correctIndex: 1,
      explanation: "Khi vật chỉ chịu tác dụng của trọng lực (hoặc lực đàn hồi), cơ năng của vật bảo toàn: W = Wđ + Wt = const. Nếu có lực ma sát, cơ năng sẽ giảm do chuyển hóa thành nhiệt năng (KNTT tr.103, CTST tr.110).",
      explanationEn: "Mechanical energy is conserved only in conservative force fields (gravity or ideal springs) without dissipation such as friction.",
      conceptTested: "Điều kiện bảo toàn cơ năng",
      textbookRef: "KNTT Bài 26 (Trang 104) & CTST Bài 17 (Trang 110)"
    }
  ],
  "momentum-collision": [
    {
      id: "q_mom_1",
      simulationId: "momentum-collision",
      question: "Trong thí nghiệm khảo sát va chạm mềm trên đệm khí (SGK KNTT Hình 30.2 tr.117 & CTST Hình 19.4 tr.122), xe 1 (khối lượng m₁) chuyển động với vận tốc v₁ đến va chạm mềm dính chặt vào xe 2 (khối lượng m₂) đang đứng yên. Vận tốc của hai xe sau va chạm là:",
      questionEn: "In an inelastic collision experiment on an air track, glider 1 (mass m₁) moving at v₁ collides and sticks with stationary glider 2 (mass m₂). Their combined velocity is:",
      options: [
        "v' = v₁",
        "v' = (m₁·v₁) / (m₁ + m₂)",
        "v' = (m₁ - m₂)·v₁",
        "v' = 0 (cả hai dừng lại)"
      ],
      optionsEn: [
        "v' = v₁",
        "v' = (m₁·v₁) / (m₁ + m₂)",
        "v' = (m₁ - m₂)·v₁",
        "v' = 0 (both gliders stop)"
      ],
      correctIndex: 1,
      explanation: "Áp dụng định luật bảo toàn động lượng cho hệ kín: p_trước = p_sau => m₁·v₁ = (m₁ + m₂)·v' => v' = (m₁·v₁) / (m₁ + m₂).",
      explanationEn: "By conservation of linear momentum: m₁v₁ = (m₁ + m₂)v' => v' = (m₁v₁) / (m₁ + m₂).",
      conceptTested: "Va chạm mềm",
      textbookRef: "KNTT Bài 29, 30 (Trang 114-118) & CTST Bài 19 (Trang 122)"
    },
    {
      id: "q_mom_2",
      simulationId: "momentum-collision",
      question: "Điểm khác biệt căn bản giữa va chạm đàn hồi và va chạm mềm là:",
      questionEn: "The fundamental distinction between an elastic collision and an inelastic collision is:",
      options: [
        "Va chạm đàn hồi không bảo toàn động lượng",
        "Va chạm đàn hồi bảo toàn cả động lượng và động năng; còn va chạm mềm chỉ bảo toàn động lượng, động năng bị hao hụt",
        "Va chạm mềm làm tăng động năng của hệ",
        "Va chạm đàn hồi làm hai vật dính vào nhau"
      ],
      optionsEn: [
        "Elastic collisions do not conserve linear momentum",
        "Elastic collisions conserve both momentum and kinetic energy; inelastic collisions lose kinetic energy to heat/deformation",
        "Inelastic collisions increase total kinetic energy",
        "Elastic collisions cause the objects to stick together"
      ],
      correctIndex: 1,
      explanation: "Va chạm đàn hồi: động lượng và động năng của hệ được bảo toàn. Va chạm mềm: hai vật dính làm một, động lượng bảo toàn nhưng động năng chuyển hóa một phần thành nhiệt năng và công biến dạng (Bảng 19.2 CTST tr.123).",
      explanationEn: "Elastic collisions conserve both kinetic energy and momentum. Inelastic collisions lose kinetic energy to internal thermal and deformation work.",
      conceptTested: "Phân loại va chạm",
      textbookRef: "KNTT Bài 29 (Trang 114) & CTST Bài 19 (Trang 123)"
    }
  ],
  "circular-motion": [
    {
      id: "q_circ_1",
      simulationId: "circular-motion",
      question: "Một vật chuyển động tròn đều bán kính r với tốc độ góc ω không đổi (SGK KNTT Bài 32 tr.123, CTST Bài 21 tr.131). Gia tốc hướng tâm a_ht có độ lớn là:",
      questionEn: "For an object in uniform circular motion with radius r and angular speed ω, the centripetal acceleration magnitude is:",
      options: [
        "a_ht = ω / r",
        "a_ht = v² / r = ω²·r",
        "a_ht = v · r",
        "a_ht = 0 (vì tốc độ v không đổi)"
      ],
      optionsEn: [
        "a_ht = ω / r",
        "a_ht = v² / r = ω²·r",
        "a_ht = v · r",
        "a_ht = 0 (since speed v is constant)"
      ],
      correctIndex: 1,
      explanation: "Dù tốc độ v không đổi, hướng của vecto vận tốc luôn thay đổi hướng vào tâm nên vật luôn có gia tốc hướng tâm: a_ht = v²/r = ω²·r.",
      explanationEn: "Even though speed is constant, the direction of velocity continuously changes, creating centripetal acceleration a_ht = v²/r = ω²r.",
      conceptTested: "Gia tốc hướng tâm",
      textbookRef: "KNTT Bài 32 (Trang 123) & CTST Bài 21 (Trang 131)"
    },
    {
      id: "q_circ_2",
      simulationId: "circular-motion",
      question: "Theo Hình 21.4 SGK CTST (trang 132), khi ô tô chạy vào một khúc cua nằm ngang có bán kính R, lực nào đóng vai trò là lực hướng tâm giữ cho xe không bị trượt văng ra ngoài?",
      questionEn: "According to Figure 21.4 in CTST, when a car enters a horizontal road curve of radius R, what force acts as the centripetal force?",
      options: [
        "Trọng lực của xe",
        "Lực đẩy của động cơ",
        "Lực ma sát nghỉ giữa lốp xe và mặt đường",
        "Phản lực vuông góc của mặt đường"
      ],
      optionsEn: [
        "Gravity of the vehicle",
        "Engine propulsion force",
        "Static friction force between tires and road",
        "Normal contact force"
      ],
      correctIndex: 2,
      explanation: "Lực ma sát nghỉ f_msn giữa bánh xe và mặt đường hướng vào tâm khúc cua đóng vai trò lực hướng tâm. Để xe không bị trượt: f_msn ≤ μ·m·g => v ≤ √(μ·g·R) (SGK CTST tr.132-133).",
      explanationEn: "Static friction between the tires and road points toward the center of curvature, providing the necessary centripetal force: v ≤ √(μgR).",
      conceptTested: "Ứng dụng lực hướng tâm",
      textbookRef: "CTST Bài 21 (Trang 132-133) & KNTT Bài 32 (Trang 125)"
    }
  ],
  "hooke-elasticity": [
    {
      id: "q_hooke_1",
      simulationId: "hooke-elasticity",
      question: "Theo định luật Hooke (SGK KNTT Bài 33 trang 130, CTST Bài 23 trang 141), trong giới hạn đàn hồi, lực đàn hồi F_dh của lò xo:",
      questionEn: "According to Hooke's Law within the elastic limit, the restoring force F_dh of a spring is:",
      options: [
        "Tỉ lệ nghịch với độ biến dạng |Δl|",
        "Tỉ lệ thuận với độ biến dạng |Δl| (F_dh = k·|Δl|)",
        "Không phụ thuộc vào độ dãn của lò xo",
        "Tỉ lệ với bình phương độ dãn (Δl)²"
      ],
      optionsEn: [
        "Inversely proportional to deformation |Δl|",
        "Directly proportional to deformation |Δl| (F_dh = k·|Δl|)",
        "Independent of elongation",
        "Proportional to the square of elongation (Δl)²"
      ],
      correctIndex: 1,
      explanation: "Định luật Hooke: Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của lò xo: F_dh = k·|Δl|, với k là độ cứng (N/m).",
      explanationEn: "Hooke's Law: F_dh = k|Δl|, where k is spring stiffness in N/m.",
      conceptTested: "Định luật Hooke",
      textbookRef: "KNTT Bài 33 (Trang 130) & CTST Bài 23 (Trang 141)"
    },
    {
      id: "q_hooke_2",
      simulationId: "hooke-elasticity",
      question: "Treo một vật nặng khối lượng m = 200g (0,2 kg) vào lò xo có độ cứng k = 100 N/m ở nơi có g = 10 m/s². Khi vật ở vị trí cân bằng, lò xo bị dãn một đoạn Δl bằng:",
      questionEn: "A mass m = 200g is suspended from a vertical spring with stiffness k = 100 N/m where g = 10 m/s². At equilibrium, the spring elongation Δl is:",
      options: [
        "0,2 cm",
        "2 cm (0,02 m)",
        "5 cm",
        "20 cm"
      ],
      optionsEn: [
        "0.2 cm",
        "2 cm (0.02 m)",
        "5 cm",
        "20 cm"
      ],
      correctIndex: 1,
      explanation: "Tại vị trí cân bằng: F_dh = P => k·Δl = m·g => Δl = (m·g) / k = (0,2 · 10) / 100 = 0,02 m = 2 cm.",
      explanationEn: "At equilibrium: k·Δl = m·g => Δl = (0.2 * 10) / 100 = 0.02 m = 2 cm.",
      conceptTested: "Cân bằng lò xo treo thẳng đứng",
      textbookRef: "KNTT Bài 33 (Trang 131) & CTST Bài 23 (Trang 142)"
    }
  ],
  "electric-circuit": [
    {
      id: "q_circ_elec_1",
      simulationId: "electric-circuit",
      question: "Trong đoạn mạch gồm hai điện trở R₁ và R₂ mắc song song vào hiệu điện thế U, cường độ dòng điện mạch chính I liên hệ với các dòng điện nhánh I₁, I₂ như thế nào?",
      questionEn: "In a parallel circuit with two resistors R₁ and R₂ under voltage U, how is total current I related to branch currents I₁, I₂?",
      options: [
        "I = I₁ = I₂",
        "I = I₁ + I₂",
        "I = I₁ - I₂",
        "I = (I₁ · I₂) / (I₁ + I₂)"
      ],
      optionsEn: [
        "I = I₁ = I₂",
        "I = I₁ + I₂",
        "I = I₁ - I₂",
        "I = (I₁ · I₂) / (I₁ + I₂)"
      ],
      correctIndex: 1,
      explanation: "Trong mạch song song: Hiệu điện thế hai đầu các nhánh bằng nhau U = U₁ = U₂, và cường độ dòng điện mạch chính bằng tổng cường độ dòng điện các mạch nhánh: I = I₁ + I₂ (Định luật bảo toàn điện tích tại nút).",
      explanationEn: "In parallel circuits, voltage is identical across branches while total current is the sum of branch currents: I = I₁ + I₂.",
      conceptTested: "Mạch điện song song",
      textbookRef: "Chuyên đề Vật lí - Định luật Ohm & Đoạn mạch"
    }
  ],
  "wave-interference": [
    {
      id: "q_wave_1",
      simulationId: "wave-interference",
      question: "Trong thí nghiệm giao thoa sóng cơ học trên mặt nước với hai nguồn kết hợp cùng pha S₁ và S₂, những điểm dao động với biên độ cực đại thỏa mãn hiệu đường đi Δd = |d₁ - d₂| bằng:",
      questionEn: "In a two-source in-phase mechanical wave interference experiment, points oscillating with maximum amplitude satisfy path difference Δd = |d₁ - d₂| equal to:",
      options: [
        "Δd = k·λ (số nguyên lần bước sóng)",
        "Δd = (k + 0,5)·λ (số bán nguyên lần bước sóng)",
        "Δd = k·(λ / 4)",
        "Δd bất kì không phụ thuộc bước sóng"
      ],
      optionsEn: [
        "Δd = k·λ (an integer number of wavelengths)",
        "Δd = (k + 0.5)·λ (an odd multiple of half-wavelengths)",
        "Δd = k·(λ / 4)",
        "Any arbitrary distance independent of wavelength"
      ],
      correctIndex: 0,
      explanation: "Cực đại giao thoa xảy ra khi hai sóng từ hai nguồn đến điểm đó đồng pha, tức là hiệu đường đi bằng một số nguyên lần bước sóng: Δd = k·λ (k = 0, ±1, ±2,...).",
      explanationEn: "Constructive interference occurs where the two waves arrive in phase, requiring path difference Δd = kλ.",
      conceptTested: "Điều kiện cực đại giao thoa",
      textbookRef: "Chuyên đề Vật lí - Giao thoa sóng"
    }
  ]
};

export const initialProgress: UserProgress = {
  overall: 0,
  completedSimulations: [],
  conceptMastery: [
    { concept: "Chuyển động ném ngang & xiên", score: 0, status: "Needs Review" },
    { concept: "Định luật Newton & Ma sát", score: 0, status: "Needs Review" },
    { concept: "Bảo toàn cơ năng", score: 0, status: "Needs Review" },
    { concept: "Động lượng & Va chạm đệm khí", score: 0, status: "Needs Review" },
    { concept: "Chuyển động tròn đều & Lực hướng tâm", score: 0, status: "Needs Review" },
    { concept: "Biến dạng lò xo & Định luật Hooke", score: 0, status: "Needs Review" },
    { concept: "Mạch điện & Định luật Ohm", score: 0, status: "Needs Review" },
    { concept: "Sóng cơ & Giao thoa", score: 0, status: "Needs Review" },
  ],
  recentActivity: []
};

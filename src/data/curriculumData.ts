// Single Source of Truth for Grade 10 Physics Curriculum, Theory Notes, and Quizzes (GDPT 2018: KNTT & CTST)

export interface FormulaItem {
  formula: string;
  quantity: string;
  symbol: string;
  unit: string;
  meaning: string;
}

export interface TheorySection {
  title: string;
  content: string; // Markdown text with inline and block LaTeX
  keyTakeaway?: string;
  note?: string;
  formulas?: (
    | string
    | {
        name: string;
        latex: string;
        description?: string;
        units?: string;
      }
  )[];
}

export interface TheorySectionNote {
  title: string;
  content: string;
  keyTakeaway?: string;
  note?: string;
  formulas?: Array<string | { name?: string; latex?: string; description?: string; units?: string }>;
}

export interface VirtualLabSpec {
  experimentName: string;
  purpose: string;
  equipmentAndSteps: string[];
  physicsNatureAndLogic: string;
  expectedResults: {
    positive: string;
    negative: string;
  };
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number; // 0-based index
  correctAnswer: number; // 0-based index (compatibility alias)
  explanation: string;
  explanationEn?: string;
  detailedExplanation?: string;
  conceptTested?: string;
  textbookRef?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

export type TheoryQuizQuestion = QuizQuestionItem;

export type LabType =
  | 'galileo_pisa'
  | 'electric_safety'
  | 'photogate_error'
  | 'motion'
  | 'motion_graph'
  | 'freefall'
  | 'free_fall'
  | 'projectile'
  | 'photogate'
  | 'photogate_mc964'
  | 'error'
  | 'vernier_error'
  | 'vector'
  | 'vector_velocity'
  | 'safety'
  | 'safety_rules';

export interface LessonItem {
  id: string;
  chapterId: string;
  lessonNum: number;
  number: number;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  shortDesc: string;
  shortDescription: string;
  chapterTitle: string;
  labTag: string;
  labTagEn: string;
  knttRef: string;
  ctstRef: string;
  simulationId: string;
  labType?: string;
  labTitle?: string;
  labDescription?: string;
  virtualLabSpec?: VirtualLabSpec;
  virtualLab: {
    hidden: boolean;
    experiment_id: number;
    labRoute: string | null;
  };
  sections: TheorySection[];
  theorySections: TheorySection[];
  summaryFormulas: {
    name: string;
    latex: string;
    unit?: string;
    notes?: string;
  }[];
  theory: {
    part1_points: {
      num: number;
      heading: string;
      content: string;
      keyTakeaway?: string;
      note?: string;
    }[];
    ghiNho: string;
    part2_formulas: FormulaItem[];
    part3_applications: string[];
  };
  quizzes: QuizQuestionItem[];
  available: boolean;
}

export type PhysicsTheoryLesson = LessonItem & {
  theoryContent: {
    sections: TheorySectionNote[];
    formulas: Array<{ name: string; latex: string; unit?: string; notes?: string }>;
    keyTakeaways: string[];
  };
  quizQuestions: TheoryQuizQuestion[];
};

export interface ChapterItem {
  id: string;
  number: number;
  romanNumeral: string;
  title: string;
  titleEn: string;
  description: string;
  lessons: LessonItem[];
}

export interface PhysicsTheoryChapter {
  id: string;
  number: number;
  title: string;
  lessons: PhysicsTheoryLesson[];
}

export const curriculumChapters: ChapterItem[] = [
  {
    "id": "chuong-1",
    "number": 1,
    "romanNumeral": "I",
    "title": "MỞ ĐẦU",
    "titleEn": "INTRODUCTION",
    "description": "Làm quen với Vật lí, các quy tắc an toàn trong phòng thực hành và phương pháp xử lí sai số thực nghiệm.",
    "lessons": [
      {
        "id": "bai-1",
        "chapterId": "chuong-1",
        "lessonNum": 1,
        "number": 1,
        "title": "Làm quen với Vật lí",
        "titleEn": "Getting Started with Physics",
        "subtitle": "Đối tượng nghiên cứu & mục tiêu, các lĩnh vực chính, quá trình phát triển và hai phương pháp nghiên cứu cốt lõi: thực nghiệm và mô hình.",
        "subtitleEn": "Study object of Physics, experimental and modeling methods.",
        "shortDesc": "Đối tượng nghiên cứu & mục tiêu, các lĩnh vực chính, quá trình phát triển và hai phương pháp nghiên cứu cốt lõi: thực nghiệm và mô hình.",
        "shortDescription": "Đối tượng nghiên cứu & mục tiêu, các lĩnh vực chính, quá trình phát triển và hai phương pháp nghiên cứu cốt lõi: thực nghiệm và mô hình.",
        "chapterTitle": "MỞ ĐẦU",
        "labTag": "Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi",
        "labTagEn": "Leaning Tower of Pisa Simulation - Falling Verification",
        "knttRef": "KNTT Bài 1 (Trang 7)",
        "ctstRef": "CTST Bài 1 (Trang 6)",
        "simulationId": "measurement-error",
        "labType": "galileo_pisa",
        "labTitle": "Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi tự do và Phương pháp thực nghiệm của Galilei",
        "labDescription": "Bác bỏ quan điểm chủ quan của Aristotle (\"vật nặng rơi nhanh hơn vật nhẹ\") và chứng minh sự rơi không phụ thuộc vào khối lượng khi bỏ qua lực cản.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi tự do và Phương pháp thực nghiệm của Galilei",
          "purpose": "Bác bỏ quan điểm chủ quan của Aristotle (\"vật nặng rơi nhanh hơn vật nhẹ\") và chứng minh sự rơi không phụ thuộc vào khối lượng khi bỏ qua lực cản.",
          "equipmentAndSteps": [
            "1. Chọn hai quả cầu kim loại có khối lượng chênh lệch ($m_1 = 10\\text{ kg}$, $m_2 = 1\\text{ kg}$).",
            "2. Đặt ở cùng độ cao $h$ trên đỉnh tháp.",
            "3. Bật/Tắt chế độ \"Lực cản không khí\" (Air Resistance) và thả rơi đồng thời."
          ],
          "physicsNatureAndLogic": "Khi không có lực cản không khí, gia tốc rơi của mọi vật là $g$. Thời gian rơi được xác định qua công thức $t = \\sqrt{\\frac{2h}{g}}$, không phụ thuộc vào khối lượng $m$.",
          "expectedResults": {
            "positive": "Kết quả Tích cực (Bật chân không): Hai quả cầu rơi với cùng vận tốc và chạm đất chính xác cùng một lúc, khẳng định giả thuyết của Galilei.",
            "negative": "Kết quả Tiêu cực (Bật lực cản không khí mạnh / Thả vật nhẹ như tờ giấy): Lực cản $F_c$ làm vật nhẹ rơi chậm hơn, minh họa yếu tố nhiễu môi trường nếu không cô lập điều kiện thí nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Đối tượng nghiên cứu & Mục tiêu",
            "content": "Vật lí nghiên cứu các dạng vận động của **vật chất** (chất, trường) và **năng lượng**.\n\nHọc Vật lí giúp phát triển năng lực khoa học, rèn luyện kĩ năng khám phá thế giới tự nhiên và vận dụng tri thức vào đời sống thực tiễn.",
            "keyTakeaway": "Đối tượng nghiên cứu: Các dạng vận động của vật chất và năng lượng."
          },
          {
            "title": "2. Các lĩnh vực chính của Vật lí",
            "content": "Các lĩnh vực nghiên cứu chính bao gồm:\n* **Cơ học**: Chuyển động của vật thể và tương tác lực.\n* **Điện học & Điện từ học**: Điện tích, dòng điện, từ trường và sóng điện từ.\n* **Quang học**: Bản chất, sự truyền và tương tác của ánh sáng.\n* **Âm học**: Sự lan truyền và đặc tính của sóng âm.\n* **Nhiệt học**: Nhiệt độ, nhiệt lượng và các định luật nhiệt động lực học.\n* **Vật lí hạt nhân & Vật lí lượng tử**: Cấu trúc vi mô của nguyên tử, hạt cơ bản và các hiện tượng lượng tử.\n* **Thuyết tương đối**: Không gian, thời gian và trường hấp dẫn ở quy mô vũ trụ.",
            "keyTakeaway": "Các phân ngành: Cơ học, Nhiệt học, Điện - Từ học, Quang học, Âm học, Lượng tử, Hạt nhân và Thuyết tương đối."
          },
          {
            "title": "3. Quá trình phát triển của Vật lí học",
            "content": "Lịch sử phát triển của Vật lí học được chia thành 3 giai đoạn chính:\n\n* **Tiền Vật lí (350 TCN – XVI)**: Dựa trên quan sát và suy luận chủ quan, tiêu biểu là triết gia Aristotle (A-rít-xtốt).\n* **Vật lí cổ điển (XVII – XIX)**: Sử dụng phương pháp thực nghiệm khoa học, tiêu biểu là Galilei (Ga-li-lê), Newton (Niu-tơn), Joule, Faraday, Maxwell.\n* **Vật lí hiện đại (cuối XIX – nay)**: Tập trung vào mô hình lý thuyết vi mô và kiểm chứng thí nghiệm chính xác cao, tiêu biểu là Max Planck, Albert Einstein, Bohr.",
            "keyTakeaway": "Ba giai đoạn: Tiền Vật lí (quan sát chủ quan) → Vật lí cổ điển (thực nghiệm) → Vật lí hiện đại (mô hình lượng tử và tương đối)."
          },
          {
            "title": "4. Phương pháp nghiên cứu Vật lí",
            "content": "Để khám phá các quy luật tự nhiên, Vật lí sử dụng hai phương pháp cốt lõi:\n\n### a) Phương pháp thực nghiệm\nXác định vấn đề $\\rightarrow$ Quan sát, thu thập thông tin $\\rightarrow$ Đưa ra dự đoán (giả thuyết) $\\rightarrow$ Thí nghiệm kiểm tra $\\rightarrow$ Rút ra kết luận.\n\n### b) Phương pháp mô hình\n* **Mô hình vật chất**: Quả địa cầu, mô hình phân tử, chất điểm.\n* **Mô hình lý thuyết**: Tia sáng trong quang hình học, đường sức điện, khí lí tưởng.\n* **Mô hình toán học**: Vectơ, phương trình chuyển động $s = v \\cdot t$, đồ thị quan hệ giữa các đại lượng.",
            "keyTakeaway": "Hai phương pháp chính: Phương pháp thực nghiệm (thực tế kiểm chứng) và Phương pháp mô hình (trừu tượng hóa đơn giản hóa)."
          }
        ],
        "theorySections": [
          {
            "title": "1. Đối tượng nghiên cứu & Mục tiêu",
            "content": "Vật lí nghiên cứu các dạng vận động của **vật chất** (chất, trường) và **năng lượng**.\n\nHọc Vật lí giúp phát triển năng lực khoa học, rèn luyện kĩ năng khám phá thế giới tự nhiên và vận dụng tri thức vào đời sống thực tiễn.",
            "keyTakeaway": "Đối tượng nghiên cứu: Các dạng vận động của vật chất và năng lượng."
          },
          {
            "title": "2. Các lĩnh vực chính của Vật lí",
            "content": "Các lĩnh vực nghiên cứu chính bao gồm:\n* **Cơ học**: Chuyển động của vật thể và tương tác lực.\n* **Điện học & Điện từ học**: Điện tích, dòng điện, từ trường và sóng điện từ.\n* **Quang học**: Bản chất, sự truyền và tương tác của ánh sáng.\n* **Âm học**: Sự lan truyền và đặc tính của sóng âm.\n* **Nhiệt học**: Nhiệt độ, nhiệt lượng và các định luật nhiệt động lực học.\n* **Vật lí hạt nhân & Vật lí lượng tử**: Cấu trúc vi mô của nguyên tử, hạt cơ bản và các hiện tượng lượng tử.\n* **Thuyết tương đối**: Không gian, thời gian và trường hấp dẫn ở quy mô vũ trụ.",
            "keyTakeaway": "Các phân ngành: Cơ học, Nhiệt học, Điện - Từ học, Quang học, Âm học, Lượng tử, Hạt nhân và Thuyết tương đối."
          },
          {
            "title": "3. Quá trình phát triển của Vật lí học",
            "content": "Lịch sử phát triển của Vật lí học được chia thành 3 giai đoạn chính:\n\n* **Tiền Vật lí (350 TCN – XVI)**: Dựa trên quan sát và suy luận chủ quan, tiêu biểu là triết gia Aristotle (A-rít-xtốt).\n* **Vật lí cổ điển (XVII – XIX)**: Sử dụng phương pháp thực nghiệm khoa học, tiêu biểu là Galilei (Ga-li-lê), Newton (Niu-tơn), Joule, Faraday, Maxwell.\n* **Vật lí hiện đại (cuối XIX – nay)**: Tập trung vào mô hình lý thuyết vi mô và kiểm chứng thí nghiệm chính xác cao, tiêu biểu là Max Planck, Albert Einstein, Bohr.",
            "keyTakeaway": "Ba giai đoạn: Tiền Vật lí (quan sát chủ quan) → Vật lí cổ điển (thực nghiệm) → Vật lí hiện đại (mô hình lượng tử và tương đối)."
          },
          {
            "title": "4. Phương pháp nghiên cứu Vật lí",
            "content": "Để khám phá các quy luật tự nhiên, Vật lí sử dụng hai phương pháp cốt lõi:\n\n### a) Phương pháp thực nghiệm\nXác định vấn đề $\\rightarrow$ Quan sát, thu thập thông tin $\\rightarrow$ Đưa ra dự đoán (giả thuyết) $\\rightarrow$ Thí nghiệm kiểm tra $\\rightarrow$ Rút ra kết luận.\n\n### b) Phương pháp mô hình\n* **Mô hình vật chất**: Quả địa cầu, mô hình phân tử, chất điểm.\n* **Mô hình lý thuyết**: Tia sáng trong quang hình học, đường sức điện, khí lí tưởng.\n* **Mô hình toán học**: Vectơ, phương trình chuyển động $s = v \\cdot t$, đồ thị quan hệ giữa các đại lượng.",
            "keyTakeaway": "Hai phương pháp chính: Phương pháp thực nghiệm (thực tế kiểm chứng) và Phương pháp mô hình (trừu tượng hóa đơn giản hóa)."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Kết quả phép đo",
            "latex": "x = \\bar{x} \\pm \\Delta x",
            "unit": "Đơn vị đo của đại lượng",
            "notes": "Giá trị đo được bằng giá trị trung bình cộng trừ sai số tuyệt đối."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Đối tượng nghiên cứu & Mục tiêu",
              "content": "Vật lí nghiên cứu các dạng vận động của **vật chất** (chất, trường) và **năng lượng**.\n\nHọc Vật lí giúp phát triển năng lực khoa học, rèn luyện kĩ năng khám phá thế giới tự nhiên và vận dụng tri thức vào đời sống thực tiễn.",
              "keyTakeaway": "Đối tượng nghiên cứu: Các dạng vận động của vật chất và năng lượng."
            },
            {
              "num": 2,
              "heading": "2. Các lĩnh vực chính của Vật lí",
              "content": "Các lĩnh vực nghiên cứu chính bao gồm:\n* **Cơ học**: Chuyển động của vật thể và tương tác lực.\n* **Điện học & Điện từ học**: Điện tích, dòng điện, từ trường và sóng điện từ.\n* **Quang học**: Bản chất, sự truyền và tương tác của ánh sáng.\n* **Âm học**: Sự lan truyền và đặc tính của sóng âm.\n* **Nhiệt học**: Nhiệt độ, nhiệt lượng và các định luật nhiệt động lực học.\n* **Vật lí hạt nhân & Vật lí lượng tử**: Cấu trúc vi mô của nguyên tử, hạt cơ bản và các hiện tượng lượng tử.\n* **Thuyết tương đối**: Không gian, thời gian và trường hấp dẫn ở quy mô vũ trụ.",
              "keyTakeaway": "Các phân ngành: Cơ học, Nhiệt học, Điện - Từ học, Quang học, Âm học, Lượng tử, Hạt nhân và Thuyết tương đối."
            },
            {
              "num": 3,
              "heading": "3. Quá trình phát triển của Vật lí học",
              "content": "Lịch sử phát triển của Vật lí học được chia thành 3 giai đoạn chính:\n\n* **Tiền Vật lí (350 TCN – XVI)**: Dựa trên quan sát và suy luận chủ quan, tiêu biểu là triết gia Aristotle (A-rít-xtốt).\n* **Vật lí cổ điển (XVII – XIX)**: Sử dụng phương pháp thực nghiệm khoa học, tiêu biểu là Galilei (Ga-li-lê), Newton (Niu-tơn), Joule, Faraday, Maxwell.\n* **Vật lí hiện đại (cuối XIX – nay)**: Tập trung vào mô hình lý thuyết vi mô và kiểm chứng thí nghiệm chính xác cao, tiêu biểu là Max Planck, Albert Einstein, Bohr.",
              "keyTakeaway": "Ba giai đoạn: Tiền Vật lí (quan sát chủ quan) → Vật lí cổ điển (thực nghiệm) → Vật lí hiện đại (mô hình lượng tử và tương đối)."
            },
            {
              "num": 4,
              "heading": "4. Phương pháp nghiên cứu Vật lí",
              "content": "Để khám phá các quy luật tự nhiên, Vật lí sử dụng hai phương pháp cốt lõi:\n\n### a) Phương pháp thực nghiệm\nXác định vấn đề $\\rightarrow$ Quan sát, thu thập thông tin $\\rightarrow$ Đưa ra dự đoán (giả thuyết) $\\rightarrow$ Thí nghiệm kiểm tra $\\rightarrow$ Rút ra kết luận.\n\n### b) Phương pháp mô hình\n* **Mô hình vật chất**: Quả địa cầu, mô hình phân tử, chất điểm.\n* **Mô hình lý thuyết**: Tia sáng trong quang hình học, đường sức điện, khí lí tưởng.\n* **Mô hình toán học**: Vectơ, phương trình chuyển động $s = v \\cdot t$, đồ thị quan hệ giữa các đại lượng.",
              "keyTakeaway": "Hai phương pháp chính: Phương pháp thực nghiệm (thực tế kiểm chứng) và Phương pháp mô hình (trừu tượng hóa đơn giản hóa)."
            }
          ],
          "ghiNho": "Ghi nhớ: Phương pháp thực nghiệm là nền tảng cốt lõi của Vật lí học; mọi giả thuyết lí thuyết đều phải được kiểm chứng qua thực nghiệm.",
          "part2_formulas": [
            {
              "formula": "x = \\bar{x} \\pm \\Delta x",
              "quantity": "Kết quả phép đo",
              "symbol": "x",
              "unit": "Đơn vị đo của đại lượng",
              "meaning": "Giá trị đo được bằng giá trị trung bình cộng trừ sai số tuyệt đối."
            }
          ],
          "part3_applications": [
            "Kiểm chứng giả thuyết hai vật nặng nhẹ rơi cùng gia tốc trong chân không.",
            "Ứng dụng mô hình hóa trong thiết kế khí động học ô tô và máy bay."
          ]
        },
        "quizzes": [
          {
            "id": "b1-q1",
            "question": "Đối tượng nghiên cứu chính của Vật lí học là gì?",
            "questionEn": "The primary study subject of Physics includes:",
            "options": [
              "Sự biến đổi của các chất hóa học và liên kết nguyên tử.",
              "Các dạng vận động của vật chất và năng lượng.",
              "Sự sống, sinh trưởng và tiến hóa của các loài sinh vật.",
              "Lịch sử phát triển văn hóa và xã hội loài người."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Theo SGK Vật lí 10 (trang 7), đối tượng nghiên cứu của Vật lí tập trung vào **các dạng vận động của vật chất** (chất, trường) và **năng lượng** trong tự nhiên.",
            "conceptTested": "Đối tượng nghiên cứu của Vật lí",
            "textbookRef": "KNTT Bài 1 (Trang 7)",
            "difficulty": "medium"
          },
          {
            "id": "b1-q2",
            "question": "Nhà bác học nào được coi là người tiên phong mở đầu cho phương pháp thực nghiệm trong Vật lí học?",
            "questionEn": "The two main research methods in Physics are:",
            "options": [
              "Aristotle (A-rít-xtốt)",
              "Galileo Galilei (Ga-li-lê)",
              "Albert Einstein (Anh-xtanh)",
              "Archimedes (Ác-si-mét)"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Galileo Galilei (1564 – 1642) là người đầu tiên bác bỏ các suy đoán trừu tượng của Aristotle bằng cách tiến hành các thí nghiệm thực tế (như thí nghiệm thả rơi vật ở tháp nghiêng Pisa), mở ra kỉ nguyên phương pháp thực nghiệm.",
            "conceptTested": "Phương pháp nghiên cứu Vật lí",
            "textbookRef": "KNTT Bài 1 (Trang 9)",
            "difficulty": "medium"
          },
          {
            "id": "b1-q3",
            "question": "Phương pháp mô hình trong nghiên cứu Vật lí bao gồm các loại mô hình nào?",
            "questionEn": "Galileo Galilei's famous experiment at the Leaning Tower of Pisa aimed to:",
            "options": [
              "Mô hình kinh tế, mô hình tài chính, mô hình kiến trúc.",
              "Mô hình vật chất, mô hình lí thuyết, mô hình toán học.",
              "Mô hình địa lí, mô hình sinh thái, mô hình khí quyển.",
              "Mô hình đồ họa, mô hình 3D, mô hình nghệ thuật."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Trong nghiên cứu Vật lí, các mô hình thường dùng gồm: Mô hình vật chất (chất điểm, quả cầu mang điện), Mô hình lí thuyết (tia sáng, đường sức từ), và Mô hình toán học (công thức, hàm số, đồ thị).",
            "conceptTested": "Thực nghiệm Galileo",
            "textbookRef": "KNTT Bài 1 (Trang 8)",
            "difficulty": "medium"
          },
          {
            "id": "b1-q4",
            "question": "Các cuộc cách mạng công nghiệp gắn liền với sự tiến bộ của Vật lí học. Động cơ hơi nước ra đời gắn liền với cuộc cách mạng công nghiệp lần thứ mấy?",
            "questionEn": "The first step in scientific inquiry in Physics is:",
            "options": [
              "Cách mạng công nghiệp lần thứ nhất (CMCN 1.0)",
              "Cách mạng công nghiệp lần thứ hai (CMCN 2.0)",
              "Cách mạng công nghiệp lần thứ ba (CMCN 3.0)",
              "Cách mạng công nghiệp lần thứ tư (CMCN 4.0)"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Cuộc CMCN 1.0 (cuối thế kỉ XVIII) khởi nguồn từ việc sáng chế và ứng dụng máy hơi nước của James Watt, dựa trên các nghiên cứu về Nhiệt học.",
            "conceptTested": "Tiến trình nghiên cứu khoa học",
            "textbookRef": "KNTT Bài 1 (Trang 9)",
            "difficulty": "medium"
          },
          {
            "id": "b1-q5",
            "question": "Trình tự các bước cơ bản trong phương pháp thực nghiệm nghiên cứu Vật lí là:",
            "questionEn": "Which factor serves as the ultimate test of a physical law?",
            "options": [
              "Xác định vấn đề → Thí nghiệm → Giả thuyết → Bác bỏ.",
              "Xác định vấn đề → Quan sát, dự đoán (giả thuyết) → Thí nghiệm kiểm chứng → Phân tích & Kết luận.",
              "Đưa ra công thức → Làm bài tập → Khảo sát thị trường → Thí nghiệm.",
              "Giả thuyết → Kết luận ngay → Không cần làm thí nghiệm."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Quy trình chuẩn: 1. Xác định vấn đề; 2. Quan sát và đề xuất giả thuyết nghiên cứu; 3. Thiết kế & tiến hành thí nghiệm kiểm chứng; 4. Phân tích số liệu và rút ra kết luận (chấp nhận hoặc bác bỏ giả thuyết).",
            "conceptTested": "Vai trò thực nghiệm",
            "textbookRef": "KNTT Bài 1 (Trang 10)",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-2",
        "chapterId": "chuong-1",
        "lessonNum": 2,
        "number": 2,
        "title": "Các quy tắc an toàn trong phòng thực hành",
        "titleEn": "Safety Rules in the Physics Lab",
        "subtitle": "Kí hiệu an toàn, nhãn thông số kĩ thuật, các nguy cơ mất an toàn phổ biến và quy tắc PCCC trong phòng thí nghiệm.",
        "subtitleEn": "Safety signs, electrical safety guidelines, and optical equipment care.",
        "shortDesc": "Kí hiệu an toàn, nhãn thông số kĩ thuật, các nguy cơ mất an toàn phổ biến và quy tắc PCCC trong phòng thí nghiệm.",
        "shortDescription": "Kí hiệu an toàn, nhãn thông số kĩ thuật, các nguy cơ mất an toàn phổ biến và quy tắc PCCC trong phòng thí nghiệm.",
        "chapterTitle": "MỞ ĐẦU",
        "labTag": "Vận hành Nguồn điện & Thiết bị đo an toàn",
        "labTagEn": "Power Supply & Electrical Measurement Safety",
        "knttRef": "KNTT Bài 2 (Trang 11)",
        "ctstRef": "CTST Bài 2 (Trang 12)",
        "simulationId": "electric-circuit",
        "labType": "electric_safety",
        "labTitle": "Vận hành Nguồn điện & Thiết lập thang đo Ampe kế an toàn",
        "labDescription": "Thực hành quy trình kết nối nguồn điện AC/DC, chọn thang đo thích hợp và tránh nguy cơ cháy nổ/hỏng thiết bị.",
        "virtualLabSpec": {
          "experimentName": "Vận hành Nguồn điện & Thiết lập thang đo Ampe kế an toàn",
          "purpose": "Thực hành quy trình kết nối nguồn điện $AC/DC$, chọn thang đo thích hợp và tránh nguy cơ cháy nổ/hỏng thiết bị.",
          "equipmentAndSteps": [
            "1. Chọn bộ chuyển đổi điện áp $AC/DC$ và chọn điện áp đầu ra thích hợp.",
            "2. Mắc Ampe kế nối tiếp với mạch điện có điện trở $R$.",
            "3. Chọn các thang đo Ampe kế khác nhau ($0.6\\text{ A}$ hoặc $3\\text{ A}$)."
          ],
          "physicsNatureAndLogic": "Theo định luật Ohm, dòng điện $I = \\frac{U}{R}$. Nếu chọn thang đo nhỏ hơn giá trị $I$ thực tế, dòng vượt ngưỡng sẽ làm hỏng cuộn dây Ampe kế.",
          "expectedResults": {
            "positive": "Kết quả Tích cực: Chọn thang đo $3\\text{ A}$ cho dòng $1.5\\text{ A}$, kim chỉ chính xác vị trí, mạch hoạt động an toàn.",
            "negative": "Kết quả Tiêu cực (Thao tác sai): Chọn thang $0.6\\text{ A}$ nhưng cho dòng $2\\text{ A}$ chạy qua $\\rightarrow$ Hệ thống báo cháy hỏng Ampe kế; hoặc mắc Ampe kế song song (nhầm với Voltkế) gây ngắt mạch/chập điện."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 7,
          "labRoute": "/simulations/electric-circuit"
        },
        "sections": [
          {
            "title": "1. Kí hiệu an toàn & Nhãn thông số",
            "content": "Khi thực hành trong phòng thí nghiệm, học sinh cần nắm vững các kí hiệu và nhãn thông số:\n\n* **Nguồn điện**:\n  * $DC$ hoặc dấu ($-$) : Dòng điện một chiều.\n  * $AC$ hoặc dấu ($\\sim$) : Dòng điện xoay chiều.\n  * Cực dương ($+$ / màu đỏ), Cực âm ($-$ / màu xanh hoặc đen).\n* **Biển cảnh báo nguy hiểm**:\n  * Cảnh báo nhiệt độ cao, nguồn laser quang học.\n  * Từ trường mạnh, bình khí nén áp suất cao.\n  * Nguy hiểm điện áp cao, chất độc hại và chất phóng xạ.",
            "keyTakeaway": "Phải phân biệt nguồn AC / DC, cực dương / cực âm và nhận diện đầy đủ các biển báo nguy hiểm."
          },
          {
            "title": "2. Nguy cơ mất an toàn trong phòng thực hành",
            "content": "Các nguy cơ thường gặp nếu vi phạm quy tắc:\n* **Sốc điện (điện giật)**: Tiếp xúc trực tiếp với dây dẫn hở hoặc điện áp nguồn vượt ngưỡng an toàn.\n* **Hỏng Ampe kế**: Do đo dòng vượt quá giới hạn thang đo ($I > I_{\\max}$) làm cháy đứt cuộn dây đo.\n* **Đoản mạch (chập mạch)**: Mắc nhầm Ampe kế song song với nguồn điện thay vì mắc nối tiếp.\n* **Cháy nổ**: Đặt hóa chất dễ cháy gần nguồn nhiệt hoặc chập cháy tia lửa điện.",
            "keyTakeaway": "Luôn kiểm tra mạch điện trước khi đóng cầu dao; chọn thang đo Ampe kế từ lớn đến nhỏ."
          },
          {
            "title": "3. Quy tắc an toàn PCCC",
            "content": "Quy trình ứng phó khẩn cấp khi có sự cố:\n* **Ngắt toàn bộ hệ thống điện ngay lập tức** khi phát hiện khói, tia lửa điện hoặc người bị giật.\n* **Không dùng nước dập đám cháy thiết bị điện hoặc dầu cồn** vì nước dẫn điện gây giật lan truyền và dầu nổi trên nước làm đám cháy lan rộng.\n* **Không dùng $\\text{CO}_2$ dập đám cháy kim loại kiềm** (như $\\text{Na}, \\text{K}$) hoặc đám cháy trên người (khí $\\text{CO}_2$ lạnh hóa lỏng gây bỏng lạnh mô thịt).",
            "keyTakeaway": "Cắt cầu dao trước tiên! Dùng bình CO2 hoặc bình bột cho đám cháy điện, tuyệt đối không dùng nước."
          }
        ],
        "theorySections": [
          {
            "title": "1. Kí hiệu an toàn & Nhãn thông số",
            "content": "Khi thực hành trong phòng thí nghiệm, học sinh cần nắm vững các kí hiệu và nhãn thông số:\n\n* **Nguồn điện**:\n  * $DC$ hoặc dấu ($-$) : Dòng điện một chiều.\n  * $AC$ hoặc dấu ($\\sim$) : Dòng điện xoay chiều.\n  * Cực dương ($+$ / màu đỏ), Cực âm ($-$ / màu xanh hoặc đen).\n* **Biển cảnh báo nguy hiểm**:\n  * Cảnh báo nhiệt độ cao, nguồn laser quang học.\n  * Từ trường mạnh, bình khí nén áp suất cao.\n  * Nguy hiểm điện áp cao, chất độc hại và chất phóng xạ.",
            "keyTakeaway": "Phải phân biệt nguồn AC / DC, cực dương / cực âm và nhận diện đầy đủ các biển báo nguy hiểm."
          },
          {
            "title": "2. Nguy cơ mất an toàn trong phòng thực hành",
            "content": "Các nguy cơ thường gặp nếu vi phạm quy tắc:\n* **Sốc điện (điện giật)**: Tiếp xúc trực tiếp với dây dẫn hở hoặc điện áp nguồn vượt ngưỡng an toàn.\n* **Hỏng Ampe kế**: Do đo dòng vượt quá giới hạn thang đo ($I > I_{\\max}$) làm cháy đứt cuộn dây đo.\n* **Đoản mạch (chập mạch)**: Mắc nhầm Ampe kế song song với nguồn điện thay vì mắc nối tiếp.\n* **Cháy nổ**: Đặt hóa chất dễ cháy gần nguồn nhiệt hoặc chập cháy tia lửa điện.",
            "keyTakeaway": "Luôn kiểm tra mạch điện trước khi đóng cầu dao; chọn thang đo Ampe kế từ lớn đến nhỏ."
          },
          {
            "title": "3. Quy tắc an toàn PCCC",
            "content": "Quy trình ứng phó khẩn cấp khi có sự cố:\n* **Ngắt toàn bộ hệ thống điện ngay lập tức** khi phát hiện khói, tia lửa điện hoặc người bị giật.\n* **Không dùng nước dập đám cháy thiết bị điện hoặc dầu cồn** vì nước dẫn điện gây giật lan truyền và dầu nổi trên nước làm đám cháy lan rộng.\n* **Không dùng $\\text{CO}_2$ dập đám cháy kim loại kiềm** (như $\\text{Na}, \\text{K}$) hoặc đám cháy trên người (khí $\\text{CO}_2$ lạnh hóa lỏng gây bỏng lạnh mô thịt).",
            "keyTakeaway": "Cắt cầu dao trước tiên! Dùng bình CO2 hoặc bình bột cho đám cháy điện, tuyệt đối không dùng nước."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Cường độ dòng điện an toàn",
            "latex": "I_{max} \\le I_{dm}",
            "unit": "Ampe (A)",
            "notes": "Dòng điện thực tế không được vượt quá giá trị định mức của thiết bị để tránh cháy nổ."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Kí hiệu an toàn & Nhãn thông số",
              "content": "Khi thực hành trong phòng thí nghiệm, học sinh cần nắm vững các kí hiệu và nhãn thông số:\n\n* **Nguồn điện**:\n  * $DC$ hoặc dấu ($-$) : Dòng điện một chiều.\n  * $AC$ hoặc dấu ($\\sim$) : Dòng điện xoay chiều.\n  * Cực dương ($+$ / màu đỏ), Cực âm ($-$ / màu xanh hoặc đen).\n* **Biển cảnh báo nguy hiểm**:\n  * Cảnh báo nhiệt độ cao, nguồn laser quang học.\n  * Từ trường mạnh, bình khí nén áp suất cao.\n  * Nguy hiểm điện áp cao, chất độc hại và chất phóng xạ.",
              "keyTakeaway": "Phải phân biệt nguồn AC / DC, cực dương / cực âm và nhận diện đầy đủ các biển báo nguy hiểm."
            },
            {
              "num": 2,
              "heading": "2. Nguy cơ mất an toàn trong phòng thực hành",
              "content": "Các nguy cơ thường gặp nếu vi phạm quy tắc:\n* **Sốc điện (điện giật)**: Tiếp xúc trực tiếp với dây dẫn hở hoặc điện áp nguồn vượt ngưỡng an toàn.\n* **Hỏng Ampe kế**: Do đo dòng vượt quá giới hạn thang đo ($I > I_{\\max}$) làm cháy đứt cuộn dây đo.\n* **Đoản mạch (chập mạch)**: Mắc nhầm Ampe kế song song với nguồn điện thay vì mắc nối tiếp.\n* **Cháy nổ**: Đặt hóa chất dễ cháy gần nguồn nhiệt hoặc chập cháy tia lửa điện.",
              "keyTakeaway": "Luôn kiểm tra mạch điện trước khi đóng cầu dao; chọn thang đo Ampe kế từ lớn đến nhỏ."
            },
            {
              "num": 3,
              "heading": "3. Quy tắc an toàn PCCC",
              "content": "Quy trình ứng phó khẩn cấp khi có sự cố:\n* **Ngắt toàn bộ hệ thống điện ngay lập tức** khi phát hiện khói, tia lửa điện hoặc người bị giật.\n* **Không dùng nước dập đám cháy thiết bị điện hoặc dầu cồn** vì nước dẫn điện gây giật lan truyền và dầu nổi trên nước làm đám cháy lan rộng.\n* **Không dùng $\\text{CO}_2$ dập đám cháy kim loại kiềm** (như $\\text{Na}, \\text{K}$) hoặc đám cháy trên người (khí $\\text{CO}_2$ lạnh hóa lỏng gây bỏng lạnh mô thịt).",
              "keyTakeaway": "Cắt cầu dao trước tiên! Dùng bình CO2 hoặc bình bột cho đám cháy điện, tuyệt đối không dùng nước."
            }
          ],
          "ghiNho": "Ghi nhớ: An toàn điện và bảo vệ thiết bị đo là ưu tiên số một trong mọi giờ thực hành Vật lí.",
          "part2_formulas": [
            {
              "formula": "I_{max} \\le I_{dm}",
              "quantity": "Cường độ dòng điện an toàn",
              "symbol": "I",
              "unit": "Ampe (A)",
              "meaning": "Dòng điện thực tế không được vượt quá giá trị định mức của thiết bị để tránh cháy nổ."
            }
          ],
          "part3_applications": [
            "Sử dụng cầu chì và aptomat ngắt tự động trong gia đình khi quá tải.",
            "Đeo kính bảo hộ chuyên dụng khi làm thí nghiệm với nguồn sáng Laser."
          ]
        },
        "quizzes": [
          {
            "id": "b2-q1",
            "question": "Biển cảnh báo có dạng hình tam giác đều viền đen, nền màu vàng có ý nghĩa gì?",
            "questionEn": "A triangular sign with black border and yellow background indicates:",
            "options": [
              "Biển cấm thực hiện hành vi.",
              "Biển cảnh báo khu vực có nguy hiểm.",
              "Biển chỉ dẫn các trang bị bảo hộ bắt buộc.",
              "Biển chỉ lối thoát hiểm."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Kí hiệu hình tam giác đều, viền đen nền vàng là biển báo **nguy hiểm** (ví dụ: nguy hiểm điện giật, tia laser nguy hiểm, chất độc ăn mòn).",
            "conceptTested": "Kí hiệu an toàn phòng thí nghiệm",
            "textbookRef": "KNTT Bài 2 (Trang 12)",
            "difficulty": "medium"
          },
          {
            "id": "b2-q2",
            "question": "Khi sử dụng thiết bị đo điện tử trong phòng thí nghiệm, kí hiệu $AC$ và $DC$ lần lượt chỉ:",
            "questionEn": "When using a multimeter to measure an unknown voltage, the correct procedure is:",
            "options": [
              "Dòng điện một chiều và dòng điện xoay chiều.",
              "Dòng điện xoay chiều và dòng điện một chiều.",
              "Dòng điện cao áp và dòng điện hạ áp.",
              "Điện trở và điện áp."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "$AC$ viết tắt của Alternating Current (dòng điện xoay chiều). $DC$ viết tắt của Direct Current (dòng điện một chiều).",
            "conceptTested": "Quy tắc an toàn đồng hồ vạn năng",
            "textbookRef": "KNTT Bài 2 (Trang 13)",
            "difficulty": "medium"
          },
          {
            "id": "b2-q3",
            "question": "Khi đo cường độ dòng điện mạch một chiều ước lượng khoảng $100\\text{ mA}$, ta nên chọn thang đo nào của Ampe kế để an toàn và chính xác nhất?",
            "questionEn": "Which of the following violates physics lab safety rules?",
            "options": [
              "Thang đo $50\\text{ mA}$",
              "Thang đo $200\\text{ mA}$ hoặc $250\\text{ mA}$",
              "Thang đo $20\\text{ A}$",
              "Thang đo điện áp $500\\text{ V}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Cần chọn thang đo lớn hơn giá trị ước lượng cần đo nhưng gần nhất với giá trị đó ($200\\text{ mA} > 100\\text{ mA}$). Nếu chọn thang $50\\text{ mA}$ sẽ làm cháy đồng hồ; nếu chọn thang $20\\text{ A}$ thì kim lệch quá ít, sai số đọc rất lớn.",
            "conceptTested": "An toàn sử dụng điện",
            "textbookRef": "KNTT Bài 2 (Trang 13)",
            "difficulty": "medium"
          },
          {
            "id": "b2-q4",
            "question": "Khi phát hiện có sự cố chập điện gây cháy trong phòng thực hành, hành động ĐẦU TIÊN cần làm là:",
            "questionEn": "When working with laser beams in the optics lab, it is strictly forbidden to:",
            "options": [
              "Dùng xô nước tạt ngay vào đám cháy.",
              "Ngắt ngay cầu dao điện chính (aptomat) của phòng thí nghiệm.",
              "Dùng bình chữa cháy xịt vào khi nguồn điện vẫn đang thông mạch.",
              "Mở toang tất cả các cửa sổ để khói thoát ra ngoài."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Quy tắc an toàn khẩn cấp: Việc tiên quyết đầu tiên luôn là **ngắt nguồn điện chính** để triệt tiêu nguồn phát nhiệt và nguy cơ điện giật. Tuyệt đối không dùng nước dập lửa khi chưa ngắt điện.",
            "conceptTested": "An toàn quang học Laser",
            "textbookRef": "KNTT Bài 2 (Trang 14)",
            "difficulty": "medium"
          },
          {
            "id": "b2-q5",
            "question": "Vì sao tuyệt đối không được nhìn trực tiếp vào chùm tia laser trong các thí nghiệm quang học?",
            "questionEn": "Which device automatically disconnects the circuit during a short circuit or overload?",
            "options": [
              "Vì tia laser có mật độ năng lượng rất cao, có thể gây bỏng võng mạc và hỏng mắt vĩnh viễn.",
              "Vì ánh sáng tia laser làm mờ kính đeo mắt thông thường.",
              "Vì tia laser làm giảm độ phân giải của máy tính xung quanh.",
              "Vì tia laser tạo ra tiếng ồn siêu âm gây hại tai."
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Tia laser có tính đơn sắc, độ định hướng cực cao và mật độ công suất hội tụ rất lớn. Khi chiếu vào mắt, thủy tinh thể sẽ hội tụ tia sáng lên hoàng điểm của võng mạc gây cháy hỏng tế bào thị giác tức thì.",
            "conceptTested": "Thiết bị bảo vệ mạch",
            "textbookRef": "KNTT Bài 2 (Trang 14)",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-3",
        "chapterId": "chuong-1",
        "lessonNum": 3,
        "number": 3,
        "title": "Thực hành tính sai số trong phép đo",
        "titleEn": "Measurement and Error Analysis Lab",
        "subtitle": "Phép đo trực tiếp & gián tiếp, sai số dụng cụ, sai số ngẫu nhiên, các công thức tính sai số và quy tắc ghi kết quả đo.",
        "subtitleEn": "Systematic error, random error, measurement expression with significant figures.",
        "shortDesc": "Phép đo trực tiếp & gián tiếp, sai số dụng cụ, sai số ngẫu nhiên, các công thức tính sai số và quy tắc ghi kết quả đo.",
        "shortDescription": "Phép đo trực tiếp & gián tiếp, sai số dụng cụ, sai số ngẫu nhiên, các công thức tính sai số và quy tắc ghi kết quả đo.",
        "chapterTitle": "MỞ ĐẦU",
        "labTag": "Đo tốc độ của viên bi thép lăn trên máng nghiêng",
        "labTagEn": "Measurement of Steel Ball Rolling Down Incline",
        "knttRef": "KNTT Bài 3 (Trang 15)",
        "ctstRef": "CTST Bài 3 (Trang 16)",
        "simulationId": "measurement-error",
        "labType": "photogate_error",
        "labTitle": "Đo tốc độ $v$ của viên bi thép lăn trên máng nghiêng bằng Cổng quang điện & Đồng hồ đo thời gian hiện số MC964",
        "labDescription": "Xác định sai số trực tiếp của quãng đường s, thời gian t và tính sai số gián tiếp của tốc độ v = s/t.",
        "virtualLabSpec": {
          "experimentName": "Đo tốc độ $v$ của viên bi thép lăn trên máng nghiêng bằng Cổng quang điện & Đồng hồ đo thời gian hiện số MC964",
          "purpose": "Xác định sai số trực tiếp của quãng đường $s$, thời gian $t$ và tính sai số gián tiếp của tốc độ $v = \\frac{s}{t}$.",
          "equipmentAndSteps": [
            "1. Điều chỉnh cổng quang điện $E$ và $F$ trên máng nghiêng, đo khoảng cách $s$ bằng thước.",
            "2. Đặt đồng hồ MC964 ở chế độ $MODE A \\leftrightarrow B$.",
            "3. Thả viên bi từ nam châm điện $N$, ghi lại thời gian $t$ hiển thị (lặp lại 5 lần)."
          ],
          "physicsNatureAndLogic": "Tốc độ trung bình: $\\overline{v} = \\frac{\\overline{s}}{\\overline{t}}$. Phép tính sai số tỉ đối gián tiếp: $\\delta v = \\delta s + \\delta t = \\frac{\\Delta s}{\\overline{s}} \\cdot 100\\% + \\frac{\\Delta t}{\\overline{t}} \\cdot 100\\%$. Sai số tuyệt đối: $\\Delta v = \\delta v \\cdot \\overline{v}$.",
          "expectedResults": {
            "positive": "Kết quả Tích cực: Bảng dữ liệu tự động tính toán $t_1, t_2, \\dots, t_5$, xuất ra kết quả dạng $v = \\overline{v} \\pm \\Delta v$, vẽ đồ thị có các ô bao sai số dạng hình chữ nhật $2\\Delta x \\times 2\\Delta y$ xung quanh điểm thực nghiệm.",
            "negative": "Kết quả Tiêu cực: Thả bi ở các vị trí ban đầu không đồng nhất làm tăng mạnh sai số ngẫu nhiên $\\overline{\\Delta t}$, khiến sai số tỉ đối $\\delta v$ vượt quá $10\\%$ (phép đo không đáng tin cậy)."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Phân loại phép đo",
            "content": "* **Phép đo trực tiếp**: Đọc trực tiếp kết quả trên dụng cụ đo (ví dụ: đo chiều dài bằng thước kẻ, đo thời gian bằng đồng hồ bấm giây, đo nhiệt độ bằng nhiệt kế).\n* **Phép đo gián tiếp**: Xác định thông qua công thức liên hệ với các đại lượng đo trực tiếp (ví dụ: đo tốc độ $v = \\frac{s}{t}$, đo khối lượng riêng $\\rho = \\frac{m}{V}$).",
            "keyTakeaway": "Phép đo trực tiếp đọc ngay trên thang chia dụng cụ; phép đo gián tiếp tính qua công thức."
          },
          {
            "title": "2. Phân loại sai số",
            "content": "* **Sai số hệ thống (dụng cụ)**: Do đặc điểm cấu tạo dụng cụ gây ra, có tính quy luật lặp lại. Thường lấy bằng một nửa độ chia nhỏ nhất (ĐCNN):\n$$\\Delta A_{dc} = \\frac{1}{2}\\text{ĐCNN}$$\n(hoặc bằng 1 ĐCNN theo quy định của nhà sản xuất).\n* **Sai số ngẫu nhiên**: Do thao tác đo của con người, phản xạ bấm đồng hồ, góc nhìn lệch hoặc điều kiện môi trường bất định. Có thể giảm thiểu bằng cách đo nhiều lần (ít nhất 3 - 5 lần).",
            "keyTakeaway": "Sai số dụng cụ: ΔA_dc = 1/2 ĐCNN. Sai số ngẫu nhiên được khắc phục bằng cách đo lặp lại nhiều lần."
          },
          {
            "title": "3. Công thức tính sai số phép đo trực tiếp",
            "content": "Khi đo $n$ lần đại lượng $A$ ta thu được các giá trị $A_1, A_2, \\dots, A_n$:\n\n* **Giá trị trung bình**:\n$$\\overline{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}$$\n\n* **Sai số ngẫu nhiên tuyệt đối trung bình**:\n$$\\overline{\\Delta A} = \\frac{\\Delta A_1 + \\Delta A_2 + \\dots + \\Delta A_n}{n}$$\nvới $\\Delta A_i = |\\overline{A} - A_i|$ là sai số tuyệt đối của lần đo thứ $i$.\n\n* **Sai số tuyệt đối toàn phần**:\n$$\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$$\n\n* **Sai số tỉ đối**:\n$$\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%$$",
            "keyTakeaway": "ΔA = ΔA_bar + ΔA_dc. Sai số tỉ đối δA biểu thị độ chuẩn xác của phép đo.",
            "formulas": [
              {
                "name": "Giá trị trung bình",
                "latex": "\\overline{A} = \\frac{1}{n} \\sum_{i=1}^n A_i",
                "description": "Giá trị đại diện cho phép đo"
              },
              {
                "name": "Sai số tuyệt đối",
                "latex": "\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}",
                "description": "Tổng sai số ngẫu nhiên và sai số dụng cụ"
              },
              {
                "name": "Sai số tỉ đối",
                "latex": "\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%",
                "description": "Tỉ số đánh giá độ tin cậy của phép đo",
                "units": "%"
              }
            ]
          },
          {
            "title": "4. Ghi kết quả đo & Sai số phép đo gián tiếp",
            "content": "### Quy cách ghi kết quả đo:\n$$A = \\overline{A} \\pm \\Delta A$$\n\n**Quy tắc làm tròn**:\n* Sai số tuyệt đối $\\Delta A$ làm tròn đến **1 hoặc 2 chữ số có nghĩa**.\n* Giá trị trung bình $\\overline{A}$ làm tròn đến cùng bậc thập phân với chữ số có nghĩa của $\\Delta A$.\n\n### Phép tính sai số đo gián tiếp:\n* **Đại lượng dạng tổng/hiệu** ($F = X + Y - Z$): $\\Delta F = \\Delta X + \\Delta Y + \\Delta Z$\n* **Đại lượng dạng tích/thương** ($v = \\frac{s}{t}$):\n$$\\delta v = \\delta s + \\delta t = \\frac{\\Delta s}{\\overline{s}} \\cdot 100\\% + \\frac{\\Delta t}{\\overline{t}} \\cdot 100\\%$$\nTừ đó suy ra sai số tuyệt đối: $\\Delta v = \\delta v \\cdot \\overline{v}$.",
            "keyTakeaway": "Kết quả: A = A_bar ± ΔA. Với tích/thương: cộng sai số tỉ đối δF = δX + δY."
          }
        ],
        "theorySections": [
          {
            "title": "1. Phân loại phép đo",
            "content": "* **Phép đo trực tiếp**: Đọc trực tiếp kết quả trên dụng cụ đo (ví dụ: đo chiều dài bằng thước kẻ, đo thời gian bằng đồng hồ bấm giây, đo nhiệt độ bằng nhiệt kế).\n* **Phép đo gián tiếp**: Xác định thông qua công thức liên hệ với các đại lượng đo trực tiếp (ví dụ: đo tốc độ $v = \\frac{s}{t}$, đo khối lượng riêng $\\rho = \\frac{m}{V}$).",
            "keyTakeaway": "Phép đo trực tiếp đọc ngay trên thang chia dụng cụ; phép đo gián tiếp tính qua công thức."
          },
          {
            "title": "2. Phân loại sai số",
            "content": "* **Sai số hệ thống (dụng cụ)**: Do đặc điểm cấu tạo dụng cụ gây ra, có tính quy luật lặp lại. Thường lấy bằng một nửa độ chia nhỏ nhất (ĐCNN):\n$$\\Delta A_{dc} = \\frac{1}{2}\\text{ĐCNN}$$\n(hoặc bằng 1 ĐCNN theo quy định của nhà sản xuất).\n* **Sai số ngẫu nhiên**: Do thao tác đo của con người, phản xạ bấm đồng hồ, góc nhìn lệch hoặc điều kiện môi trường bất định. Có thể giảm thiểu bằng cách đo nhiều lần (ít nhất 3 - 5 lần).",
            "keyTakeaway": "Sai số dụng cụ: ΔA_dc = 1/2 ĐCNN. Sai số ngẫu nhiên được khắc phục bằng cách đo lặp lại nhiều lần."
          },
          {
            "title": "3. Công thức tính sai số phép đo trực tiếp",
            "content": "Khi đo $n$ lần đại lượng $A$ ta thu được các giá trị $A_1, A_2, \\dots, A_n$:\n\n* **Giá trị trung bình**:\n$$\\overline{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}$$\n\n* **Sai số ngẫu nhiên tuyệt đối trung bình**:\n$$\\overline{\\Delta A} = \\frac{\\Delta A_1 + \\Delta A_2 + \\dots + \\Delta A_n}{n}$$\nvới $\\Delta A_i = |\\overline{A} - A_i|$ là sai số tuyệt đối của lần đo thứ $i$.\n\n* **Sai số tuyệt đối toàn phần**:\n$$\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$$\n\n* **Sai số tỉ đối**:\n$$\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%$$",
            "keyTakeaway": "ΔA = ΔA_bar + ΔA_dc. Sai số tỉ đối δA biểu thị độ chuẩn xác của phép đo.",
            "formulas": [
              {
                "name": "Giá trị trung bình",
                "latex": "\\overline{A} = \\frac{1}{n} \\sum_{i=1}^n A_i",
                "description": "Giá trị đại diện cho phép đo"
              },
              {
                "name": "Sai số tuyệt đối",
                "latex": "\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}",
                "description": "Tổng sai số ngẫu nhiên và sai số dụng cụ"
              },
              {
                "name": "Sai số tỉ đối",
                "latex": "\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%",
                "description": "Tỉ số đánh giá độ tin cậy của phép đo",
                "units": "%"
              }
            ]
          },
          {
            "title": "4. Ghi kết quả đo & Sai số phép đo gián tiếp",
            "content": "### Quy cách ghi kết quả đo:\n$$A = \\overline{A} \\pm \\Delta A$$\n\n**Quy tắc làm tròn**:\n* Sai số tuyệt đối $\\Delta A$ làm tròn đến **1 hoặc 2 chữ số có nghĩa**.\n* Giá trị trung bình $\\overline{A}$ làm tròn đến cùng bậc thập phân với chữ số có nghĩa của $\\Delta A$.\n\n### Phép tính sai số đo gián tiếp:\n* **Đại lượng dạng tổng/hiệu** ($F = X + Y - Z$): $\\Delta F = \\Delta X + \\Delta Y + \\Delta Z$\n* **Đại lượng dạng tích/thương** ($v = \\frac{s}{t}$):\n$$\\delta v = \\delta s + \\delta t = \\frac{\\Delta s}{\\overline{s}} \\cdot 100\\% + \\frac{\\Delta t}{\\overline{t}} \\cdot 100\\%$$\nTừ đó suy ra sai số tuyệt đối: $\\Delta v = \\delta v \\cdot \\overline{v}$.",
            "keyTakeaway": "Kết quả: A = A_bar ± ΔA. Với tích/thương: cộng sai số tỉ đối δF = δX + δY."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Giá trị trung bình",
            "latex": "\\overline{A} = \\frac{1}{n} \\sum_{i=1}^n A_i"
          },
          {
            "name": "Sai số tuyệt đối",
            "latex": "\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}"
          },
          {
            "name": "Sai số tỉ đối",
            "latex": "\\delta A = \\frac{\\Delta A}{\\overline{A}} \\times 100\\%"
          },
          {
            "name": "Ghi kết quả",
            "latex": "A = \\overline{A} \\pm \\Delta A"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Phân loại phép đo",
              "content": "* **Phép đo trực tiếp**: Đọc trực tiếp kết quả trên dụng cụ đo (ví dụ: đo chiều dài bằng thước kẻ, đo thời gian bằng đồng hồ bấm giây, đo nhiệt độ bằng nhiệt kế).\n* **Phép đo gián tiếp**: Xác định thông qua công thức liên hệ với các đại lượng đo trực tiếp (ví dụ: đo tốc độ $v = \\frac{s}{t}$, đo khối lượng riêng $\\rho = \\frac{m}{V}$).",
              "keyTakeaway": "Phép đo trực tiếp đọc ngay trên thang chia dụng cụ; phép đo gián tiếp tính qua công thức."
            },
            {
              "num": 2,
              "heading": "2. Phân loại sai số",
              "content": "* **Sai số hệ thống (dụng cụ)**: Do đặc điểm cấu tạo dụng cụ gây ra, có tính quy luật lặp lại. Thường lấy bằng một nửa độ chia nhỏ nhất (ĐCNN):\n$$\\Delta A_{dc} = \\frac{1}{2}\\text{ĐCNN}$$\n(hoặc bằng 1 ĐCNN theo quy định của nhà sản xuất).\n* **Sai số ngẫu nhiên**: Do thao tác đo của con người, phản xạ bấm đồng hồ, góc nhìn lệch hoặc điều kiện môi trường bất định. Có thể giảm thiểu bằng cách đo nhiều lần (ít nhất 3 - 5 lần).",
              "keyTakeaway": "Sai số dụng cụ: ΔA_dc = 1/2 ĐCNN. Sai số ngẫu nhiên được khắc phục bằng cách đo lặp lại nhiều lần."
            },
            {
              "num": 3,
              "heading": "3. Công thức tính sai số phép đo trực tiếp",
              "content": "Khi đo $n$ lần đại lượng $A$ ta thu được các giá trị $A_1, A_2, \\dots, A_n$:\n\n* **Giá trị trung bình**:\n$$\\overline{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}$$\n\n* **Sai số ngẫu nhiên tuyệt đối trung bình**:\n$$\\overline{\\Delta A} = \\frac{\\Delta A_1 + \\Delta A_2 + \\dots + \\Delta A_n}{n}$$\nvới $\\Delta A_i = |\\overline{A} - A_i|$ là sai số tuyệt đối của lần đo thứ $i$.\n\n* **Sai số tuyệt đối toàn phần**:\n$$\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$$\n\n* **Sai số tỉ đối**:\n$$\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%$$",
              "keyTakeaway": "ΔA = ΔA_bar + ΔA_dc. Sai số tỉ đối δA biểu thị độ chuẩn xác của phép đo."
            },
            {
              "num": 4,
              "heading": "4. Ghi kết quả đo & Sai số phép đo gián tiếp",
              "content": "### Quy cách ghi kết quả đo:\n$$A = \\overline{A} \\pm \\Delta A$$\n\n**Quy tắc làm tròn**:\n* Sai số tuyệt đối $\\Delta A$ làm tròn đến **1 hoặc 2 chữ số có nghĩa**.\n* Giá trị trung bình $\\overline{A}$ làm tròn đến cùng bậc thập phân với chữ số có nghĩa của $\\Delta A$.\n\n### Phép tính sai số đo gián tiếp:\n* **Đại lượng dạng tổng/hiệu** ($F = X + Y - Z$): $\\Delta F = \\Delta X + \\Delta Y + \\Delta Z$\n* **Đại lượng dạng tích/thương** ($v = \\frac{s}{t}$):\n$$\\delta v = \\delta s + \\delta t = \\frac{\\Delta s}{\\overline{s}} \\cdot 100\\% + \\frac{\\Delta t}{\\overline{t}} \\cdot 100\\%$$\nTừ đó suy ra sai số tuyệt đối: $\\Delta v = \\delta v \\cdot \\overline{v}$.",
              "keyTakeaway": "Kết quả: A = A_bar ± ΔA. Với tích/thương: cộng sai số tỉ đối δF = δX + δY."
            }
          ],
          "ghiNho": "Ghi nhớ: Kết quả đo luôn được viết dưới dạng: A = Ā ± ΔA, trong đó ΔA thường được làm tròn đến một hoặc hai chữ số có nghĩa.",
          "part2_formulas": [
            {
              "formula": "\\bar{A} = \\frac{1}{n}\\sum_{i=1}^n A_i",
              "quantity": "Giá trị trung bình",
              "symbol": "\\bar{A}",
              "unit": "Đơn vị đo của A",
              "meaning": "Giá trị gần đúng nhất với giá trị thực của đại lượng cần đo."
            },
            {
              "formula": "\\delta A = \\frac{\\Delta A}{\\bar{A}} \\times 100\\%",
              "quantity": "Sai số tỉ đối",
              "symbol": "\\delta A",
              "unit": "%",
              "meaning": "Đánh giá mức độ chính xác của phép đo (sai số tỉ đối càng nhỏ, phép đo càng chính xác)."
            }
          ],
          "part3_applications": [
            "Đo đường kính ngoài của ống trụ bằng thước kẹp cơ khí chuẩn xác đến 0,02 mm.",
            "Hiệu chuẩn cân điện tử phân tích trong phòng thí nghiệm hóa dược."
          ]
        },
        "quizzes": [
          {
            "id": "b3-q1",
            "question": "Phép đo nào sau đây là phép đo TRỰC TIẾP?",
            "questionEn": "The instrumental error is conventionally taken as:",
            "options": [
              "Đo tốc độ chuyển động bằng công thức $v = \\frac{s}{t}$.",
              "Đo khối lượng riêng bằng công thức $\\rho = \\frac{m}{V}$.",
              "Đo thời gian rơi của một vật bằng đồng hồ bấm giây hiện số.",
              "Đo diện tích hình tròn bằng công thức $S = \\pi R^2$."
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Đo thời gian bằng đồng hồ đọc trực tiếp kết quả trên mặt hiển thị nên là phép đo trực tiếp. Các phép đo tính toán qua công thức toán học từ các đại lượng khác là phép đo gián tiếp.",
            "conceptTested": "Sai số dụng cụ",
            "textbookRef": "KNTT Bài 3 (Trang 16)",
            "difficulty": "medium"
          },
          {
            "id": "b3-q2",
            "question": "Dùng một thước có độ chia nhỏ nhất (ĐCNN) là $1\\text{ mm}$ để đo chiều dài một vật. Sai số dụng cụ thường được quy ước lấy bằng:",
            "questionEn": "Measuring a pen length 5 times yields: 14.2; 14.3; 14.2; 14.4; 14.2 cm. The mean value is:",
            "options": [
              "$1\\text{ cm}$",
              "$0{,}5\\text{ mm}$ hoặc $1\\text{ mm}$",
              "$2\\text{ mm}$",
              "$0{,}1\\text{ mm}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Theo quy ước SGK Vật lí 10, sai số dụng cụ $\\Delta A_{dc}$ thường lấy bằng một nửa độ chia nhỏ nhất ($0{,}5\\text{ mm}$) hoặc bằng đúng một độ chia nhỏ nhất ($1\\text{ mm}$).",
            "conceptTested": "Tính giá trị trung bình",
            "textbookRef": "KNTT Bài 3 (Trang 17)",
            "difficulty": "medium"
          },
          {
            "id": "b3-q3",
            "question": "Đo 5 lần đường kính viên bi thu được các giá trị (đơn vị $\\text{mm}$): $12{,}2;\\; 12{,}4;\\; 12{,}3;\\; 12{,}2;\\; 12{,}4$. Giá trị trung bình của đường kính là:",
            "questionEn": "A measurement gives A = (20.0 ± 0.4) cm. The relative error δA is:",
            "options": [
              "$12{,}25\\text{ mm}$",
              "$12{,}30\\text{ mm}$",
              "$12{,}35\\text{ mm}$",
              "$12{,}50\\text{ mm}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Áp dụng công thức tính giá trị trung bình:\n$$\\bar{d} = \\frac{12{,}2 + 12{,}4 + 12{,}3 + 12{,}2 + 12{,}4}{5} = \\frac{61{,}5}{5} = 12{,}30\\text{ mm}$$",
            "conceptTested": "Tính sai số tỉ đối",
            "textbookRef": "KNTT Bài 3 (Trang 17)",
            "difficulty": "medium"
          },
          {
            "id": "b3-q4",
            "question": "Một đại lượng đo được có giá trị trung bình $\\bar{A} = 20{,}0\\text{ m}$ và sai số tuyệt đối $\\Delta A = 0{,}4\\text{ m}$. Sai số tỉ đối của phép đo là:",
            "questionEn": "To minimize random errors in a physics experiment, one should:",
            "options": [
              "$0{,}2\\%$",
              "$2\\%$",
              "$4\\%$",
              "$0{,}02\\%$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Áp dụng công thức tính sai số tỉ đối:\n$$\\delta A = \\frac{\\Delta A}{\\bar{A}} \\cdot 100\\% = \\frac{0{,}4}{20{,}0} \\cdot 100\\% = 2\\%$$",
            "conceptTested": "Khắc phục sai số ngẫu nhiên",
            "textbookRef": "KNTT Bài 3 (Trang 18)",
            "difficulty": "medium"
          },
          {
            "id": "b3-q5",
            "question": "Khối lượng riêng $\\rho = \\frac{m}{V}$. Biết sai số tỉ đối của khối lượng $\\delta m = 1{,}5\\%$ và của thể tích $\\delta V = 2{,}0\\%$. Sai số tỉ đối của phép đo khối lượng riêng là:",
            "questionEn": "Given F = m · a with relative errors δm = 1% and δa = 2%, the relative error δF is:",
            "options": [
              "$\\delta \\rho = 0{,}5\\%$",
              "$\\delta \\rho = 3{,}5\\%$",
              "$\\delta \\rho = 3{,}0\\%$",
              "$\\delta \\rho = 0{,}75\\%$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Quy tắc sai số đối với phép chia $\\rho = \\frac{m}{V}$:\n$$\\delta \\rho = \\delta m + \\delta V = 1{,}5\\% + 2{,}0\\% = 3{,}5\\%$$",
            "conceptTested": "Lan truyền sai số trong phép nhân",
            "textbookRef": "KNTT Bài 3 (Trang 18)",
            "difficulty": "medium"
          },
          {
            "id": "b3-q6",
            "question": "Cách ghi kết quả đo nào sau đây là ĐÚNG quy tắc viết chữ số có nghĩa?",
            "options": [
              "$L = (15{,}342 \\pm 0{,}2)\\text{ cm}$",
              "$L = (15{,}3 \\pm 0{,}2)\\text{ cm}$",
              "$L = (15 \\pm 0{,}2)\\text{ cm}$",
              "$L = (15{,}34 \\pm 0{,}2)\\text{ cm}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Sai số $\\Delta L = 0{,}2\\text{ cm}$ có chữ số có nghĩa ở hàng phần mười, do đó giá trị trung bình $\\bar{L}$ cũng phải được làm tròn đến hàng phần mười: $15{,}3\\text{ cm}$. Cách ghi chuẩn là $L = (15{,}3 \\pm 0{,}2)\\text{ cm}$.",
            "conceptTested": "Cách ghi kết quả đo nào sau đây là ĐÚNG quy tắc vi",
            "textbookRef": "KNTT Bài 3 (Trang 15)",
            "difficulty": "medium"
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuong-2",
    "number": 2,
    "romanNumeral": "II",
    "title": "ĐỘNG HỌC",
    "titleEn": "KINEMATICS",
    "description": "Mô tả chuyển động thẳng, độ dịch chuyển, vận tốc, gia tốc, chuyển động thẳng biến đổi đều, sự rơi tự do và chuyển động ném.",
    "lessons": [
      {
        "id": "bai-4",
        "chapterId": "chuong-2",
        "lessonNum": 4,
        "number": 4,
        "title": "Độ dịch chuyển và quãng đường đi được",
        "titleEn": "Displacement and Distance Traveled",
        "subtitle": "Hệ quy chiếu, phân biệt quãng đường s (vô hướng) và độ dịch chuyển vectơ d, tổng hợp độ dịch chuyển.",
        "subtitleEn": "Distinguish scalar distance s and vector displacement d.",
        "shortDesc": "Hệ quy chiếu, phân biệt quãng đường s (vô hướng) và độ dịch chuyển vectơ d, tổng hợp độ dịch chuyển.",
        "shortDescription": "Hệ quy chiếu, phân biệt quãng đường s (vô hướng) và độ dịch chuyển vectơ d, tổng hợp độ dịch chuyển.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Mô phỏng Quãng đường vs Độ dịch chuyển 2D",
        "labTagEn": "Distance vs Displacement 2D Simulation",
        "knttRef": "KNTT Bài 4 (Trang 21)",
        "ctstRef": "CTST Bài 4 (Trang 24)",
        "simulationId": "displacement-time",
        "labType": "vector_velocity",
        "labTitle": "Mô phỏng Quãng đường vs Độ dịch chuyển Vectơ",
        "labDescription": "Tương tác di chuyển chất điểm trên mặt phẳng toạ độ 2D để trực quan hóa sự khác biệt giữa s (độ dài đường đi) và vectơ d (nối điểm đầu với điểm cuối).",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Quãng đường vs Độ dịch chuyển Vectơ",
          "purpose": "Tương tác di chuyển chất điểm trên mặt phẳng toạ độ 2D để trực quan hóa sự khác biệt giữa s (độ dài đường đi) và vectơ d (nối điểm đầu với điểm cuối).",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Hệ quy chiếu, phân biệt quãng đường s (vô hướng) và độ dịch chuyển vectơ d, tổng hợp độ dịch chuyển.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Hệ quy chiếu và mô tả chuyển động",
            "content": "Để xác định vị trí và thời gian của một vật chuyển động, ta cần chọn một **Hệ quy chiếu** bao gồm:\n* **Vật mốc** và **Hệ toạ độ** gắn với vật mốc (thường là trục số $Ox$ hoặc hệ toạ độ vuông góc $Oxy$).\n* **Gốc thời gian** ($t = 0$) và **Đồng hồ đo thời gian**.\n\nChất điểm: Một vật được coi là chất điểm nếu kích thước của nó rất nhỏ so với quãng đường di chuyển hoặc khoảng cách đang xét.",
            "keyTakeaway": "Hệ quy chiếu = Vật mốc & Hệ toạ độ + Gốc thời gian & Đồng hồ."
          },
          {
            "title": "2. Quãng đường đi được và Độ dịch chuyển",
            "content": "### Quãng đường đi được ($s$):\n* Là độ dài toàn bộ quỹ đạo mà vật đã vạch ra trong suốt quá trình chuyển động.\n* Là một **đại lượng vô hướng, luôn dương hoặc bằng 0** ($s \\ge 0$).\n\n### Độ dịch chuyển (vectơ $\\vec{d}$):\n* Là một **đại lượng vectơ** nối vị trí điểm đầu chuyển động đến vị trí điểm cuối.\n* Cho biết cả độ lớn khoảng cách thay đổi lẫn **hướng chuyển động** của vật:\n$$d = x_2 - x_1 = \\Delta x$$ (khi chuyển động trên trục $Ox$).\n* Độ dịch chuyển có thể mang giá trị **dương, âm hoặc bằng 0** tùy theo chiều chọn của trục toạ độ.",
            "keyTakeaway": "Quãng đường s là độ dài đường đi thực tế (s ≥ 0). Độ dịch chuyển d là vectơ nối vị trí đầu với vị trí cuối."
          },
          {
            "title": "3. Mối liên hệ so sánh giữa $s$ và $d$",
            "content": "Về độ lớn:\n$$d \\le s$$\n\n* Khi vật **chuyển động thẳng và không đổi chiều**: Độ lớn độ dịch chuyển bằng quãng đường đi được ($d = s$).\n* Khi vật chuyển động có đổi chiều hoặc đi theo đường cong: Độ lớn độ dịch chuyển luôn nhỏ hơn quãng đường ($d < s$).\n* Khi vật đi một vòng khép kín và quay về đúng vị trí ban đầu: Độ dịch chuyển bằng không ($d = 0$), trong khi quãng đường $s > 0$.",
            "keyTakeaway": "|d| ≤ s; |d| = s khi và chỉ khi vật chuyển động thẳng không đổi chiều."
          },
          {
            "title": "4. Tổng hợp độ dịch chuyển bằng phép cộng vectơ",
            "content": "Khi vật thực hiện liên tiếp hai độ dịch chuyển $\\vec{d}_1$ và $\\vec{d}_2$, độ dịch chuyển tổng hợp $\\vec{d}$ được xác định bằng phép cộng vectơ:\n$$\\vec{d} = \\vec{d}_1 + \\vec{d}_2$$\n\nCác trường hợp đặc biệt về độ lớn:\n* Hai độ dịch chuyển cùng hướng: $d = d_1 + d_2$\n* Hai độ dịch chuyển ngược hướng: $d = |d_1 - d_2|$\n* Hai độ dịch chuyển vuông góc ($\\vec{d}_1 \\perp \\vec{d}_2$):\n$$d = \\sqrt{d_1^2 + d_2^2}$$",
            "keyTakeaway": "Quy tắc cộng vectơ độ dịch chuyển: d = d1 + d2. Khi vuông góc: d = √(d1² + d2²).",
            "formulas": [
              {
                "name": "Tổng hợp độ dịch chuyển",
                "latex": "\\vec{d} = \\vec{d}_1 + \\vec{d}_2",
                "description": "Cộng vectơ theo quy tắc hình bình hành hoặc tam giác"
              },
              {
                "name": "Trường hợp vuông góc",
                "latex": "d = \\sqrt{d_1^2 + d_2^2}",
                "description": "Định lí Pythagoras áp dụng cho hai chuyển động trực giao",
                "units": "m"
              }
            ]
          }
        ],
        "theorySections": [
          {
            "title": "1. Hệ quy chiếu và mô tả chuyển động",
            "content": "Để xác định vị trí và thời gian của một vật chuyển động, ta cần chọn một **Hệ quy chiếu** bao gồm:\n* **Vật mốc** và **Hệ toạ độ** gắn với vật mốc (thường là trục số $Ox$ hoặc hệ toạ độ vuông góc $Oxy$).\n* **Gốc thời gian** ($t = 0$) và **Đồng hồ đo thời gian**.\n\nChất điểm: Một vật được coi là chất điểm nếu kích thước của nó rất nhỏ so với quãng đường di chuyển hoặc khoảng cách đang xét.",
            "keyTakeaway": "Hệ quy chiếu = Vật mốc & Hệ toạ độ + Gốc thời gian & Đồng hồ."
          },
          {
            "title": "2. Quãng đường đi được và Độ dịch chuyển",
            "content": "### Quãng đường đi được ($s$):\n* Là độ dài toàn bộ quỹ đạo mà vật đã vạch ra trong suốt quá trình chuyển động.\n* Là một **đại lượng vô hướng, luôn dương hoặc bằng 0** ($s \\ge 0$).\n\n### Độ dịch chuyển (vectơ $\\vec{d}$):\n* Là một **đại lượng vectơ** nối vị trí điểm đầu chuyển động đến vị trí điểm cuối.\n* Cho biết cả độ lớn khoảng cách thay đổi lẫn **hướng chuyển động** của vật:\n$$d = x_2 - x_1 = \\Delta x$$ (khi chuyển động trên trục $Ox$).\n* Độ dịch chuyển có thể mang giá trị **dương, âm hoặc bằng 0** tùy theo chiều chọn của trục toạ độ.",
            "keyTakeaway": "Quãng đường s là độ dài đường đi thực tế (s ≥ 0). Độ dịch chuyển d là vectơ nối vị trí đầu với vị trí cuối."
          },
          {
            "title": "3. Mối liên hệ so sánh giữa $s$ và $d$",
            "content": "Về độ lớn:\n$$d \\le s$$\n\n* Khi vật **chuyển động thẳng và không đổi chiều**: Độ lớn độ dịch chuyển bằng quãng đường đi được ($d = s$).\n* Khi vật chuyển động có đổi chiều hoặc đi theo đường cong: Độ lớn độ dịch chuyển luôn nhỏ hơn quãng đường ($d < s$).\n* Khi vật đi một vòng khép kín và quay về đúng vị trí ban đầu: Độ dịch chuyển bằng không ($d = 0$), trong khi quãng đường $s > 0$.",
            "keyTakeaway": "|d| ≤ s; |d| = s khi và chỉ khi vật chuyển động thẳng không đổi chiều."
          },
          {
            "title": "4. Tổng hợp độ dịch chuyển bằng phép cộng vectơ",
            "content": "Khi vật thực hiện liên tiếp hai độ dịch chuyển $\\vec{d}_1$ và $\\vec{d}_2$, độ dịch chuyển tổng hợp $\\vec{d}$ được xác định bằng phép cộng vectơ:\n$$\\vec{d} = \\vec{d}_1 + \\vec{d}_2$$\n\nCác trường hợp đặc biệt về độ lớn:\n* Hai độ dịch chuyển cùng hướng: $d = d_1 + d_2$\n* Hai độ dịch chuyển ngược hướng: $d = |d_1 - d_2|$\n* Hai độ dịch chuyển vuông góc ($\\vec{d}_1 \\perp \\vec{d}_2$):\n$$d = \\sqrt{d_1^2 + d_2^2}$$",
            "keyTakeaway": "Quy tắc cộng vectơ độ dịch chuyển: d = d1 + d2. Khi vuông góc: d = √(d1² + d2²).",
            "formulas": [
              {
                "name": "Tổng hợp độ dịch chuyển",
                "latex": "\\vec{d} = \\vec{d}_1 + \\vec{d}_2",
                "description": "Cộng vectơ theo quy tắc hình bình hành hoặc tam giác"
              },
              {
                "name": "Trường hợp vuông góc",
                "latex": "d = \\sqrt{d_1^2 + d_2^2}",
                "description": "Định lí Pythagoras áp dụng cho hai chuyển động trực giao",
                "units": "m"
              }
            ]
          }
        ],
        "summaryFormulas": [
          {
            "name": "Độ biến thiên toạ độ",
            "latex": "d = \\Delta x = x_2 - x_1"
          },
          {
            "name": "Tổng hợp vectơ độ dịch chuyển",
            "latex": "\\vec{d} = \\vec{d}_1 + \\vec{d}_2"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Hệ quy chiếu và mô tả chuyển động",
              "content": "Để xác định vị trí và thời gian của một vật chuyển động, ta cần chọn một **Hệ quy chiếu** bao gồm:\n* **Vật mốc** và **Hệ toạ độ** gắn với vật mốc (thường là trục số $Ox$ hoặc hệ toạ độ vuông góc $Oxy$).\n* **Gốc thời gian** ($t = 0$) và **Đồng hồ đo thời gian**.\n\nChất điểm: Một vật được coi là chất điểm nếu kích thước của nó rất nhỏ so với quãng đường di chuyển hoặc khoảng cách đang xét.",
              "keyTakeaway": "Hệ quy chiếu = Vật mốc & Hệ toạ độ + Gốc thời gian & Đồng hồ."
            },
            {
              "num": 2,
              "heading": "2. Quãng đường đi được và Độ dịch chuyển",
              "content": "### Quãng đường đi được ($s$):\n* Là độ dài toàn bộ quỹ đạo mà vật đã vạch ra trong suốt quá trình chuyển động.\n* Là một **đại lượng vô hướng, luôn dương hoặc bằng 0** ($s \\ge 0$).\n\n### Độ dịch chuyển (vectơ $\\vec{d}$):\n* Là một **đại lượng vectơ** nối vị trí điểm đầu chuyển động đến vị trí điểm cuối.\n* Cho biết cả độ lớn khoảng cách thay đổi lẫn **hướng chuyển động** của vật:\n$$d = x_2 - x_1 = \\Delta x$$ (khi chuyển động trên trục $Ox$).\n* Độ dịch chuyển có thể mang giá trị **dương, âm hoặc bằng 0** tùy theo chiều chọn của trục toạ độ.",
              "keyTakeaway": "Quãng đường s là độ dài đường đi thực tế (s ≥ 0). Độ dịch chuyển d là vectơ nối vị trí đầu với vị trí cuối."
            },
            {
              "num": 3,
              "heading": "3. Mối liên hệ so sánh giữa $s$ và $d$",
              "content": "Về độ lớn:\n$$d \\le s$$\n\n* Khi vật **chuyển động thẳng và không đổi chiều**: Độ lớn độ dịch chuyển bằng quãng đường đi được ($d = s$).\n* Khi vật chuyển động có đổi chiều hoặc đi theo đường cong: Độ lớn độ dịch chuyển luôn nhỏ hơn quãng đường ($d < s$).\n* Khi vật đi một vòng khép kín và quay về đúng vị trí ban đầu: Độ dịch chuyển bằng không ($d = 0$), trong khi quãng đường $s > 0$.",
              "keyTakeaway": "|d| ≤ s; |d| = s khi và chỉ khi vật chuyển động thẳng không đổi chiều."
            },
            {
              "num": 4,
              "heading": "4. Tổng hợp độ dịch chuyển bằng phép cộng vectơ",
              "content": "Khi vật thực hiện liên tiếp hai độ dịch chuyển $\\vec{d}_1$ và $\\vec{d}_2$, độ dịch chuyển tổng hợp $\\vec{d}$ được xác định bằng phép cộng vectơ:\n$$\\vec{d} = \\vec{d}_1 + \\vec{d}_2$$\n\nCác trường hợp đặc biệt về độ lớn:\n* Hai độ dịch chuyển cùng hướng: $d = d_1 + d_2$\n* Hai độ dịch chuyển ngược hướng: $d = |d_1 - d_2|$\n* Hai độ dịch chuyển vuông góc ($\\vec{d}_1 \\perp \\vec{d}_2$):\n$$d = \\sqrt{d_1^2 + d_2^2}$$",
              "keyTakeaway": "Quy tắc cộng vectơ độ dịch chuyển: d = d1 + d2. Khi vuông góc: d = √(d1² + d2²)."
            }
          ],
          "ghiNho": "Ghi nhớ: Quãng đường s phụ thuộc vào hình dạng quỹ đạo; độ dịch chuyển d chỉ phụ thuộc vào vị trí đầu và vị trí cuối.",
          "part2_formulas": [
            {
              "formula": "d = x_2 - x_1",
              "quantity": "Độ dịch chuyển 1D",
              "symbol": "d",
              "unit": "Mét (m)",
              "meaning": "Độ biến thiên tọa độ từ vị trí ban đầu x1 đến vị trí cuối x2."
            },
            {
              "formula": "s = \\sum |\\Delta x_i|",
              "quantity": "Quãng đường",
              "symbol": "s",
              "unit": "Mét (m)",
              "meaning": "Tổng chiều dài các cung quỹ đạo mà vật đã đi qua."
            }
          ],
          "part3_applications": [
            "Đo quãng đường bằng công-tơ-mét xe máy so với đường chim bay trên bản đồ Google Maps.",
            "Vận động viên bơi một vòng bể bơi 50 m rồi quay về vạch xuất phát: quãng đường s = 100 m nhưng độ dịch chuyển d = 0 m."
          ]
        },
        "quizzes": [
          {
            "id": "b4-q1",
            "question": "Độ dịch chuyển và quãng đường đi được của một vật có cùng độ lớn ($d = s$) khi nào?",
            "questionEn": "Which statement correctly distinguishes distance s and displacement d?",
            "options": [
              "Khi vật chuyển động tròn đều một vòng.",
              "Khi vật chuyển động thẳng và không đổi chiều chuyển động.",
              "Khi vật chuyển động thẳng và có đổi chiều chuyển động.",
              "Khi vật chuyển động trên quỹ đạo lượn sóng ziczac."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Về độ lớn, $|d| \\le s$. Dấu bằng xảy ra ($|d| = s$) khi và chỉ khi vật **chuyển động thẳng và không đổi chiều**.",
            "conceptTested": "Phân biệt quãng đường và độ dịch chuyển",
            "textbookRef": "KNTT Bài 4 (Trang 22)",
            "difficulty": "medium"
          },
          {
            "id": "b4-q2",
            "question": "Một người bơi từ đầu này sang đầu kia của bể bơi dài $50\\text{ m}$ rồi quay trở lại vị trí xuất phát ban đầu. Quãng đường $s$ và độ dịch chuyển $d$ của người đó lần lượt là:",
            "questionEn": "A person travels 60 m East then 80 m North. The distance s and displacement magnitude d are:",
            "options": [
              "$s = 100\\text{ m};\\; d = 100\\text{ m}$",
              "$s = 100\\text{ m};\\; d = 0\\text{ m}$",
              "$s = 50\\text{ m};\\; d = 0\\text{ m}$",
              "$s = 0\\text{ m};\\; d = 100\\text{ m}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Quãng đường thực tế đi được: $s = 50 + 50 = 100\\text{ m}$.\nVì điểm cuối trùng với điểm đầu nên vectơ độ dịch chuyển nối hai điểm này có độ lớn bằng không: $d = 0\\text{ m}$.",
            "conceptTested": "Tính độ dịch chuyển 2D vuông góc",
            "textbookRef": "KNTT Bài 4 (Trang 24)",
            "difficulty": "medium"
          },
          {
            "id": "b4-q3",
            "question": "Một người đi bộ $6\\text{ km}$ về phía Đông, sau đó rẽ vuông góc đi tiếp $8\\text{ km}$ về phía Bắc. Độ lớn của độ dịch chuyển tổng hợp là:",
            "questionEn": "A swimmer swims 50 m to the other end and returns to the start. Their displacement magnitude is:",
            "options": [
              "$14\\text{ km}$",
              "$2\\text{ km}$",
              "$10\\text{ km}$",
              "$48\\text{ km}$"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Hai độ dịch chuyển vuông góc nhau (Đông và Bắc vuông góc): $\\vec{d} = \\vec{d}_1 + \\vec{d}_2$ với $\\vec{d}_1 \\perp \\vec{d}_2$.\nÁp dụng định lí Pythagoras:\n$$d = \\sqrt{d_1^2 + d_2^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ km}$$",
            "conceptTested": "Độ dịch chuyển chu trình khép kín",
            "textbookRef": "KNTT Bài 4 (Trang 23)",
            "difficulty": "medium"
          },
          {
            "id": "b4-q4",
            "question": "Đại lượng nào sau đây là đại lượng VECTƠ?",
            "questionEn": "The displacement magnitude equals distance traveled (d = s) if and only if:",
            "options": [
              "Quãng đường đi được $s$",
              "Khối lượng của vật $m$",
              "Độ dịch chuyển $\\vec{d}$",
              "Nhiệt độ phòng $T$"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Độ dịch chuyển là đại lượng vectơ có hướng xác định (nối từ điểm đầu đến điểm cuối) và độ lớn. Quãng đường, khối lượng và nhiệt độ là các đại lượng vô hướng.",
            "conceptTested": "Điều kiện d = s",
            "textbookRef": "KNTT Bài 4 (Trang 23)",
            "difficulty": "medium"
          },
          {
            "id": "b4-q5",
            "question": "Một vật chuyển động trên trục $Ox$, tại thời điểm $t_1$ vật ở toạ độ $x_1 = 4\\text{ m}$, tại thời điểm $t_2$ vật ở toạ độ $x_2 = -2\\text{ m}$. Độ dịch chuyển của vật trong khoảng thời gian đó là:",
            "questionEn": "On the Ox axis, a particle moves from x₁ = +5 m to x₂ = -3 m. Its displacement is:",
            "options": [
              "$-6\\text{ m}$",
              "$6\\text{ m}$",
              "$2\\text{ m}$",
              "$-2\\text{ m}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Độ dịch chuyển trên trục toạ độ $Ox$:\n$$d = \\Delta x = x_2 - x_1 = -2 - 4 = -6\\text{ m}$$\nDấu âm cho biết vật dịch chuyển theo chiều âm của trục $Ox$.",
            "conceptTested": "Độ dịch chuyển trên trục tọa độ",
            "textbookRef": "KNTT Bài 4 (Trang 23)",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-5",
        "chapterId": "chuong-2",
        "lessonNum": 5,
        "number": 5,
        "title": "Tốc độ và vận tốc",
        "titleEn": "Tốc độ và vận tốc",
        "subtitle": "Tốc độ trung bình & tức thời, vận tốc trung bình & tức thời, công thức cộng vận tốc trong chuyển động tương đối.",
        "subtitleEn": "Tốc độ trung bình & tức thời, vận tốc trung bình & tức thời, công thức cộng vận tốc trong chuyển động tương đối.",
        "shortDesc": "Tốc độ trung bình & tức thời, vận tốc trung bình & tức thời, công thức cộng vận tốc trong chuyển động tương đối.",
        "shortDescription": "Tốc độ trung bình & tức thời, vận tốc trung bình & tức thời, công thức cộng vận tốc trong chuyển động tương đối.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Mô phỏng Thuyền qua sông & Công thức cộng vận tốc",
        "labTagEn": "Virtual Lab",
        "knttRef": "KNTT Bài 5",
        "ctstRef": "CTST Bài 5",
        "simulationId": "vector-velocity",
        "labType": "vector_velocity",
        "labTitle": "Mô phỏng Thuyền qua sông & Công thức cộng vận tốc",
        "labDescription": "Tùy chỉnh vận tốc dòng nước và vận tốc thuyền để quan sát trực tiếp vectơ vận tốc thực tế v₁₃ = v₁₂ + v₂₃ và độ dạt bờ của thuyền.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Thuyền qua sông & Công thức cộng vận tốc",
          "purpose": "Tùy chỉnh vận tốc dòng nước và vận tốc thuyền để quan sát trực tiếp vectơ vận tốc thực tế v₁₃ = v₁₂ + v₂₃ và độ dạt bờ của thuyền.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Tốc độ trung bình & tức thời, vận tốc trung bình & tức thời, công thức cộng vận tốc trong chuyển động tương đối.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Tốc độ trung bình và Tốc độ tức thời",
            "content": "### Tốc độ trung bình ($v_{tb}$):\nĐặc trưng cho mức độ nhanh hay chậm của chuyển động trên cả quãng đường:\n$$v_{tb} = \\frac{s}{t} \\quad \\text{hoặc} \\quad v = \\frac{\\Delta s}{\\Delta t}$$\n* Tốc độ trung bình là đại lượng vô hướng, không âm ($v_{tb} \\ge 0$).\n* Đơn vị trong hệ SI: mét trên giây ($\\text{m/s}$). Đơn vị thực tế thông dụng: $\\text{km/h}$ ($1\\text{ m/s} = 3{,}6\\text{ km/h}$).\n\n### Tốc độ tức thời:\nLà tốc độ tại một thời điểm hoặc một vị trí xác định trên quỹ đạo (đo bằng **tốc kế** trên xe máy, ô tô).",
            "keyTakeaway": "Tốc độ = Quãng đường / Thời gian (đại lượng vô hướng, cho biết độ nhanh chậm)."
          },
          {
            "title": "2. Vận tốc trung bình và Vận tốc tức thời",
            "content": "Khác với tốc độ, **vận tốc** là một đại lượng vectơ cho biết cả độ nhanh chậm và hướng của chuyển động:\n\n### Vận tốc trung bình:\n$$\\vec{v} = \\frac{\\vec{d}}{t} = \\frac{\\Delta \\vec{d}}{\\Delta t}$$\n* Chiều của vectơ vận tốc trung bình cùng chiều với vectơ độ dịch chuyển $\\vec{d}$.\n* Về độ lớn trên trục $Ox$: $v = \\frac{d}{t} = \\frac{x_2 - x_1}{t_2 - t_1}$. Vận tốc có thể âm khi vật đi ngược chiều dương trục toạ độ.\n\n### Vận tốc tức thời ($\\vec{v}_t$):\nLà vận tốc tại một thời điểm rất ngắn $\\Delta t \\to 0$. Vectơ vận tốc tức thời có gốc tại vật, phương tiếp tuyến với quỹ đạo và chiều theo chiều chuyển động.",
            "keyTakeaway": "Vận tốc là đại lượng vectơ: v = d / t. Hướng của vectơ vận tốc trùng với hướng dịch chuyển."
          },
          {
            "title": "3. Công thức cộng vận tốc",
            "content": "Khi một vật chuyển động trong một hệ quy chiếu chuyển động (ví dụ: thuyền chạy trên dòng sông đang chảy):\n\nGọi:\n* Vật 1: Vật chuyển động (Thuyền)\n* Vật 2: Hệ quy chiếu chuyển động (Dòng nước)\n* Vật 3: Hệ quy chiếu đứng yên (Bờ sông)\n\n**Công thức cộng vận tốc dạng vectơ**:\n$$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$$\n\n* $\\vec{v}_{1,3}$: Vận tốc tuyệt đối (vận tốc thuyền so với bờ).\n* $\\vec{v}_{1,2}$: Vận tốc tương đối (vận tốc thuyền so với dòng nước).\n* $\\vec{v}_{2,3}$: Vận tốc kéo theo (vận tốc dòng nước so với bờ).\n\n### Các trường hợp cụ thể:\n* **Thuyền xuôi dòng** ($\\vec{v}_{1,2} \\uparrow\\uparrow \\vec{v}_{2,3}$):\n$$v_{1,3} = v_{1,2} + v_{2,3}$$\n* **Thuyền ngược dòng** ($\\vec{v}_{1,2} \\uparrow\\downarrow \\vec{v}_{2,3}$):\n$$v_{1,3} = |v_{1,2} - v_{2,3}|$$\n* **Thuyền đi vuông góc với dòng chảy** ($\\vec{v}_{1,2} \\perp \\vec{v}_{2,3}$):\n$$v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$$\nGóc lệch so với bờ $\\tan \\alpha = \\frac{v_{1,2}}{v_{2,3}}$.",
            "keyTakeaway": "Công thức cộng vận tốc: v₁₃ = v₁₂ + v₂₃. Vận tốc tuyệt đối = Vận tốc tương đối + Vận tốc kéo theo.",
            "formulas": [
              {
                "name": "Công thức cộng vận tốc",
                "latex": "\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}",
                "description": "Quan hệ giữa vận tốc tuyệt đối, tương đối và kéo theo"
              }
            ]
          }
        ],
        "theorySections": [
          {
            "title": "1. Tốc độ trung bình và Tốc độ tức thời",
            "content": "### Tốc độ trung bình ($v_{tb}$):\nĐặc trưng cho mức độ nhanh hay chậm của chuyển động trên cả quãng đường:\n$$v_{tb} = \\frac{s}{t} \\quad \\text{hoặc} \\quad v = \\frac{\\Delta s}{\\Delta t}$$\n* Tốc độ trung bình là đại lượng vô hướng, không âm ($v_{tb} \\ge 0$).\n* Đơn vị trong hệ SI: mét trên giây ($\\text{m/s}$). Đơn vị thực tế thông dụng: $\\text{km/h}$ ($1\\text{ m/s} = 3{,}6\\text{ km/h}$).\n\n### Tốc độ tức thời:\nLà tốc độ tại một thời điểm hoặc một vị trí xác định trên quỹ đạo (đo bằng **tốc kế** trên xe máy, ô tô).",
            "keyTakeaway": "Tốc độ = Quãng đường / Thời gian (đại lượng vô hướng, cho biết độ nhanh chậm)."
          },
          {
            "title": "2. Vận tốc trung bình và Vận tốc tức thời",
            "content": "Khác với tốc độ, **vận tốc** là một đại lượng vectơ cho biết cả độ nhanh chậm và hướng của chuyển động:\n\n### Vận tốc trung bình:\n$$\\vec{v} = \\frac{\\vec{d}}{t} = \\frac{\\Delta \\vec{d}}{\\Delta t}$$\n* Chiều của vectơ vận tốc trung bình cùng chiều với vectơ độ dịch chuyển $\\vec{d}$.\n* Về độ lớn trên trục $Ox$: $v = \\frac{d}{t} = \\frac{x_2 - x_1}{t_2 - t_1}$. Vận tốc có thể âm khi vật đi ngược chiều dương trục toạ độ.\n\n### Vận tốc tức thời ($\\vec{v}_t$):\nLà vận tốc tại một thời điểm rất ngắn $\\Delta t \\to 0$. Vectơ vận tốc tức thời có gốc tại vật, phương tiếp tuyến với quỹ đạo và chiều theo chiều chuyển động.",
            "keyTakeaway": "Vận tốc là đại lượng vectơ: v = d / t. Hướng của vectơ vận tốc trùng với hướng dịch chuyển."
          },
          {
            "title": "3. Công thức cộng vận tốc",
            "content": "Khi một vật chuyển động trong một hệ quy chiếu chuyển động (ví dụ: thuyền chạy trên dòng sông đang chảy):\n\nGọi:\n* Vật 1: Vật chuyển động (Thuyền)\n* Vật 2: Hệ quy chiếu chuyển động (Dòng nước)\n* Vật 3: Hệ quy chiếu đứng yên (Bờ sông)\n\n**Công thức cộng vận tốc dạng vectơ**:\n$$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$$\n\n* $\\vec{v}_{1,3}$: Vận tốc tuyệt đối (vận tốc thuyền so với bờ).\n* $\\vec{v}_{1,2}$: Vận tốc tương đối (vận tốc thuyền so với dòng nước).\n* $\\vec{v}_{2,3}$: Vận tốc kéo theo (vận tốc dòng nước so với bờ).\n\n### Các trường hợp cụ thể:\n* **Thuyền xuôi dòng** ($\\vec{v}_{1,2} \\uparrow\\uparrow \\vec{v}_{2,3}$):\n$$v_{1,3} = v_{1,2} + v_{2,3}$$\n* **Thuyền ngược dòng** ($\\vec{v}_{1,2} \\uparrow\\downarrow \\vec{v}_{2,3}$):\n$$v_{1,3} = |v_{1,2} - v_{2,3}|$$\n* **Thuyền đi vuông góc với dòng chảy** ($\\vec{v}_{1,2} \\perp \\vec{v}_{2,3}$):\n$$v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$$\nGóc lệch so với bờ $\\tan \\alpha = \\frac{v_{1,2}}{v_{2,3}}$.",
            "keyTakeaway": "Công thức cộng vận tốc: v₁₃ = v₁₂ + v₂₃. Vận tốc tuyệt đối = Vận tốc tương đối + Vận tốc kéo theo.",
            "formulas": [
              {
                "name": "Công thức cộng vận tốc",
                "latex": "\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}",
                "description": "Quan hệ giữa vận tốc tuyệt đối, tương đối và kéo theo"
              }
            ]
          }
        ],
        "summaryFormulas": [
          {
            "name": "Tốc độ trung bình",
            "latex": "v = \\frac{s}{t}"
          },
          {
            "name": "Vận tốc trung bình",
            "latex": "\\vec{v} = \\frac{\\vec{d}}{t}"
          },
          {
            "name": "Cộng vận tốc",
            "latex": "\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Tốc độ trung bình và Tốc độ tức thời",
              "content": "### Tốc độ trung bình ($v_{tb}$):\nĐặc trưng cho mức độ nhanh hay chậm của chuyển động trên cả quãng đường:\n$$v_{tb} = \\frac{s}{t} \\quad \\text{hoặc} \\quad v = \\frac{\\Delta s}{\\Delta t}$$\n* Tốc độ trung bình là đại lượng vô hướng, không âm ($v_{tb} \\ge 0$).\n* Đơn vị trong hệ SI: mét trên giây ($\\text{m/s}$). Đơn vị thực tế thông dụng: $\\text{km/h}$ ($1\\text{ m/s} = 3{,}6\\text{ km/h}$).\n\n### Tốc độ tức thời:\nLà tốc độ tại một thời điểm hoặc một vị trí xác định trên quỹ đạo (đo bằng **tốc kế** trên xe máy, ô tô).",
              "keyTakeaway": "Tốc độ = Quãng đường / Thời gian (đại lượng vô hướng, cho biết độ nhanh chậm)."
            },
            {
              "num": 2,
              "heading": "2. Vận tốc trung bình và Vận tốc tức thời",
              "content": "Khác với tốc độ, **vận tốc** là một đại lượng vectơ cho biết cả độ nhanh chậm và hướng của chuyển động:\n\n### Vận tốc trung bình:\n$$\\vec{v} = \\frac{\\vec{d}}{t} = \\frac{\\Delta \\vec{d}}{\\Delta t}$$\n* Chiều của vectơ vận tốc trung bình cùng chiều với vectơ độ dịch chuyển $\\vec{d}$.\n* Về độ lớn trên trục $Ox$: $v = \\frac{d}{t} = \\frac{x_2 - x_1}{t_2 - t_1}$. Vận tốc có thể âm khi vật đi ngược chiều dương trục toạ độ.\n\n### Vận tốc tức thời ($\\vec{v}_t$):\nLà vận tốc tại một thời điểm rất ngắn $\\Delta t \\to 0$. Vectơ vận tốc tức thời có gốc tại vật, phương tiếp tuyến với quỹ đạo và chiều theo chiều chuyển động.",
              "keyTakeaway": "Vận tốc là đại lượng vectơ: v = d / t. Hướng của vectơ vận tốc trùng với hướng dịch chuyển."
            },
            {
              "num": 3,
              "heading": "3. Công thức cộng vận tốc",
              "content": "Khi một vật chuyển động trong một hệ quy chiếu chuyển động (ví dụ: thuyền chạy trên dòng sông đang chảy):\n\nGọi:\n* Vật 1: Vật chuyển động (Thuyền)\n* Vật 2: Hệ quy chiếu chuyển động (Dòng nước)\n* Vật 3: Hệ quy chiếu đứng yên (Bờ sông)\n\n**Công thức cộng vận tốc dạng vectơ**:\n$$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$$\n\n* $\\vec{v}_{1,3}$: Vận tốc tuyệt đối (vận tốc thuyền so với bờ).\n* $\\vec{v}_{1,2}$: Vận tốc tương đối (vận tốc thuyền so với dòng nước).\n* $\\vec{v}_{2,3}$: Vận tốc kéo theo (vận tốc dòng nước so với bờ).\n\n### Các trường hợp cụ thể:\n* **Thuyền xuôi dòng** ($\\vec{v}_{1,2} \\uparrow\\uparrow \\vec{v}_{2,3}$):\n$$v_{1,3} = v_{1,2} + v_{2,3}$$\n* **Thuyền ngược dòng** ($\\vec{v}_{1,2} \\uparrow\\downarrow \\vec{v}_{2,3}$):\n$$v_{1,3} = |v_{1,2} - v_{2,3}|$$\n* **Thuyền đi vuông góc với dòng chảy** ($\\vec{v}_{1,2} \\perp \\vec{v}_{2,3}$):\n$$v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$$\nGóc lệch so với bờ $\\tan \\alpha = \\frac{v_{1,2}}{v_{2,3}}$.",
              "keyTakeaway": "Công thức cộng vận tốc: v₁₃ = v₁₂ + v₂₃. Vận tốc tuyệt đối = Vận tốc tương đối + Vận tốc kéo theo."
            }
          ],
          "ghiNho": "Tốc độ = Quãng đường / Thời gian (đại lượng vô hướng, cho biết độ nhanh chậm). Vận tốc là đại lượng vectơ: v = d / t. Hướng của vectơ vận tốc trùng với hướng dịch chuyển. Công thức cộng vận tốc: v₁₃ = v₁₂ + v₂₃. Vận tốc tuyệt đối = Vận tốc tương đối + Vận tốc kéo theo.",
          "part2_formulas": [
            {
              "formula": "v = \\frac{s}{t}",
              "quantity": "Tốc độ trung bình",
              "symbol": "v",
              "unit": "SI",
              "meaning": "Tốc độ trung bình"
            },
            {
              "formula": "\\vec{v} = \\frac{\\vec{d}}{t}",
              "quantity": "Vận tốc trung bình",
              "symbol": "\\vec{v}",
              "unit": "SI",
              "meaning": "Vận tốc trung bình"
            },
            {
              "formula": "\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}",
              "quantity": "Cộng vận tốc",
              "symbol": "\\vec{v}_{1,3}",
              "unit": "SI",
              "meaning": "Cộng vận tốc"
            }
          ],
          "part3_applications": [
            "Ứng dụng các quy luật của Bài 5 trong đời sống và kĩ thuật thực tiễn.",
            "Phân tích hiện tượng thực nghiệm và thiết kế thiết bị kĩ thuật hiện đại."
          ]
        },
        "quizzes": [
          {
            "id": "b5-q1",
            "question": "Một vận động viên chạy cự li $100\\text{ m}$ hết thời gian $10{,}0\\text{ s}$. Tốc độ trung bình của vận động viên là:",
            "options": [
              "$10\\text{ m/s}$",
              "$36\\text{ km/h}$",
              "Cả A và B đều đúng.",
              "$100\\text{ m/s}$"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Tốc độ trung bình: $v = \\frac{s}{t} = \\frac{100}{10} = 10\\text{ m/s}$.\nĐổi sang $\\text{km/h}$: $10 \\times 3{,}6 = 36\\text{ km/h}$. Do đó cả hai đáp án A và B đều hoàn toàn chính xác.",
            "conceptTested": "Một vận động viên chạy cự li $100\\text{ m}$ hết th",
            "textbookRef": "KNTT Bài 5",
            "difficulty": "medium"
          },
          {
            "id": "b5-q2",
            "question": "Công thức cộng vận tốc dạng vectơ được viết là:",
            "options": [
              "$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$",
              "$\\vec{v}_{1,3} = \\vec{v}_{1,2} - \\vec{v}_{2,3}$",
              "$\\vec{v}_{1,2} = \\vec{v}_{1,3} + \\vec{v}_{2,3}$",
              "$\\vec{v}_{2,3} = \\vec{v}_{1,3} \\times \\vec{v}_{1,2}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Theo quy tắc cộng vận tốc, vận tốc tuyệt đối (vật 1 so với bờ 3) bằng tổng vectơ của vận tốc tương đối (vật 1 so với nước 2) và vận tốc kéo theo (nước 2 so với bờ 3):\n$$\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}$$",
            "conceptTested": "Công thức cộng vận tốc dạng vectơ được viết là:",
            "textbookRef": "KNTT Bài 5",
            "difficulty": "medium"
          },
          {
            "id": "b5-q3",
            "question": "Một canô chuyển động xuôi dòng nước từ bến A đến bến B. Biết vận tốc của canô so với nước là $15\\text{ km/h}$, vận tốc dòng nước so với bờ là $3\\text{ km/h}$. Vận tốc của canô so với bờ sông là:",
            "options": [
              "$12\\text{ km/h}$",
              "$18\\text{ km/h}$",
              "$45\\text{ km/h}$",
              "$5\\text{ km/h}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Khi xuôi dòng, hai vectơ vận tốc cùng chiều ($\\vec{v}_{1,2} \\uparrow\\uparrow \\vec{v}_{2,3}$):\n$$v_{1,3} = v_{1,2} + v_{2,3} = 15 + 3 = 18\\text{ km/h}$$",
            "conceptTested": "Một canô chuyển động xuôi dòng nước từ bến A đến b",
            "textbookRef": "KNTT Bài 5",
            "difficulty": "medium"
          },
          {
            "id": "b5-q4",
            "question": "Nếu canô ở câu trên chạy ngược dòng nước từ bến B về bến A, vận tốc của canô so với bờ sông là:",
            "options": [
              "$12\\text{ km/h}$",
              "$18\\text{ km/h}$",
              "$5\\text{ km/h}$",
              "$15\\text{ km/h}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Khi ngược dòng, hai vectơ vận tốc ngược chiều ($\\vec{v}_{1,2} \\uparrow\\downarrow \\vec{v}_{2,3}$):\n$$v_{1,3} = |v_{1,2} - v_{2,3}| = 15 - 3 = 12\\text{ km/h}$$",
            "conceptTested": "Nếu canô ở câu trên chạy ngược dòng nước từ bến B ",
            "textbookRef": "KNTT Bài 5",
            "difficulty": "medium"
          },
          {
            "id": "b5-q5",
            "question": "Một chiếc thuyền chèo vuông góc với dòng chảy của sông với vận tốc $4\\text{ m/s}$ so với nước. Vận tốc dòng nước chảy là $3\\text{ m/s}$ so với bờ. Vận tốc thực tế của thuyền so với bờ sông là:",
            "options": [
              "$7\\text{ m/s}$",
              "$1\\text{ m/s}$",
              "$5\\text{ m/s}$",
              "$12\\text{ m/s}$"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Vì $\\vec{v}_{1,2} \\perp \\vec{v}_{2,3}$, áp dụng định lí Pythagoras:\n$$v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = 5\\text{ m/s}$$",
            "conceptTested": "Một chiếc thuyền chèo vuông góc với dòng chảy của ",
            "textbookRef": "KNTT Bài 5",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-6",
        "chapterId": "chuong-2",
        "lessonNum": 6,
        "number": 6,
        "title": "Thực hành: Đo tốc độ của vật chuyển động",
        "titleEn": "Thực hành: Đo tốc độ của vật chuyển động",
        "subtitle": "Phương án đo thực nghiệm với Cổng quang điện, Đồng hồ đo thời gian hiện số MC964, máng nghiêng và thước kẹp.",
        "subtitleEn": "Phương án đo thực nghiệm với Cổng quang điện, Đồng hồ đo thời gian hiện số MC964, máng nghiêng và thước kẹp.",
        "shortDesc": "Phương án đo thực nghiệm với Cổng quang điện, Đồng hồ đo thời gian hiện số MC964, máng nghiêng và thước kẹp.",
        "shortDescription": "Phương án đo thực nghiệm với Cổng quang điện, Đồng hồ đo thời gian hiện số MC964, máng nghiêng và thước kẹp.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Phòng thí nghiệm Ảo: Đồng hồ MC964 & Máng nghiêng",
        "labTagEn": "Virtual Lab",
        "knttRef": "KNTT Bài 6",
        "ctstRef": "CTST Bài 6",
        "simulationId": "photogate-mc964",
        "labType": "photogate_mc964",
        "labTitle": "Phòng thí nghiệm Ảo: Đồng hồ MC964 & Máng nghiêng",
        "labDescription": "Thao tác các chế độ MODE A, B, A+B, A<->B trên đồng hồ MC964, thả bi thép trượt trên máng nghiêng và ghi nhận thời gian chắn cổng quang điện.",
        "virtualLabSpec": {
          "experimentName": "Phòng thí nghiệm Ảo: Đồng hồ MC964 & Máng nghiêng",
          "purpose": "Thao tác các chế độ MODE A, B, A+B, A<->B trên đồng hồ MC964, thả bi thép trượt trên máng nghiêng và ghi nhận thời gian chắn cổng quang điện.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Phương án đo thực nghiệm với Cổng quang điện, Đồng hồ đo thời gian hiện số MC964, máng nghiêng và thước kẹp.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Dụng cụ thí nghiệm đo tốc độ",
            "content": "Bộ thí nghiệm tiêu chuẩn trong SGK Kết nối tri thức bao gồm:\n* **Máng nhôm định hình nghiêng** có thước đo milimet chia vạch gắn kèm.\n* **Bi thép** có đường kính $d$ (đo bằng thước kẹp cơ khí).\n* **Nam châm điện** gắn ở đầu máng để giữ và nhả bi thép không vận tốc đầu.\n* **Cổng quang điện** (Photogate): Gồm một đầu phát tia hồng ngoại và một đầu thu. Khi vật chắn qua tia hồng ngoại, cổng phát ra tín hiệu điện kích hoạt đồng hồ.\n* **Đồng hồ đo thời gian hiện số MC964**: Dụng cụ đếm xung thời gian chính xác đến $0{,}001\\text{ s}$.",
            "keyTakeaway": "Đồng hồ MC964 kết hợp với cổng quang điện cho phép đo thời gian chắn tia sáng với độ chính xác đến mili-giây (0,001 s)."
          },
          {
            "title": "2. Các chế độ làm việc (MODE) của đồng hồ MC964",
            "content": "Đồng hồ MC964 có công tắc chọn các chế độ đo chuyên dụng:\n\n* **MODE A**: Đo thời gian vật chắn qua cổng quang A (dùng để tính tốc độ tức thời tại A).\n* **MODE B**: Đo thời gian vật chắn qua cổng quang B (dùng để tính tốc độ tức thời tại B).\n* **MODE A + B**: Đo tổng thời gian chắn cổng A và chắn cổng B.\n* **MODE A $\\leftrightarrow$ B**: Đo khoảng thời gian kể từ khi vật bắt đầu chắn cổng A đến khi vật bắt đầu chắn cổng B (dùng để đo thời gian chuyển động giữa hai vị trí).",
            "keyTakeaway": "MODE A/B đo thời gian che cổng để tính tốc độ tức thời; MODE A↔B đo khoảng thời gian đi giữa 2 cổng để tính tốc độ trung bình."
          },
          {
            "title": "3. Phương án đo và Công thức tính",
            "content": "### Phương án 1: Đo tốc độ trung bình\n* Đặt đồng hồ ở **MODE A $\\leftrightarrow$ B**.\n* Đặt cổng A tại vị trí $s_1$, cổng B tại vị trí $s_2$. Quãng đường $s = s_2 - s_1$.\n* Thả bi lăn qua 2 cổng, đọc thời gian $t$ hiển thị trên đồng hồ MC964.\n* Tốc độ trung bình:\n$$v_{tb} = \\frac{s}{t}$$\n\n### Phương án 2: Đo tốc độ tức thời\n* Dùng thước kẹp đo đường kính của viên bi thép: $d$ (thước kẹp có ĐCNN $0{,}02\\text{ mm}$ hoặc $0{,}05\\text{ mm}$).\n* Đặt đồng hồ ở **MODE A** (hoặc MODE B).\n* Cho viên bi lăn qua cổng quang A. Viên bi chắn chùm tia sáng một khoảng thời gian $\\Delta t_A$.\n* Tốc độ tức thời của viên bi khi đi qua cổng A:\n$$v_A = \\frac{d}{\\Delta t_A}$$",
            "keyTakeaway": "Tốc độ tức thời vt = d / Δt (đường kính viên bi chia cho thời gian chắn cổng quang).",
            "formulas": [
              {
                "name": "Tốc độ trung bình",
                "latex": "v_{tb} = \\frac{s}{t}",
                "description": "Khoảng cách giữa hai cổng quang chia cho thời gian đo ở MODE A↔B",
                "units": "m/s"
              },
              {
                "name": "Tốc độ tức thời",
                "latex": "v_A = \\frac{d}{\\Delta t_A}",
                "description": "Đường kính bi thép chia cho thời gian chắn cổng quang đo ở MODE A",
                "units": "m/s"
              }
            ]
          }
        ],
        "theorySections": [
          {
            "title": "1. Dụng cụ thí nghiệm đo tốc độ",
            "content": "Bộ thí nghiệm tiêu chuẩn trong SGK Kết nối tri thức bao gồm:\n* **Máng nhôm định hình nghiêng** có thước đo milimet chia vạch gắn kèm.\n* **Bi thép** có đường kính $d$ (đo bằng thước kẹp cơ khí).\n* **Nam châm điện** gắn ở đầu máng để giữ và nhả bi thép không vận tốc đầu.\n* **Cổng quang điện** (Photogate): Gồm một đầu phát tia hồng ngoại và một đầu thu. Khi vật chắn qua tia hồng ngoại, cổng phát ra tín hiệu điện kích hoạt đồng hồ.\n* **Đồng hồ đo thời gian hiện số MC964**: Dụng cụ đếm xung thời gian chính xác đến $0{,}001\\text{ s}$.",
            "keyTakeaway": "Đồng hồ MC964 kết hợp với cổng quang điện cho phép đo thời gian chắn tia sáng với độ chính xác đến mili-giây (0,001 s)."
          },
          {
            "title": "2. Các chế độ làm việc (MODE) của đồng hồ MC964",
            "content": "Đồng hồ MC964 có công tắc chọn các chế độ đo chuyên dụng:\n\n* **MODE A**: Đo thời gian vật chắn qua cổng quang A (dùng để tính tốc độ tức thời tại A).\n* **MODE B**: Đo thời gian vật chắn qua cổng quang B (dùng để tính tốc độ tức thời tại B).\n* **MODE A + B**: Đo tổng thời gian chắn cổng A và chắn cổng B.\n* **MODE A $\\leftrightarrow$ B**: Đo khoảng thời gian kể từ khi vật bắt đầu chắn cổng A đến khi vật bắt đầu chắn cổng B (dùng để đo thời gian chuyển động giữa hai vị trí).",
            "keyTakeaway": "MODE A/B đo thời gian che cổng để tính tốc độ tức thời; MODE A↔B đo khoảng thời gian đi giữa 2 cổng để tính tốc độ trung bình."
          },
          {
            "title": "3. Phương án đo và Công thức tính",
            "content": "### Phương án 1: Đo tốc độ trung bình\n* Đặt đồng hồ ở **MODE A $\\leftrightarrow$ B**.\n* Đặt cổng A tại vị trí $s_1$, cổng B tại vị trí $s_2$. Quãng đường $s = s_2 - s_1$.\n* Thả bi lăn qua 2 cổng, đọc thời gian $t$ hiển thị trên đồng hồ MC964.\n* Tốc độ trung bình:\n$$v_{tb} = \\frac{s}{t}$$\n\n### Phương án 2: Đo tốc độ tức thời\n* Dùng thước kẹp đo đường kính của viên bi thép: $d$ (thước kẹp có ĐCNN $0{,}02\\text{ mm}$ hoặc $0{,}05\\text{ mm}$).\n* Đặt đồng hồ ở **MODE A** (hoặc MODE B).\n* Cho viên bi lăn qua cổng quang A. Viên bi chắn chùm tia sáng một khoảng thời gian $\\Delta t_A$.\n* Tốc độ tức thời của viên bi khi đi qua cổng A:\n$$v_A = \\frac{d}{\\Delta t_A}$$",
            "keyTakeaway": "Tốc độ tức thời vt = d / Δt (đường kính viên bi chia cho thời gian chắn cổng quang).",
            "formulas": [
              {
                "name": "Tốc độ trung bình",
                "latex": "v_{tb} = \\frac{s}{t}",
                "description": "Khoảng cách giữa hai cổng quang chia cho thời gian đo ở MODE A↔B",
                "units": "m/s"
              },
              {
                "name": "Tốc độ tức thời",
                "latex": "v_A = \\frac{d}{\\Delta t_A}",
                "description": "Đường kính bi thép chia cho thời gian chắn cổng quang đo ở MODE A",
                "units": "m/s"
              }
            ]
          }
        ],
        "summaryFormulas": [],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Dụng cụ thí nghiệm đo tốc độ",
              "content": "Bộ thí nghiệm tiêu chuẩn trong SGK Kết nối tri thức bao gồm:\n* **Máng nhôm định hình nghiêng** có thước đo milimet chia vạch gắn kèm.\n* **Bi thép** có đường kính $d$ (đo bằng thước kẹp cơ khí).\n* **Nam châm điện** gắn ở đầu máng để giữ và nhả bi thép không vận tốc đầu.\n* **Cổng quang điện** (Photogate): Gồm một đầu phát tia hồng ngoại và một đầu thu. Khi vật chắn qua tia hồng ngoại, cổng phát ra tín hiệu điện kích hoạt đồng hồ.\n* **Đồng hồ đo thời gian hiện số MC964**: Dụng cụ đếm xung thời gian chính xác đến $0{,}001\\text{ s}$.",
              "keyTakeaway": "Đồng hồ MC964 kết hợp với cổng quang điện cho phép đo thời gian chắn tia sáng với độ chính xác đến mili-giây (0,001 s)."
            },
            {
              "num": 2,
              "heading": "2. Các chế độ làm việc (MODE) của đồng hồ MC964",
              "content": "Đồng hồ MC964 có công tắc chọn các chế độ đo chuyên dụng:\n\n* **MODE A**: Đo thời gian vật chắn qua cổng quang A (dùng để tính tốc độ tức thời tại A).\n* **MODE B**: Đo thời gian vật chắn qua cổng quang B (dùng để tính tốc độ tức thời tại B).\n* **MODE A + B**: Đo tổng thời gian chắn cổng A và chắn cổng B.\n* **MODE A $\\leftrightarrow$ B**: Đo khoảng thời gian kể từ khi vật bắt đầu chắn cổng A đến khi vật bắt đầu chắn cổng B (dùng để đo thời gian chuyển động giữa hai vị trí).",
              "keyTakeaway": "MODE A/B đo thời gian che cổng để tính tốc độ tức thời; MODE A↔B đo khoảng thời gian đi giữa 2 cổng để tính tốc độ trung bình."
            },
            {
              "num": 3,
              "heading": "3. Phương án đo và Công thức tính",
              "content": "### Phương án 1: Đo tốc độ trung bình\n* Đặt đồng hồ ở **MODE A $\\leftrightarrow$ B**.\n* Đặt cổng A tại vị trí $s_1$, cổng B tại vị trí $s_2$. Quãng đường $s = s_2 - s_1$.\n* Thả bi lăn qua 2 cổng, đọc thời gian $t$ hiển thị trên đồng hồ MC964.\n* Tốc độ trung bình:\n$$v_{tb} = \\frac{s}{t}$$\n\n### Phương án 2: Đo tốc độ tức thời\n* Dùng thước kẹp đo đường kính của viên bi thép: $d$ (thước kẹp có ĐCNN $0{,}02\\text{ mm}$ hoặc $0{,}05\\text{ mm}$).\n* Đặt đồng hồ ở **MODE A** (hoặc MODE B).\n* Cho viên bi lăn qua cổng quang A. Viên bi chắn chùm tia sáng một khoảng thời gian $\\Delta t_A$.\n* Tốc độ tức thời của viên bi khi đi qua cổng A:\n$$v_A = \\frac{d}{\\Delta t_A}$$",
              "keyTakeaway": "Tốc độ tức thời vt = d / Δt (đường kính viên bi chia cho thời gian chắn cổng quang)."
            }
          ],
          "ghiNho": "Đồng hồ MC964 kết hợp với cổng quang điện cho phép đo thời gian chắn tia sáng với độ chính xác đến mili-giây (0,001 s). MODE A/B đo thời gian che cổng để tính tốc độ tức thời; MODE A↔B đo khoảng thời gian đi giữa 2 cổng để tính tốc độ trung bình. Tốc độ tức thời vt = d / Δt (đường kính viên bi chia cho thời gian chắn cổng quang).",
          "part2_formulas": [],
          "part3_applications": [
            "Ứng dụng các quy luật của Bài 6 trong đời sống và kĩ thuật thực tiễn.",
            "Phân tích hiện tượng thực nghiệm và thiết kế thiết bị kĩ thuật hiện đại."
          ]
        },
        "quizzes": [
          {
            "id": "b6-q1",
            "question": "Khi sử dụng đồng hồ đo thời gian hiện số MC964 để đo tốc độ tức thời của viên bi khi đi qua một cổng quang điện A, ta chọn chế độ đo nào?",
            "options": [
              "MODE A $\\leftrightarrow$ B",
              "MODE A",
              "MODE B",
              "MODE A + B"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Chế độ **MODE A** đo khoảng thời gian vật chắn qua chùm tia sáng của cổng quang điện A ($\\Delta t_A$). Khi đó tốc độ tức thời $v_A = \\frac{d}{\\Delta t_A}$ với $d$ là đường kính bi.",
            "conceptTested": "Khi sử dụng đồng hồ đo thời gian hiện số MC964 để ",
            "textbookRef": "KNTT Bài 6",
            "difficulty": "medium"
          },
          {
            "id": "b6-q2",
            "question": "Đường kính của viên bi thép đo bằng thước kẹp là $d = 20{,}0\\text{ mm} = 0{,}020\\text{ m}$. Khi qua cổng quang điện, đồng hồ đo được thời gian chắn là $\\Delta t = 0{,}040\\text{ s}$. Tốc độ tức thời của viên bi tại cổng quang điện là:",
            "options": [
              "$0{,}8\\text{ m/s}$",
              "$0{,}5\\text{ m/s}$",
              "$2{,}0\\text{ m/s}$",
              "$5{,}0\\text{ m/s}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Áp dụng công thức tính tốc độ tức thời:\n$$v = \\frac{d}{\\Delta t} = \\frac{0{,}020\\text{ m}}{0{,}040\\text{ s}} = 0{,}5\\text{ m/s}$$",
            "conceptTested": "Đường kính của viên bi thép đo bằng thước kẹp là $",
            "textbookRef": "KNTT Bài 6",
            "difficulty": "medium"
          },
          {
            "id": "b6-q3",
            "question": "Để đo tốc độ trung bình của viên bi chuyển động từ cổng quang A đến cổng quang B cách nhau $s = 0{,}5\\text{ m}$, ta chọn chế độ nào trên đồng hồ MC964?",
            "options": [
              "MODE A",
              "MODE B",
              "MODE A $\\leftrightarrow$ B",
              "Chế độ đếm xung tần số"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Chế độ **MODE A $\\leftrightarrow$ B** đếm khoảng thời gian kể từ thời điểm vật bắt đầu đi vào cổng A cho tới thời điểm vật đi đến cổng B, tức thời gian chuyển động trên quãng đường $s$ giữa 2 cổng.",
            "conceptTested": "Để đo tốc độ trung bình của viên bi chuyển động từ",
            "textbookRef": "KNTT Bài 6",
            "difficulty": "medium"
          },
          {
            "id": "b6-q4",
            "question": "Tại sao việc dùng đồng hồ bấm giây cơ học bằng tay lại có sai số lớn hơn nhiều so với việc dùng cổng quang điện và đồng hồ MC964?",
            "options": [
              "Vì đồng hồ cơ học chạy chậm hơn đồng hồ điện tử.",
              "Vì thời gian phản xạ bấm nút của mắt và tay người thường mất khoảng $0{,}1\\text{ s} - 0{,}2\\text{ s}$.",
              "Vì cổng quang điện làm thay đổi trọng lượng của viên bi.",
              "Vì đồng hồ cơ học không có kim giây."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Thời gian phản xạ của người từ khi mắt nhìn thấy sự kiện đến khi ngón tay bấm nút có độ trễ sinh học khoảng $0{,}1\\text{ s} - 0{,}2\\text{ s}$, rất lớn so với thời gian bi rơi ngắn. Cổng quang điện kích hoạt bằng tín hiệu quang điện tử với độ trễ chỉ cỡ phần triệu giây.",
            "conceptTested": "Tại sao việc dùng đồng hồ bấm giây cơ học bằng tay",
            "textbookRef": "KNTT Bài 6",
            "difficulty": "medium"
          },
          {
            "id": "b6-q5",
            "question": "Khoảng cách giữa 2 cổng quang điện $s = (0{,}600 \\pm 0{,}002)\\text{ m}$ và thời gian đo ở MODE A $\\leftrightarrow$ B là $t = (1{,}200 \\pm 0{,}006)\\text{ s}$. Tốc độ trung bình của viên bi là:",
            "options": [
              "$0{,}500\\text{ m/s}$",
              "$0{,}720\\text{ m/s}$",
              "$2{,}000\\text{ m/s}$",
              "$0{,}200\\text{ m/s}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Giá trị trung bình của tốc độ:\n$$v_{tb} = \\frac{\\bar{s}}{\\bar{t}} = \\frac{0{,}600}{1{,}200} = 0{,}500\\text{ m/s}$$",
            "conceptTested": "Khoảng cách giữa 2 cổng quang điện $s = (0{,}600 \\",
            "textbookRef": "KNTT Bài 6",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-7",
        "chapterId": "chuong-2",
        "lessonNum": 7,
        "number": 7,
        "title": "Đồ thị độ dịch chuyển – thời gian",
        "titleEn": "Displacement - Time Graph",
        "subtitle": "Đọc và vẽ đồ thị d - t trong chuyển động thẳng, ý nghĩa của độ dốc (hệ số góc) chính là vận tốc v.",
        "subtitleEn": "Plotting and interpreting d - t graph; slope represents instantaneous velocity v.",
        "shortDesc": "Đọc và vẽ đồ thị d - t trong chuyển động thẳng, ý nghĩa của độ dốc (hệ số góc) chính là vận tốc v.",
        "shortDescription": "Đọc và vẽ đồ thị d - t trong chuyển động thẳng, ý nghĩa của độ dốc (hệ số góc) chính là vận tốc v.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Vẽ Đồ thị d-t Thời gian thực",
        "labTagEn": "Real-time d-t Graph Plotter",
        "knttRef": "KNTT Bài 7 (Trang 32)",
        "ctstRef": "CTST Bài 4 (Trang 28)",
        "simulationId": "displacement-time",
        "labType": "motion_graph",
        "labTitle": "Vẽ Đồ thị d-t Thời gian thực",
        "labDescription": "Quan sát chuyển động của xe đồng thời theo dõi đồ thị d - t được vẽ trực tiếp từng bước, thay đổi vận tốc để thấy độ dốc thay đổi.",
        "virtualLabSpec": {
          "experimentName": "Vẽ Đồ thị d-t Thời gian thực",
          "purpose": "Quan sát chuyển động của xe đồng thời theo dõi đồ thị d - t được vẽ trực tiếp từng bước, thay đổi vận tốc để thấy độ dốc thay đổi.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Đọc và vẽ đồ thị d - t trong chuyển động thẳng, ý nghĩa của độ dốc (hệ số góc) chính là vận tốc v.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Dạng đồ thị độ dịch chuyển – thời gian ($d - t$)",
            "content": "Đồ thị $d - t$ biểu diễn mối liên hệ giữa độ dịch chuyển $d$ (trục tung) theo thời gian $t$ (trục hoành):\n\n* Trong **chuyển động thẳng đều**: $d = v \\cdot t$. Phương trình có dạng hàm bậc nhất $y = ax$, do đó đồ thị $d - t$ là một **đường thẳng đi qua gốc toạ độ** (nếu chọn gốc toạ độ tại vị trí ban đầu).\n* Nếu tại thời điểm ban đầu vật đã ở vị trí $d_0 \\ne 0$: $d = d_0 + v \\cdot t$, đồ thị là đường thẳng cắt trục tung tại điểm $(0; d_0)$.",
            "keyTakeaway": "Đồ thị d-t của chuyển động thẳng đều luôn là đường thẳng xiên góc hoặc nằm ngang."
          },
          {
            "title": "2. Ý nghĩa độ dốc (hệ số góc) của đồ thị $d - t$",
            "content": "Độ dốc (slope) của đường biểu diễn trên đồ thị $d - t$ chính là giá trị của **vận tốc**:\n$$\\text{Độ dốc} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1} = v$$\n\n### Các trường hợp biểu diễn:\n* **Đường thẳng dốc lên** (hệ số góc dương, $\\Delta d > 0$): Vật chuyển động thẳng đều **cùng chiều dương** ($v > 0$). Độ dốc càng lớn thì vận tốc càng nhanh.\n* **Đường thẳng nằm ngang song song trục thời gian** ($\\Delta d = 0$): Vật **đứng yên** ($v = 0$).\n* **Đường thẳng dốc xuống** (hệ số góc âm, $\\Delta d < 0$): Vật chuyển động thẳng đều **ngược chiều dương** ($v < 0$).\n* **Đường cong**: Vận tốc thay đổi theo thời gian (chuyển động biến đổi).",
            "keyTakeaway": "Hệ số góc (độ dốc) của đồ thị d - t bằng vận tốc: v = Δd / Δt. Dốc lên: v > 0; nằm ngang: v = 0; dốc xuống: v < 0.",
            "formulas": [
              {
                "name": "Độ dốc đồ thị d-t",
                "latex": "v = \\frac{\\Delta d}{\\Delta t} = \\tan \\alpha",
                "description": "Vận tốc bằng hệ số góc của đường d-t so với trục thời gian",
                "units": "m/s"
              }
            ]
          }
        ],
        "theorySections": [
          {
            "title": "1. Dạng đồ thị độ dịch chuyển – thời gian ($d - t$)",
            "content": "Đồ thị $d - t$ biểu diễn mối liên hệ giữa độ dịch chuyển $d$ (trục tung) theo thời gian $t$ (trục hoành):\n\n* Trong **chuyển động thẳng đều**: $d = v \\cdot t$. Phương trình có dạng hàm bậc nhất $y = ax$, do đó đồ thị $d - t$ là một **đường thẳng đi qua gốc toạ độ** (nếu chọn gốc toạ độ tại vị trí ban đầu).\n* Nếu tại thời điểm ban đầu vật đã ở vị trí $d_0 \\ne 0$: $d = d_0 + v \\cdot t$, đồ thị là đường thẳng cắt trục tung tại điểm $(0; d_0)$.",
            "keyTakeaway": "Đồ thị d-t của chuyển động thẳng đều luôn là đường thẳng xiên góc hoặc nằm ngang."
          },
          {
            "title": "2. Ý nghĩa độ dốc (hệ số góc) của đồ thị $d - t$",
            "content": "Độ dốc (slope) của đường biểu diễn trên đồ thị $d - t$ chính là giá trị của **vận tốc**:\n$$\\text{Độ dốc} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1} = v$$\n\n### Các trường hợp biểu diễn:\n* **Đường thẳng dốc lên** (hệ số góc dương, $\\Delta d > 0$): Vật chuyển động thẳng đều **cùng chiều dương** ($v > 0$). Độ dốc càng lớn thì vận tốc càng nhanh.\n* **Đường thẳng nằm ngang song song trục thời gian** ($\\Delta d = 0$): Vật **đứng yên** ($v = 0$).\n* **Đường thẳng dốc xuống** (hệ số góc âm, $\\Delta d < 0$): Vật chuyển động thẳng đều **ngược chiều dương** ($v < 0$).\n* **Đường cong**: Vận tốc thay đổi theo thời gian (chuyển động biến đổi).",
            "keyTakeaway": "Hệ số góc (độ dốc) của đồ thị d - t bằng vận tốc: v = Δd / Δt. Dốc lên: v > 0; nằm ngang: v = 0; dốc xuống: v < 0.",
            "formulas": [
              {
                "name": "Độ dốc đồ thị d-t",
                "latex": "v = \\frac{\\Delta d}{\\Delta t} = \\tan \\alpha",
                "description": "Vận tốc bằng hệ số góc của đường d-t so với trục thời gian",
                "units": "m/s"
              }
            ]
          }
        ],
        "summaryFormulas": [
          {
            "name": "Phương trình d-t thẳng đều",
            "latex": "d = v \\cdot t"
          },
          {
            "name": "Vận tốc từ hệ số góc",
            "latex": "v = \\frac{d_2 - d_1}{t_2 - t_1}"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Dạng đồ thị độ dịch chuyển – thời gian ($d - t$)",
              "content": "Đồ thị $d - t$ biểu diễn mối liên hệ giữa độ dịch chuyển $d$ (trục tung) theo thời gian $t$ (trục hoành):\n\n* Trong **chuyển động thẳng đều**: $d = v \\cdot t$. Phương trình có dạng hàm bậc nhất $y = ax$, do đó đồ thị $d - t$ là một **đường thẳng đi qua gốc toạ độ** (nếu chọn gốc toạ độ tại vị trí ban đầu).\n* Nếu tại thời điểm ban đầu vật đã ở vị trí $d_0 \\ne 0$: $d = d_0 + v \\cdot t$, đồ thị là đường thẳng cắt trục tung tại điểm $(0; d_0)$.",
              "keyTakeaway": "Đồ thị d-t của chuyển động thẳng đều luôn là đường thẳng xiên góc hoặc nằm ngang."
            },
            {
              "num": 2,
              "heading": "2. Ý nghĩa độ dốc (hệ số góc) của đồ thị $d - t$",
              "content": "Độ dốc (slope) của đường biểu diễn trên đồ thị $d - t$ chính là giá trị của **vận tốc**:\n$$\\text{Độ dốc} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1} = v$$\n\n### Các trường hợp biểu diễn:\n* **Đường thẳng dốc lên** (hệ số góc dương, $\\Delta d > 0$): Vật chuyển động thẳng đều **cùng chiều dương** ($v > 0$). Độ dốc càng lớn thì vận tốc càng nhanh.\n* **Đường thẳng nằm ngang song song trục thời gian** ($\\Delta d = 0$): Vật **đứng yên** ($v = 0$).\n* **Đường thẳng dốc xuống** (hệ số góc âm, $\\Delta d < 0$): Vật chuyển động thẳng đều **ngược chiều dương** ($v < 0$).\n* **Đường cong**: Vận tốc thay đổi theo thời gian (chuyển động biến đổi).",
              "keyTakeaway": "Hệ số góc (độ dốc) của đồ thị d - t bằng vận tốc: v = Δd / Δt. Dốc lên: v > 0; nằm ngang: v = 0; dốc xuống: v < 0."
            }
          ],
          "ghiNho": "Ghi nhớ: Đồ thị d-t của chuyển động thẳng đều luôn là đường thẳng xiên góc hoặc nằm ngang.",
          "part2_formulas": [
            {
              "formula": "v = \\text{độ dốc} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1}",
              "quantity": "Vận tốc từ hệ số góc",
              "symbol": "v",
              "unit": "m/s",
              "meaning": "Độ dốc của đồ thị d - t biểu diễn giá trị đại số của vận tốc chuyển động."
            },
            {
              "formula": "d = d_0 + v \\cdot t",
              "quantity": "Phương trình chuyển động thẳng đều",
              "symbol": "d",
              "unit": "m",
              "meaning": "Tọa độ/độ dịch chuyển của vật tại thời điểm t bất kì."
            }
          ],
          "part3_applications": [
            "Hộp đen định vị GPS xe khách ghi lại đồ thị vị trí - thời gian để giám sát tốc độ tài xế.",
            "Phân tích đồ thị bơi của vận động viên để phát hiện giai đoạn tăng tốc hoặc duy trì đều đặn."
          ]
        },
        "quizzes": [
          {
            "id": "b7-q1",
            "question": "Độ dốc (hệ số góc) của đồ thị độ dịch chuyển – thời gian ($d - t$) cho biết giá trị của đại lượng nào?",
            "questionEn": "What does the slope of the displacement-time (d - t) graph represent?",
            "options": [
              "Gia tốc của chuyển động.",
              "Vận tốc của chuyển động.",
              "Quãng đường đi được.",
              "Lực tác dụng lên vật."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Hệ số góc của đồ thị $d - t$ bằng $\\frac{\\Delta d}{\\Delta t}$, chính là định nghĩa của **vận tốc** trong chuyển động thẳng.",
            "conceptTested": "Ý nghĩa hệ số góc đồ thị d-t",
            "textbookRef": "KNTT Bài 7 (Trang 33)",
            "difficulty": "medium"
          },
          {
            "id": "b7-q2",
            "question": "Một đoạn đồ thị $d - t$ là một đường thẳng nằm ngang song song với trục thời gian thể hiện vật đang:",
            "questionEn": "A horizontal straight line parallel to the time axis on a d-t graph indicates:",
            "options": [
              "Chuyển động thẳng đều với vận tốc không đổi.",
              "Đứng yên (vận tốc bằng 0).",
              "Chuyển động nhanh dần đều.",
              "Chuyển động chậm dần đều."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Đường nằm ngang có $\\Delta d = 0$ khi thời gian $t$ vẫn trôi, nghĩa là toạ độ vị trí của vật không đổi theo thời gian $\\implies v = 0$, vật đang đứng yên.",
            "conceptTested": "Đoạn nằm ngang đồ thị d-t",
            "textbookRef": "KNTT Bài 7 (Trang 33)",
            "difficulty": "medium"
          },
          {
            "id": "b7-q3",
            "question": "Trên đồ thị $d - t$, tại $t_1 = 2\\text{ s}$ vật có $d_1 = 4\\text{ m}$; tại $t_2 = 6\\text{ s}$ vật có $d_2 = 16\\text{ m}$. Vận tốc của vật trong khoảng thời gian này là:",
            "questionEn": "From t₁ = 2s (d₁ = 10m) to t₂ = 6s (d₂ = 30m), the velocity of the object is:",
            "options": [
              "$2\\text{ m/s}$",
              "$3\\text{ m/s}$",
              "$4\\text{ m/s}$",
              "$5\\text{ m/s}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Vận tốc tính theo độ dốc:\n$$v = \\frac{d_2 - d_1}{t_2 - t_1} = \\frac{16 - 4}{6 - 2} = \\frac{12}{4} = 3\\text{ m/s}$$",
            "conceptTested": "Tính vận tốc từ tọa độ đồ thị d-t",
            "textbookRef": "KNTT Bài 7 (Trang 34)",
            "difficulty": "medium"
          },
          {
            "id": "b7-q4",
            "question": "Đồ thị $d - t$ là một đường thẳng dốc xuống về phía trục thời gian cho biết vật đang:",
            "questionEn": "A downward-sloping line on a d - t graph indicates:",
            "options": [
              "Chuyển động nhanh dần.",
              "Chuyển động theo chiều âm của trục toạ độ ($v < 0$).",
              "Chuyển động với gia tốc âm.",
              "Dừng lại ngay tức thì."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Đường thẳng dốc xuống có hệ số góc âm: $\\frac{\\Delta d}{\\Delta t} < 0 \\implies v < 0$. Vật đang chuyển động thẳng đều theo chiều âm của trục toạ độ đã chọn.",
            "conceptTested": "Đồ thị d-t dốc xuống",
            "textbookRef": "KNTT Bài 7 (Trang 33)",
            "difficulty": "medium"
          },
          {
            "id": "b7-q5",
            "question": "Nếu đồ thị $d - t$ là một đường cong Parabol thì chuyển động của vật là:",
            "questionEn": "Line (1) has a steeper slope than line (2) on the same d-t axes. This proves:",
            "options": [
              "Chuyển động thẳng đều.",
              "Chuyển động thẳng biến đổi đều ($d$ phụ thuộc bậc hai vào $t$).",
              "Chuyển động tròn đều.",
              "Vật luôn đứng yên."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Trong chuyển động thẳng biến đổi đều, phương trình độ dịch chuyển có dạng $d = v_0 t + \\frac{1}{2}at^2$, đây là một hàm số bậc hai đối với biến thời gian $t$, do đó đường biểu diễn $d - t$ là một đường cong Parabol.",
            "conceptTested": "So sánh vận tốc qua độ dốc đồ thị",
            "textbookRef": "KNTT Bài 7 (Trang 34)",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-8",
        "chapterId": "chuong-2",
        "lessonNum": 8,
        "number": 8,
        "title": "Chuyển động biến đổi. Gia tốc",
        "titleEn": "Chuyển động biến đổi. Gia tốc",
        "subtitle": "Khái niệm chuyển động biến đổi, định nghĩa đại lượng gia tốc a, ý nghĩa dấu của tích a.v đối với chuyển động nhanh dần và chậm dần.",
        "subtitleEn": "Khái niệm chuyển động biến đổi, định nghĩa đại lượng gia tốc a, ý nghĩa dấu của tích a.v đối với chuyển động nhanh dần và chậm dần.",
        "shortDesc": "Khái niệm chuyển động biến đổi, định nghĩa đại lượng gia tốc a, ý nghĩa dấu của tích a.v đối với chuyển động nhanh dần và chậm dần.",
        "shortDescription": "Khái niệm chuyển động biến đổi, định nghĩa đại lượng gia tốc a, ý nghĩa dấu của tích a.v đối với chuyển động nhanh dần và chậm dần.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Khám phá Vectơ Gia tốc và Vận tốc",
        "labTagEn": "Virtual Lab",
        "knttRef": "KNTT Bài 8",
        "ctstRef": "CTST Bài 8",
        "simulationId": "motion-graph",
        "labType": "motion_graph",
        "labTitle": "Khám phá Vectơ Gia tốc và Vận tốc",
        "labDescription": "Điều chỉnh gia tốc dương và âm, quan sát vectơ v và vectơ a hiển thị song song trên xe để hiểu bản chất tích a.v.",
        "virtualLabSpec": {
          "experimentName": "Khám phá Vectơ Gia tốc và Vận tốc",
          "purpose": "Điều chỉnh gia tốc dương và âm, quan sát vectơ v và vectơ a hiển thị song song trên xe để hiểu bản chất tích a.v.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Khái niệm chuyển động biến đổi, định nghĩa đại lượng gia tốc a, ý nghĩa dấu của tích a.v đối với chuyển động nhanh dần và chậm dần.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Khái niệm chuyển động biến đổi",
            "content": "Chuyển động có vận tốc thay đổi theo thời gian gọi là **chuyển động biến đổi**.\n* Tàu hỏa rời ga: vận tốc tăng dần.\n* Xe máy bóp phanh: vận tốc giảm dần.\n* Xe vào khúc cua: hướng chuyển động thay đổi liên tục.\n\nĐể định lượng sự thay đổi của vận tốc nhanh hay chậm, người ta đưa ra đại lượng **Gia tốc**."
          },
          {
            "title": "2. Định nghĩa và Công thức Gia tốc",
            "content": "**Gia tốc** là đại lượng vật lí đặc trưng cho **tốc độ thay đổi của vận tốc** theo thời gian:\n$$a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_t - v_0}{t - t_0}$$\n\n* Trong hệ SI, đơn vị của gia tốc là **mét trên giây bình phương** ($\\text{m/s}^2$).\n* **Vectơ gia tốc**:\n$$\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v}_t - \\vec{v}_0}{\\Delta t}$$\nVectơ gia tốc có cùng hướng với vectơ biến thiên vận tốc $\\Delta \\vec{v}$.",
            "keyTakeaway": "Gia tốc đặc trưng cho sự biến thiên của vận tốc: a = Δv / Δt (đơn vị: m/s²).",
            "formulas": [
              {
                "name": "Gia tốc trung bình",
                "latex": "a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}",
                "description": "Độ biến thiên vận tốc trong một đơn vị thời gian",
                "units": "m/s²"
              }
            ]
          },
          {
            "title": "3. Phân biệt chuyển động nhanh dần đều và chậm dần đều",
            "content": "Xét chuyển động thẳng:\n\n### a) Chuyển động nhanh dần (vận tốc tăng theo thời gian)\n* Vectơ gia tốc $\\vec{a}$ **cùng chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\uparrow \\vec{v}$).\n* Tích đại số:\n$$a \\cdot v > 0$$\n(Tức $a$ và $v$ cùng dấu: cùng dương nếu đi theo chiều dương, cùng âm nếu đi theo chiều âm).\n\n### b) Chuyển động chậm dần (vận tốc giảm theo thời gian)\n* Vectơ gia tốc $\\vec{a}$ **ngược chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\downarrow \\vec{v}$).\n* Tích đại số:\n$$a \\cdot v < 0$$\n(Tức $a$ và $v$ trái dấu: một đại lượng dương thì đại lượng kia âm).",
            "keyTakeaway": "Nhanh dần: a và v cùng chiều (a·v > 0). Chậm dần: a và v ngược chiều (a·v < 0)."
          }
        ],
        "theorySections": [
          {
            "title": "1. Khái niệm chuyển động biến đổi",
            "content": "Chuyển động có vận tốc thay đổi theo thời gian gọi là **chuyển động biến đổi**.\n* Tàu hỏa rời ga: vận tốc tăng dần.\n* Xe máy bóp phanh: vận tốc giảm dần.\n* Xe vào khúc cua: hướng chuyển động thay đổi liên tục.\n\nĐể định lượng sự thay đổi của vận tốc nhanh hay chậm, người ta đưa ra đại lượng **Gia tốc**."
          },
          {
            "title": "2. Định nghĩa và Công thức Gia tốc",
            "content": "**Gia tốc** là đại lượng vật lí đặc trưng cho **tốc độ thay đổi của vận tốc** theo thời gian:\n$$a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_t - v_0}{t - t_0}$$\n\n* Trong hệ SI, đơn vị của gia tốc là **mét trên giây bình phương** ($\\text{m/s}^2$).\n* **Vectơ gia tốc**:\n$$\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v}_t - \\vec{v}_0}{\\Delta t}$$\nVectơ gia tốc có cùng hướng với vectơ biến thiên vận tốc $\\Delta \\vec{v}$.",
            "keyTakeaway": "Gia tốc đặc trưng cho sự biến thiên của vận tốc: a = Δv / Δt (đơn vị: m/s²).",
            "formulas": [
              {
                "name": "Gia tốc trung bình",
                "latex": "a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}",
                "description": "Độ biến thiên vận tốc trong một đơn vị thời gian",
                "units": "m/s²"
              }
            ]
          },
          {
            "title": "3. Phân biệt chuyển động nhanh dần đều và chậm dần đều",
            "content": "Xét chuyển động thẳng:\n\n### a) Chuyển động nhanh dần (vận tốc tăng theo thời gian)\n* Vectơ gia tốc $\\vec{a}$ **cùng chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\uparrow \\vec{v}$).\n* Tích đại số:\n$$a \\cdot v > 0$$\n(Tức $a$ và $v$ cùng dấu: cùng dương nếu đi theo chiều dương, cùng âm nếu đi theo chiều âm).\n\n### b) Chuyển động chậm dần (vận tốc giảm theo thời gian)\n* Vectơ gia tốc $\\vec{a}$ **ngược chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\downarrow \\vec{v}$).\n* Tích đại số:\n$$a \\cdot v < 0$$\n(Tức $a$ và $v$ trái dấu: một đại lượng dương thì đại lượng kia âm).",
            "keyTakeaway": "Nhanh dần: a và v cùng chiều (a·v > 0). Chậm dần: a và v ngược chiều (a·v < 0)."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Gia tốc",
            "latex": "a = \\frac{v_t - v_0}{t - t_0}"
          },
          {
            "name": "Điều kiện nhanh dần",
            "latex": "a \\cdot v > 0"
          },
          {
            "name": "Điều kiện chậm dần",
            "latex": "a \\cdot v < 0"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Khái niệm chuyển động biến đổi",
              "content": "Chuyển động có vận tốc thay đổi theo thời gian gọi là **chuyển động biến đổi**.\n* Tàu hỏa rời ga: vận tốc tăng dần.\n* Xe máy bóp phanh: vận tốc giảm dần.\n* Xe vào khúc cua: hướng chuyển động thay đổi liên tục.\n\nĐể định lượng sự thay đổi của vận tốc nhanh hay chậm, người ta đưa ra đại lượng **Gia tốc**."
            },
            {
              "num": 2,
              "heading": "2. Định nghĩa và Công thức Gia tốc",
              "content": "**Gia tốc** là đại lượng vật lí đặc trưng cho **tốc độ thay đổi của vận tốc** theo thời gian:\n$$a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_t - v_0}{t - t_0}$$\n\n* Trong hệ SI, đơn vị của gia tốc là **mét trên giây bình phương** ($\\text{m/s}^2$).\n* **Vectơ gia tốc**:\n$$\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v}_t - \\vec{v}_0}{\\Delta t}$$\nVectơ gia tốc có cùng hướng với vectơ biến thiên vận tốc $\\Delta \\vec{v}$.",
              "keyTakeaway": "Gia tốc đặc trưng cho sự biến thiên của vận tốc: a = Δv / Δt (đơn vị: m/s²)."
            },
            {
              "num": 3,
              "heading": "3. Phân biệt chuyển động nhanh dần đều và chậm dần đều",
              "content": "Xét chuyển động thẳng:\n\n### a) Chuyển động nhanh dần (vận tốc tăng theo thời gian)\n* Vectơ gia tốc $\\vec{a}$ **cùng chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\uparrow \\vec{v}$).\n* Tích đại số:\n$$a \\cdot v > 0$$\n(Tức $a$ và $v$ cùng dấu: cùng dương nếu đi theo chiều dương, cùng âm nếu đi theo chiều âm).\n\n### b) Chuyển động chậm dần (vận tốc giảm theo thời gian)\n* Vectơ gia tốc $\\vec{a}$ **ngược chiều** với vectơ vận tốc $\\vec{v}$ ($\\vec{a} \\uparrow\\downarrow \\vec{v}$).\n* Tích đại số:\n$$a \\cdot v < 0$$\n(Tức $a$ và $v$ trái dấu: một đại lượng dương thì đại lượng kia âm).",
              "keyTakeaway": "Nhanh dần: a và v cùng chiều (a·v > 0). Chậm dần: a và v ngược chiều (a·v < 0)."
            }
          ],
          "ghiNho": "Gia tốc đặc trưng cho sự biến thiên của vận tốc: a = Δv / Δt (đơn vị: m/s²). Nhanh dần: a và v cùng chiều (a·v > 0). Chậm dần: a và v ngược chiều (a·v < 0).",
          "part2_formulas": [
            {
              "formula": "a = \\frac{v_t - v_0}{t - t_0}",
              "quantity": "Gia tốc",
              "symbol": "a",
              "unit": "SI",
              "meaning": "Gia tốc"
            },
            {
              "formula": "a \\cdot v > 0",
              "quantity": "Điều kiện nhanh dần",
              "symbol": "f",
              "unit": "SI",
              "meaning": "Điều kiện nhanh dần"
            },
            {
              "formula": "a \\cdot v < 0",
              "quantity": "Điều kiện chậm dần",
              "symbol": "f",
              "unit": "SI",
              "meaning": "Điều kiện chậm dần"
            }
          ],
          "part3_applications": [
            "Ứng dụng các quy luật của Bài 8 trong đời sống và kĩ thuật thực tiễn.",
            "Phân tích hiện tượng thực nghiệm và thiết kế thiết bị kĩ thuật hiện đại."
          ]
        },
        "quizzes": [
          {
            "id": "b8-q1",
            "question": "Đại lượng đặc trưng cho tốc độ thay đổi của vận tốc theo thời gian gọi là gì?",
            "options": [
              "Tốc độ trung bình",
              "Độ dịch chuyển",
              "Gia tốc",
              "Quãng đường"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Theo định nghĩa trong SGK Vật lí 10, **Gia tốc** là đại lượng đặc trưng cho sự thay đổi nhanh hay chậm của vận tốc theo thời gian: $a = \\frac{\\Delta v}{\\Delta t}$.",
            "conceptTested": "Đại lượng đặc trưng cho tốc độ thay đổi của vận tố",
            "textbookRef": "KNTT Bài 8",
            "difficulty": "medium"
          },
          {
            "id": "b8-q2",
            "question": "Đơn vị đo chuẩn của gia tốc trong hệ đơn vị quốc tế SI là:",
            "options": [
              "$\\text{m/s}$",
              "$\\text{km/h}$",
              "$\\text{m/s}^2$",
              "$\\text{m}^2/\\text{s}$"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Gia tốc $a = \\frac{\\Delta v}{\\Delta t}$, đơn vị của vận tốc là $\\text{m/s}$, chia cho đơn vị thời gian $\\text{s}$ ta được $\\text{m/s}^2$ (mét trên giây bình phương).",
            "conceptTested": "Đơn vị đo chuẩn của gia tốc trong hệ đơn vị quốc t",
            "textbookRef": "KNTT Bài 8",
            "difficulty": "medium"
          },
          {
            "id": "b8-q3",
            "question": "Chuyển động thẳng được gọi là NHANH DẦN khi nào?",
            "options": [
              "Gia tốc $a > 0$",
              "Gia tốc $a$ và vận tốc $v$ cùng dấu ($a \\cdot v > 0$)",
              "Gia tốc $a$ và vận tốc $v$ trái dấu ($a \\cdot v < 0$)",
              "Vận tốc $v = \\text{const}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Một chuyển động là nhanh dần khi độ lớn vận tốc tăng dần, tức là vectơ gia tốc $\\vec{a}$ cùng chiều với vectơ vận tốc $\\vec{v}$, tương đương điều kiện đại số: $a \\cdot v > 0$.",
            "conceptTested": "Chuyển động thẳng được gọi là NHANH DẦN khi nào?",
            "textbookRef": "KNTT Bài 8",
            "difficulty": "medium"
          },
          {
            "id": "b8-q4",
            "question": "Một ô tô đang chạy với vận tốc $15\\text{ m/s}$ thì người lái xe hãm phanh. Sau $5\\text{ s}$, ô tô dừng lại hẳn. Gia tốc của ô tô là:",
            "options": [
              "$-3\\text{ m/s}^2$",
              "$3\\text{ m/s}^2$",
              "$-5\\text{ m/s}^2$",
              "$0\\text{ m/s}^2$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Vận tốc ban đầu $v_0 = 15\\text{ m/s}$, vận tốc lúc dừng lại $v = 0\\text{ m/s}$, thời gian $\\Delta t = 5\\text{ s}$.\n$$a = \\frac{v - v_0}{\\Delta t} = \\frac{0 - 15}{5} = -3\\text{ m/s}^2$$\nDấu âm cho biết gia tốc ngược chiều vận tốc (chuyển động chậm dần).",
            "conceptTested": "Một ô tô đang chạy với vận tốc $15\\text{ m/s}$ thì",
            "textbookRef": "KNTT Bài 8",
            "difficulty": "medium"
          },
          {
            "id": "b8-q5",
            "question": "Trong chuyển động thẳng chậm dần theo chiều dương trục $Ox$, dấu của vận tốc $v$ và gia tốc $a$ là:",
            "options": [
              "$v > 0$ và $a > 0$",
              "$v > 0$ và $a < 0$",
              "$v < 0$ và $a > 0$",
              "$v < 0$ và $a < 0$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Chuyển động theo chiều dương nên $v > 0$. Chuyển động chậm dần thì gia tốc phải ngược chiều vận tốc, tức $a \\cdot v < 0 \\implies a < 0$.",
            "conceptTested": "Trong chuyển động thẳng chậm dần theo chiều dương ",
            "textbookRef": "KNTT Bài 8",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-9",
        "chapterId": "chuong-2",
        "lessonNum": 9,
        "number": 9,
        "title": "Chuyển động thẳng biến đổi đều",
        "titleEn": "Chuyển động thẳng biến đổi đều",
        "subtitle": "Định nghĩa a = const, bộ 3 công thức cốt lõi v = v₀ + at, d = v₀t + ½at², v² - v₀² = 2ad, đồ thị v - t và diện tích hình thang.",
        "subtitleEn": "Định nghĩa a = const, bộ 3 công thức cốt lõi v = v₀ + at, d = v₀t + ½at², v² - v₀² = 2ad, đồ thị v - t và diện tích hình thang.",
        "shortDesc": "Định nghĩa a = const, bộ 3 công thức cốt lõi v = v₀ + at, d = v₀t + ½at², v² - v₀² = 2ad, đồ thị v - t và diện tích hình thang.",
        "shortDescription": "Định nghĩa a = const, bộ 3 công thức cốt lõi v = v₀ + at, d = v₀t + ½at², v² - v₀² = 2ad, đồ thị v - t và diện tích hình thang.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Phòng thí nghiệm: Chuyển động Thẳng Biến đổi đều",
        "labTagEn": "Virtual Lab",
        "knttRef": "KNTT Bài 9",
        "ctstRef": "CTST Bài 9",
        "simulationId": "motion-graph",
        "labType": "motion_graph",
        "labTitle": "Phòng thí nghiệm: Chuyển động Thẳng Biến đổi đều",
        "labDescription": "Mô phỏng xe chạy có gia tốc, đồng thời vẽ đồ thị v - t theo thời gian thực và tính diện tích miền dưới đồ thị để kiểm chứng độ dịch chuyển d.",
        "virtualLabSpec": {
          "experimentName": "Phòng thí nghiệm: Chuyển động Thẳng Biến đổi đều",
          "purpose": "Mô phỏng xe chạy có gia tốc, đồng thời vẽ đồ thị v - t theo thời gian thực và tính diện tích miền dưới đồ thị để kiểm chứng độ dịch chuyển d.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Định nghĩa a = const, bộ 3 công thức cốt lõi v = v₀ + at, d = v₀t + ½at², v² - v₀² = 2ad, đồ thị v - t và diện tích hình thang.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Định nghĩa Chuyển động thẳng biến đổi đều",
            "content": "Chuyển động thẳng biến đổi đều là chuyển động có **quỹ đạo là đường thẳng** và có **gia tốc không đổi theo thời gian** ($\\vec{a} = \\text{hằng số}$).\n* Nếu $a \\cdot v > 0$: Chuyển động thẳng **nhanh dần đều** (vận tốc tăng đều theo thời gian).\n* Nếu $a \\cdot v < 0$: Chuyển động thẳng **chậm dần đều** (vận tốc giảm đều theo thời gian).",
            "keyTakeaway": "Chuyển động thẳng biến đổi đều: Quỹ đạo thẳng, gia tốc không đổi (a = const)."
          },
          {
            "title": "2. Các công thức cốt lõi",
            "content": "### 1. Công thức vận tốc tức thời:\n$$v = v_0 + at$$\nTrong đó: $v_0$ là vận tốc ban đầu (tại $t = 0$); $v$ là vận tốc tại thời điểm $t$; $a$ là gia tốc.\n\n### 2. Công thức tính độ dịch chuyển (hoặc quãng đường):\n$$d = v_0 t + \\frac{1}{2}at^2$$\n(Khi chuyển động thẳng không đổi chiều thì $s = d$).\n\n### 3. Công thức liên hệ độc lập với thời gian (Hệ thức độc lập $t$):\n$$v^2 - v_0^2 = 2ad$$\nCông thức này cho phép tìm vận tốc hoặc quãng đường mà không cần biết thời gian $t$.",
            "keyTakeaway": "Bộ 3 công thức cốt lõi: v = v₀ + at; d = v₀t + ½at²; v² - v₀² = 2ad.",
            "formulas": [
              {
                "name": "Vận tốc tức thời",
                "latex": "v = v_0 + at",
                "description": "Vận tốc biến thiên bậc nhất theo thời gian",
                "units": "m/s"
              },
              {
                "name": "Độ dịch chuyển",
                "latex": "d = v_0 t + \\frac{1}{2}at^2",
                "description": "Độ dịch chuyển là hàm bậc hai theo thời gian",
                "units": "m"
              },
              {
                "name": "Hệ thức độc lập thời gian",
                "latex": "v^2 - v_0^2 = 2ad",
                "description": "Liên hệ giữa vận tốc, gia tốc và độ dịch chuyển"
              }
            ]
          },
          {
            "title": "3. Đồ thị vận tốc – thời gian ($v - t$)",
            "content": "* Đồ thị $v - t$ của chuyển động thẳng biến đổi đều là một **đường thẳng xiên góc**:\n  * Độ dốc của đường thẳng $v - t$ chính bằng **gia tốc** $a = \\frac{\\Delta v}{\\Delta t}$.\n  * Nếu $a > 0$: đường thẳng dốc lên.\n  * Nếu $a < 0$: đường thẳng dốc xuống.\n  * Nếu $a = 0$: đường thẳng nằm ngang (chuyển động thẳng đều).\n\n### Ý nghĩa diện tích dưới đồ thị $v - t$:\n**Diện tích của hình giới hạn bởi đồ thị $v - t$, trục hoành thời gian và hai đường dóng thời điểm $t_1, t_2$ có giá trị bằng độ lớn của độ dịch chuyển $d$** trong khoảng thời gian đó.\n* Với hình thang vuông: $S = \\frac{(v_0 + v) \\cdot t}{2} = v_0 t + \\frac{1}{2}at^2 = d$.",
            "keyTakeaway": "Độ dốc đồ thị v - t bằng gia tốc a. Diện tích hình phẳng dưới đồ thị v - t bằng độ dịch chuyển d."
          }
        ],
        "theorySections": [
          {
            "title": "1. Định nghĩa Chuyển động thẳng biến đổi đều",
            "content": "Chuyển động thẳng biến đổi đều là chuyển động có **quỹ đạo là đường thẳng** và có **gia tốc không đổi theo thời gian** ($\\vec{a} = \\text{hằng số}$).\n* Nếu $a \\cdot v > 0$: Chuyển động thẳng **nhanh dần đều** (vận tốc tăng đều theo thời gian).\n* Nếu $a \\cdot v < 0$: Chuyển động thẳng **chậm dần đều** (vận tốc giảm đều theo thời gian).",
            "keyTakeaway": "Chuyển động thẳng biến đổi đều: Quỹ đạo thẳng, gia tốc không đổi (a = const)."
          },
          {
            "title": "2. Các công thức cốt lõi",
            "content": "### 1. Công thức vận tốc tức thời:\n$$v = v_0 + at$$\nTrong đó: $v_0$ là vận tốc ban đầu (tại $t = 0$); $v$ là vận tốc tại thời điểm $t$; $a$ là gia tốc.\n\n### 2. Công thức tính độ dịch chuyển (hoặc quãng đường):\n$$d = v_0 t + \\frac{1}{2}at^2$$\n(Khi chuyển động thẳng không đổi chiều thì $s = d$).\n\n### 3. Công thức liên hệ độc lập với thời gian (Hệ thức độc lập $t$):\n$$v^2 - v_0^2 = 2ad$$\nCông thức này cho phép tìm vận tốc hoặc quãng đường mà không cần biết thời gian $t$.",
            "keyTakeaway": "Bộ 3 công thức cốt lõi: v = v₀ + at; d = v₀t + ½at²; v² - v₀² = 2ad.",
            "formulas": [
              {
                "name": "Vận tốc tức thời",
                "latex": "v = v_0 + at",
                "description": "Vận tốc biến thiên bậc nhất theo thời gian",
                "units": "m/s"
              },
              {
                "name": "Độ dịch chuyển",
                "latex": "d = v_0 t + \\frac{1}{2}at^2",
                "description": "Độ dịch chuyển là hàm bậc hai theo thời gian",
                "units": "m"
              },
              {
                "name": "Hệ thức độc lập thời gian",
                "latex": "v^2 - v_0^2 = 2ad",
                "description": "Liên hệ giữa vận tốc, gia tốc và độ dịch chuyển"
              }
            ]
          },
          {
            "title": "3. Đồ thị vận tốc – thời gian ($v - t$)",
            "content": "* Đồ thị $v - t$ của chuyển động thẳng biến đổi đều là một **đường thẳng xiên góc**:\n  * Độ dốc của đường thẳng $v - t$ chính bằng **gia tốc** $a = \\frac{\\Delta v}{\\Delta t}$.\n  * Nếu $a > 0$: đường thẳng dốc lên.\n  * Nếu $a < 0$: đường thẳng dốc xuống.\n  * Nếu $a = 0$: đường thẳng nằm ngang (chuyển động thẳng đều).\n\n### Ý nghĩa diện tích dưới đồ thị $v - t$:\n**Diện tích của hình giới hạn bởi đồ thị $v - t$, trục hoành thời gian và hai đường dóng thời điểm $t_1, t_2$ có giá trị bằng độ lớn của độ dịch chuyển $d$** trong khoảng thời gian đó.\n* Với hình thang vuông: $S = \\frac{(v_0 + v) \\cdot t}{2} = v_0 t + \\frac{1}{2}at^2 = d$.",
            "keyTakeaway": "Độ dốc đồ thị v - t bằng gia tốc a. Diện tích hình phẳng dưới đồ thị v - t bằng độ dịch chuyển d."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Vận tốc",
            "latex": "v = v_0 + at"
          },
          {
            "name": "Độ dịch chuyển",
            "latex": "d = v_0 t + \\frac{1}{2}at^2"
          },
          {
            "name": "Hệ thức liên hệ",
            "latex": "v^2 - v_0^2 = 2ad"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Định nghĩa Chuyển động thẳng biến đổi đều",
              "content": "Chuyển động thẳng biến đổi đều là chuyển động có **quỹ đạo là đường thẳng** và có **gia tốc không đổi theo thời gian** ($\\vec{a} = \\text{hằng số}$).\n* Nếu $a \\cdot v > 0$: Chuyển động thẳng **nhanh dần đều** (vận tốc tăng đều theo thời gian).\n* Nếu $a \\cdot v < 0$: Chuyển động thẳng **chậm dần đều** (vận tốc giảm đều theo thời gian).",
              "keyTakeaway": "Chuyển động thẳng biến đổi đều: Quỹ đạo thẳng, gia tốc không đổi (a = const)."
            },
            {
              "num": 2,
              "heading": "2. Các công thức cốt lõi",
              "content": "### 1. Công thức vận tốc tức thời:\n$$v = v_0 + at$$\nTrong đó: $v_0$ là vận tốc ban đầu (tại $t = 0$); $v$ là vận tốc tại thời điểm $t$; $a$ là gia tốc.\n\n### 2. Công thức tính độ dịch chuyển (hoặc quãng đường):\n$$d = v_0 t + \\frac{1}{2}at^2$$\n(Khi chuyển động thẳng không đổi chiều thì $s = d$).\n\n### 3. Công thức liên hệ độc lập với thời gian (Hệ thức độc lập $t$):\n$$v^2 - v_0^2 = 2ad$$\nCông thức này cho phép tìm vận tốc hoặc quãng đường mà không cần biết thời gian $t$.",
              "keyTakeaway": "Bộ 3 công thức cốt lõi: v = v₀ + at; d = v₀t + ½at²; v² - v₀² = 2ad."
            },
            {
              "num": 3,
              "heading": "3. Đồ thị vận tốc – thời gian ($v - t$)",
              "content": "* Đồ thị $v - t$ của chuyển động thẳng biến đổi đều là một **đường thẳng xiên góc**:\n  * Độ dốc của đường thẳng $v - t$ chính bằng **gia tốc** $a = \\frac{\\Delta v}{\\Delta t}$.\n  * Nếu $a > 0$: đường thẳng dốc lên.\n  * Nếu $a < 0$: đường thẳng dốc xuống.\n  * Nếu $a = 0$: đường thẳng nằm ngang (chuyển động thẳng đều).\n\n### Ý nghĩa diện tích dưới đồ thị $v - t$:\n**Diện tích của hình giới hạn bởi đồ thị $v - t$, trục hoành thời gian và hai đường dóng thời điểm $t_1, t_2$ có giá trị bằng độ lớn của độ dịch chuyển $d$** trong khoảng thời gian đó.\n* Với hình thang vuông: $S = \\frac{(v_0 + v) \\cdot t}{2} = v_0 t + \\frac{1}{2}at^2 = d$.",
              "keyTakeaway": "Độ dốc đồ thị v - t bằng gia tốc a. Diện tích hình phẳng dưới đồ thị v - t bằng độ dịch chuyển d."
            }
          ],
          "ghiNho": "Chuyển động thẳng biến đổi đều: Quỹ đạo thẳng, gia tốc không đổi (a = const). Bộ 3 công thức cốt lõi: v = v₀ + at; d = v₀t + ½at²; v² - v₀² = 2ad. Độ dốc đồ thị v - t bằng gia tốc a. Diện tích hình phẳng dưới đồ thị v - t bằng độ dịch chuyển d.",
          "part2_formulas": [
            {
              "formula": "v = v_0 + at",
              "quantity": "Vận tốc",
              "symbol": "v",
              "unit": "SI",
              "meaning": "Vận tốc"
            },
            {
              "formula": "d = v_0 t + \\frac{1}{2}at^2",
              "quantity": "Độ dịch chuyển",
              "symbol": "d",
              "unit": "SI",
              "meaning": "Độ dịch chuyển"
            },
            {
              "formula": "v^2 - v_0^2 = 2ad",
              "quantity": "Hệ thức liên hệ",
              "symbol": "v^2 - v_0^2",
              "unit": "SI",
              "meaning": "Hệ thức liên hệ"
            }
          ],
          "part3_applications": [
            "Ứng dụng các quy luật của Bài 9 trong đời sống và kĩ thuật thực tiễn.",
            "Phân tích hiện tượng thực nghiệm và thiết kế thiết bị kĩ thuật hiện đại."
          ]
        },
        "quizzes": [
          {
            "id": "b9-q1",
            "question": "Công thức nào sau đây là hệ thức độc lập thời gian trong chuyển động thẳng biến đổi đều?",
            "options": [
              "$v^2 - v_0^2 = 2ad$",
              "$v - v_0 = 2ad$",
              "$v^2 + v_0^2 = 2ad$",
              "$v^2 - v_0^2 = ad$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Hệ thức độc lập thời gian liên hệ giữa vận tốc đầu $v_0$, vận tốc sau $v$, gia tốc $a$ và độ dịch chuyển $d$ là:\n$$v^2 - v_0^2 = 2ad$$",
            "conceptTested": "Công thức nào sau đây là hệ thức độc lập thời gian",
            "textbookRef": "KNTT Bài 9",
            "difficulty": "medium"
          },
          {
            "id": "b9-q2",
            "question": "Một đoàn tàu bắt đầu rời ga chuyển động thẳng nhanh dần đều với gia tốc $a = 0{,}2\\text{ m/s}^2$. Vận tốc của tàu sau $20\\text{ s}$ là:",
            "options": [
              "$2\\text{ m/s}$",
              "$4\\text{ m/s}$",
              "$10\\text{ m/s}$",
              "$40\\text{ m/s}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Tàu bắt đầu rời ga nên $v_0 = 0$.\nÁp dụng công thức vận tốc: $v = v_0 + at = 0 + 0{,}2 \\times 20 = 4\\text{ m/s}$.",
            "conceptTested": "Một đoàn tàu bắt đầu rời ga chuyển động thẳng nhan",
            "textbookRef": "KNTT Bài 9",
            "difficulty": "medium"
          },
          {
            "id": "b9-q3",
            "question": "Quãng đường mà đoàn tàu ở câu trên đi được trong $20\\text{ s}$ đầu tiên là:",
            "options": [
              "$20\\text{ m}$",
              "$40\\text{ m}$",
              "$80\\text{ m}$",
              "$160\\text{ m}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Áp dụng công thức tính quãng đường:\n$$s = v_0 t + \\frac{1}{2}at^2 = 0 + \\frac{1}{2} \\times 0{,}2 \\times (20)^2 = 0{,}1 \\times 400 = 40\\text{ m}$$",
            "conceptTested": "Quãng đường mà đoàn tàu ở câu trên đi được trong $",
            "textbookRef": "KNTT Bài 9",
            "difficulty": "medium"
          },
          {
            "id": "b9-q4",
            "question": "Diện tích hình giới hạn dưới đồ thị vận tốc – thời gian ($v - t$) có giá trị bằng:",
            "options": [
              "Gia tốc của vật",
              "Độ lớn của độ dịch chuyển (hoặc quãng đường)",
              "Lực cản môi trường",
              "Thời gian chuyển động"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Trong đồ thị $v - t$, diện tích miền hình phẳng nằm dưới đường biểu diễn và trục hoành thời gian có giá trị bằng độ lớn của độ dịch chuyển $d$ (hoặc quãng đường $s$).",
            "conceptTested": "Diện tích hình giới hạn dưới đồ thị vận tốc – thời",
            "textbookRef": "KNTT Bài 9",
            "difficulty": "medium"
          },
          {
            "id": "b9-q5",
            "question": "Một xe máy đang chạy với vận tốc $10\\text{ m/s}$ thì tăng tốc nhanh dần đều với gia tốc $a = 2\\text{ m/s}^2$ trên quãng đường $d = 24\\text{ m}$. Vận tốc của xe ở cuối quãng đường là:",
            "options": [
              "$12\\text{ m/s}$",
              "$14\\text{ m/s}$",
              "$16\\text{ m/s}$",
              "$20\\text{ m/s}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Áp dụng hệ thức độc lập thời gian $v^2 - v_0^2 = 2ad$:\n$$v^2 = v_0^2 + 2ad = 10^2 + 2 \\times 2 \\times 24 = 100 + 96 = 196$$\n$$\\implies v = \\sqrt{196} = 14\\text{ m/s}$$",
            "conceptTested": "Một xe máy đang chạy với vận tốc $10\\text{ m/s}$ t",
            "textbookRef": "KNTT Bài 9",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-10",
        "chapterId": "chuong-2",
        "lessonNum": 10,
        "number": 10,
        "title": "Sự rơi tự do",
        "titleEn": "Sự rơi tự do",
        "subtitle": "Định nghĩa sự rơi trong chân không, gia tốc rơi tự do g, các công thức rơi tự do không vận tốc ban đầu.",
        "subtitleEn": "Định nghĩa sự rơi trong chân không, gia tốc rơi tự do g, các công thức rơi tự do không vận tốc ban đầu.",
        "shortDesc": "Định nghĩa sự rơi trong chân không, gia tốc rơi tự do g, các công thức rơi tự do không vận tốc ban đầu.",
        "shortDescription": "Định nghĩa sự rơi trong chân không, gia tốc rơi tự do g, các công thức rơi tự do không vận tốc ban đầu.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Mô phỏng Rơi Tự do trong Chân không",
        "labTagEn": "Virtual Lab",
        "knttRef": "KNTT Bài 10",
        "ctstRef": "CTST Bài 10",
        "simulationId": "free-fall",
        "labType": "free_fall",
        "labTitle": "Mô phỏng Rơi Tự do trong Chân không",
        "labDescription": "Thả rơi vật từ các độ cao khác nhau, so sánh chuyển động trong không khí có lực cản vs trong ống chân không Newton, theo dõi v và s.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Rơi Tự do trong Chân không",
          "purpose": "Thả rơi vật từ các độ cao khác nhau, so sánh chuyển động trong không khí có lực cản vs trong ống chân không Newton, theo dõi v và s.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Định nghĩa sự rơi trong chân không, gia tốc rơi tự do g, các công thức rơi tự do không vận tốc ban đầu.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Sự rơi trong không khí và Sự rơi tự do",
            "content": "* Trong không khí: Các vật rơi nhanh hay chậm khác nhau chủ yếu là do **lực cản của không khí** tác dụng lên vật. Thí nghiệm ống Newton cho thấy: Khi hút hết không khí ra khỏi ống, một chiếc lông chim và một hòn bi chì rơi nhanh như nhau!\n* **Định nghĩa**: Sự rơi tự do là sự rơi của một vật **chỉ chịu tác dụng của trọng lực**.\n* Nếu vật rơi trong không khí mà sức cản của không khí rất nhỏ so với trọng lực của vật (ví dụ: hòn bi thép, quả cầu chì), ta có thể coi gần đúng chuyển động rơi đó là rơi tự do.",
            "keyTakeaway": "Rơi tự do là chuyển động chỉ chịu tác dụng của trọng lực. Không khí cản làm vật rơi chậm lại."
          },
          {
            "title": "2. Đặc điểm của chuyển động rơi tự do",
            "content": "* **Phương chuyển động**: Thẳng đứng.\n* **Chiều chuyển động**: Từ trên xuống dưới.\n* **Tính chất chuyển động**: Là chuyển động thẳng **nhanh dần đều** với vận tốc ban đầu bằng không ($v_0 = 0$).\n* **Gia tốc rơi tự do**: Tại một nơi nhất định trên Trái Đất và ở gần mặt đất, mọi vật đều rơi tự do với cùng một gia tốc kí hiệu là $g$.\n  * Giá trị thường lấy: $g \\approx 9{,}8\\text{ m/s}^2$ hoặc $g \\approx 10\\text{ m/s}^2$.\n  * Gia tốc $g$ thay đổi nhẹ theo vĩ độ địa lí (ở xích đạo $g \\approx 9{,}78\\text{ m/s}^2$, ở hai cực $g \\approx 9{,}83\\text{ m/s}^2$) và giảm dần theo độ cao.",
            "keyTakeaway": "Rơi tự do: Thẳng đứng, từ trên xuống, nhanh dần đều với gia tốc g ≈ 9,8 m/s²."
          },
          {
            "title": "3. Các công thức của sự rơi tự do",
            "content": "Do rơi tự do là chuyển động thẳng nhanh dần đều với $v_0 = 0$ và $a = g$, ta suy ra từ các công thức của chuyển động thẳng biến đổi đều:\n\n### 1. Vận tốc tức thời:\n$$v = g \\cdot t$$\n\n### 2. Quãng đường rơi (độ cao giảm):\n$$s = h = \\frac{1}{2}g t^2$$\n\n### 3. Công thức liên hệ giữa vận tốc và quãng đường:\n$$v^2 = 2gs \\implies v = \\sqrt{2gs}$$\n\n### 4. Thời gian rơi chạm đất từ độ cao $h$:\n$$t = \\sqrt{\\frac{2h}{g}}$$",
            "keyTakeaway": "Công thức rơi tự do: v = gt; s = ½gt²; v = √(2gs); thời gian rơi t = √(2h/g).",
            "formulas": [
              {
                "name": "Vận tốc rơi tự do",
                "latex": "v = g t",
                "description": "Vận tốc tăng tỉ lệ thuận với thời gian",
                "units": "m/s"
              },
              {
                "name": "Quãng đường rơi",
                "latex": "s = \\frac{1}{2}g t^2",
                "description": "Quãng đường tỉ lệ với bình phương thời gian rơi",
                "units": "m"
              },
              {
                "name": "Thời gian rơi từ độ cao h",
                "latex": "t = \\sqrt{\\frac{2h}{g}}",
                "description": "Thời gian chạm đất chỉ phụ thuộc độ cao h và gia tốc g",
                "units": "s"
              }
            ]
          }
        ],
        "theorySections": [
          {
            "title": "1. Sự rơi trong không khí và Sự rơi tự do",
            "content": "* Trong không khí: Các vật rơi nhanh hay chậm khác nhau chủ yếu là do **lực cản của không khí** tác dụng lên vật. Thí nghiệm ống Newton cho thấy: Khi hút hết không khí ra khỏi ống, một chiếc lông chim và một hòn bi chì rơi nhanh như nhau!\n* **Định nghĩa**: Sự rơi tự do là sự rơi của một vật **chỉ chịu tác dụng của trọng lực**.\n* Nếu vật rơi trong không khí mà sức cản của không khí rất nhỏ so với trọng lực của vật (ví dụ: hòn bi thép, quả cầu chì), ta có thể coi gần đúng chuyển động rơi đó là rơi tự do.",
            "keyTakeaway": "Rơi tự do là chuyển động chỉ chịu tác dụng của trọng lực. Không khí cản làm vật rơi chậm lại."
          },
          {
            "title": "2. Đặc điểm của chuyển động rơi tự do",
            "content": "* **Phương chuyển động**: Thẳng đứng.\n* **Chiều chuyển động**: Từ trên xuống dưới.\n* **Tính chất chuyển động**: Là chuyển động thẳng **nhanh dần đều** với vận tốc ban đầu bằng không ($v_0 = 0$).\n* **Gia tốc rơi tự do**: Tại một nơi nhất định trên Trái Đất và ở gần mặt đất, mọi vật đều rơi tự do với cùng một gia tốc kí hiệu là $g$.\n  * Giá trị thường lấy: $g \\approx 9{,}8\\text{ m/s}^2$ hoặc $g \\approx 10\\text{ m/s}^2$.\n  * Gia tốc $g$ thay đổi nhẹ theo vĩ độ địa lí (ở xích đạo $g \\approx 9{,}78\\text{ m/s}^2$, ở hai cực $g \\approx 9{,}83\\text{ m/s}^2$) và giảm dần theo độ cao.",
            "keyTakeaway": "Rơi tự do: Thẳng đứng, từ trên xuống, nhanh dần đều với gia tốc g ≈ 9,8 m/s²."
          },
          {
            "title": "3. Các công thức của sự rơi tự do",
            "content": "Do rơi tự do là chuyển động thẳng nhanh dần đều với $v_0 = 0$ và $a = g$, ta suy ra từ các công thức của chuyển động thẳng biến đổi đều:\n\n### 1. Vận tốc tức thời:\n$$v = g \\cdot t$$\n\n### 2. Quãng đường rơi (độ cao giảm):\n$$s = h = \\frac{1}{2}g t^2$$\n\n### 3. Công thức liên hệ giữa vận tốc và quãng đường:\n$$v^2 = 2gs \\implies v = \\sqrt{2gs}$$\n\n### 4. Thời gian rơi chạm đất từ độ cao $h$:\n$$t = \\sqrt{\\frac{2h}{g}}$$",
            "keyTakeaway": "Công thức rơi tự do: v = gt; s = ½gt²; v = √(2gs); thời gian rơi t = √(2h/g).",
            "formulas": [
              {
                "name": "Vận tốc rơi tự do",
                "latex": "v = g t",
                "description": "Vận tốc tăng tỉ lệ thuận với thời gian",
                "units": "m/s"
              },
              {
                "name": "Quãng đường rơi",
                "latex": "s = \\frac{1}{2}g t^2",
                "description": "Quãng đường tỉ lệ với bình phương thời gian rơi",
                "units": "m"
              },
              {
                "name": "Thời gian rơi từ độ cao h",
                "latex": "t = \\sqrt{\\frac{2h}{g}}",
                "description": "Thời gian chạm đất chỉ phụ thuộc độ cao h và gia tốc g",
                "units": "s"
              }
            ]
          }
        ],
        "summaryFormulas": [
          {
            "name": "Vận tốc rơi",
            "latex": "v = gt"
          },
          {
            "name": "Quãng đường",
            "latex": "s = \\frac{1}{2}gt^2"
          },
          {
            "name": "Vận tốc chạm đất",
            "latex": "v = \\sqrt{2gh}"
          },
          {
            "name": "Thời gian rơi",
            "latex": "t = \\sqrt{\\frac{2h}{g}}"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Sự rơi trong không khí và Sự rơi tự do",
              "content": "* Trong không khí: Các vật rơi nhanh hay chậm khác nhau chủ yếu là do **lực cản của không khí** tác dụng lên vật. Thí nghiệm ống Newton cho thấy: Khi hút hết không khí ra khỏi ống, một chiếc lông chim và một hòn bi chì rơi nhanh như nhau!\n* **Định nghĩa**: Sự rơi tự do là sự rơi của một vật **chỉ chịu tác dụng của trọng lực**.\n* Nếu vật rơi trong không khí mà sức cản của không khí rất nhỏ so với trọng lực của vật (ví dụ: hòn bi thép, quả cầu chì), ta có thể coi gần đúng chuyển động rơi đó là rơi tự do.",
              "keyTakeaway": "Rơi tự do là chuyển động chỉ chịu tác dụng của trọng lực. Không khí cản làm vật rơi chậm lại."
            },
            {
              "num": 2,
              "heading": "2. Đặc điểm của chuyển động rơi tự do",
              "content": "* **Phương chuyển động**: Thẳng đứng.\n* **Chiều chuyển động**: Từ trên xuống dưới.\n* **Tính chất chuyển động**: Là chuyển động thẳng **nhanh dần đều** với vận tốc ban đầu bằng không ($v_0 = 0$).\n* **Gia tốc rơi tự do**: Tại một nơi nhất định trên Trái Đất và ở gần mặt đất, mọi vật đều rơi tự do với cùng một gia tốc kí hiệu là $g$.\n  * Giá trị thường lấy: $g \\approx 9{,}8\\text{ m/s}^2$ hoặc $g \\approx 10\\text{ m/s}^2$.\n  * Gia tốc $g$ thay đổi nhẹ theo vĩ độ địa lí (ở xích đạo $g \\approx 9{,}78\\text{ m/s}^2$, ở hai cực $g \\approx 9{,}83\\text{ m/s}^2$) và giảm dần theo độ cao.",
              "keyTakeaway": "Rơi tự do: Thẳng đứng, từ trên xuống, nhanh dần đều với gia tốc g ≈ 9,8 m/s²."
            },
            {
              "num": 3,
              "heading": "3. Các công thức của sự rơi tự do",
              "content": "Do rơi tự do là chuyển động thẳng nhanh dần đều với $v_0 = 0$ và $a = g$, ta suy ra từ các công thức của chuyển động thẳng biến đổi đều:\n\n### 1. Vận tốc tức thời:\n$$v = g \\cdot t$$\n\n### 2. Quãng đường rơi (độ cao giảm):\n$$s = h = \\frac{1}{2}g t^2$$\n\n### 3. Công thức liên hệ giữa vận tốc và quãng đường:\n$$v^2 = 2gs \\implies v = \\sqrt{2gs}$$\n\n### 4. Thời gian rơi chạm đất từ độ cao $h$:\n$$t = \\sqrt{\\frac{2h}{g}}$$",
              "keyTakeaway": "Công thức rơi tự do: v = gt; s = ½gt²; v = √(2gs); thời gian rơi t = √(2h/g)."
            }
          ],
          "ghiNho": "Rơi tự do là chuyển động chỉ chịu tác dụng của trọng lực. Không khí cản làm vật rơi chậm lại. Rơi tự do: Thẳng đứng, từ trên xuống, nhanh dần đều với gia tốc g ≈ 9,8 m/s². Công thức rơi tự do: v = gt; s = ½gt²; v = √(2gs); thời gian rơi t = √(2h/g).",
          "part2_formulas": [
            {
              "formula": "v = gt",
              "quantity": "Vận tốc rơi",
              "symbol": "v",
              "unit": "SI",
              "meaning": "Vận tốc rơi"
            },
            {
              "formula": "s = \\frac{1}{2}gt^2",
              "quantity": "Quãng đường",
              "symbol": "s",
              "unit": "SI",
              "meaning": "Quãng đường"
            },
            {
              "formula": "v = \\sqrt{2gh}",
              "quantity": "Vận tốc chạm đất",
              "symbol": "v",
              "unit": "SI",
              "meaning": "Vận tốc chạm đất"
            },
            {
              "formula": "t = \\sqrt{\\frac{2h}{g}}",
              "quantity": "Thời gian rơi",
              "symbol": "t",
              "unit": "SI",
              "meaning": "Thời gian rơi"
            }
          ],
          "part3_applications": [
            "Ứng dụng các quy luật của Bài 10 trong đời sống và kĩ thuật thực tiễn.",
            "Phân tích hiện tượng thực nghiệm và thiết kế thiết bị kĩ thuật hiện đại."
          ]
        },
        "quizzes": [
          {
            "id": "b10-q1",
            "question": "Sự rơi tự do là sự rơi của một vật trong trường hợp nào sau đây?",
            "options": [
              "Rơi trong không khí chịu lực cản lớn.",
              "Rơi chỉ dưới tác dụng của trọng lực.",
              "Rơi có vận tốc ban đầu rất lớn theo phương nằm ngang.",
              "Rơi được gắn dù hãm tốc độ."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Định nghĩa SGK Vật lí 10: Sự rơi tự do là sự rơi của một vật **chỉ chịu tác dụng của trọng lực**.",
            "conceptTested": "Sự rơi tự do là sự rơi của một vật trong trường hợ",
            "textbookRef": "KNTT Bài 10",
            "difficulty": "medium"
          },
          {
            "id": "b10-q2",
            "question": "Chuyển động rơi tự do có tính chất là:",
            "options": [
              "Chuyển động thẳng đều từ trên xuống dưới.",
              "Chuyển động thẳng chậm dần đều.",
              "Chuyển động thẳng nhanh dần đều với $v_0 = 0$.",
              "Chuyển động cong lượn parabol."
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Sự rơi tự do có phương thẳng đứng, chiều từ trên xuống dưới và là chuyển động thẳng **nhanh dần đều** với vận tốc ban đầu $v_0 = 0$ và gia tốc $g$.",
            "conceptTested": "Chuyển động rơi tự do có tính chất là:",
            "textbookRef": "KNTT Bài 10",
            "difficulty": "medium"
          },
          {
            "id": "b10-q3",
            "question": "Thả một vật rơi tự do từ độ cao $h = 20\\text{ m}$ so với mặt đất. Lấy $g = 10\\text{ m/s}^2$. Thời gian để vật rơi chạm đất là:",
            "options": [
              "$1\\text{ s}$",
              "$2\\text{ s}$",
              "$4\\text{ s}$",
              "$0{,}5\\text{ s}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Công thức thời gian rơi tự do từ độ cao $h$:\n$$t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times 20}{10}} = \\sqrt{4} = 2\\text{ s}$$",
            "conceptTested": "Thả một vật rơi tự do từ độ cao $h = 20\\text{ m}$ ",
            "textbookRef": "KNTT Bài 10",
            "difficulty": "medium"
          },
          {
            "id": "b10-q4",
            "question": "Vận tốc chạm đất của vật ở câu trên là:",
            "options": [
              "$10\\text{ m/s}$",
              "$20\\text{ m/s}$",
              "$40\\text{ m/s}$",
              "$200\\text{ m/s}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Vận tốc chạm đất tính bằng công thức:\n$$v = gt = 10 \\times 2 = 20\\text{ m/s}$$\nHoặc: $v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 20} = 20\\text{ m/s}$.",
            "conceptTested": "Vận tốc chạm đất của vật ở câu trên là:",
            "textbookRef": "KNTT Bài 10",
            "difficulty": "medium"
          },
          {
            "id": "b10-q5",
            "question": "Tại cùng một địa điểm gần mặt đất, một viên bi chì nặng $500\\text{ g}$ và một viên bi nhôm nhẹ $50\\text{ g}$ được thả rơi tự do cùng lúc từ cùng một độ cao. Điều nào sau đây là đúng?",
            "options": [
              "Viên bi chì chạm đất trước vì nó nặng hơn.",
              "Viên bi nhôm chạm đất trước vì lực cản nhỏ hơn.",
              "Cả hai viên bi chạm đất cùng một thời điểm với cùng vận tốc.",
              "Vận tốc chạm đất của bi chì lớn gấp 10 lần bi nhôm."
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Trong sự rơi tự do, gia tốc trọng trường $g$ và thời gian rơi $t = \\sqrt{\\frac{2h}{g}}$ hoàn toàn không phụ thuộc vào khối lượng của vật. Do đó hai vật rơi cùng gia tốc và chạm đất cùng lúc.",
            "conceptTested": "Tại cùng một địa điểm gần mặt đất, một viên bi chì",
            "textbookRef": "KNTT Bài 10",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-11",
        "chapterId": "chuong-2",
        "lessonNum": 11,
        "number": 11,
        "title": "Thực hành: Đo gia tốc rơi tự do",
        "titleEn": "Thực hành: Đo gia tốc rơi tự do",
        "subtitle": "Bộ thí nghiệm đo gia tốc g với nam châm điện, cổng quang điện, đồng hồ đo số, phương pháp vẽ đồ thị s - t².",
        "subtitleEn": "Bộ thí nghiệm đo gia tốc g với nam châm điện, cổng quang điện, đồng hồ đo số, phương pháp vẽ đồ thị s - t².",
        "shortDesc": "Bộ thí nghiệm đo gia tốc g với nam châm điện, cổng quang điện, đồng hồ đo số, phương pháp vẽ đồ thị s - t².",
        "shortDescription": "Bộ thí nghiệm đo gia tốc g với nam châm điện, cổng quang điện, đồng hồ đo số, phương pháp vẽ đồ thị s - t².",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Phòng thí nghiệm: Đo Gia tốc Trọng trường g",
        "labTagEn": "Virtual Lab",
        "knttRef": "KNTT Bài 11",
        "ctstRef": "CTST Bài 11",
        "simulationId": "free-fall",
        "labType": "free_fall",
        "labTitle": "Phòng thí nghiệm: Đo Gia tốc Trọng trường g",
        "labDescription": "Tương tác điều chỉnh độ cao s của cổng quang điện, bấm nhả nam châm điện để đồng hồ MC964 tự động ghi nhận thời gian t và vẽ đồ thị s - t².",
        "virtualLabSpec": {
          "experimentName": "Phòng thí nghiệm: Đo Gia tốc Trọng trường g",
          "purpose": "Tương tác điều chỉnh độ cao s của cổng quang điện, bấm nhả nam châm điện để đồng hồ MC964 tự động ghi nhận thời gian t và vẽ đồ thị s - t².",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Bộ thí nghiệm đo gia tốc g với nam châm điện, cổng quang điện, đồng hồ đo số, phương pháp vẽ đồ thị s - t².",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": true,
          "experiment_id": 0,
          "labRoute": null
        },
        "sections": [
          {
            "title": "1. Mục đích và Dụng cụ thí nghiệm",
            "content": "### Mục đích:\nXác định gia tốc rơi tự do $g$ tại phòng thí nghiệm thông qua phép đo quãng đường rơi $s$ và thời gian rơi $t$.\n\n### Bộ dụng cụ bao gồm:\n1. Trụ đứng bằng hợp kim nhôm có gắn thước đo vạch chia đến milimet.\n2. Quả dọi định phương thẳng đứng.\n3. Nam châm điện gắn cố định ở đỉnh trụ để giữ và nhả viên bi thép khi ngắt điện.\n4. Cổng quang điện gắn trên giá có thể điều chỉnh vị trí dọc theo trụ.\n5. Đồng hồ đo thời gian hiện số MC964 cắm vào nam châm và cổng quang điện.\n6. Hộp hứng bi có xốp giảm chấn ở đáy.",
            "keyTakeaway": "Thí nghiệm đo gia tốc g sử dụng nam châm điện thả rơi bi thép qua cổng quang điện nối với đồng hồ MC964."
          },
          {
            "title": "2. Tiến trình đo đạc",
            "content": "1. Điều chỉnh trụ thẳng đứng bằng cách nhìn quả dọi.\n2. Gắn viên bi thép dính vào cực nam châm điện ở đỉnh.\n3. Đặt cổng quang điện ở vị trí cách vị trí bi thép thả rơi một đoạn $s$ (ví dụ: $s = 0{,}2\\text{ m}, 0{,}4\\text{ m}, 0{,}6\\text{ m}, 0{,}8\\text{ m}$).\n4. Cài đặt đồng hồ đo hiện số: Nhấn nút Reset về $0{,}000\\text{ s}$.\n5. Nhấn công tắc ngắt điện nam châm: Nam châm nhả bi đồng thời kích hoạt đồng hồ đếm thời gian. Khi bi đi qua cổng quang điện, chùm tia hồng ngoại bị chắn, đồng hồ tự động dừng lại. Đọc giá trị $t$.\n6. Lặp lại phép đo ít nhất 3 - 5 lần với mỗi độ cao để lấy giá trị thời gian trung bình $\\bar{t}$."
          },
          {
            "title": "3. Xử lí số liệu và Tính toán gia tốc $g$",
            "content": "Từ công thức rơi tự do:\n$$s = \\frac{1}{2}g t^2 \\implies g = \\frac{2s}{t^2}$$\n\n### Cách 1: Tính toán theo công thức trung bình\n* Tính gia tốc trung bình:\n$$\\bar{g} = \\frac{2\\bar{s}}{\\bar{t}^2}$$\n* Tính sai số tỉ đối:\n$$\\delta g = \\delta s + 2\\delta t = \\frac{\\Delta s}{\\bar{s}} + 2\\frac{\\Delta t}{\\bar{t}}$$\n* Tính sai số tuyệt đối: $\\Delta g = \\delta g \\cdot \\bar{g}$.\n* Ghi kết quả: $g = \\bar{g} \\pm \\Delta g \\quad (\\text{m/s}^2)$.\n\n### Cách 2: Phương pháp vẽ đồ thị $s - t^2$\n* Đặt $y = s$ và $x = t^2$. Phương trình có dạng đường thẳng $y = kx$ đi qua gốc toạ độ.\n* Hệ số góc của đường thẳng thực nghiệm:\n$$k = \\frac{1}{2}g \\implies g = 2k$$\nPhương pháp đồ thị giúp loại bỏ bớt sai số ngẫu nhiên một cách trực quan và khoa học.",
            "keyTakeaway": "Xác định gia tốc g: Tính trực tiếp g = 2s / t² hoặc suy ra từ hệ số góc k của đồ thị s theo t²: g = 2k.",
            "formulas": [
              {
                "name": "Gia tốc rơi tự do thực nghiệm",
                "latex": "g = \\frac{2s}{t^2}",
                "description": "Tính từ độ dịch chuyển thẳng đứng s và thời gian rơi t",
                "units": "m/s²"
              },
              {
                "name": "Hệ số góc đồ thị s - t²",
                "latex": "s = k \\cdot t^2 \\implies g = 2k",
                "description": "Xác định g thông qua độ dốc của đồ thị thực nghiệm"
              }
            ]
          }
        ],
        "theorySections": [
          {
            "title": "1. Mục đích và Dụng cụ thí nghiệm",
            "content": "### Mục đích:\nXác định gia tốc rơi tự do $g$ tại phòng thí nghiệm thông qua phép đo quãng đường rơi $s$ và thời gian rơi $t$.\n\n### Bộ dụng cụ bao gồm:\n1. Trụ đứng bằng hợp kim nhôm có gắn thước đo vạch chia đến milimet.\n2. Quả dọi định phương thẳng đứng.\n3. Nam châm điện gắn cố định ở đỉnh trụ để giữ và nhả viên bi thép khi ngắt điện.\n4. Cổng quang điện gắn trên giá có thể điều chỉnh vị trí dọc theo trụ.\n5. Đồng hồ đo thời gian hiện số MC964 cắm vào nam châm và cổng quang điện.\n6. Hộp hứng bi có xốp giảm chấn ở đáy.",
            "keyTakeaway": "Thí nghiệm đo gia tốc g sử dụng nam châm điện thả rơi bi thép qua cổng quang điện nối với đồng hồ MC964."
          },
          {
            "title": "2. Tiến trình đo đạc",
            "content": "1. Điều chỉnh trụ thẳng đứng bằng cách nhìn quả dọi.\n2. Gắn viên bi thép dính vào cực nam châm điện ở đỉnh.\n3. Đặt cổng quang điện ở vị trí cách vị trí bi thép thả rơi một đoạn $s$ (ví dụ: $s = 0{,}2\\text{ m}, 0{,}4\\text{ m}, 0{,}6\\text{ m}, 0{,}8\\text{ m}$).\n4. Cài đặt đồng hồ đo hiện số: Nhấn nút Reset về $0{,}000\\text{ s}$.\n5. Nhấn công tắc ngắt điện nam châm: Nam châm nhả bi đồng thời kích hoạt đồng hồ đếm thời gian. Khi bi đi qua cổng quang điện, chùm tia hồng ngoại bị chắn, đồng hồ tự động dừng lại. Đọc giá trị $t$.\n6. Lặp lại phép đo ít nhất 3 - 5 lần với mỗi độ cao để lấy giá trị thời gian trung bình $\\bar{t}$."
          },
          {
            "title": "3. Xử lí số liệu và Tính toán gia tốc $g$",
            "content": "Từ công thức rơi tự do:\n$$s = \\frac{1}{2}g t^2 \\implies g = \\frac{2s}{t^2}$$\n\n### Cách 1: Tính toán theo công thức trung bình\n* Tính gia tốc trung bình:\n$$\\bar{g} = \\frac{2\\bar{s}}{\\bar{t}^2}$$\n* Tính sai số tỉ đối:\n$$\\delta g = \\delta s + 2\\delta t = \\frac{\\Delta s}{\\bar{s}} + 2\\frac{\\Delta t}{\\bar{t}}$$\n* Tính sai số tuyệt đối: $\\Delta g = \\delta g \\cdot \\bar{g}$.\n* Ghi kết quả: $g = \\bar{g} \\pm \\Delta g \\quad (\\text{m/s}^2)$.\n\n### Cách 2: Phương pháp vẽ đồ thị $s - t^2$\n* Đặt $y = s$ và $x = t^2$. Phương trình có dạng đường thẳng $y = kx$ đi qua gốc toạ độ.\n* Hệ số góc của đường thẳng thực nghiệm:\n$$k = \\frac{1}{2}g \\implies g = 2k$$\nPhương pháp đồ thị giúp loại bỏ bớt sai số ngẫu nhiên một cách trực quan và khoa học.",
            "keyTakeaway": "Xác định gia tốc g: Tính trực tiếp g = 2s / t² hoặc suy ra từ hệ số góc k của đồ thị s theo t²: g = 2k.",
            "formulas": [
              {
                "name": "Gia tốc rơi tự do thực nghiệm",
                "latex": "g = \\frac{2s}{t^2}",
                "description": "Tính từ độ dịch chuyển thẳng đứng s và thời gian rơi t",
                "units": "m/s²"
              },
              {
                "name": "Hệ số góc đồ thị s - t²",
                "latex": "s = k \\cdot t^2 \\implies g = 2k",
                "description": "Xác định g thông qua độ dốc của đồ thị thực nghiệm"
              }
            ]
          }
        ],
        "summaryFormulas": [
          {
            "name": "Công thức tính g",
            "latex": "g = \\frac{2s}{t^2}"
          },
          {
            "name": "Sai số tỉ đối của g",
            "latex": "\\delta g = \\delta s + 2\\delta t"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Mục đích và Dụng cụ thí nghiệm",
              "content": "### Mục đích:\nXác định gia tốc rơi tự do $g$ tại phòng thí nghiệm thông qua phép đo quãng đường rơi $s$ và thời gian rơi $t$.\n\n### Bộ dụng cụ bao gồm:\n1. Trụ đứng bằng hợp kim nhôm có gắn thước đo vạch chia đến milimet.\n2. Quả dọi định phương thẳng đứng.\n3. Nam châm điện gắn cố định ở đỉnh trụ để giữ và nhả viên bi thép khi ngắt điện.\n4. Cổng quang điện gắn trên giá có thể điều chỉnh vị trí dọc theo trụ.\n5. Đồng hồ đo thời gian hiện số MC964 cắm vào nam châm và cổng quang điện.\n6. Hộp hứng bi có xốp giảm chấn ở đáy.",
              "keyTakeaway": "Thí nghiệm đo gia tốc g sử dụng nam châm điện thả rơi bi thép qua cổng quang điện nối với đồng hồ MC964."
            },
            {
              "num": 2,
              "heading": "2. Tiến trình đo đạc",
              "content": "1. Điều chỉnh trụ thẳng đứng bằng cách nhìn quả dọi.\n2. Gắn viên bi thép dính vào cực nam châm điện ở đỉnh.\n3. Đặt cổng quang điện ở vị trí cách vị trí bi thép thả rơi một đoạn $s$ (ví dụ: $s = 0{,}2\\text{ m}, 0{,}4\\text{ m}, 0{,}6\\text{ m}, 0{,}8\\text{ m}$).\n4. Cài đặt đồng hồ đo hiện số: Nhấn nút Reset về $0{,}000\\text{ s}$.\n5. Nhấn công tắc ngắt điện nam châm: Nam châm nhả bi đồng thời kích hoạt đồng hồ đếm thời gian. Khi bi đi qua cổng quang điện, chùm tia hồng ngoại bị chắn, đồng hồ tự động dừng lại. Đọc giá trị $t$.\n6. Lặp lại phép đo ít nhất 3 - 5 lần với mỗi độ cao để lấy giá trị thời gian trung bình $\\bar{t}$."
            },
            {
              "num": 3,
              "heading": "3. Xử lí số liệu và Tính toán gia tốc $g$",
              "content": "Từ công thức rơi tự do:\n$$s = \\frac{1}{2}g t^2 \\implies g = \\frac{2s}{t^2}$$\n\n### Cách 1: Tính toán theo công thức trung bình\n* Tính gia tốc trung bình:\n$$\\bar{g} = \\frac{2\\bar{s}}{\\bar{t}^2}$$\n* Tính sai số tỉ đối:\n$$\\delta g = \\delta s + 2\\delta t = \\frac{\\Delta s}{\\bar{s}} + 2\\frac{\\Delta t}{\\bar{t}}$$\n* Tính sai số tuyệt đối: $\\Delta g = \\delta g \\cdot \\bar{g}$.\n* Ghi kết quả: $g = \\bar{g} \\pm \\Delta g \\quad (\\text{m/s}^2)$.\n\n### Cách 2: Phương pháp vẽ đồ thị $s - t^2$\n* Đặt $y = s$ và $x = t^2$. Phương trình có dạng đường thẳng $y = kx$ đi qua gốc toạ độ.\n* Hệ số góc của đường thẳng thực nghiệm:\n$$k = \\frac{1}{2}g \\implies g = 2k$$\nPhương pháp đồ thị giúp loại bỏ bớt sai số ngẫu nhiên một cách trực quan và khoa học.",
              "keyTakeaway": "Xác định gia tốc g: Tính trực tiếp g = 2s / t² hoặc suy ra từ hệ số góc k của đồ thị s theo t²: g = 2k."
            }
          ],
          "ghiNho": "Thí nghiệm đo gia tốc g sử dụng nam châm điện thả rơi bi thép qua cổng quang điện nối với đồng hồ MC964. Xác định gia tốc g: Tính trực tiếp g = 2s / t² hoặc suy ra từ hệ số góc k của đồ thị s theo t²: g = 2k.",
          "part2_formulas": [
            {
              "formula": "g = \\frac{2s}{t^2}",
              "quantity": "Công thức tính g",
              "symbol": "g",
              "unit": "SI",
              "meaning": "Công thức tính g"
            },
            {
              "formula": "\\delta g = \\delta s + 2\\delta t",
              "quantity": "Sai số tỉ đối của g",
              "symbol": "\\delta g",
              "unit": "SI",
              "meaning": "Sai số tỉ đối của g"
            }
          ],
          "part3_applications": [
            "Ứng dụng các quy luật của Bài 11 trong đời sống và kĩ thuật thực tiễn.",
            "Phân tích hiện tượng thực nghiệm và thiết kế thiết bị kĩ thuật hiện đại."
          ]
        },
        "quizzes": [
          {
            "id": "b11-q1",
            "question": "Trong thí nghiệm thực hành đo gia tốc rơi tự do $g$, việc sử dụng nam châm điện giữ vật rơi có tác dụng gì quan trọng nhất?",
            "options": [
              "Làm tăng khối lượng của viên bi thép.",
              "Đảm bảo viên bi rơi không vận tốc ban đầu ($v_0 = 0$) và đồng bộ hóa thời điểm bắt đầu đếm thời gian.",
              "Hút hết bụi bẩn trong không khí xung quanh.",
              "Tạo ra từ trường làm bi rơi nhanh hơn."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Nam châm điện ngắt điện tức thì khi ấn nút nhả bi, triệt tiêu ngoại lực giữ để bi bắt đầu rơi chính xác với $v_0 = 0$, đồng thời kích hoạt đồng hồ đếm thời gian mà không bị rung giật tay.",
            "conceptTested": "Trong thí nghiệm thực hành đo gia tốc rơi tự do $g",
            "textbookRef": "KNTT Bài 11",
            "difficulty": "medium"
          },
          {
            "id": "b11-q2",
            "question": "Khi đo độ cao rơi $s = 0{,}800\\text{ m}$ và thời gian rơi $t = 0{,}404\\text{ s}$, giá trị gia tốc rơi tự do $g$ tính được xấp xỉ bằng:",
            "options": [
              "$9{,}80\\text{ m/s}^2$",
              "$9{,}83\\text{ m/s}^2$",
              "$10{,}0\\text{ m/s}^2$",
              "$8{,}90\\text{ m/s}^2$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Áp dụng công thức thực nghiệm:\n$$g = \\frac{2s}{t^2} = \\frac{2 \\times 0{,}800}{(0{,}404)^2} = \\frac{1{,}600}{0{,}163216} \\approx 9{,}80\\text{ m/s}^2$$",
            "conceptTested": "Khi đo độ cao rơi $s = 0{,}800\\text{ m}$ và thời g",
            "textbookRef": "KNTT Bài 11",
            "difficulty": "medium"
          },
          {
            "id": "b11-q3",
            "question": "Khi vẽ đồ thị biểu diễn mối liên hệ giữa quãng đường rơi $s$ và bình phương thời gian rơi $t^2$, đồ thị thu được có dạng:",
            "options": [
              "Đường Parabol đỉnh tại gốc toạ độ.",
              "Đường thẳng đi qua gốc toạ độ $O$.",
              "Đường Hyperbol tiệm cận hai trục.",
              "Đường thẳng nằm ngang song song trục hoành."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Vì $s = \\frac{1}{2}gt^2$, nếu đặt biến số $X = t^2$ thì $s = (\\frac{1}{2}g) X$. Đây là phương trình đường thẳng $y = kX$ đi qua gốc toạ độ với hệ số góc $k = \\frac{1}{2}g$.",
            "conceptTested": "Khi vẽ đồ thị biểu diễn mối liên hệ giữa quãng đườ",
            "textbookRef": "KNTT Bài 11",
            "difficulty": "medium"
          },
          {
            "id": "b11-q4",
            "question": "Đồ thị $s$ theo $t^2$ có hệ số góc xác định được từ thực nghiệm là $k = 4{,}9\\text{ m/s}^2$. Gia tốc rơi tự do suy ra từ đồ thị là:",
            "options": [
              "$4{,}9\\text{ m/s}^2$",
              "$9{,}8\\text{ m/s}^2$",
              "$2{,}45\\text{ m/s}^2$",
              "$19{,}6\\text{ m/s}^2$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Ta có hệ số góc $k = \\frac{1}{2}g \\implies g = 2k = 2 \\times 4{,}9 = 9{,}8\\text{ m/s}^2$.",
            "conceptTested": "Đồ thị $s$ theo $t^2$ có hệ số góc xác định được t",
            "textbookRef": "KNTT Bài 11",
            "difficulty": "medium"
          }
        ],
        "available": true
      },
      {
        "id": "bai-12",
        "chapterId": "chuong-2",
        "lessonNum": 12,
        "number": 12,
        "title": "Chuyển động ném",
        "titleEn": "Projectile Motion",
        "subtitle": "Phương pháp toạ độ phân tích chuyển động ném ngang trên Ox (đều) và Oy (rơi tự do), quỹ đạo parabol, tầm xa L, giới thiệu ném xiên.",
        "subtitleEn": "Decomposing 2D projectile motion into independent Ox and Oy components.",
        "shortDesc": "Phương pháp toạ độ phân tích chuyển động ném ngang trên Ox (đều) và Oy (rơi tự do), quỹ đạo parabol, tầm xa L, giới thiệu ném xiên.",
        "shortDescription": "Phương pháp toạ độ phân tích chuyển động ném ngang trên Ox (đều) và Oy (rơi tự do), quỹ đạo parabol, tầm xa L, giới thiệu ném xiên.",
        "chapterTitle": "ĐỘNG HỌC",
        "labTag": "Mô phỏng Ném ngang & Ném xiên 2D",
        "labTagEn": "Horizontal and Oblique Projectile Lab",
        "knttRef": "KNTT Bài 12 (Trang 50)",
        "ctstRef": "CTST Bài 9 (Trang 52)",
        "simulationId": "projectile-motion",
        "labType": "projectile",
        "labTitle": "Phòng thí nghiệm: Chuyển động Ném ngang & Ném xiên",
        "labDescription": "Tùy chỉnh độ cao ban đầu h, vận tốc ném v₀ và góc ném θ; quan sát quỹ đạo parabol và so sánh đồng thời với vật rơi tự do thả rơi từ cùng độ cao.",
        "virtualLabSpec": {
          "experimentName": "Phòng thí nghiệm: Chuyển động Ném ngang & Ném xiên",
          "purpose": "Tùy chỉnh độ cao ban đầu h, vận tốc ném v₀ và góc ném θ; quan sát quỹ đạo parabol và so sánh đồng thời với vật rơi tự do thả rơi từ cùng độ cao.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Phương pháp toạ độ phân tích chuyển động ném ngang trên Ox (đều) và Oy (rơi tự do), quỹ đạo parabol, tầm xa L, giới thiệu ném xiên.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 1,
          "labRoute": "/simulations/projectile-motion"
        },
        "sections": [
          {
            "title": "1. Chuyển động ném ngang",
            "content": "Chuyển động ném ngang là chuyển động của một vật được ném theo **phương nằm ngang** từ độ cao $h$ với vận tốc ban đầu $\\vec{v}_0$.\n\n### Phương pháp phân tích toạ độ (Phương pháp phân tích chuyển động):\nChọn hệ toạ độ $Oxy$:\n* Gốc $O$ tại vị trí ném.\n* Trục $Ox$ nằm ngang, cùng chiều với vận tốc ban đầu $\\vec{v}_0$.\n* Trục $Oy$ thẳng đứng hướng xuống dưới.\n* Gốc thời gian $t = 0$ là lúc bắt đầu ném.\n\nTa phân tích chuyển động ném ngang thành hai chuyển động thành phần độc lập trên hai trục toạ độ:\n1. **Theo phương ngang (trục $Ox$)**: Vật không chịu lực nào (bỏ qua cản không khí) $\\implies a_x = 0$.\n   Vật chuyển động **thẳng đều** với vận tốc không đổi $v_x = v_0$.\n2. **Theo phương thẳng đứng (trục $Oy$)**: Vật chỉ chịu tác dụng của trọng lực $\\implies a_y = g$.\n   Vật chuyển động **rơi tự do** với $v_{0y} = 0$.",
            "keyTakeaway": "Chuyển động ném ngang = Chuyển động thẳng đều theo phương ngang (Ox) + Chuyển động rơi tự do theo phương thẳng đứng (Oy)."
          },
          {
            "title": "2. Các phương trình của chuyển động ném ngang",
            "content": "### a) Phương trình vận tốc:\n* $v_x = v_0$\n* $v_y = gt$\n* Vận tốc toàn phần tại thời điểm $t$:\n$$v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{v_0^2 + (gt)^2}$$\nHướng của vectơ vận tốc hợp với phương ngang một góc $\\alpha$: $\\tan \\alpha = \\frac{v_y}{v_x} = \\frac{gt}{v_0}$.\n\n### b) Phương trình toạ độ:\n* $x = v_0 t$\n* $y = \\frac{1}{2}gt^2$\n\n### c) Phương trình quỹ đạo:\nRút $t = \\frac{x}{v_0}$ từ phương trình toạ độ $x$ thế vào phương trình $y$:\n$$y = \\frac{g}{2v_0^2} \\cdot x^2$$\nVì $g, v_0$ là hằng số nên phương trình quỹ đạo có dạng $y = ax^2$, chứng tỏ **quỹ đạo của chuyển động ném ngang là một nhánh của đường cong Parabol** đỉnh $O$.",
            "keyTakeaway": "Quỹ đạo ném ngang là đường Parabol: y = (g / 2v₀²) x².",
            "formulas": [
              {
                "name": "Phương trình toạ độ",
                "latex": "x = v_0 t, \\quad y = \\frac{1}{2}gt^2",
                "description": "Toạ độ vị trí vật ném ngang tại thời điểm t"
              },
              {
                "name": "Phương trình quỹ đạo Parabol",
                "latex": "y = \\frac{g}{2v_0^2} x^2",
                "description": "Phương trình quỹ đạo dạng parabol đỉnh O"
              },
              {
                "name": "Vận tốc toàn phần",
                "latex": "v = \\sqrt{v_0^2 + (gt)^2}",
                "description": "Tổng hợp vận tốc theo phương ngang và phương đứng",
                "units": "m/s"
              }
            ]
          },
          {
            "title": "3. Thời gian chuyển động và Tầm xa",
            "content": "Khi vật chạm đất thì toạ độ thẳng đứng $y = h$ (độ cao ban đầu).\n\n### a) Thời gian chuyển động ($t$):\n$$h = \\frac{1}{2}gt^2 \\implies t = \\sqrt{\\frac{2h}{g}}$$\n* **Kết luận quan trọng**: Thời gian rơi của vật ném ngang chỉ phụ thuộc vào độ cao $h$ và gia tốc $g$, **hoàn toàn không phụ thuộc vào vận tốc ném $v_0$**.\n* Nếu từ cùng một độ cao, ta đồng thời ném ngang một vật và thả rơi tự do một vật khác thì cả hai vật sẽ **chạm đất cùng một thời điểm**!\n\n### b) Tầm xa ($L = x_{\\max}$):\nLà khoảng cách xa nhất theo phương ngang mà vật đạt được khi chạm đất:\n$$L = x_{\\max} = v_0 \\cdot t = v_0 \\sqrt{\\frac{2h}{g}}$$\nTầm xa tỉ lệ thuận với vận tốc ban đầu $v_0$ và căn bậc hai của độ cao $h$.",
            "keyTakeaway": "Thời gian rơi t = √(2h/g) giống hệt rơi tự do! Tầm xa: L = v₀ √(2h/g).",
            "formulas": [
              {
                "name": "Thời gian chuyển động",
                "latex": "t = \\sqrt{\\frac{2h}{g}}",
                "description": "Thời gian bay đến khi chạm đất",
                "units": "s"
              },
              {
                "name": "Tầm xa cực đại",
                "latex": "L = v_0 \\sqrt{\\frac{2h}{g}}",
                "description": "Khoảng cách bay xa nhất theo phương ngang",
                "units": "m"
              }
            ]
          },
          {
            "title": "4. Giới thiệu Chuyển động ném xiên",
            "content": "Khi vật được ném với góc nghiêng $\\theta$ so với mặt phẳng ngang:\n* Vận tốc ban đầu phân tích thành:\n  * $v_{0x} = v_0 \\cos \\theta$\n  * $v_{0y} = v_0 \\sin \\theta$\n* Trên trục $Ox$: Chuyển động thẳng đều với $x = (v_0 \\cos \\theta) t$.\n* Trên trục $Oy$: Chuyển động biến đổi đều ngược chiều $g$ với $y = (v_0 \\sin \\theta) t - \\frac{1}{2}gt^2$.\n* Tầm bay cao cực đại: $H = \\frac{v_0^2 \\sin^2 \\theta}{2g}$.\n* Tầm bay xa trên mặt đất bằng: $L = \\frac{v_0^2 \\sin(2\\theta)}{g}$ (đạt cực đại khi góc ném $\\theta = 45^\\circ$)."
          }
        ],
        "theorySections": [
          {
            "title": "1. Chuyển động ném ngang",
            "content": "Chuyển động ném ngang là chuyển động của một vật được ném theo **phương nằm ngang** từ độ cao $h$ với vận tốc ban đầu $\\vec{v}_0$.\n\n### Phương pháp phân tích toạ độ (Phương pháp phân tích chuyển động):\nChọn hệ toạ độ $Oxy$:\n* Gốc $O$ tại vị trí ném.\n* Trục $Ox$ nằm ngang, cùng chiều với vận tốc ban đầu $\\vec{v}_0$.\n* Trục $Oy$ thẳng đứng hướng xuống dưới.\n* Gốc thời gian $t = 0$ là lúc bắt đầu ném.\n\nTa phân tích chuyển động ném ngang thành hai chuyển động thành phần độc lập trên hai trục toạ độ:\n1. **Theo phương ngang (trục $Ox$)**: Vật không chịu lực nào (bỏ qua cản không khí) $\\implies a_x = 0$.\n   Vật chuyển động **thẳng đều** với vận tốc không đổi $v_x = v_0$.\n2. **Theo phương thẳng đứng (trục $Oy$)**: Vật chỉ chịu tác dụng của trọng lực $\\implies a_y = g$.\n   Vật chuyển động **rơi tự do** với $v_{0y} = 0$.",
            "keyTakeaway": "Chuyển động ném ngang = Chuyển động thẳng đều theo phương ngang (Ox) + Chuyển động rơi tự do theo phương thẳng đứng (Oy)."
          },
          {
            "title": "2. Các phương trình của chuyển động ném ngang",
            "content": "### a) Phương trình vận tốc:\n* $v_x = v_0$\n* $v_y = gt$\n* Vận tốc toàn phần tại thời điểm $t$:\n$$v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{v_0^2 + (gt)^2}$$\nHướng của vectơ vận tốc hợp với phương ngang một góc $\\alpha$: $\\tan \\alpha = \\frac{v_y}{v_x} = \\frac{gt}{v_0}$.\n\n### b) Phương trình toạ độ:\n* $x = v_0 t$\n* $y = \\frac{1}{2}gt^2$\n\n### c) Phương trình quỹ đạo:\nRút $t = \\frac{x}{v_0}$ từ phương trình toạ độ $x$ thế vào phương trình $y$:\n$$y = \\frac{g}{2v_0^2} \\cdot x^2$$\nVì $g, v_0$ là hằng số nên phương trình quỹ đạo có dạng $y = ax^2$, chứng tỏ **quỹ đạo của chuyển động ném ngang là một nhánh của đường cong Parabol** đỉnh $O$.",
            "keyTakeaway": "Quỹ đạo ném ngang là đường Parabol: y = (g / 2v₀²) x².",
            "formulas": [
              {
                "name": "Phương trình toạ độ",
                "latex": "x = v_0 t, \\quad y = \\frac{1}{2}gt^2",
                "description": "Toạ độ vị trí vật ném ngang tại thời điểm t"
              },
              {
                "name": "Phương trình quỹ đạo Parabol",
                "latex": "y = \\frac{g}{2v_0^2} x^2",
                "description": "Phương trình quỹ đạo dạng parabol đỉnh O"
              },
              {
                "name": "Vận tốc toàn phần",
                "latex": "v = \\sqrt{v_0^2 + (gt)^2}",
                "description": "Tổng hợp vận tốc theo phương ngang và phương đứng",
                "units": "m/s"
              }
            ]
          },
          {
            "title": "3. Thời gian chuyển động và Tầm xa",
            "content": "Khi vật chạm đất thì toạ độ thẳng đứng $y = h$ (độ cao ban đầu).\n\n### a) Thời gian chuyển động ($t$):\n$$h = \\frac{1}{2}gt^2 \\implies t = \\sqrt{\\frac{2h}{g}}$$\n* **Kết luận quan trọng**: Thời gian rơi của vật ném ngang chỉ phụ thuộc vào độ cao $h$ và gia tốc $g$, **hoàn toàn không phụ thuộc vào vận tốc ném $v_0$**.\n* Nếu từ cùng một độ cao, ta đồng thời ném ngang một vật và thả rơi tự do một vật khác thì cả hai vật sẽ **chạm đất cùng một thời điểm**!\n\n### b) Tầm xa ($L = x_{\\max}$):\nLà khoảng cách xa nhất theo phương ngang mà vật đạt được khi chạm đất:\n$$L = x_{\\max} = v_0 \\cdot t = v_0 \\sqrt{\\frac{2h}{g}}$$\nTầm xa tỉ lệ thuận với vận tốc ban đầu $v_0$ và căn bậc hai của độ cao $h$.",
            "keyTakeaway": "Thời gian rơi t = √(2h/g) giống hệt rơi tự do! Tầm xa: L = v₀ √(2h/g).",
            "formulas": [
              {
                "name": "Thời gian chuyển động",
                "latex": "t = \\sqrt{\\frac{2h}{g}}",
                "description": "Thời gian bay đến khi chạm đất",
                "units": "s"
              },
              {
                "name": "Tầm xa cực đại",
                "latex": "L = v_0 \\sqrt{\\frac{2h}{g}}",
                "description": "Khoảng cách bay xa nhất theo phương ngang",
                "units": "m"
              }
            ]
          },
          {
            "title": "4. Giới thiệu Chuyển động ném xiên",
            "content": "Khi vật được ném với góc nghiêng $\\theta$ so với mặt phẳng ngang:\n* Vận tốc ban đầu phân tích thành:\n  * $v_{0x} = v_0 \\cos \\theta$\n  * $v_{0y} = v_0 \\sin \\theta$\n* Trên trục $Ox$: Chuyển động thẳng đều với $x = (v_0 \\cos \\theta) t$.\n* Trên trục $Oy$: Chuyển động biến đổi đều ngược chiều $g$ với $y = (v_0 \\sin \\theta) t - \\frac{1}{2}gt^2$.\n* Tầm bay cao cực đại: $H = \\frac{v_0^2 \\sin^2 \\theta}{2g}$.\n* Tầm bay xa trên mặt đất bằng: $L = \\frac{v_0^2 \\sin(2\\theta)}{g}$ (đạt cực đại khi góc ném $\\theta = 45^\\circ$)."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Thời gian ném ngang",
            "latex": "t = \\sqrt{\\frac{2h}{g}}"
          },
          {
            "name": "Tầm xa ném ngang",
            "latex": "L = v_0 \\sqrt{\\frac{2h}{g}}"
          },
          {
            "name": "Quỹ đạo ném ngang",
            "latex": "y = \\frac{g}{2v_0^2}x^2"
          },
          {
            "name": "Tầm xa ném xiên (mặt bằng)",
            "latex": "L = \\frac{v_0^2 \\sin 2\\theta}{g}"
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Chuyển động ném ngang",
              "content": "Chuyển động ném ngang là chuyển động của một vật được ném theo **phương nằm ngang** từ độ cao $h$ với vận tốc ban đầu $\\vec{v}_0$.\n\n### Phương pháp phân tích toạ độ (Phương pháp phân tích chuyển động):\nChọn hệ toạ độ $Oxy$:\n* Gốc $O$ tại vị trí ném.\n* Trục $Ox$ nằm ngang, cùng chiều với vận tốc ban đầu $\\vec{v}_0$.\n* Trục $Oy$ thẳng đứng hướng xuống dưới.\n* Gốc thời gian $t = 0$ là lúc bắt đầu ném.\n\nTa phân tích chuyển động ném ngang thành hai chuyển động thành phần độc lập trên hai trục toạ độ:\n1. **Theo phương ngang (trục $Ox$)**: Vật không chịu lực nào (bỏ qua cản không khí) $\\implies a_x = 0$.\n   Vật chuyển động **thẳng đều** với vận tốc không đổi $v_x = v_0$.\n2. **Theo phương thẳng đứng (trục $Oy$)**: Vật chỉ chịu tác dụng của trọng lực $\\implies a_y = g$.\n   Vật chuyển động **rơi tự do** với $v_{0y} = 0$.",
              "keyTakeaway": "Chuyển động ném ngang = Chuyển động thẳng đều theo phương ngang (Ox) + Chuyển động rơi tự do theo phương thẳng đứng (Oy)."
            },
            {
              "num": 2,
              "heading": "2. Các phương trình của chuyển động ném ngang",
              "content": "### a) Phương trình vận tốc:\n* $v_x = v_0$\n* $v_y = gt$\n* Vận tốc toàn phần tại thời điểm $t$:\n$$v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{v_0^2 + (gt)^2}$$\nHướng của vectơ vận tốc hợp với phương ngang một góc $\\alpha$: $\\tan \\alpha = \\frac{v_y}{v_x} = \\frac{gt}{v_0}$.\n\n### b) Phương trình toạ độ:\n* $x = v_0 t$\n* $y = \\frac{1}{2}gt^2$\n\n### c) Phương trình quỹ đạo:\nRút $t = \\frac{x}{v_0}$ từ phương trình toạ độ $x$ thế vào phương trình $y$:\n$$y = \\frac{g}{2v_0^2} \\cdot x^2$$\nVì $g, v_0$ là hằng số nên phương trình quỹ đạo có dạng $y = ax^2$, chứng tỏ **quỹ đạo của chuyển động ném ngang là một nhánh của đường cong Parabol** đỉnh $O$.",
              "keyTakeaway": "Quỹ đạo ném ngang là đường Parabol: y = (g / 2v₀²) x²."
            },
            {
              "num": 3,
              "heading": "3. Thời gian chuyển động và Tầm xa",
              "content": "Khi vật chạm đất thì toạ độ thẳng đứng $y = h$ (độ cao ban đầu).\n\n### a) Thời gian chuyển động ($t$):\n$$h = \\frac{1}{2}gt^2 \\implies t = \\sqrt{\\frac{2h}{g}}$$\n* **Kết luận quan trọng**: Thời gian rơi của vật ném ngang chỉ phụ thuộc vào độ cao $h$ và gia tốc $g$, **hoàn toàn không phụ thuộc vào vận tốc ném $v_0$**.\n* Nếu từ cùng một độ cao, ta đồng thời ném ngang một vật và thả rơi tự do một vật khác thì cả hai vật sẽ **chạm đất cùng một thời điểm**!\n\n### b) Tầm xa ($L = x_{\\max}$):\nLà khoảng cách xa nhất theo phương ngang mà vật đạt được khi chạm đất:\n$$L = x_{\\max} = v_0 \\cdot t = v_0 \\sqrt{\\frac{2h}{g}}$$\nTầm xa tỉ lệ thuận với vận tốc ban đầu $v_0$ và căn bậc hai của độ cao $h$.",
              "keyTakeaway": "Thời gian rơi t = √(2h/g) giống hệt rơi tự do! Tầm xa: L = v₀ √(2h/g)."
            },
            {
              "num": 4,
              "heading": "4. Giới thiệu Chuyển động ném xiên",
              "content": "Khi vật được ném với góc nghiêng $\\theta$ so với mặt phẳng ngang:\n* Vận tốc ban đầu phân tích thành:\n  * $v_{0x} = v_0 \\cos \\theta$\n  * $v_{0y} = v_0 \\sin \\theta$\n* Trên trục $Ox$: Chuyển động thẳng đều với $x = (v_0 \\cos \\theta) t$.\n* Trên trục $Oy$: Chuyển động biến đổi đều ngược chiều $g$ với $y = (v_0 \\sin \\theta) t - \\frac{1}{2}gt^2$.\n* Tầm bay cao cực đại: $H = \\frac{v_0^2 \\sin^2 \\theta}{2g}$.\n* Tầm bay xa trên mặt đất bằng: $L = \\frac{v_0^2 \\sin(2\\theta)}{g}$ (đạt cực đại khi góc ném $\\theta = 45^\\circ$)."
            }
          ],
          "ghiNho": "Ghi nhớ: Quỹ đạo chuyển động ném là một đường parabol. Chuyển động ngang luôn là chuyển động thẳng đều.",
          "part2_formulas": [
            {
              "formula": "L = \\frac{v_0^2\\sin(2\\alpha)}{g}",
              "quantity": "Tầm xa ném xiên",
              "symbol": "L",
              "unit": "m",
              "meaning": "Khoảng cách ngang xa nhất vật bay được trước khi chạm đất bằng."
            },
            {
              "formula": "H = \\frac{v_0^2\\sin^2\\alpha}{2g}",
              "quantity": "Tầm cao cực đại",
              "symbol": "H",
              "unit": "m",
              "meaning": "Độ cao lớn nhất so với mặt đất tại đỉnh parabol."
            }
          ],
          "part3_applications": [
            "Vận động viên ném bóng rổ hoặc đẩy tạ chọn góc ném tối ưu khoảng 40° - 45° để đạt thành tích xa nhất.",
            "Tính toán góc bắn của vòi cứu hỏa dập tắt đám cháy ở nhà cao tầng."
          ]
        },
        "quizzes": [
          {
            "id": "b12-q1",
            "question": "Quỹ đạo của vật chuyển động ném ngang có dạng đường gì?",
            "questionEn": "In horizontal projectile motion, the motion component along horizontal Ox is:",
            "options": [
              "Đường tròn",
              "Đường thẳng xiên góc",
              "Nhánh của đường cong Parabol",
              "Đường xoắn ốc"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Phương trình quỹ đạo của vật ném ngang có dạng $y = \\frac{g}{2v_0^2}x^2$. Đây là phương trình hàm bậc hai nên quỹ đạo là một nhánh đường cong **Parabol** có đỉnh tại điểm ném.",
            "conceptTested": "Thành phần chuyển động ngang",
            "textbookRef": "KNTT Bài 12 (Trang 51)",
            "difficulty": "medium"
          },
          {
            "id": "b12-q2",
            "question": "Thời gian chuyển động của một vật ném ngang từ độ cao $h$ phụ thuộc vào yếu tố nào?",
            "questionEn": "The trajectory of a projectile ignoring air resistance is:",
            "options": [
              "Chỉ phụ thuộc vào độ cao $h$ và gia tốc $g$, không phụ thuộc vào vận tốc ném $v_0$.",
              "Chỉ phụ thuộc vào vận tốc ném $v_0$.",
              "Phụ thuộc vào khối lượng của vật.",
              "Phụ thuộc vào kích thước của vật."
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Theo phương thẳng đứng, vật chuyển động rơi tự do với gia tốc $g$, do đó thời gian chuyển động tới khi chạm đất là $t = \\sqrt{\\frac{2h}{g}}$. Thời gian này hoàn toàn độc lập với vận tốc ném theo phương ngang $v_0$.",
            "conceptTested": "Dạng quỹ đạo ném",
            "textbookRef": "KNTT Bài 12 (Trang 52)",
            "difficulty": "medium"
          },
          {
            "id": "b12-q3",
            "question": "Một vật được ném ngang từ độ cao $h = 45\\text{ m}$ với vận tốc ban đầu $v_0 = 20\\text{ m/s}$. Lấy $g = 10\\text{ m/s}^2$. Tầm bay xa của vật khi chạm đất là:",
            "questionEn": "Object A is launched horizontally and object B is dropped from the same height h. Their fall times satisfy:",
            "options": [
              "$30\\text{ m}$",
              "$60\\text{ m}$",
              "$90\\text{ m}$",
              "$45\\text{ m}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Thời gian bay của vật:\n$$t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times 45}{10}} = \\sqrt{9} = 3\\text{ s}$$\nTầm bay xa theo phương ngang:\n$$L = v_0 \\cdot t = 20 \\times 3 = 60\\text{ m}$$",
            "conceptTested": "Thí nghiệm hai viên bi đồng thời chạm đất",
            "textbookRef": "KNTT Bài 12 (Trang 52)",
            "difficulty": "medium"
          },
          {
            "id": "b12-q4",
            "question": "Từ cùng một độ cao $h$, đồng thời ném ngang vật A và thả rơi tự do vật B (bỏ qua sức cản không khí). Hiện tượng nào sau đây xảy ra?",
            "questionEn": "At what launch angle α is the horizontal projectile range maximized?",
            "options": [
              "Vật B rơi chạm đất trước vật A.",
              "Vật A chạm đất trước vật B.",
              "Cả hai vật A và B chạm đất cùng một thời điểm.",
              "Vật nào có khối lượng lớn hơn sẽ chạm đất trước."
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Vì chuyển động theo phương thẳng đứng của cả hai vật đều là rơi tự do không vận tốc ban đầu với gia tốc $g$, thời gian chạm đất của cả hai vật đều bằng $t = \\sqrt{\\frac{2h}{g}}$, nên cả hai chạm đất cùng lúc.",
            "conceptTested": "Góc ném cực đại tầm xa",
            "textbookRef": "KNTT Bài 12 (Trang 53)",
            "difficulty": "medium"
          },
          {
            "id": "b12-q5",
            "question": "Trong chuyển động ném xiên trên mặt đất bằng, để tầm bay xa $L$ đạt giá trị lớn nhất (với cùng vận tốc ban đầu $v_0$), góc ném $\\theta$ phải bằng:",
            "questionEn": "At the peak of a projectile trajectory, the velocity:",
            "options": [
              "$30^\\circ$",
              "$45^\\circ$",
              "$60^\\circ$",
              "$90^\\circ$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Công thức tầm xa ném xiên: $L = \\frac{v_0^2 \\sin(2\\theta)}{g}$. Tầm xa đạt cực đại khi $\\sin(2\\theta) = 1 \\implies 2\\theta = 90^\\circ \\implies \\theta = 45^\\circ$.",
            "conceptTested": "Vận tốc tại đỉnh parabol",
            "textbookRef": "KNTT Bài 12 (Trang 53)",
            "difficulty": "medium"
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuong-3",
    "number": 3,
    "romanNumeral": "III",
    "title": "ĐỘNG LỰC HỌC",
    "titleEn": "DYNAMICS",
    "description": "Tổng hợp và phân tích lực, ba định luật Newton về chuyển động và các ứng dụng trong thực tiễn.",
    "lessons": [
      {
        "id": "bai-13",
        "chapterId": "chuong-3",
        "lessonNum": 13,
        "number": 13,
        "title": "Tổng hợp và phân tích lực. Cân bằng lực",
        "titleEn": "Vector Addition and Resolution of Forces. Equilibrium",
        "subtitle": "Quy tắc hình bình hành, điều kiện cân bằng của chất điểm dưới tác dụng của nhiều lực.",
        "subtitleEn": "Parallelogram rule, equilibrium conditions of a point mass under multiple concurrent forces.",
        "shortDesc": "Quy tắc hình bình hành, điều kiện cân bằng của chất điểm dưới tác dụng của nhiều lực.",
        "shortDescription": "Quy tắc hình bình hành, điều kiện cân bằng của chất điểm dưới tác dụng của nhiều lực.",
        "chapterTitle": "ĐỘNG LỰC HỌC",
        "labTag": "Mô phỏng Bàn tròn Đồng quy & Phân tích Lực",
        "labTagEn": "Concurrent Force Table Simulation & Force Resolution",
        "knttRef": "KNTT Bài 13 (Trang 56)",
        "ctstRef": "CTST Bài 13 (Trang 80)",
        "simulationId": "newton-dynamics",
        "labType": "vector",
        "labTitle": "Mô phỏng Bàn tròn Đồng quy & Phân tích Lực",
        "labDescription": "Khám phá tổng hợp lực đồng quy và cân bằng lực trên hệ tọa độ trực giao.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Bàn tròn Đồng quy & Phân tích Lực",
          "purpose": "Khám phá tổng hợp lực đồng quy và cân bằng lực trên hệ tọa độ trực giao.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Quy tắc hình bình hành, điều kiện cân bằng của chất điểm dưới tác dụng của nhiều lực.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 2,
          "labRoute": "/simulations/newton-dynamics"
        },
        "sections": [
          {
            "title": "1. Tổng hợp lực và Quy tắc hình bình hành",
            "content": "Tổng hợp lực là thay thế nhiều lực tác dụng đồng thời vào một vật bằng một lực duy nhất có tác dụng tương đương. Lực thay thế này gọi là **hợp lực**.\n\nBiểu thức vectơ: $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$.\n\nĐộ lớn của hợp lực tính theo công thức:\n$$F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2 \\cos \\alpha}$$\n* Khi $\\alpha = 0^\\circ$ (cùng hướng): $F_{\\max} = F_1 + F_2$.\n* Khi $\\alpha = 180^\\circ$ (ngược hướng): $F_{\\min} = |F_1 - F_2|$.\n* Khi $\\alpha = 90^\\circ$ (vuông góc): $F = \\sqrt{F_1^2 + F_2^2}$.\n* Tổng quát: $|F_1 - F_2| \\le F \\le F_1 + F_2$.",
            "keyTakeaway": "Hợp lực của hai lực đồng quy tuân theo quy tắc hình bình hành và có độ lớn nằm trong khoảng [|F1 - F2|, F1 + F2]."
          },
          {
            "title": "2. Phân tích lực",
            "content": "Phân tích lực là phép thay thế một lực bằng hai hay nhiều lực thành phần có tác dụng giống hệt như lực đó. Thường phân tích lực theo hai trục tọa độ vuông góc $Ox$ và $Oy$:\n* $F_x = F \\cdot \\cos \\alpha$\n* $F_y = F \\cdot \\sin \\alpha$",
            "keyTakeaway": "Phân tích lực là phép toán ngược lại với tổng hợp lực, thường chiếu lên hai trục vuông góc Ox và Oy."
          },
          {
            "title": "3. Điều kiện cân bằng của chất điểm",
            "content": "Muốn cho một chất điểm đứng cân bằng thì hợp lực của các lực tác dụng lên nó phải bằng không:\n$$\\vec{F}_{hl} = \\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n = \\vec{0}$$",
            "keyTakeaway": "Điều kiện cân bằng chất điểm: Tổng các vectơ lực tác dụng lên vật bằng vectơ không."
          }
        ],
        "theorySections": [
          {
            "title": "1. Tổng hợp lực và Quy tắc hình bình hành",
            "content": "Tổng hợp lực là thay thế nhiều lực tác dụng đồng thời vào một vật bằng một lực duy nhất có tác dụng tương đương. Lực thay thế này gọi là **hợp lực**.\n\nBiểu thức vectơ: $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$.\n\nĐộ lớn của hợp lực tính theo công thức:\n$$F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2 \\cos \\alpha}$$\n* Khi $\\alpha = 0^\\circ$ (cùng hướng): $F_{\\max} = F_1 + F_2$.\n* Khi $\\alpha = 180^\\circ$ (ngược hướng): $F_{\\min} = |F_1 - F_2|$.\n* Khi $\\alpha = 90^\\circ$ (vuông góc): $F = \\sqrt{F_1^2 + F_2^2}$.\n* Tổng quát: $|F_1 - F_2| \\le F \\le F_1 + F_2$.",
            "keyTakeaway": "Hợp lực của hai lực đồng quy tuân theo quy tắc hình bình hành và có độ lớn nằm trong khoảng [|F1 - F2|, F1 + F2]."
          },
          {
            "title": "2. Phân tích lực",
            "content": "Phân tích lực là phép thay thế một lực bằng hai hay nhiều lực thành phần có tác dụng giống hệt như lực đó. Thường phân tích lực theo hai trục tọa độ vuông góc $Ox$ và $Oy$:\n* $F_x = F \\cdot \\cos \\alpha$\n* $F_y = F \\cdot \\sin \\alpha$",
            "keyTakeaway": "Phân tích lực là phép toán ngược lại với tổng hợp lực, thường chiếu lên hai trục vuông góc Ox và Oy."
          },
          {
            "title": "3. Điều kiện cân bằng của chất điểm",
            "content": "Muốn cho một chất điểm đứng cân bằng thì hợp lực của các lực tác dụng lên nó phải bằng không:\n$$\\vec{F}_{hl} = \\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n = \\vec{0}$$",
            "keyTakeaway": "Điều kiện cân bằng chất điểm: Tổng các vectơ lực tác dụng lên vật bằng vectơ không."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Độ lớn hợp lực",
            "latex": "F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2 \\cos \\alpha}",
            "unit": "Newton (N)",
            "notes": "Độ lớn lực tổng hợp của hai lực F1 và F2 hợp với nhau góc alpha."
          },
          {
            "name": "Điều kiện cân bằng lực",
            "latex": "\\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n = \\vec{0}",
            "unit": "Newton (N)",
            "notes": "Hợp lực của tất cả các lực tác dụng lên chất điểm triệt tiêu nhau."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Tổng hợp lực và Quy tắc hình bình hành",
              "content": "Tổng hợp lực là thay thế nhiều lực tác dụng đồng thời vào một vật bằng một lực duy nhất có tác dụng tương đương. Lực thay thế này gọi là **hợp lực**.\n\nBiểu thức vectơ: $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$.\n\nĐộ lớn của hợp lực tính theo công thức:\n$$F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2 \\cos \\alpha}$$\n* Khi $\\alpha = 0^\\circ$ (cùng hướng): $F_{\\max} = F_1 + F_2$.\n* Khi $\\alpha = 180^\\circ$ (ngược hướng): $F_{\\min} = |F_1 - F_2|$.\n* Khi $\\alpha = 90^\\circ$ (vuông góc): $F = \\sqrt{F_1^2 + F_2^2}$.\n* Tổng quát: $|F_1 - F_2| \\le F \\le F_1 + F_2$.",
              "keyTakeaway": "Hợp lực của hai lực đồng quy tuân theo quy tắc hình bình hành và có độ lớn nằm trong khoảng [|F1 - F2|, F1 + F2]."
            },
            {
              "num": 2,
              "heading": "2. Phân tích lực",
              "content": "Phân tích lực là phép thay thế một lực bằng hai hay nhiều lực thành phần có tác dụng giống hệt như lực đó. Thường phân tích lực theo hai trục tọa độ vuông góc $Ox$ và $Oy$:\n* $F_x = F \\cdot \\cos \\alpha$\n* $F_y = F \\cdot \\sin \\alpha$",
              "keyTakeaway": "Phân tích lực là phép toán ngược lại với tổng hợp lực, thường chiếu lên hai trục vuông góc Ox và Oy."
            },
            {
              "num": 3,
              "heading": "3. Điều kiện cân bằng của chất điểm",
              "content": "Muốn cho một chất điểm đứng cân bằng thì hợp lực của các lực tác dụng lên nó phải bằng không:\n$$\\vec{F}_{hl} = \\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n = \\vec{0}$$",
              "keyTakeaway": "Điều kiện cân bằng chất điểm: Tổng các vectơ lực tác dụng lên vật bằng vectơ không."
            }
          ],
          "ghiNho": "Hợp lực của hai lực đồng quy tuân theo quy tắc hình bình hành và có độ lớn nằm trong khoảng [|F1 - F2|, F1 + F2]. Phân tích lực là phép toán ngược lại với tổng hợp lực, thường chiếu lên hai trục vuông góc Ox và Oy. Điều kiện cân bằng chất điểm: Tổng các vectơ lực tác dụng lên vật bằng vectơ không.",
          "part2_formulas": [
            {
              "formula": "F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2 \\cos \\alpha}",
              "quantity": "Độ lớn hợp lực",
              "symbol": "F",
              "unit": "Newton (N)",
              "meaning": "Độ lớn lực tổng hợp của hai lực F1 và F2 hợp với nhau góc alpha."
            },
            {
              "formula": "\\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n = \\vec{0}",
              "quantity": "Điều kiện cân bằng lực",
              "symbol": "\\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n",
              "unit": "Newton (N)",
              "meaning": "Hợp lực của tất cả các lực tác dụng lên chất điểm triệt tiêu nhau."
            }
          ],
          "part3_applications": [
            "Thiết kế dây văng của cầu treo: các sợi dây cáp phân bố lực căng để giữ dầm cầu cân bằng ổn định.",
            "Kĩ thuật neo thuyền và giàn khoan ngoài khơi bằng nhiều dây neo đa hướng."
          ]
        },
        "quizzes": [
          {
            "id": "b13-q1",
            "question": "Hai lực đồng quy có độ lớn $F_1 = 6\\text{ N}$ và $F_2 = 8\\text{ N}$ vuông góc với nhau. Độ lớn của hợp lực là:",
            "questionEn": "Two concurrent perpendicular forces have magnitudes F1 = 6 N and F2 = 8 N. The resultant force is:",
            "options": [
              "14 N",
              "10 N",
              "2 N",
              "48 N"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Vì hai lực vuông góc $(\\alpha = 90^\\circ)$ nên $F = \\sqrt{F_1^2 + F_2^2} = \\sqrt{6^2 + 8^2} = 10\\text{ N}$.",
            "conceptTested": "Tổng hợp hai lực vuông góc",
            "textbookRef": "KNTT Bài 13 (Trang 57)"
          },
          {
            "id": "b13-q2",
            "question": "Cho hai lực đồng quy có độ lớn $F_1 = 10\\text{ N}$ và $F_2 = 15\\text{ N}$. Hợp lực của chúng KHÔNG THỂ nhận giá trị nào sau đây?",
            "questionEn": "For two concurrent forces F1 = 10 N and F2 = 15 N, which of the following CANNOT be their resultant force?",
            "options": [
              "5 N",
              "12 N",
              "25 N",
              "30 N"
            ],
            "correctIndex": 3,
            "correctAnswer": 3,
            "explanation": "Độ lớn hợp lực thỏa mãn: $|F_1 - F_2| \\le F \\le F_1 + F_2 \\iff 5\\text{ N} \\le F \\le 25\\text{ N}$. Do đó giá trị 30 N không thể xảy ra.",
            "conceptTested": "Giới hạn độ lớn hợp lực",
            "textbookRef": "KNTT Bài 13 (Trang 58)"
          },
          {
            "id": "b13-q3",
            "question": "Điều kiện cân bằng của một chất điểm chịu tác dụng của nhiều lực là:",
            "questionEn": "The equilibrium condition for a particle subjected to multiple forces is:",
            "options": [
              "Tổng độ lớn của các lực phải bằng 0.",
              "Vectơ hợp lực của tất cả các lực tác dụng phải bằng vectơ không.",
              "Các lực tác dụng phải có độ lớn đôi một bằng nhau.",
              "Các lực phải có cùng phương và cùng chiều."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Điều kiện cân bằng của chất điểm: $\\sum \\vec{F} = \\vec{0}$.",
            "conceptTested": "Điều kiện cân bằng chất điểm",
            "textbookRef": "KNTT Bài 13 (Trang 59)"
          },
          {
            "id": "b13-q4",
            "question": "Khi phân tích một lực $\\vec{F}$ hợp với phương ngang một góc $\\alpha$ thành hai thành phần vuông góc $F_x$ (phương ngang) và $F_y$ (phương thẳng đứng), biểu thức tính $F_x$ là:",
            "questionEn": "When resolving a force F inclined at angle alpha to horizontal into Fx and Fy, Fx is:",
            "options": [
              "$F_x = F \\cdot \\cos \\alpha$",
              "$F_x = F \\cdot \\sin \\alpha$",
              "$F_x = F / \\cos \\alpha$",
              "$F_x = F \\cdot \\tan \\alpha$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Theo hệ thức lượng giác trong tam giác vuông: thành phần kề với góc $\\alpha$ là $F_x = F \\cdot \\cos \\alpha$.",
            "conceptTested": "Phân tích lực trên hệ trục tọa độ",
            "textbookRef": "KNTT Bài 13 (Trang 58)"
          }
        ],
        "available": true
      },
      {
        "id": "bai-14",
        "chapterId": "chuong-3",
        "lessonNum": 14,
        "number": 14,
        "title": "Định luật 1 Newton",
        "titleEn": "Newton's First Law of Motion",
        "subtitle": "Quán tính và định luật quán tính của Newton.",
        "subtitleEn": "Inertia and Newton's First Law of Motion (Law of Inertia).",
        "shortDesc": "Quán tính và định luật quán tính của Newton.",
        "shortDescription": "Quán tính và định luật quán tính của Newton.",
        "chapterTitle": "ĐỘNG LỰC HỌC",
        "labTag": "Mô phỏng Quán tính & Đệm không khí",
        "labTagEn": "Inertia & Air Track Simulation",
        "knttRef": "KNTT Bài 14 (Trang 60)",
        "ctstRef": "CTST Bài 10 (Trang 58)",
        "simulationId": "newton-dynamics",
        "labType": "motion",
        "labTitle": "Mô phỏng Quán tính & Đệm không khí",
        "labDescription": "Khám phá chuyển động khi lực tác dụng triệt tiêu hoàn toàn.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Quán tính & Đệm không khí",
          "purpose": "Khám phá chuyển động khi lực tác dụng triệt tiêu hoàn toàn.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Quán tính và định luật quán tính của Newton.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 2,
          "labRoute": "/simulations/newton-dynamics"
        },
        "sections": [
          {
            "title": "1. Định luật 1 Newton (Định luật Quán tính)",
            "content": "Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.",
            "keyTakeaway": "Lực không phải là nguyên nhân duy trì chuyển động mà là nguyên nhân làm thay đổi vận tốc của vật."
          },
          {
            "title": "2. Quán tính và Khối lượng",
            "content": "* **Quán tính**: Là tính chất của mọi vật có xu hướng bảo toàn vận tốc của nó cả về hướng và độ lớn.\n* **Khối lượng**: Là đại lượng đặc trưng cho mức quán tính của vật. Vật có khối lượng càng lớn thì quán tính càng lớn (càng khó làm thay đổi trạng thái chuyển động của nó).",
            "keyTakeaway": "Khối lượng là thước đo mức quán tính của vật chất."
          }
        ],
        "theorySections": [
          {
            "title": "1. Định luật 1 Newton (Định luật Quán tính)",
            "content": "Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.",
            "keyTakeaway": "Lực không phải là nguyên nhân duy trì chuyển động mà là nguyên nhân làm thay đổi vận tốc của vật."
          },
          {
            "title": "2. Quán tính và Khối lượng",
            "content": "* **Quán tính**: Là tính chất của mọi vật có xu hướng bảo toàn vận tốc của nó cả về hướng và độ lớn.\n* **Khối lượng**: Là đại lượng đặc trưng cho mức quán tính của vật. Vật có khối lượng càng lớn thì quán tính càng lớn (càng khó làm thay đổi trạng thái chuyển động của nó).",
            "keyTakeaway": "Khối lượng là thước đo mức quán tính của vật chất."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Định luật 1 Newton",
            "latex": "\\sum \\vec{F} = \\vec{0} \\implies \\vec{v} = \\text{const}",
            "unit": "m/s",
            "notes": "Khi không có ngoại lực tác dụng, vật duy trì trạng thái đứng yên hoặc chuyển động thẳng đều."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Định luật 1 Newton (Định luật Quán tính)",
              "content": "Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.",
              "keyTakeaway": "Lực không phải là nguyên nhân duy trì chuyển động mà là nguyên nhân làm thay đổi vận tốc của vật."
            },
            {
              "num": 2,
              "heading": "2. Quán tính và Khối lượng",
              "content": "* **Quán tính**: Là tính chất của mọi vật có xu hướng bảo toàn vận tốc của nó cả về hướng và độ lớn.\n* **Khối lượng**: Là đại lượng đặc trưng cho mức quán tính của vật. Vật có khối lượng càng lớn thì quán tính càng lớn (càng khó làm thay đổi trạng thái chuyển động của nó).",
              "keyTakeaway": "Khối lượng là thước đo mức quán tính của vật chất."
            }
          ],
          "ghiNho": "Lực không phải là nguyên nhân duy trì chuyển động mà là nguyên nhân làm thay đổi vận tốc của vật. Khối lượng là thước đo mức quán tính của vật chất.",
          "part2_formulas": [
            {
              "formula": "\\sum \\vec{F} = \\vec{0} \\implies \\vec{v} = \\text{const}",
              "quantity": "Định luật 1 Newton",
              "symbol": "\\sum \\vec{F}",
              "unit": "m/s",
              "meaning": "Khi không có ngoại lực tác dụng, vật duy trì trạng thái đứng yên hoặc chuyển động thẳng đều."
            }
          ],
          "part3_applications": [
            "Thắt dây an toàn khi đi xe ô tô để bảo vệ người ngồi khỏi bị văng về phía trước do quán tính khi phanh gấp.",
            "Giũ mạnh quần áo ướt để các giọt nước theo quán tính văng ra ngoài."
          ]
        },
        "quizzes": [
          {
            "id": "b14-q1",
            "question": "Định luật 1 Newton còn có tên gọi khác là gì?",
            "questionEn": "Newton's First Law is also known as:",
            "options": [
              "Định luật Vạn vật hấp dẫn",
              "Định luật Quán tính",
              "Định luật Bảo toàn cơ năng",
              "Định luật Tác dụng và Phản tác dụng"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Định luật 1 Newton khẳng định tính chất bảo toàn trạng thái chuyển động của vật chất nên được gọi là Định luật Quán tính.",
            "conceptTested": "Bản chất Định luật 1 Newton",
            "textbookRef": "KNTT Bài 14 (Trang 60)"
          },
          {
            "id": "b14-q2",
            "question": "Đại lượng nào đặc trưng cho mức quán tính của một vật thể?",
            "questionEn": "Which physical quantity is a measure of an object's inertia?",
            "options": [
              "Trọng lượng",
              "Vận tốc",
              "Khối lượng",
              "Gia tốc"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Khối lượng là đại lượng vô hướng đặc trưng cho mức quán tính của vật: vật có khối lượng càng lớn thì càng khó thay đổi vận tốc.",
            "conceptTested": "Khối lượng và quán tính",
            "textbookRef": "KNTT Bài 14 (Trang 61)"
          },
          {
            "id": "b14-q3",
            "question": "Một hành khách ngồi trên xe buýt đang chạy thẳng đều. Khi xe đột ngột rẽ sang trái, hành khách sẽ bị nghiêng người về phía nào?",
            "questionEn": "When a bus turns sharply to the left, passengers lean towards which direction?",
            "options": [
              "Nghiêng sang phải",
              "Nghiêng sang trái",
              "Ngả về phía trước",
              "Ngả về phía sau"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Theo quán tính, phần thân trên của hành khách có xu hướng tiếp tục chuyển động theo hướng cũ (thẳng về phía trước), nên khi sàn xe và ghế rẽ sang trái thì hành khách bị nghiêng sang phải.",
            "conceptTested": "Hiện tượng quán tính trong đời sống",
            "textbookRef": "KNTT Bài 14 (Trang 62)"
          },
          {
            "id": "b14-q4",
            "question": "Theo quan điểm của Vật lí hiện đại, lực là nguyên nhân gây ra hiện tượng gì?",
            "questionEn": "According to modern Physics, a net force is the cause of:",
            "options": [
              "Duy trì chuyển động của vật",
              "Làm biến đổi vận tốc (gây ra gia tốc) hoặc làm biến dạng vật",
              "Làm cho vật đứng yên mãi mãi",
              "Tạo ra khối lượng của vật"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Lực không duy trì chuyển động mà là nguyên nhân làm thay đổi vận tốc của vật (tạo ra gia tốc) hoặc làm biến dạng vật.",
            "conceptTested": "Tác dụng của lực",
            "textbookRef": "KNTT Bài 14 (Trang 60)"
          }
        ],
        "available": true
      },
      {
        "id": "bai-15",
        "chapterId": "chuong-3",
        "lessonNum": 15,
        "number": 15,
        "title": "Định luật 2 Newton & Mặt phẳng nghiêng",
        "titleEn": "Newton's 2nd Law & Inclined Plane",
        "subtitle": "Mối quan hệ giữa gia tốc, hợp lực tác dụng và khối lượng của vật: F = m.a.",
        "subtitleEn": "Vector formula F = m·a, decomposing gravity, normal and friction forces on an incline.",
        "shortDesc": "Mối quan hệ giữa gia tốc, hợp lực tác dụng và khối lượng của vật: F = m.a.",
        "shortDescription": "Mối quan hệ giữa gia tốc, hợp lực tác dụng và khối lượng của vật: F = m.a.",
        "chapterTitle": "ĐỘNG LỰC HỌC",
        "labTag": "Mô phỏng Trượt dốc & Phân tích lực véc-tơ",
        "labTagEn": "Incline Slide and Force Vector Breakdown Lab",
        "knttRef": "KNTT Bài 15 (Trang 63)",
        "ctstRef": "CTST Bài 10 (Trang 61)",
        "simulationId": "newton-dynamics",
        "labType": "motion",
        "labTitle": "Kiểm chứng Định luật 2 Newton",
        "labDescription": "Đo gia tốc a phụ thuộc vào lực kéo F và khối lượng xe m.",
        "virtualLabSpec": {
          "experimentName": "Kiểm chứng Định luật 2 Newton",
          "purpose": "Đo gia tốc a phụ thuộc vào lực kéo F và khối lượng xe m.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Mối quan hệ giữa gia tốc, hợp lực tác dụng và khối lượng của vật: F = m.a.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 2,
          "labRoute": "/simulations/newton-dynamics"
        },
        "sections": [
          {
            "title": "Định luật II Newton",
            "content": "Gia tốc của một vật cùng hướng với hợp lực tác dụng lên vật. Độ lớn gia tốc tỉ lệ thuận với độ lớn của hợp lực và tỉ lệ nghịch với khối lượng của vật: $\\vec{a} = \\frac{\\vec{F}_{hl}}{m}$, hay $\\vec{F}_{hl} = m\\vec{a}$."
          },
          {
            "title": "Phân tích lực trên mặt phẳng nghiêng góc α",
            "content": "• Trọng lực $\\vec{P}$ phân tích thành 2 thành phần: $P_x = mg\\sin\\alpha$ (kéo trượt xuống) và $P_y = mg\\cos\\alpha$ (nén vào mặt phẳng).\n• Phản lực pháp tuyến: $N = P_y = mg\\cos\\alpha$.\n• Lực ma sát trượt: $F_{ms} = \\mu N = \\mu mg\\cos\\alpha$.\n• Phương trình chuyển động: $mg\\sin\\alpha - \\mu mg\\cos\\alpha = ma \\Rightarrow a = g(\\sin\\alpha - \\mu\\cos\\alpha)$.",
            "keyTakeaway": "Ghi nhớ: Vật trượt xuống dốc khi mg sinα > μ mg cosα (tức tanα > μ); vật đứng yên cân bằng khi tanα ≤ μ."
          }
        ],
        "theorySections": [
          {
            "title": "Định luật II Newton",
            "content": "Gia tốc của một vật cùng hướng với hợp lực tác dụng lên vật. Độ lớn gia tốc tỉ lệ thuận với độ lớn của hợp lực và tỉ lệ nghịch với khối lượng của vật: $\\vec{a} = \\frac{\\vec{F}_{hl}}{m}$, hay $\\vec{F}_{hl} = m\\vec{a}$."
          },
          {
            "title": "Phân tích lực trên mặt phẳng nghiêng góc α",
            "content": "• Trọng lực $\\vec{P}$ phân tích thành 2 thành phần: $P_x = mg\\sin\\alpha$ (kéo trượt xuống) và $P_y = mg\\cos\\alpha$ (nén vào mặt phẳng).\n• Phản lực pháp tuyến: $N = P_y = mg\\cos\\alpha$.\n• Lực ma sát trượt: $F_{ms} = \\mu N = \\mu mg\\cos\\alpha$.\n• Phương trình chuyển động: $mg\\sin\\alpha - \\mu mg\\cos\\alpha = ma \\Rightarrow a = g(\\sin\\alpha - \\mu\\cos\\alpha)$.",
            "keyTakeaway": "Ghi nhớ: Vật trượt xuống dốc khi mg sinα > μ mg cosα (tức tanα > μ); vật đứng yên cân bằng khi tanα ≤ μ."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Định luật II Newton",
            "latex": "F = m \\cdot a",
            "unit": "Newton (N)",
            "notes": "Hợp lực tác dụng làm thay đổi vận tốc của vật có khối lượng m."
          },
          {
            "name": "Gia tốc trên mặt phẳng nghiêng",
            "latex": "a = g(\\sin\\alpha - \\mu\\cos\\alpha)",
            "unit": "m/s²",
            "notes": "Gia tốc trượt xuống dốc của vật chịu ma sát trượt hệ số μ."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Định luật II Newton",
              "content": "Gia tốc của một vật cùng hướng với hợp lực tác dụng lên vật. Độ lớn gia tốc tỉ lệ thuận với độ lớn của hợp lực và tỉ lệ nghịch với khối lượng của vật: $\\vec{a} = \\frac{\\vec{F}_{hl}}{m}$, hay $\\vec{F}_{hl} = m\\vec{a}$."
            },
            {
              "num": 2,
              "heading": "Phân tích lực trên mặt phẳng nghiêng góc α",
              "content": "• Trọng lực $\\vec{P}$ phân tích thành 2 thành phần: $P_x = mg\\sin\\alpha$ (kéo trượt xuống) và $P_y = mg\\cos\\alpha$ (nén vào mặt phẳng).\n• Phản lực pháp tuyến: $N = P_y = mg\\cos\\alpha$.\n• Lực ma sát trượt: $F_{ms} = \\mu N = \\mu mg\\cos\\alpha$.\n• Phương trình chuyển động: $mg\\sin\\alpha - \\mu mg\\cos\\alpha = ma \\Rightarrow a = g(\\sin\\alpha - \\mu\\cos\\alpha)$.",
              "keyTakeaway": "Ghi nhớ: Vật trượt xuống dốc khi mg sinα > μ mg cosα (tức tanα > μ); vật đứng yên cân bằng khi tanα ≤ μ."
            }
          ],
          "ghiNho": "Ghi nhớ: Vật trượt xuống dốc khi mg sinα > μ mg cosα (tức tanα > μ); vật đứng yên cân bằng khi tanα ≤ μ.",
          "part2_formulas": [
            {
              "formula": "F = m \\cdot a",
              "quantity": "Định luật II Newton",
              "symbol": "F",
              "unit": "Newton (N)",
              "meaning": "Hợp lực tác dụng làm thay đổi vận tốc của vật có khối lượng m."
            },
            {
              "formula": "a = g(\\sin\\alpha - \\mu\\cos\\alpha)",
              "quantity": "Gia tốc trên mặt phẳng nghiêng",
              "symbol": "a",
              "unit": "m/s²",
              "meaning": "Gia tốc trượt xuống dốc của vật chịu ma sát trượt hệ số μ."
            }
          ],
          "part3_applications": [
            "Thiết kế đường dốc cứu nạn trên các cung đèo dốc hiểm trở cho xe tải mất phanh.",
            "Tác dụng của rãnh gai lốp ô tô tăng hệ số ma sát trượt chống trượt ngã khi phanh gấp."
          ]
        },
        "quizzes": [
          {
            "id": "q_b15_1",
            "question": "Theo định luật II Newton, nếu hợp lực F tác dụng lên vật tăng gấp đôi trong khi khối lượng m không đổi thì gia tốc a của vật sẽ:",
            "questionEn": "According to Newton's 2nd Law, doubling the net force on constant mass causes acceleration to:",
            "options": [
              "Giảm đi một nửa",
              "Tăng lên gấp đôi",
              "Không đổi",
              "Tăng lên gấp bốn lần"
            ],
            "correctIndex": 1,
            "explanation": "a = F / m. Vì gia tốc tỉ lệ thuận với hợp lực nên khi F tăng 2 lần thì a cũng tăng 2 lần.",
            "conceptTested": "Mối quan hệ F và a",
            "textbookRef": "KNTT Bài 15 (Trang 63)",
            "correctAnswer": 1
          },
          {
            "id": "q_b15_2",
            "question": "Một vật trượt không vận tốc đầu từ đỉnh một mặt phẳng nghiêng góc α. Thành phần trọng lực đóng vai trò kéo vật trượt xuống dốc là:",
            "questionEn": "For an object sliding down an incline of angle α, the gravity component pulling it down is:",
            "options": [
              "P_x = mg cos α",
              "P_x = mg sin α",
              "P_x = mg tan α",
              "P_x = mg"
            ],
            "correctIndex": 1,
            "explanation": "Hình chiếu trọng lực P lên trục song song với dốc hướng xuống là P_x = P · sin α = mg sin α.",
            "conceptTested": "Phân tích trọng lực trên dốc",
            "textbookRef": "KNTT Bài 15 (Trang 65)",
            "correctAnswer": 1
          },
          {
            "id": "q_b15_3",
            "question": "Lực ma sát trượt tác dụng lên vật chuyển động trên mặt phẳng nghiêng góc α có độ lớn bằng:",
            "questionEn": "The kinetic friction force on an incline of angle α is given by:",
            "options": [
              "F_ms = μ · mg · sin α",
              "F_ms = μ · mg · cos α",
              "F_ms = μ · mg",
              "F_ms = mg · cos α"
            ],
            "correctIndex": 1,
            "explanation": "Phản lực N = mg cos α, do đó F_ms = μN = μ mg cos α.",
            "conceptTested": "Độ lớn lực ma sát trượt",
            "textbookRef": "KNTT Bài 18 (Trang 74)",
            "correctAnswer": 1
          },
          {
            "id": "q_b15_4",
            "question": "Điều kiện để một vật đặt trên mặt phẳng nghiêng góc α tự động trượt xuống là:",
            "questionEn": "The condition for an object to slide down an incline under its own weight is:",
            "options": [
              "tan α > μ",
              "tan α < μ",
              "sin α = μ",
              "cos α > μ"
            ],
            "correctIndex": 0,
            "explanation": "Để trượt xuống: mg sin α > F_ms_max = μ mg cos α <=> sin α / cos α > μ <=> tan α > μ.",
            "conceptTested": "Điều kiện trượt dốc",
            "textbookRef": "KNTT Bài 20 (Trang 81)",
            "correctAnswer": 0
          },
          {
            "id": "q_b15_5",
            "question": "Một vật khối lượng 2 kg chuyển động với gia tốc 3 m/s². Hợp lực tác dụng vào vật có độ lớn là:",
            "questionEn": "A 2 kg mass accelerates at 3 m/s². The net force is:",
            "options": [
              "1,5 N",
              "5 N",
              "6 N",
              "9 N"
            ],
            "correctIndex": 2,
            "explanation": "F = m · a = 2 kg · 3 m/s² = 6 N.",
            "conceptTested": "Tính độ lớn hợp lực",
            "textbookRef": "KNTT Bài 15 (Trang 64)",
            "correctAnswer": 2
          }
        ],
        "available": true
      },
      {
        "id": "bai-16",
        "chapterId": "chuong-3",
        "lessonNum": 16,
        "number": 16,
        "title": "Định luật 3 Newton",
        "titleEn": "Newton's Third Law of Motion",
        "subtitle": "Lực và phản lực trong tương tác giữa hai vật: F_AB = - F_BA.",
        "subtitleEn": "Action and Reaction Forces: F_AB = - F_BA.",
        "shortDesc": "Lực và phản lực trong tương tác giữa hai vật: F_AB = - F_BA.",
        "shortDescription": "Lực và phản lực trong tương tác giữa hai vật: F_AB = - F_BA.",
        "chapterTitle": "ĐỘNG LỰC HỌC",
        "labTag": "Mô phỏng Lực và Phản lực giữa 2 xe va chạm",
        "labTagEn": "Action-Reaction Force Simulation on Colliding Carts",
        "knttRef": "KNTT Bài 16 (Trang 66)",
        "ctstRef": "CTST Bài 10 (Trang 64)",
        "simulationId": "newton-dynamics",
        "labType": "motion",
        "labTitle": "Mô phỏng Lực và Phản lực giữa 2 xe va chạm",
        "labDescription": "Cảm biến lực ghi nhận lực tương tác trực đối giữa hai vật.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Lực và Phản lực giữa 2 xe va chạm",
          "purpose": "Cảm biến lực ghi nhận lực tương tác trực đối giữa hai vật.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Lực và phản lực trong tương tác giữa hai vật: F_AB = - F_BA.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 2,
          "labRoute": "/simulations/newton-dynamics"
        },
        "sections": [
          {
            "title": "1. Định luật 3 Newton",
            "content": "Trong mọi trường hợp, khi vật $A$ tác dụng lên vật $B$ một lực thì vật $B$ cũng tác dụng lại vật $A$ một lực. Hai lực này là hai lực trực đối:\n$$\\vec{F}_{BA} = -\\vec{F}_{AB}$$",
            "keyTakeaway": "Tương tác luôn mang tính hai chiều: Lực và phản lực luôn xuất hiện đồng thời theo từng cặp."
          },
          {
            "title": "2. Đặc điểm của Lực và Phản lực",
            "content": "* Luôn xuất hiện và mất đi đồng thời.\n* Cùng giá, ngược chiều và cùng độ lớn.\n* Đặt vào **hai vật khác nhau** (không cùng điểm đặt) nên **không thể triệt tiêu lẫn nhau** (không phải là cặp lực cân bằng).\n* Cùng bản chất vật lí (ví dụ cùng là lực đàn hồi, lực hấp dẫn hoặc lực tĩnh điện).",
            "keyTakeaway": "Lực và phản lực cùng độ lớn, ngược chiều nhưng đặt vào 2 vật khác nhau nên không triệt tiêu nhau."
          }
        ],
        "theorySections": [
          {
            "title": "1. Định luật 3 Newton",
            "content": "Trong mọi trường hợp, khi vật $A$ tác dụng lên vật $B$ một lực thì vật $B$ cũng tác dụng lại vật $A$ một lực. Hai lực này là hai lực trực đối:\n$$\\vec{F}_{BA} = -\\vec{F}_{AB}$$",
            "keyTakeaway": "Tương tác luôn mang tính hai chiều: Lực và phản lực luôn xuất hiện đồng thời theo từng cặp."
          },
          {
            "title": "2. Đặc điểm của Lực và Phản lực",
            "content": "* Luôn xuất hiện và mất đi đồng thời.\n* Cùng giá, ngược chiều và cùng độ lớn.\n* Đặt vào **hai vật khác nhau** (không cùng điểm đặt) nên **không thể triệt tiêu lẫn nhau** (không phải là cặp lực cân bằng).\n* Cùng bản chất vật lí (ví dụ cùng là lực đàn hồi, lực hấp dẫn hoặc lực tĩnh điện).",
            "keyTakeaway": "Lực và phản lực cùng độ lớn, ngược chiều nhưng đặt vào 2 vật khác nhau nên không triệt tiêu nhau."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Định luật 3 Newton",
            "latex": "\\vec{F}_{BA} = -\\vec{F}_{AB}",
            "unit": "Newton (N)",
            "notes": "Lực và phản lực có cùng độ lớn nhưng ngược chiều và đặt vào hai vật tương tác."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Định luật 3 Newton",
              "content": "Trong mọi trường hợp, khi vật $A$ tác dụng lên vật $B$ một lực thì vật $B$ cũng tác dụng lại vật $A$ một lực. Hai lực này là hai lực trực đối:\n$$\\vec{F}_{BA} = -\\vec{F}_{AB}$$",
              "keyTakeaway": "Tương tác luôn mang tính hai chiều: Lực và phản lực luôn xuất hiện đồng thời theo từng cặp."
            },
            {
              "num": 2,
              "heading": "2. Đặc điểm của Lực và Phản lực",
              "content": "* Luôn xuất hiện và mất đi đồng thời.\n* Cùng giá, ngược chiều và cùng độ lớn.\n* Đặt vào **hai vật khác nhau** (không cùng điểm đặt) nên **không thể triệt tiêu lẫn nhau** (không phải là cặp lực cân bằng).\n* Cùng bản chất vật lí (ví dụ cùng là lực đàn hồi, lực hấp dẫn hoặc lực tĩnh điện).",
              "keyTakeaway": "Lực và phản lực cùng độ lớn, ngược chiều nhưng đặt vào 2 vật khác nhau nên không triệt tiêu nhau."
            }
          ],
          "ghiNho": "Tương tác luôn mang tính hai chiều: Lực và phản lực luôn xuất hiện đồng thời theo từng cặp. Lực và phản lực cùng độ lớn, ngược chiều nhưng đặt vào 2 vật khác nhau nên không triệt tiêu nhau.",
          "part2_formulas": [
            {
              "formula": "\\vec{F}_{BA} = -\\vec{F}_{AB}",
              "quantity": "Định luật 3 Newton",
              "symbol": "\\vec{F}_{BA}",
              "unit": "Newton (N)",
              "meaning": "Lực và phản lực có cùng độ lớn nhưng ngược chiều và đặt vào hai vật tương tác."
            }
          ],
          "part3_applications": [
            "Nguyên lí chuyển động bằng phản lực của tên lửa: phụt khí cháy về phía sau để đẩy thân tên lửa tiến về phía trước.",
            "Người bơi lội đạp chân vào thành bể để nhận phản lực đẩy cơ thể phóng đi."
          ]
        },
        "quizzes": [
          {
            "id": "b16-q1",
            "question": "Đặc điểm nào sau đây KHÔNG đúng với cặp lực và phản lực trong Định luật 3 Newton?",
            "questionEn": "Which statement is NOT true regarding action and reaction pairs in Newton's Third Law?",
            "options": [
              "Cùng giá, ngược chiều và cùng độ lớn.",
              "Xuất hiện và mất đi đồng thời.",
              "Đặt vào hai vật khác nhau (không cân bằng nhau).",
              "Cùng đặt vào một vật nên triệt tiêu lẫn nhau."
            ],
            "correctIndex": 3,
            "correctAnswer": 3,
            "explanation": "Lực và phản lực luôn đặt vào HAI VẬT KHÁC NHAU, do đó chúng không thể tự triệt tiêu lẫn nhau (không phải cặp lực cân bằng).",
            "conceptTested": "Đặc điểm cặp lực và phản lực",
            "textbookRef": "KNTT Bài 16 (Trang 67)"
          },
          {
            "id": "b16-q2",
            "question": "Khi một quả bóng đập vào tường và nảy ngược trở lại, lực nào làm bóng đổi hướng?",
            "questionEn": "When a ball strikes a wall and bounces back, which force changes the ball's motion?",
            "options": [
              "Lực do bóng tác dụng lên tường.",
              "Phản lực do tường tác dụng lên quả bóng.",
              "Trọng lực của Trái Đất.",
              "Lực ma sát của không khí."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Theo định luật 3 Newton, khi bóng tác dụng lực vào tường thì tường tác dụng phản lực ngược lại lên quả bóng, làm biến đổi vận tốc của quả bóng.",
            "conceptTested": "Tác dụng của phản lực",
            "textbookRef": "KNTT Bài 16 (Trang 66)"
          },
          {
            "id": "b16-q3",
            "question": "Một con ngựa kéo một cỗ xe chuyển động về phía trước. Cặp lực nào sau đây là cặp lực trực đối theo Định luật 3 Newton?",
            "questionEn": "A horse pulls a cart forward. Which pair of forces forms an action-reaction pair according to Newton's Third Law?",
            "options": [
              "Lực ngựa kéo xe và lực cản của mặt đất lên xe.",
              "Lực ngựa kéo xe và lực xe kéo lại ngựa.",
              "Trọng lực của xe và phản lực của mặt đường lên xe.",
              "Lực ma sát tác dụng lên chân ngựa và lực ma sát tác dụng lên bánh xe."
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Lực ngựa kéo xe tác dụng lên xe và lực xe kéo lại ngựa tác dụng lên ngựa là cặp lực trực đối xuất hiện do tương tác giữa ngựa và xe.",
            "conceptTested": "Nhận diện cặp lực trực đối",
            "textbookRef": "KNTT Bài 16 (Trang 68)"
          },
          {
            "id": "b16-q4",
            "question": "Nguyên tắc phóng tên lửa bay vào vũ trụ dựa trên định luật vật lí nào?",
            "questionEn": "The propulsion of a rocket into space is primarily based on:",
            "options": [
              "Định luật 3 Newton và định luật bảo toàn động lượng",
              "Định luật 1 Newton và quán tính",
              "Định luật vạn vật hấp dẫn",
              "Định luật Hooke"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Tên lửa đẩy khối khí phản lực ra phía sau, theo định luật 3 Newton khối khí sẽ tác dụng phản lực đẩy tên lửa tiến về phía trước.",
            "conceptTested": "Ứng dụng phản lực của Định luật 3 Newton",
            "textbookRef": "KNTT Bài 16 (Trang 69)"
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuong-4",
    "number": 4,
    "romanNumeral": "IV",
    "title": "NĂNG LƯỢNG, CÔNG, CÔNG SUẤT",
    "titleEn": "ENERGY, WORK, AND POWER",
    "description": "Năng lượng, công cơ học, công suất, hiệu suất, động năng, thế năng và định luật bảo toàn cơ năng.",
    "lessons": [
      {
        "id": "bai-23",
        "chapterId": "chuong-4",
        "lessonNum": 23,
        "number": 23,
        "title": "Năng lượng. Công cơ học",
        "titleEn": "Energy. Mechanical Work",
        "subtitle": "Định nghĩa công cơ học: A = F.s.cos(alpha) và đơn vị Joule (J).",
        "subtitleEn": "Definition of mechanical work A = F·s·cos(alpha) and Joule (J) unit.",
        "shortDesc": "Định nghĩa công cơ học: A = F.s.cos(alpha) và đơn vị Joule (J).",
        "shortDescription": "Định nghĩa công cơ học: A = F.s.cos(alpha) và đơn vị Joule (J).",
        "chapterTitle": "NĂNG LƯỢNG, CÔNG, CÔNG SUẤT",
        "labTag": "Tính công cơ học trên mặt phẳng nghiêng",
        "labTagEn": "Work & Energy on Inclined Plane Simulation",
        "knttRef": "KNTT Bài 23 (Trang 90)",
        "ctstRef": "CTST Bài 15 (Trang 95)",
        "simulationId": "energy-conservation",
        "labType": "motion",
        "labTitle": "Tính công cơ học trên mặt phẳng nghiêng",
        "labDescription": "Khám phá sự phụ thuộc của công phát động và công cản vào góc nghiêng.",
        "virtualLabSpec": {
          "experimentName": "Tính công cơ học trên mặt phẳng nghiêng",
          "purpose": "Khám phá sự phụ thuộc của công phát động và công cản vào góc nghiêng.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Định nghĩa công cơ học: A = F.s.cos(alpha) và đơn vị Joule (J).",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 3,
          "labRoute": "/simulations/energy-conservation"
        },
        "sections": [
          {
            "title": "1. Năng lượng và Định luật bảo toàn năng lượng",
            "content": "Năng lượng là một đại lượng vật lí đặc trưng cho khả năng sinh công của vật. Năng lượng không tự sinh ra và cũng không tự mất đi mà chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.",
            "keyTakeaway": "Năng lượng luôn được bảo toàn và có thể chuyển hóa giữa các dạng: cơ năng, nhiệt năng, điện năng, quang năng..."
          },
          {
            "title": "2. Công cơ học",
            "content": "Khi lực $\\vec{F}$ không đổi tác dụng lên vật làm vật dịch chuyển một quãng đường $s$, công cơ học do lực sinh ra được tính bằng:\n$$A = F \\cdot s \\cdot \\cos \\alpha$$\nvới $\\alpha$ là góc giữa vectơ lực $\\vec{F}$ và vectơ độ dịch chuyển $\\vec{s}$. Đơn vị của công là Joule ($\\text{J}$), $1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$.\n\n* Khi $0^\\circ \\le \\alpha < 90^\\circ$: $\\cos \\alpha > 0 \\implies A > 0$ (Công phát động).\n* Khi $\\alpha = 90^\\circ$: $\\cos \\alpha = 0 \\implies A = 0$ (Lực không sinh công).\n* Khi $90^\\circ < \\alpha \\le 180^\\circ$: $\\cos \\alpha < 0 \\implies A < 0$ (Công cản).",
            "keyTakeaway": "Dấu của công cơ học phụ thuộc vào góc alpha: công phát động (alpha nhọn), công cản (alpha tù), không sinh công (alpha = 90 độ)."
          }
        ],
        "theorySections": [
          {
            "title": "1. Năng lượng và Định luật bảo toàn năng lượng",
            "content": "Năng lượng là một đại lượng vật lí đặc trưng cho khả năng sinh công của vật. Năng lượng không tự sinh ra và cũng không tự mất đi mà chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.",
            "keyTakeaway": "Năng lượng luôn được bảo toàn và có thể chuyển hóa giữa các dạng: cơ năng, nhiệt năng, điện năng, quang năng..."
          },
          {
            "title": "2. Công cơ học",
            "content": "Khi lực $\\vec{F}$ không đổi tác dụng lên vật làm vật dịch chuyển một quãng đường $s$, công cơ học do lực sinh ra được tính bằng:\n$$A = F \\cdot s \\cdot \\cos \\alpha$$\nvới $\\alpha$ là góc giữa vectơ lực $\\vec{F}$ và vectơ độ dịch chuyển $\\vec{s}$. Đơn vị của công là Joule ($\\text{J}$), $1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$.\n\n* Khi $0^\\circ \\le \\alpha < 90^\\circ$: $\\cos \\alpha > 0 \\implies A > 0$ (Công phát động).\n* Khi $\\alpha = 90^\\circ$: $\\cos \\alpha = 0 \\implies A = 0$ (Lực không sinh công).\n* Khi $90^\\circ < \\alpha \\le 180^\\circ$: $\\cos \\alpha < 0 \\implies A < 0$ (Công cản).",
            "keyTakeaway": "Dấu của công cơ học phụ thuộc vào góc alpha: công phát động (alpha nhọn), công cản (alpha tù), không sinh công (alpha = 90 độ)."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Công cơ học",
            "latex": "A = F \\cdot s \\cdot \\cos \\alpha",
            "unit": "Joule (J)",
            "notes": "Công do lực F thực hiện khi làm vật dịch chuyển quãng đường s góc alpha."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Năng lượng và Định luật bảo toàn năng lượng",
              "content": "Năng lượng là một đại lượng vật lí đặc trưng cho khả năng sinh công của vật. Năng lượng không tự sinh ra và cũng không tự mất đi mà chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.",
              "keyTakeaway": "Năng lượng luôn được bảo toàn và có thể chuyển hóa giữa các dạng: cơ năng, nhiệt năng, điện năng, quang năng..."
            },
            {
              "num": 2,
              "heading": "2. Công cơ học",
              "content": "Khi lực $\\vec{F}$ không đổi tác dụng lên vật làm vật dịch chuyển một quãng đường $s$, công cơ học do lực sinh ra được tính bằng:\n$$A = F \\cdot s \\cdot \\cos \\alpha$$\nvới $\\alpha$ là góc giữa vectơ lực $\\vec{F}$ và vectơ độ dịch chuyển $\\vec{s}$. Đơn vị của công là Joule ($\\text{J}$), $1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$.\n\n* Khi $0^\\circ \\le \\alpha < 90^\\circ$: $\\cos \\alpha > 0 \\implies A > 0$ (Công phát động).\n* Khi $\\alpha = 90^\\circ$: $\\cos \\alpha = 0 \\implies A = 0$ (Lực không sinh công).\n* Khi $90^\\circ < \\alpha \\le 180^\\circ$: $\\cos \\alpha < 0 \\implies A < 0$ (Công cản).",
              "keyTakeaway": "Dấu của công cơ học phụ thuộc vào góc alpha: công phát động (alpha nhọn), công cản (alpha tù), không sinh công (alpha = 90 độ)."
            }
          ],
          "ghiNho": "Năng lượng luôn được bảo toàn và có thể chuyển hóa giữa các dạng: cơ năng, nhiệt năng, điện năng, quang năng... Dấu của công cơ học phụ thuộc vào góc alpha: công phát động (alpha nhọn), công cản (alpha tù), không sinh công (alpha = 90 độ).",
          "part2_formulas": [
            {
              "formula": "A = F \\cdot s \\cdot \\cos \\alpha",
              "quantity": "Công cơ học",
              "symbol": "A",
              "unit": "Joule (J)",
              "meaning": "Công do lực F thực hiện khi làm vật dịch chuyển quãng đường s góc alpha."
            }
          ],
          "part3_applications": [
            "Tính toán lượng nhiên liệu tiêu thụ và công hữu ích sinh ra bởi động cơ ô tô khi leo dốc.",
            "Thiết kế máng trượt và hệ thống phanh hãm nhằm tối ưu hóa công cản ma sát."
          ]
        },
        "quizzes": [
          {
            "id": "b23-q1",
            "question": "Công cơ học của lực không đổi làm dịch chuyển một quãng đường $s$ được tính theo công thức:",
            "questionEn": "The mechanical work done by a constant force F over displacement s is:",
            "options": [
              "$A = F \\cdot s \\cdot \\cos \\alpha$",
              "$A = F \\cdot s \\cdot \\sin \\alpha$",
              "$A = \\frac{F \\cdot s}{\\cos \\alpha}$",
              "$A = F \\cdot v$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Công cơ học: $A = F \\cdot s \\cdot \\cos \\alpha$, với $\\alpha$ là góc giữa hướng của lực $\\vec{F}$ và hướng dịch chuyển $\\vec{s}$.",
            "conceptTested": "Công thức tính công cơ học",
            "textbookRef": "KNTT Bài 23 (Trang 91)"
          },
          {
            "id": "b23-q2",
            "question": "Lực nào sau đây KHÔNG sinh công khi vật chuyển động trên mặt phẳng nằm ngang?",
            "questionEn": "Which force does NO work when an object slides horizontally?",
            "options": [
              "Lực ma sát trượt",
              "Trọng lực tác dụng lên vật",
              "Lực kéo cùng hướng chuyển động",
              "Lực kéo hợp với phương ngang một góc nhọn"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Trọng lực có phương thẳng đứng, vuông góc với độ dịch chuyển nằm ngang $(\\alpha = 90^\\circ \\implies \\cos 90^\\circ = 0)$, do đó trọng lực không sinh công ($A = 0$).",
            "conceptTested": "Điều kiện lực không sinh công",
            "textbookRef": "KNTT Bài 23 (Trang 92)"
          },
          {
            "id": "b23-q3",
            "question": "Một lực $F = 50\\text{ N}$ tác dụng vào vật làm vật dịch chuyển quãng đường $s = 10\\text{ m}$ theo phương của lực ($\\alpha = 0^\\circ$). Công do lực thực hiện là:",
            "questionEn": "A force F = 50 N acts in the direction of motion for displacement s = 10 m. The work done is:",
            "options": [
              "500 J",
              "5 J",
              "50 J",
              "0 J"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "$A = F \\cdot s \\cdot \\cos 0^\\circ = 50 \\times 10 \\times 1 = 500\\text{ J}$.",
            "conceptTested": "Tính công phát động",
            "textbookRef": "KNTT Bài 23 (Trang 92)"
          },
          {
            "id": "b23-q4",
            "question": "Trường hợp nào sau đây lực sinh công cản ($A < 0$)?",
            "questionEn": "In which case does a force perform negative work (drag/resistance)?",
            "options": [
              "Góc giữa lực và hướng chuyển động là góc nhọn",
              "Lực kéo làm xe tăng tốc",
              "Lực ma sát tác dụng lên bánh xe khi phanh xe lại",
              "Trọng lực tác dụng lên quả táo đang rơi xuống"
            ],
            "correctIndex": 2,
            "correctAnswer": 2,
            "explanation": "Lực ma sát khi phanh xe ngược hướng chuyển động $(\\alpha = 180^\\circ \\implies \\cos 180^\\circ = -1)$, sinh công cản $A = -F_{ms} \\cdot s < 0$.",
            "conceptTested": "Công cản",
            "textbookRef": "KNTT Bài 23 (Trang 93)"
          }
        ],
        "available": true
      },
      {
        "id": "bai-24",
        "chapterId": "chuong-4",
        "lessonNum": 24,
        "number": 24,
        "title": "Công suất & Hiệu suất",
        "titleEn": "Power and Efficiency",
        "subtitle": "Tốc độ sinh công: P = A / t = F.v và hiệu suất năng lượng H = A_ci / A_tp.",
        "subtitleEn": "Rate of doing work P = A / t = F·v and energy efficiency H = A_useful / A_total.",
        "shortDesc": "Tốc độ sinh công: P = A / t = F.v và hiệu suất năng lượng H = A_ci / A_tp.",
        "shortDescription": "Tốc độ sinh công: P = A / t = F.v và hiệu suất năng lượng H = A_ci / A_tp.",
        "chapterTitle": "NĂNG LƯỢNG, CÔNG, CÔNG SUẤT",
        "labTag": "Đo công suất động cơ điện",
        "labTagEn": "Electric Motor Power & Efficiency Measurement",
        "knttRef": "KNTT Bài 24 (Trang 95)",
        "ctstRef": "CTST Bài 16 (Trang 100)",
        "simulationId": "energy-conservation",
        "labType": "motion",
        "labTitle": "Đo công suất động cơ điện",
        "labDescription": "Đánh giá công suất tức thời và hiệu suất cơ học.",
        "virtualLabSpec": {
          "experimentName": "Đo công suất động cơ điện",
          "purpose": "Đánh giá công suất tức thời và hiệu suất cơ học.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Tốc độ sinh công: P = A / t = F.v và hiệu suất năng lượng H = A_ci / A_tp.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 3,
          "labRoute": "/simulations/energy-conservation"
        },
        "sections": [
          {
            "title": "1. Công suất (Power)",
            "content": "Công suất là đại lượng đặc trưng cho tốc độ sinh công của lực, được xác định bằng công thực hiện được trong một đơn vị thời gian:\n$$\\mathcal{P} = \\frac{A}{t}$$\n\nKhi vật chuyển động đều với vận tốc $v$ dưới tác dụng của lực phát động $F$ cùng hướng chuyển động, công suất tức thời được tính bằng:\n$$\\mathcal{P} = F \\cdot v$$\n\nĐơn vị của công suất trong hệ SI là Watt ($\\text{W}$), $1\\text{ W} = 1\\text{ J/s}$. Ngoài ra còn dùng mã lực: $1\\text{ HP} \\approx 746\\text{ W}$.",
            "keyTakeaway": "Công suất P = A/t = F.v thể hiện tốc độ thực hiện công nhanh hay chậm."
          },
          {
            "title": "2. Hiệu suất (Efficiency)",
            "content": "Hiệu suất là tỉ số giữa năng lượng có ích (hoặc công có ích) và năng lượng toàn phần (hoặc công toàn phần):\n$$H = \\frac{A_{\\text{ích}}}{A_{\\text{toàn phần}}} \\times 100\\% = \\frac{\\mathcal{P}_{\\text{ích}}}{\\mathcal{P}_{\\text{toàn phần}}} \\times 100\\%$$\n\nDo luôn có hao phí năng lượng vì ma sát hoặc tỏa nhiệt nên hiệu suất của máy móc luôn nhỏ hơn $100\\%$.",
            "keyTakeaway": "Hiệu suất H = (Công có ích / Công toàn phần) * 100%, luôn nhỏ hơn 100% trong thực tế."
          }
        ],
        "theorySections": [
          {
            "title": "1. Công suất (Power)",
            "content": "Công suất là đại lượng đặc trưng cho tốc độ sinh công của lực, được xác định bằng công thực hiện được trong một đơn vị thời gian:\n$$\\mathcal{P} = \\frac{A}{t}$$\n\nKhi vật chuyển động đều với vận tốc $v$ dưới tác dụng của lực phát động $F$ cùng hướng chuyển động, công suất tức thời được tính bằng:\n$$\\mathcal{P} = F \\cdot v$$\n\nĐơn vị của công suất trong hệ SI là Watt ($\\text{W}$), $1\\text{ W} = 1\\text{ J/s}$. Ngoài ra còn dùng mã lực: $1\\text{ HP} \\approx 746\\text{ W}$.",
            "keyTakeaway": "Công suất P = A/t = F.v thể hiện tốc độ thực hiện công nhanh hay chậm."
          },
          {
            "title": "2. Hiệu suất (Efficiency)",
            "content": "Hiệu suất là tỉ số giữa năng lượng có ích (hoặc công có ích) và năng lượng toàn phần (hoặc công toàn phần):\n$$H = \\frac{A_{\\text{ích}}}{A_{\\text{toàn phần}}} \\times 100\\% = \\frac{\\mathcal{P}_{\\text{ích}}}{\\mathcal{P}_{\\text{toàn phần}}} \\times 100\\%$$\n\nDo luôn có hao phí năng lượng vì ma sát hoặc tỏa nhiệt nên hiệu suất của máy móc luôn nhỏ hơn $100\\%$.",
            "keyTakeaway": "Hiệu suất H = (Công có ích / Công toàn phần) * 100%, luôn nhỏ hơn 100% trong thực tế."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Công suất",
            "latex": "\\mathcal{P} = \\frac{A}{t} = F \\cdot v",
            "unit": "Watt (W)",
            "notes": "Tốc độ sinh công của lực hoặc máy móc trong một đơn vị thời gian."
          },
          {
            "name": "Hiệu suất",
            "latex": "H = \\frac{A_{\\text{ích}}}{A_{\\text{toàn phần}}} \\times 100\\%",
            "unit": "%",
            "notes": "Tỉ số phần trăm giữa công có ích thu được và công toàn phần cung cấp."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Công suất (Power)",
              "content": "Công suất là đại lượng đặc trưng cho tốc độ sinh công của lực, được xác định bằng công thực hiện được trong một đơn vị thời gian:\n$$\\mathcal{P} = \\frac{A}{t}$$\n\nKhi vật chuyển động đều với vận tốc $v$ dưới tác dụng của lực phát động $F$ cùng hướng chuyển động, công suất tức thời được tính bằng:\n$$\\mathcal{P} = F \\cdot v$$\n\nĐơn vị của công suất trong hệ SI là Watt ($\\text{W}$), $1\\text{ W} = 1\\text{ J/s}$. Ngoài ra còn dùng mã lực: $1\\text{ HP} \\approx 746\\text{ W}$.",
              "keyTakeaway": "Công suất P = A/t = F.v thể hiện tốc độ thực hiện công nhanh hay chậm."
            },
            {
              "num": 2,
              "heading": "2. Hiệu suất (Efficiency)",
              "content": "Hiệu suất là tỉ số giữa năng lượng có ích (hoặc công có ích) và năng lượng toàn phần (hoặc công toàn phần):\n$$H = \\frac{A_{\\text{ích}}}{A_{\\text{toàn phần}}} \\times 100\\% = \\frac{\\mathcal{P}_{\\text{ích}}}{\\mathcal{P}_{\\text{toàn phần}}} \\times 100\\%$$\n\nDo luôn có hao phí năng lượng vì ma sát hoặc tỏa nhiệt nên hiệu suất của máy móc luôn nhỏ hơn $100\\%$.",
              "keyTakeaway": "Hiệu suất H = (Công có ích / Công toàn phần) * 100%, luôn nhỏ hơn 100% trong thực tế."
            }
          ],
          "ghiNho": "Công suất P = A/t = F.v thể hiện tốc độ thực hiện công nhanh hay chậm. Hiệu suất H = (Công có ích / Công toàn phần) * 100%, luôn nhỏ hơn 100% trong thực tế.",
          "part2_formulas": [
            {
              "formula": "\\mathcal{P} = \\frac{A}{t} = F \\cdot v",
              "quantity": "Công suất",
              "symbol": "\\mathcal{P}",
              "unit": "Watt (W)",
              "meaning": "Tốc độ sinh công của lực hoặc máy móc trong một đơn vị thời gian."
            },
            {
              "formula": "H = \\frac{A_{\\text{ích}}}{A_{\\text{toàn phần}}} \\times 100\\%",
              "quantity": "Hiệu suất",
              "symbol": "H",
              "unit": "%",
              "meaning": "Tỉ số phần trăm giữa công có ích thu được và công toàn phần cung cấp."
            }
          ],
          "part3_applications": [
            "Đánh giá nhãn năng lượng (tiết kiệm điện) của các thiết bị gia dụng như điều hòa, tủ lạnh.",
            "Tính toán công suất cần thiết của động cơ xe hơi để vượt dốc hoặc tăng tốc trong thời gian ngắn."
          ]
        },
        "quizzes": [
          {
            "id": "b24-q1",
            "question": "Công suất là đại lượng đo bằng:",
            "questionEn": "Power is defined as:",
            "options": [
              "Công thực hiện được trong một đơn vị thời gian: $\\mathcal{P} = \\frac{A}{t}$.",
              "Tích của công và thời gian thực hiện: $\\mathcal{P} = A \\cdot t$.",
              "Lực tác dụng lên một đơn vị diện tích.",
              "Quãng đường đi được trong một đơn vị thời gian."
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Công suất đặc trưng cho tốc độ sinh công: $\\mathcal{P} = \\frac{A}{t}$. Khi vật chuyển động đều với vận tốc $v$, công suất còn tính bằng $\\mathcal{P} = F \\cdot v$. Đơn vị là Watt (W).",
            "conceptTested": "Định nghĩa công suất",
            "textbookRef": "KNTT Bài 24 (Trang 95)"
          },
          {
            "id": "b24-q2",
            "question": "Một cần cẩu nâng thùng hàng có trọng lượng $2000\\text{ N}$ lên cao $6\\text{ m}$ trong thời gian $10\\text{ s}$. Công suất của cần cẩu là:",
            "questionEn": "A crane lifts a 2000 N cargo box by 6 m in 10 s. The power output is:",
            "options": [
              "$12000\\text{ W}$",
              "$1200\\text{ W}$",
              "$200\\text{ W}$",
              "$333\\text{ W}$"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Công thực hiện: $A = F \\cdot h = 2000 \\times 6 = 12000\\text{ J}$. Công suất: $\\mathcal{P} = \\frac{A}{t} = \\frac{12000}{10} = 1200\\text{ W}$.",
            "conceptTested": "Bài toán tính công suất cơ học",
            "textbookRef": "KNTT Bài 24 (Trang 96)"
          },
          {
            "id": "b24-q3",
            "question": "Một động cơ điện tiêu thụ công suất toàn phần $1000\\text{ W}$ và sinh ra công suất cơ học có ích là $850\\text{ W}$. Hiệu suất của động cơ là:",
            "questionEn": "An electric motor consumes 1000 W total power and delivers 850 W mechanical output. Its efficiency is:",
            "options": [
              "85%",
              "15%",
              "117%",
              "850%"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "$H = \\frac{\\mathcal{P}_{\\text{ích}}}{\\mathcal{P}_{\\text{toàn phần}}} \\times 100\\% = \\frac{850}{1000} \\times 100\\% = 85\\%$.",
            "conceptTested": "Tính hiệu suất động cơ",
            "textbookRef": "KNTT Bài 24 (Trang 98)"
          },
          {
            "id": "b24-q4",
            "question": "Một ô tô chạy trên đường nằm ngang với vận tốc không đổi $v = 20\\text{ m/s}$. Lực kéo của động cơ là $F = 1500\\text{ N}$. Công suất tức thời của động cơ là:",
            "questionEn": "A car moves at constant speed v = 20 m/s with driving force F = 1500 N. The instantaneous power is:",
            "options": [
              "30 kW",
              "75 W",
              "300 W",
              "7.5 kW"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "$\\mathcal{P} = F \\cdot v = 1500 \\times 20 = 30000\\text{ W} = 30\\text{ kW}$.",
            "conceptTested": "Công thức công suất P = F.v",
            "textbookRef": "KNTT Bài 24 (Trang 96)"
          }
        ],
        "available": true
      },
      {
        "id": "bai-26",
        "chapterId": "chuong-4",
        "lessonNum": 26,
        "number": 26,
        "title": "Cơ năng và định luật bảo toàn cơ năng",
        "titleEn": "Mechanical Energy and Conservation Law",
        "subtitle": "Cơ năng của vật trong trọng trường: W = Wd + Wt. Bảo toàn cơ năng khi chỉ có lực thế.",
        "subtitleEn": "Energy transformation between kinetic and potential energy in a simple pendulum.",
        "shortDesc": "Cơ năng của vật trong trọng trường: W = Wd + Wt. Bảo toàn cơ năng khi chỉ có lực thế.",
        "shortDescription": "Cơ năng của vật trong trọng trường: W = Wd + Wt. Bảo toàn cơ năng khi chỉ có lực thế.",
        "chapterTitle": "NĂNG LƯỢNG, CÔNG, CÔNG SUẤT",
        "labTag": "Mô phỏng Con lắc đơn & Biểu đồ Cơ năng thời gian thực",
        "labTagEn": "Pendulum and Real-time Energy Bar Lab",
        "knttRef": "KNTT Bài 26 (Trang 103)",
        "ctstRef": "CTST Bài 17 (Trang 107)",
        "simulationId": "energy-conservation",
        "labType": "freefall",
        "labTitle": "Bảo toàn Cơ năng của Con lắc đơn & Rơi tự do",
        "labDescription": "Theo dõi sự chuyển hóa qua lại giữa thế năng Wt và động năng Wd.",
        "virtualLabSpec": {
          "experimentName": "Bảo toàn Cơ năng của Con lắc đơn & Rơi tự do",
          "purpose": "Theo dõi sự chuyển hóa qua lại giữa thế năng Wt và động năng Wd.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Cơ năng của vật trong trọng trường: W = Wd + Wt. Bảo toàn cơ năng khi chỉ có lực thế.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 3,
          "labRoute": "/simulations/energy-conservation"
        },
        "sections": [
          {
            "title": "Khái niệm Cơ năng",
            "content": "Cơ năng của một vật là tổng động năng và thế năng của nó: $W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh$ (trong trọng trường)."
          },
          {
            "title": "Định luật bảo toàn cơ năng",
            "content": "Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực (không có ma sát hoặc lực cản tiêu hao), cơ năng của vật được bảo toàn:\n$W = W_đ + W_t = \\text{hằng số} = \\text{const}$.\n• Khi thế năng giảm, động năng tăng tương ứng và ngược lại.\n• Tại vị trí cao nhất: $W_t$ cực đại, $W_đ = 0$.\n• Tại vị trí thấp nhất (vị trí cân bằng): $W_đ$ cực đại, $W_t$ cực tiểu.",
            "keyTakeaway": "Ghi nhớ: Khi bỏ qua ma sát, tổng động năng và thế năng là một đại lượng bảo toàn: W = Wđ + Wt = const."
          }
        ],
        "theorySections": [
          {
            "title": "Khái niệm Cơ năng",
            "content": "Cơ năng của một vật là tổng động năng và thế năng của nó: $W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh$ (trong trọng trường)."
          },
          {
            "title": "Định luật bảo toàn cơ năng",
            "content": "Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực (không có ma sát hoặc lực cản tiêu hao), cơ năng của vật được bảo toàn:\n$W = W_đ + W_t = \\text{hằng số} = \\text{const}$.\n• Khi thế năng giảm, động năng tăng tương ứng và ngược lại.\n• Tại vị trí cao nhất: $W_t$ cực đại, $W_đ = 0$.\n• Tại vị trí thấp nhất (vị trí cân bằng): $W_đ$ cực đại, $W_t$ cực tiểu.",
            "keyTakeaway": "Ghi nhớ: Khi bỏ qua ma sát, tổng động năng và thế năng là một đại lượng bảo toàn: W = Wđ + Wt = const."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Bảo toàn cơ năng",
            "latex": "W = \\frac{1}{2}mv^2 + mgh = \\text{const}",
            "unit": "Joule (J)",
            "notes": "Tổng năng lượng cơ học được bảo toàn khi chỉ có lực thế sinh công."
          },
          {
            "name": "Vận tốc cực đại tại đáy",
            "latex": "v_{max} = \\sqrt{2gh}",
            "unit": "m/s",
            "notes": "Vận tốc vật đạt được khi chuyển hóa toàn bộ thế năng độ cao h thành động năng."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Khái niệm Cơ năng",
              "content": "Cơ năng của một vật là tổng động năng và thế năng của nó: $W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh$ (trong trọng trường)."
            },
            {
              "num": 2,
              "heading": "Định luật bảo toàn cơ năng",
              "content": "Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực (không có ma sát hoặc lực cản tiêu hao), cơ năng của vật được bảo toàn:\n$W = W_đ + W_t = \\text{hằng số} = \\text{const}$.\n• Khi thế năng giảm, động năng tăng tương ứng và ngược lại.\n• Tại vị trí cao nhất: $W_t$ cực đại, $W_đ = 0$.\n• Tại vị trí thấp nhất (vị trí cân bằng): $W_đ$ cực đại, $W_t$ cực tiểu.",
              "keyTakeaway": "Ghi nhớ: Khi bỏ qua ma sát, tổng động năng và thế năng là một đại lượng bảo toàn: W = Wđ + Wt = const."
            }
          ],
          "ghiNho": "Ghi nhớ: Khi bỏ qua ma sát, tổng động năng và thế năng là một đại lượng bảo toàn: W = Wđ + Wt = const.",
          "part2_formulas": [
            {
              "formula": "W = \\frac{1}{2}mv^2 + mgh = \\text{const}",
              "quantity": "Bảo toàn cơ năng",
              "symbol": "W",
              "unit": "Joule (J)",
              "meaning": "Tổng năng lượng cơ học được bảo toàn khi chỉ có lực thế sinh công."
            },
            {
              "formula": "v_{max} = \\sqrt{2gh}",
              "quantity": "Vận tốc cực đại tại đáy",
              "symbol": "v_{max}",
              "unit": "m/s",
              "meaning": "Vận tốc vật đạt được khi chuyển hóa toàn bộ thế năng độ cao h thành động năng."
            }
          ],
          "part3_applications": [
            "Thiết kế đường ray tàu lượn siêu tốc: độ cao của đỉnh dốc đầu tiên luôn phải lớn nhất để tích lũy đủ thế năng.",
            "Nguyên lí hoạt động của đập thủy điện tích trữ thế năng nước để quay tuabin phát điện."
          ]
        },
        "quizzes": [
          {
            "id": "q_b26_1",
            "question": "Khi quả nặng con lắc đơn đi qua vị trí cân bằng (vị trí thấp nhất O), phát biểu nào sau đây ĐÚNG?",
            "questionEn": "When a pendulum bob passes the lowest point O, which statement is true?",
            "options": [
              "Thế năng cực đại, động năng bằng 0",
              "Động năng cực đại, thế năng cực tiểu (bằng 0 nếu chọn mốc tại O)",
              "Cả động năng và thế năng đều bằng 0",
              "Vận tốc của quả nặng triệt tiêu"
            ],
            "correctIndex": 1,
            "explanation": "Ở vị trí thấp nhất, độ cao h = 0 nên Wt = 0. Toàn bộ cơ năng chuyển hóa thành động năng cực đại: Wđ = 1/2 m v_max².",
            "conceptTested": "Chuyển hóa động năng - thế năng",
            "textbookRef": "KNTT Bài 26 (Trang 103)",
            "correctAnswer": 1
          },
          {
            "id": "q_b26_2",
            "question": "Định luật bảo toàn cơ năng nghiệm đúng trong trường hợp nào?",
            "questionEn": "Conservation of mechanical energy holds strictly when:",
            "options": [
              "Vật chuyển động có lực ma sát lớn",
              "Vật chỉ chịu tác dụng của lực thế (như trọng lực, lực đàn hồi), không có ma sát",
              "Vật chuyển động dưới tác dụng của động cơ đốt trong",
              "Vật rơi trong môi trường nước có lực cản"
            ],
            "correctIndex": 1,
            "explanation": "Cơ năng chỉ bảo toàn khi hệ chỉ có lực thế tác dụng. Các lực ma sát và cản là lực không thế sẽ làm hao tán cơ năng thành nhiệt.",
            "conceptTested": "Điều kiện bảo toàn cơ năng",
            "textbookRef": "KNTT Bài 26 (Trang 104)",
            "correctAnswer": 1
          },
          {
            "id": "q_b26_3",
            "question": "Thả rơi tự do một vật 1 kg từ độ cao 20 m xuống đất (g = 10 m/s²). Bỏ qua sức cản. Vận tốc của vật ngay trước khi chạm đất là:",
            "questionEn": "A 1 kg object is dropped from 20 m (g = 10 m/s²). Its speed just before landing is:",
            "options": [
              "10 m/s",
              "20 m/s",
              "40 m/s",
              "200 m/s"
            ],
            "correctIndex": 1,
            "explanation": "Bảo toàn cơ năng: mgh = 1/2 m v² => v = √(2gh) = √(2 · 10 · 20) = √400 = 20 m/s.",
            "conceptTested": "Tính vận tốc chạm đất bằng bảo toàn cơ năng",
            "textbookRef": "KNTT Bài 26 (Trang 105)",
            "correctAnswer": 1
          },
          {
            "id": "q_b26_4",
            "question": "Tại vị trí mà động năng bằng 3 lần thế năng (Wđ = 3 Wt), tỉ số giữa thế năng và cơ năng là:",
            "questionEn": "Where kinetic energy is 3 times potential energy (Wk = 3 Wp), the ratio Wp / W is:",
            "options": [
              "1/3",
              "1/4",
              "3/4",
              "1/2"
            ],
            "correctIndex": 1,
            "explanation": "Cơ năng W = Wđ + Wt = 3Wt + Wt = 4Wt => Wt = W / 4, tức Wt / W = 1/4.",
            "conceptTested": "Tỉ lệ động năng và thế năng",
            "textbookRef": "KNTT Bài 26 (Trang 105)",
            "correctAnswer": 1
          },
          {
            "id": "q_b26_5",
            "question": "Khi có lực ma sát cản trở chuyển động của vật, đại lượng nào sau đây KHÔNG đổi?",
            "questionEn": "When friction opposes motion, which quantity is conserved?",
            "options": [
              "Cơ năng của vật",
              "Động năng của vật",
              "Năng lượng toàn phần của hệ (bao gồm cơ năng và nhiệt năng)",
              "Thế năng của vật"
            ],
            "correctIndex": 2,
            "explanation": "Theo định luật bảo toàn và chuyển hóa năng lượng, năng lượng toàn phần luôn được bảo toàn (phần cơ năng mất đi chuyển thành nhiệt năng làm nóng vật và môi trường).",
            "conceptTested": "Định luật bảo toàn năng lượng toàn phần",
            "textbookRef": "KNTT Bài 27 (Trang 108)",
            "correctAnswer": 2
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuong-5",
    "number": 5,
    "romanNumeral": "V",
    "title": "ĐỘNG LƯỢNG",
    "titleEn": "MOMENTUM",
    "description": "Động lượng, xung lượng của lực, định luật bảo toàn động lượng và các bài toán va chạm.",
    "lessons": [
      {
        "id": "bai-28",
        "chapterId": "chuong-5",
        "lessonNum": 28,
        "number": 28,
        "title": "Động lượng & Xung lượng của lực",
        "titleEn": "Linear Momentum and Impulse",
        "subtitle": "Vectơ động lượng p = m.v và độ biến thiên động lượng Delta p = F.Delta t.",
        "subtitleEn": "Momentum vector p = m·v and impulse of force Delta p = F·Delta t.",
        "shortDesc": "Vectơ động lượng p = m.v và độ biến thiên động lượng Delta p = F.Delta t.",
        "shortDescription": "Vectơ động lượng p = m.v và độ biến thiên động lượng Delta p = F.Delta t.",
        "chapterTitle": "ĐỘNG LƯỢNG",
        "labTag": "Đo động lượng của hai xe va chạm trên đệm khí",
        "labTagEn": "Momentum & Force Impulse Measurement",
        "knttRef": "KNTT Bài 28 (Trang 110)",
        "ctstRef": "CTST Bài 18 (Trang 114)",
        "simulationId": "momentum-collision",
        "labType": "motion",
        "labTitle": "Đo động lượng của hai xe va chạm trên đệm khí",
        "labDescription": "Kiểm chứng mối liên hệ giữa xung lượng của lực và độ biến thiên động lượng.",
        "virtualLabSpec": {
          "experimentName": "Đo động lượng của hai xe va chạm trên đệm khí",
          "purpose": "Kiểm chứng mối liên hệ giữa xung lượng của lực và độ biến thiên động lượng.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Vectơ động lượng p = m.v và độ biến thiên động lượng Delta p = F.Delta t.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 4,
          "labRoute": "/simulations/momentum-collision"
        },
        "sections": [
          {
            "title": "1. Động lượng (Linear Momentum)",
            "content": "Động lượng của một vật khối lượng $m$ đang chuyển động với vận tốc $\\vec{v}$ là một đại lượng vectơ cùng hướng với vận tốc và được xác định bởi công thức:\n$$\\vec{p} = m \\vec{v}$$\n* Đơn vị của động lượng trong hệ SI là kilôgam mét trên giây ($\\text{kg}\\cdot\\text{m/s}$) hoặc Newton giây ($\\text{N}\\cdot\\text{s}$).",
            "keyTakeaway": "Vectơ động lượng p = m.v đặc trưng cho khả năng truyền chuyển động của vật thể."
          },
          {
            "title": "2. Xung lượng của lực và Độ biến thiên động lượng",
            "content": "Khi một lực $\\vec{F}$ không đổi tác dụng lên vật trong khoảng thời gian $\\Delta t$, tích $\\vec{F} \\cdot \\Delta t$ được gọi là **xung lượng của lực**.\n\nXung lượng của lực tác dụng lên vật bằng độ biến thiên động lượng của vật:\n$$\\vec{F} \\cdot \\Delta t = \\Delta \\vec{p} = \\vec{p}_2 - \\vec{p}_1 = m \\vec{v}_2 - m \\vec{v}_1$$\n* Để giảm lực tác động va chạm $F = \\frac{\\Delta p}{\\Delta t}$, ta cần kéo dài thời gian va chạm $\\Delta t$.",
            "keyTakeaway": "Xung lượng của lực bằng độ biến thiên động lượng: F.Delta t = Delta p."
          }
        ],
        "theorySections": [
          {
            "title": "1. Động lượng (Linear Momentum)",
            "content": "Động lượng của một vật khối lượng $m$ đang chuyển động với vận tốc $\\vec{v}$ là một đại lượng vectơ cùng hướng với vận tốc và được xác định bởi công thức:\n$$\\vec{p} = m \\vec{v}$$\n* Đơn vị của động lượng trong hệ SI là kilôgam mét trên giây ($\\text{kg}\\cdot\\text{m/s}$) hoặc Newton giây ($\\text{N}\\cdot\\text{s}$).",
            "keyTakeaway": "Vectơ động lượng p = m.v đặc trưng cho khả năng truyền chuyển động của vật thể."
          },
          {
            "title": "2. Xung lượng của lực và Độ biến thiên động lượng",
            "content": "Khi một lực $\\vec{F}$ không đổi tác dụng lên vật trong khoảng thời gian $\\Delta t$, tích $\\vec{F} \\cdot \\Delta t$ được gọi là **xung lượng của lực**.\n\nXung lượng của lực tác dụng lên vật bằng độ biến thiên động lượng của vật:\n$$\\vec{F} \\cdot \\Delta t = \\Delta \\vec{p} = \\vec{p}_2 - \\vec{p}_1 = m \\vec{v}_2 - m \\vec{v}_1$$\n* Để giảm lực tác động va chạm $F = \\frac{\\Delta p}{\\Delta t}$, ta cần kéo dài thời gian va chạm $\\Delta t$.",
            "keyTakeaway": "Xung lượng của lực bằng độ biến thiên động lượng: F.Delta t = Delta p."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Động lượng",
            "latex": "\\vec{p} = m\\vec{v}",
            "unit": "kg·m/s",
            "notes": "Đại lượng vectơ bằng tích khối lượng và vận tốc của vật."
          },
          {
            "name": "Xung lượng của lực",
            "latex": "\\vec{F} \\cdot \\Delta t = \\Delta \\vec{p}",
            "unit": "N·s",
            "notes": "Xung lượng của lực gây ra độ biến thiên động lượng của vật."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Động lượng (Linear Momentum)",
              "content": "Động lượng của một vật khối lượng $m$ đang chuyển động với vận tốc $\\vec{v}$ là một đại lượng vectơ cùng hướng với vận tốc và được xác định bởi công thức:\n$$\\vec{p} = m \\vec{v}$$\n* Đơn vị của động lượng trong hệ SI là kilôgam mét trên giây ($\\text{kg}\\cdot\\text{m/s}$) hoặc Newton giây ($\\text{N}\\cdot\\text{s}$).",
              "keyTakeaway": "Vectơ động lượng p = m.v đặc trưng cho khả năng truyền chuyển động của vật thể."
            },
            {
              "num": 2,
              "heading": "2. Xung lượng của lực và Độ biến thiên động lượng",
              "content": "Khi một lực $\\vec{F}$ không đổi tác dụng lên vật trong khoảng thời gian $\\Delta t$, tích $\\vec{F} \\cdot \\Delta t$ được gọi là **xung lượng của lực**.\n\nXung lượng của lực tác dụng lên vật bằng độ biến thiên động lượng của vật:\n$$\\vec{F} \\cdot \\Delta t = \\Delta \\vec{p} = \\vec{p}_2 - \\vec{p}_1 = m \\vec{v}_2 - m \\vec{v}_1$$\n* Để giảm lực tác động va chạm $F = \\frac{\\Delta p}{\\Delta t}$, ta cần kéo dài thời gian va chạm $\\Delta t$.",
              "keyTakeaway": "Xung lượng của lực bằng độ biến thiên động lượng: F.Delta t = Delta p."
            }
          ],
          "ghiNho": "Vectơ động lượng p = m.v đặc trưng cho khả năng truyền chuyển động của vật thể. Xung lượng của lực bằng độ biến thiên động lượng: F.Delta t = Delta p.",
          "part2_formulas": [
            {
              "formula": "\\vec{p} = m\\vec{v}",
              "quantity": "Động lượng",
              "symbol": "\\vec{p}",
              "unit": "kg·m/s",
              "meaning": "Đại lượng vectơ bằng tích khối lượng và vận tốc của vật."
            },
            {
              "formula": "\\vec{F} \\cdot \\Delta t = \\Delta \\vec{p}",
              "quantity": "Xung lượng của lực",
              "symbol": "\\vec{F} \\cdot \\Delta t",
              "unit": "N·s",
              "meaning": "Xung lượng của lực gây ra độ biến thiên động lượng của vật."
            }
          ],
          "part3_applications": [
            "Túi khí an toàn và vùng hấp thụ xung lực (crumple zones) trên ô tô kéo dài thời gian va chạm Delta t để giảm thiểu lực tác dụng F lên người.",
            "Vận động viên nhảy cao tiếp đất trên đệm mút dày để giảm chấn thương."
          ]
        },
        "quizzes": [
          {
            "id": "b28-q1",
            "question": "Vectơ động lượng $\\vec{p}$ của một vật khối lượng $m$ chuyển động với vận tốc $\\vec{v}$ được xác định bởi:",
            "questionEn": "The momentum vector p of an object of mass m and velocity v is:",
            "options": [
              "$\\vec{p} = m \\vec{v}$",
              "$\\vec{p} = \\frac{1}{2}m v^2$",
              "$\\vec{p} = \\frac{\\vec{v}}{m}$",
              "$\\vec{p} = m \\vec{a}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Động lượng: $\\vec{p} = m \\vec{v}$. Vectơ động lượng luôn cùng hướng với vectơ vận tốc $\\vec{v}$. Đơn vị: $\\text{kg}\\cdot\\text{m/s}$.",
            "conceptTested": "Định nghĩa vectơ động lượng",
            "textbookRef": "KNTT Bài 28 (Trang 110)"
          },
          {
            "id": "b28-q2",
            "question": "Độ biến thiên động lượng của một vật trong khoảng thời gian $\\Delta t$ liên hệ với hợp lực tác dụng theo biểu thức:",
            "questionEn": "The change in momentum over time Delta t is related to net force by:",
            "options": [
              "$\\Delta \\vec{p} = \\vec{F} \\cdot \\Delta t$",
              "$\\Delta \\vec{p} = \\frac{\\vec{F}}{\\Delta t}$",
              "$\\Delta \\vec{p} = \\frac{\\Delta t}{\\vec{F}}$",
              "$\\Delta \\vec{p} = m \\cdot \\Delta t$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Xung lượng của lực bằng độ biến thiên động lượng: $\\vec{F}\\Delta t = \\Delta \\vec{p}$.",
            "conceptTested": "Dạng tổng quát của định luật 2 Newton",
            "textbookRef": "KNTT Bài 28 (Trang 111)"
          },
          {
            "id": "b28-q3",
            "question": "Một quả bóng tennis khối lượng $m = 0{,}06\\text{ kg}$ bay với vận tốc $v_1 = 20\\text{ m/s}$ đập vuông góc vào tường và bật ngược trở lại với vận tốc $v_2 = 20\\text{ m/s}$. Độ biến thiên động lượng của quả bóng có độ lớn là:",
            "questionEn": "A 0.06 kg tennis ball strikes a wall at 20 m/s and rebounds at 20 m/s. The magnitude of change in momentum is:",
            "options": [
              "$2{,}4\\text{ kg}\\cdot\\text{m/s}$",
              "$0\\text{ kg}\\cdot\\text{m/s}$",
              "$1{,}2\\text{ kg}\\cdot\\text{m/s}$",
              "$4{,}8\\text{ kg}\\cdot\\text{m/s}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Chọn chiều dương là chiều bật lại: $\\Delta p = p_2 - p_1 = m v_2 - m(-v_1) = m(v_1 + v_2) = 0{,}06 \\times (20 + 20) = 2{,}4\\text{ kg}\\cdot\\text{m/s}$.",
            "conceptTested": "Tính độ biến thiên động lượng khi va chạm",
            "textbookRef": "KNTT Bài 28 (Trang 112)"
          },
          {
            "id": "b28-q4",
            "question": "Tại sao khi rơi từ trên cao xuống đất, người ta luôn chùng gối khi chân chạm đất?",
            "questionEn": "Why do athletes bend their knees when landing from a jump?",
            "options": [
              "Để giảm độ biến thiên động lượng $\\Delta p$",
              "Để tăng thời gian va chạm $\\Delta t$, từ đó giảm lực phản lực $F$ tác dụng lên chân",
              "Để tăng gia tốc trọng trường $g$",
              "Để giữ cho khối lượng cơ thể không đổi"
            ],
            "correctIndex": 1,
            "correctAnswer": 1,
            "explanation": "Do $\\Delta p$ không đổi khi dừng lại, chùng gối làm tăng thời gian hãm $\\Delta t$, do đó lực tác dụng $F = \\frac{\\Delta p}{\\Delta t}$ giảm mạnh, tránh gãy xương hoặc chấn thương khớp.",
            "conceptTested": "Ứng dụng xung lượng trong giảm chấn",
            "textbookRef": "KNTT Bài 28 (Trang 113)"
          }
        ],
        "available": true
      },
      {
        "id": "bai-29",
        "chapterId": "chuong-5",
        "lessonNum": 29,
        "number": 29,
        "title": "Bảo toàn động lượng & Va chạm đệm khí",
        "titleEn": "Momentum Conservation & Air Track Collisions",
        "subtitle": "Bảo toàn động lượng của hệ kín (cô lập): p_he = const. Va chạm mềm và va chạm đàn hồi.",
        "subtitleEn": "Isolated system, vector momentum p = m·v, elastic vs inelastic collisions.",
        "shortDesc": "Bảo toàn động lượng của hệ kín (cô lập): p_he = const. Va chạm mềm và va chạm đàn hồi.",
        "shortDescription": "Bảo toàn động lượng của hệ kín (cô lập): p_he = const. Va chạm mềm và va chạm đàn hồi.",
        "chapterTitle": "ĐỘNG LƯỢNG",
        "labTag": "Mô phỏng Đệm khí: Va chạm đàn hồi & Va chạm mềm",
        "labTagEn": "Air Track Elastic and Inelastic Collisions Lab",
        "knttRef": "KNTT Bài 29 (Trang 115)",
        "ctstRef": "CTST Bài 19 (Trang 118)",
        "simulationId": "momentum-collision",
        "labType": "motion",
        "labTitle": "Thực hành Va chạm đàn hồi & Va chạm mềm",
        "labDescription": "Kiểm chứng nguyên lí chuyển động bằng phản lực và súng giật.",
        "virtualLabSpec": {
          "experimentName": "Thực hành Va chạm đàn hồi & Va chạm mềm",
          "purpose": "Kiểm chứng nguyên lí chuyển động bằng phản lực và súng giật.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Bảo toàn động lượng của hệ kín (cô lập): p_he = const. Va chạm mềm và va chạm đàn hồi.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 4,
          "labRoute": "/simulations/momentum-collision"
        },
        "sections": [
          {
            "title": "Định nghĩa Động lượng",
            "content": "Động lượng của một vật là đại lượng véc-tơ bằng tích của khối lượng và vận tốc của vật: $\\vec{p} = m\\vec{v}$. Đơn vị đo là $kg\\cdot m/s$ hoặc $N\\cdot s$."
          },
          {
            "title": "Định luật bảo toàn động lượng trong hệ kín",
            "content": "Trong một hệ kín (không chịu ngoại lực hoặc tổng ngoại lực triệt tiêu), tổng động lượng của hệ được bảo toàn:\n$\\vec{p}_{hệ} = \\vec{p}_1 + \\vec{p}_2 = \\text{const}$."
          },
          {
            "title": "Phân biệt hai loại va chạm cơ bản",
            "content": "• **Va chạm đàn hồi**: Động lượng bảo toàn VÀ động năng của hệ cũng được bảo toàn.\n• **Va chạm mềm (không đàn hồi)**: Sau va chạm hai vật dính vào nhau và chuyển động cùng vận tốc $v = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$. Động lượng bảo toàn nhưng một phần động năng biến thành nhiệt năng.",
            "keyTakeaway": "Ghi nhớ: Trong mọi va chạm của hệ kín (dù đàn hồi hay va chạm mềm), tổng động lượng luôn luôn được bảo toàn."
          }
        ],
        "theorySections": [
          {
            "title": "Định nghĩa Động lượng",
            "content": "Động lượng của một vật là đại lượng véc-tơ bằng tích của khối lượng và vận tốc của vật: $\\vec{p} = m\\vec{v}$. Đơn vị đo là $kg\\cdot m/s$ hoặc $N\\cdot s$."
          },
          {
            "title": "Định luật bảo toàn động lượng trong hệ kín",
            "content": "Trong một hệ kín (không chịu ngoại lực hoặc tổng ngoại lực triệt tiêu), tổng động lượng của hệ được bảo toàn:\n$\\vec{p}_{hệ} = \\vec{p}_1 + \\vec{p}_2 = \\text{const}$."
          },
          {
            "title": "Phân biệt hai loại va chạm cơ bản",
            "content": "• **Va chạm đàn hồi**: Động lượng bảo toàn VÀ động năng của hệ cũng được bảo toàn.\n• **Va chạm mềm (không đàn hồi)**: Sau va chạm hai vật dính vào nhau và chuyển động cùng vận tốc $v = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$. Động lượng bảo toàn nhưng một phần động năng biến thành nhiệt năng.",
            "keyTakeaway": "Ghi nhớ: Trong mọi va chạm của hệ kín (dù đàn hồi hay va chạm mềm), tổng động lượng luôn luôn được bảo toàn."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Bảo toàn động lượng va chạm đàn hồi",
            "latex": "m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}'_1 + m_2 \\vec{v}'_2",
            "unit": "kg·m/s",
            "notes": "Tổng động lượng trước va chạm bằng tổng động lượng sau va chạm."
          },
          {
            "name": "Vận tốc sau va chạm mềm",
            "latex": "v_{chung} = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}",
            "unit": "m/s",
            "notes": "Vận tốc hai vật cùng chuyển động sau khi dính liền vào nhau."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Định nghĩa Động lượng",
              "content": "Động lượng của một vật là đại lượng véc-tơ bằng tích của khối lượng và vận tốc của vật: $\\vec{p} = m\\vec{v}$. Đơn vị đo là $kg\\cdot m/s$ hoặc $N\\cdot s$."
            },
            {
              "num": 2,
              "heading": "Định luật bảo toàn động lượng trong hệ kín",
              "content": "Trong một hệ kín (không chịu ngoại lực hoặc tổng ngoại lực triệt tiêu), tổng động lượng của hệ được bảo toàn:\n$\\vec{p}_{hệ} = \\vec{p}_1 + \\vec{p}_2 = \\text{const}$."
            },
            {
              "num": 3,
              "heading": "Phân biệt hai loại va chạm cơ bản",
              "content": "• **Va chạm đàn hồi**: Động lượng bảo toàn VÀ động năng của hệ cũng được bảo toàn.\n• **Va chạm mềm (không đàn hồi)**: Sau va chạm hai vật dính vào nhau và chuyển động cùng vận tốc $v = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$. Động lượng bảo toàn nhưng một phần động năng biến thành nhiệt năng.",
              "keyTakeaway": "Ghi nhớ: Trong mọi va chạm của hệ kín (dù đàn hồi hay va chạm mềm), tổng động lượng luôn luôn được bảo toàn."
            }
          ],
          "ghiNho": "Ghi nhớ: Trong mọi va chạm của hệ kín (dù đàn hồi hay va chạm mềm), tổng động lượng luôn luôn được bảo toàn.",
          "part2_formulas": [
            {
              "formula": "m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}'_1 + m_2 \\vec{v}'_2",
              "quantity": "Bảo toàn động lượng va chạm đàn hồi",
              "symbol": "\\vec{p}",
              "unit": "kg·m/s",
              "meaning": "Tổng động lượng trước va chạm bằng tổng động lượng sau va chạm."
            },
            {
              "formula": "v_{chung} = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}",
              "quantity": "Vận tốc sau va chạm mềm",
              "symbol": "v_{chung}",
              "unit": "m/s",
              "meaning": "Vận tốc hai vật cùng chuyển động sau khi dính liền vào nhau."
            }
          ],
          "part3_applications": [
            "Hiện tượng giật lùi của súng khi bắn đạn (nguyên lí chuyển động bằng phản lực).",
            "Túi khí ô tô và vùng đầu xe hấp thụ xung lực khi va chạm giao thông."
          ]
        },
        "quizzes": [
          {
            "id": "q_b29_1",
            "question": "Đơn vị đo chuẩn của động lượng trong hệ đo lường SI là:",
            "questionEn": "The standard SI unit of momentum is:",
            "options": [
              "N / m",
              "kg · m / s (hoặc N · s)",
              "Joule (J)",
              "kg · m² / s"
            ],
            "correctIndex": 1,
            "explanation": "p = m · v nên đơn vị là kg · m/s. Theo định lí biến thiên động lượng Δp = F · Δt nên cũng tương đương đơn vị N · s.",
            "conceptTested": "Đơn vị động lượng",
            "textbookRef": "KNTT Bài 28 (Trang 112)",
            "correctAnswer": 1
          },
          {
            "id": "q_b29_2",
            "question": "Trong một hệ kín chỉ gồm hai vật tương tác va chạm với nhau, phát biểu nào sau đây luôn đúng?",
            "questionEn": "In an isolated system of two colliding objects, which statement is always true?",
            "options": [
              "Động năng của mỗi vật không đổi",
              "Vận tốc của mỗi vật không đổi",
              "Tổng động lượng của hệ được bảo toàn",
              "Tổng cơ năng của hệ luôn tăng lên"
            ],
            "correctIndex": 2,
            "explanation": "SGK KNTT Bài 29 (Trang 115): Đối với hệ kín, tổng véc-tơ động lượng của hệ trước và sau va chạm luôn không đổi.",
            "conceptTested": "Định luật bảo toàn động lượng",
            "textbookRef": "KNTT Bài 29 (Trang 115)",
            "correctAnswer": 2
          },
          {
            "id": "q_b29_3",
            "question": "Xe 1 có khối lượng 1 kg chuyển động với v₁ = 3 m/s đến va chạm mềm dính vào xe 2 khối lượng 2 kg đang đứng yên. Vận tốc của hai xe sau va chạm là:",
            "questionEn": "A 1 kg cart at 3 m/s collides and sticks to a 2 kg stationary cart. Their speed after collision is:",
            "options": [
              "1,0 m/s",
              "1,5 m/s",
              "2,0 m/s",
              "3,0 m/s"
            ],
            "correctIndex": 0,
            "explanation": "Bảo toàn động lượng: m₁v₁ = (m₁ + m₂)V => V = (1 · 3) / (1 + 2) = 3 / 3 = 1,0 m/s.",
            "conceptTested": "Tính toán va chạm mềm",
            "textbookRef": "KNTT Bài 29 (Trang 117)",
            "correctAnswer": 0
          },
          {
            "id": "q_b29_4",
            "question": "Hiện tượng súng bị giật lùi về phía sau khi bắn đạn về phía trước được giải thích bằng:",
            "questionEn": "Recoil of a gun upon firing is explained by:",
            "options": [
              "Định luật bảo toàn cơ năng",
              "Định luật bảo toàn động lượng (chuyển động bằng phản lực)",
              "Định luật vạn vật hấp dẫn",
              "Sự nở vì nhiệt của nòng súng"
            ],
            "correctIndex": 1,
            "explanation": "Trước khi bắn, hệ súng và đạn đứng yên (p = 0). Khi bắn, đạn bay về phía trước với động lượng p_đạn thì súng giật lùi với p_súng = -p_đạn để tổng động lượng vẫn bằng 0.",
            "conceptTested": "Chuyển động bằng phản lực",
            "textbookRef": "KNTT Bài 29 (Trang 116)",
            "correctAnswer": 1
          },
          {
            "id": "q_b29_5",
            "question": "Đặc điểm khác biệt cốt lõi giữa va chạm đàn hồi và va chạm mềm là:",
            "questionEn": "The key difference between elastic and inelastic collision is:",
            "options": [
              "Va chạm đàn hồi bảo toàn cả động lượng và động năng; va chạm mềm chỉ bảo toàn động lượng",
              "Va chạm đàn hồi không bảo toàn động lượng",
              "Va chạm mềm làm tăng động năng của hệ",
              "Không có sự khác nhau nào"
            ],
            "correctIndex": 0,
            "explanation": "Trong va chạm đàn hồi, động năng không bị tổn hao. Trong va chạm mềm, động năng bị tiêu tán một phần thành nhiệt năng và biến dạng.",
            "conceptTested": "Phân biệt va chạm đàn hồi và mềm",
            "textbookRef": "KNTT Bài 29 (Trang 117)",
            "correctAnswer": 0
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuong-6",
    "number": 6,
    "romanNumeral": "VI",
    "title": "CHUYỂN ĐỘNG TRÒN",
    "titleEn": "CIRCULAR MOTION",
    "description": "Động học chuyển động tròn đều, tốc độ góc, chu kì, tần số, gia tốc hướng tâm và lực hướng tâm.",
    "lessons": [
      {
        "id": "bai-31",
        "chapterId": "chuong-6",
        "lessonNum": 31,
        "number": 31,
        "title": "Động học chuyển động tròn đều & Lực hướng tâm",
        "titleEn": "Uniform Circular Motion & Centripetal Force",
        "subtitle": "Độ dịch chuyển góc, tốc độ góc omega, chu kì T, tần số f và liên hệ v = omega.r.",
        "subtitleEn": "Angular speed omega, period T, frequency f, centripetal acceleration and force.",
        "shortDesc": "Độ dịch chuyển góc, tốc độ góc omega, chu kì T, tần số f và liên hệ v = omega.r.",
        "shortDescription": "Độ dịch chuyển góc, tốc độ góc omega, chu kì T, tần số f và liên hệ v = omega.r.",
        "chapterTitle": "CHUYỂN ĐỘNG TRÒN",
        "labTag": "Mô phỏng Bàn quay Tròn đều & Lực hướng tâm",
        "labTagEn": "Turntable and Centripetal Force Simulation",
        "knttRef": "KNTT Bài 31-32 (Trang 123-128)",
        "ctstRef": "CTST Bài 20-21 (Trang 126-130)",
        "simulationId": "circular-motion",
        "labType": "motion",
        "labTitle": "Mô phỏng Bàn quay Tròn đều & Tốc độ góc",
        "labDescription": "Quan sát vệt quét của vật trên đĩa quay ở các bán kính khác nhau.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Bàn quay Tròn đều & Tốc độ góc",
          "purpose": "Quan sát vệt quét của vật trên đĩa quay ở các bán kính khác nhau.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Độ dịch chuyển góc, tốc độ góc omega, chu kì T, tần số f và liên hệ v = omega.r.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 5,
          "labRoute": "/simulations/circular-motion"
        },
        "sections": [
          {
            "title": "Đại lượng đặc trưng của chuyển động tròn đều",
            "content": "• **Tốc độ góc** $\\omega = \\frac{\\Delta\\theta}{\\Delta t}$ (rad/s).\n• **Chu kì T**: Thời gian quay hết 1 vòng: $T = \\frac{2\\pi}{\\omega}$.\n• **Tần số f**: Số vòng quay trong 1 giây: $f = \\frac{1}{T} = \\frac{\\omega}{2\\pi}$ (Hz).\n• Mối liên hệ tốc độ dài và tốc độ góc: $v = \\omega \\cdot r$."
          },
          {
            "title": "Gia tốc hướng tâm và Lực hướng tâm",
            "content": "Trong chuyển động tròn đều, tuy độ lớn vận tốc không đổi nhưng hướng véc-tơ vận tốc liên tục đổi, sinh ra **gia tốc hướng tâm** hướng về tâm quỹ đạo:\n$a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.\nHợp lực tác dụng lên vật chuyển động tròn đều đóng vai trò là **lực hướng tâm**: $F_{ht} = m a_{ht} = m\\frac{v^2}{r} = m\\omega^2 r$.",
            "keyTakeaway": "Ghi nhớ: Véc-tơ gia tốc hướng tâm luôn vuông góc với véc-tơ vận tốc tức thời và luôn hướng vào tâm đường tròn."
          }
        ],
        "theorySections": [
          {
            "title": "Đại lượng đặc trưng của chuyển động tròn đều",
            "content": "• **Tốc độ góc** $\\omega = \\frac{\\Delta\\theta}{\\Delta t}$ (rad/s).\n• **Chu kì T**: Thời gian quay hết 1 vòng: $T = \\frac{2\\pi}{\\omega}$.\n• **Tần số f**: Số vòng quay trong 1 giây: $f = \\frac{1}{T} = \\frac{\\omega}{2\\pi}$ (Hz).\n• Mối liên hệ tốc độ dài và tốc độ góc: $v = \\omega \\cdot r$."
          },
          {
            "title": "Gia tốc hướng tâm và Lực hướng tâm",
            "content": "Trong chuyển động tròn đều, tuy độ lớn vận tốc không đổi nhưng hướng véc-tơ vận tốc liên tục đổi, sinh ra **gia tốc hướng tâm** hướng về tâm quỹ đạo:\n$a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.\nHợp lực tác dụng lên vật chuyển động tròn đều đóng vai trò là **lực hướng tâm**: $F_{ht} = m a_{ht} = m\\frac{v^2}{r} = m\\omega^2 r$.",
            "keyTakeaway": "Ghi nhớ: Véc-tơ gia tốc hướng tâm luôn vuông góc với véc-tơ vận tốc tức thời và luôn hướng vào tâm đường tròn."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Lực hướng tâm",
            "latex": "F_{ht} = m\\frac{v^2}{r} = m\\omega^2 r",
            "unit": "Newton (N)",
            "notes": "Hợp lực giữ cho vật chuyển động cong tròn theo bán kính r."
          },
          {
            "name": "Liên hệ tốc độ dài và tốc độ góc",
            "latex": "v = \\omega \\cdot r",
            "unit": "m/s",
            "notes": "Tốc độ tiếp tuyến tại điểm cách tâm một khoảng r."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Đại lượng đặc trưng của chuyển động tròn đều",
              "content": "• **Tốc độ góc** $\\omega = \\frac{\\Delta\\theta}{\\Delta t}$ (rad/s).\n• **Chu kì T**: Thời gian quay hết 1 vòng: $T = \\frac{2\\pi}{\\omega}$.\n• **Tần số f**: Số vòng quay trong 1 giây: $f = \\frac{1}{T} = \\frac{\\omega}{2\\pi}$ (Hz).\n• Mối liên hệ tốc độ dài và tốc độ góc: $v = \\omega \\cdot r$."
            },
            {
              "num": 2,
              "heading": "Gia tốc hướng tâm và Lực hướng tâm",
              "content": "Trong chuyển động tròn đều, tuy độ lớn vận tốc không đổi nhưng hướng véc-tơ vận tốc liên tục đổi, sinh ra **gia tốc hướng tâm** hướng về tâm quỹ đạo:\n$a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.\nHợp lực tác dụng lên vật chuyển động tròn đều đóng vai trò là **lực hướng tâm**: $F_{ht} = m a_{ht} = m\\frac{v^2}{r} = m\\omega^2 r$.",
              "keyTakeaway": "Ghi nhớ: Véc-tơ gia tốc hướng tâm luôn vuông góc với véc-tơ vận tốc tức thời và luôn hướng vào tâm đường tròn."
            }
          ],
          "ghiNho": "Ghi nhớ: Véc-tơ gia tốc hướng tâm luôn vuông góc với véc-tơ vận tốc tức thời và luôn hướng vào tâm đường tròn.",
          "part2_formulas": [
            {
              "formula": "F_{ht} = m\\frac{v^2}{r} = m\\omega^2 r",
              "quantity": "Lực hướng tâm",
              "symbol": "F_{ht}",
              "unit": "Newton (N)",
              "meaning": "Hợp lực giữ cho vật chuyển động cong tròn theo bán kính r."
            },
            {
              "formula": "v = \\omega \\cdot r",
              "quantity": "Liên hệ tốc độ dài và tốc độ góc",
              "symbol": "v",
              "unit": "m/s",
              "meaning": "Tốc độ tiếp tuyến tại điểm cách tâm một khoảng r."
            }
          ],
          "part3_applications": [
            "Tại các khúc cua nguy hiểm trên đường cao tốc, mặt đường được làm nghiêng vào phía trong để thành phần phản lực đóng vai trò lực hướng tâm giúp xe không bị lật.",
            "Lực hấp dẫn giữa Trái Đất và vệ tinh nhân tạo đóng vai trò lực hướng tâm giữ vệ tinh quay trên quỹ đạo ổn định."
          ]
        },
        "quizzes": [
          {
            "id": "q_b31_1",
            "question": "Trong chuyển động tròn đều, véc-tơ gia tốc hướng tâm có đặc điểm nào sau đây?",
            "questionEn": "In uniform circular motion, the centripetal acceleration vector has:",
            "options": [
              "Cùng hướng với véc-tơ vận tốc tức thời",
              "Luôn tiếp tuyến với quỹ đạo tròn",
              "Luôn vuông góc với véc-tơ vận tốc và hướng vào tâm quỹ đạo",
              "Có độ lớn bằng 0 vì tốc độ dài không đổi"
            ],
            "correctIndex": 2,
            "explanation": "Gia tốc hướng tâm chỉ làm thay đổi hướng chuyển động mà không làm đổi độ lớn vận tốc, nên nó luôn vuông góc với vận tốc và hướng thẳng vào tâm đường tròn.",
            "conceptTested": "Phương và chiều gia tốc hướng tâm",
            "textbookRef": "KNTT Bài 31 (Trang 124)",
            "correctAnswer": 2
          },
          {
            "id": "q_b31_2",
            "question": "Một đĩa tròn quay đều với tốc độ góc ω = 10 rad/s. Một điểm nằm cách tâm đĩa r = 0,2 m có tốc độ dài v là:",
            "questionEn": "A disc rotates at ω = 10 rad/s. A point at r = 0.2 m has linear speed v of:",
            "options": [
              "2 m/s",
              "50 m/s",
              "0,02 m/s",
              "20 m/s"
            ],
            "correctIndex": 0,
            "explanation": "v = ω · r = 10 rad/s · 0,2 m = 2 m/s.",
            "conceptTested": "Tính tốc độ dài từ tốc độ góc",
            "textbookRef": "KNTT Bài 31 (Trang 125)",
            "correctAnswer": 0
          },
          {
            "id": "q_b31_3",
            "question": "Nếu bán kính quỹ đạo tròn tăng gấp đôi trong khi tốc độ góc ω giữ nguyên thì gia tốc hướng tâm a_ht sẽ:",
            "questionEn": "If circular radius doubles while angular speed ω is kept constant, centripetal acceleration a_ht will:",
            "options": [
              "Giảm đi một nửa",
              "Tăng lên gấp đôi",
              "Tăng lên gấp bốn lần",
              "Không thay đổi"
            ],
            "correctIndex": 1,
            "explanation": "Công thức a_ht = ω² · r. Khi ω không đổi, a_ht tỉ lệ thuận bậc nhất với r, do đó r tăng 2 lần thì a_ht tăng 2 lần.",
            "conceptTested": "Mối liên hệ a_ht và r",
            "textbookRef": "KNTT Bài 32 (Trang 127)",
            "correctAnswer": 1
          },
          {
            "id": "q_b31_4",
            "question": "Lực nào đóng vai trò là lực hướng tâm giữ cho ô tô chuyển động tròn đều qua một khúc quanh trên mặt đường phẳng nằm ngang?",
            "questionEn": "Which force acts as centripetal force for a car cornering on a flat horizontal road?",
            "options": [
              "Trọng lực của xe",
              "Lực ma sát nghỉ giữa lốp xe và mặt đường",
              "Lực kéo của động cơ ô tô",
              "Phản lực pháp tuyến của mặt đường"
            ],
            "correctIndex": 1,
            "explanation": "Trên đường phẳng nằm ngang, lực ma sát nghỉ hướng vào tâm khúc cua đóng vai trò lực hướng tâm giữ xe không bị trượt văng ly tâm ra ngoài.",
            "conceptTested": "Lực hướng tâm thực tế",
            "textbookRef": "KNTT Bài 32 (Trang 128)",
            "correctAnswer": 1
          },
          {
            "id": "q_b31_5",
            "question": "Chu kì T của kim giây đồng hồ đeo tay tiêu chuẩn là:",
            "questionEn": "The period T of the second hand of a standard clock is:",
            "options": [
              "1 giây",
              "60 giây (1 phút)",
              "3600 giây (1 giờ)",
              "12 giờ"
            ],
            "correctIndex": 1,
            "explanation": "Kim giây quay hết đúng một vòng tròn 360° trong thời gian 60 giây, do đó chu kì quay T = 60 s.",
            "conceptTested": "Chu kì quay kim đồng hồ",
            "textbookRef": "KNTT Bài 31 (Trang 125)",
            "correctAnswer": 1
          }
        ],
        "available": true
      },
      {
        "id": "bai-32",
        "chapterId": "chuong-6",
        "lessonNum": 32,
        "number": 32,
        "title": "Lực hướng tâm và Gia tốc hướng tâm",
        "titleEn": "Centripetal Acceleration and Centripetal Force",
        "subtitle": "Gia tốc hướng tâm a_ht = v^2 / r = omega^2 . r và lực hướng tâm F_ht = m.a_ht.",
        "subtitleEn": "Centripetal acceleration a_c = v^2 / r = omega^2 · r and centripetal force F_c = m·a_c.",
        "shortDesc": "Gia tốc hướng tâm a_ht = v^2 / r = omega^2 . r và lực hướng tâm F_ht = m.a_ht.",
        "shortDescription": "Gia tốc hướng tâm a_ht = v^2 / r = omega^2 . r và lực hướng tâm F_ht = m.a_ht.",
        "chapterTitle": "CHUYỂN ĐỘNG TRÒN",
        "labTag": "Lực căng dây của vật chuyển động tròn trong mặt phẳng đứng",
        "labTagEn": "Centripetal Acceleration & String Tension Exploration",
        "knttRef": "KNTT Bài 32 (Trang 128)",
        "ctstRef": "CTST Bài 21 (Trang 130)",
        "simulationId": "circular-motion",
        "labType": "motion",
        "labTitle": "Lực căng dây của vật chuyển động tròn trong mặt phẳng đứng",
        "labDescription": "Quan sát vectơ gia tốc luôn hướng vào tâm quỹ đạo.",
        "virtualLabSpec": {
          "experimentName": "Lực căng dây của vật chuyển động tròn trong mặt phẳng đứng",
          "purpose": "Quan sát vectơ gia tốc luôn hướng vào tâm quỹ đạo.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Gia tốc hướng tâm a_ht = v^2 / r = omega^2 . r và lực hướng tâm F_ht = m.a_ht.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 5,
          "labRoute": "/simulations/circular-motion"
        },
        "sections": [
          {
            "title": "1. Gia tốc hướng tâm",
            "content": "Trong chuyển động tròn đều, tuy tốc độ dài không đổi nhưng hướng của vectơ vận tốc liên tục thay đổi, sinh ra gia tốc hướng tâm:\n* Phương: Nằm dọc theo bán kính đường tròn.\n* Chiều: Luôn hướng vào tâm của quỹ đạo tròn.\n* Độ lớn: $$a_{ht} = \\frac{v^2}{r} = \\omega^2 \\cdot r$$",
            "keyTakeaway": "Gia tốc hướng tâm vuông góc với vectơ vận tốc tiếp tuyến và luôn hướng vào tâm quỹ đạo."
          },
          {
            "title": "2. Lực hướng tâm",
            "content": "Lực (hoặc hợp lực của các lực) tác dụng lên một vật chuyển động tròn đều và gây ra cho vật gia tốc hướng tâm gọi là **lực hướng tâm**:\n$$F_{ht} = m \\cdot a_{ht} = m \\frac{v^2}{r} = m \\omega^2 r$$\n\n*Lưu ý quan trọng*: Lực hướng tâm không phải là một loại lực cơ học mới riêng biệt, mà chỉ là vai trò do một hoặc nhiều lực thực tế (lực ma sát nghỉ, lực hấp dẫn, lực căng dây, phản lực...) đóng vai trò.",
            "keyTakeaway": "Lực hướng tâm là hợp lực giữ cho vật chuyển động cong tròn: F_ht = m.v^2/r = m.omega^2.r."
          }
        ],
        "theorySections": [
          {
            "title": "1. Gia tốc hướng tâm",
            "content": "Trong chuyển động tròn đều, tuy tốc độ dài không đổi nhưng hướng của vectơ vận tốc liên tục thay đổi, sinh ra gia tốc hướng tâm:\n* Phương: Nằm dọc theo bán kính đường tròn.\n* Chiều: Luôn hướng vào tâm của quỹ đạo tròn.\n* Độ lớn: $$a_{ht} = \\frac{v^2}{r} = \\omega^2 \\cdot r$$",
            "keyTakeaway": "Gia tốc hướng tâm vuông góc với vectơ vận tốc tiếp tuyến và luôn hướng vào tâm quỹ đạo."
          },
          {
            "title": "2. Lực hướng tâm",
            "content": "Lực (hoặc hợp lực của các lực) tác dụng lên một vật chuyển động tròn đều và gây ra cho vật gia tốc hướng tâm gọi là **lực hướng tâm**:\n$$F_{ht} = m \\cdot a_{ht} = m \\frac{v^2}{r} = m \\omega^2 r$$\n\n*Lưu ý quan trọng*: Lực hướng tâm không phải là một loại lực cơ học mới riêng biệt, mà chỉ là vai trò do một hoặc nhiều lực thực tế (lực ma sát nghỉ, lực hấp dẫn, lực căng dây, phản lực...) đóng vai trò.",
            "keyTakeaway": "Lực hướng tâm là hợp lực giữ cho vật chuyển động cong tròn: F_ht = m.v^2/r = m.omega^2.r."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Gia tốc hướng tâm",
            "latex": "a_{ht} = \\frac{v^2}{r} = \\omega^2 r",
            "unit": "m/s²",
            "notes": "Gia tốc đặc trưng cho sự thay đổi về hướng của vectơ vận tốc trong chuyển động tròn."
          },
          {
            "name": "Lực hướng tâm",
            "latex": "F_{ht} = m\\frac{v^2}{r} = m\\omega^2 r",
            "unit": "Newton (N)",
            "notes": "Hợp lực giữ cho vật chuyển động tròn theo bán kính r."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Gia tốc hướng tâm",
              "content": "Trong chuyển động tròn đều, tuy tốc độ dài không đổi nhưng hướng của vectơ vận tốc liên tục thay đổi, sinh ra gia tốc hướng tâm:\n* Phương: Nằm dọc theo bán kính đường tròn.\n* Chiều: Luôn hướng vào tâm của quỹ đạo tròn.\n* Độ lớn: $$a_{ht} = \\frac{v^2}{r} = \\omega^2 \\cdot r$$",
              "keyTakeaway": "Gia tốc hướng tâm vuông góc với vectơ vận tốc tiếp tuyến và luôn hướng vào tâm quỹ đạo."
            },
            {
              "num": 2,
              "heading": "2. Lực hướng tâm",
              "content": "Lực (hoặc hợp lực của các lực) tác dụng lên một vật chuyển động tròn đều và gây ra cho vật gia tốc hướng tâm gọi là **lực hướng tâm**:\n$$F_{ht} = m \\cdot a_{ht} = m \\frac{v^2}{r} = m \\omega^2 r$$\n\n*Lưu ý quan trọng*: Lực hướng tâm không phải là một loại lực cơ học mới riêng biệt, mà chỉ là vai trò do một hoặc nhiều lực thực tế (lực ma sát nghỉ, lực hấp dẫn, lực căng dây, phản lực...) đóng vai trò.",
              "keyTakeaway": "Lực hướng tâm là hợp lực giữ cho vật chuyển động cong tròn: F_ht = m.v^2/r = m.omega^2.r."
            }
          ],
          "ghiNho": "Gia tốc hướng tâm vuông góc với vectơ vận tốc tiếp tuyến và luôn hướng vào tâm quỹ đạo. Lực hướng tâm là hợp lực giữ cho vật chuyển động cong tròn: F_ht = m.v^2/r = m.omega^2.r.",
          "part2_formulas": [
            {
              "formula": "a_{ht} = \\frac{v^2}{r} = \\omega^2 r",
              "quantity": "Gia tốc hướng tâm",
              "symbol": "a_{ht}",
              "unit": "m/s²",
              "meaning": "Gia tốc đặc trưng cho sự thay đổi về hướng của vectơ vận tốc trong chuyển động tròn."
            },
            {
              "formula": "F_{ht} = m\\frac{v^2}{r} = m\\omega^2 r",
              "quantity": "Lực hướng tâm",
              "symbol": "F_{ht}",
              "unit": "Newton (N)",
              "meaning": "Hợp lực giữ cho vật chuyển động tròn theo bán kính r."
            }
          ],
          "part3_applications": [
            "Lực ma sát nghỉ giữa bánh xe và mặt đường đóng vai trò lực hướng tâm giữ cho xe vào cua an toàn không bị trượt ly tâm.",
            "Lực hấp dẫn giữa Trái Đất và Mặt Trăng/vệ tinh nhân tạo đóng vai trò lực hướng tâm giữ chúng bay trên quỹ đạo tròn ổn định."
          ]
        },
        "quizzes": [
          {
            "id": "b32-q1",
            "question": "Gia tốc hướng tâm trong chuyển động tròn đều có đặc điểm nào sau đây?",
            "questionEn": "Which is a characteristic of centripetal acceleration in uniform circular motion?",
            "options": [
              "Vectơ gia tốc luôn hướng vào tâm quỹ đạo và có độ lớn $a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.",
              "Cùng hướng với vectơ vận tốc tức thời.",
              "Có độ lớn thay đổi liên tục theo thời gian.",
              "Có phương tiếp tuyến với đường tròn."
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Gia tốc hướng tâm vuông góc với vectơ vận tốc và hướng vào tâm quỹ đạo: $a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.",
            "conceptTested": "Đặc điểm gia tốc hướng tâm",
            "textbookRef": "KNTT Bài 32 (Trang 128)"
          },
          {
            "id": "b32-q2",
            "question": "Lực hướng tâm giữ cho vệ tinh bay quanh Trái Đất theo quỹ đạo tròn chính là:",
            "questionEn": "The centripetal force keeping a satellite in circular orbit around Earth is provided by:",
            "options": [
              "Lực hấp dẫn của Trái Đất tác dụng lên vệ tinh.",
              "Lực đẩy của động cơ phản lực.",
              "Lực ma sát của bầu khí quyển.",
              "Lực đàn hồi."
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Lực hấp dẫn giữa Trái Đất và vệ tinh đóng vai trò là lực hướng tâm giữ cho vệ tinh chuyển động tròn đều: $F_{hd} = F_{ht}$.",
            "conceptTested": "Bản chất vật lí của lực hướng tâm",
            "textbookRef": "KNTT Bài 32 (Trang 129)"
          },
          {
            "id": "b32-q3",
            "question": "Một chất điểm chuyển động tròn đều trên quỹ đạo bán kính $r = 0{,}5\\text{ m}$ với tốc độ dài $v = 4\\text{ m/s}$. Gia tốc hướng tâm của chất điểm là:",
            "questionEn": "A particle moves uniformly in circle of radius r = 0.5 m at speed v = 4 m/s. Its centripetal acceleration is:",
            "options": [
              "$32\\text{ m/s}^2$",
              "$8\\text{ m/s}^2$",
              "$16\\text{ m/s}^2$",
              "$2\\text{ m/s}^2$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "$a_{ht} = \\frac{v^2}{r} = \\frac{4^2}{0{,}5} = \\frac{16}{0{,}5} = 32\\text{ m/s}^2$.",
            "conceptTested": "Tính gia tốc hướng tâm",
            "textbookRef": "KNTT Bài 32 (Trang 128)"
          },
          {
            "id": "b32-q4",
            "question": "Khi ô tô chuyển động qua một khúc cua trên mặt đường nằm ngang, lực nào đóng vai trò là lực hướng tâm giúp ô tô không bị trượt ra ngoài?",
            "questionEn": "When a car turns on a flat road, which force provides the necessary centripetal force?",
            "options": [
              "Lực ma sát nghỉ giữa lốp xe và mặt đường",
              "Trọng lực của ô tô",
              "Phản lực pháp tuyến của mặt đường",
              "Lực kéo của động cơ"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Lực ma sát nghỉ hướng vào tâm đường cong đóng vai trò lực hướng tâm giữ xe bám đường khi quay đầu hoặc vào cua.",
            "conceptTested": "Lực hướng tâm khi xe vào cua",
            "textbookRef": "KNTT Bài 32 (Trang 130)"
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuong-7",
    "number": 7,
    "romanNumeral": "VII",
    "title": "BIẾN DẠNG CỦA VẬT RẮN & CHẤT LƯU",
    "titleEn": "SOLIDS AND FLUIDS",
    "description": "Biến dạng đàn hồi của vật rắn, định luật Hooke, khối lượng riêng và áp suất chất lỏng.",
    "lessons": [
      {
        "id": "bai-33",
        "chapterId": "chuong-7",
        "lessonNum": 33,
        "number": 33,
        "title": "Biến dạng của vật rắn & Định luật Hooke",
        "titleEn": "Solid Deformation & Hooke's Law",
        "subtitle": "Độ biến dạng Delta l, giới hạn đàn hồi và lực đàn hồi F_dh = k.|Delta l|.",
        "subtitleEn": "Spring elongation delta l, spring constant k, F - delta l experimental graph and elastic limit.",
        "shortDesc": "Độ biến dạng Delta l, giới hạn đàn hồi và lực đàn hồi F_dh = k.|Delta l|.",
        "shortDescription": "Độ biến dạng Delta l, giới hạn đàn hồi và lực đàn hồi F_dh = k.|Delta l|.",
        "chapterTitle": "BIẾN DẠNG CỦA VẬT RẮN & CHẤT LƯU",
        "labTag": "Thí nghiệm Treo lò xo tải trọng & Đồ thị F-Δl",
        "labTagEn": "Spring Suspension and Hooke Line Graph Lab",
        "knttRef": "KNTT Bài 33 (Trang 131)",
        "ctstRef": "CTST Bài 22 (Trang 134)",
        "simulationId": "hooke-elasticity",
        "labType": "motion",
        "labTitle": "Thí nghiệm Treo quả nặng Kiểm chứng Định luật Hooke",
        "labDescription": "Đo độ giãn Delta l của lò xo theo trọng lượng quả nặng treo vào.",
        "virtualLabSpec": {
          "experimentName": "Thí nghiệm Treo quả nặng Kiểm chứng Định luật Hooke",
          "purpose": "Đo độ giãn Delta l của lò xo theo trọng lượng quả nặng treo vào.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Độ biến dạng Delta l, giới hạn đàn hồi và lực đàn hồi F_dh = k.|Delta l|.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 6,
          "labRoute": "/simulations/hooke-elasticity"
        },
        "sections": [
          {
            "title": "Biến dạng đàn hồi và Định luật Hooke (Húc)",
            "content": "Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng (độ dãn hoặc độ nén) của lò xo:\n$F_{dh} = k \\cdot |\\Delta l| = k \\cdot |l - l_0|$.\n• $k$: Độ cứng (hệ số đàn hồi) của lò xo, đơn vị Newton trên mét ($N/m$).\n• $\\Delta l = l - l_0$: Độ dãn của lò xo, đơn vị mét ($m$)."
          },
          {
            "title": "Đồ thị lực đàn hồi theo độ dãn",
            "content": "Đồ thị biểu diễn $F_{dh}$ theo $\\Delta l$ là một **đoạn thẳng đi qua gốc tọa độ**. Hệ số góc của đường thẳng chính là độ cứng $k = \\frac{\\Delta F}{\\Delta(\\Delta l)}$. Nếu vượt quá giới hạn đàn hồi, lò xo sẽ bị biến dạng vĩnh viễn và không tuân theo định luật Hooke.",
            "keyTakeaway": "Ghi nhớ: Định luật Hooke chỉ nghiệm đúng khi biến dạng chưa vượt quá giới hạn đàn hồi của vật liệu."
          }
        ],
        "theorySections": [
          {
            "title": "Biến dạng đàn hồi và Định luật Hooke (Húc)",
            "content": "Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng (độ dãn hoặc độ nén) của lò xo:\n$F_{dh} = k \\cdot |\\Delta l| = k \\cdot |l - l_0|$.\n• $k$: Độ cứng (hệ số đàn hồi) của lò xo, đơn vị Newton trên mét ($N/m$).\n• $\\Delta l = l - l_0$: Độ dãn của lò xo, đơn vị mét ($m$)."
          },
          {
            "title": "Đồ thị lực đàn hồi theo độ dãn",
            "content": "Đồ thị biểu diễn $F_{dh}$ theo $\\Delta l$ là một **đoạn thẳng đi qua gốc tọa độ**. Hệ số góc của đường thẳng chính là độ cứng $k = \\frac{\\Delta F}{\\Delta(\\Delta l)}$. Nếu vượt quá giới hạn đàn hồi, lò xo sẽ bị biến dạng vĩnh viễn và không tuân theo định luật Hooke.",
            "keyTakeaway": "Ghi nhớ: Định luật Hooke chỉ nghiệm đúng khi biến dạng chưa vượt quá giới hạn đàn hồi của vật liệu."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Định luật Hooke",
            "latex": "F_{dh} = k \\cdot |\\Delta l|",
            "unit": "Newton (N)",
            "notes": "Lực đàn hồi chống lại sự biến dạng của lò xo."
          },
          {
            "name": "Thế năng đàn hồi",
            "latex": "W_{dh} = \\frac{1}{2}k(\\Delta l)^2",
            "unit": "Joule (J)",
            "notes": "Năng lượng tích lũy trong lò xo khi bị kéo dãn hoặc nén một đoạn Δl."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Biến dạng đàn hồi và Định luật Hooke (Húc)",
              "content": "Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng (độ dãn hoặc độ nén) của lò xo:\n$F_{dh} = k \\cdot |\\Delta l| = k \\cdot |l - l_0|$.\n• $k$: Độ cứng (hệ số đàn hồi) của lò xo, đơn vị Newton trên mét ($N/m$).\n• $\\Delta l = l - l_0$: Độ dãn của lò xo, đơn vị mét ($m$)."
            },
            {
              "num": 2,
              "heading": "Đồ thị lực đàn hồi theo độ dãn",
              "content": "Đồ thị biểu diễn $F_{dh}$ theo $\\Delta l$ là một **đoạn thẳng đi qua gốc tọa độ**. Hệ số góc của đường thẳng chính là độ cứng $k = \\frac{\\Delta F}{\\Delta(\\Delta l)}$. Nếu vượt quá giới hạn đàn hồi, lò xo sẽ bị biến dạng vĩnh viễn và không tuân theo định luật Hooke.",
              "keyTakeaway": "Ghi nhớ: Định luật Hooke chỉ nghiệm đúng khi biến dạng chưa vượt quá giới hạn đàn hồi của vật liệu."
            }
          ],
          "ghiNho": "Ghi nhớ: Định luật Hooke chỉ nghiệm đúng khi biến dạng chưa vượt quá giới hạn đàn hồi của vật liệu.",
          "part2_formulas": [
            {
              "formula": "F_{dh} = k \\cdot |\\Delta l|",
              "quantity": "Định luật Hooke",
              "symbol": "F_{dh}",
              "unit": "Newton (N)",
              "meaning": "Lực đàn hồi chống lại sự biến dạng của lò xo."
            },
            {
              "formula": "W_{dh} = \\frac{1}{2}k(\\Delta l)^2",
              "quantity": "Thế năng đàn hồi",
              "symbol": "W_{dh}",
              "unit": "Joule (J)",
              "meaning": "Năng lượng tích lũy trong lò xo khi bị kéo dãn hoặc nén một đoạn Δl."
            }
          ],
          "part3_applications": [
            "Chế tạo lực kế lò xo để đo trọng lượng và các lực cơ học trong đời sống.",
            "Hệ thống giảm xóc (phuộc nhún lò xo) trên xe máy và giảm chấn địa chấn chân tòa nhà cao tầng."
          ]
        },
        "quizzes": [
          {
            "id": "q_b33_1",
            "question": "Trong giới hạn đàn hồi, lực đàn hồi của lò xo có đặc điểm nào sau đây?",
            "questionEn": "Within elastic limit, the spring elastic force is:",
            "options": [
              "Tỉ lệ thuận với chiều dài l của lò xo",
              "Tỉ lệ thuận với độ biến dạng |Δl| của lò xo",
              "Tỉ lệ nghịch với độ cứng k của lò xo",
              "Tỉ lệ thuận với bình phương độ biến dạng"
            ],
            "correctIndex": 1,
            "explanation": "Định luật Hooke: F_dh = k · |Δl|, trong đó lực đàn hồi tỉ lệ thuận bậc nhất với độ dãn hoặc nén của lò xo.",
            "conceptTested": "Phát biểu định luật Hooke",
            "textbookRef": "KNTT Bài 33 (Trang 132)",
            "correctAnswer": 1
          },
          {
            "id": "q_b33_2",
            "question": "Treo một vật nặng 200 g vào đầu dưới lò xo treo thẳng đứng (lấy g = 10 m/s²). Lò xo dãn ra 4 cm. Độ cứng k của lò xo là:",
            "questionEn": "A 200 g mass stretches a vertical spring by 4 cm (g = 10 m/s²). The spring constant k is:",
            "options": [
              "5 N/m",
              "50 N/m",
              "500 N/m",
              "20 N/m"
            ],
            "correctIndex": 1,
            "explanation": "P = mg = 0,2 kg · 10 m/s² = 2 N. Tại vị trí cân bằng: F_dh = P => k · Δl = 2 N => k = 2 / 0,04 m = 50 N/m.",
            "conceptTested": "Tính độ cứng lò xo",
            "textbookRef": "KNTT Bài 33 (Trang 133)",
            "correctAnswer": 1
          },
          {
            "id": "q_b33_3",
            "question": "Đồ thị biểu diễn lực đàn hồi F theo độ biến dạng Δl trong giới hạn đàn hồi có dạng là:",
            "questionEn": "The graph of elastic force F versus elongation Δl within elastic limit is:",
            "options": [
              "Đường cong parabol",
              "Đường thẳng đi qua gốc tọa độ O",
              "Đường thẳng song song với trục hoành",
              "Đường tròn đồng tâm"
            ],
            "correctIndex": 1,
            "explanation": "Vì F = k · Δl có dạng hàm bậc nhất y = ax nên đồ thị là một đoạn thẳng đi qua gốc tọa độ O, hệ số góc chính là độ cứng k.",
            "conceptTested": "Đồ thị định luật Hooke",
            "textbookRef": "KNTT Bài 33 (Trang 133)",
            "correctAnswer": 1
          },
          {
            "id": "q_b33_4",
            "question": "Hiện tượng gì xảy ra nếu kéo dãn lò xo vượt quá giới hạn đàn hồi của nó?",
            "questionEn": "What happens if a spring is stretched beyond its elastic limit?",
            "options": [
              "Lò xo có độ cứng k tăng lên vô hạn",
              "Lò xo bị biến dạng dư (biến dạng vĩnh viễn) và không thể co lại chiều dài ban đầu",
              "Lực đàn hồi tăng gấp đôi",
              "Lò xo biến đổi thành nam châm"
            ],
            "correctIndex": 1,
            "explanation": "Khi vượt qua giới hạn đàn hồi, cấu trúc tinh thể kim loại bị xô lệch vĩnh viễn, lò xo không thể tự hồi phục hình dạng ban đầu nữa.",
            "conceptTested": "Giới hạn đàn hồi",
            "textbookRef": "KNTT Bài 33 (Trang 132)",
            "correctAnswer": 1
          },
          {
            "id": "q_b33_5",
            "question": "Một lò xo có chiều dài tự nhiên l₀ = 15 cm. Khi treo quả cân thì chiều dài của lò xo là l = 19 cm. Độ biến dạng Δl của lò xo là:",
            "questionEn": "A spring of initial length 15 cm stretches to 19 cm. Its elongation Δl is:",
            "options": [
              "4 cm",
              "19 cm",
              "34 cm",
              "15 cm"
            ],
            "correctIndex": 0,
            "explanation": "Δl = l - l₀ = 19 cm - 15 cm = 4 cm = 0,04 m.",
            "conceptTested": "Xác định độ dãn",
            "textbookRef": "KNTT Bài 33 (Trang 131)",
            "correctAnswer": 0
          }
        ],
        "available": true
      },
      {
        "id": "bai-34",
        "chapterId": "chuong-7",
        "lessonNum": 34,
        "number": 34,
        "title": "Khối lượng riêng. Áp suất chất lỏng",
        "titleEn": "Density. Fluid Pressure",
        "subtitle": "Công thức tính áp suất thủy tĩnh p = p_0 + rho.g.h và lực đẩy Archimedes.",
        "subtitleEn": "Hydrostatic pressure formula p = p_0 + rho·g·h and Archimedes buoyant force.",
        "shortDesc": "Công thức tính áp suất thủy tĩnh p = p_0 + rho.g.h và lực đẩy Archimedes.",
        "shortDescription": "Công thức tính áp suất thủy tĩnh p = p_0 + rho.g.h và lực đẩy Archimedes.",
        "chapterTitle": "BIẾN DẠNG CỦA VẬT RẮN & CHẤT LƯU",
        "labTag": "Đo Áp suất Chất lỏng ở các độ sâu khác nhau",
        "labTagEn": "Fluid Pressure & Density Measurement",
        "knttRef": "KNTT Bài 34 (Trang 136)",
        "ctstRef": "CTST Bài 23 (Trang 138)",
        "simulationId": "hooke-elasticity",
        "labType": "motion",
        "labTitle": "Đo Áp suất Chất lỏng ở các độ sâu khác nhau",
        "labDescription": "Quan sát màng cao su biến dạng dưới áp lực chất lỏng.",
        "virtualLabSpec": {
          "experimentName": "Đo Áp suất Chất lỏng ở các độ sâu khác nhau",
          "purpose": "Quan sát màng cao su biến dạng dưới áp lực chất lỏng.",
          "equipmentAndSteps": [
            "1. Quan sát trạng thái ban đầu của hệ thống.",
            "2. Điều chỉnh các thông số vật lí thực nghiệm.",
            "3. Tiến hành đo đạc và so sánh với công thức lý thuyết."
          ],
          "physicsNatureAndLogic": "Công thức tính áp suất thủy tĩnh p = p_0 + rho.g.h và lực đẩy Archimedes.",
          "expectedResults": {
            "positive": "Kết quả đo đạc thực nghiệm phù hợp với các định luật vật lí lý thuyết.",
            "negative": "Các yếu tố nhiễu môi trường, lực cản hoặc thao tác sai lệch có thể dẫn đến sai số thực nghiệm."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 6,
          "labRoute": "/simulations/hooke-elasticity"
        },
        "sections": [
          {
            "title": "1. Khối lượng riêng và Áp suất",
            "content": "* **Khối lượng riêng** $\\rho$: Là khối lượng của một đơn vị thể tích chất đó: $\\rho = \\frac{m}{V}$ (đơn vị: $\\text{kg/m}^3$).\n* **Áp suất** $p$: Là độ lớn của áp lực trên một đơn vị diện tích bị ép: $p = \\frac{F}{S}$ (đơn vị: Pascal - $\\text{Pa}$, $1\\text{ Pa} = 1\\text{ N/m}^2$).",
            "keyTakeaway": "Khối lượng riêng rho = m/V; Áp suất p = F/S đặc trưng cho tác dụng nén ép lên bề mặt."
          },
          {
            "title": "2. Áp suất thủy tĩnh trong lòng chất lỏng",
            "content": "Áp suất ở độ sâu $h$ trong lòng chất lỏng đứng yên có khối lượng riêng $\\rho$ được tính theo công thức:\n$$p = p_a + \\rho \\cdot g \\cdot h$$\nvới $p_a$ là áp suất khí quyển tác dụng lên mặt thoáng (thường lấy $p_a \\approx 10^5\\text{ Pa}$). Độ chênh lệch áp suất giữa hai điểm có độ sâu chênh lệch $\\Delta h$ là $\\Delta p = \\rho g \\Delta h$.",
            "keyTakeaway": "Áp suất chất lỏng tăng tỉ lệ thuận với độ sâu h và không phụ thuộc vào hình dạng bình chứa."
          },
          {
            "title": "3. Lực đẩy Archimedes (Ác-si-mét)",
            "content": "Một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên trên, có độ lớn bằng trọng lượng của khối chất lỏng bị vật chiếm chỗ:\n$$F_A = \\rho \\cdot g \\cdot V$$\nvới $V$ là thể tích phần vật chìm trong chất lỏng.",
            "keyTakeaway": "Lực đẩy Archimedes F_A = rho.g.V nâng đỡ vật nổi hoặc chìm một phần trong chất lỏng."
          }
        ],
        "theorySections": [
          {
            "title": "1. Khối lượng riêng và Áp suất",
            "content": "* **Khối lượng riêng** $\\rho$: Là khối lượng của một đơn vị thể tích chất đó: $\\rho = \\frac{m}{V}$ (đơn vị: $\\text{kg/m}^3$).\n* **Áp suất** $p$: Là độ lớn của áp lực trên một đơn vị diện tích bị ép: $p = \\frac{F}{S}$ (đơn vị: Pascal - $\\text{Pa}$, $1\\text{ Pa} = 1\\text{ N/m}^2$).",
            "keyTakeaway": "Khối lượng riêng rho = m/V; Áp suất p = F/S đặc trưng cho tác dụng nén ép lên bề mặt."
          },
          {
            "title": "2. Áp suất thủy tĩnh trong lòng chất lỏng",
            "content": "Áp suất ở độ sâu $h$ trong lòng chất lỏng đứng yên có khối lượng riêng $\\rho$ được tính theo công thức:\n$$p = p_a + \\rho \\cdot g \\cdot h$$\nvới $p_a$ là áp suất khí quyển tác dụng lên mặt thoáng (thường lấy $p_a \\approx 10^5\\text{ Pa}$). Độ chênh lệch áp suất giữa hai điểm có độ sâu chênh lệch $\\Delta h$ là $\\Delta p = \\rho g \\Delta h$.",
            "keyTakeaway": "Áp suất chất lỏng tăng tỉ lệ thuận với độ sâu h và không phụ thuộc vào hình dạng bình chứa."
          },
          {
            "title": "3. Lực đẩy Archimedes (Ác-si-mét)",
            "content": "Một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên trên, có độ lớn bằng trọng lượng của khối chất lỏng bị vật chiếm chỗ:\n$$F_A = \\rho \\cdot g \\cdot V$$\nvới $V$ là thể tích phần vật chìm trong chất lỏng.",
            "keyTakeaway": "Lực đẩy Archimedes F_A = rho.g.V nâng đỡ vật nổi hoặc chìm một phần trong chất lỏng."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Áp suất thủy tĩnh",
            "latex": "p = p_a + \\rho \\cdot g \\cdot h",
            "unit": "Pascal (Pa)",
            "notes": "Áp suất tổng cộng tại độ sâu h dưới mặt thoáng chất lỏng."
          },
          {
            "name": "Lực đẩy Archimedes",
            "latex": "F_A = \\rho \\cdot g \\cdot V",
            "unit": "Newton (N)",
            "notes": "Lực đẩy hướng lên tác dụng vào vật chìm trong chất lỏng có khối lượng riêng rho."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "1. Khối lượng riêng và Áp suất",
              "content": "* **Khối lượng riêng** $\\rho$: Là khối lượng của một đơn vị thể tích chất đó: $\\rho = \\frac{m}{V}$ (đơn vị: $\\text{kg/m}^3$).\n* **Áp suất** $p$: Là độ lớn của áp lực trên một đơn vị diện tích bị ép: $p = \\frac{F}{S}$ (đơn vị: Pascal - $\\text{Pa}$, $1\\text{ Pa} = 1\\text{ N/m}^2$).",
              "keyTakeaway": "Khối lượng riêng rho = m/V; Áp suất p = F/S đặc trưng cho tác dụng nén ép lên bề mặt."
            },
            {
              "num": 2,
              "heading": "2. Áp suất thủy tĩnh trong lòng chất lỏng",
              "content": "Áp suất ở độ sâu $h$ trong lòng chất lỏng đứng yên có khối lượng riêng $\\rho$ được tính theo công thức:\n$$p = p_a + \\rho \\cdot g \\cdot h$$\nvới $p_a$ là áp suất khí quyển tác dụng lên mặt thoáng (thường lấy $p_a \\approx 10^5\\text{ Pa}$). Độ chênh lệch áp suất giữa hai điểm có độ sâu chênh lệch $\\Delta h$ là $\\Delta p = \\rho g \\Delta h$.",
              "keyTakeaway": "Áp suất chất lỏng tăng tỉ lệ thuận với độ sâu h và không phụ thuộc vào hình dạng bình chứa."
            },
            {
              "num": 3,
              "heading": "3. Lực đẩy Archimedes (Ác-si-mét)",
              "content": "Một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên trên, có độ lớn bằng trọng lượng của khối chất lỏng bị vật chiếm chỗ:\n$$F_A = \\rho \\cdot g \\cdot V$$\nvới $V$ là thể tích phần vật chìm trong chất lỏng.",
              "keyTakeaway": "Lực đẩy Archimedes F_A = rho.g.V nâng đỡ vật nổi hoặc chìm một phần trong chất lỏng."
            }
          ],
          "ghiNho": "Khối lượng riêng rho = m/V; Áp suất p = F/S đặc trưng cho tác dụng nén ép lên bề mặt. Áp suất chất lỏng tăng tỉ lệ thuận với độ sâu h và không phụ thuộc vào hình dạng bình chứa. Lực đẩy Archimedes F_A = rho.g.V nâng đỡ vật nổi hoặc chìm một phần trong chất lỏng.",
          "part2_formulas": [
            {
              "formula": "p = p_a + \\rho \\cdot g \\cdot h",
              "quantity": "Áp suất thủy tĩnh",
              "symbol": "p",
              "unit": "Pascal (Pa)",
              "meaning": "Áp suất tổng cộng tại độ sâu h dưới mặt thoáng chất lỏng."
            },
            {
              "formula": "F_A = \\rho \\cdot g \\cdot V",
              "quantity": "Lực đẩy Archimedes",
              "symbol": "F_A",
              "unit": "Newton (N)",
              "meaning": "Lực đẩy hướng lên tác dụng vào vật chìm trong chất lỏng có khối lượng riêng rho."
            }
          ],
          "part3_applications": [
            "Thiết kế thân tàu thủy rỗng và tàu ngầm điều chỉnh thể tích khoang chứa nước để nổi hoặc lặn theo ý muốn.",
            "Nguyên lí bình thông nhau ứng dụng trong máy ép thủy lực và tháp nước sinh hoạt đô thị."
          ]
        },
        "quizzes": [
          {
            "id": "b34-q1",
            "question": "Công thức tính áp suất thủy tĩnh ở độ sâu $h$ trong lòng chất lỏng có khối lượng riêng $\\rho$ là:",
            "questionEn": "The hydrostatic pressure at depth h in liquid of density rho is:",
            "options": [
              "$p = p_a + \\rho \\cdot g \\cdot h$",
              "$p = \\rho \\cdot g / h$",
              "$p = p_a - \\rho \\cdot g \\cdot h$",
              "$p = \\frac{p_a}{\\rho \\cdot g \\cdot h}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Áp suất chất lỏng ở độ sâu $h$: $p = p_a + \\rho g h$, trong đó $p_a$ là áp suất khí quyển, $\\rho g h$ là áp suất do cột chất lỏng gây ra.",
            "conceptTested": "Công thức áp suất thủy tĩnh",
            "textbookRef": "KNTT Bài 34 (Trang 137)"
          },
          {
            "id": "b34-q2",
            "question": "Một người thợ lặn lặn xuống độ sâu $h = 20\\text{ m}$ dưới nước biển (khối lượng riêng $\\rho = 1030\\text{ kg/m}^3$). Lấy $g = 9.8\\text{ m/s}^2$, $p_a = 10^5\\text{ Pa}$. Áp suất tác dụng lên thợ lặn là:",
            "questionEn": "A diver descends to depth h = 20 m in seawater (rho = 1030 kg/m^3). Total pressure on diver is:",
            "options": [
              "$301880\\text{ Pa}$",
              "$201880\\text{ Pa}$",
              "$100000\\text{ Pa}$",
              "$401880\\text{ Pa}$"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "$p = p_a + \\rho g h = 10^5 + 1030 \\times 9.8 \\times 20 = 100000 + 201880 = 301880\\text{ Pa} \\approx 3\\text{ atm}$.",
            "conceptTested": "Tính áp suất dưới đáy biển",
            "textbookRef": "KNTT Bài 34 (Trang 138)"
          },
          {
            "id": "b34-q3",
            "question": "Lực đẩy Archimedes tác dụng lên một vật nhúng chìm hoàn toàn trong chất lỏng phụ thuộc vào:",
            "questionEn": "The buoyant force on a submerged body depends on:",
            "options": [
              "Khối lượng riêng của chất lỏng và thể tích của vật",
              "Khối lượng của vật và độ sâu của vật",
              "Hình dạng và chất liệu làm nên vật",
              "Diện tích bề mặt thoáng của chất lỏng"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "$F_A = \\rho_{cl} \\cdot g \\cdot V_{vat}$. Lực đẩy Archimedes chỉ phụ thuộc khối lượng riêng chất lỏng và thể tích phần vật bị chìm.",
            "conceptTested": "Yếu tố ảnh hưởng đến lực đẩy Archimedes",
            "textbookRef": "KNTT Bài 34 (Trang 139)"
          },
          {
            "id": "b34-q4",
            "question": "Nguyên lí hoạt động của máy kích thủy lực (máy ép dùng chất lỏng) dựa trên định luật Pascal phát biểu rằng:",
            "questionEn": "Pascal's principle for hydraulic machines states that:",
            "options": [
              "Độ tăng áp suất lên một chất lỏng kín được truyền nguyên vẹn tới mọi điểm của chất lỏng và thành bình",
              "Áp suất luôn giảm khi chất lỏng bị nén",
              "Khối lượng riêng của chất lỏng thay đổi tỉ lệ thuận với lực tác dụng",
              "Lực đẩy Archimedes tăng gấp đôi khi nén chất lỏng"
            ],
            "correctIndex": 0,
            "correctAnswer": 0,
            "explanation": "Định luật Pascal: Độ tăng áp suất tác dụng lên chất lỏng chứa trong bình kín được truyền nguyên vẹn đến mọi điểm trong lòng chất lỏng và thành bình.",
            "conceptTested": "Định luật Pascal và máy ép thủy lực",
            "textbookRef": "KNTT Bài 34 (Trang 137)"
          }
        ],
        "available": true
      }
    ]
  },
  {
    "id": "chuyen-de",
    "number": 8,
    "romanNumeral": "VIII",
    "title": "CHUYÊN ĐỀ MẠCH ĐIỆN & SÓNG CƠ",
    "titleEn": "CIRCUITS & MECHANICAL WAVES",
    "description": "Chuyên đề thực hành nâng cao: định luật Ohm cho đoạn mạch một chiều và các đặc trưng truyền sóng cơ học, giao thoa sóng.",
    "lessons": [
      {
        "id": "bai-mach-dien",
        "chapterId": "chuyen-de",
        "lessonNum": 35,
        "number": 35,
        "title": "Định luật Ohm & Mạch song song/nối tiếp",
        "titleEn": "Ohm's Law & Circuit Combinations",
        "subtitle": "Định luật Ohm I = U/R, phân nhánh dòng điện ở nút và công suất tiêu thụ của các bóng đèn.",
        "subtitleEn": "Ohm's law I = U/R, current junction splitting and bulb power consumption.",
        "shortDesc": "Định luật Ohm I = U/R, phân nhánh dòng điện ở nút và công suất tiêu thụ của các bóng đèn.",
        "shortDescription": "Định luật Ohm I = U/R, phân nhánh dòng điện ở nút và công suất tiêu thụ của các bóng đèn.",
        "chapterTitle": "CHUYÊN ĐỀ MẠCH ĐIỆN & SÓNG CƠ",
        "labTag": "Phòng thí nghiệm ảo Mạch điện & Dòng hạt tải điện",
        "labTagEn": "Virtual Circuit Lab and Charge Flow Animation",
        "knttRef": "Chuyên đề Vật lí 10 (Mạch điện)",
        "ctstRef": "Chuyên đề Vật lí 10 (Thực hành)",
        "simulationId": "electric-circuit",
        "labType": "motion",
        "labTitle": "Phòng thí nghiệm ảo Mạch điện & Dòng hạt tải điện",
        "labDescription": "Định luật Ohm I = U/R, phân nhánh dòng điện ở nút và công suất tiêu thụ của các bóng đèn.",
        "virtualLabSpec": {
          "experimentName": "Phòng thí nghiệm ảo Mạch điện & Dòng hạt tải điện",
          "purpose": "Định luật Ohm I = U/R, phân nhánh dòng điện ở nút và công suất tiêu thụ của các bóng đèn.",
          "equipmentAndSteps": [
            "1. Thiết lập các thông số ban đầu trong phần mềm mô phỏng.",
            "2. Kích hoạt thí nghiệm và quan sát diễn biến vật lí trên màn hình.",
            "3. Ghi chép số liệu đo và vẽ đồ thị kiểm chứng quy luật."
          ],
          "physicsNatureAndLogic": "Ghi nhớ: Trong đoạn mạch song song, điện trở tương đương luôn nhỏ hơn từng điện trở thành phần.",
          "expectedResults": {
            "positive": "Kết quả đo thực nghiệm hoàn toàn phù hợp với mô hình lí thuyết.",
            "negative": "Nếu bỏ qua ma sát hoặc sai số thao tác, số liệu có thể sai lệch nhẹ."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 7,
          "labRoute": "/simulations/electric-circuit"
        },
        "sections": [
          {
            "title": "Định luật Ohm cho đoạn mạch",
            "content": "Cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của dây: $I = \\frac{U}{R}$."
          },
          {
            "title": "Quy tắc mạch mắc song song",
            "content": "• Hiệu điện thế bằng nhau trên mọi nhánh: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính bằng tổng dòng qua các nhánh: $I = I_1 + I_2$.\n• Điện trở tương đương nhỏ hơn mỗi điện trở thành phần: $\\frac{1}{R_{td}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{td} = \\frac{R_1 R_2}{R_1 + R_2}$.",
            "keyTakeaway": "Ghi nhớ: Trong đoạn mạch song song, điện trở tương đương luôn nhỏ hơn từng điện trở thành phần."
          }
        ],
        "theorySections": [
          {
            "title": "Định luật Ohm cho đoạn mạch",
            "content": "Cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của dây: $I = \\frac{U}{R}$."
          },
          {
            "title": "Quy tắc mạch mắc song song",
            "content": "• Hiệu điện thế bằng nhau trên mọi nhánh: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính bằng tổng dòng qua các nhánh: $I = I_1 + I_2$.\n• Điện trở tương đương nhỏ hơn mỗi điện trở thành phần: $\\frac{1}{R_{td}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{td} = \\frac{R_1 R_2}{R_1 + R_2}$.",
            "keyTakeaway": "Ghi nhớ: Trong đoạn mạch song song, điện trở tương đương luôn nhỏ hơn từng điện trở thành phần."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Định luật Ohm",
            "latex": "I = \\frac{U}{R}",
            "unit": "Ampe (A)",
            "notes": "Cường độ dòng điện qua tải có điện trở R dưới hiệu điện thế U."
          },
          {
            "name": "Công suất điện",
            "latex": "P = U \\cdot I = I^2 R = \\frac{U^2}{R}",
            "unit": "Oát (W)",
            "notes": "Tốc độ tiêu thụ điện năng của mạch điện."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Định luật Ohm cho đoạn mạch",
              "content": "Cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của dây: $I = \\frac{U}{R}$."
            },
            {
              "num": 2,
              "heading": "Quy tắc mạch mắc song song",
              "content": "• Hiệu điện thế bằng nhau trên mọi nhánh: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính bằng tổng dòng qua các nhánh: $I = I_1 + I_2$.\n• Điện trở tương đương nhỏ hơn mỗi điện trở thành phần: $\\frac{1}{R_{td}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{td} = \\frac{R_1 R_2}{R_1 + R_2}$.",
              "keyTakeaway": "Ghi nhớ: Trong đoạn mạch song song, điện trở tương đương luôn nhỏ hơn từng điện trở thành phần."
            }
          ],
          "ghiNho": "Ghi nhớ: Trong đoạn mạch song song, điện trở tương đương luôn nhỏ hơn từng điện trở thành phần.",
          "part2_formulas": [
            {
              "formula": "I = \\frac{U}{R}",
              "quantity": "Định luật Ohm",
              "symbol": "I",
              "unit": "Ampe (A)",
              "meaning": "Cường độ dòng điện qua tải có điện trở R dưới hiệu điện thế U."
            },
            {
              "formula": "P = U \\cdot I = I^2 R = \\frac{U^2}{R}",
              "quantity": "Công suất điện",
              "symbol": "P",
              "unit": "Oát (W)",
              "meaning": "Tốc độ tiêu thụ điện năng của mạch điện."
            }
          ],
          "part3_applications": [
            "Các thiết bị điện trong gia đình (đèn, quạt, tivi) luôn được mắc song song vào nguồn 220V để hoạt động độc lập.",
            "Cầu chì và công tắc được mắc nối tiếp với thiết bị trên dây pha để bảo vệ và điều khiển."
          ]
        },
        "quizzes": [
          {
            "id": "q_bmd_1",
            "question": "Theo định luật Ohm, nếu giữ nguyên hiệu điện thế U đặt vào hai đầu điện trở và tăng giá trị điện trở R lên gấp 3 lần thì dòng điện I sẽ:",
            "questionEn": "According to Ohm's Law, keeping U constant and tripling R causes current I to:",
            "options": [
              "Tăng lên 3 lần",
              "Giảm đi 3 lần",
              "Không thay đổi",
              "Tăng lên 9 lần"
            ],
            "correctIndex": 1,
            "explanation": "I = U / R. Vì dòng điện I tỉ lệ nghịch với điện trở R nên khi R tăng 3 lần thì I giảm đi 3 lần.",
            "conceptTested": "Định luật Ohm cho đoạn mạch",
            "textbookRef": "Chuyên đề Vật lí 10",
            "correctAnswer": 1
          },
          {
            "id": "q_bmd_2",
            "question": "Hai điện trở R₁ = 10 Ω và R₂ = 10 Ω mắc song song với nhau. Điện trở tương đương R_tđ của đoạn mạch là:",
            "questionEn": "Two 10 Ω resistors are connected in parallel. The equivalent resistance is:",
            "options": [
              "20 Ω",
              "5 Ω",
              "10 Ω",
              "100 Ω"
            ],
            "correctIndex": 1,
            "explanation": "R_td = (R₁ · R₂) / (R₁ + R₂) = (10 · 10) / (10 + 10) = 100 / 20 = 5 Ω.",
            "conceptTested": "Tính điện trở tương đương song song",
            "textbookRef": "Chuyên đề Vật lí 10",
            "correctAnswer": 1
          },
          {
            "id": "q_bmd_3",
            "question": "Tại sao các thiết bị điện sinh hoạt trong gia đình thường được mắc song song với nhau?",
            "questionEn": "Why are household appliances connected in parallel?",
            "options": [
              "Để tiết kiệm dây dẫn điện",
              "Để các thiết bị cùng dùng chung một hiệu điện thế định mức và khi tắt một thiết bị thì các thiết bị khác vẫn hoạt động bình thường",
              "Để giảm tối đa cường độ dòng điện mạch chính",
              "Để tăng điện trở tương đương của mạng điện"
            ],
            "correctIndex": 1,
            "explanation": "Mạch song song cho phép mỗi thiết bị nhận đủ điện áp định mức 220V và hoạt động độc lập không phụ thuộc vào thiết bị khác.",
            "conceptTested": "Ứng dụng mạch song song",
            "textbookRef": "Chuyên đề Vật lí 10",
            "correctAnswer": 1
          },
          {
            "id": "q_bmd_4",
            "question": "Một bóng đèn có điện trở 24 Ω được cắm vào nguồn điện có hiệu điện thế 12 V. Công suất tiêu thụ của bóng đèn là:",
            "questionEn": "A 24 Ω bulb is connected to 12 V. Its power consumption is:",
            "options": [
              "6 W",
              "288 W",
              "2 W",
              "0,5 W"
            ],
            "correctIndex": 0,
            "explanation": "P = U² / R = 12² / 24 = 144 / 24 = 6 W.",
            "conceptTested": "Tính công suất điện",
            "textbookRef": "Chuyên đề Vật lí 10",
            "correctAnswer": 0
          },
          {
            "id": "q_bmd_5",
            "question": "Trong mạch điện phân nhánh gồm hai nhánh song song, nếu nhánh 1 có dòng I₁ = 1,5 A và nhánh 2 có dòng I₂ = 2,0 A thì dòng điện ở mạch chính I là:",
            "questionEn": "In two parallel branches carrying I₁ = 1.5 A and I₂ = 2.0 A, total current I is:",
            "options": [
              "0,5 A",
              "3,5 A",
              "3,0 A",
              "1,75 A"
            ],
            "correctIndex": 1,
            "explanation": "Định luật bảo toàn điện tích tại nút: dòng vào nút bằng tổng dòng ra khỏi nút: I = I₁ + I₂ = 1,5 + 2,0 = 3,5 A.",
            "conceptTested": "Định luật nút dòng điện",
            "textbookRef": "Chuyên đề Vật lí 10",
            "correctAnswer": 1
          }
        ],
        "available": true
      },
      {
        "id": "bai-song-co",
        "chapterId": "chuyen-de",
        "lessonNum": 36,
        "number": 36,
        "title": "Sóng cơ & Hiện tượng giao thoa sóng",
        "titleEn": "Mechanical Waves & Wave Interference",
        "subtitle": "Sự lan truyền dao động cơ học, bước sóng lambda, hiện tượng giao thoa cực đại và cực tiểu.",
        "subtitleEn": "Mechanical wave propagation, wavelength lambda, constructive and destructive interference.",
        "shortDesc": "Sự lan truyền dao động cơ học, bước sóng lambda, hiện tượng giao thoa cực đại và cực tiểu.",
        "shortDescription": "Sự lan truyền dao động cơ học, bước sóng lambda, hiện tượng giao thoa cực đại và cực tiểu.",
        "chapterTitle": "CHUYÊN ĐỀ MẠCH ĐIỆN & SÓNG CƠ",
        "labTag": "Mô phỏng Giao thoa hai nguồn kết hợp đồng pha",
        "labTagEn": "Two In-Phase Coherent Sources Interference Lab",
        "knttRef": "Chuyên đề Sóng (Trang 140)",
        "ctstRef": "Chuyên đề Sóng (Trang 142)",
        "simulationId": "wave-interference",
        "labType": "motion",
        "labTitle": "Mô phỏng Giao thoa hai nguồn kết hợp đồng pha",
        "labDescription": "Sự lan truyền dao động cơ học, bước sóng lambda, hiện tượng giao thoa cực đại và cực tiểu.",
        "virtualLabSpec": {
          "experimentName": "Mô phỏng Giao thoa hai nguồn kết hợp đồng pha",
          "purpose": "Sự lan truyền dao động cơ học, bước sóng lambda, hiện tượng giao thoa cực đại và cực tiểu.",
          "equipmentAndSteps": [
            "1. Thiết lập các thông số ban đầu trong phần mềm mô phỏng.",
            "2. Kích hoạt thí nghiệm và quan sát diễn biến vật lí trên màn hình.",
            "3. Ghi chép số liệu đo và vẽ đồ thị kiểm chứng quy luật."
          ],
          "physicsNatureAndLogic": "Ghi nhớ: Hiện tượng giao thoa là bằng chứng thực nghiệm rõ ràng nhất chứng minh bản chất sóng.",
          "expectedResults": {
            "positive": "Kết quả đo thực nghiệm hoàn toàn phù hợp với mô hình lí thuyết.",
            "negative": "Nếu bỏ qua ma sát hoặc sai số thao tác, số liệu có thể sai lệch nhẹ."
          }
        },
        "virtualLab": {
          "hidden": false,
          "experiment_id": 8,
          "labRoute": "/simulations/wave-interference"
        },
        "sections": [
          {
            "title": "Sóng cơ và các đại lượng đặc trưng",
            "content": "Sóng cơ là dao động cơ lan truyền trong môi trường vật chất theo thời gian. Bước sóng $\\lambda = v \\cdot T = \\frac{v}{f}$ là quãng đường sóng truyền đi được trong một chu kì dao động."
          },
          {
            "title": "Giao thoa sóng cơ học",
            "content": "Là hiện tượng hai sóng kết hợp (cùng tần số và hiệu số pha không đổi theo thời gian) khi gặp nhau tạo ra những điểm dao động tăng cường (cực đại) xen kẽ những điểm dao động triệt tiêu (cực tiểu).\n• **Cực đại giao thoa**: Hiệu đường đi bằng số nguyên lần bước sóng: $d_2 - d_1 = k\\lambda$ ($k = 0, \\pm 1, \\pm 2...$).\n• **Cực tiểu giao thoa**: Hiệu đường đi bằng số bán nguyên lần bước sóng: $d_2 - d_1 = (k + 0,5)\\lambda$.",
            "keyTakeaway": "Ghi nhớ: Hiện tượng giao thoa là bằng chứng thực nghiệm rõ ràng nhất chứng minh bản chất sóng."
          }
        ],
        "theorySections": [
          {
            "title": "Sóng cơ và các đại lượng đặc trưng",
            "content": "Sóng cơ là dao động cơ lan truyền trong môi trường vật chất theo thời gian. Bước sóng $\\lambda = v \\cdot T = \\frac{v}{f}$ là quãng đường sóng truyền đi được trong một chu kì dao động."
          },
          {
            "title": "Giao thoa sóng cơ học",
            "content": "Là hiện tượng hai sóng kết hợp (cùng tần số và hiệu số pha không đổi theo thời gian) khi gặp nhau tạo ra những điểm dao động tăng cường (cực đại) xen kẽ những điểm dao động triệt tiêu (cực tiểu).\n• **Cực đại giao thoa**: Hiệu đường đi bằng số nguyên lần bước sóng: $d_2 - d_1 = k\\lambda$ ($k = 0, \\pm 1, \\pm 2...$).\n• **Cực tiểu giao thoa**: Hiệu đường đi bằng số bán nguyên lần bước sóng: $d_2 - d_1 = (k + 0,5)\\lambda$.",
            "keyTakeaway": "Ghi nhớ: Hiện tượng giao thoa là bằng chứng thực nghiệm rõ ràng nhất chứng minh bản chất sóng."
          }
        ],
        "summaryFormulas": [
          {
            "name": "Bước sóng",
            "latex": "\\lambda = v \\cdot T = \\frac{v}{f}",
            "unit": "Mét (m)",
            "notes": "Khoảng cách giữa hai điểm gần nhau nhất trên cùng phương truyền sóng dao động cùng pha."
          },
          {
            "name": "Điều kiện cực đại giao thoa",
            "latex": "d_2 - d_1 = k \\cdot \\lambda",
            "unit": "Mét (m)",
            "notes": "Hai sóng tới cùng pha tăng cường biên độ lên gấp đôi (A = 2a)."
          }
        ],
        "theory": {
          "part1_points": [
            {
              "num": 1,
              "heading": "Sóng cơ và các đại lượng đặc trưng",
              "content": "Sóng cơ là dao động cơ lan truyền trong môi trường vật chất theo thời gian. Bước sóng $\\lambda = v \\cdot T = \\frac{v}{f}$ là quãng đường sóng truyền đi được trong một chu kì dao động."
            },
            {
              "num": 2,
              "heading": "Giao thoa sóng cơ học",
              "content": "Là hiện tượng hai sóng kết hợp (cùng tần số và hiệu số pha không đổi theo thời gian) khi gặp nhau tạo ra những điểm dao động tăng cường (cực đại) xen kẽ những điểm dao động triệt tiêu (cực tiểu).\n• **Cực đại giao thoa**: Hiệu đường đi bằng số nguyên lần bước sóng: $d_2 - d_1 = k\\lambda$ ($k = 0, \\pm 1, \\pm 2...$).\n• **Cực tiểu giao thoa**: Hiệu đường đi bằng số bán nguyên lần bước sóng: $d_2 - d_1 = (k + 0,5)\\lambda$.",
              "keyTakeaway": "Ghi nhớ: Hiện tượng giao thoa là bằng chứng thực nghiệm rõ ràng nhất chứng minh bản chất sóng."
            }
          ],
          "ghiNho": "Ghi nhớ: Hiện tượng giao thoa là bằng chứng thực nghiệm rõ ràng nhất chứng minh bản chất sóng.",
          "part2_formulas": [
            {
              "formula": "\\lambda = v \\cdot T = \\frac{v}{f}",
              "quantity": "Bước sóng",
              "symbol": "\\lambda",
              "unit": "Mét (m)",
              "meaning": "Khoảng cách giữa hai điểm gần nhau nhất trên cùng phương truyền sóng dao động cùng pha."
            },
            {
              "formula": "d_2 - d_1 = k \\cdot \\lambda",
              "quantity": "Điều kiện cực đại giao thoa",
              "symbol": "\\Delta d",
              "unit": "Mét (m)",
              "meaning": "Hai sóng tới cùng pha tăng cường biên độ lên gấp đôi (A = 2a)."
            }
          ],
          "part3_applications": [
            "Công nghệ tai nghe chống ồn chủ động (Active Noise Cancellation) tạo ra sóng âm ngược pha để triệt tiêu tiếng ồn môi trường.",
            "Phân tích gợn sóng nước mặt hồ kiểm chứng tính chất kết hợp của hai cần rung."
          ]
        },
        "quizzes": [
          {
            "id": "q_bsc_1",
            "question": "Bước sóng λ là khoảng cách giữa hai điểm gần nhau nhất trên cùng một phương truyền sóng mà dao động tại hai điểm đó:",
            "questionEn": "Wavelength λ is the distance between two closest points on the same wave propagation line that oscillate:",
            "options": [
              "Ngược pha nhau",
              "Cùng pha nhau",
              "Vuông pha nhau",
              "Lệch pha π/4"
            ],
            "correctIndex": 1,
            "explanation": "Theo định nghĩa bước sóng: Bước sóng là quãng đường sóng truyền đi trong 1 chu kì, cũng là khoảng cách giữa hai điểm gần nhau nhất trên cùng phương truyền sóng dao động cùng pha.",
            "conceptTested": "Định nghĩa bước sóng",
            "textbookRef": "Chuyên đề Sóng cơ",
            "correctAnswer": 1
          },
          {
            "id": "q_bsc_2",
            "question": "Một sóng cơ truyền với tốc độ v = 10 m/s và tần số f = 5 Hz. Bước sóng λ của sóng này là:",
            "questionEn": "A wave travels at v = 10 m/s with frequency f = 5 Hz. Its wavelength λ is:",
            "options": [
              "0,5 m",
              "2 m",
              "50 m",
              "15 m"
            ],
            "correctIndex": 1,
            "explanation": "λ = v / f = 10 / 5 = 2 m.",
            "conceptTested": "Tính bước sóng từ tốc độ và tần số",
            "textbookRef": "Chuyên đề Sóng cơ",
            "correctAnswer": 1
          },
          {
            "id": "q_bsc_3",
            "question": "Hiện tượng giao thoa sóng xảy ra khi có sự gặp nhau của:",
            "questionEn": "Wave interference occurs when there is superimposition of:",
            "options": [
              "Hai sóng bất kì lan truyền trong không gian",
              "Hai sóng kết hợp (cùng phương, cùng tần số và độ lệch pha không đổi theo thời gian)",
              "Một sóng âm và một sóng ánh sáng",
              "Hai sóng có tần số rất khác nhau"
            ],
            "correctIndex": 1,
            "explanation": "Điều kiện cần và đủ để xảy ra giao thoa ổn định là hai nguồn sóng phải là hai nguồn kết hợp.",
            "conceptTested": "Điều kiện giao thoa sóng",
            "textbookRef": "Chuyên đề Sóng cơ",
            "correctAnswer": 1
          },
          {
            "id": "q_bsc_4",
            "question": "Trong miền giao thoa của hai nguồn cùng pha, những điểm có hiệu đường đi d₂ - d₁ = kλ (k nguyên) sẽ dao động với biên độ:",
            "questionEn": "In the interference pattern of two in-phase sources, points with d₂ - d₁ = kλ oscillate with:",
            "options": [
              "Biên độ cực đại (bằng tổng biên độ hai sóng)",
              "Biên độ triệt tiêu (bằng 0)",
              "Biên độ giảm đi một nửa",
              "Tần số tăng gấp đôi"
            ],
            "correctIndex": 0,
            "explanation": "Khi d₂ - d₁ = kλ, hai sóng thành phần gửi tới điểm đó hoàn toàn cùng pha nhau, tạo nên cực đại giao thoa có biên độ A_max = a₁ + a₂.",
            "conceptTested": "Cực đại giao thoa",
            "textbookRef": "Chuyên đề Sóng cơ",
            "correctAnswer": 0
          },
          {
            "id": "q_bsc_5",
            "question": "Tai nghe chống ồn chủ động (ANC) áp dụng hiện tượng vật lí nào để khử tạp âm từ môi trường ngoài?",
            "questionEn": "Active Noise Cancelling (ANC) headphones utilize which physical phenomenon to eliminate noise?",
            "options": [
              "Hiện tượng khúc xạ sóng âm",
              "Hiện tượng giao thoa sóng triệt tiêu (phát ra sóng âm ngược pha 180°)",
              "Hiện tượng phản xạ sóng siêu âm",
              "Hiện tượng biến điệu điện từ"
            ],
            "correctIndex": 1,
            "explanation": "Tai nghe ANC phát hiện tiếng ồn và tạo ra một sóng âm có cùng biên độ nhưng ngược pha (lệch pha 180°), hai sóng giao thoa triệt tiêu lẫn nhau.",
            "conceptTested": "Ứng dụng giao thoa triệt tiêu trong ANC",
            "textbookRef": "Chuyên đề Sóng cơ",
            "correctAnswer": 1
          }
        ],
        "available": true
      }
    ]
  }
];

export function getAllLessons(): LessonItem[] {
  return curriculumChapters.flatMap(c => c.lessons);
}

export const curriculumTopics: LessonItem[] = getAllLessons();

export function getLessonById(id: string): LessonItem | undefined {
  return getAllLessons().find(l => l.id === id);
}

export const physicsTheoryLessons: PhysicsTheoryLesson[] = getAllLessons().map(l => ({
  ...l,
  theoryContent: {
    sections: l.sections,
    formulas: l.summaryFormulas,
    keyTakeaways: l.sections.map(s => s.keyTakeaway).filter((k): k is string => Boolean(k))
  },
  quizQuestions: l.quizzes
}));

export const physicsTheoryChapters: PhysicsTheoryChapter[] = curriculumChapters.map(c => ({
  id: c.id,
  number: c.number,
  title: c.title,
  lessons: physicsTheoryLessons.filter(l => l.chapterId === c.id)
}));

export function getPhysicsTheoryLesson(lessonId: string): PhysicsTheoryLesson {
  return physicsTheoryLessons.find(l => l.id === lessonId) ?? physicsTheoryLessons[0];
}

// Backward compatibility alias for quizzesData
export const quizzesData: Record<string, QuizQuestionItem[]> = Object.fromEntries(
  getAllLessons().map(l => [l.id, l.quizzes])
);

// Backward compatibility alias for chaptersData
export const chaptersData = curriculumChapters;

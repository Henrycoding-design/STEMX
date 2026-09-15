export interface FormulaItem {
  formula: string;
  quantity: string;
  symbol: string;
  unit: string;
  meaning: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
  conceptTested: string;
  textbookRef: string;
}

export interface LessonItem {
  id: string;
  chapterId: string;
  lessonNum: number;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  labTag: string;
  labTagEn: string;
  knttRef: string;
  ctstRef: string;
  simulationId: string;
  theory: {
    part1_points: {
      num: number;
      heading: string;
      content: string;
    }[];
    ghiNho: string;
    part2_formulas: FormulaItem[];
    part3_applications: string[];
  };
  quizzes: QuizQuestionItem[];
}

export interface ChapterItem {
  id: string;
  title: string;
  titleEn: string;
  lessons: LessonItem[];
}

export const curriculumChapters: ChapterItem[] = [
  {
    id: "chuong-1",
    title: "MỞ ĐẦU",
    titleEn: "INTRODUCTION",
    lessons: [
      {
        id: "bai-1",
        chapterId: "chuong-1",
        lessonNum: 1,
        title: "Làm quen với Vật lí",
        titleEn: "Getting Started with Physics",
        subtitle: "Đối tượng nghiên cứu của Vật lí, phương pháp thực nghiệm và phương pháp mô hình.",
        subtitleEn: "Study object of Physics, experimental and modeling methods.",
        labTag: "Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi",
        labTagEn: "Leaning Tower of Pisa Simulation - Falling Verification",
        knttRef: "KNTT Bài 1 (Trang 7)",
        ctstRef: "CTST Bài 1 (Trang 6)",
        simulationId: "measurement-error",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Đối tượng nghiên cứu của Vật lí",
              content: "Vật lí là môn khoa học tự nhiên nghiên cứu về các dạng vận động của vật chất (chất, trường) và năng lượng. Các lĩnh vực chính gồm Cơ học, Nhiệt học, Điện - Từ học, Quang học, Vật lí hạt nhân."
            },
            {
              num: 2,
              heading: "Phương pháp nghiên cứu trong Vật lí",
              content: "Gồm hai phương pháp cốt lõi: **Phương pháp thực nghiệm** (dùng thí nghiệm để phát hiện hoặc kiểm chứng quy luật, như Galileo thí nghiệm thả rơi ở tháp Pisa) và **Phương pháp lí thuyết** (xây dựng mô hình toán học và suy luận logic)."
            }
          ],
          ghiNho: "Ghi nhớ: Phương pháp thực nghiệm là nền tảng cốt lõi của Vật lí học; mọi giả thuyết lí thuyết đều phải được kiểm chứng qua thực nghiệm.",
          part2_formulas: [
            {
              formula: "x = \\bar{x} \\pm \\Delta x",
              quantity: "Kết quả phép đo",
              symbol: "x",
              unit: "Đơn vị đo của đại lượng",
              meaning: "Giá trị đo được bằng giá trị trung bình cộng trừ sai số tuyệt đối."
            }
          ],
          part3_applications: [
            "Kiểm chứng giả thuyết hai vật nặng nhẹ rơi cùng gia tốc trong chân không.",
            "Ứng dụng mô hình hóa trong thiết kế khí động học ô tô và máy bay."
          ]
        },
        quizzes: [
          {
            id: "q_b1_1",
            question: "Đối tượng nghiên cứu chủ yếu của Vật lí học bao gồm:",
            questionEn: "The primary study subject of Physics includes:",
            options: [
              "Sự biến đổi của các chất tạo thành chất mới",
              "Các dạng vận động của vật chất và năng lượng",
              "Sự phát triển và tiến hóa của các loài sinh vật",
              "Cấu tạo địa chất và các mỏ khoáng sản"
            ],
            correctIndex: 1,
            explanation: "SGK KNTT Bài 1 (Trang 7) & CTST Bài 1: Vật lí là môn khoa học nghiên cứu các dạng vận động của vật chất (chất, trường) và năng lượng.",
            conceptTested: "Đối tượng nghiên cứu của Vật lí",
            textbookRef: "KNTT Bài 1 (Trang 7)"
          },
          {
            id: "q_b1_2",
            question: "Hai phương pháp nghiên cứu chính trong Vật lí học là:",
            questionEn: "The two main research methods in Physics are:",
            options: [
              "Phương pháp quan sát thiên văn và bói toán",
              "Phương pháp thực nghiệm và phương pháp lí thuyết",
              "Phương pháp điều tra xã hội và phỏng vấn",
              "Phương pháp thử nghiệm ngẫu nhiên không ghi chép"
            ],
            correctIndex: 1,
            explanation: "SGK KNTT Trang 9: Phương pháp thực nghiệm và phương pháp lí thuyết có mối quan hệ biện chứng, hỗ trợ nhau trong quá trình nhận thức thế giới tự nhiên.",
            conceptTested: "Phương pháp nghiên cứu Vật lí",
            textbookRef: "KNTT Bài 1 (Trang 9)"
          },
          {
            id: "q_b1_3",
            question: "Thí nghiệm nổi tiếng của nhà bác học Galileo Galilei tại tháp nghiêng Pisa nhằm mục đích gì?",
            questionEn: "Galileo Galilei's famous experiment at the Leaning Tower of Pisa aimed to:",
            options: [
              "Đo chiều cao chính xác của tháp nghiêng Pisa",
              "Bác bỏ quan niệm của Aristotle rằng vật nặng rơi nhanh hơn vật nhẹ trong không khí/chân không",
              "Xác định độ ẩm của không khí tại thành phố Pisa",
              "Chứng minh Trái Đất quay quanh Mặt Trời"
            ],
            correctIndex: 1,
            explanation: "Galileo đã thả hai quả cầu có khối lượng khác nhau từ đỉnh tháp để chứng minh chúng chạm đất gần như cùng lúc, bác bỏ quan niệm sai lầm của Aristotle.",
            conceptTested: "Thực nghiệm Galileo",
            textbookRef: "KNTT Bài 1 (Trang 8)"
          },
          {
            id: "q_b1_4",
            question: "Bước đầu tiên trong tiến trình tìm hiểu thế giới tự nhiên dưới góc độ Vật lí là:",
            questionEn: "The first step in scientific inquiry in Physics is:",
            options: [
              "Đề xuất giả thuyết khoa học",
              "Quan sát, xác định vấn đề cần nghiên cứu",
              "Thiết kế và tiến hành thí nghiệm",
              "Rút ra kết luận và viết báo cáo"
            ],
            correctIndex: 1,
            explanation: "Quy trình tìm hiểu thế giới tự nhiên bắt đầu từ việc quan sát hiện tượng và nhận ra vấn đề cần nghiên cứu.",
            conceptTested: "Tiến trình nghiên cứu khoa học",
            textbookRef: "KNTT Bài 1 (Trang 9)"
          },
          {
            id: "q_b1_5",
            question: "Yếu tố nào sau đây đóng vai trò kiểm chứng cuối cùng tính đúng đắn của một định luật Vật lí?",
            questionEn: "Which factor serves as the ultimate test of a physical law?",
            options: [
              "Ý kiến của các nhà triết học cổ đại",
              "Kết quả kiểm chứng bằng thực nghiệm",
              "Số lượng người tin vào định luật đó",
              "Sự phức tạp của công thức toán học"
            ],
            correctIndex: 1,
            explanation: "Trong Vật lí học, thực nghiệm là thước đo chân lí tối cao để kiểm chứng mọi lí thuyết và mô hình.",
            conceptTested: "Vai trò thực nghiệm",
            textbookRef: "KNTT Bài 1 (Trang 10)"
          }
        ]
      },
      {
        id: "bai-2",
        chapterId: "chuong-1",
        lessonNum: 2,
        title: "Các quy tắc an toàn trong phòng thực hành",
        titleEn: "Safety Rules in the Physics Lab",
        subtitle: "Nhận biết các kí hiệu cảnh báo nguy hiểm, quy tắc an toàn điện và sử dụng thiết bị quang học.",
        subtitleEn: "Safety signs, electrical safety guidelines, and optical equipment care.",
        labTag: "Vận hành Nguồn điện & Thiết bị đo an toàn",
        labTagEn: "Power Supply & Electrical Measurement Safety",
        knttRef: "KNTT Bài 2 (Trang 11)",
        ctstRef: "CTST Bài 2 (Trang 12)",
        simulationId: "electric-circuit",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Kí hiệu cảnh báo an toàn",
              content: "Kí hiệu hình tam giác viền đen nền vàng cảnh báo nguy hiểm (nguy hiểm điện giật, từ trường mạnh, tia laser, chất độc). Kí hiệu hình tròn viền đỏ gạch chéo là biển cấm."
            },
            {
              num: 2,
              heading: "Quy tắc an toàn khi sử dụng thiết bị điện",
              content: "Chỉ cắm điện sau khi đã mắc xong mạch điện và được giáo viên kiểm tra. Tuyệt đối không chạm tay ướt vào nguồn điện. Luôn chỉnh đồng hồ vạn năng về thang đo lớn nhất trước khi đo đại lượng chưa biết."
            }
          ],
          ghiNho: "Ghi nhớ: An toàn điện và bảo vệ thiết bị đo là ưu tiên số một trong mọi giờ thực hành Vật lí.",
          part2_formulas: [
            {
              formula: "I_{max} \\le I_{dm}",
              quantity: "Cường độ dòng điện an toàn",
              symbol: "I",
              unit: "Ampe (A)",
              meaning: "Dòng điện thực tế không được vượt quá giá trị định mức của thiết bị để tránh cháy nổ."
            }
          ],
          part3_applications: [
            "Sử dụng cầu chì và aptomat ngắt tự động trong gia đình khi quá tải.",
            "Đeo kính bảo hộ chuyên dụng khi làm thí nghiệm với nguồn sáng Laser."
          ]
        },
        quizzes: [
          {
            id: "q_b2_1",
            question: "Biển cảnh báo có hình tam giác đều, viền đen, nền vàng mang ý nghĩa:",
            questionEn: "A triangular sign with black border and yellow background indicates:",
            options: [
              "Biển báo cấm thực hiện hành vi",
              "Biển báo nguy hiểm, khu vực cần cẩn trọng",
              "Biển chỉ dẫn lối thoát hiểm",
              "Biển thông báo thiết bị hỏng"
            ],
            correctIndex: 1,
            explanation: "SGK KNTT Bài 2 (Trang 12): Biển hình tam giác nền vàng viền đen là biển cảnh báo nguy hiểm (điện cao thế, laser, từ trường mạnh...).",
            conceptTested: "Kí hiệu an toàn phòng thí nghiệm",
            textbookRef: "KNTT Bài 2 (Trang 12)"
          },
          {
            id: "q_b2_2",
            question: "Khi sử dụng đồng hồ đo điện đa năng để đo hiệu điện thế chưa biết giá trị, thao tác đúng là:",
            questionEn: "When using a multimeter to measure an unknown voltage, the correct procedure is:",
            options: [
              "Chọn thang đo nhỏ nhất để có độ chính xác cao nhất",
              "Chọn thang đo lớn nhất rồi hạ dần xuống thang đo thích hợp",
              "Chuyển núm xoay sang thang đo ôm kế (Ω)",
              "Cắm que đo trực tiếp mà không cần quan tâm thang đo"
            ],
            correctIndex: 1,
            explanation: "Luôn chọn thang đo lớn nhất để tránh trường hợp hiệu điện thế thực tế vượt quá giới hạn làm cháy đồng hồ đo.",
            conceptTested: "Quy tắc an toàn đồng hồ vạn năng",
            textbookRef: "KNTT Bài 2 (Trang 13)"
          },
          {
            id: "q_b2_3",
            question: "Hành động nào sau đây là vi phạm quy tắc an toàn trong phòng thực hành Vật lí?",
            questionEn: "Which of the following violates physics lab safety rules?",
            options: [
              "Kiểm tra mạch điện cẩn thận trước khi đóng khóa K",
              "Nhờ giáo viên kiểm tra mạch trước khi cấp nguồn",
              "Dùng tay ướt để cắm phích điện vào ổ cắm nguồn 220V",
              "Tắt nguồn điện ngay sau khi hoàn thành thí nghiệm"
            ],
            correctIndex: 2,
            explanation: "Nước dẫn điện, dùng tay ướt cắm điện có nguy cơ bị điện giật nguy hiểm đến tính mạng.",
            conceptTested: "An toàn sử dụng điện",
            textbookRef: "KNTT Bài 2 (Trang 13)"
          },
          {
            id: "q_b2_4",
            question: "Khi làm việc với tia laser trong phòng thực hành quang học, điều tối kị là:",
            questionEn: "When working with laser beams in the optics lab, it is strictly forbidden to:",
            options: [
              "Chiếu tia laser vào màn chắn chắn sáng",
              "Nhìn trực tiếp vào chùm tia laser hoặc chiếu vào mắt người khác",
              "Đặt nguồn laser trên giá đỡ cố định",
              "Đeo kính bảo hộ quang học thích hợp"
            ],
            correctIndex: 1,
            explanation: "Tia laser có mật độ năng lượng rất cao, chiếu trực tiếp vào mắt có thể làm cháy võng mạc và gây mù lòa vĩnh viễn.",
            conceptTested: "An toàn quang học Laser",
            textbookRef: "KNTT Bài 2 (Trang 14)"
          },
          {
            id: "q_b2_5",
            question: "Trong mạch điện thí nghiệm, thiết bị nào dùng để ngắt mạch tự động khi xảy ra đoản mạch hoặc quá tải?",
            questionEn: "Which device automatically disconnects the circuit during a short circuit or overload?",
            options: [
              "Điện trở than",
              "Cầu chì hoặc aptomat (CB)",
              "Biến trở con chạy",
              "Bóng đèn dây tóc"
            ],
            correctIndex: 1,
            explanation: "Cầu chì hoặc aptomat bảo vệ mạch điện bằng cách tự động ngắt dòng điện khi xảy ra sự cố quá dòng.",
            conceptTested: "Thiết bị bảo vệ mạch",
            textbookRef: "KNTT Bài 2 (Trang 14)"
          }
        ]
      },
      {
        id: "bai-3",
        chapterId: "chuong-1",
        lessonNum: 3,
        title: "Thực hành tính sai số trong phép đo",
        titleEn: "Measurement and Error Analysis Lab",
        subtitle: "Sai số hệ thống, sai số ngẫu nhiên, cách biểu diễn kết quả đo với số chữ số có nghĩa.",
        subtitleEn: "Systematic error, random error, measurement expression with significant figures.",
        labTag: "Đo tốc độ của viên bi thép lăn trên máng nghiêng",
        labTagEn: "Measurement of Steel Ball Rolling Down Incline",
        knttRef: "KNTT Bài 3 (Trang 15)",
        ctstRef: "CTST Bài 3 (Trang 16)",
        simulationId: "measurement-error",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Phân loại sai số",
              content: "• **Sai số hệ thống**: Có quy luật lặp lại (do dụng cụ bị lệch điểm 0, vạch chia sai). Thường lấy bằng nửa độ chia nhỏ nhất hoặc một độ chia nhỏ nhất.\n• **Sai số ngẫu nhiên**: Do tác động bất thường của môi trường hoặc phản xạ con người khi bấm đồng hồ."
            },
            {
              num: 2,
              heading: "Cách xác định sai số tuyệt đối và tương đối",
              content: "Giá trị trung bình: $\\bar{A} = \\frac{A_1 + A_2 + ... + A_n}{n}$. Sai số ngẫu nhiên: $\\overline{\\Delta A} = \\frac{|\\bar{A}-A_1| + ... + |\\bar{A}-A_n|}{n}$.\nSai số tuyệt đối: $\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$. Sai số tỉ đối: $\\delta A = \\frac{\\Delta A}{\\bar{A}} \\times 100\\%$."
            }
          ],
          ghiNho: "Ghi nhớ: Kết quả đo luôn được viết dưới dạng: A = Ā ± ΔA, trong đó ΔA thường được làm tròn đến một hoặc hai chữ số có nghĩa.",
          part2_formulas: [
            {
              formula: "\\bar{A} = \\frac{1}{n}\\sum_{i=1}^n A_i",
              quantity: "Giá trị trung bình",
              symbol: "\\bar{A}",
              unit: "Đơn vị đo của A",
              meaning: "Giá trị gần đúng nhất với giá trị thực của đại lượng cần đo."
            },
            {
              formula: "\\delta A = \\frac{\\Delta A}{\\bar{A}} \\times 100\\%",
              quantity: "Sai số tỉ đối",
              symbol: "\\delta A",
              unit: "%",
              meaning: "Đánh giá mức độ chính xác của phép đo (sai số tỉ đối càng nhỏ, phép đo càng chính xác)."
            }
          ],
          part3_applications: [
            "Đo đường kính ngoài của ống trụ bằng thước kẹp cơ khí chuẩn xác đến 0,02 mm.",
            "Hiệu chuẩn cân điện tử phân tích trong phòng thí nghiệm hóa dược."
          ]
        },
        quizzes: [
          {
            id: "q_b3_1",
            question: "Sai số dụng cụ thông thường được lấy bằng:",
            questionEn: "The instrumental error is conventionally taken as:",
            options: [
              "Gấp đôi độ chia nhỏ nhất của dụng cụ",
              "Một nửa hoặc một độ chia nhỏ nhất của dụng cụ đo",
              "Bằng không nếu dụng cụ còn mới",
              "10% giá trị lớn nhất trên thang đo"
            ],
            correctIndex: 1,
            explanation: "Theo quy ước SGK Vật lí 10, sai số dụng cụ ΔA_dc thường được lấy bằng một nửa hoặc một độ chia nhỏ nhất trên dụng cụ.",
            conceptTested: "Sai số dụng cụ",
            textbookRef: "KNTT Bài 3 (Trang 16)"
          },
          {
            id: "q_b3_2",
            question: "Đo chiều dài một chiếc bút 5 lần thu được các giá trị: 14,2 cm; 14,3 cm; 14,2 cm; 14,4 cm; 14,2 cm. Giá trị trung bình là:",
            questionEn: "Measuring a pen length 5 times yields: 14.2; 14.3; 14.2; 14.4; 14.2 cm. The mean value is:",
            options: [
              "14,20 cm",
              "14,26 cm",
              "14,30 cm",
              "14,25 cm"
            ],
            correctIndex: 1,
            explanation: "L_tb = (14,2 + 14,3 + 14,2 + 14,4 + 14,2) / 5 = 71,3 / 5 = 14,26 cm.",
            conceptTested: "Tính giá trị trung bình",
            textbookRef: "KNTT Bài 3 (Trang 17)"
          },
          {
            id: "q_b3_3",
            question: "Phép đo một đại lượng A cho kết quả A = (20,0 ± 0,4) cm. Sai số tỉ đối δA của phép đo là:",
            questionEn: "A measurement gives A = (20.0 ± 0.4) cm. The relative error δA is:",
            options: [
              "0,2%",
              "2,0%",
              "4,0%",
              "0,4%"
            ],
            correctIndex: 1,
            explanation: "δA = (ΔA / A_tb) · 100% = (0,4 / 20,0) · 100% = 2,0%.",
            conceptTested: "Tính sai số tỉ đối",
            textbookRef: "KNTT Bài 3 (Trang 17)"
          },
          {
            id: "q_b3_4",
            question: "Để giảm thiểu sai số ngẫu nhiên trong một bài thực hành Vật lí, người làm thí nghiệm cần:",
            questionEn: "To minimize random errors in a physics experiment, one should:",
            options: [
              "Chỉ đo đúng 1 lần thật cẩn thận",
              "Thực hiện phép đo lặp lại nhiều lần và lấy giá trị trung bình",
              "Thay đổi người đo ở mỗi lần thử nghiệm",
              "Làm tròn số liệu đo về số nguyên gần nhất"
            ],
            correctIndex: 1,
            explanation: "Việc đo lặp lại nhiều lần và tính giá trị trung bình giúp triệt tiêu các dao động ngẫu nhiên theo quy luật thống kê.",
            conceptTested: "Khắc phục sai số ngẫu nhiên",
            textbookRef: "KNTT Bài 3 (Trang 18)"
          },
          {
            id: "q_b3_5",
            question: "Cho đại lượng F = m · a. Nếu sai số tỉ đối của m là 1% và của a là 2% thì sai số tỉ đối của F là:",
            questionEn: "Given F = m · a with relative errors δm = 1% and δa = 2%, the relative error δF is:",
            options: [
              "1%",
              "2%",
              "3%",
              "2% - 1% = 1%"
            ],
            correctIndex: 2,
            explanation: "Khi tính tích F = m · a, sai số tỉ đối của tích bằng tổng các sai số tỉ đối: δF = δm + δa = 1% + 2% = 3%.",
            conceptTested: "Lan truyền sai số trong phép nhân",
            textbookRef: "KNTT Bài 3 (Trang 18)"
          }
        ]
      }
    ]
  },
  {
    id: "chuong-2",
    title: "ĐỘNG HỌC",
    titleEn: "KINEMATICS",
    lessons: [
      {
        id: "bai-4",
        chapterId: "chuong-2",
        lessonNum: 4,
        title: "Độ dịch chuyển và quãng đường đi được",
        titleEn: "Displacement and Distance Traveled",
        subtitle: "Phân biệt đại lượng vô hướng (quãng đường s) và đại lượng véc-tơ (độ dịch chuyển d).",
        subtitleEn: "Distinguish scalar distance s and vector displacement d.",
        labTag: "Mô phỏng Quãng đường vs Độ dịch chuyển 2D",
        labTagEn: "Distance vs Displacement 2D Simulation",
        knttRef: "KNTT Bài 4 (Trang 21)",
        ctstRef: "CTST Bài 4 (Trang 24)",
        simulationId: "displacement-time",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Quãng đường đi được (s)",
              content: "Quãng đường đi được là độ dài quỹ đạo chuyển động của vật. Quãng đường là đại lượng vô hướng, luôn dương ($s > 0$) hoặc bằng 0 khi vật đứng yên."
            },
            {
              num: 2,
              heading: "Độ dịch chuyển (véc-tơ d)",
              content: "Độ dịch chuyển là một đại lượng véc-tơ nối từ vị trí đầu đến vị trí cuối của chuyển động: $\\vec{d} = \\vec{x}_2 - \\vec{x}_1$. Độ lớn của độ dịch chuyển là khoảng cách ngắn nhất giữa hai điểm đầu và cuối."
            },
            {
              num: 3,
              heading: "Khi nào quãng đường bằng độ lớn độ dịch chuyển?",
              content: "Chỉ khi vật chuyển động **thẳng và không đổi chiều** thì độ lớn độ dịch chuyển mới bằng quãng đường đi được ($d = s$). Nếu vật đổi chiều hoặc đi đường vòng thì $d < s$."
            }
          ],
          ghiNho: "Ghi nhớ: Quãng đường s phụ thuộc vào hình dạng quỹ đạo; độ dịch chuyển d chỉ phụ thuộc vào vị trí đầu và vị trí cuối.",
          part2_formulas: [
            {
              formula: "d = x_2 - x_1",
              quantity: "Độ dịch chuyển 1D",
              symbol: "d",
              unit: "Mét (m)",
              meaning: "Độ biến thiên tọa độ từ vị trí ban đầu x1 đến vị trí cuối x2."
            },
            {
              formula: "s = \\sum |\\Delta x_i|",
              quantity: "Quãng đường",
              symbol: "s",
              unit: "Mét (m)",
              meaning: "Tổng chiều dài các cung quỹ đạo mà vật đã đi qua."
            }
          ],
          part3_applications: [
            "Đo quãng đường bằng công-tơ-mét xe máy so với đường chim bay trên bản đồ Google Maps.",
            "Vận động viên bơi một vòng bể bơi 50 m rồi quay về vạch xuất phát: quãng đường s = 100 m nhưng độ dịch chuyển d = 0 m."
          ]
        },
        quizzes: [
          {
            id: "q_b4_1",
            question: "Phát biểu nào sau đây phân biệt ĐÚNG giữa quãng đường s và độ dịch chuyển d?",
            questionEn: "Which statement correctly distinguishes distance s and displacement d?",
            options: [
              "Quãng đường là đại lượng véc-tơ, độ dịch chuyển là đại lượng vô hướng",
              "Quãng đường luôn dương hoặc bằng 0; độ dịch chuyển là véc-tơ có thể dương, âm hoặc bằng 0",
              "Độ lớn độ dịch chuyển luôn lớn hơn quãng đường đi được",
              "Quãng đường và độ dịch chuyển luôn có giá trị bằng nhau trong mọi chuyển động"
            ],
            correctIndex: 1,
            explanation: "SGK KNTT Bài 4 (Trang 22): Quãng đường s là đại lượng vô hướng không âm, còn độ dịch chuyển d là đại lượng véc-tơ xác định hướng và độ dời từ điểm đầu đến điểm cuối.",
            conceptTested: "Phân biệt quãng đường và độ dịch chuyển",
            textbookRef: "KNTT Bài 4 (Trang 22)"
          },
          {
            id: "q_b4_2",
            question: "Một người đi từ điểm A đến điểm B cách 60 m về phía Đông, sau đó rẽ sang phía Bắc đi tiếp 80 m đến điểm C. Quãng đường s và độ lớn độ dịch chuyển d lần lượt là:",
            questionEn: "A person travels 60 m East then 80 m North. The distance s and displacement magnitude d are:",
            options: [
              "s = 140 m; d = 140 m",
              "s = 140 m; d = 100 m",
              "s = 100 m; d = 140 m",
              "s = 100 m; d = 100 m"
            ],
            correctIndex: 1,
            explanation: "Quãng đường s = 60 + 80 = 140 m. Do hai phương vuông góc, độ lớn độ dịch chuyển theo Pythagoras: d = √(60² + 80²) = 100 m.",
            conceptTested: "Tính độ dịch chuyển 2D vuông góc",
            textbookRef: "KNTT Bài 4 (Trang 24)"
          },
          {
            id: "q_b4_3",
            question: "Một vận động viên bơi xuất phát từ đầu bể, bơi đến cuối bể dài 50 m rồi bơi quay trở lại vạch xuất phát. Độ lớn độ dịch chuyển của vận động viên là:",
            questionEn: "A swimmer swims 50 m to the other end and returns to the start. Their displacement magnitude is:",
            options: [
              "100 m",
              "50 m",
              "0 m",
              "25 m"
            ],
            correctIndex: 2,
            explanation: "Vị trí cuối trùng với vị trí đầu xuất phát, do đó véc-tơ độ dịch chuyển bằng véc-tơ 0, độ lớn d = 0 m (mặc dù quãng đường s = 100 m).",
            conceptTested: "Độ dịch chuyển chu trình khép kín",
            textbookRef: "KNTT Bài 4 (Trang 23)"
          },
          {
            id: "q_b4_4",
            question: "Độ lớn độ dịch chuyển bằng quãng đường đi được (d = s) khi và chỉ khi:",
            questionEn: "The displacement magnitude equals distance traveled (d = s) if and only if:",
            options: [
              "Vật chuyển động tròn đều",
              "Vật chuyển động thẳng và không đổi chiều",
              "Vật chuyển động thẳng và có đổi chiều",
              "Vật chuyển động với gia tốc không đổi"
            ],
            correctIndex: 1,
            explanation: "Chỉ khi chuyển động trên một đường thẳng và theo một chiều duy nhất thì độ dài đoạn thẳng nối điểm đầu và cuối mới bằng độ dài quỹ đạo.",
            conceptTested: "Điều kiện d = s",
            textbookRef: "KNTT Bài 4 (Trang 23)"
          },
          {
            id: "q_b4_5",
            question: "Trên trục tọa độ Ox, một chất điểm ban đầu ở x₁ = +5 m, sau một khoảng thời gian chuyển động đến x₂ = -3 m. Độ dịch chuyển d của chất điểm là:",
            questionEn: "On the Ox axis, a particle moves from x₁ = +5 m to x₂ = -3 m. Its displacement is:",
            options: [
              "+8 m",
              "-8 m",
              "+2 m",
              "-2 m"
            ],
            correctIndex: 1,
            explanation: "d = x₂ - x₁ = -3 - 5 = -8 m. Dấu trừ biểu thị độ dịch chuyển ngược chiều dương của trục Ox.",
            conceptTested: "Độ dịch chuyển trên trục tọa độ",
            textbookRef: "KNTT Bài 4 (Trang 23)"
          }
        ]
      },
      {
        id: "bai-7",
        chapterId: "chuong-2",
        lessonNum: 7,
        title: "Đồ thị độ dịch chuyển – thời gian",
        titleEn: "Displacement - Time Graph",
        subtitle: "Đọc và vẽ đồ thị d - t trong chuyển động thẳng, ý nghĩa của độ dốc (hệ số góc) chính là vận tốc v.",
        subtitleEn: "Plotting and interpreting d - t graph; slope represents instantaneous velocity v.",
        labTag: "Vẽ Đồ thị d-t Thời gian thực",
        labTagEn: "Real-time d-t Graph Plotter",
        knttRef: "KNTT Bài 7 (Trang 32)",
        ctstRef: "CTST Bài 4 (Trang 28)",
        simulationId: "displacement-time",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "1. Dạng đồ thị độ dịch chuyển – thời gian (d – t)",
              content: "Đồ thị d – t biểu diễn mối liên hệ giữa độ dịch chuyển d (trục tung) theo thời gian t (trục hoành):\n* Trong **chuyển động thẳng đều**: $d = v \\cdot t$. Phương trình có dạng hàm bậc nhất $y = ax$, do đó đồ thị d – t là một **đường thẳng đi qua gốc tọa độ** (nếu chọn gốc tọa độ tại vị trí ban đầu).\n* Nếu tại thời điểm ban đầu vật đã ở vị trí $d_0 \\neq 0$: $d = d_0 + v \\cdot t$, đồ thị là đường thẳng cắt trục tung tại điểm $(0; d_0)$."
            },
            {
              num: 2,
              heading: "2. Ý nghĩa của độ dốc (Hệ số góc của đồ thị d - t)",
              content: "Hệ số góc (độ dốc) $k = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1}$ chính là **vận tốc v** của chuyển động.\n• **Đồ thị dốc lên**: $v > 0$ (vật chuyển động thẳng đều theo chiều dương đã chọn).\n• **Đồ thị nằm ngang**: $v = 0$ (độ dịch chuyển không đổi theo thời gian, tức vật đứng yên).\n• **Đồ thị dốc xuống**: $v < 0$ (vật chuyển động thẳng đều ngược chiều dương)."
            }
          ],
          ghiNho: "Ghi nhớ: Đồ thị d-t của chuyển động thẳng đều luôn là đường thẳng xiên góc hoặc nằm ngang.",
          part2_formulas: [
            {
              formula: "v = \\text{độ dốc} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1}",
              quantity: "Vận tốc từ hệ số góc",
              symbol: "v",
              unit: "m/s",
              meaning: "Độ dốc của đồ thị d - t biểu diễn giá trị đại số của vận tốc chuyển động."
            },
            {
              formula: "d = d_0 + v \\cdot t",
              quantity: "Phương trình chuyển động thẳng đều",
              symbol: "d",
              unit: "m",
              meaning: "Tọa độ/độ dịch chuyển của vật tại thời điểm t bất kì."
            }
          ],
          part3_applications: [
            "Hộp đen định vị GPS xe khách ghi lại đồ thị vị trí - thời gian để giám sát tốc độ tài xế.",
            "Phân tích đồ thị bơi của vận động viên để phát hiện giai đoạn tăng tốc hoặc duy trì đều đặn."
          ]
        },
        quizzes: [
          {
            id: "q_b7_1",
            question: "Độ dốc (hệ số góc) của đồ thị độ dịch chuyển – thời gian (d – t) trong chuyển động thẳng cho biết đại lượng nào?",
            questionEn: "What does the slope of the displacement-time (d - t) graph represent?",
            options: [
              "Gia tốc của chuyển động",
              "Vận tốc của chuyển động",
              "Quãng đường đi được",
              "Thời gian chuyển động"
            ],
            correctIndex: 1,
            explanation: "SGK KNTT Bài 7 (Trang 33): Hệ số góc của đường biểu diễn d - t bằng tỉ số Δd/Δt, chính là vận tốc v của vật chuyển động.",
            conceptTested: "Ý nghĩa hệ số góc đồ thị d-t",
            textbookRef: "KNTT Bài 7 (Trang 33)"
          },
          {
            id: "q_b7_2",
            question: "Đồ thị độ dịch chuyển – thời gian (d – t) là một đường thẳng song song với trục thời gian Ot biểu thị:",
            questionEn: "A horizontal straight line parallel to the time axis on a d-t graph indicates:",
            options: [
              "Vật chuyển động thẳng đều với vận tốc rất lớn",
              "Vật đứng yên không chuyển động (v = 0)",
              "Vật chuyển động biến đổi nhanh dần đều",
              "Vật đang quay đầu đổi chiều chuyển động"
            ],
            correctIndex: 1,
            explanation: "Đường thẳng nằm ngang có độ dốc k = 0, tức Δd = 0 theo thời gian => vật đứng yên tại vị trí đó.",
            conceptTested: "Đoạn nằm ngang đồ thị d-t",
            textbookRef: "KNTT Bài 7 (Trang 33)"
          },
          {
            id: "q_b7_3",
            question: "Trên đồ thị d – t, từ thời điểm t₁ = 2s vật ở d₁ = 10m đến thời điểm t₂ = 6s vật ở d₂ = 30m. Vận tốc của vật trong khoảng thời gian này là:",
            questionEn: "From t₁ = 2s (d₁ = 10m) to t₂ = 6s (d₂ = 30m), the velocity of the object is:",
            options: [
              "3,33 m/s",
              "5,0 m/s",
              "6,67 m/s",
              "20,0 m/s"
            ],
            correctIndex: 1,
            explanation: "v = Δd / Δt = (d₂ - d₁) / (t₂ - t₁) = (30 - 10) / (6 - 2) = 20 / 4 = 5,0 m/s.",
            conceptTested: "Tính vận tốc từ tọa độ đồ thị d-t",
            textbookRef: "KNTT Bài 7 (Trang 34)"
          },
          {
            id: "q_b7_4",
            question: "Một đường biểu diễn d – t dốc xuống (hướng về phía trục hoành Ot khi t tăng) cho biết:",
            questionEn: "A downward-sloping line on a d - t graph indicates:",
            options: [
              "Vật chuyển động chậm dần đều",
              "Vật chuyển động thẳng đều theo chiều âm của trục tọa độ (v < 0)",
              "Vật đang giảm dần gia tốc",
              "Thời gian đang bị lùi lại"
            ],
            correctIndex: 1,
            explanation: "Đường thẳng dốc xuống có hệ số góc âm: v = Δd/Δt < 0, tức vật đang chuyển động ngược chiều dương đã chọn.",
            conceptTested: "Đồ thị d-t dốc xuống",
            textbookRef: "KNTT Bài 7 (Trang 33)"
          },
          {
            id: "q_b7_5",
            question: "Trong hai đường thẳng (1) và (2) trên cùng một hệ trục d – t, đường (1) có góc nghiêng so với trục Ot lớn hơn đường (2). Điều đó chứng tỏ:",
            questionEn: "Line (1) has a steeper slope than line (2) on the same d-t axes. This proves:",
            options: [
              "Vật (1) chuyển động nhanh hơn vật (2) (v₁ > v₂)",
              "Vật (2) chuyển động nhanh hơn vật (1)",
              "Vật (1) có gia tốc lớn hơn vật (2)",
              "Hai vật chuyển động với tốc độ bằng nhau"
            ],
            correctIndex: 0,
            explanation: "Góc nghiêng so với trục hoành càng lớn thì độ dốc k = tan α càng lớn => độ lớn vận tốc v càng lớn.",
            conceptTested: "So sánh vận tốc qua độ dốc đồ thị",
            textbookRef: "KNTT Bài 7 (Trang 34)"
          }
        ]
      },
      {
        id: "bai-12",
        chapterId: "chuong-2",
        lessonNum: 12,
        title: "Chuyển động ném",
        titleEn: "Projectile Motion",
        subtitle: "Phân tích chuyển động ném ngang và ném xiên thành hai chuyển động thành phần độc lập trên Ox và Oy.",
        subtitleEn: "Decomposing 2D projectile motion into independent Ox and Oy components.",
        labTag: "Mô phỏng Ném ngang & Ném xiên 2D",
        labTagEn: "Horizontal and Oblique Projectile Lab",
        knttRef: "KNTT Bài 12 (Trang 50)",
        ctstRef: "CTST Bài 9 (Trang 52)",
        simulationId: "projectile-motion",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Nguyên lí độc lập tác dụng",
              content: "Chuyển động ném trong không trọng trường cản là sự kết hợp của hai chuyển động thành phần độc lập:\n• **Theo phương ngang Ox**: Không chịu lực tác dụng ($a_x = 0$) => chuyển động thẳng đều với vận tốc $v_x = v_0 \\cos\\alpha$.\n• **Theo phương thẳng đứng Oy**: Chịu tác dụng của trọng lực hướng xuống ($a_y = -g$) => chuyển động biến đổi đều với vận tốc $v_y = v_0 \\sin\\alpha - gt$."
            },
            {
              num: 2,
              heading: "Quỹ đạo và các đại lượng đặc trưng",
              content: "Quỹ đạo là một nhánh parabol: $y = (\\tan\\alpha)x - \\frac{g}{2v_0^2\\cos^2\\alpha}x^2$.\n• Thời gian bay đến khi chạm đất: $t_{bay} = \\frac{2v_0\\sin\\alpha}{g}$.\n• Tầm cao cực đại: $H = \\frac{v_0^2\\sin^2\\alpha}{2g}$.\n• Tầm xa cực đại: $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$ (đạt lớn nhất khi $\\alpha = 45^\\circ$)."
            }
          ],
          ghiNho: "Ghi nhớ: Quỹ đạo chuyển động ném là một đường parabol. Chuyển động ngang luôn là chuyển động thẳng đều.",
          part2_formulas: [
            {
              formula: "L = \\frac{v_0^2\\sin(2\\alpha)}{g}",
              quantity: "Tầm xa ném xiên",
              symbol: "L",
              unit: "m",
              meaning: "Khoảng cách ngang xa nhất vật bay được trước khi chạm đất bằng."
            },
            {
              formula: "H = \\frac{v_0^2\\sin^2\\alpha}{2g}",
              quantity: "Tầm cao cực đại",
              symbol: "H",
              unit: "m",
              meaning: "Độ cao lớn nhất so với mặt đất tại đỉnh parabol."
            }
          ],
          part3_applications: [
            "Vận động viên ném bóng rổ hoặc đẩy tạ chọn góc ném tối ưu khoảng 40° - 45° để đạt thành tích xa nhất.",
            "Tính toán góc bắn của vòi cứu hỏa dập tắt đám cháy ở nhà cao tầng."
          ]
        },
        quizzes: [
          {
            id: "q_b12_1",
            question: "Trong chuyển động ném ngang từ độ cao h với vận tốc v₀, chuyển động thành phần theo phương ngang Ox là:",
            questionEn: "In horizontal projectile motion, the motion component along horizontal Ox is:",
            options: [
              "Chuyển động thẳng nhanh dần đều với gia tốc g",
              "Chuyển động thẳng đều với vận tốc v_x = v₀",
              "Chuyển động tròn đều",
              "Chuyển động thẳng chậm dần đều"
            ],
            correctIndex: 1,
            explanation: "Theo phương ngang không có lực tác dụng (F_x = 0), gia tốc a_x = 0 nên vật chuyển động thẳng đều với vận tốc không đổi v_x = v₀.",
            conceptTested: "Thành phần chuyển động ngang",
            textbookRef: "KNTT Bài 12 (Trang 51)"
          },
          {
            id: "q_b12_2",
            question: "Quỹ đạo của chuyển động ném ngang hoặc ném xiên trong không khí (bỏ qua lực cản) là:",
            questionEn: "The trajectory of a projectile ignoring air resistance is:",
            options: [
              "Đường elip",
              "Đường thẳng",
              "Đường cong parabol",
              "Đường hypebol"
            ],
            correctIndex: 2,
            explanation: "Khử thời gian t từ phương trình x(t) và y(t) ta được phương trình bậc hai y = ax² + bx + c có đồ thị là một parabol.",
            conceptTested: "Dạng quỹ đạo ném",
            textbookRef: "KNTT Bài 12 (Trang 52)"
          },
          {
            id: "q_b12_3",
            question: "Hai vật nhỏ A và B ở cùng độ cao h. Vật A được ném ngang với vận tốc v₀, cùng lúc đó vật B được thả rơi tự do. Bỏ qua sức cản không khí, thời gian chạm đất của hai vật thỏa mãn:",
            questionEn: "Object A is launched horizontally and object B is dropped from the same height h. Their fall times satisfy:",
            options: [
              "Vật A chạm đất trước vật B",
              "Vật B chạm đất trước vật A",
              "Hai vật chạm đất cùng một thời điểm (t_A = t_B = √(2h/g))",
              "Vật nào nặng hơn chạm đất trước"
            ],
            correctIndex: 2,
            explanation: "Chuyển động theo phương thẳng đứng Oy của hai vật là hoàn toàn như nhau (rơi tự do với gia tốc g), nên thời gian rơi t = √(2h/g) như nhau.",
            conceptTested: "Thí nghiệm hai viên bi đồng thời chạm đất",
            textbookRef: "KNTT Bài 12 (Trang 52)"
          },
          {
            id: "q_b12_4",
            question: "Khi ném xiên với cùng vận tốc ban đầu v₀ trên mặt đất bằng phẳng, góc ném α nào cho tầm bay xa L lớn nhất?",
            questionEn: "At what launch angle α is the horizontal projectile range maximized?",
            options: [
              "30°",
              "45°",
              "60°",
              "90°"
            ],
            correctIndex: 1,
            explanation: "Công thức tầm xa L = (v₀² sin 2α) / g đạt giá trị cực đại khi sin 2α = 1 <=> 2α = 90° <=> α = 45°.",
            conceptTested: "Góc ném cực đại tầm xa",
            textbookRef: "KNTT Bài 12 (Trang 53)"
          },
          {
            id: "q_b12_5",
            question: "Tại điểm cao nhất của quỹ đạo ném xiên, vận tốc của vật có đặc điểm gì?",
            questionEn: "At the peak of a projectile trajectory, the velocity:",
            options: [
              "Bằng 0 hoàn toàn",
              "Chỉ có thành phần nằm ngang v_x = v₀ cos α (v_y = 0)",
              "Đạt giá trị cực đại",
              "Có hướng thẳng đứng lên trên"
            ],
            correctIndex: 1,
            explanation: "Tại đỉnh cực đại, thành phần vận tốc thẳng đứng triệt tiêu (v_y = 0), vật vẫn duy trì vận tốc nằm ngang v_x = v₀ cos α.",
            conceptTested: "Vận tốc tại đỉnh parabol",
            textbookRef: "KNTT Bài 12 (Trang 53)"
          }
        ]
      }
    ]
  },
  {
    id: "chuong-3",
    title: "ĐỘNG LỰC HỌC",
    titleEn: "DYNAMICS",
    lessons: [
      {
        id: "bai-15",
        chapterId: "chuong-3",
        lessonNum: 15,
        title: "Định luật 2 Newton & Mặt phẳng nghiêng",
        titleEn: "Newton's 2nd Law & Inclined Plane",
        subtitle: "Biểu thức véc-tơ F = m·a, phân tích lực trọng trường, phản lực và ma sát trên mặt phẳng nghiêng.",
        subtitleEn: "Vector formula F = m·a, decomposing gravity, normal and friction forces on an incline.",
        labTag: "Mô phỏng Trượt dốc & Phân tích lực véc-tơ",
        labTagEn: "Incline Slide and Force Vector Breakdown Lab",
        knttRef: "KNTT Bài 15 (Trang 63)",
        ctstRef: "CTST Bài 10 (Trang 61)",
        simulationId: "newton-dynamics",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Định luật II Newton",
              content: "Gia tốc của một vật cùng hướng với hợp lực tác dụng lên vật. Độ lớn gia tốc tỉ lệ thuận với độ lớn của hợp lực và tỉ lệ nghịch với khối lượng của vật: $\\vec{a} = \\frac{\\vec{F}_{hl}}{m}$, hay $\\vec{F}_{hl} = m\\vec{a}$."
            },
            {
              num: 2,
              heading: "Phân tích lực trên mặt phẳng nghiêng góc α",
              content: "• Trọng lực $\\vec{P}$ phân tích thành 2 thành phần: $P_x = mg\\sin\\alpha$ (kéo trượt xuống) và $P_y = mg\\cos\\alpha$ (nén vào mặt phẳng).\n• Phản lực pháp tuyến: $N = P_y = mg\\cos\\alpha$.\n• Lực ma sát trượt: $F_{ms} = \\mu N = \\mu mg\\cos\\alpha$.\n• Phương trình chuyển động: $mg\\sin\\alpha - \\mu mg\\cos\\alpha = ma \\Rightarrow a = g(\\sin\\alpha - \\mu\\cos\\alpha)$."
            }
          ],
          ghiNho: "Ghi nhớ: Vật trượt xuống dốc khi mg sinα > μ mg cosα (tức tanα > μ); vật đứng yên cân bằng khi tanα ≤ μ.",
          part2_formulas: [
            {
              formula: "F = m \\cdot a",
              quantity: "Định luật II Newton",
              symbol: "F",
              unit: "Newton (N)",
              meaning: "Hợp lực tác dụng làm thay đổi vận tốc của vật có khối lượng m."
            },
            {
              formula: "a = g(\\sin\\alpha - \\mu\\cos\\alpha)",
              quantity: "Gia tốc trên mặt phẳng nghiêng",
              symbol: "a",
              unit: "m/s²",
              meaning: "Gia tốc trượt xuống dốc của vật chịu ma sát trượt hệ số μ."
            }
          ],
          part3_applications: [
            "Thiết kế đường dốc cứu nạn trên các cung đèo dốc hiểm trở cho xe tải mất phanh.",
            "Tác dụng của rãnh gai lốp ô tô tăng hệ số ma sát trượt chống trượt ngã khi phanh gấp."
          ]
        },
        quizzes: [
          {
            id: "q_b15_1",
            question: "Theo định luật II Newton, nếu hợp lực F tác dụng lên vật tăng gấp đôi trong khi khối lượng m không đổi thì gia tốc a của vật sẽ:",
            questionEn: "According to Newton's 2nd Law, doubling the net force on constant mass causes acceleration to:",
            options: [
              "Giảm đi một nửa",
              "Tăng lên gấp đôi",
              "Không đổi",
              "Tăng lên gấp bốn lần"
            ],
            correctIndex: 1,
            explanation: "a = F / m. Vì gia tốc tỉ lệ thuận với hợp lực nên khi F tăng 2 lần thì a cũng tăng 2 lần.",
            conceptTested: "Mối quan hệ F và a",
            textbookRef: "KNTT Bài 15 (Trang 63)"
          },
          {
            id: "q_b15_2",
            question: "Một vật trượt không vận tốc đầu từ đỉnh một mặt phẳng nghiêng góc α. Thành phần trọng lực đóng vai trò kéo vật trượt xuống dốc là:",
            questionEn: "For an object sliding down an incline of angle α, the gravity component pulling it down is:",
            options: [
              "P_x = mg cos α",
              "P_x = mg sin α",
              "P_x = mg tan α",
              "P_x = mg"
            ],
            correctIndex: 1,
            explanation: "Hình chiếu trọng lực P lên trục song song với dốc hướng xuống là P_x = P · sin α = mg sin α.",
            conceptTested: "Phân tích trọng lực trên dốc",
            textbookRef: "KNTT Bài 15 (Trang 65)"
          },
          {
            id: "q_b15_3",
            question: "Lực ma sát trượt tác dụng lên vật chuyển động trên mặt phẳng nghiêng góc α có độ lớn bằng:",
            questionEn: "The kinetic friction force on an incline of angle α is given by:",
            options: [
              "F_ms = μ · mg · sin α",
              "F_ms = μ · mg · cos α",
              "F_ms = μ · mg",
              "F_ms = mg · cos α"
            ],
            correctIndex: 1,
            explanation: "Phản lực N = mg cos α, do đó F_ms = μN = μ mg cos α.",
            conceptTested: "Độ lớn lực ma sát trượt",
            textbookRef: "KNTT Bài 18 (Trang 74)"
          },
          {
            id: "q_b15_4",
            question: "Điều kiện để một vật đặt trên mặt phẳng nghiêng góc α tự động trượt xuống là:",
            questionEn: "The condition for an object to slide down an incline under its own weight is:",
            options: [
              "tan α > μ",
              "tan α < μ",
              "sin α = μ",
              "cos α > μ"
            ],
            correctIndex: 0,
            explanation: "Để trượt xuống: mg sin α > F_ms_max = μ mg cos α <=> sin α / cos α > μ <=> tan α > μ.",
            conceptTested: "Điều kiện trượt dốc",
            textbookRef: "KNTT Bài 20 (Trang 81)"
          },
          {
            id: "q_b15_5",
            question: "Một vật khối lượng 2 kg chuyển động với gia tốc 3 m/s². Hợp lực tác dụng vào vật có độ lớn là:",
            questionEn: "A 2 kg mass accelerates at 3 m/s². The net force is:",
            options: [
              "1,5 N",
              "5 N",
              "6 N",
              "9 N"
            ],
            correctIndex: 2,
            explanation: "F = m · a = 2 kg · 3 m/s² = 6 N.",
            conceptTested: "Tính độ lớn hợp lực",
            textbookRef: "KNTT Bài 15 (Trang 64)"
          }
        ]
      }
    ]
  },
  {
    id: "chuong-4",
    title: "NĂNG LƯỢNG, CÔNG, CÔNG SUẤT",
    titleEn: "ENERGY, WORK, AND POWER",
    lessons: [
      {
        id: "bai-26",
        chapterId: "chuong-4",
        lessonNum: 26,
        title: "Cơ năng và định luật bảo toàn cơ năng",
        titleEn: "Mechanical Energy and Conservation Law",
        subtitle: "Chuyển hóa qua lại giữa động năng Wđ và thế năng Wt trong con lắc đơn và trượt không ma sát.",
        subtitleEn: "Energy transformation between kinetic and potential energy in a simple pendulum.",
        labTag: "Mô phỏng Con lắc đơn & Biểu đồ Cơ năng thời gian thực",
        labTagEn: "Pendulum and Real-time Energy Bar Lab",
        knttRef: "KNTT Bài 26 (Trang 103)",
        ctstRef: "CTST Bài 17 (Trang 107)",
        simulationId: "energy-conservation",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Khái niệm Cơ năng",
              content: "Cơ năng của một vật là tổng động năng và thế năng của nó: $W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh$ (trong trọng trường)."
            },
            {
              num: 2,
              heading: "Định luật bảo toàn cơ năng",
              content: "Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực (không có ma sát hoặc lực cản tiêu hao), cơ năng của vật được bảo toàn:\n$W = W_đ + W_t = \\text{hằng số} = \\text{const}$.\n• Khi thế năng giảm, động năng tăng tương ứng và ngược lại.\n• Tại vị trí cao nhất: $W_t$ cực đại, $W_đ = 0$.\n• Tại vị trí thấp nhất (vị trí cân bằng): $W_đ$ cực đại, $W_t$ cực tiểu."
            }
          ],
          ghiNho: "Ghi nhớ: Khi bỏ qua ma sát, tổng động năng và thế năng là một đại lượng bảo toàn: W = Wđ + Wt = const.",
          part2_formulas: [
            {
              formula: "W = \\frac{1}{2}mv^2 + mgh = \\text{const}",
              quantity: "Bảo toàn cơ năng",
              symbol: "W",
              unit: "Joule (J)",
              meaning: "Tổng năng lượng cơ học được bảo toàn khi chỉ có lực thế sinh công."
            },
            {
              formula: "v_{max} = \\sqrt{2gh}",
              quantity: "Vận tốc cực đại tại đáy",
              symbol: "v_{max}",
              unit: "m/s",
              meaning: "Vận tốc vật đạt được khi chuyển hóa toàn bộ thế năng độ cao h thành động năng."
            }
          ],
          part3_applications: [
            "Thiết kế đường ray tàu lượn siêu tốc: độ cao của đỉnh dốc đầu tiên luôn phải lớn nhất để tích lũy đủ thế năng.",
            "Nguyên lí hoạt động của đập thủy điện tích trữ thế năng nước để quay tuabin phát điện."
          ]
        },
        quizzes: [
          {
            id: "q_b26_1",
            question: "Khi quả nặng con lắc đơn đi qua vị trí cân bằng (vị trí thấp nhất O), phát biểu nào sau đây ĐÚNG?",
            questionEn: "When a pendulum bob passes the lowest point O, which statement is true?",
            options: [
              "Thế năng cực đại, động năng bằng 0",
              "Động năng cực đại, thế năng cực tiểu (bằng 0 nếu chọn mốc tại O)",
              "Cả động năng và thế năng đều bằng 0",
              "Vận tốc của quả nặng triệt tiêu"
            ],
            correctIndex: 1,
            explanation: "Ở vị trí thấp nhất, độ cao h = 0 nên Wt = 0. Toàn bộ cơ năng chuyển hóa thành động năng cực đại: Wđ = 1/2 m v_max².",
            conceptTested: "Chuyển hóa động năng - thế năng",
            textbookRef: "KNTT Bài 26 (Trang 103)"
          },
          {
            id: "q_b26_2",
            question: "Định luật bảo toàn cơ năng nghiệm đúng trong trường hợp nào?",
            questionEn: "Conservation of mechanical energy holds strictly when:",
            options: [
              "Vật chuyển động có lực ma sát lớn",
              "Vật chỉ chịu tác dụng của lực thế (như trọng lực, lực đàn hồi), không có ma sát",
              "Vật chuyển động dưới tác dụng của động cơ đốt trong",
              "Vật rơi trong môi trường nước có lực cản"
            ],
            correctIndex: 1,
            explanation: "Cơ năng chỉ bảo toàn khi hệ chỉ có lực thế tác dụng. Các lực ma sát và cản là lực không thế sẽ làm hao tán cơ năng thành nhiệt.",
            conceptTested: "Điều kiện bảo toàn cơ năng",
            textbookRef: "KNTT Bài 26 (Trang 104)"
          },
          {
            id: "q_b26_3",
            question: "Thả rơi tự do một vật 1 kg từ độ cao 20 m xuống đất (g = 10 m/s²). Bỏ qua sức cản. Vận tốc của vật ngay trước khi chạm đất là:",
            questionEn: "A 1 kg object is dropped from 20 m (g = 10 m/s²). Its speed just before landing is:",
            options: [
              "10 m/s",
              "20 m/s",
              "40 m/s",
              "200 m/s"
            ],
            correctIndex: 1,
            explanation: "Bảo toàn cơ năng: mgh = 1/2 m v² => v = √(2gh) = √(2 · 10 · 20) = √400 = 20 m/s.",
            conceptTested: "Tính vận tốc chạm đất bằng bảo toàn cơ năng",
            textbookRef: "KNTT Bài 26 (Trang 105)"
          },
          {
            id: "q_b26_4",
            question: "Tại vị trí mà động năng bằng 3 lần thế năng (Wđ = 3 Wt), tỉ số giữa thế năng và cơ năng là:",
            questionEn: "Where kinetic energy is 3 times potential energy (Wk = 3 Wp), the ratio Wp / W is:",
            options: [
              "1/3",
              "1/4",
              "3/4",
              "1/2"
            ],
            correctIndex: 1,
            explanation: "Cơ năng W = Wđ + Wt = 3Wt + Wt = 4Wt => Wt = W / 4, tức Wt / W = 1/4.",
            conceptTested: "Tỉ lệ động năng và thế năng",
            textbookRef: "KNTT Bài 26 (Trang 105)"
          },
          {
            id: "q_b26_5",
            question: "Khi có lực ma sát cản trở chuyển động của vật, đại lượng nào sau đây KHÔNG đổi?",
            questionEn: "When friction opposes motion, which quantity is conserved?",
            options: [
              "Cơ năng của vật",
              "Động năng của vật",
              "Năng lượng toàn phần của hệ (bao gồm cơ năng và nhiệt năng)",
              "Thế năng của vật"
            ],
            correctIndex: 2,
            explanation: "Theo định luật bảo toàn và chuyển hóa năng lượng, năng lượng toàn phần luôn được bảo toàn (phần cơ năng mất đi chuyển thành nhiệt năng làm nóng vật và môi trường).",
            conceptTested: "Định luật bảo toàn năng lượng toàn phần",
            textbookRef: "KNTT Bài 27 (Trang 108)"
          }
        ]
      }
    ]
  },
  {
    id: "chuong-5",
    title: "ĐỘNG LƯỢNG",
    titleEn: "MOMENTUM",
    lessons: [
      {
        id: "bai-29",
        chapterId: "chuong-5",
        lessonNum: 29,
        title: "Bảo toàn động lượng & Va chạm đệm khí",
        titleEn: "Momentum Conservation & Air Track Collisions",
        subtitle: "Hệ kín, véc-tơ động lượng p = m·v, phân biệt va chạm đàn hồi và va chạm mềm.",
        subtitleEn: "Isolated system, vector momentum p = m·v, elastic vs inelastic collisions.",
        labTag: "Mô phỏng Đệm khí: Va chạm đàn hồi & Va chạm mềm",
        labTagEn: "Air Track Elastic and Inelastic Collisions Lab",
        knttRef: "KNTT Bài 29 (Trang 115)",
        ctstRef: "CTST Bài 19 (Trang 118)",
        simulationId: "momentum-collision",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Định nghĩa Động lượng",
              content: "Động lượng của một vật là đại lượng véc-tơ bằng tích của khối lượng và vận tốc của vật: $\\vec{p} = m\\vec{v}$. Đơn vị đo là $kg\\cdot m/s$ hoặc $N\\cdot s$."
            },
            {
              num: 2,
              heading: "Định luật bảo toàn động lượng trong hệ kín",
              content: "Trong một hệ kín (không chịu ngoại lực hoặc tổng ngoại lực triệt tiêu), tổng động lượng của hệ được bảo toàn:\n$\\vec{p}_{hệ} = \\vec{p}_1 + \\vec{p}_2 = \\text{const}$."
            },
            {
              num: 3,
              heading: "Phân biệt hai loại va chạm cơ bản",
              content: "• **Va chạm đàn hồi**: Động lượng bảo toàn VÀ động năng của hệ cũng được bảo toàn.\n• **Va chạm mềm (không đàn hồi)**: Sau va chạm hai vật dính vào nhau và chuyển động cùng vận tốc $v = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$. Động lượng bảo toàn nhưng một phần động năng biến thành nhiệt năng."
            }
          ],
          ghiNho: "Ghi nhớ: Trong mọi va chạm của hệ kín (dù đàn hồi hay va chạm mềm), tổng động lượng luôn luôn được bảo toàn.",
          part2_formulas: [
            {
              formula: "m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}'_1 + m_2 \\vec{v}'_2",
              quantity: "Bảo toàn động lượng va chạm đàn hồi",
              symbol: "\\vec{p}",
              unit: "kg·m/s",
              meaning: "Tổng động lượng trước va chạm bằng tổng động lượng sau va chạm."
            },
            {
              formula: "v_{chung} = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}",
              quantity: "Vận tốc sau va chạm mềm",
              symbol: "v_{chung}",
              unit: "m/s",
              meaning: "Vận tốc hai vật cùng chuyển động sau khi dính liền vào nhau."
            }
          ],
          part3_applications: [
            "Hiện tượng giật lùi của súng khi bắn đạn (nguyên lí chuyển động bằng phản lực).",
            "Túi khí ô tô và vùng đầu xe hấp thụ xung lực khi va chạm giao thông."
          ]
        },
        quizzes: [
          {
            id: "q_b29_1",
            question: "Đơn vị đo chuẩn của động lượng trong hệ đo lường SI là:",
            questionEn: "The standard SI unit of momentum is:",
            options: [
              "N / m",
              "kg · m / s (hoặc N · s)",
              "Joule (J)",
              "kg · m² / s"
            ],
            correctIndex: 1,
            explanation: "p = m · v nên đơn vị là kg · m/s. Theo định lí biến thiên động lượng Δp = F · Δt nên cũng tương đương đơn vị N · s.",
            conceptTested: "Đơn vị động lượng",
            textbookRef: "KNTT Bài 28 (Trang 112)"
          },
          {
            id: "q_b29_2",
            question: "Trong một hệ kín chỉ gồm hai vật tương tác va chạm với nhau, phát biểu nào sau đây luôn đúng?",
            questionEn: "In an isolated system of two colliding objects, which statement is always true?",
            options: [
              "Động năng của mỗi vật không đổi",
              "Vận tốc của mỗi vật không đổi",
              "Tổng động lượng của hệ được bảo toàn",
              "Tổng cơ năng của hệ luôn tăng lên"
            ],
            correctIndex: 2,
            explanation: "SGK KNTT Bài 29 (Trang 115): Đối với hệ kín, tổng véc-tơ động lượng của hệ trước và sau va chạm luôn không đổi.",
            conceptTested: "Định luật bảo toàn động lượng",
            textbookRef: "KNTT Bài 29 (Trang 115)"
          },
          {
            id: "q_b29_3",
            question: "Xe 1 có khối lượng 1 kg chuyển động với v₁ = 3 m/s đến va chạm mềm dính vào xe 2 khối lượng 2 kg đang đứng yên. Vận tốc của hai xe sau va chạm là:",
            questionEn: "A 1 kg cart at 3 m/s collides and sticks to a 2 kg stationary cart. Their speed after collision is:",
            options: [
              "1,0 m/s",
              "1,5 m/s",
              "2,0 m/s",
              "3,0 m/s"
            ],
            correctIndex: 0,
            explanation: "Bảo toàn động lượng: m₁v₁ = (m₁ + m₂)V => V = (1 · 3) / (1 + 2) = 3 / 3 = 1,0 m/s.",
            conceptTested: "Tính toán va chạm mềm",
            textbookRef: "KNTT Bài 29 (Trang 117)"
          },
          {
            id: "q_b29_4",
            question: "Hiện tượng súng bị giật lùi về phía sau khi bắn đạn về phía trước được giải thích bằng:",
            questionEn: "Recoil of a gun upon firing is explained by:",
            options: [
              "Định luật bảo toàn cơ năng",
              "Định luật bảo toàn động lượng (chuyển động bằng phản lực)",
              "Định luật vạn vật hấp dẫn",
              "Sự nở vì nhiệt của nòng súng"
            ],
            correctIndex: 1,
            explanation: "Trước khi bắn, hệ súng và đạn đứng yên (p = 0). Khi bắn, đạn bay về phía trước với động lượng p_đạn thì súng giật lùi với p_súng = -p_đạn để tổng động lượng vẫn bằng 0.",
            conceptTested: "Chuyển động bằng phản lực",
            textbookRef: "KNTT Bài 29 (Trang 116)"
          },
          {
            id: "q_b29_5",
            question: "Đặc điểm khác biệt cốt lõi giữa va chạm đàn hồi và va chạm mềm là:",
            questionEn: "The key difference between elastic and inelastic collision is:",
            options: [
              "Va chạm đàn hồi bảo toàn cả động lượng và động năng; va chạm mềm chỉ bảo toàn động lượng",
              "Va chạm đàn hồi không bảo toàn động lượng",
              "Va chạm mềm làm tăng động năng của hệ",
              "Không có sự khác nhau nào"
            ],
            correctIndex: 0,
            explanation: "Trong va chạm đàn hồi, động năng không bị tổn hao. Trong va chạm mềm, động năng bị tiêu tán một phần thành nhiệt năng và biến dạng.",
            conceptTested: "Phân biệt va chạm đàn hồi và mềm",
            textbookRef: "KNTT Bài 29 (Trang 117)"
          }
        ]
      }
    ]
  },
  {
    id: "chuong-6",
    title: "CHUYỂN ĐỘNG TRÒN",
    titleEn: "CIRCULAR MOTION",
    lessons: [
      {
        id: "bai-31",
        chapterId: "chuong-6",
        lessonNum: 31,
        title: "Động học chuyển động tròn đều & Lực hướng tâm",
        titleEn: "Uniform Circular Motion & Centripetal Force",
        subtitle: "Tốc độ góc omega, chu kì T, tần số f, gia tốc hướng tâm và lực hướng tâm giữ vật trên quỹ đạo.",
        subtitleEn: "Angular speed omega, period T, frequency f, centripetal acceleration and force.",
        labTag: "Mô phỏng Bàn quay Tròn đều & Lực hướng tâm",
        labTagEn: "Turntable and Centripetal Force Simulation",
        knttRef: "KNTT Bài 31-32 (Trang 123-128)",
        ctstRef: "CTST Bài 20-21 (Trang 126-130)",
        simulationId: "circular-motion",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Đại lượng đặc trưng của chuyển động tròn đều",
              content: "• **Tốc độ góc** $\\omega = \\frac{\\Delta\\theta}{\\Delta t}$ (rad/s).\n• **Chu kì T**: Thời gian quay hết 1 vòng: $T = \\frac{2\\pi}{\\omega}$.\n• **Tần số f**: Số vòng quay trong 1 giây: $f = \\frac{1}{T} = \\frac{\\omega}{2\\pi}$ (Hz).\n• Mối liên hệ tốc độ dài và tốc độ góc: $v = \\omega \\cdot r$."
            },
            {
              num: 2,
              heading: "Gia tốc hướng tâm và Lực hướng tâm",
              content: "Trong chuyển động tròn đều, tuy độ lớn vận tốc không đổi nhưng hướng véc-tơ vận tốc liên tục đổi, sinh ra **gia tốc hướng tâm** hướng về tâm quỹ đạo:\n$a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.\nHợp lực tác dụng lên vật chuyển động tròn đều đóng vai trò là **lực hướng tâm**: $F_{ht} = m a_{ht} = m\\frac{v^2}{r} = m\\omega^2 r$."
            }
          ],
          ghiNho: "Ghi nhớ: Véc-tơ gia tốc hướng tâm luôn vuông góc với véc-tơ vận tốc tức thời và luôn hướng vào tâm đường tròn.",
          part2_formulas: [
            {
              formula: "F_{ht} = m\\frac{v^2}{r} = m\\omega^2 r",
              quantity: "Lực hướng tâm",
              symbol: "F_{ht}",
              unit: "Newton (N)",
              meaning: "Hợp lực giữ cho vật chuyển động cong tròn theo bán kính r."
            },
            {
              formula: "v = \\omega \\cdot r",
              quantity: "Liên hệ tốc độ dài và tốc độ góc",
              symbol: "v",
              unit: "m/s",
              meaning: "Tốc độ tiếp tuyến tại điểm cách tâm một khoảng r."
            }
          ],
          part3_applications: [
            "Tại các khúc cua nguy hiểm trên đường cao tốc, mặt đường được làm nghiêng vào phía trong để thành phần phản lực đóng vai trò lực hướng tâm giúp xe không bị lật.",
            "Lực hấp dẫn giữa Trái Đất và vệ tinh nhân tạo đóng vai trò lực hướng tâm giữ vệ tinh quay trên quỹ đạo ổn định."
          ]
        },
        quizzes: [
          {
            id: "q_b31_1",
            question: "Trong chuyển động tròn đều, véc-tơ gia tốc hướng tâm có đặc điểm nào sau đây?",
            questionEn: "In uniform circular motion, the centripetal acceleration vector has:",
            options: [
              "Cùng hướng với véc-tơ vận tốc tức thời",
              "Luôn tiếp tuyến với quỹ đạo tròn",
              "Luôn vuông góc với véc-tơ vận tốc và hướng vào tâm quỹ đạo",
              "Có độ lớn bằng 0 vì tốc độ dài không đổi"
            ],
            correctIndex: 2,
            explanation: "Gia tốc hướng tâm chỉ làm thay đổi hướng chuyển động mà không làm đổi độ lớn vận tốc, nên nó luôn vuông góc với vận tốc và hướng thẳng vào tâm đường tròn.",
            conceptTested: "Phương và chiều gia tốc hướng tâm",
            textbookRef: "KNTT Bài 31 (Trang 124)"
          },
          {
            id: "q_b31_2",
            question: "Một đĩa tròn quay đều với tốc độ góc ω = 10 rad/s. Một điểm nằm cách tâm đĩa r = 0,2 m có tốc độ dài v là:",
            questionEn: "A disc rotates at ω = 10 rad/s. A point at r = 0.2 m has linear speed v of:",
            options: [
              "2 m/s",
              "50 m/s",
              "0,02 m/s",
              "20 m/s"
            ],
            correctIndex: 0,
            explanation: "v = ω · r = 10 rad/s · 0,2 m = 2 m/s.",
            conceptTested: "Tính tốc độ dài từ tốc độ góc",
            textbookRef: "KNTT Bài 31 (Trang 125)"
          },
          {
            id: "q_b31_3",
            question: "Nếu bán kính quỹ đạo tròn tăng gấp đôi trong khi tốc độ góc ω giữ nguyên thì gia tốc hướng tâm a_ht sẽ:",
            questionEn: "If circular radius doubles while angular speed ω is kept constant, centripetal acceleration a_ht will:",
            options: [
              "Giảm đi một nửa",
              "Tăng lên gấp đôi",
              "Tăng lên gấp bốn lần",
              "Không thay đổi"
            ],
            correctIndex: 1,
            explanation: "Công thức a_ht = ω² · r. Khi ω không đổi, a_ht tỉ lệ thuận bậc nhất với r, do đó r tăng 2 lần thì a_ht tăng 2 lần.",
            conceptTested: "Mối liên hệ a_ht và r",
            textbookRef: "KNTT Bài 32 (Trang 127)"
          },
          {
            id: "q_b31_4",
            question: "Lực nào đóng vai trò là lực hướng tâm giữ cho ô tô chuyển động tròn đều qua một khúc quanh trên mặt đường phẳng nằm ngang?",
            questionEn: "Which force acts as centripetal force for a car cornering on a flat horizontal road?",
            options: [
              "Trọng lực của xe",
              "Lực ma sát nghỉ giữa lốp xe và mặt đường",
              "Lực kéo của động cơ ô tô",
              "Phản lực pháp tuyến của mặt đường"
            ],
            correctIndex: 1,
            explanation: "Trên đường phẳng nằm ngang, lực ma sát nghỉ hướng vào tâm khúc cua đóng vai trò lực hướng tâm giữ xe không bị trượt văng ly tâm ra ngoài.",
            conceptTested: "Lực hướng tâm thực tế",
            textbookRef: "KNTT Bài 32 (Trang 128)"
          },
          {
            id: "q_b31_5",
            question: "Chu kì T của kim giây đồng hồ đeo tay tiêu chuẩn là:",
            questionEn: "The period T of the second hand of a standard clock is:",
            options: [
              "1 giây",
              "60 giây (1 phút)",
              "3600 giây (1 giờ)",
              "12 giờ"
            ],
            correctIndex: 1,
            explanation: "Kim giây quay hết đúng một vòng tròn 360° trong thời gian 60 giây, do đó chu kì quay T = 60 s.",
            conceptTested: "Chu kì quay kim đồng hồ",
            textbookRef: "KNTT Bài 31 (Trang 125)"
          }
        ]
      }
    ]
  },
  {
    id: "chuong-7",
    title: "BIẾN DẠNG CỦA VẬT RẮN & CHẤT LƯU",
    titleEn: "SOLIDS AND FLUIDS",
    lessons: [
      {
        id: "bai-33",
        chapterId: "chuong-7",
        lessonNum: 33,
        title: "Biến dạng của vật rắn & Định luật Hooke",
        titleEn: "Solid Deformation & Hooke's Law",
        subtitle: "Độ biến dạng denta l, độ cứng k của lò xo, đồ thị thực nghiệm F - denta l và giới hạn đàn hồi.",
        subtitleEn: "Spring elongation delta l, spring constant k, F - delta l experimental graph and elastic limit.",
        labTag: "Thí nghiệm Treo lò xo tải trọng & Đồ thị F-Δl",
        labTagEn: "Spring Suspension and Hooke Line Graph Lab",
        knttRef: "KNTT Bài 33 (Trang 131)",
        ctstRef: "CTST Bài 22 (Trang 134)",
        simulationId: "hooke-elasticity",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Biến dạng đàn hồi và Định luật Hooke (Húc)",
              content: "Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng (độ dãn hoặc độ nén) của lò xo:\n$F_{dh} = k \\cdot |\\Delta l| = k \\cdot |l - l_0|$.\n• $k$: Độ cứng (hệ số đàn hồi) của lò xo, đơn vị Newton trên mét ($N/m$).\n• $\\Delta l = l - l_0$: Độ dãn của lò xo, đơn vị mét ($m$)."
            },
            {
              num: 2,
              heading: "Đồ thị lực đàn hồi theo độ dãn",
              content: "Đồ thị biểu diễn $F_{dh}$ theo $\\Delta l$ là một **đoạn thẳng đi qua gốc tọa độ**. Hệ số góc của đường thẳng chính là độ cứng $k = \\frac{\\Delta F}{\\Delta(\\Delta l)}$. Nếu vượt quá giới hạn đàn hồi, lò xo sẽ bị biến dạng vĩnh viễn và không tuân theo định luật Hooke."
            }
          ],
          ghiNho: "Ghi nhớ: Định luật Hooke chỉ nghiệm đúng khi biến dạng chưa vượt quá giới hạn đàn hồi của vật liệu.",
          part2_formulas: [
            {
              formula: "F_{dh} = k \\cdot |\\Delta l|",
              quantity: "Định luật Hooke",
              symbol: "F_{dh}",
              unit: "Newton (N)",
              meaning: "Lực đàn hồi chống lại sự biến dạng của lò xo."
            },
            {
              formula: "W_{dh} = \\frac{1}{2}k(\\Delta l)^2",
              quantity: "Thế năng đàn hồi",
              symbol: "W_{dh}",
              unit: "Joule (J)",
              meaning: "Năng lượng tích lũy trong lò xo khi bị kéo dãn hoặc nén một đoạn Δl."
            }
          ],
          part3_applications: [
            "Chế tạo lực kế lò xo để đo trọng lượng và các lực cơ học trong đời sống.",
            "Hệ thống giảm xóc (phuộc nhún lò xo) trên xe máy và giảm chấn địa chấn chân tòa nhà cao tầng."
          ]
        },
        quizzes: [
          {
            id: "q_b33_1",
            question: "Trong giới hạn đàn hồi, lực đàn hồi của lò xo có đặc điểm nào sau đây?",
            questionEn: "Within elastic limit, the spring elastic force is:",
            options: [
              "Tỉ lệ thuận với chiều dài l của lò xo",
              "Tỉ lệ thuận với độ biến dạng |Δl| của lò xo",
              "Tỉ lệ nghịch với độ cứng k của lò xo",
              "Tỉ lệ thuận với bình phương độ biến dạng"
            ],
            correctIndex: 1,
            explanation: "Định luật Hooke: F_dh = k · |Δl|, trong đó lực đàn hồi tỉ lệ thuận bậc nhất với độ dãn hoặc nén của lò xo.",
            conceptTested: "Phát biểu định luật Hooke",
            textbookRef: "KNTT Bài 33 (Trang 132)"
          },
          {
            id: "q_b33_2",
            question: "Treo một vật nặng 200 g vào đầu dưới lò xo treo thẳng đứng (lấy g = 10 m/s²). Lò xo dãn ra 4 cm. Độ cứng k của lò xo là:",
            questionEn: "A 200 g mass stretches a vertical spring by 4 cm (g = 10 m/s²). The spring constant k is:",
            options: [
              "5 N/m",
              "50 N/m",
              "500 N/m",
              "20 N/m"
            ],
            correctIndex: 1,
            explanation: "P = mg = 0,2 kg · 10 m/s² = 2 N. Tại vị trí cân bằng: F_dh = P => k · Δl = 2 N => k = 2 / 0,04 m = 50 N/m.",
            conceptTested: "Tính độ cứng lò xo",
            textbookRef: "KNTT Bài 33 (Trang 133)"
          },
          {
            id: "q_b33_3",
            question: "Đồ thị biểu diễn lực đàn hồi F theo độ biến dạng Δl trong giới hạn đàn hồi có dạng là:",
            questionEn: "The graph of elastic force F versus elongation Δl within elastic limit is:",
            options: [
              "Đường cong parabol",
              "Đường thẳng đi qua gốc tọa độ O",
              "Đường thẳng song song với trục hoành",
              "Đường tròn đồng tâm"
            ],
            correctIndex: 1,
            explanation: "Vì F = k · Δl có dạng hàm bậc nhất y = ax nên đồ thị là một đoạn thẳng đi qua gốc tọa độ O, hệ số góc chính là độ cứng k.",
            conceptTested: "Đồ thị định luật Hooke",
            textbookRef: "KNTT Bài 33 (Trang 133)"
          },
          {
            id: "q_b33_4",
            question: "Hiện tượng gì xảy ra nếu kéo dãn lò xo vượt quá giới hạn đàn hồi của nó?",
            questionEn: "What happens if a spring is stretched beyond its elastic limit?",
            options: [
              "Lò xo có độ cứng k tăng lên vô hạn",
              "Lò xo bị biến dạng dư (biến dạng vĩnh viễn) và không thể co lại chiều dài ban đầu",
              "Lực đàn hồi tăng gấp đôi",
              "Lò xo biến đổi thành nam châm"
            ],
            correctIndex: 1,
            explanation: "Khi vượt qua giới hạn đàn hồi, cấu trúc tinh thể kim loại bị xô lệch vĩnh viễn, lò xo không thể tự hồi phục hình dạng ban đầu nữa.",
            conceptTested: "Giới hạn đàn hồi",
            textbookRef: "KNTT Bài 33 (Trang 132)"
          },
          {
            id: "q_b33_5",
            question: "Một lò xo có chiều dài tự nhiên l₀ = 15 cm. Khi treo quả cân thì chiều dài của lò xo là l = 19 cm. Độ biến dạng Δl của lò xo là:",
            questionEn: "A spring of initial length 15 cm stretches to 19 cm. Its elongation Δl is:",
            options: [
              "4 cm",
              "19 cm",
              "34 cm",
              "15 cm"
            ],
            correctIndex: 0,
            explanation: "Δl = l - l₀ = 19 cm - 15 cm = 4 cm = 0,04 m.",
            conceptTested: "Xác định độ dãn",
            textbookRef: "KNTT Bài 33 (Trang 131)"
          }
        ]
      }
    ]
  },
  {
    id: "chuyen-de",
    title: "CHUYÊN ĐỀ MẠCH ĐIỆN & SÓNG CƠ",
    titleEn: "CIRCUITS & MECHANICAL WAVES",
    lessons: [
      {
        id: "bai-mach-dien",
        chapterId: "chuyen-de",
        lessonNum: 35,
        title: "Định luật Ohm & Mạch song song/nối tiếp",
        titleEn: "Ohm's Law & Circuit Combinations",
        subtitle: "Định luật Ohm I = U/R, phân nhánh dòng điện ở nút và công suất tiêu thụ của các bóng đèn.",
        subtitleEn: "Ohm's law I = U/R, current junction splitting and bulb power consumption.",
        labTag: "Phòng thí nghiệm ảo Mạch điện & Dòng hạt tải điện",
        labTagEn: "Virtual Circuit Lab and Charge Flow Animation",
        knttRef: "Chuyên đề Vật lí 10 (Mạch điện)",
        ctstRef: "Chuyên đề Vật lí 10 (Thực hành)",
        simulationId: "electric-circuit",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Định luật Ohm cho đoạn mạch",
              content: "Cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của dây: $I = \\frac{U}{R}$."
            },
            {
              num: 2,
              heading: "Quy tắc mạch mắc song song",
              content: "• Hiệu điện thế bằng nhau trên mọi nhánh: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính bằng tổng dòng qua các nhánh: $I = I_1 + I_2$.\n• Điện trở tương đương nhỏ hơn mỗi điện trở thành phần: $\\frac{1}{R_{td}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{td} = \\frac{R_1 R_2}{R_1 + R_2}$."
            }
          ],
          ghiNho: "Ghi nhớ: Trong đoạn mạch song song, điện trở tương đương luôn nhỏ hơn từng điện trở thành phần.",
          part2_formulas: [
            {
              formula: "I = \\frac{U}{R}",
              quantity: "Định luật Ohm",
              symbol: "I",
              unit: "Ampe (A)",
              meaning: "Cường độ dòng điện qua tải có điện trở R dưới hiệu điện thế U."
            },
            {
              formula: "P = U \\cdot I = I^2 R = \\frac{U^2}{R}",
              quantity: "Công suất điện",
              symbol: "P",
              unit: "Oát (W)",
              meaning: "Tốc độ tiêu thụ điện năng của mạch điện."
            }
          ],
          part3_applications: [
            "Các thiết bị điện trong gia đình (đèn, quạt, tivi) luôn được mắc song song vào nguồn 220V để hoạt động độc lập.",
            "Cầu chì và công tắc được mắc nối tiếp với thiết bị trên dây pha để bảo vệ và điều khiển."
          ]
        },
        quizzes: [
          {
            id: "q_bmd_1",
            question: "Theo định luật Ohm, nếu giữ nguyên hiệu điện thế U đặt vào hai đầu điện trở và tăng giá trị điện trở R lên gấp 3 lần thì dòng điện I sẽ:",
            questionEn: "According to Ohm's Law, keeping U constant and tripling R causes current I to:",
            options: [
              "Tăng lên 3 lần",
              "Giảm đi 3 lần",
              "Không thay đổi",
              "Tăng lên 9 lần"
            ],
            correctIndex: 1,
            explanation: "I = U / R. Vì dòng điện I tỉ lệ nghịch với điện trở R nên khi R tăng 3 lần thì I giảm đi 3 lần.",
            conceptTested: "Định luật Ohm cho đoạn mạch",
            textbookRef: "Chuyên đề Vật lí 10"
          },
          {
            id: "q_bmd_2",
            question: "Hai điện trở R₁ = 10 Ω và R₂ = 10 Ω mắc song song với nhau. Điện trở tương đương R_tđ của đoạn mạch là:",
            questionEn: "Two 10 Ω resistors are connected in parallel. The equivalent resistance is:",
            options: [
              "20 Ω",
              "5 Ω",
              "10 Ω",
              "100 Ω"
            ],
            correctIndex: 1,
            explanation: "R_td = (R₁ · R₂) / (R₁ + R₂) = (10 · 10) / (10 + 10) = 100 / 20 = 5 Ω.",
            conceptTested: "Tính điện trở tương đương song song",
            textbookRef: "Chuyên đề Vật lí 10"
          },
          {
            id: "q_bmd_3",
            question: "Tại sao các thiết bị điện sinh hoạt trong gia đình thường được mắc song song với nhau?",
            questionEn: "Why are household appliances connected in parallel?",
            options: [
              "Để tiết kiệm dây dẫn điện",
              "Để các thiết bị cùng dùng chung một hiệu điện thế định mức và khi tắt một thiết bị thì các thiết bị khác vẫn hoạt động bình thường",
              "Để giảm tối đa cường độ dòng điện mạch chính",
              "Để tăng điện trở tương đương của mạng điện"
            ],
            correctIndex: 1,
            explanation: "Mạch song song cho phép mỗi thiết bị nhận đủ điện áp định mức 220V và hoạt động độc lập không phụ thuộc vào thiết bị khác.",
            conceptTested: "Ứng dụng mạch song song",
            textbookRef: "Chuyên đề Vật lí 10"
          },
          {
            id: "q_bmd_4",
            question: "Một bóng đèn có điện trở 24 Ω được cắm vào nguồn điện có hiệu điện thế 12 V. Công suất tiêu thụ của bóng đèn là:",
            questionEn: "A 24 Ω bulb is connected to 12 V. Its power consumption is:",
            options: [
              "6 W",
              "288 W",
              "2 W",
              "0,5 W"
            ],
            correctIndex: 0,
            explanation: "P = U² / R = 12² / 24 = 144 / 24 = 6 W.",
            conceptTested: "Tính công suất điện",
            textbookRef: "Chuyên đề Vật lí 10"
          },
          {
            id: "q_bmd_5",
            question: "Trong mạch điện phân nhánh gồm hai nhánh song song, nếu nhánh 1 có dòng I₁ = 1,5 A và nhánh 2 có dòng I₂ = 2,0 A thì dòng điện ở mạch chính I là:",
            questionEn: "In two parallel branches carrying I₁ = 1.5 A and I₂ = 2.0 A, total current I is:",
            options: [
              "0,5 A",
              "3,5 A",
              "3,0 A",
              "1,75 A"
            ],
            correctIndex: 1,
            explanation: "Định luật bảo toàn điện tích tại nút: dòng vào nút bằng tổng dòng ra khỏi nút: I = I₁ + I₂ = 1,5 + 2,0 = 3,5 A.",
            conceptTested: "Định luật nút dòng điện",
            textbookRef: "Chuyên đề Vật lí 10"
          }
        ]
      },
      {
        id: "bai-song-co",
        chapterId: "chuyen-de",
        lessonNum: 36,
        title: "Sóng cơ & Hiện tượng giao thoa sóng",
        titleEn: "Mechanical Waves & Wave Interference",
        subtitle: "Sự lan truyền dao động cơ học, bước sóng lambda, hiện tượng giao thoa cực đại và cực tiểu.",
        subtitleEn: "Mechanical wave propagation, wavelength lambda, constructive and destructive interference.",
        labTag: "Mô phỏng Giao thoa hai nguồn kết hợp đồng pha",
        labTagEn: "Two In-Phase Coherent Sources Interference Lab",
        knttRef: "Chuyên đề Sóng (Trang 140)",
        ctstRef: "Chuyên đề Sóng (Trang 142)",
        simulationId: "wave-interference",
        theory: {
          part1_points: [
            {
              num: 1,
              heading: "Sóng cơ và các đại lượng đặc trưng",
              content: "Sóng cơ là dao động cơ lan truyền trong môi trường vật chất theo thời gian. Bước sóng $\\lambda = v \\cdot T = \\frac{v}{f}$ là quãng đường sóng truyền đi được trong một chu kì dao động."
            },
            {
              num: 2,
              heading: "Giao thoa sóng cơ học",
              content: "Là hiện tượng hai sóng kết hợp (cùng tần số và hiệu số pha không đổi theo thời gian) khi gặp nhau tạo ra những điểm dao động tăng cường (cực đại) xen kẽ những điểm dao động triệt tiêu (cực tiểu).\n• **Cực đại giao thoa**: Hiệu đường đi bằng số nguyên lần bước sóng: $d_2 - d_1 = k\\lambda$ ($k = 0, \\pm 1, \\pm 2...$).\n• **Cực tiểu giao thoa**: Hiệu đường đi bằng số bán nguyên lần bước sóng: $d_2 - d_1 = (k + 0,5)\\lambda$."
            }
          ],
          ghiNho: "Ghi nhớ: Hiện tượng giao thoa là bằng chứng thực nghiệm rõ ràng nhất chứng minh bản chất sóng.",
          part2_formulas: [
            {
              formula: "\\lambda = v \\cdot T = \\frac{v}{f}",
              quantity: "Bước sóng",
              symbol: "\\lambda",
              unit: "Mét (m)",
              meaning: "Khoảng cách giữa hai điểm gần nhau nhất trên cùng phương truyền sóng dao động cùng pha."
            },
            {
              formula: "d_2 - d_1 = k \\cdot \\lambda",
              quantity: "Điều kiện cực đại giao thoa",
              symbol: "\\Delta d",
              unit: "Mét (m)",
              meaning: "Hai sóng tới cùng pha tăng cường biên độ lên gấp đôi (A = 2a)."
            }
          ],
          part3_applications: [
            "Công nghệ tai nghe chống ồn chủ động (Active Noise Cancellation) tạo ra sóng âm ngược pha để triệt tiêu tiếng ồn môi trường.",
            "Phân tích gợn sóng nước mặt hồ kiểm chứng tính chất kết hợp của hai cần rung."
          ]
        },
        quizzes: [
          {
            id: "q_bsc_1",
            question: "Bước sóng λ là khoảng cách giữa hai điểm gần nhau nhất trên cùng một phương truyền sóng mà dao động tại hai điểm đó:",
            questionEn: "Wavelength λ is the distance between two closest points on the same wave propagation line that oscillate:",
            options: [
              "Ngược pha nhau",
              "Cùng pha nhau",
              "Vuông pha nhau",
              "Lệch pha π/4"
            ],
            correctIndex: 1,
            explanation: "Theo định nghĩa bước sóng: Bước sóng là quãng đường sóng truyền đi trong 1 chu kì, cũng là khoảng cách giữa hai điểm gần nhau nhất trên cùng phương truyền sóng dao động cùng pha.",
            conceptTested: "Định nghĩa bước sóng",
            textbookRef: "Chuyên đề Sóng cơ"
          },
          {
            id: "q_bsc_2",
            question: "Một sóng cơ truyền với tốc độ v = 10 m/s và tần số f = 5 Hz. Bước sóng λ của sóng này là:",
            questionEn: "A wave travels at v = 10 m/s with frequency f = 5 Hz. Its wavelength λ is:",
            options: [
              "0,5 m",
              "2 m",
              "50 m",
              "15 m"
            ],
            correctIndex: 1,
            explanation: "λ = v / f = 10 / 5 = 2 m.",
            conceptTested: "Tính bước sóng từ tốc độ và tần số",
            textbookRef: "Chuyên đề Sóng cơ"
          },
          {
            id: "q_bsc_3",
            question: "Hiện tượng giao thoa sóng xảy ra khi có sự gặp nhau của:",
            questionEn: "Wave interference occurs when there is superimposition of:",
            options: [
              "Hai sóng bất kì lan truyền trong không gian",
              "Hai sóng kết hợp (cùng phương, cùng tần số và độ lệch pha không đổi theo thời gian)",
              "Một sóng âm và một sóng ánh sáng",
              "Hai sóng có tần số rất khác nhau"
            ],
            correctIndex: 1,
            explanation: "Điều kiện cần và đủ để xảy ra giao thoa ổn định là hai nguồn sóng phải là hai nguồn kết hợp.",
            conceptTested: "Điều kiện giao thoa sóng",
            textbookRef: "Chuyên đề Sóng cơ"
          },
          {
            id: "q_bsc_4",
            question: "Trong miền giao thoa của hai nguồn cùng pha, những điểm có hiệu đường đi d₂ - d₁ = kλ (k nguyên) sẽ dao động với biên độ:",
            questionEn: "In the interference pattern of two in-phase sources, points with d₂ - d₁ = kλ oscillate with:",
            options: [
              "Biên độ cực đại (bằng tổng biên độ hai sóng)",
              "Biên độ triệt tiêu (bằng 0)",
              "Biên độ giảm đi một nửa",
              "Tần số tăng gấp đôi"
            ],
            correctIndex: 0,
            explanation: "Khi d₂ - d₁ = kλ, hai sóng thành phần gửi tới điểm đó hoàn toàn cùng pha nhau, tạo nên cực đại giao thoa có biên độ A_max = a₁ + a₂.",
            conceptTested: "Cực đại giao thoa",
            textbookRef: "Chuyên đề Sóng cơ"
          },
          {
            id: "q_bsc_5",
            question: "Tai nghe chống ồn chủ động (ANC) áp dụng hiện tượng vật lí nào để khử tạp âm từ môi trường ngoài?",
            questionEn: "Active Noise Cancelling (ANC) headphones utilize which physical phenomenon to eliminate noise?",
            options: [
              "Hiện tượng khúc xạ sóng âm",
              "Hiện tượng giao thoa sóng triệt tiêu (phát ra sóng âm ngược pha 180°)",
              "Hiện tượng phản xạ sóng siêu âm",
              "Hiện tượng biến điệu điện từ"
            ],
            correctIndex: 1,
            explanation: "Tai nghe ANC phát hiện tiếng ồn và tạo ra một sóng âm có cùng biên độ nhưng ngược pha (lệch pha 180°), hai sóng giao thoa triệt tiêu lẫn nhau.",
            conceptTested: "Ứng dụng giao thoa triệt tiêu trong ANC",
            textbookRef: "Chuyên đề Sóng cơ"
          }
        ]
      }
    ]
  }
];

export function getAllLessons(): LessonItem[] {
  return curriculumChapters.flatMap(c => c.lessons);
}

export const curriculumTopics = getAllLessons();

export function getLessonById(id: string): LessonItem | undefined {
  return getAllLessons().find(l => l.id === id);
}

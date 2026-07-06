let THREE;

// --- HỆ THỐNG NHẠC NỀN WEBSITE (TINY PAWS) ---
let bgMusic = null;
let bgMusicMuted = false;

function initBackgroundMusic() {
  if (bgMusic) return;
  bgMusic = new Audio("./assets/audio/tiny-paws.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 0.22; // Âm lượng nền dịu nhẹ tránh chói tai
  bgMusic.preload = "auto";
  bgMusic.load(); // Kích hoạt tải trước nhạc nền trong nền
}

function tryPlayMusic() {
  initBackgroundMusic();
  if (bgMusicMuted) return;
  bgMusic.play().then(() => {
    removeInteractionListeners();
  }).catch((err) => {
    console.log("Autoplay was prevented by browser, waiting for user interaction.", err);
    // Giữ nguyên đối tượng Audio để tiếp tục tiến trình tải nền (preload), không đặt về null
  });
}

function handleFirstInteraction() {
  removeInteractionListeners();
  tryPlayMusic();
}

function removeInteractionListeners() {
  document.removeEventListener("click", handleFirstInteraction);
  document.removeEventListener("touchstart", handleFirstInteraction);
  document.removeEventListener("keydown", handleFirstInteraction);
  document.removeEventListener("mousedown", handleFirstInteraction);
}

const STORAGE_KEY = "xsmx_story_world_v4";

const characterVideos = {
  happy: "./assets/characters/bana-nho.mp4",
  thinking: "./assets/characters/bana-trung.mp4",
  cheer: "./assets/characters/bana-lon.mp4",
  wow: "./assets/characters/bana-trung.mp4",
  proud: "./assets/characters/bana-lon.mp4"
};

// --- GIỮ NGUYÊN ĐỂ KHÔNG LÀM HỎNG MÀN 1 VÀ BẢN ĐỒ 3D ---
const worlds = [
  {
    id: "recycle",
    title: "Vườn Tái Chế",
    province: "Lâm Đồng",
    icon: "♻",
    scene: "./assets/scenes/recycle.svg",
    chapter: "Chương 1",
    unlockedBy: null,
    color: 0x68c96b,
    accent: "#7ccf7d",
    story: "Ôi không! Khu vườn đang ngập tràn rác thải đặt sai chỗ làm cây cối héo rũ.",
    instruction: "Giúp Bana đưa từng món đồ về đúng ngôi nhà của chúng nhé.",
    item: "Chai nước sạch",
    options: [
      { label: "Tái chế", icon: "♻", correct: true },
      { label: "Hữu cơ", icon: "🍂", correct: false },
      { label: "Rác còn lại", icon: "🧺", correct: false }
    ],
    reward: { seed: 1, sticker: "Hạt Mầm Ánh Sáng", badge: "Người Bạn Tái Chế" },
    familyQuest: {
      title: "Săn kho báu tái chế",
      copy: "Cùng ba mẹ tìm 2 món sạch có thể tái chế trong nhà.",
      reward: "Hạt Mầm Ánh Sáng"
    },
    success: "Hay quá! Chai sạch có thể vào nhà tái chế.",
    hint: "Gần đúng rồi. Chai sạch thường được tái chế nha.",
    placeMood: "Rừng thông Lâm Đồng xanh hơn khi bé phân loại đúng."
  },
  {
    id: "water",
    title: "Suối Nước Sạch",
    province: "Đồng Tháp",
    icon: "💧",
    scene: "./assets/scenes/ocean.svg",
    chapter: "Chương 2",
    unlockedBy: "recycle",
    color: 0x79d7c5,
    accent: "#8bdcc8",
    story: "Dòng suối trong veo đang cạn dần vì vòi nước rỉ rả không được khóa lại.",
    instruction: "Bé giúp Bana tiết kiệm nước để dòng suối mát lành chảy xiết trở lại.",
    item: "Vòi nước đang rỉ",
    options: [
      { label: "Khóa vòi", icon: "💧", correct: true },
      { label: "Mở to hơn", icon: "🌊", correct: false },
      { label: "Bỏ qua", icon: "…", correct: false }
    ],
    reward: { seed: 1, sticker: "Hạt Mầm Ánh Sáng", badge: "Người Giữ Dòng Nước" },
    familyQuest: {
      title: "Đội canh vòi nước",
      copy: "Sau khi rửa tay, bé kiểm tra vòi đã khóa nhẹ chưa.",
      reward: "Hạt Mầm Ánh Sáng"
    },
    success: "Tuyệt vời! Từng giọt nước đều đáng quý.",
    hint: "Thử lại nha. Khi nước rỉ, mình khóa vòi trước.",
    placeMood: "Đồng Tháp mát hơn khi dòng nước được giữ gìn."
  },
  {
    id: "energy",
    title: "Đồi Năng Lượng",
    province: "Ninh Thuận",
    icon: "☀",
    scene: "./assets/scenes/energy.svg",
    chapter: "Chương 3",
    unlockedBy: "water",
    color: 0xffd66d,
    accent: "#ffd66d",
    story: "Đồi năng lượng đang chói lóa và quá tải vì nhiều thiết bị điện bị quên tắt.",
    instruction: "Bana nhờ bé chọn những hành động thông minh để tiết kiệm năng lượng sạch.",
    item: "Đèn phòng trống",
    options: [
      { label: "Tắt đèn", icon: "✨", correct: true },
      { label: "Bật thêm đèn", icon: "💡", correct: false },
      { label: "Để cả ngày", icon: "⏳", correct: false }
    ],
    reward: { seed: 1, sticker: "Hạt Mầm Ánh Sáng", badge: "Nhà Khám Phá Năng Lượng" },
    familyQuest: {
      title: "Một nút tắt nhỏ",
      copy: "Trước khi ra khỏi phòng, bé nhắc cả nhà tắt đèn.",
      reward: "Hạt Mầm Ánh Sáng"
    },
    success: "Giỏi quá! Đồi Năng Lượng sáng vừa đủ rồi.",
    hint: "Gần đúng rồi. Phòng trống thì mình tắt đèn nha.",
    placeMood: "Nắng gió Ninh Thuận vui hơn khi năng lượng được dùng đúng lúc."
  },
  {
    id: "friends",
    title: "Nhà Của Muông Thú",
    province: "Khánh Hòa",
    icon: "🐿️",
    scene: "./assets/scenes/garden.svg",
    chapter: "Chương 4",
    unlockedBy: "energy",
    color: 0x68c5f0,
    accent: "#7fd0f4",
    story: "Các bạn chim muông đang hoảng sợ vì rừng rậm bị tàn phá và rác bừa bãi.",
    instruction: "Bé cùng Bana che chở các bạn nhỏ thiên nhiên và tìm lại tổ ấm nhé.",
    item: "Bạn cá đi lạc",
    options: [
      { label: "Đưa về hồ", icon: "🐟", correct: true },
      { label: "Giữ làm đồ chơi", icon: "🪀", correct: false },
      { label: "Chạm mạnh", icon: "✋", correct: false }
    ],
    reward: { seed: 1, sticker: "Hạt Mầm Ánh Sáng", badge: "Người Bảo Vệ Muông Thú" },
    familyQuest: {
      title: "Đi nhẹ, nhìn kỹ",
      copy: "Khi ra công viên, bé quan sát bạn nhỏ tự nhiên mà không làm phiền.",
      reward: "Hạt Mầm Ánh Sáng"
    },
    success: "Bana vỗ tay nè! Bạn cá đã về nhà an toàn.",
    hint: "Thử nhẹ nhàng hơn nha. Động vật nhỏ cần được bảo vệ.",
    placeMood: "Khánh Hòa xanh hơn khi bé yêu bạn biển và hồ."
  }
];

const worldMood = {
  recycle: {
    tone: "Rừng thông thức dậy",
    tinyWhy: "Phân loại rác đúng giúp bảo vệ đất và tạo điều kiện cho hoa tươi khoe sắc.",
    bana: "Bana nghe tiếng lá reo rồi đó. Mình dọn dẹp nhẹ tay nha!",
    completed: "Hoa mới nở rực rỡ quanh Vườn Tái Chế!",
    critters: ["🌼", "🦋", "🌱"]
  },
  water: {
    tone: "Dòng suối lấp lánh",
    tinyWhy: "Tiết kiệm nước sạch giúp bảo vệ nguồn tài nguyên vô giá của vương quốc.",
    bana: "Suối đang thì thầm cảm ơn bé đó, tiếp tục thôi nào!",
    completed: "Dòng suối trong vắt và có đàn cá nhỏ vui vẻ bơi lội!",
    critters: ["💧", "🐟", "🪷"]
  },
  energy: {
    tone: "Đồi nắng ấm",
    tinyWhy: "Tắt các thiết bị điện khi không dùng để giữ năng lượng xanh được lâu hơn.",
    bana: "Bật quạt và tắt đèn khi phòng trống sẽ làm đồi năng lượng rất vui đó!",
    completed: "Đồi Năng Lượng tỏa ra ánh sáng ấm áp, hài hòa vừa đủ!",
    critters: ["☀️", "✨", "🌻"]
  },
  friends: {
    tone: "Ngôi nhà của bạn nhỏ",
    tinyWhy: "Nhẹ nhàng chăm sóc cây xanh để làm mái nhà an toàn cho muông thú.",
    bana: "Mình bước đi thật nhẹ để các bạn chim không bị giật mình nhé.",
    completed: "Muông thú hoang dã đã tìm lại được tổ ấm yên bình của mình!",
    critters: ["🐦", "🐿️", "🦋"]
  }
};

const parentCards = [
  ["Học qua hành động", "Mỗi nhiệm vụ chỉ một thao tác rõ ràng, phù hợp trẻ 6-12 tuổi."],
  ["Nội dung tích cực", "Không phạt nặng, không gây sợ. Bé được khích lệ để thử lại."],
  ["Chơi cùng gia đình", "Sau nhiệm vụ số, bé có gợi ý nhỏ để làm cùng ba mẹ."],
  ["An toàn và nhẹ", "Không quảng cáo gây nhiễu, trạng thái lưu tạm bằng trình duyệt."]
];

const onboardingLines = [
  "Chào bé, mình là Bana!",
  "Vương quốc Green Seeds đang bị mất đi sức sống xanh.",
  "Mỗi nhiệm vụ bé hoàn thành sẽ giúp Bana mang ánh sáng và sự sống về cho vương quốc đó!"
];

const sortingBins = [
  { id: "recycle", title: "Tái chế", icon: "♻", helper: "Chai, lon, giấy sạch" },
  { id: "organic", title: "Hữu cơ", icon: "🍃", helper: "Lá, vỏ trái cây" },
  { id: "other", title: "Còn lại", icon: "🧺", helper: "Món khó tái chế" }
];

const trashItems = [
  { id: "bottle", name: "Chai nhựa", icon: "🧴", bin: "recycle" },
  { id: "paper", name: "Giấy sạch", icon: "📄", bin: "recycle" },
  { id: "can", name: "Lon nhỏ", icon: "🥫", bin: "recycle" },
  { id: "leaf", name: "Lá khô", icon: "🍂", bin: "organic" },
  { id: "banana", name: "Vỏ chuối", icon: "🍌", bin: "organic" },
  { id: "foam", name: "Hộp bẩn", icon: "📦", bin: "other" }
];

const stickerCatalog = [
  { name: "Người Bạn Tái Chế", praise: "Bé đã phân loại rác thật giỏi và giữ cho Vườn Tái Chế luôn xanh sạch." },
  { name: "Người Giữ Dòng Nước", praise: "Bé đã khóa chặt vòi nước rò rỉ và bảo tồn dòng suối trong mát mát lành." },
  { name: "Nhà Khám Phá Năng Lượng", praise: "Bé đã tắt các thiết bị điện lãng phí để đồi gió nạp đầy năng lượng sạch." },
  { name: "Người Bảo Vệ Muông Thú", praise: "Bé đã dịu dàng che chở các loài động vật hoang dã về tổ ấm yên bình." },
  { name: "Người Gieo Mầm Ánh Sáng", praise: "Bé gieo những việc làm xanh tốt mỗi ngày trong cuộc sống thực tế." }
];

const dailyQuests = [
  "Hôm nay bé nhớ tắt đèn khi ra khỏi phòng nhé!",
  "Hôm nay bé thử dùng bình nước cá nhân nha!",
  "Hôm nay bé giúp ba mẹ phân loại một món rác nhé!",
  "Hôm nay bé tưới cây vừa đủ nước thôi nha!",
  "Hôm nay bé quan sát một chiếc lá thật kỹ nhé!"
];

// --- CẤU TRÚC DỮ LIỆU ĐÃ MODULE HÓA CHO 2 BỘ KIT MỚI (PRD APPROVED) ---
const KITS_DATA = {
  kit_green_christmas: {
    kitId: "kit_green_christmas",
    kitName: "Giáng Sinh Xanh",
    materialsUsed: ["Sợi chuối tự nhiên", "Bã cà phê ép"],
    character: {
      name: "Piney",
      threatDescription: "Khí nhà kính Carbonox hủy hoại rừng thông"
    },
    storyChapters: [
      {
        chapterId: 1,
        title: "Rừng thông thay đổi",
        narration: {
          mam_nho: "Rừng thông quê mình đang nóng dần lên bé ơi. Từng hàng cây rũ lá buồn bã kìa.",
          chien_binh_xanh: "Biến đổi khí hậu toàn cầu đang tác động mạnh mẽ đến hệ sinh thái rừng thông bản địa tại Lâm Đồng."
        }
      },
      {
        chapterId: 2,
        title: "Carbonox xuất hiện",
        narration: {
          mam_nho: "Bạn quái vật khói Carbonox đang bay tới hút hết không khí mát lành của các bạn cây.",
          chien_binh_xanh: "Lượng khí nhà kính phát thải quá mức bao trùm sinh cảnh, ngăn cản quá trình hấp thụ oxy và quang hợp."
        }
      },
      {
        chapterId: 3,
        title: "Khô hạn kéo dài",
        narration: {
          mam_nho: "Đất đai nứt nẻ, khô cằn. Bạn thông Piney sắp héo khô mất thôi!",
          chien_binh_xanh: "Đất thiếu độ ẩm nghiêm trọng, nguồn dinh dưỡng vi sinh bị suy giảm, đe dọa sự sinh trưởng của thông non."
        }
      },
      {
        chapterId: 4,
        title: "Sâu hại tấn công",
        narration: {
          mam_nho: "Những con bọ gỗ xấu xí đang tìm cách đục khoét thân cây yếu ớt.",
          chien_binh_xanh: "Khi sức đề kháng tự nhiên giảm sút, các loài côn trùng gây hại dễ dàng xâm nhập phá hủy tế bào mạch dẫn gỗ."
        }
      },
      {
        chapterId: 5,
        title: "Xây dựng lá chắn xanh",
        narration: {
          mam_nho: "Nhiệm vụ khẩn cấp: Bé hãy cùng đan chiếc khiên bảo vệ từ sợi chuối tự nhiên để cứu Piney nhé!",
          chien_binh_xanh: "Thiết lập lưới lá chắn sinh học từ sợi chuối tự nhiên và đế bã cà phê hữu cơ để cản lọc khí Carbonox."
        }
      }
    ],
    miniGame: {
      gameType: "drag_drop",
      missionPrompt: {
        mam_nho: "Phân loại vật liệu xanh cùng Bana nào!",
        chien_binh_xanh: "Phân bổ nhóm chất thải hữu cơ sinh học để giảm thiểu khí carbon."
      },
      itemsToClassify: [
        { itemId: "banana_peel", name: "Vỏ chuối", icon: "🍌", correctTargetId: "organic" },
        { itemId: "coffee_grounds", name: "Bã cà phê", icon: "☕", correctTargetId: "organic" },
        { itemId: "dry_leaf", name: "Lá cây khô", icon: "🍂", correctTargetId: "organic" },
        { itemId: "plastic_bottle", name: "Chai nhựa sạch", icon: "🧴", correctTargetId: "recycle" },
        { itemId: "clean_paper", name: "Giấy sạch", icon: "📄", correctTargetId: "recycle" },
        { itemId: "dirty_box", name: "Hộp bẩn", icon: "📦", correctTargetId: "other" }
      ],
      targets: [
        { targetId: "organic", label: "Ủ hữu cơ", icon: "🍂" },
        { targetId: "recycle", label: "Tái chế", icon: "♻" },
        { targetId: "other", label: "Rác còn lại", icon: "🧺" }
      ]
    },
    buildMission: {
      checkpoints: [
        {
          percentage: 0,
          guideText: {
            mam_nho: "Soạn các sợi chuối dẻo vai nhiều màu sắc ra bàn cùng bố mẹ nhé bé!",
            chien_binh_xanh: "Phân loại các nguyên vật liệu: Sợi xơ chuối dẻo, đế bã cà phê nén sinh học."
          }
        },
        {
          percentage: 50,
          guideText: {
            mam_nho: "Tuyệt quá! Cùng đan chéo các sợi chuối để chiếc khiên dày dặn hơn nào.",
            chien_binh_xanh: "Luồn và đan xen kẽ các sợi xơ chuối tạo thành màng liên kết dày dặn trên khung đế bã cà phê."
          }
        },
        {
          percentage: 100,
          guideText: {
            mam_nho: "Hoàn thành chiếc khiên bảo vệ rừng thông rồi! Thật tự hào quá đi thôi!",
            chien_binh_xanh: "Cố định mối đan cuối cùng. Bộ thiết bị bảo vệ lá chắn sinh học đã sẵn sàng hoạt động."
          }
        }
      ]
    },
    familyQuest: {
      questTitle: "Lời Hứa Xanh Đến 5 Năm Sau",
      timeCapsuleDurationYears: 5,
      promptText: {
        mam_nho: "Bé muốn hứa điều tốt đẹp gì để bảo vệ Trái Đất thân yêu sau này nhỉ?",
        chien_binh_xanh: "Hãy viết cam kết hành động sống xanh của gia đình gửi tới tương lai 5 năm sau."
      }
    }
  },
  kit_dreamcatcher: {
    kitId: "kit_dreamcatcher",
    kitName: "Dreamcatcher Lưới Mơ",
    materialsUsed: ["Vòng tre tự nhiên", "Sợi chuối nhuộm màu hữu cơ"],
    character: {
      name: "Bé Chuối Tiêu",
      threatDescription: "Ác mộng bóng tối bủa vây phòng ngủ"
    },
    storyChapters: [
      {
        chapterId: 1,
        title: "Nỗi lo bóng tối",
        narration: {
          mam_nho: "Bé Chuối Tiêu rất sợ ngủ một mình vì sợ những giấc mơ xấu xí trong bóng tối tăm.",
          chien_binh_xanh: "Áp lực tâm lý về đêm khiến Chuối Tiêu thường xuyên gặp ác mộng, làm ảnh hưởng giấc ngủ sâu."
        }
      },
      {
        chapterId: 2,
        title: "Chiếc lưới ma thuật của mẹ",
        narration: {
          mam_nho: "Mẹ của bé Chuối Tiêu đã đan chiếc lưới bắt giấc mơ bằng sợi chuối để giữ lại mọi ác mộng.",
          chien_binh_xanh: "Phương pháp dân gian sử dụng vòng tre đan lưới sợi chuối để lọc năng lượng xấu, mang lại giấc ngủ yên bình."
        }
      },
      {
        chapterId: 3,
        title: "Bé Mây thu nhặt rác thải",
        narration: {
          mam_nho: "Bé Mây nhặt hết rác bẩn để các bạn chim quay về hót vang khúc nhạc ru Chuối Tiêu ngủ say.",
          chien_binh_xanh: "Cải tạo môi trường xanh xung quanh giúp phục hồi hệ sinh cảnh chim muông, tạo âm thanh thư giãn tự nhiên."
        }
      }
    ],
    miniGame: {
      gameType: "matching",
      missionPrompt: {
        mam_nho: "Giúp các Hiệp sĩ xanh chọn hành động đúng nha!",
        chien_binh_xanh: "Liên kết hiệp sĩ môi trường tương ứng với hành động bảo vệ sinh quyển phù hợp."
      },
      itemsToClassify: [
        { itemId: "farmer", name: "Bác nông dân", icon: "👨‍🌾", correctTargetId: "plant_forest" },
        { itemId: "scientist", name: "Nhà khoa học", icon: "👩‍🔬", correctTargetId: "clean_water" },
        { itemId: "green_kid", name: "Hiệp sĩ nhí", icon: "👶", correctTargetId: "pick_trash" }
      ],
      targets: [
        { targetId: "plant_forest", label: "Trồng rừng xanh đồi trọc 🌲", icon: "🌲" },
        { targetId: "clean_water", label: "Lọc sạch nguồn nước suối 🧪", icon: "🧪" },
        { targetId: "pick_trash", label: "Nhặt rác thải phân loại 🗑️", icon: "🗑️" }
      ]
    },
    buildMission: {
      checkpoints: [
        {
          percentage: 0,
          guideText: {
            mam_nho: "Đặt máy xuống và bắt đầu thắt những mối nối đầu tiên trên vòng tre tròn nhé!",
            chien_binh_xanh: "Định vị vòng tre trung tâm, buộc thắt nút sợi chuối khởi đầu để chuẩn bị đan lưới đồng tâm."
          }
        },
        {
          percentage: 50,
          guideText: {
            mam_nho: "Đan tiếp các sợi chuối và đính thêm hạt gỗ xinh xắn vào giữa lưới nhé.",
            chien_binh_xanh: "Đan lưới hình nhện hướng tâm, luồn khéo léo các hạt gỗ mộc làm màng lọc giấc mơ."
          }
        },
        {
          percentage: 100,
          guideText: {
            mam_nho: "Lưới bắt giấc mơ ma thuật đã xong! Bé treo đầu giường để ngủ ngon nhé!",
            chien_binh_xanh: "Gài đuôi lông vũ tự nhiên vào chân vòng tre. Hệ thống bắt giấc mơ Dreamcatcher đã hoàn thành."
          }
        }
      ]
    },
    familyQuest: {
      questTitle: "Hộp Thư Âm Thanh Ước Mơ",
      timeCapsuleDurationYears: 1,
      promptText: {
        mam_nho: "Con thích lớn lên sẽ làm nghề gì nhất nào? Ba mẹ cùng ghi âm lại nhé!",
        chien_binh_xanh: "Phụ huynh ghi âm lời chúc tương lai gửi đến ước mơ nghề nghiệp của con trẻ."
      }
    }
  }
};

// --- TRẠNG THÁI (STATE) HỆ THỐNG MỚI ĐẦY ĐỦ ---
const defaultState = {
  currentScreen: "landing", // landing, story, minigame, build, family, reward, passport, upsell
  activeKitId: "kit_green_christmas",
  selectedAgeGroup: "mam_nho",
  childName: "",
  seeds: 10,
  passportBadges: [],

  // Trạng thái cụ thể của Kit 1
  kit_green_christmas: {
    storyChapter: 0,
    threatHp: 30, // Khởi đầu nguy kịch để bé giải cứu
    miniGameDone: false,
    matchedItems: [],
    activeSubGameLevel: 1,
    lightsOffState: { tv: true, light: true, fan: true, faucet: true },
    buildProgress: 0, // 0, 50, 100
    familyQuestDone: false,
    familyQuestMedia: {
      audio: null,
      photo: null,
      message: ""
    },
    rewardClaimed: false
  },

  // Trạng thái cụ thể của Kit 2
  kit_dreamcatcher: {
    storyChapter: 0,
    threatHp: 40,
    miniGameDone: false,
    matchedItems: [],
    activeSubGameLevel: 1,
    lightsOffState: { tv: true, light: true, fan: true, faucet: true },
    buildProgress: 0,
    familyQuestDone: false,
    familyQuestMedia: {
      audio: null,
      photo: null,
      message: ""
    },
    rewardClaimed: false
  },

  // State kế thừa cũ để không lỗi cover page
  activeWorld: "recycle",
  activeLevel: 1,
  completed: {},
  completedMissions: {},
  familyDone: {},
  onboardingDone: true,
  onboardingStep: 2,
  gameStage: "map",
  selectedTrash: null,
  sortedTrash: {},
  rewardModalOpen: false,
  dailyQuestCompletedDate: "",
  stickers: [],
  badges: [],
  mood: "happy",
  dialogue: "Bana chờ bé ở cổng vườn. Mình bắt đầu phiêu lưu nha!",
  lastReward: null,
  banaDialogueCollapsed: false
};

let state = loadState();
state.rewardModalOpen = false;
let renderer;
let scene;
let camera;
let threeRoot;
let centralTree;
let centralGlow;
let raycaster;
let pointer;
let clock;
const worldObjects = new Map();
const runners = [];
let mouseX = 0;
let mouseY = 0;
let banaDialogueTimer = null;

const Components = {
  GameCover,
  BanaDialogue,
  renderHeader,
  renderStoryScreen,
  renderMiniGameScreen,
  renderBuildMissionScreen,
  renderFamilyQuestScreen,
  renderRewardScreen,
  renderEcoPassportScreen,
  renderUpsellScreen
};

// --- MOCK FIREBASE INTEGRATION (PRD COMPLIANT) ---
const firebaseMock = {
  db: {
    collection: (name) => ({
      doc: (id) => ({
        set: async (data) => {
          console.log(`[Firebase Firestore] Saved to collection "${name}", doc "${id}":`, data);
          localStorage.setItem(`firestore_${name}_${id}`, JSON.stringify(data));
          return true;
        },
        get: async () => {
          const val = localStorage.getItem(`firestore_${name}_${id}`);
          return val ? { exists: true, data: () => JSON.parse(val) } : { exists: false };
        }
      })
    })
  },
  storage: {
    ref: (path) => ({
      put: async (blob) => {
        console.log(`[Firebase Storage] Uploaded blob/file to "${path}"`);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem(`storage_${path}`, reader.result);
            resolve({
              ref: {
                getDownloadURL: async () => reader.result
              }
            });
          };
          reader.readAsDataURL(blob);
        });
      }
    })
  }
};

async function syncToFirebase() {
  const sessionId = localStorage.getItem("xsmx_firebase_session_id") || "session_" + Math.random().toString(36).substring(7);
  localStorage.setItem("xsmx_firebase_session_id", sessionId);

  const payload = {
    childName: state.childName,
    seeds: state.seeds,
    passportBadges: state.passportBadges,
    kit_green_christmas: state.kit_green_christmas,
    kit_dreamcatcher: state.kit_dreamcatcher,
    updatedAt: new Date().toISOString()
  };

  try {
    await firebaseMock.db.collection("users").doc(sessionId).set(payload);
    showToast("Đã đồng bộ Hộp thời gian lên Firebase! ☁️");
  } catch (err) {
    console.error("Lỗi đồng bộ Firebase:", err);
  }
}

// Khởi chạy
renderApp();
bindEvents();
initThreeWorld().catch((error) => {
  console.warn("Không thể khởi tạo bản đồ 3D:", error);
});
renderDynamic();

// --- TEMPLATE COMPONENTS IMPLEMENTATION ---

function renderApp() {
  document.querySelector("#app").innerHTML = `
    ${Components.GameCover()}
    <main id="main-game" class="main-game is-covered" aria-hidden="true">
      <div id="game-header"></div>
      <div id="game-screen-content"></div>
      ${Components.BanaDialogue()}
    </main>
  `;
}

function renderHeader() {
  return `
    <header class="game-header-bar">
      <button class="back-landing-btn" type="button" data-go-landing>
        ← Trang chủ
      </button>
      <div class="kit-selector-wrapper">
        <label for="kit-select-input">Hộp KIT: </label>
        <select id="kit-select-input" class="kit-select-dropdown">
          <option value="kit_green_christmas" ${state.activeKitId === "kit_green_christmas" ? "selected" : ""}>
            KIT 1: Giáng Sinh Xanh 🎄
          </option>
          <option value="kit_dreamcatcher" ${state.activeKitId === "kit_dreamcatcher" ? "selected" : ""}>
            KIT 2: Dreamcatcher 🌌
          </option>
        </select>
      </div>
      <div class="age-toggle-wrapper">
        <button class="age-toggle-btn ${state.selectedAgeGroup === "mam_nho" ? "active" : ""}" type="button" data-age-group="mam_nho">
          Mầm Nhỏ (5-7t) 👶
        </button>
        <button class="age-toggle-btn ${state.selectedAgeGroup === "chien_binh_xanh" ? "active" : ""}" type="button" data-age-group="chien_binh_xanh">
          Chiến Binh 🛡️
        </button>
      </div>
    </header>
  `;
}

function renderStoryScreen() {
  const kit = KITS_DATA[state.activeKitId];
  const age = state.selectedAgeGroup;
  const kitState = state[state.activeKitId];
  const chapter = kit.storyChapters[kitState.storyChapter];

  return `
    <div class="story-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="story-card">
        <div class="story-header">
          <h2>Chương ${chapter.chapterId}: ${chapter.title}</h2>
          <div class="threat-status">
            <span>${state.activeKitId === "kit_green_christmas" ? "❤ Piney HP" : "⭐ Năng lượng ngủ"}</span>
            <div class="health-bar-container">
              <div class="health-bar-fill" style="width: ${kitState.threatHp}%"></div>
            </div>
            <span class="health-bar-num">${kitState.threatHp}%</span>
          </div>
        </div>
        
        <div class="story-body">
          <div class="mascot-visual">
            <video autoplay loop muted playsinline src="${characterVideos.thinking}"></video>
          </div>
          <div class="story-narration">
            <p class="story-text-bubble">
              "${chapter.narration[age]}"
            </p>
          </div>
        </div>
        
        <div class="story-controls">
          ${kitState.storyChapter < kit.storyChapters.length - 1 ? `
            <button class="primary-action pulse" type="button" data-story-next-chapter>
              Đọc tiếp →
            </button>
          ` : `
            <button class="primary-action pulse" type="button" data-story-accept-mission>
              Nhận Nhiệm Vụ ⚔️
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderMiniGameScreen() {
  const kit = KITS_DATA[state.activeKitId];
  const age = state.selectedAgeGroup;
  const kitState = state[state.activeKitId];
  const subLevel = kitState.activeSubGameLevel || 1;

  if (subLevel === 2) {
    return renderLightsOffGame();
  }

  const isMatchedAll = kitState.matchedItems.length === kit.miniGame.itemsToClassify.length;

  return `
    <div class="minigame-screen-shell ${state.activeKitId === "kit_green_christmas" ? "classification-game" : "matching-game"} region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="game-instructions">
        <p class="kicker">Màn 3: Thử thách 1 (Hiểu về vật liệu)</p>
        <h2>${kit.miniGame.missionPrompt[age]}</h2>
        <p class="help-text">${state.activeKitId === "kit_green_christmas" ? "Chạm món vật liệu rồi chạm khay phân loại phù hợp nhé!" : "Chạm vào nhân vật Hiệp sĩ, sau đó chọn hành động xanh tương ứng."}</p>
      </div>
      
      <div class="game-container">
        <div class="game-items-deck">
          ${kit.miniGame.itemsToClassify.map(item => {
            const isMatched = kitState.matchedItems.includes(item.itemId);
            const isSelected = state.selectedGameItemId === item.itemId;
            return `
              <button class="game-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}" 
                type="button" 
                data-game-item-id="${item.itemId}"
                ${isMatched ? 'disabled' : ''}>
                <span class="game-item-icon">${item.icon}</span>
                <span class="game-item-label">${item.name}</span>
              </button>
            `;
          }).join("")}
        </div>
        
        <div class="game-targets-deck">
          ${kit.miniGame.targets.map(target => `
            <button class="game-target-bin" type="button" data-game-target-id="${target.targetId}">
              <span class="target-bin-icon">${target.icon}</span>
              <span class="target-bin-label">${target.label}</span>
            </button>
          `).join("")}
        </div>
      </div>
      
      <div class="game-feedback" id="game-feedback-box">
        <video autoplay loop muted playsinline src="${characterVideos.happy}" class="feedback-avatar"></video>
        <p class="feedback-text" id="game-feedback-text">Bana đang chờ bé bắt đầu kết nối!</p>
      </div>
      
      <div class="game-controls" style="display: ${isMatchedAll ? 'block' : 'none'}">
        <button class="primary-action pulse" type="button" data-minigame-next-sublevel>
          Vào Thử thách 2: Tiết kiệm năng lượng ⚡
        </button>
      </div>
    </div>
  `;
}

function renderLightsOffGame() {
  const kitState = state[state.activeKitId];
  const lightsOff = kitState.lightsOffState || { tv: true, light: true, fan: true, faucet: true };
  
  let totalWaste = 0;
  if (lightsOff.tv) totalWaste += 80;
  if (lightsOff.light) totalWaste += 40;
  if (lightsOff.fan) totalWaste += 60;
  if (lightsOff.faucet) totalWaste += 20;
  
  const isWon = totalWaste === 0;
  
  return `
    <div class="minigame-screen-shell lights-off-game region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="game-instructions">
        <p class="kicker">Màn 3: Thử thách 2 (Tiết kiệm năng lượng)</p>
        <h2>Tắt các thiết bị điện lãng phí!</h2>
        <p class="help-text">Nhấn vào các thiết bị đang bật trong phòng trống để tiết kiệm điện nhé bé.</p>
      </div>
      
      <div class="power-meter-box">
        <span class="power-meter-label">⚡ Lượng điện đang lãng phí</span>
        <div class="power-meter-bar-wrap">
          <div class="power-meter-bar-fill" style="width: ${(totalWaste / 200) * 100}%"></div>
          <span class="power-meter-val">${totalWaste}W / 200W</span>
        </div>
      </div>
      
      <div class="devices-grid">
        <button class="device-card ${lightsOff.tv ? 'active' : 'off'}" type="button" data-toggle-device="tv">
          <span class="device-icon">📺</span>
          <div class="device-info">
            <strong>Tivi phòng trống</strong>
            <span>${lightsOff.tv ? 'Đang bật · 80W' : 'Đã tắt · 0W'}</span>
          </div>
          <span class="device-action-btn">${lightsOff.tv ? 'Tắt đi 🔌' : 'Đã tắt'}</span>
        </button>
        
        <button class="device-card ${lightsOff.light ? 'active' : 'off'}" type="button" data-toggle-device="light">
          <span class="device-icon">💡</span>
          <div class="device-info">
            <strong>Bóng đèn học</strong>
            <span>${lightsOff.light ? 'Đang bật · 40W' : 'Đã tắt · 0W'}</span>
          </div>
          <span class="device-action-btn">${lightsOff.light ? 'Tắt đi 🔌' : 'Đã tắt'}</span>
        </button>
        
        <button class="device-card ${lightsOff.fan ? 'active' : 'off'}" type="button" data-toggle-device="fan">
          <span class="device-icon">🌀</span>
          <div class="device-info">
            <strong>Quạt trần bật thừa</strong>
            <span>${lightsOff.fan ? 'Đang bật · 60W' : 'Đã tắt · 0W'}</span>
          </div>
          <span class="device-action-btn">${lightsOff.fan ? 'Tắt đi 🔌' : 'Đã tắt'}</span>
        </button>
        
        <button class="device-card ${lightsOff.faucet ? 'active' : 'off'}" type="button" data-toggle-device="faucet">
          <span class="device-icon">🚰</span>
          <div class="device-info">
            <strong>Vòi nước bị rỉ</strong>
            <span>${lightsOff.faucet ? 'Đang rò rỉ · 20W' : 'Đã khóa chặt · 0W'}</span>
          </div>
          <span class="device-action-btn">${lightsOff.faucet ? 'Khóa vòi 💧' : 'Đã khóa'}</span>
        </button>
      </div>
      
      <div class="game-feedback" id="game-feedback-box">
        <video autoplay loop muted playsinline src="${characterVideos.happy}" class="feedback-avatar"></video>
        <p class="feedback-text" id="game-feedback-text">
          ${isWon ? 'Tuyệt cú mèo! Bé đã tiết kiệm được toàn bộ năng lượng rồi!' : 'Bana đang đợi bé tắt các thiết bị thừa đó!'}
        </p>
      </div>
      
      <div class="game-controls" style="display: ${isWon ? 'block' : 'none'}">
        <button class="primary-action pulse" type="button" data-minigame-finish>
          Tiếp tục chế tạo KIT thực tế 🛠️
        </button>
      </div>
    </div>
  `;
}

function renderBuildMissionScreen() {
  const kit = KITS_DATA[state.activeKitId];
  const age = state.selectedAgeGroup;
  const kitState = state[state.activeKitId];
  const progress = kitState.buildProgress;
  const currentCheckpoint = kit.buildMission.checkpoints.find(c => c.percentage === progress) || kit.buildMission.checkpoints[0];

  return `
    <div class="build-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="build-card">
        <p class="kicker">Màn 4: Đặt điện thoại xuống & Làm KIT thật</p>
        <h2>Dựng bảo bối từ sợi chuối</h2>
        
        <div class="build-progress-visual">
          <div class="build-progress-circle-wrap">
            <div class="build-progress-percent">${progress}%</div>
            <svg class="progress-ring" width="120" height="120">
              <circle class="progress-ring-bg" stroke="rgba(0,0,0,0.06)" stroke-width="8" fill="transparent" r="50" cx="60" cy="60"/>
              <circle class="progress-ring-bar" stroke="#3f9f56" stroke-width="8" stroke-dasharray="${2 * Math.PI * 50}" stroke-dashoffset="${2 * Math.PI * 50 * (1 - progress / 100)}" fill="transparent" r="50" cx="60" cy="60"/>
            </svg>
          </div>
          <div class="build-progress-text">
            <h3>Mốc: ${progress === 0 ? 'Chuẩn bị đồ' : progress === 50 ? 'Đang thắt/đan' : 'Hoàn thiện'}</h3>
            <p>${currentCheckpoint.guideText[age]}</p>
          </div>
        </div>
        
        <div class="physical-alert-card">
          <span class="alert-icon">🛠️</span>
          <div class="alert-body">
            <strong>HÃY ĐẶT ĐIỆN THOẠI XUỐNG</strong>
            <p>Con đặt máy nằm yên và cùng bố mẹ đan các nút thắt xơ chuối dẻo dai nhé.</p>
          </div>
        </div>
        
        <div class="checkpoint-selector">
          <button class="checkpoint-btn ${progress === 0 ? 'active' : ''}" type="button" data-checkpoint="0">
            0% - Soạn đồ
          </button>
          <button class="checkpoint-btn ${progress === 50 ? 'active' : ''}" type="button" data-checkpoint="50">
            50% - Đang đan
          </button>
          <button class="checkpoint-btn ${progress === 100 ? 'active' : ''}" type="button" data-checkpoint="100">
            100% - Xong rồi!
          </button>
        </div>
        
        <div class="build-controls">
          <button class="primary-action pulse" type="button" data-build-finish ${progress < 100 ? 'disabled' : ''}>
            Kích hoạt bảo bối xanh ✨
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFamilyQuestScreen() {
  const kit = KITS_DATA[state.activeKitId];
  const age = state.selectedAgeGroup;
  const kitState = state[state.activeKitId];

  return `
    <div class="family-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="family-card">
        <p class="kicker">Màn 5: Family Quest (Gắn kết gia đình)</p>
        <h2>${kit.familyQuest.questTitle}</h2>
        <p class="quest-intro-text">${kit.familyQuest.promptText[age]}</p>
        
        <div class="family-forms">
          <div class="form-module audio-module">
            <h3>🎙️ Ghi âm lời ước/Lời chúc gia đình</h3>
            <div class="audio-controls-row">
              <button class="record-btn" type="button" id="record-audio-btn">
                Bắt đầu ghi âm
              </button>
              <div class="recording-indicator" id="recording-indicator" style="display: none">
                <span class="pulse-dot"></span> Đang ghi giọng của bé...
              </div>
              <audio id="audio-playback" controls style="display: ${kitState.familyQuestMedia.audio ? 'block' : 'none'}" src="${kitState.familyQuestMedia.audio || ''}"></audio>
            </div>
          </div>
          
          <div class="form-module photo-module">
            <h3>📸 Tải lên bức ảnh tác phẩm của bé</h3>
            <div class="photo-upload-row">
              <label class="photo-label-btn" for="photo-file-input">
                Chọn ảnh của bé 🖼️
              </label>
              <input type="file" id="photo-file-input" accept="image/*" style="display:none">
              <div class="photo-preview-box" id="photo-preview-box">
                ${kitState.familyQuestMedia.photo ? `<img src="${kitState.familyQuestMedia.photo}">` : 'Chưa chọn ảnh'}
              </div>
            </div>
          </div>
          
          <div class="form-module capsule-module">
            <h3>⏳ Lời hứa xanh gửi tương lai</h3>
            <textarea id="capsule-text-input" placeholder="Bé viết cam kết nhỏ bảo vệ cây xanh vào đây nha..." class="capsule-textarea">${kitState.familyQuestMedia.message || ''}</textarea>
            <small class="capsule-note">Thông điệp sẽ được lưu vào hộp thời gian khóa trong ${kit.familyQuest.timeCapsuleDurationYears} năm.</small>
          </div>
        </div>
        
        <div class="family-controls">
          <button class="primary-action pulse" type="button" data-family-finish>
            Khóa hộp ký ức & Nhận Chứng nhận 🎁
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderRewardScreen() {
  const badgeName = state.activeKitId === "kit_green_christmas" ? "Hiệp Sĩ Bảo Vệ Rừng Thông" : "Người Gác Cổng Giấc Mơ";
  const badgeIcon = state.activeKitId === "kit_green_christmas" ? "🎄" : "🌌";

  return `
    <div class="reward-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="glow-container"></div>
      <div class="reward-wrapper">
        <p class="kicker">Màn 6: Bằng khen danh dự</p>
        
        <div class="badge-3d-box">
          <div class="badge-sphere">
            <span class="badge-sph-icon">${badgeIcon}</span>
          </div>
          <h3>${badgeName}</h3>
        </div>
        
        <div class="certificate-box">
          <div class="cert-border">
            <h4>BẰNG KHEN HIỆP SĨ MẦM XANH</h4>
            <p>Trân trọng vinh danh bạn nhỏ:</p>
            <input type="text" id="cert-kid-name" class="cert-kid-name-input" placeholder="Bé nhập tên vào đây nha..." value="${state.childName || ''}">
            <p class="cert-desc">Đã dũng cảm chế tạo thành công thiết bị bảo vệ sinh thái từ xơ chuối dẻo dai và bã cà phê ép, góp sức bảo vệ hành tinh xanh.</p>
            <div class="cert-signature">
              <span>Bana ký tên</span>
              <strong>🌱 Bana</strong>
            </div>
          </div>
        </div>
        
        <div class="reward-controls">
          <button class="primary-action pulse" type="button" data-reward-claim>
            Cất vào Hộ chiếu Passport 📖
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderEcoPassportScreen() {
  return `
    <div class="passport-screen-shell">
      <div class="passport-card">
        <div class="passport-header">
          <h2>📖 Sổ Hành Trình Mầm Xanh (Eco Passport)</h2>
          <div class="seed-indicator">Hạt mầm tích lũy: 🌾 <strong>${state.seeds}</strong></div>
        </div>
        
        <div class="passport-pages">
          <div class="passport-page page-left">
            <h3>Huy hiệu của con</h3>
            <div class="earned-badges-list">
              ${state.passportBadges.length === 0 ? `
                <div class="no-badge-msg">Con chưa nhận huy hiệu nào. Hãy tham gia chế tạo nhé!</div>
              ` : state.passportBadges.map(badgeId => {
                const isChristmas = badgeId === "badge_green_christmas";
                return `
                  <div class="passport-badge-item">
                    <span class="badge-item-icon">${isChristmas ? "🎄" : "🌌"}</span>
                    <div class="badge-info-column">
                      <strong>${isChristmas ? "Hiệp Sĩ Rừng Thông" : "Người Gác Cổng Giấc Mơ"}</strong>
                      <small>Đã đạt thành tích</small>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
          
          <div class="passport-page page-right">
            <h3>Kỷ niệm gia đình</h3>
            <div class="family-memories-timeline">
              ${Object.keys(KITS_DATA).map(kitId => {
                const kitState = state[kitId];
                if (!kitState || (!kitState.familyQuestMedia.photo && !kitState.familyQuestMedia.audio && !kitState.familyQuestMedia.message)) {
                  return "";
                }
                const kitName = KITS_DATA[kitId].kitName;
                return `
                  <div class="timeline-memory-card">
                    <h4>Hộp KIT: ${kitName}</h4>
                    ${kitState.familyQuestMedia.photo ? `<div class="memory-img-wrap"><img src="${kitState.familyQuestMedia.photo}"></div>` : ""}
                    ${kitState.familyQuestMedia.message ? `<p class="memory-msg">"<em>${kitState.familyQuestMedia.message}</em>"</p>` : ""}
                    ${kitState.familyQuestMedia.audio ? `
                      <div class="memory-audio-player">
                        <span>🎙️ Xem lại tiếng bé:</span>
                        <audio src="${kitState.familyQuestMedia.audio}" controls></audio>
                      </div>
                    ` : ""}
                  </div>
                `;
              }).join("")}
              
              ${!Object.keys(KITS_DATA).some(kitId => {
                const s = state[kitId];
                return s && (s.familyQuestMedia.photo || s.familyQuestMedia.audio || s.familyQuestMedia.message);
              }) ? '<div class="no-badge-msg">Chưa lưu giữ thư ký ức nào.</div>' : ""}
            </div>
          </div>
        </div>
        
        <div class="passport-controls">
          <button class="primary-action pulse" type="button" data-passport-next-adventure>
            Đến trạm tiếp theo 🚀
          </button>
        </div>
      </div>
    </div>
  `;
}



function renderUpsellScreen() {
  const otherKitId = state.activeKitId === "kit_green_christmas" ? "kit_dreamcatcher" : "kit_green_christmas";
  const otherKit = KITS_DATA[otherKitId];

  return `
    <div class="upsell-screen-shell region-${otherKitId === "kit_green_christmas" ? "recycle" : "friends"}">
      <div class="upsell-card">
        <p class="kicker">Màn 8: Upsell tự nhiên</p>
        <h2>Hộp KIT bí ẩn tiếp theo đang chờ bé!</h2>
        
        <div class="scratch-card-container">
          <div class="scratch-card-revealed-content">
            <div class="revealed-visual">
              <span class="revealed-icon">${otherKitId === "kit_green_christmas" ? "🎄" : "🌌"}</span>
            </div>
            <h3>Khám phá tiếp: KIT ${otherKit.kitName}</h3>
            <p>Sử dụng vật liệu: ${otherKit.materialsUsed.join(", ")}</p>
            <p>Hãy cùng đập hộp để giúp nhân vật tiếp theo vượt qua khó khăn nhé bé!</p>
          </div>
          <div class="scratch-card-fog-overlay" id="scratch-fog-overlay">
            <div class="fog-text">Chạm di chuyển để thổi tan sương mù 🌫️</div>
          </div>
        </div>
        
        <div class="upsell-controls">
          <button class="primary-action pulse" type="button" data-upsell-choose-other>
            Mở khóa hộp này 🔓
          </button>
          <button class="secondary-action" type="button" data-upsell-back-home>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDynamic() {
  const cover = document.querySelector("#game-cover");
  const main = document.querySelector("#main-game");

  if (!cover || !main) return;

  if (state.currentScreen === "landing") {
    cover.removeAttribute("hidden");
    main.classList.add("is-covered");
    main.setAttribute("aria-hidden", "true");
    updateLandingProgress();
  } else {
    cover.setAttribute("hidden", "");
    main.classList.remove("is-covered");
    main.removeAttribute("aria-hidden");

    // Render header
    document.querySelector("#game-header").innerHTML = Components.renderHeader();

    // Render screen
    const contentBox = document.querySelector("#game-screen-content");
    if (state.currentScreen === "story") {
      contentBox.innerHTML = Components.renderStoryScreen();
    } else if (state.currentScreen === "minigame") {
      contentBox.innerHTML = Components.renderMiniGameScreen();
    } else if (state.currentScreen === "build") {
      contentBox.innerHTML = Components.renderBuildMissionScreen();
    } else if (state.currentScreen === "family") {
      contentBox.innerHTML = Components.renderFamilyQuestScreen();
    } else if (state.currentScreen === "reward") {
      contentBox.innerHTML = Components.renderRewardScreen();
    } else if (state.currentScreen === "passport") {
      contentBox.innerHTML = Components.renderEcoPassportScreen();
    } else if (state.currentScreen === "upsell") {
      contentBox.innerHTML = Components.renderUpsellScreen();
    }

    renderDialogue();
  }
}

// --- CORE FUNCTIONS FROM PREVIOUS GAME TO AVOID CRASHES ---
function GameCover() {
  return `
    <section id="game-cover" class="game-cover" aria-label="Màn bìa Xứ Sở Mầm Xanh">
      <nav class="landing-nav" aria-label="Thanh điều hướng">
        <div class="nav-container">
          <a class="nav-logo" href="#home" aria-label="Trang chủ Xứ Sở Mầm Xanh">
            <svg class="logo-icon" viewBox="0 0 100 100">
              <path d="M50,15 C60,40 90,45 80,75 C70,95 30,95 20,75 C10,45 40,40 50,15 Z" fill="#3f9f56"/>
              <path d="M50,30 C55,50 75,55 70,75 C65,88 35,88 30,75 C25,55 45,50 50,30 Z" fill="#ffd66d"/>
              <circle cx="50" cy="65" r="10" fill="#fffaf0"/>
            </svg>
            <div class="logo-text">
              <span class="logo-main">GREEN SEEDS</span>
              <span class="logo-sub">KINGDOM</span>
            </div>
          </a>
          <ul class="nav-links">
            <li><a href="#story">Câu chuyện</a></li>
            <li><a href="#lands">Vùng đất</a></li>
            <li><a href="#journey">Hành trình</a></li>
            <li><a href="#tree-progress">Cây mầm</a></li>
            <li><a href="#album">Huy hiệu</a></li>
            <li><a href="#parents-portal">Bố mẹ & Thầy cô</a></li>
          </ul>
          <div class="nav-actions">
            <button class="nav-cta" type="button" data-cover-start>VÀO VƯƠNG QUỐC</button>
          </div>
        </div>
      </nav>

      <div class="landing-hero" id="home">
        <video
          id="hero-video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="./assets/scenes/xu-so-mam-xanh-hostinger.jpg"
          class="hero-video-bg"
        >
          <source src="./assets/scenes/green-seeds-kingdom-hero.mp4" type="video/mp4" />
        </video>
        <div class="hero-video-overlay"></div>
        <div class="hero-bottom-curve">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.27,84.34,22.48c64.3,13.65,133.05,15.44,200.37,33.5C295.67,56.44,308.26,56.44,321.39,56.44Z"></path>
          </svg>
        </div>
        <div class="hero-scroll-prompt">
          <span>Cuộn để khám phá vương quốc</span>
          <svg class="scroll-arrow" viewBox="0 0 24 24">
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <div class="landing-scroll-content">
        <section id="story" class="landing-section story-section">
          <div class="section-container">
            <div class="storybook-panel">
              <div class="storybook-content">
                <div class="storybook-image-panel">
                  <img src="./assets/scenes/mam-xanh-story.jpg" alt="Xứ Sở Mầm Xanh" class="storybook-main-img" />
                  <div class="storybook-caption">Cùng Bana bảo vệ ngôi nhà xanh</div>
                </div>
                <div class="storybook-text-panel">
                  <p class="kicker">Huyền thoại Vương quốc</p>
                  <h2 class="storybook-title">CÂU CHUYỆN MẦM XANH</h2>
                  <div class="storybook-body">
                    <p>Chào mừng bé đến với <strong>Xứ Sở Mầm Xanh</strong>! Đây là nơi bé và ba mẹ cùng chế tạo những bảo bối xanh thực tế từ sợi chuối tự nhiên và bã cà phê nén sinh học của Biofiber.</p>
                    <p>Hãy lựa chọn cho bé cấp độ phù hợp để tham gia giải cứu bạn nhỏ trong khu vườn diệu kỳ cùng Bana nhé!</p>
                  </div>
                  <button class="storybook-cta-btn" type="button" data-cover-start>ĐỒNG HÀNH CÙNG BANA</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="lands" class="landing-section lands-section">
          <div class="section-container">
            <h2 class="section-title">CHỌN HỘP KIT ĐỂ BẮT ĐẦU</h2>
            <div class="lands-grid">
              <div class="land-card card-recycle">
                <div class="land-visual-wrap">
                  <img src="./assets/scenes/giang-sinh-xanh-kit.jpg" alt="Vườn Tái Chế" class="land-scene-img" />
                  <span class="land-badge-preview locked">
                    <span class="badge-icon">🎄</span>
                    <small class="badge-label">KIT 1</small>
                  </span>
                </div>
                <div class="land-info">
                  <div class="land-meta">
                    <span class="land-chapter">KIT 1</span>
                    <span class="land-location">Lâm Đồng</span>
                  </div>
                  <h3>Giáng Sinh Xanh</h3>
                  <p class="land-desc">Đan khiên lá chống bức xạ Carbonox cứu rừng thông héo úa bằng sợi xơ chuối dẻo dai.</p>
                  <button class="land-play-btn" type="button" data-cover-start data-land-target="kit_green_christmas">CHƠI KIT 1</button>
                </div>
              </div>

              <div class="land-card card-friends">
                <div class="land-visual-wrap">
                  <img src="./assets/scenes/dreamcatcher-kit.jpg" alt="Nhà Của Muông Thú" class="land-scene-img" />
                  <span class="land-badge-preview locked">
                    <span class="badge-icon">🌌</span>
                    <small class="badge-label">KIT 2</small>
                  </span>
                </div>
                <div class="land-info">
                  <div class="land-meta">
                    <span class="land-chapter">KIT 2</span>
                    <span class="land-location">Khánh Hòa</span>
                  </div>
                  <h3>Dreamcatcher Lưới Mơ</h3>
                  <p class="land-desc">Đan lưới bắt giấc mơ bằng tre và sợi chuối giúp bé Chuối Tiêu xua tan bóng tối sợ hãi.</p>
                  <button class="land-play-btn" type="button" data-cover-start data-land-target="kit_dreamcatcher">CHƠI KIT 2</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION: HÀNH TRÌNH BẢO VỆ XỨ SỞ -->
        <section id="journey" class="landing-section journey-section">
          <div class="section-container" style="max-width: 1100px; margin: 0 auto; text-align: center; padding: 0 16px;">
            <img src="./assets/scenes/journey-timeline.png" alt="Hành trình bảo vệ xứ sở" class="journey-timeline-img" style="width: 100%; height: auto; border-radius: 28px; box-shadow: 0 15px 45px rgba(63, 159, 86, 0.08);" />
          </div>
        </section>

        <!-- SECTION: CÂY MẦM XANH -->
        <section id="tree-progress" class="landing-section tree-section">
          <div class="section-container">
            <h2 class="section-title">HẠT MẦM TÍCH LŨY</h2>
            <div class="tree-growth-wrapper">
              <div class="tree-visual-box" ${state.seeds < 10 ? 'style="padding: 0; overflow: hidden; border: none; background: transparent; width: 220px; flex-shrink: 0;"' : ''}>
                ${state.seeds >= 20 ? `
                  <div class="tree-emoji">🌳</div>
                  <div class="tree-badge">Cây Đại Thụ Xanh</div>
                ` : state.seeds >= 10 ? `
                  <div class="tree-emoji">🌿</div>
                  <div class="tree-badge">Cây Mầm Non Nớt</div>
                ` : `
                  <img src="./assets/scenes/seed-character.png" alt="Hạt Mầm Nhỏ Bé" style="width: 100%; height: auto; border-radius: 28px;" />
                `}
              </div>
              <div class="tree-status-box">
                <h3>Vườn mầm của bé: 🌾 <strong>${state.seeds} Hạt mầm</strong></h3>
                <p class="tree-desc">Hạt mầm tích lũy được thu thập từ các hành động sống xanh của bé trên Website và hoạt động làm KIT cùng ba mẹ ngoài đời thực. Cây mầm sẽ lớn dần lên theo số hạt mầm tích lũy!</p>
                <div class="seeds-guide-box">
                  <h4>💡 Làm sao để thu thập hạt mầm?</h4>
                  <ul class="seeds-guide-list">
                    <li>🎯 Giải đố Mini-game thành công: <strong>+5 Hạt mầm</strong></li>
                    <li>📸 Lưu giữ kỷ niệm gia đình vào Time Capsule: <strong>+10 Hạt mầm</strong></li>
                    <li>🏆 Hoàn thành vinh danh nhận Bằng khen: <strong>+5 Hạt mầm</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION: ALBUM HUY HIỆU -->
        <section id="album" class="landing-section badge-album-section">
          <div class="section-container">
            <h2 class="section-title">BỘ SƯU TẬP HUY HIỆU</h2>
            <p class="section-subtitle">Tích lũy đầy đủ huy hiệu qua từng bộ KIT để đạt danh hiệu Đại sứ Môi Trường</p>
            <div class="badges-album-grid">
              <div class="badge-album-card ${state.passportBadges.includes('badge_green_christmas') ? 'unlocked' : 'locked'}">
                <div class="album-badge-circle">🎄</div>
                <h4>Hiệp Sĩ Rừng Thông</h4>
                <p>Nhận được khi giúp bạn Piney chống khí thải Carbonox bảo vệ sinh cảnh Lâm Đồng.</p>
                <span class="badge-status-label">${state.passportBadges.includes('badge_green_christmas') ? '✅ Đã mở khóa' : '🔒 Chưa đạt'}</span>
              </div>
              <div class="badge-album-card ${state.passportBadges.includes('badge_dreamcatcher') ? 'unlocked' : 'locked'}">
                <div class="album-badge-circle">🌌</div>
                <h4>Người Gác Giấc Mơ</h4>
                <p>Nhận được khi giúp bé Chuối Tiêu đan lưới xua tan ác mộng bóng đêm phòng ngủ.</p>
                <span class="badge-status-label">${state.passportBadges.includes('badge_dreamcatcher') ? '✅ Đã mở khóa' : '🔒 Chưa đạt'}</span>
              </div>
              <div class="badge-album-card locked">
                <div class="album-badge-circle">💧</div>
                <h4>Chiến Binh Nguồn Nước</h4>
                <p>Đang chế tác hành trình bảo vệ dòng suối nhỏ của Biofiber (Sắp ra mắt).</p>
                <span class="badge-status-label">🔒 Chưa ra mắt</span>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION: PORTAL BỐ MẸ VÀ THẦY CÔ -->
        <section id="parents-portal" class="landing-section portal-section">
          <div class="section-container" style="max-width: 1000px; margin: 0 auto; position: relative; padding: 0 16px;">
            <img src="./assets/scenes/parents-portal.jpg" alt="Cổng Bố Mẹ và Thầy Cô" class="parents-portal-img" style="width: 100%; height: auto; border-radius: 32px; box-shadow: 0 15px 45px rgba(63, 159, 86, 0.08); display: block;" />
            <!-- Lớp nút phủ trong suốt tương tác khớp với vị trí nút trên ảnh -->
            <a href="#lands" class="portal-overlay-btn left" style="position: absolute; left: 6.8%; bottom: 12%; width: 36.2%; height: 8.5%; border-radius: 99px; cursor: pointer; text-decoration: none; display: block;" title="Lựa chọn bộ KIT chơi cùng con"></a>
            <button type="button" class="portal-overlay-btn right" style="position: absolute; right: 6.8%; bottom: 12%; width: 36.2%; height: 8.5%; border-radius: 99px; cursor: pointer; background: transparent; border: none; padding: 0; display: block;" title="Đăng ký nhận giáo trình mẫu & Báo giá" onclick="alert('Đăng ký thành công! Đội ngũ Biofiber sẽ gửi Bộ tài liệu giáo trình xanh cùng bảng giá chiết khấu ưu đãi học đường qua email của bạn sau ít phút.')"></button>
          </div>
        </section>
      </div>
    </section>
  `;
}

function updateLandingProgress() {
  // Mock function to avoid UI layout error on Landing page
}

function BanaDialogue() {
  const collapsedClass = state.banaDialogueCollapsed ? "collapsed" : "";
  return `
    <div class="bana-dialogue-wrapper ${collapsedClass}" id="bana-dialogue-wrapper">
      <aside class="bana-dialogue" aria-live="polite">
        <button class="bana-dialogue-close" type="button" aria-label="Đóng thoại" data-bana-close>×</button>
        <div class="bana-face">
          <video id="bana-dialogue-video" autoplay loop muted playsinline src="${characterVideos[state.mood] || characterVideos.happy}"></video>
        </div>
        <div class="bana-dialogue-body">
          <span id="bana-mood-label">Bana vui</span>
          <p id="bana-line">Bana tin bé làm được!</p>
        </div>
      </aside>
      <button class="bana-launcher" type="button" aria-label="Trò chuyện với Bana" data-bana-reopen>
        <span class="bana-launcher-avatar">🌱</span>
        <span class="bana-launcher-glow"></span>
      </button>
    </div>
  `;
}

function renderDialogue() {
  const video = document.querySelector("#bana-dialogue-video");
  const label = document.querySelector("#bana-mood-label");
  const line = document.querySelector("#bana-line");
  const moodLabels = {
    happy: "Bana vui",
    thinking: "Bana đang nghĩ",
    cheer: "Bana cổ vũ",
    wow: "Bana bất ngờ",
    proud: "Bana tự hào"
  };
  if (video) {
    video.src = characterVideos[state.mood] || characterVideos.happy;
    video.play().catch(() => {});
  }
  if (label) label.textContent = moodLabels[state.mood] || "Bana vui";
  if (line) line.textContent = state.dialogue;
}

function updateBana(mood, dialogue) {
  state.mood = mood;
  state.dialogue = dialogue;
  state.banaDialogueCollapsed = false;
  saveState();
  renderDialogue();

  if (banaDialogueTimer) {
    clearTimeout(banaDialogueTimer);
  }
  banaDialogueTimer = setTimeout(() => {
    collapseBanaDialogue();
  }, 5000);
}

function collapseBanaDialogue() {
  state.banaDialogueCollapsed = true;
  saveState();
  const wrapper = document.querySelector("#bana-dialogue-wrapper");
  if (wrapper) {
    wrapper.classList.add("collapsed");
  }
}

function reopenBanaDialogue() {
  state.banaDialogueCollapsed = false;
  saveState();
  const wrapper = document.querySelector("#bana-dialogue-wrapper");
  if (wrapper) {
    wrapper.classList.remove("collapsed");
  }
}

// --- BIND EVENT HANDLERS (DELEGATED CLICK EVENTS) ---
function bindEvents() {
  // Đăng ký tương tác đầu tiên để phát nhạc nền tự động
  document.addEventListener("click", handleFirstInteraction, { once: true });
  document.addEventListener("touchstart", handleFirstInteraction, { once: true });
  document.addEventListener("keydown", handleFirstInteraction, { once: true });
  document.addEventListener("mousedown", handleFirstInteraction, { once: true });
  
  // Thử tự động phát nhạc khi tải trang
  tryPlayMusic();

  const video = document.getElementById("hero-video");
  if (video) {
    video.addEventListener("canplay", () => video.classList.add("loaded"));
  }

  document.addEventListener("click", async (event) => {
    // 1. Landing Page events
    const coverStart = event.target.closest("[data-cover-start]");
    if (coverStart) {
      const targetKit = coverStart.dataset.landTarget || "kit_green_christmas";
      state.activeKitId = targetKit;
      state.currentScreen = "story";
      
      // Reset state for new adventure
      state[targetKit].storyChapter = 0;
      state[targetKit].buildProgress = 0;
      state[targetKit].miniGameDone = false;
      state[targetKit].matchedItems = [];
      state[targetKit].activeSubGameLevel = 1;
      state[targetKit].lightsOffState = { tv: true, light: true, fan: true, faucet: true };
      
      saveState();
      
      const main = document.querySelector("#main-game");
      if (main) main.classList.add("is-waking");
      
      window.setTimeout(() => {
        renderDynamic();
        if (main) {
          main.scrollIntoView({ behavior: "smooth", block: "start" });
          main.classList.remove("is-waking");
        }
      }, 300);
      return;
    }

    // 2. Head navigation click
    if (event.target.closest("[data-go-landing]")) {
      state.currentScreen = "landing";
      saveState();
      renderDynamic();
      document.querySelector("#game-cover")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // 3. Age Selector click
    const ageBtn = event.target.closest("[data-age-group]");
    if (ageBtn) {
      state.selectedAgeGroup = ageBtn.dataset.ageGroup;
      saveState();
      renderDynamic();
      showToast(`Đã chuyển sang cấp độ: ${state.selectedAgeGroup === 'mam_nho' ? 'Mầm Nhỏ' : 'Chiến Binh'}`);
      return;
    }

    // 4. Story click
    if (event.target.closest("[data-story-next-chapter]")) {
      const kitState = state[state.activeKitId];
      kitState.storyChapter += 1;
      // Urgency effect: HP decreases!
      kitState.threatHp = Math.max(10, kitState.threatHp - 10);
      saveState();
      renderDynamic();
      return;
    }

    if (event.target.closest("[data-story-accept-mission]")) {
      state.currentScreen = "minigame";
      updateBana("thinking", "Hãy giúp Bana vượt qua thử thách này để chế tạo KIT nhé!");
      saveState();
      renderDynamic();
      return;
    }

    // 5. Mini Game Items connection click (Tap-to-select support)
    const gameItem = event.target.closest("[data-game-item-id]");
    if (gameItem) {
      const itemId = gameItem.dataset.gameItemId;
      state.selectedGameItemId = itemId;
      const kit = KITS_DATA[state.activeKitId];
      const selected = kit.miniGame.itemsToClassify.find(i => i.itemId === itemId);
      updateBana("thinking", `Bé chọn ${selected.name}. Phù hợp với ô nào đây ta?`);
      document.querySelectorAll("[data-game-item-id]").forEach(el => {
        el.classList.toggle("selected", el.dataset.gameItemId === itemId);
      });
      return;
    }

    const gameTarget = event.target.closest("[data-game-target-id]");
    if (gameTarget) {
      const targetId = gameTarget.dataset.gameTargetId;
      if (!state.selectedGameItemId) {
        updateBana("thinking", "Bé cần chạm chọn một nhân vật/vật phẩm phía trên trước nhé!");
        showToast("Chọn vật phẩm trước!");
        return;
      }

      const kit = KITS_DATA[state.activeKitId];
      const kitState = state[state.activeKitId];
      const item = kit.miniGame.itemsToClassify.find(i => i.itemId === state.selectedGameItemId);

      if (item && item.correctTargetId === targetId) {
        // MATCH CORRECT!
        if (!kitState.matchedItems.includes(item.itemId)) {
          kitState.matchedItems.push(item.itemId);
        }
        state.selectedGameItemId = null;
        
        // Confetti effect
        makeConfetti(12);
        showToast("Chính xác! Bé làm tốt lắm! 🎉");
        
        // Update HP
        kitState.threatHp = Math.min(100, kitState.threatHp + 15);

        // Check if game complete
        if (kitState.matchedItems.length === kit.miniGame.itemsToClassify.length) {
          updateBana("proud", "Bé đã hoàn thành Thử thách 1! Bấm nút bên dưới để vào tiếp Thử thách 2 nhé!");
        } else {
          updateBana("cheer", "Đúng rồi! Tiếp tục nối các hình khác nào.");
        }
        
        saveState();
        renderDynamic();
      } else {
        // MATCH WRONG!
        updateBana("thinking", "Ồ, hình như chưa chính xác lắm. Bé suy nghĩ lại xem nhé!");
        showToast("Thử lại nha bé!");
      }
      return;
    }

    if (event.target.closest("[data-minigame-next-sublevel]")) {
      const kitState = state[state.activeKitId];
      kitState.activeSubGameLevel = 2;
      saveState();
      renderDynamic();
      return;
    }

    const toggleDevice = event.target.closest("[data-toggle-device]");
    if (toggleDevice) {
      const device = toggleDevice.dataset.toggleDevice;
      const kitState = state[state.activeKitId];
      if (!kitState.lightsOffState) {
        kitState.lightsOffState = { tv: true, light: true, fan: true, faucet: true };
      }
      kitState.lightsOffState[device] = !kitState.lightsOffState[device];
      
      const lo = kitState.lightsOffState;
      const totalWaste = (lo.tv ? 80 : 0) + (lo.light ? 40 : 0) + (lo.fan ? 60 : 0) + (lo.faucet ? 20 : 0);
      
      if (totalWaste === 0) {
        kitState.miniGameDone = true;
        updateBana("proud", "Bé thật xuất sắc! Hãy bắt đầu làm bộ KIT thực tế cùng ba mẹ nhé!");
        makeConfetti(24);
      } else {
        updateBana("cheer", "Một thiết bị nữa đã được tắt! Tiếp tục tắt các thiết bị khác nào.");
      }
      saveState();
      renderDynamic();
      return;
    }

    if (event.target.closest("[data-minigame-finish]")) {
      state.currentScreen = "build";
      updateBana("happy", "Đặt điện thoại xuống và cùng ba mẹ dựng KIT thực tế nào!");
      saveState();
      renderDynamic();
      return;
    }

    // 6. Checkpoints in Build Mission click
    const cpBtn = event.target.closest("[data-checkpoint]");
    if (cpBtn) {
      const percent = Number(cpBtn.dataset.checkpoint);
      const kitState = state[state.activeKitId];
      kitState.buildProgress = percent;
      saveState();
      renderDynamic();
      return;
    }

    if (event.target.closest("[data-build-finish]")) {
      state.currentScreen = "family";
      updateBana("happy", "Kỷ niệm của gia đình chính là sức mạnh xanh to lớn nhất!");
      saveState();
      renderDynamic();
      return;
    }

    // 7. Family Quest events
    const recBtn = event.target.closest("#record-audio-btn");
    if (recBtn) {
      toggleAudioRecording();
      return;
    }

    if (event.target.closest("[data-family-finish]")) {
      const kitState = state[state.activeKitId];
      const capsuleVal = document.querySelector("#capsule-text-input")?.value || "";
      kitState.familyQuestMedia.message = capsuleVal;
      kitState.familyQuestDone = true;
      state.currentScreen = "reward";
      updateBana("proud", "Ba mẹ cùng xem tấm bằng khen danh giá của Hiệp sĩ nhí nè!");
      saveState();
      renderDynamic();
      
      // Upload/Sync data to Firebase
      syncToFirebase();
      return;
    }

    // 8. Reward Claim events
    if (event.target.closest("[data-reward-claim]")) {
      const kidName = document.querySelector("#cert-kid-name")?.value || "Hiệp sĩ xanh";
      state.childName = kidName;
      
      const badgeId = state.activeKitId === "kit_green_christmas" ? "badge_green_christmas" : "badge_dreamcatcher";
      if (!state.passportBadges.includes(badgeId)) {
        state.passportBadges.push(badgeId);
        state.seeds += 5; // Reward points
      }
      
      state.currentScreen = "passport";
      updateBana("proud", "Hộ chiếu Sinh Thái đã ghi nhận thành tích của Hiệp sĩ!");
      saveState();
      renderDynamic();
      return;
    }

    // 9. Passport transition
    if (event.target.closest("[data-passport-next-adventure]")) {
      state.currentScreen = "upsell";
      updateBana("thinking", "Vùng đất bí ẩn tiếp theo đang có gì nhỉ?");
      saveState();
      renderDynamic();
      return;
    }

    // 10. Upsell actions
    if (event.target.closest("[data-upsell-choose-other]")) {
      const otherKitId = state.activeKitId === "kit_green_christmas" ? "kit_dreamcatcher" : "kit_green_christmas";
      state.activeKitId = otherKitId;
      state.currentScreen = "story";
      
      // Reset state for new adventure
      state[otherKitId].storyChapter = 0;
      state[otherKitId].buildProgress = 0;
      state[otherKitId].miniGameDone = false;
      state[otherKitId].matchedItems = [];
      state[otherKitId].activeSubGameLevel = 1;
      state[otherKitId].lightsOffState = { tv: true, light: true, fan: true, faucet: true };
      
      saveState();
      renderDynamic();
      return;
    }

    if (event.target.closest("[data-upsell-back-home]")) {
      state.currentScreen = "landing";
      saveState();
      renderDynamic();
      document.querySelector("#game-cover")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Dialogue helpers
    if (event.target.closest("[data-bana-close]")) {
      collapseBanaDialogue();
      return;
    }

    if (event.target.closest("[data-bana-reopen]")) {
      reopenBanaDialogue();
      return;
    }
  });

  // Selector drop-down kit change
  document.addEventListener("change", (event) => {
    if (event.target.id === "kit-select-input") {
      state.activeKitId = event.target.value;
      state.currentScreen = "story";
      
      // Reset state for new adventure
      state[state.activeKitId].storyChapter = 0;
      state[state.activeKitId].buildProgress = 0;
      state[state.activeKitId].miniGameDone = false;
      state[state.activeKitId].matchedItems = [];
      state[state.activeKitId].activeSubGameLevel = 1;
      state[state.activeKitId].lightsOffState = { tv: true, light: true, fan: true, faucet: true };
      
      saveState();
      renderDynamic();
      showToast(`Chuyển sang KIT: ${state.activeKitId === 'kit_green_christmas' ? 'Giáng Sinh Xanh' : 'Dreamcatcher'}`);
    }

    if (event.target.id === "photo-file-input") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const kitState = state[state.activeKitId];
          kitState.familyQuestMedia.photo = e.target.result;
          saveState();
          
          const preview = document.querySelector("#photo-preview-box");
          if (preview) preview.innerHTML = `<img src="${e.target.result}">`;
          showToast("Đã tải ảnh lên! 🖼️");
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Touch/Mouse move on Upsell Scratch card to clear fog
  document.addEventListener("mousemove", handleScratch);
  document.addEventListener("touchmove", handleScratch);

  function handleScratch(event) {
    const fog = document.querySelector("#scratch-fog-overlay");
    if (!fog) return;

    const rect = fog.getBoundingClientRect();
    let x, y;
    if (event.touches) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      fog.style.opacity = "0";
      setTimeout(() => fog.remove(), 600);
    }
  }
}

// Recording Audio logic
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

async function toggleAudioRecording() {
  const btn = document.querySelector("#record-audio-btn");
  const indicator = document.querySelector("#recording-indicator");
  const playback = document.querySelector("#audio-playback");

  if (!btn) return;

  if (!isRecording) {
    // Start recording
    audioChunks = [];
    isRecording = true;
    btn.textContent = "Dừng ghi âm ⏹️";
    if (indicator) indicator.style.display = "block";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const kitState = state[state.activeKitId];
        // Mock save as Base64/ObjectUrl
        kitState.familyQuestMedia.audio = audioUrl;
        saveState();

        if (playback) {
          playback.src = audioUrl;
          playback.style.display = "block";
        }
        showToast("Đã lưu tệp ghi âm! 🎙️");
      };
      mediaRecorder.start();
    } catch (err) {
      console.warn("Media recorder error, falling back to mock recorder:", err);
      // Fallback mockup recorder simulation
      setTimeout(() => {
        if (isRecording) {
          isRecording = false;
          btn.textContent = "Bắt đầu ghi âm";
          if (indicator) indicator.style.display = "none";
          
          const kitState = state[state.activeKitId];
          kitState.familyQuestMedia.audio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Mock file
          saveState();

          if (playback) {
            playback.src = kitState.familyQuestMedia.audio;
            playback.style.display = "block";
          }
          showToast("Đã ghi âm thành công (Giả lập)! 🎙️");
        }
      }, 3000);
    }
  } else {
    // Stop recording
    isRecording = false;
    btn.textContent = "Bắt đầu ghi âm";
    if (indicator) indicator.style.display = "none";

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
}

// Confetti, Sticker & Toast
function makeConfetti(amount = 16) {
  const colors = ["#8fdc8c", "#ffd66d", "#f6a878", "#8bd7e8"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 300}px`);
    piece.style.setProperty("--r", `${Math.random() * 360}deg`);
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1200);
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Trạng thái lưu trữ
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = { ...structuredClone(defaultState), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    return saved;
  } catch {
    return structuredClone(defaultState);
  }
}

// --- THƯ VIỆN BẢN ĐỒ 3D THREE.JS ĐƯỢC BẢO TOÀN ĐỂ TRÁNH LỖI ---
async function initThreeWorld() {
  const canvas = document.querySelector("#world-scene");
  if (!canvas) return;
  THREE = await import("./assets/vendor/three.module.min.js");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 5.1, 9.8);
  camera.lookAt(0, 0, 0);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  clock = new THREE.Clock();
  threeRoot = new THREE.Group();
  scene.add(threeRoot);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9bd18e, 1.65));
  const sun = new THREE.DirectionalLight(0xfff1b8, 2.2);
  sun.position.set(4, 7, 6);
  sun.castShadow = true;
  scene.add(sun);

  createGardenWorld();
  resizeThree();
  window.addEventListener("resize", resizeThree);
  canvas.addEventListener("pointerdown", onThreeClick);
  animateThree();
}

function createGardenWorld() {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(5.8, 6.4, 0.45, 80),
    new THREE.MeshStandardMaterial({ color: 0xf6dc8b, roughness: 0.9 })
  );
  base.position.y = -0.72;
  base.receiveShadow = true;
  threeRoot.add(base);

  const pond = new THREE.Mesh(
    new THREE.CircleGeometry(2.05, 64),
    new THREE.MeshStandardMaterial({ color: 0x88dbe8, roughness: 0.42, transparent: true, opacity: 0.86 })
  );
  pond.rotation.x = -Math.PI / 2;
  pond.position.y = -0.44;
  threeRoot.add(pond);

  centralTree = createCentralTree();
  centralTree.position.set(0, -0.22, 0.15);
  threeRoot.add(centralTree);

  centralGlow = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.035, 10, 48),
    new THREE.MeshStandardMaterial({ color: 0xffd66d, roughness: 0.4, transparent: true, opacity: 0.82 })
  );
  centralGlow.rotation.x = Math.PI / 2;
  centralGlow.position.y = 0.1;
  threeRoot.add(centralGlow);

  worlds.forEach((world, index) => createWorldIsland(world, index));
  createFloatingLeaves();
}

function createWorldIsland(world, index) {
  const angle = (index / worlds.length) * Math.PI * 2 - Math.PI * 0.78;
  const radius = 3.25;
  const group = new THREE.Group();
  group.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 0.1);
  group.userData = { type: "world", id: world.id };

  const island = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.32, 0.48, 18),
    new THREE.MeshStandardMaterial({ color: world.color, roughness: 0.76 })
  );
  island.castShadow = true;
  island.receiveShadow = true;
  group.add(island);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.045, 10, 48),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, transparent: true, opacity: 0.78 })
  );
  rim.position.y = 0.29;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  addLandmark(group, world.id);
  addMiniBanas(group, index);

  threeRoot.add(group);
  worldObjects.set(world.id, group);
}

function addLandmark(group, id) {
  if (id === "recycle") {
    addTreeCluster(group, 0x2f9f5b);
    const bin = createBox(0.32, 0.28, 0.32, 0x2fbf72);
    bin.position.set(0.42, 0.42, 0.46);
    group.add(bin);
  }
  if (id === "water") {
    const stream = new THREE.Mesh(
      new THREE.CircleGeometry(0.84, 48),
      new THREE.MeshStandardMaterial({ color: 0x8ce5dd, roughness: 0.3, transparent: true, opacity: 0.8 })
    );
    stream.rotation.x = -Math.PI / 2;
    stream.position.y = 0.28;
    group.add(stream);
    addTreeCluster(group, 0x4bbf79);
  }
}

function addTreeCluster(group, color) {
  [-0.58, 0.58].forEach((x, index) => {
    const tree = createPine(color, 0.8 + index * 0.12);
    tree.position.set(x, 0.25, -0.44);
    group.add(tree);
  });
}

function addMiniBanas(group, worldIndex) {
  for (let index = 0; index < 2; index += 1) {
    const bana = createMiniBana(index ? 0xffd66d : 0x9ce07a);
    bana.userData.runner = {
      radius: 0.7 + index * 0.18,
      phase: worldIndex * 1.4 + index * Math.PI,
      speed: 0.75 + index * 0.14,
      y: 0.45
    };
    runners.push(bana);
    group.add(bana);
  }
}

function createCentralTree() {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.18, 0.78, 12),
    new THREE.MeshStandardMaterial({ color: 0x9b673f, roughness: 0.75 })
  );
  trunk.position.y = 0.38;
  tree.add(trunk);
  return tree;
}

function createMiniBana(color) {
  const runner = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 18, 14),
    new THREE.MeshStandardMaterial({ color, roughness: 0.62 })
  );
  body.position.y = 0.12;
  runner.add(body);
  return runner;
}

function createPine(color, scale = 1) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05 * scale, 0.07 * scale, 0.32 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x8a5d3c, roughness: 0.8 })
  );
  tree.add(trunk);
  return tree;
}

function createBox(width, height, depth, color) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.66 })
  );
  return box;
}

function createFloatingLeaves() {
  const material = new THREE.MeshStandardMaterial({ color: 0xf3f6cf, roughness: 0.5 });
  for (let index = 0; index < 10; index += 1) {
    const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.04 + Math.random() * 0.04), material);
    leaf.position.set((Math.random() - 0.5) * 10, Math.random() * 3.2 + 0.6, (Math.random() - 0.5) * 7);
    threeRoot.add(leaf);
  }
}

function onThreeClick(event) {
  // Mock handler
}

function resizeThree() {
  const canvas = renderer.domElement;
  const { width, height } = canvas.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animateThree() {
  requestAnimationFrame(animateThree);
  renderer.render(scene, camera);
}

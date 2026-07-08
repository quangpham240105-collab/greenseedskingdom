// --- HỆ THỐNG DỮ LIỆU TĨNH WEBSITE (DATA MODULE) ---

export const onboardingLines = [
  "Chào bé, mình là Bana!",
  "Vương quốc Green Seeds đang bị mất đi sức sống xanh.",
  "Mỗi nhiệm vụ bé hoàn thành sẽ giúp Bana mang ánh sáng và sự sống về cho vương quốc đó!"
];

export const parentCards = [
  ["Học qua hành động", "Mỗi nhiệm vụ chỉ một thao tác rõ ràng, phù hợp trẻ 5-12 tuổi."],
  ["Nội dung tích cực", "Không phạt nặng, không gây sợ. Bé được khích lệ để thử lại."],
  ["Chơi cùng gia đình", "Sau nhiệm vụ số, bé có gợi ý nhỏ để làm cùng ba mẹ."],
  ["An toàn và nhẹ", "Không quảng cáo gây nhiễu, trạng thái lưu tạm bằng trình duyệt."]
];

export const dailyQuests = [
  "Hôm nay bé nhớ tắt đèn khi ra khỏi phòng nhé!",
  "Hôm nay bé thử dùng bình nước cá nhân nha!",
  "Hôm nay bé giúp ba mẹ phân loại một món rác nhé!",
  "Hôm nay bé tưới cây vừa đủ nước thôi nha!",
  "Hôm nay bé quan sát một chiếc lá thật kỹ nhé!"
];

export const stickerCatalog = [
  { name: "Người Bạn Tái Chế", praise: "Bé đã phân loại rác thật giỏi và giữ cho Vườn Tái Chế luôn xanh sạch." },
  { name: "Người Giữ Dòng Nước", praise: "Bé đã khóa chặt vòi nước rò rỉ và bảo tồn dòng suối trong mát mát lành." },
  { name: "Nhà Khám Phá Năng Lượng", praise: "Bé đã tắt các thiết bị điện lãng phí để đồi gió nạp đầy năng lượng sạch." },
  { name: "Người Bảo Vệ Muông Thú", praise: "Bé đã dịu dàng che chở các loài động vật hoang dã về tổ ấm yên bình." },
  { name: "Người Gieo Mầm Ánh Sáng", praise: "Bé gieo những việc làm xanh tốt mỗi ngày trong cuộc sống thực tế." }
];

export const characterVideos = {
  happy: "./assets/characters/bana-nho.mp4",
  thinking: "./assets/characters/bana-trung.mp4",
  cheer: "./assets/characters/bana-lon.mp4",
  wow: "./assets/characters/bana-trung.mp4",
  proud: "./assets/characters/bana-lon.mp4"
};

// Cấu trúc 3D Map kế thừa để tránh lỗi bản đồ
export const worlds = [
  {
    id: "recycle",
    title: "Vườn Tái Chế",
    province: "Lâm Đồng",
    icon: "♻",
    scene: "./assets/scenes/recycle.svg",
    color: 0x68c96b
  },
  {
    id: "water",
    title: "Suối Nước Sạch",
    province: "Đồng Tháp",
    icon: "💧",
    scene: "./assets/scenes/ocean.svg",
    color: 0x79d7c5
  },
  {
    id: "energy",
    title: "Đồi Năng Lượng",
    province: "Ninh Thuận",
    icon: "☀",
    scene: "./assets/scenes/energy.svg",
    color: 0xffd66d
  },
  {
    id: "friends",
    title: "Nhà Của Muông Thú",
    province: "Khánh Hòa",
    icon: "🐿️",
    scene: "./assets/scenes/garden.svg",
    color: 0x68c5f0
  }
];

export const worldMood = {
  recycle: { tone: "Rừng thông thức dậy", critters: ["🌼", "🦋", "🌱"] },
  water: { tone: "Dòng suối lấp lánh", critters: ["💧", "🐟", "🪷"] },
  energy: { tone: "Đồi nắng ấm", critters: ["☀️", "✨", "🌻"] },
  friends: { tone: "Ngôi nhà của bạn nhỏ", critters: ["🐦", "🐿️", "🦋"] }
};

// --- DỮ LIỆU ĐÃ MODULE HÓA CHO CÁC BỘ KIT VÀ HÀNH TRÌNH CẢM XÚC ---
export const KITS_DATA = {
  kit_green_christmas: {
    kitId: "kit_green_christmas",
    kitName: "Giáng Sinh Xanh 🎄",
    materialsUsed: ["Sợi chuối tự nhiên", "Bã cà phê ép"],
    suitableAge: "Mầm Nhỏ & Chiến Binh (5-12 tuổi)",
    targetCharacter: "Bạn Thông Piney 🌲",
    mainThreat: "Biến đổi khí hậu & Khí Carbonox hủy hoại rừng thông Lâm Đồng",
    physicalOutput: "Tự tay đan Chiếc Khiên Bảo Vệ Sinh Học từ sợi chuối tự nhiên",
    coverImg: "./assets/scenes/giang-sinh-xanh-kit.jpg",
    
    // 3 CẢNH CINEMATIC STORY
    storyChapters: [
      {
        chapterId: 1,
        title: "Ký ức rừng xanh tươi",
        sceneImg: "./assets/scenes/mam-xanh-story.jpg",
        narration: {
          mam_nho: "Bé ơi, rừng thông quê mình ở Lâm Đồng trước đây luôn xanh mát, gió thổi vi vu và tràn ngập tiếng lá thông reo vui đón chào ánh nắng ấm áp mỗi sớm mai...",
          chien_binh_xanh: "Rừng thông nguyên sinh Lâm Đồng vốn đóng vai trò điều hòa khí hậu quan trọng, hấp thụ CO2 và cung cấp sinh cảnh sống xanh tươi mát cho hàng vạn muông thú."
        }
      },
      {
        chapterId: 2,
        title: "Carbonox xâm chiếm",
        sceneImg: "./assets/scenes/giang-sinh-xanh-kit.jpg",
        narration: {
          mam_nho: "Nhưng giờ đây, quái vật khói Carbonox đen tối đang tràn về! Nó bao trùm lấy rừng làm bạn Thông Piney héo khô, khó thở và yếu dần từng ngày...",
          chien_binh_xanh: "Nhiệt độ nóng lên toàn cầu cùng lượng khí Carbonox tích tụ quá mức ngăn chặn khả năng trao đổi chất, làm suy kiệt đề kháng của rừng thông và kích hoạt sâu bệnh tấn công."
        }
      },
      {
        chapterId: 3,
        title: "Bana khẩn cầu cứu trợ",
        sceneImg: "./assets/scenes/seed-character.png",
        narration: {
          mam_nho: "Piney sắp không chịu nổi nữa rồi! Bana khẩn cầu bé hãy dùng đôi tay của mình chế tạo Chiếc Khiên Bảo Vệ Xanh từ xơ chuối dẻo dai để ngăn chặn khí độc cứu lấy Piney ngay nhé!",
          chien_binh_xanh: "Bana kêu gọi Chiến Binh Xanh thiết lập lá chắn sinh học từ xơ chuối tự nhiên và đế bã cà phê nén hữu cơ nhằm lọc sạch khí độc, hồi sinh vùng đất thiêng!"
        }
      }
    ],
    
    // MINI-GAME HƯỚNG HÀNH ĐỘNG
    miniGame: {
      gameType: "drag_drop",
      missionPrompt: {
        mam_nho: "Phân loại vật liệu xanh bảo vệ rừng thông!",
        chien_binh_xanh: "Phân bổ nhóm chất thải hữu cơ để cắt giảm tối đa khí carbon phát thải."
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

    // 3 MỐC BUILD MISSION VÀ ĐỐI THOẠI BANA
    buildMission: {
      checkpoints: [
        {
          percentage: 0,
          backgroundState: "forest-dark",
          guideText: {
            mam_nho: "Bé soạn các sợi chuối dẻo dai và bã cà phê ra bàn nhé! Đặt điện thoại xuống để chuẩn bị cứu Piney thôi!",
            chien_binh_xanh: "Phân loại nguyên vật liệu thực tế: Sợi xơ chuối dẻo và đế bã cà phê nén sinh học."
          },
          banaDialogue: "Bana: Rừng thông đang u ám và lạnh lẽo lắm, chúng mình bắt tay đan những nút thắt đầu tiên nào bé ơi!"
        },
        {
          percentage: 50,
          backgroundState: "forest-dim",
          guideText: {
            mam_nho: "Tuyệt quá! Cùng đan chéo xen kẽ các sợi chuối để tạo chiếc khiên bảo vệ dày dặn hơn nhé.",
            chien_binh_xanh: "Đan xen các sợi xơ chuối tạo thành màng liên kết hướng tâm trên khung đế cà phê sinh học."
          },
          banaDialogue: "Bana: Tuyệt vời! Chiếc khiên dần hoàn thiện và những tia sáng ấm áp đầu tiên đã chiếu rọi xuống rừng thông rồi!"
        },
        {
          percentage: 100,
          backgroundState: "forest-revived",
          guideText: {
            mam_nho: "Hoàn thiện chiếc khiên và gắn lên cây! Bé cùng ba mẹ ngắm nhìn rừng thông hồi sinh xanh mát rực rỡ kìa!",
            chien_binh_xanh: "Cố định mối đan cuối cùng. Bộ thiết bị bảo vệ lá chắn sinh quyển rừng thông đã chính thức hoạt động."
          },
          banaDialogue: "Bana: Ôi ha! Rừng thông đã hồi sinh xanh mướt rực rỡ rồi! Sức mạnh đôi tay của bé thật phi thường!"
        }
      ]
    },

    // FAMILY QUEST 5 BƯỚC
    familyQuest: {
      questTitle: "Lời Hứa Xanh Đến 5 Năm Sau",
      timeCapsuleDurationYears: 5,
      steps: [
        {
          stepId: 1,
          title: "Kể một ký ức ấm áp",
          desc: "Ba mẹ cùng bé ghi âm hoặc viết lại một kỷ niệm vui vẻ của gia đình khi đi du lịch hoặc chăm sóc cây cối nhé.",
          type: "audio"
        },
        {
          stepId: 2,
          title: "Khoe tác phẩm xơ chuối",
          desc: "Chụp bức ảnh chiếc khiên bảo vệ xơ chuối bé và ba mẹ vừa đan xong để lưu giữ hành trình.",
          type: "photo"
        },
        {
          stepId: 3,
          title: "Lời hứa xanh của bé",
          desc: "Bé muốn cam kết làm hành động nhỏ gì (như tắt điện, nhặt rác) để bảo vệ Trái Đất thân yêu?",
          type: "promise_text"
        },
        {
          stepId: 4,
          title: "Bức thư gửi tương lai",
          desc: "Viết lời nhắn nhủ/ước mơ gửi tới gia đình và Trái Đất 5 năm sau để cất vào hộp thời gian khóa kín.",
          type: "capsule_text"
        },
        {
          stepId: 5,
          title: "Khóa hộp ký ức",
          desc: "Sẵn sàng đồng bộ mọi kỷ niệm quý giá của gia đình lên mây lưu trữ và nhận chứng nhận vinh quang.",
          type: "finish"
        }
      ]
    }
  },
  kit_dreamcatcher: {
    kitId: "kit_dreamcatcher",
    kitName: "Dreamcatcher Lưới Mơ 🌌",
    materialsUsed: ["Vòng tre tự nhiên", "Sợi chuối nhuộm màu hữu cơ"],
    suitableAge: "Mầm Nhỏ & Chiến Binh (5-12 tuổi)",
    targetCharacter: "Bé Chuối Tiêu 🍌",
    mainThreat: "Ác mộng đêm tối bủa vây phòng ngủ làm Chuối Tiêu mất ngủ",
    physicalOutput: "Dựng chiếc Lưới Bắt Giấc Mơ bằng sợi chuối nhuộm hữu cơ",
    coverImg: "./assets/scenes/dreamcatcher-kit.jpg",
    
    // 3 CẢNH CINEMATIC STORY
    storyChapters: [
      {
        chapterId: 1,
        title: "Giấc mơ êm đềm",
        sceneImg: "./assets/scenes/journey-timeline.jpg",
        narration: {
          mam_nho: "Mỗi tối, phòng ngủ của Bé Chuối Tiêu luôn ngập tràn ánh sao, tiếng gió xào xạc và những giấc mơ ngọt ngào, ấm êm ru bé vào giấc ngủ sâu...",
          chien_binh_xanh: "Môi trường phòng ngủ thư giãn, bình yên đóng vai trò quyết định giúp trẻ em duy trì chu kỳ ngủ sâu để phát triển trí não toàn diện."
        }
      },
      {
        chapterId: 2,
        title: "Ác mộng xâm chiếm",
        sceneImg: "./assets/scenes/dreamcatcher-kit.jpg",
        narration: {
          mam_nho: "Nhưng tối nay, những đám mây Ác Mộng xám xịt, quỷ quyệt kéo tới, mang theo bóng tối đáng sợ làm Chuối Tiêu giật mình, hoảng sợ khóc vang!",
          chien_binh_xanh: "Áp lực âm thanh ồn ào và ảo ảnh bóng tối làm gia tăng hormone lo âu, cản trở sự phục hồi của tế bào thần kinh khi về đêm."
        }
      },
      {
        chapterId: 3,
        title: "Bana khẩn cầu cứu trợ",
        sceneImg: "./assets/scenes/parents-portal.jpg",
        narration: {
          mam_nho: "Chuối Tiêu đang run rẩy sợ hãi! Bé ơi, hãy dùng đôi bàn tay khéo léo đan một chiếc Lưới Mơ thần kỳ từ tre và sợi chuối để xua tan ác mộng giúp bạn nhé!",
          chien_binh_xanh: "Bana khẩn thiết kêu gọi bé kết hợp vòng tre và sợi chuối nhuộm hữu cơ để chế tạo Dreamcatcher, thiết lập màng lọc năng lượng bình an cho Chuối Tiêu."
        }
      }
    ],
    
    // MINI-GAME HƯỚNG HÀNH ĐỘNG
    miniGame: {
      gameType: "matching",
      missionPrompt: {
        mam_nho: "Giúp các Hiệp sĩ xanh kết nối hành động đúng nhé!",
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

    // 3 MỐC BUILD MISSION VÀ ĐỐI THOẠI BANA
    buildMission: {
      checkpoints: [
        {
          percentage: 0,
          backgroundState: "bedroom-dark",
          guideText: {
            mam_nho: "Định vị vòng tre và thắt những nút buộc đầu tiên bằng sợi chuối. Đặt máy xuống cùng ba mẹ làm thôi bé!",
            chien_binh_xanh: "Cố định điểm bắt đầu của sợi chuối tự nhiên dẻo dai trên khung vòng tre tròn."
          },
          banaDialogue: "Bana: Phòng ngủ của Chuối Tiêu tối tăm quá, chúng mình bắt đầu đan nút đầu tiên để xua ác mộng nhé!"
        },
        {
          percentage: 50,
          backgroundState: "bedroom-dim",
          guideText: {
            mam_nho: "Cực khéo léo đan lưới mạng nhện đồng tâm hướng vào giữa, đính thêm những hạt gỗ nhỏ bình yên.",
            chien_binh_xanh: "Thực hiện đan lưới mạng nhện lọc ác mộng, cài hạt gỗ mộc mạc làm nhân bảo vệ."
          },
          banaDialogue: "Bana: Đẹp lắm! Những ngôi sao ước mơ lấp lánh đang quay trở lại thắp sáng căn phòng rồi!"
        },
        {
          percentage: 100,
          backgroundState: "bedroom-peaceful",
          guideText: {
            mam_nho: "Buộc thêm các đuôi lông vũ mềm mại dưới vòng tre. Chiếc Lưới Mơ đã sẵn sàng thắp sáng giấc ngủ!",
            chien_binh_xanh: "Hoàn thiện đính lông vũ tự nhiên. Thiết lập rào chắn giấc ngủ lành Dreamcatcher hoàn tất."
          },
          banaDialogue: "Bana: Kỳ diệu chưa! Phòng ngủ đã ngập tràn ánh sáng yên bình và Chuối Tiêu đã ngủ rất ngon rồi!"
        }
      ]
    },

    // FAMILY QUEST 5 BƯỚC
    familyQuest: {
      questTitle: "Hộp Thư Âm Thanh Ước Mơ",
      timeCapsuleDurationYears: 1,
      steps: [
        {
          stepId: 1,
          title: "Kể một ước mơ nhỏ",
          desc: "Ba mẹ hỏi bé muốn lớn lên làm nghề gì nhất, và cùng ghi lại tiếng nói ngây ngô của con làm kỷ niệm nhé.",
          type: "audio"
        },
        {
          stepId: 2,
          title: "Tải ảnh lưới mơ của bé",
          desc: "Chụp một bức ảnh tác phẩm Dreamcatcher xinh xắn bé và ba mẹ cùng treo đầu giường ngủ.",
          type: "photo"
        },
        {
          stepId: 3,
          title: "Lời nhắn gửi yêu thương",
          desc: "Ba mẹ gửi lời chúc ngọt ngào, khích lệ bé thực hiện ước mơ nhỏ bé của mình.",
          type: "promise_text"
        },
        {
          stepId: 4,
          title: "Thư gửi tương lai 1 năm sau",
          desc: "Viết lời cam kết thực hiện 1 việc tốt lành trong phòng ngủ (dọn đồ chơi gọn gàng, tự giác đi ngủ) gửi tương lai.",
          type: "capsule_text"
        },
        {
          stepId: 5,
          title: "Khóa hộp ký ức",
          desc: "Đóng gói hộp thời gian âm thanh ước mơ để bảo tồn trong Eco Passport.",
          type: "finish"
        }
      ]
    }
  }
};

export const defaultState = {
  currentScreen: "landing",
  activeKitId: "kit_green_christmas",
  selectedAgeGroup: "mam_nho",
  childName: "",
  seeds: 10,
  passportBadges: [],
  selectedGameItemId: null,

  kit_green_christmas: {
    storyChapter: 0,
    threatHp: 30,
    miniGameDone: false,
    matchedItems: [],
    activeSubGameLevel: 1,
    lightsOffState: { tv: true, light: true, fan: true, faucet: true },
    bugsSquishedCount: 0,
    squishedBugIds: [],
    carbonAnswers: { transport: null, bag: null, plant: null },
    buildProgress: 0,
    familyQuestDone: false,
    familyQuestStep: 0, // step 0 to 4
    familyQuestMedia: { audio: null, photo: null, message: "", promise: "", capsule: "" },
    rewardClaimed: false
  },

  kit_dreamcatcher: {
    storyChapter: 0,
    threatHp: 40,
    miniGameDone: false,
    matchedItems: [],
    activeSubGameLevel: 1,
    lightsOffState: { tv: true, light: true, fan: true, faucet: true },
    nightmaresClearedCount: 0,
    clearedNightmareIds: [],
    soothingSoundsState: { rain: false, birds: false, horn: true, hammer: true },
    buildProgress: 0,
    familyQuestDone: false,
    familyQuestStep: 0,
    familyQuestMedia: { audio: null, photo: null, message: "", promise: "", capsule: "" },
    rewardClaimed: false
  },

  // State kế thừa cũ để bảo toàn bản đồ 3D
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

export const sortingBins = [
  { id: "recycle", title: "Tái chế", icon: "♻", helper: "Chai, lon, giấy sạch" },
  { id: "organic", title: "Hữu cơ", icon: "🍃", helper: "Lá, vỏ trái cây" },
  { id: "other", title: "Còn lại", icon: "🧺", helper: "Món khó tái chế" }
];

export const trashItems = [
  { id: "bottle", name: "Chai nhựa", icon: "🧴", bin: "recycle" },
  { id: "paper", name: "Giấy sạch", icon: "📄", bin: "recycle" },
  { id: "can", name: "Lon nhỏ", icon: "🥫", bin: "recycle" },
  { id: "leaf", name: "Lá khô", icon: "🍂", bin: "organic" },
  { id: "banana", name: "Vỏ chuối", icon: "🍌", bin: "organic" },
  { id: "foam", name: "Hộp bẩn", icon: "📦", bin: "other" }
];

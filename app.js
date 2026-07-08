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

import { onboardingLines, parentCards, dailyQuests, stickerCatalog, characterVideos, worlds, worldMood, KITS_DATA, defaultState, sortingBins, trashItems } from './data.js';

// Khởi tạo các biến toàn cục và tải trạng thái
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

const Components = { GameCover, BanaDialogue };

// Khởi chạy hệ thống
renderApp();
bindEvents();
initThreeWorld().catch((error) => {
  console.warn("Không thể khởi tạo bản đồ 3D:", error);
});
renderDynamic();

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
  const chapterIdx = kitState.storyChapter;
  const chapter = kit.storyChapters[chapterIdx];
  
  // Use fallback if the specific kit image doesn't exist
  const finalStoryImg = "./assets/scenes/mam-xanh-story.jpg";

  return `
    <div class="story-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"} animate-fade-in">
      <div class="story-card cinematic-story-card">
        <div class="story-header">
          <div class="cinematic-progress">
            ${kit.storyChapters.map((ch, idx) => `
              <div class="progress-step ${idx <= chapterIdx ? 'active' : ''} ${idx < chapterIdx ? 'completed' : ''}">
                <span class="step-num">${idx + 1}</span>
                <span class="step-title-text">${ch.title}</span>
              </div>
            `).join('<div class="progress-line"></div>')}
          </div>
        </div>
        
        <div class="story-body cinematic-body">
          <div class="cinematic-visual">
            <img src="${finalStoryImg}" alt="${chapter.title}" class="story-scene-img" />
            <div class="character-overlay-video">
              <video autoplay loop muted playsinline src="${characterVideos.thinking}"></video>
            </div>
          </div>
          <div class="story-narration">
            <div class="narration-bubble">
              <span class="bana-tag">🌱 Bana:</span>
              <p class="story-text-bubble">"${chapter.narration[age]}"</p>
            </div>
            <div class="threat-status-compact">
              <span class="threat-label">⚠️ Nguy cơ xâm lấn:</span>
              <div class="health-bar-container-compact">
                <div class="health-bar-fill-compact" style="width: ${kitState.threatHp}%"></div>
              </div>
              <span class="health-bar-num-compact">${kitState.threatHp}%</span>
            </div>
          </div>
        </div>
        
        <div class="story-controls">
          ${chapterIdx < kit.storyChapters.length - 1 ? `
            <button class="primary-action pulse" type="button" data-story-next-chapter>
              Tiếp tục hành trình →
            </button>
          ` : `
            <button class="primary-action pulse emergency-pulse" type="button" data-story-accept-mission>
              Nhận Nhiệm Vụ Giải Cứu! ⚔️
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
    if (state.activeKitId === "kit_green_christmas") {
      return renderSavePineyBugsGame();
    } else {
      return renderDefeatNightmaresGame();
    }
  }

  if (subLevel === 3) {
    if (state.activeKitId === "kit_green_christmas") {
      return renderCarbonFootprintGame();
    } else {
      return renderSoothingSoundsGame();
    }
  }

  const isMatchedAll = kitState.matchedItems.length === kit.miniGame.itemsToClassify.length;

  return `
    <div class="minigame-screen-shell ${state.activeKitId === "kit_green_christmas" ? "classification-game" : "matching-game"} region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"} animate-fade-in">
      <div class="game-instructions">
        <p class="kicker">Thử thách 1: Hiểu về vật liệu</p>
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
          Vào Thử thách 2: ${state.activeKitId === "kit_green_christmas" ? "Bảo vệ thông non 🐛" : "Xua đuổi ác mộng ☁️"}
        </button>
      </div>
    </div>
  `;
}

function renderSavePineyBugsGame() {
  const kitState = state.kit_green_christmas;
  const squished = kitState.squishedBugIds || [];
  const isWon = squished.length >= 5;

  const bugs = [
    { id: "bug_1", type: "beetle", icon: "🐛", top: "20%", left: "25%", label: "Sâu đục vỏ" },
    { id: "bug_2", type: "beetle", icon: "🐛", top: "45%", left: "70%", label: "Bọ thông hại" },
    { id: "bug_3", type: "beetle", icon: "🐛", top: "65%", left: "15%", label: "Mọt đục gỗ" },
    { id: "bug_4", type: "beetle", icon: "🐛", top: "35%", left: "45%", label: "Sâu ăn lá" },
    { id: "bug_5", type: "beetle", icon: "🐛", top: "75%", left: "60%", label: "Bọ vỏ thông" },
    { id: "lady_1", type: "ladybug", icon: "🐞", top: "15%", left: "65%", label: "Bọ rùa đỏ" },
    { id: "lady_2", type: "ladybug", icon: "🐞", top: "55%", left: "40%", label: "Bọ rùa vàng" }
  ];

  return `
    <div class="minigame-screen-shell save-piney-bugs-game region-recycle animate-fade-in">
      <div class="game-instructions">
        <p class="kicker">Thử thách 2: Bảo vệ thông non</p>
        <h2>Tiêu diệt sâu đục thân cứu Piney!</h2>
        <p class="help-text">Nhấp vào 5 chú sâu hại màu xanh đang bò phá hoại cây thông. Hãy chừa lại các bạn bọ rùa đỏ 🐞 có ích nhé!</p>
      </div>

      <div class="pine-bark-container">
        <div class="pine-tree-trunk">
          ${bugs.map(bug => {
            const isSquished = squished.includes(bug.id);
            return `
              <button class="bug-entity ${bug.type} ${isSquished ? 'squished' : ''}" 
                type="button" 
                style="top: ${bug.top}; left: ${bug.left};" 
                data-bug-id="${bug.id}"
                data-bug-type="${bug.type}"
                ${isSquished ? 'disabled' : ''}>
                <span class="bug-icon">${isSquished ? '💥' : bug.icon}</span>
                <span class="bug-label">${bug.label}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <div class="game-progress-bar">
        <span class="progress-label">🐛 Sâu gỗ đã diệt: ${squished.length} / 5</span>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: ${(squished.length / 5) * 100}%"></div>
        </div>
      </div>

      <div class="game-feedback" id="game-feedback-box">
        <video autoplay loop muted playsinline src="${characterVideos.happy}" class="feedback-avatar"></video>
        <p class="feedback-text" id="game-feedback-text">
          ${isWon ? 'Bé quá giỏi! Thân thông của Piney đã sạch bóng sâu bệnh rồi!' : 'Bana đang chờ bé bắt hết sâu đục thân cây đấy!'}
        </p>
      </div>

      <div class="game-controls" style="display: ${isWon ? 'block' : 'none'}">
        <button class="primary-action pulse" type="button" data-minigame-goto-level3>
          Vào Thử thách 3: Giảm Dấu chân Carbon 👣
        </button>
      </div>
    </div>
  `;
}

function renderCarbonFootprintGame() {
  const kitState = state.kit_green_christmas;
  const answers = kitState.carbonAnswers || { transport: null, bag: null, plant: null };
  
  const scenarios = [
    {
      id: "transport",
      title: "1. Đi học xanh sạch",
      question: "Bé chọn phương tiện nào để đến trường giảm tối đa khói bụi?",
      options: [
        { key: "bike", label: "Đi xe đạp/Đi bộ", icon: "🚲", correct: true, feedback: "Tuyệt vời! Xe đạp không thải khói carbon!" },
        { key: "car", label: "Đi ô tô riêng", icon: "🚗", correct: false, feedback: "Ô tô thải nhiều khí Carbonox gây nóng Trái Đất." }
      ]
    },
    {
      id: "bag",
      title: "2. Mua sắm thân thiện",
      question: "Để đựng rau quả mua cùng mẹ, bé chọn loại túi nào?",
      options: [
        { key: "plastic", label: "Túi nilon dùng 1 lần", icon: "🛍️", correct: false, feedback: "Túi nilon mất hàng trăm năm mới phân hủy được." },
        { key: "canvas", label: "Túi vải tái sử dụng", icon: "👜", correct: true, feedback: "Rất tốt! Túi vải bền và bảo vệ môi trường!" }
      ]
    },
    {
      id: "plant",
      title: "3. Bảo vệ mầm xanh",
      question: "Gặp cây xanh ngoài vườn, bé nên làm gì để che chở cây?",
      options: [
        { key: "water", label: "Tưới nước, chăm cây", icon: "🪴", correct: true, feedback: "Đúng rồi! Cây xanh hấp thụ Carbon, tạo Oxy mát lành!" },
        { key: "break", label: "Bẻ cành hái lá", icon: "🌿", correct: false, feedback: "Làm tổn thương cây xanh sẽ khiến khí Carbonox tăng lên." }
      ]
    }
  ];

  let correctCount = 0;
  if (answers.transport === "bike") correctCount++;
  if (answers.bag === "canvas") correctCount++;
  if (answers.plant === "water") correctCount++;

  const isWon = correctCount === 3;
  const carbonPercentage = 90 - (correctCount * 30); // 90%, 60%, 30%, 0%

  return `
    <div class="minigame-screen-shell carbon-footprint-game region-recycle animate-fade-in">
      <div class="game-instructions">
        <p class="kicker">Thử thách 3: Lối sống giảm carbon</p>
        <h2>Kéo chỉ số Carbonox xuống vùng an toàn!</h2>
        <p class="help-text">Hãy chọn các hành động xanh đúng đắn để dập tắt lượng khí nhà kính độc hại nhé.</p>
      </div>

      <div class="carbon-meter-box ${isWon ? 'safe' : ''}">
        <span class="carbon-meter-label">👣 Chỉ số Dấu chân Carbon: ${carbonPercentage}%</span>
        <div class="carbon-meter-wrap">
          <div class="carbon-meter-fill" style="width: ${carbonPercentage}%"></div>
        </div>
        <p class="carbon-status-text">${isWon ? '🌿 Dấu chân Carbon cực kỳ thấp! Rừng thông đã hoàn toàn an toàn!' : '⚠️ Chỉ số Carbon quá cao, hãy chọn lối sống xanh để hạ chỉ số!'}</p>
      </div>

      <div class="scenarios-list">
        ${scenarios.map(sc => {
          const selectedKey = answers[sc.id];
          return `
            <div class="scenario-card ${selectedKey ? 'answered' : ''}">
              <h3>${sc.title}</h3>
              <p class="scenario-question">${sc.question}</p>
              <div class="scenario-options">
                ${sc.options.map(opt => {
                  const isSelected = selectedKey === opt.key;
                  const isCorrect = opt.correct;
                  let btnClass = "";
                  if (isSelected) {
                    btnClass = isCorrect ? "correct" : "incorrect";
                  }
                  return `
                    <button class="option-btn ${btnClass} ${selectedKey && !isSelected ? 'disabled' : ''}"
                      type="button"
                      data-carbon-sc-id="${sc.id}"
                      data-carbon-opt-key="${opt.key}"
                      ${selectedKey ? 'disabled' : ''}>
                      <span class="opt-icon">${opt.icon}</span>
                      <span class="opt-label">${opt.label}</span>
                    </button>
                  `;
                }).join("")}
              </div>
              ${selectedKey ? `
                <div class="scenario-feedback ${sc.options.find(o => o.key === selectedKey).correct ? 'correct' : 'incorrect'}">
                  ${sc.options.find(o => o.key === selectedKey).feedback}
                </div>
              ` : ''}
            </div>
          `;
        }).join("")}
      </div>

      <div class="game-feedback" id="game-feedback-box">
        <video autoplay loop muted playsinline src="${characterVideos.happy}" class="feedback-avatar"></video>
        <p class="feedback-text" id="game-feedback-text">
          ${isWon ? 'Bé thật tuyệt vời! Lối sống xanh của bé giúp bảo vệ Trái Đất thân yêu!' : 'Bana đang chờ bé hoàn thành cả 3 tình huống sống xanh!'}
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

function renderDefeatNightmaresGame() {
  const kitState = state.kit_dreamcatcher;
  const cleared = kitState.clearedNightmareIds || [];
  const isWon = cleared.length >= 5;

  const entities = [
    { id: "night_1", type: "nightmare", icon: "☁️😈", top: "25%", left: "15%", label: "Quái vật bóng tối" },
    { id: "night_2", type: "nightmare", icon: "☁️😈", top: "45%", left: "75%", label: "Cơn mơ sợ hãi" },
    { id: "night_3", type: "nightmare", icon: "☁️😈", top: "65%", left: "20%", label: "Tiếng động lạ" },
    { id: "night_4", type: "nightmare", icon: "☁️😈", top: "30%", left: "48%", label: "Ảo ảnh bóng đen" },
    { id: "night_5", type: "nightmare", icon: "☁️😈", top: "70%", left: "58%", label: "Ác mộng mất ngủ" },
    { id: "star_1", type: "star", icon: "🌟", top: "15%", left: "75%", label: "Sao ước mơ" },
    { id: "star_2", type: "star", icon: "🌟", top: "55%", left: "40%", label: "Sao hy vọng" }
  ];

  return `
    <div class="minigame-screen-shell defeat-nightmares-game region-friends animate-fade-in">
      <div class="game-instructions">
        <p class="kicker">Thử thách 2: Xua tan ác mộng</p>
        <h2>Đập tan Ác Mộng bảo vệ Bé Chuối Tiêu!</h2>
        <p class="help-text">Chạm vào 5 đám mây ác mộng ☁️😈 để xua tan bóng tối sợ hãi. Đừng làm vỡ những ngôi sao giấc mơ 🌟 nhé!</p>
      </div>

      <div class="bedroom-night-scene">
        <div class="bedroom-window"></div>
        <div class="dreamcatcher-shadow"></div>
        <div class="entities-overlay">
          ${entities.map(ent => {
            const isCleared = cleared.includes(ent.id);
            return `
              <button class="dream-entity ${ent.type} ${isCleared ? 'cleared' : ''}" 
                type="button" 
                style="top: ${ent.top}; left: ${ent.left};" 
                data-nightmare-id="${ent.id}"
                data-entity-type="${ent.type}"
                ${isCleared ? 'disabled' : ''}>
                <span class="entity-icon">${isCleared ? '✨' : ent.icon}</span>
                <span class="entity-label">${ent.label}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <div class="game-progress-bar">
        <span class="progress-label">🌟 Ác mộng đã xua tan: ${cleared.length} / 5</span>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: ${(cleared.length / 5) * 100}%;"></div>
        </div>
      </div>

      <div class="game-feedback" id="game-feedback-box">
        <video autoplay loop muted playsinline src="${characterVideos.happy}" class="feedback-avatar"></video>
        <p class="feedback-text" id="game-feedback-text">
          ${isWon ? 'Bé Chuối Tiêu đã có một giấc ngủ an yên ấm áp rồi!' : 'Bana đang chờ bé giúp xua tan bóng tối phòng ngủ!'}
        </p>
      </div>

      <div class="game-controls" style="display: ${isWon ? 'block' : 'none'}">
        <button class="primary-action pulse" type="button" data-minigame-goto-level3>
          Vào Thử thách 3: Hòa âm Giấc ngủ 🎵
        </button>
      </div>
    </div>
  `;
}

function renderSoothingSoundsGame() {
  const kitState = state.kit_dreamcatcher;
  const s = kitState.soothingSoundsState || { rain: false, birds: false, horn: true, hammer: true };

  const rainCorrect = s.rain === true;
  const birdsCorrect = s.birds === true;
  const hornCorrect = s.horn === false;
  const hammerCorrect = s.hammer === false;

  let harmony = 0;
  if (rainCorrect) harmony += 25;
  if (birdsCorrect) harmony += 25;
  if (hornCorrect) harmony += 25;
  if (hammerCorrect) harmony += 25;

  const isWon = harmony === 100;

  const sounds = [
    { id: "rain", label: "Tiếng mưa rơi dịu nhẹ", icon: "🌧️", type: "soothing", active: s.rain, note: "Thư giãn nhè nhẹ" },
    { id: "birds", label: "Tiếng chim hót líu lo", icon: "🐦", type: "soothing", active: s.birds, note: "Bình yên vườn xanh" },
    { id: "horn", label: "Tiếng còi xe ồn ào", icon: "🔊", type: "noise", active: s.horn, note: "Gây giật mình" },
    { id: "hammer", label: "Tiếng búa công trường", icon: "🔨", type: "noise", active: s.hammer, note: "Gây đau đầu" }
  ];

  return `
    <div class="minigame-screen-shell soothing-sounds-game region-friends animate-fade-in">
      <div class="game-instructions">
        <p class="kicker">Thử thách 3: Bản giao hương bình yên</p>
        <h2>Hòa âm Giấc ngủ cho Chuối Tiêu!</h2>
        <p class="help-text">Bật những âm thanh thiên nhiên dịu nhẹ 🌧️🐦 và tắt đi các tiếng ồn đường phố 🔊🔨 ồn ào nhé bé.</p>
      </div>

      <div class="soundwave-box ${isWon ? 'calm' : 'noisy'}">
        <span class="harmony-label">🎵 Độ hài hòa giấc ngủ: ${harmony}%</span>
        <div class="harmony-bar-wrap">
          <div class="harmony-bar-fill" style="width: ${harmony}%"></div>
        </div>
        <div class="soundwave-visualizer">
          <div class="wave-bar bar-1"></div>
          <div class="wave-bar bar-2"></div>
          <div class="wave-bar bar-3"></div>
          <div class="wave-bar bar-4"></div>
          <div class="wave-bar bar-5"></div>
          <div class="wave-bar bar-6"></div>
          <div class="wave-bar bar-7"></div>
          <div class="wave-bar bar-8"></div>
        </div>
      </div>

      <div class="sound-cards-grid">
        ${sounds.map(sound => `
          <button class="sound-card ${sound.type} ${sound.active ? 'active' : 'off'}" 
            type="button" 
            data-sound-id="${sound.id}">
            <div class="sound-card-header">
              <span class="sound-icon">${sound.icon}</span>
              <span class="sound-badge ${sound.type}">${sound.type === 'soothing' ? 'Âm thanh đẹp' : 'Tiếng ồn'}</span>
            </div>
            <div class="sound-info">
              <strong>${sound.label}</strong>
              <span class="sound-note">${sound.note} · ${sound.active ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
            </div>
            <span class="sound-action-label">${sound.active ? 'Chạm để Tắt 🛑' : 'Chạm để Bật ▶️'}</span>
          </button>
        `).join("")}
      </div>

      <div class="game-feedback" id="game-feedback-box">
        <video autoplay loop muted playsinline src="${characterVideos.happy}" class="feedback-avatar"></video>
        <p class="feedback-text" id="game-feedback-text">
          ${isWon ? 'Hòa âm hoàn hảo! Bé Chuối Tiêu đang chìm vào giấc mơ ngọt ngào rồi!' : 'Hãy bật các âm thanh đẹp và tắt tiếng ồn đi nhé bé.'}
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
    <div class="build-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"} animate-fade-in">
      <div class="build-card">
        <p class="kicker">Màn 4: Đặt điện thoại xuống & Làm KIT thật</p>
        <h2>Dựng bảo bối từ sợi chuối</h2>
        
        <div class="land-visual-state-container ${currentCheckpoint.backgroundState}">
          <div class="visual-state-overlay">
            <span class="land-status-badge">Trạng thái: ${progress}% Hồi sinh</span>
          </div>
        </div>

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
            <p class="guide-text">${currentCheckpoint.guideText[age]}</p>
          </div>
        </div>

        <div class="bana-build-speech-bubble">
          <span class="bana-tag">🌱 Bana khích lệ:</span>
          <p class="bana-speech-text">"${currentCheckpoint.banaDialogue}"</p>
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
  const stepIdx = kitState.familyQuestStep || 0;
  const step = kit.familyQuest.steps[stepIdx];

  // Render a step tracker
  const stepTracker = `
    <div class="wizard-steps-tracker">
      ${kit.familyQuest.steps.map((s, idx) => `
        <div class="wizard-step ${idx === stepIdx ? 'active' : idx < stepIdx ? 'completed' : ''}">
          <span class="step-num">${s.stepId}</span>
          <span class="step-label">${s.title}</span>
        </div>
      `).join('<div class="wizard-connector"></div>')}
    </div>
  `;

  let stepContent = '';
  if (step.type === "audio") {
    stepContent = `
      <div class="form-module audio-module">
        <h3>🎙️ ${step.title}</h3>
        <p class="step-desc">${step.desc}</p>
        <div class="audio-controls-row">
          <button class="record-btn" type="button" id="record-audio-btn">
            ${kitState.familyQuestMedia.audio ? 'Ghi âm lại 🎙️' : 'Bắt đầu ghi âm 🎙️'}
          </button>
          <div class="recording-indicator" id="recording-indicator" style="display: none">
            <span class="pulse-dot"></span> Đang ghi giọng của bé...
          </div>
          <audio id="audio-playback" controls style="display: ${kitState.familyQuestMedia.audio ? 'block' : 'none'}" src="${kitState.familyQuestMedia.audio || ''}"></audio>
        </div>
      </div>
    `;
  } else if (step.type === "photo") {
    stepContent = `
      <div class="form-module photo-module">
        <h3>📸 ${step.title}</h3>
        <p class="step-desc">${step.desc}</p>
        <div class="photo-upload-row">
          <label class="photo-label-btn" for="photo-file-input">
            Chọn ảnh chụp tác phẩm của con 🖼️
          </label>
          <input type="file" id="photo-file-input" accept="image/*" style="display:none">
          <div class="photo-preview-box" id="photo-preview-box">
            ${kitState.familyQuestMedia.photo ? `<img src="${kitState.familyQuestMedia.photo}">` : '<div class="no-photo-placeholder">Chưa tải ảnh lên</div>'}
          </div>
        </div>
      </div>
    `;
  } else if (step.type === "promise_text") {
    stepContent = `
      <div class="form-module promise-module">
        <h3>🌱 ${step.title}</h3>
        <p class="step-desc">${step.desc}</p>
        <textarea id="promise-text-input" placeholder="Bé viết cam kết nhỏ bảo vệ cây xanh vào đây nha..." class="capsule-textarea">${kitState.familyQuestMedia.promise || ''}</textarea>
      </div>
    `;
  } else if (step.type === "capsule_text") {
    stepContent = `
      <div class="form-module capsule-module">
        <h3>⏳ ${step.title}</h3>
        <p class="step-desc">${step.desc}</p>
        <textarea id="capsule-text-input" placeholder="Viết thư cho tương lai vào đây..." class="capsule-textarea">${kitState.familyQuestMedia.message || ''}</textarea>
        <small class="capsule-note">Thông điệp sẽ được khóa kín trong hộp thời gian ${kit.familyQuest.timeCapsuleDurationYears} năm.</small>
      </div>
    `;
  } else if (step.type === "finish") {
    stepContent = `
      <div class="form-module finish-module">
        <h3>🎁 ${step.title}</h3>
        <p class="step-desc">${step.desc}</p>
        
        <div class="summary-preview-box">
          <h4>Tổng quan kỷ niệm đã thu thập:</h4>
          <ul>
            <li>🎙️ Bản ghi âm giọng nói: ${kitState.familyQuestMedia.audio ? '✅ Sẵn sàng' : '❌ Chưa ghi âm'}</li>
            <li>📸 Ảnh tác phẩm của bé: ${kitState.familyQuestMedia.photo ? '✅ Đã tải lên' : '❌ Chưa tải lên'}</li>
            <li>🌱 Lời hứa xanh: ${kitState.familyQuestMedia.promise ? '✅ Đã viết' : '❌ Chưa viết'}</li>
            <li>⏳ Thư gửi tương lai: ${kitState.familyQuestMedia.message ? '✅ Đã hoàn thành' : '❌ Chưa hoàn thành'}</li>
          </ul>
        </div>
      </div>
    `;
  }

  return `
    <div class="family-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"} animate-fade-in">
      <div class="family-card">
        <p class="kicker">Màn 5: Family Quest (Thử thách gia đình)</p>
        <h2>Hộp Ký Ức Gia Đình</h2>
        
        ${stepTracker}
        
        <div class="family-step-content-area">
          ${stepContent}
        </div>
        
        <div class="family-controls-row">
          ${stepIdx > 0 ? `
            <button class="secondary-action" type="button" data-family-prev-step>
              ← Quay lại
            </button>
          ` : '<div></div>'}
          
          ${stepIdx < 4 ? `
            <button class="primary-action" type="button" data-family-next-step>
              Tiếp tục →
            </button>
          ` : `
            <button class="primary-action pulse" type="button" data-family-finish>
              Khóa hộp ký ức & Nhận Chứng nhận 🎁
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderRewardScreen() {
  const kitState = state[state.activeKitId];
  const badgeName = state.activeKitId === "kit_green_christmas" ? "Hiệp Sĩ Bảo Vệ Rừng Thông" : "Người Gác Cổng Giấc Mơ";
  const badgeIcon = state.activeKitId === "kit_green_christmas" ? "🎄" : "🌌";
  const artworkPhoto = kitState.familyQuestMedia.photo || "./assets/scenes/seed-character.png";

  return `
    <div class="reward-screen-shell region-${state.activeKitId === "kit_green_christmas" ? "recycle" : "friends"} animate-fade-in">
      <div class="glow-container"></div>
      <div class="reward-split-wrapper">
        <!-- BÊN TRÁI: DÀNH CHO CON -->
        <div class="reward-child-panel">
          <p class="kicker">Dành riêng cho Hiệp sĩ nhí 🌟</p>
          <h2>Yay! Con đã hoàn thành xuất sắc!</h2>
          
          <div class="badge-3d-box">
            <div class="badge-sphere">
              <span class="badge-sph-icon">${badgeIcon}</span>
            </div>
            <h3>${badgeName}</h3>
          </div>
          <p class="child-congrats">Huy hiệu danh giá này đã thuộc về con. Hãy cùng đeo huy hiệu này và tiếp tục bảo vệ Trái Đất nhé!</p>
        </div>
        
        <!-- BÊN PHẢI: DÀNH CHO BA MẸ -->
        <div class="reward-parent-panel">
          <p class="kicker">Dành cho Phụ huynh 💚</p>
          <h3>BẰNG CHỨNG NHẬN CHÍNH THỨC</h3>
          
          <div class="certificate-box">
            <div class="cert-border">
              <h4>BẰNG KHEN HIỆP SĨ MẦM XANH</h4>
              <p class="cert-salutation">Trân trọng vinh danh bạn nhỏ:</p>
              <input type="text" id="cert-kid-name" class="cert-kid-name-input" placeholder="Bố mẹ nhập tên của con tại đây..." value="${state.childName || ''}">
              
              <div class="cert-artwork-preview">
                <img src="${artworkPhoto}" alt="Tác phẩm của con" />
                <span class="artwork-caption">Tác phẩm bảo bối xanh của bé</span>
              </div>
              
              <p class="cert-desc">Đã cùng gia đình chế tạo thành công thiết bị bảo vệ sinh thái từ xơ chuối dẻo dai và bã cà phê ép, cam kết thực hiện lối sống xanh và bảo vệ thiên nhiên.</p>
              
              <div class="cert-footer">
                <div class="cert-signature">
                  <span>Người đồng hành</span>
                  <strong>🌱 Bana</strong>
                </div>
                <div class="cert-signature">
                  <span>Đơn vị đồng tổ chức</span>
                  <strong>🍃 Biofiber</strong>
                </div>
              </div>
            </div>
          </div>
          
          <div class="reward-controls">
            <button class="primary-action pulse" type="button" data-reward-claim>
              Lưu vào Hộ chiếu Passport 📖
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderEcoPassportScreen() {
  return `
    <div class="passport-screen-shell animate-fade-in">
      <div class="passport-card book-layout">
        <div class="passport-header">
          <h2>📖 Sổ Hành Trình Mầm Xanh (Eco Passport)</h2>
          <div class="seed-indicator">Hạt mầm tích lũy: 🌾 <strong>${state.seeds}</strong></div>
        </div>
        
        <div class="passport-pages-book">
          <!-- TRANG TRÁI: THÀNH TÍCH VÀ THÔNG TIN BÉ -->
          <div class="passport-page page-left">
            <div class="passport-profile">
              <div class="profile-avatar">🌱</div>
              <div class="profile-details">
                <h3>Hiệp sĩ: ${state.childName || "Mầm Non"}</h3>
                <span class="profile-rank">Cấp độ: Đại sứ Môi Trường tương lai</span>
              </div>
            </div>
            
            <div class="earned-badges-section">
              <h4>Huy hiệu đã đạt</h4>
              <div class="earned-badges-list">
                ${state.passportBadges.length === 0 ? `
                  <div class="no-badge-msg">Con chưa nhận huy hiệu nào. Hãy tham gia chế tạo nhé!</div>
                ` : state.passportBadges.map(badgeId => {
                  const isChristmas = badgeId === "badge_green_christmas";
                  return `
                    <div class="passport-badge-item">
                      <span class="badge-item-icon">${isChristmas ? "🎄" : "🌌"}</span>
                      <div class="badge-info-column">
                        <strong>${isChristmas ? "Hiệp Sĩ Rừng Thông" : "Người Gác Giấc Mơ"}</strong>
                        <small>Đã đạt thành tích</small>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
          
          <!-- TRANG PHẢI: DÒNG KÝ ỨC VÀ HỘP THỜI GIAN -->
          <div class="passport-page page-right">
            <h4>Kỷ niệm gia đình & Hộp thời gian</h4>
            <div class="family-memories-timeline">
              ${Object.keys(KITS_DATA).map(kitId => {
                const kitState = state[kitId];
                if (!kitState || (!kitState.familyQuestMedia.photo && !kitState.familyQuestMedia.audio && !kitState.familyQuestMedia.message)) {
                  return "";
                }
                const kitName = KITS_DATA[kitId].kitName;
                const releaseYear = new Date().getFullYear() + (kitId === "kit_green_christmas" ? 5 : 1);
                return `
                  <div class="timeline-memory-card">
                    <h5>Hộp KIT: ${kitName}</h5>
                    ${kitState.familyQuestMedia.photo ? `<div class="memory-img-wrap"><img src="${kitState.familyQuestMedia.photo}"></div>` : ""}
                    ${kitState.familyQuestMedia.promise ? `<p class="memory-promise">🌱 <strong>Lời hứa xanh:</strong> ${kitState.familyQuestMedia.promise}</p>` : ""}
                    ${kitState.familyQuestMedia.message ? `<p class="memory-msg">⏳ <strong>Thư gửi tương lai:</strong> "${kitState.familyQuestMedia.message}"<br><small class="locked-badge">(Khóa kín đến năm ${releaseYear})</small></p>` : ""}
                    ${kitState.familyQuestMedia.audio ? `
                      <div class="memory-audio-player">
                        <span>🎙️ Ghi âm giọng con:</span>
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
    <div class="upsell-screen-shell region-${otherKitId === "kit_green_christmas" ? "recycle" : "friends"} animate-fade-in">
      <div class="upsell-card sos-card">
        <div class="sos-banner">🚨 TÍN HIỆU CẦU CỨU KHẨN CẤP 🚨</div>
        <h2>Vùng đất mới đang kêu cứu!</h2>
        <p class="sos-desc">Có tiếng động lạ và tín hiệu SOS truyền đến từ ${otherKitId === "kit_green_christmas" ? "Rừng Thông Lâm Đồng" : "phòng ngủ bé Chuối Tiêu"}. Hãy giúp Bana cào lớp bụi mờ để tìm ra mối nguy hiểm!</p>
        
        <div class="scratch-card-container">
          <div class="scratch-card-revealed-content">
            <div class="revealed-visual">
              <span class="revealed-icon">${otherKitId === "kit_green_christmas" ? "🎄" : "🌌"}</span>
            </div>
            <h3>Mở lối đến: ${otherKit.kitName}</h3>
            <p>Nguyên liệu giải cứu: <strong>${otherKit.materialsUsed.join(", ")}</strong></p>
            <p>Nhân vật đang gặp nguy hiểm: <strong>${otherKit.character.name}</strong></p>
          </div>
          <div class="scratch-card-fog-overlay" id="scratch-fog-overlay">
            <div class="fog-text">Vuốt để xóa sương mù / bụi cát 🌫️</div>
          </div>
        </div>
        
        <div class="upsell-controls">
          <button class="primary-action pulse" type="button" data-upsell-choose-other>
            Đến ứng cứu ngay lập tức! 🚀
          </button>
          <button class="secondary-action" type="button" data-upsell-back-home>
            Quay lại trang chủ
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
    document.querySelector("#game-header").innerHTML = renderHeader();

    // Render screen
    const contentBox = document.querySelector("#game-screen-content");
    if (state.currentScreen === "story") {
      contentBox.innerHTML = renderStoryScreen();
    } else if (state.currentScreen === "minigame") {
      contentBox.innerHTML = renderMiniGameScreen();
    } else if (state.currentScreen === "build") {
      contentBox.innerHTML = renderBuildMissionScreen();
    } else if (state.currentScreen === "family") {
      contentBox.innerHTML = renderFamilyQuestScreen();
    } else if (state.currentScreen === "reward") {
      contentBox.innerHTML = renderRewardScreen();
    } else if (state.currentScreen === "passport") {
      contentBox.innerHTML = renderEcoPassportScreen();
    } else if (state.currentScreen === "upsell") {
      contentBox.innerHTML = renderUpsellScreen();
    }

    renderDialogue();
  }
}
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
            <li><a href="#lands">Chọn Hộp KIT</a></li>
            <li><a href="#journey">Hành trình</a></li>
            <li><a href="#tree-progress">Hạt mầm</a></li>
            <li><a href="#parents-portal">Dành cho cha mẹ</a></li>
          </ul>
          <div class="nav-actions">
            <button class="nav-cta" type="button" data-cover-start>BẮT ĐẦU NGAY</button>
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
        
        <div class="hero-content-overlay">
          <h1 class="hero-title">XỨ SỞ MẦM XANH</h1>
          <p class="hero-subtitle">Một hành trình xanh để bé chơi, làm KIT thật cùng ba mẹ và lưu giữ kỷ niệm trong Eco Passport</p>
          <div class="hero-actions">
            <button class="primary-action hero-btn pulse" type="button" data-cover-start>Bắt đầu hành trình cùng Bana 🚀</button>
            <a href="#parents-portal" class="secondary-action hero-btn">Phụ huynh xem giá trị của KIT 📖</a>
          </div>
        </div>

        <div class="hero-bottom-curve">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.27,84.34,22.48c64.3,13.65,133.05,15.44,200.37,33.5C295.67,56.44,308.26,56.44,321.39,56.44Z"></path>
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
            <h2 class="section-title">2 CÁNH CỬA THẾ GIỚI</h2>
            <p class="section-subtitle">Chạm vào cánh cửa để bắt đầu hành trình của bạn nhỏ!</p>
            <div class="lands-grid">
              
              <!-- CARD KIT 1 -->
              <div class="land-card card-recycle">
                <div class="land-visual-wrap">
                  <img src="./assets/scenes/giang-sinh-xanh-kit.jpg" alt="Giáng Sinh Xanh" class="land-scene-img" />
                  <span class="land-badge-preview">
                    <span class="badge-icon">🎄</span>
                    <small class="badge-label">KIT 1</small>
                  </span>
                </div>
                <div class="land-info">
                  <div class="land-meta">
                    <span class="land-chapter">KIT 01</span>
                    <span class="land-location">Lâm Đồng</span>
                  </div>
                  <h3>Hộp KIT: Giáng Sinh Xanh</h3>
                  <div class="land-details-list">
                    <p>🦸 <strong>Nhân vật:</strong> Bạn thông Piney tinh nghịch</p>
                    <p>⚠️ <strong>Hiểm họa:</strong> Khí nhà kính Carbonox làm cháy lá</p>
                    <p>🛠️ <strong>Chế tạo thật:</strong> Khiên lá chắn từ sợi chuối & bã cà phê nén</p>
                    <p>👶 <strong>Độ tuổi:</strong> Mầm Nhỏ (5-7t) & Chiến Binh (8-12t)</p>
                  </div>
                  <button class="land-play-btn" type="button" data-cover-start data-land-target="kit_green_christmas">MỞ CÁNH CỬA NÀY 🚀</button>
                </div>
              </div>

              <!-- CARD KIT 2 -->
              <div class="land-card card-friends">
                <div class="land-visual-wrap">
                  <img src="./assets/scenes/dreamcatcher-kit.jpg" alt="Dreamcatcher Lưới Mơ" class="land-scene-img" />
                  <span class="land-badge-preview">
                    <span class="badge-icon">🌌</span>
                    <small class="badge-label">KIT 2</small>
                  </span>
                </div>
                <div class="land-info">
                  <div class="land-meta">
                    <span class="land-chapter">KIT 02</span>
                    <span class="land-location">Khánh Hòa</span>
                  </div>
                  <h3>Hộp KIT: Dreamcatcher Lưới Mơ</h3>
                  <div class="land-details-list">
                    <p>🦸 <strong>Nhân vật:</strong> Bé Chuối Tiêu dễ thương</p>
                    <p>⚠️ <strong>Hiểm họa:</strong> Ác mộng bóng tối bủa vây phòng ngủ</p>
                    <p>🛠️ <strong>Chế tạo thật:</strong> Lưới bắt giấc mơ từ vòng tre & sợi chuối</p>
                    <p>👶 <strong>Độ tuổi:</strong> Mầm Nhỏ (5-7t) & Chiến Binh (8-12t)</p>
                  </div>
                  <button class="land-play-btn" type="button" data-cover-start data-land-target="kit_dreamcatcher">MỞ CÁNH CỬA NÀY 🚀</button>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        <!-- SECTION: HÀNH TRÌNH BẢO VỆ XỨ SỞ -->
        <section id="journey" class="landing-section journey-section">
          <div class="section-container" style="max-width: 1100px; margin: 0 auto; text-align: center; padding: 0 16px;">
            <img src="./assets/scenes/journey-timeline.jpg" alt="Hành trình bảo vệ xứ sở" class="journey-timeline-img" style="width: 100%; height: auto; border-radius: 28px; box-shadow: 0 15px 45px rgba(63, 159, 86, 0.08);" />
          </div>
        </section>

        <!-- SECTION: CÂY MẦM XANH -->
        <section id="tree-progress" class="landing-section tree-section">
          <div class="section-container">
            <h2 class="section-title">HẠT MẦM TÍCH LŨY</h2>
            <div class="tree-growth-wrapper">
              <div class="tree-visual-box" style="${state.seeds < 10 ? 'padding: 0; overflow: hidden; border: none; background: transparent; width: 220px; flex-shrink: 0;' : 'padding: 0 0 24px 0; overflow: hidden;' }">
                ${state.seeds >= 20 ? `
                  <div class="tree-emoji">🌳</div>
                  <div class="tree-badge">Cây Đại Thụ Xanh</div>
                ` : state.seeds >= 10 ? `
                  <video autoplay loop muted playsinline src="./assets/scenes/cay-mam-chuyen-dong.mp4" class="tree-growth-video"></video>
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
      state[targetKit].bugsSquishedCount = 0;
      state[targetKit].squishedBugIds = [];
      state[targetKit].carbonAnswers = { transport: null, bag: null, plant: null };
      state[targetKit].nightmaresClearedCount = 0;
      state[targetKit].clearedNightmareIds = [];
      state[targetKit].soothingSoundsState = { rain: false, birds: false, horn: true, hammer: true };
      state[targetKit].familyQuestStep = 0;
      state[targetKit].familyQuestDone = false;
      state[targetKit].familyQuestMedia = { audio: null, photo: null, message: "", promise: "" };
      
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

    if (event.target.closest("[data-minigame-goto-level3]")) {
      const kitState = state[state.activeKitId];
      kitState.activeSubGameLevel = 3;
      saveState();
      renderDynamic();
      return;
    }

    // Bug Squishing Click (Kit 1 - Sublevel 2)
    const bugBtn = event.target.closest("[data-bug-id]");
    if (bugBtn) {
      const bugId = bugBtn.dataset.bugId;
      const bugType = bugBtn.dataset.bugType;
      const kitState = state.kit_green_christmas;
      kitState.squishedBugIds = kitState.squishedBugIds || [];

      if (bugType === "beetle") {
        if (!kitState.squishedBugIds.includes(bugId)) {
          kitState.squishedBugIds.push(bugId);
          kitState.bugsSquishedCount = kitState.squishedBugIds.length;
          kitState.threatHp = Math.min(100, kitState.threatHp + 14);
          makeConfetti(12);
          showToast("Đã diệt sâu hại! 🐛💥");
          
          if (kitState.squishedBugIds.length >= 5) {
            updateBana("proud", "Thân thông sạch bóng sâu hại rồi! Hãy chuyển sang thử thách lối sống xanh nhé!");
          } else {
            updateBana("cheer", `Đã diệt ${kitState.squishedBugIds.length}/5 sâu hại. Cố lên bé!`);
          }
        }
      } else if (bugType === "ladybug") {
        updateBana("thinking", "Đó là bạn bọ rùa đỏ tốt bụng giúp bảo vệ lá cây, đừng diệt bạn nhé!");
        showToast("Bọ rùa có ích! 🐞");
      }
      saveState();
      renderDynamic();
      return;
    }

    // Carbon Footprint Scenario choices click (Kit 1 - Sublevel 3)
    const carbonBtn = event.target.closest("[data-carbon-opt-key]");
    if (carbonBtn) {
      const scId = carbonBtn.dataset.carbonScId;
      const optKey = carbonBtn.dataset.carbonOptKey;
      const kitState = state.kit_green_christmas;
      kitState.carbonAnswers = kitState.carbonAnswers || { transport: null, bag: null, plant: null };

      if (!kitState.carbonAnswers[scId]) {
        kitState.carbonAnswers[scId] = optKey;
        
        // Check correctness
        let correct = false;
        if (scId === "transport" && optKey === "bike") correct = true;
        if (scId === "bag" && optKey === "canvas") correct = true;
        if (scId === "plant" && optKey === "water") correct = true;

        if (correct) {
          kitState.threatHp = Math.min(100, kitState.threatHp + 10);
          makeConfetti(12);
          showToast("Hành động xanh chính xác! 🎉");
        } else {
          showToast("Lựa chọn này chưa tối ưu môi trường nha bé! 😢");
        }

        // Count correct answers
        let correctCount = 0;
        if (kitState.carbonAnswers.transport === "bike") correctCount++;
        if (kitState.carbonAnswers.bag === "canvas") correctCount++;
        if (kitState.carbonAnswers.plant === "water") correctCount++;

        if (correctCount === 3) {
          kitState.miniGameDone = true;
          updateBana("proud", "Dấu chân Carbon của bé đã ở mức an toàn! Rừng thông đã được cứu! Hãy làm KIT thực tế cùng bố mẹ nhé!");
          makeConfetti(24);
        } else {
          if (correct) {
            updateBana("cheer", "Đúng rồi! Hãy tiếp tục trả lời các câu hỏi sống xanh khác.");
          } else {
            updateBana("thinking", "Ồ, lựa chọn này chưa thân thiện lắm. Cố gắng chọn hành động xanh hơn ở thẻ sau nhé!");
          }
        }
      }
      saveState();
      renderDynamic();
      return;
    }

    // Nightmare Popper click (Kit 2 - Sublevel 2)
    const nightmareBtn = event.target.closest("[data-nightmare-id]");
    if (nightmareBtn) {
      const nightId = nightmareBtn.dataset.nightmareId;
      const entityType = nightmareBtn.dataset.entityType;
      const kitState = state.kit_dreamcatcher;
      kitState.clearedNightmareIds = kitState.clearedNightmareIds || [];

      if (entityType === "nightmare") {
        if (!kitState.clearedNightmareIds.includes(nightId)) {
          kitState.clearedNightmareIds.push(nightId);
          kitState.nightmaresClearedCount = kitState.clearedNightmareIds.length;
          kitState.threatHp = Math.min(100, kitState.threatHp + 12);
          makeConfetti(12);
          showToast("Xua đuổi ác mộng! ☁️😈");

          if (kitState.clearedNightmareIds.length >= 5) {
            updateBana("proud", "Phòng ngủ đã sáng ngời và ấm áp! Hãy cùng Bé Chuối Tiêu làm bản hòa âm giấc ngủ nhé!");
          } else {
            updateBana("cheer", `Đã tiêu diệt ${kitState.clearedNightmareIds.length}/5 đám mây ác mộng.`);
          }
        }
      } else if (entityType === "star") {
        updateBana("happy", "Ngôi sao ước mơ lấp lánh đang bảo vệ giấc ngủ lành của bé!");
        showToast("Ngôi sao mơ ước lấp lánh! 🌟");
      }
      saveState();
      renderDynamic();
      return;
    }

    // Soothing Sounds Mixer toggle (Kit 2 - Sublevel 3)
    const soundBtn = event.target.closest("[data-sound-id]");
    if (soundBtn) {
      const soundId = soundBtn.dataset.soundId;
      const kitState = state.kit_dreamcatcher;
      kitState.soothingSoundsState = kitState.soothingSoundsState || { rain: false, birds: false, horn: true, hammer: true };

      kitState.soothingSoundsState[soundId] = !kitState.soothingSoundsState[soundId];

      const s = kitState.soothingSoundsState;
      let harmony = 0;
      if (s.rain === true) harmony += 25;
      if (s.birds === true) harmony += 25;
      if (s.horn === false) harmony += 25;
      if (s.hammer === false) harmony += 25;

      if (harmony === 100) {
        kitState.miniGameDone = true;
        updateBana("proud", "Hòa âm hoàn hảo! Bé Chuối Tiêu đã ngủ rất ngon rồi. Hãy cùng bắt tay làm bộ KIT thực tế nhé!");
        makeConfetti(24);
      } else {
        if (soundId === "rain" || soundId === "birds") {
          if (s[soundId]) {
            updateBana("cheer", `Bật ${soundId === "rain" ? "tiếng mưa" : "tiếng chim"} nghe thật thư giãn!`);
          } else {
            updateBana("thinking", "Tắt mất âm thanh thiên nhiên rồi bé ơi.");
          }
        } else {
          if (!s[soundId]) {
            updateBana("cheer", `Tắt thành công ${soundId === "horn" ? "tiếng còi xe" : "tiếng búa công trường"} ồn ào!`);
          } else {
            updateBana("thinking", `Ồ, ${soundId === "horn" ? "tiếng còi" : "tiếng búa"} đang kêu ầm ĩ phá giấc ngủ kìa!`);
          }
        }
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

    // 7. Family Quest events (WIZARD STEPS)
    const famNextStepBtn = event.target.closest("[data-family-next-step]");
    if (famNextStepBtn) {
      const kitState = state[state.activeKitId];
      const stepIdx = kitState.familyQuestStep || 0;
      
      // Save current step data
      if (stepIdx === 2) {
        kitState.familyQuestMedia.promise = document.querySelector("#promise-text-input")?.value || "";
      } else if (stepIdx === 3) {
        kitState.familyQuestMedia.message = document.querySelector("#capsule-text-input")?.value || "";
      }

      kitState.familyQuestStep = Math.min(4, stepIdx + 1);
      saveState();
      renderDynamic();
      return;
    }

    const famPrevStepBtn = event.target.closest("[data-family-prev-step]");
    if (famPrevStepBtn) {
      const kitState = state[state.activeKitId];
      const stepIdx = kitState.familyQuestStep || 0;
      
      // Save current step data
      if (stepIdx === 2) {
        kitState.familyQuestMedia.promise = document.querySelector("#promise-text-input")?.value || "";
      } else if (stepIdx === 3) {
        kitState.familyQuestMedia.message = document.querySelector("#capsule-text-input")?.value || "";
      }

      kitState.familyQuestStep = Math.max(0, stepIdx - 1);
      saveState();
      renderDynamic();
      return;
    }

    const recBtn = event.target.closest("#record-audio-btn");
    if (recBtn) {
      toggleAudioRecording();
      return;
    }

    if (event.target.closest("[data-family-finish]")) {
      const kitState = state[state.activeKitId];
      
      // Save data from current step if relevant
      const stepIdx = kitState.familyQuestStep || 0;
      if (stepIdx === 2) {
        kitState.familyQuestMedia.promise = document.querySelector("#promise-text-input")?.value || "";
      } else if (stepIdx === 3) {
        kitState.familyQuestMedia.message = document.querySelector("#capsule-text-input")?.value || "";
      }

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
      state[otherKitId].bugsSquishedCount = 0;
      state[otherKitId].squishedBugIds = [];
      state[otherKitId].carbonAnswers = { transport: null, bag: null, plant: null };
      state[otherKitId].nightmaresClearedCount = 0;
      state[otherKitId].clearedNightmareIds = [];
      state[otherKitId].soothingSoundsState = { rain: false, birds: false, horn: true, hammer: true };
      state[otherKitId].familyQuestStep = 0;
      state[otherKitId].familyQuestDone = false;
      state[otherKitId].familyQuestMedia = { audio: null, photo: null, message: "", promise: "" };
      
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
      state[state.activeKitId].bugsSquishedCount = 0;
      state[state.activeKitId].squishedBugIds = [];
      state[state.activeKitId].carbonAnswers = { transport: null, bag: null, plant: null };
      state[state.activeKitId].nightmaresClearedCount = 0;
      state[state.activeKitId].clearedNightmareIds = [];
      state[state.activeKitId].soothingSoundsState = { rain: false, birds: false, horn: true, hammer: true };
      state[state.activeKitId].familyQuestStep = 0;
      state[state.activeKitId].familyQuestDone = false;
      state[state.activeKitId].familyQuestMedia = { audio: null, photo: null, message: "", promise: "" };

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
}
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

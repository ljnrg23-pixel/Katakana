const KANA = [
  { kana: "ア", romaji: ["a"] },
  { kana: "イ", romaji: ["i"] },
  { kana: "ウ", romaji: ["u"] },
  { kana: "エ", romaji: ["e"] },
  { kana: "オ", romaji: ["o"] },
  { kana: "カ", romaji: ["ka"] },
  { kana: "キ", romaji: ["ki"] },
  { kana: "ク", romaji: ["ku"] },
  { kana: "ケ", romaji: ["ke"] },
  { kana: "コ", romaji: ["ko"] },
  { kana: "サ", romaji: ["sa"] },
  { kana: "シ", romaji: ["shi", "si"] },
  { kana: "ス", romaji: ["su"] },
  { kana: "セ", romaji: ["se"] },
  { kana: "ソ", romaji: ["so"] },
  { kana: "タ", romaji: ["ta"] },
  { kana: "チ", romaji: ["chi", "ti"] },
  { kana: "ツ", romaji: ["tsu", "tu"] },
  { kana: "テ", romaji: ["te"] },
  { kana: "ト", romaji: ["to"] },
  { kana: "ナ", romaji: ["na"] },
  { kana: "ニ", romaji: ["ni"] },
  { kana: "ヌ", romaji: ["nu"] },
  { kana: "ネ", romaji: ["ne"] },
  { kana: "ノ", romaji: ["no"] },
  { kana: "ハ", romaji: ["ha"] },
  { kana: "ヒ", romaji: ["hi"] },
  { kana: "フ", romaji: ["fu", "hu"] },
  { kana: "ヘ", romaji: ["he"] },
  { kana: "ホ", romaji: ["ho"] },
  { kana: "マ", romaji: ["ma"] },
  { kana: "ミ", romaji: ["mi"] },
  { kana: "ム", romaji: ["mu"] },
  { kana: "メ", romaji: ["me"] },
  { kana: "モ", romaji: ["mo"] },
  { kana: "ヤ", romaji: ["ya"] },
  { kana: "ユ", romaji: ["yu"] },
  { kana: "ヨ", romaji: ["yo"] },
  { kana: "ラ", romaji: ["ra"] },
  { kana: "リ", romaji: ["ri"] },
  { kana: "ル", romaji: ["ru"] },
  { kana: "レ", romaji: ["re"] },
  { kana: "ロ", romaji: ["ro"] },
  { kana: "ワ", romaji: ["wa"] },
  { kana: "ヲ", romaji: ["wo", "o"] },
  { kana: "ン", romaji: ["n"] },
  { kana: "ガ", romaji: ["ga"] },
  { kana: "ギ", romaji: ["gi"] },
  { kana: "グ", romaji: ["gu"] },
  { kana: "ゲ", romaji: ["ge"] },
  { kana: "ゴ", romaji: ["go"] },
  { kana: "ザ", romaji: ["za"] },
  { kana: "ジ", romaji: ["ji", "zi"] },
  { kana: "ズ", romaji: ["zu"] },
  { kana: "ゼ", romaji: ["ze"] },
  { kana: "ゾ", romaji: ["zo"] },
  { kana: "ダ", romaji: ["da"] },
  { kana: "ヂ", romaji: ["di", "ji"] },
  { kana: "ヅ", romaji: ["du", "zu"] },
  { kana: "デ", romaji: ["de"] },
  { kana: "ド", romaji: ["do"] },
  { kana: "バ", romaji: ["ba"] },
  { kana: "ビ", romaji: ["bi"] },
  { kana: "ブ", romaji: ["bu"] },
  { kana: "ベ", romaji: ["be"] },
  { kana: "ボ", romaji: ["bo"] },
  { kana: "パ", romaji: ["pa"] },
  { kana: "ピ", romaji: ["pi"] },
  { kana: "プ", romaji: ["pu"] },
  { kana: "ペ", romaji: ["pe"] },
  { kana: "ポ", romaji: ["po"] },
];

const ROUND_SECONDS = 60;
const SCORE_KEY = "katakana-dash-scores";

const screens = {
  menu: document.querySelector("#menuScreen"),
  game: document.querySelector("#gameScreen"),
  result: document.querySelector("#resultScreen"),
};

const els = {
  overallBest: document.querySelector("#overallBest"),
  typeBest: document.querySelector("#typeBest"),
  pickBest: document.querySelector("#pickBest"),
  studyStrip: document.querySelector("#studyStrip"),
  modeLabel: document.querySelector("#modeLabel"),
  promptLabel: document.querySelector("#promptLabel"),
  timer: document.querySelector("#timer"),
  score: document.querySelector("#score"),
  modeBest: document.querySelector("#modeBest"),
  streak: document.querySelector("#streak"),
  prompt: document.querySelector("#prompt"),
  promptSub: document.querySelector("#promptSub"),
  answerForm: document.querySelector("#answerForm"),
  answerInput: document.querySelector("#answerInput"),
  choiceGrid: document.querySelector("#choiceGrid"),
  feedback: document.querySelector("#feedback"),
  resultMode: document.querySelector("#resultMode"),
  resultTitle: document.querySelector("#resultTitle"),
  resultCopy: document.querySelector("#resultCopy"),
};

let activeMode = "type";
let activePrompt = null;
let score = 0;
let streak = 0;
let timeLeft = ROUND_SECONDS;
let timerId = null;
let scores = loadScores();
let acceptingAnswers = false;
let lastPromptKana = "";

function loadScores() {
  try {
    return { type: 0, pick: 0, ...JSON.parse(localStorage.getItem(SCORE_KEY)) };
  } catch {
    return { type: 0, pick: 0 };
  }
}

function saveScores() {
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function updateScoreboards() {
  els.typeBest.textContent = scores.type;
  els.pickBest.textContent = scores.pick;
  els.overallBest.textContent = Math.max(scores.type, scores.pick);
  els.modeBest.textContent = scores[activeMode] ?? 0;
}

function setupStudyStrip() {
  const preview = KANA.slice(0, 46);
  els.studyStrip.replaceChildren(
    ...preview.map((item) => {
      const tile = document.createElement("div");
      tile.className = "study-tile";

      const kana = document.createElement("b");
      kana.textContent = item.kana;

      const romaji = document.createElement("span");
      romaji.textContent = item.romaji[0];

      tile.append(kana, romaji);
      return tile;
    }),
  );
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function randomKana(exceptKana = "") {
  let next = KANA[Math.floor(Math.random() * KANA.length)];
  if (KANA.length > 1) {
    while (next.kana === exceptKana) {
      next = KANA[Math.floor(Math.random() * KANA.length)];
    }
  }
  return next;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function setFeedback(message, tone = "") {
  els.feedback.textContent = message;
  els.feedback.className = `feedback${tone ? ` is-${tone}` : ""}`;
}

function startGame(mode) {
  activeMode = mode;
  score = 0;
  streak = 0;
  timeLeft = ROUND_SECONDS;
  acceptingAnswers = true;
  lastPromptKana = "";

  clearInterval(timerId);
  updateScoreboards();
  updateStats();

  els.modeLabel.textContent = mode === "type" ? "Kana to Romaji" : "Romaji to Kana";
  els.promptLabel.textContent = mode === "type" ? "Type the romaji" : "Choose the katakana";
  els.answerForm.hidden = mode !== "type";
  els.choiceGrid.hidden = mode !== "pick";
  els.timer.textContent = formatTime(timeLeft);
  setFeedback("");
  showScreen("game");
  nextPrompt();

  timerId = setInterval(() => {
    timeLeft -= 1;
    els.timer.textContent = formatTime(Math.max(timeLeft, 0));
    if (timeLeft <= 0) {
      finishGame();
    }
  }, 1000);
}

function updateStats() {
  els.score.textContent = score;
  els.streak.textContent = streak;
  els.modeBest.textContent = scores[activeMode] ?? 0;
}

function nextPrompt() {
  activePrompt = randomKana(lastPromptKana);
  lastPromptKana = activePrompt.kana;

  if (activeMode === "type") {
    els.prompt.textContent = activePrompt.kana;
    els.promptSub.textContent = "";
    els.answerInput.value = "";
    window.setTimeout(() => els.answerInput.focus({ preventScroll: true }), 50);
  } else {
    els.prompt.textContent = activePrompt.romaji[0];
    els.promptSub.textContent = "";
    renderChoices(activePrompt);
  }
}

function renderChoices(correct) {
  const distractors = shuffle(KANA.filter((item) => item.kana !== correct.kana)).slice(0, 24);
  const choices = shuffle([correct, ...distractors]);

  els.choiceGrid.replaceChildren(
    ...choices.map((item) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = item.kana;
      button.setAttribute("aria-label", item.kana);
      button.addEventListener("click", () => handlePick(item, button));
      return button;
    }),
  );
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function awardPoint() {
  streak += 1;
  score += 1 + Math.floor(streak / 5);
  if (score > scores[activeMode]) {
    scores[activeMode] = score;
    saveScores();
  }
  updateScoreboards();
  updateStats();
}

function handleMiss(correctText) {
  streak = 0;
  updateStats();
  setFeedback(`Answer: ${correctText}`, "wrong");
}

function handleTypeSubmit(event) {
  event.preventDefault();
  if (!acceptingAnswers || activeMode !== "type") return;

  const answer = normalizeAnswer(els.answerInput.value);
  if (!answer) return;

  if (activePrompt.romaji.includes(answer)) {
    awardPoint();
    setFeedback("Correct", "right");
  } else {
    handleMiss(activePrompt.romaji[0]);
  }
  nextPrompt();
}

function handlePick(choice, button) {
  if (!acceptingAnswers || activeMode !== "pick") return;
  acceptingAnswers = false;

  const isCorrect = choice.kana === activePrompt.kana;
  if (isCorrect) {
    button.classList.add("is-right");
    awardPoint();
    setFeedback("Correct", "right");
  } else {
    button.classList.add("is-wrong");
    handleMiss(activePrompt.kana);
    const rightButton = [...els.choiceGrid.children].find(
      (child) => child.textContent === activePrompt.kana,
    );
    rightButton?.classList.add("is-right");
  }

  window.setTimeout(() => {
    acceptingAnswers = true;
    nextPrompt();
  }, isCorrect ? 180 : 520);
}

function finishGame() {
  clearInterval(timerId);
  acceptingAnswers = false;
  saveScores();
  updateScoreboards();

  els.resultMode.textContent = activeMode === "type" ? "Kana to Romaji" : "Romaji to Kana";
  els.resultTitle.textContent = `Score ${score}`;
  els.resultCopy.textContent = `Best score ${scores[activeMode]}`;
  showScreen("result");
}

function backToMenu() {
  clearInterval(timerId);
  acceptingAnswers = false;
  updateScoreboards();
  showScreen("menu");
}

document.querySelectorAll("[data-start-mode]").forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.startMode));
});

document.querySelector("#backButton").addEventListener("click", backToMenu);
document.querySelector("#menuButton").addEventListener("click", backToMenu);
document.querySelector("#playAgainButton").addEventListener("click", () => startGame(activeMode));
els.answerForm.addEventListener("submit", handleTypeSubmit);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && screens.game.classList.contains("is-active")) {
    finishGame();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

setupStudyStrip();
updateScoreboards();

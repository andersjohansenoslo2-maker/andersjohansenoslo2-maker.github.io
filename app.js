const STORAGE_KEY = "evnetest-trener-web-v1";
const FULL_TEST_LEVELS = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 8, 8, 8];
const PRACTICE_LEVELS = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
const CATEGORIES = ["Numerisk", "Verbal", "Logisk"];

const state = {
  profiles: [],
  activeProfileId: null,
  screen: "home",
  questions: [],
  currentIndex: 0,
  selectedOption: null,
  answers: [],
  sessionType: "full",
  lastResult: null
};

const elements = {
  profilesList: document.getElementById("profiles-list"),
  profileNameInput: document.getElementById("profile-name-input"),
  addProfileButton: document.getElementById("add-profile-btn"),
  homeScreen: document.getElementById("home-screen"),
  historyScreen: document.getElementById("history-screen"),
  quizScreen: document.getElementById("quiz-screen"),
  resultScreen: document.getElementById("result-screen"),
  welcomeTitle: document.getElementById("welcome-title"),
  welcomeCopy: document.getElementById("welcome-copy"),
  insightBox: document.getElementById("insight-box"),
  insightText: document.getElementById("insight-text"),
  historySummary: document.getElementById("history-summary"),
  historyList: document.getElementById("history-list"),
  startFullButton: document.getElementById("start-full-btn"),
  startPracticeButton: document.getElementById("start-practice-btn"),
  sessionLabel: document.getElementById("session-label"),
  progressText: document.getElementById("progress-text"),
  progressBar: document.getElementById("progress-bar"),
  difficultyPill: document.getElementById("difficulty-pill"),
  categoryChip: document.getElementById("category-chip"),
  timeChip: document.getElementById("time-chip"),
  questionText: document.getElementById("question-text"),
  questionPrompt: document.getElementById("question-prompt"),
  optionsContainer: document.getElementById("options-container"),
  nextButton: document.getElementById("next-btn"),
  scoreHeading: document.getElementById("score-heading"),
  scoreSummary: document.getElementById("score-summary"),
  scorePercent: document.getElementById("score-percent"),
  bestCategory: document.getElementById("best-category"),
  levelReached: document.getElementById("level-reached"),
  feedbackText: document.getElementById("feedback-text"),
  practiceFromResultButton: document.getElementById("practice-from-result-btn"),
  restartFullButton: document.getElementById("restart-full-btn"),
  backHomeButton: document.getElementById("back-home-btn")
};

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildNumericQuestion(level, variant) {
  if (level <= 2) {
    const start = 8 + level * 3 + variant;
    const step = 2 + level + (variant % 2);
    const sequence = [start, start + step, start + step * 2, start + step * 3];
    const answer = String(start + step * 4);
    return {
      category: "Numerisk",
      title: "Finn neste tall",
      prompt: `Hvilket tall kommer videre i rekken ${sequence.join(", ")}?`,
      options: shuffle([answer, String(Number(answer) + step), String(Number(answer) - 2), String(Number(answer) + 5)]),
      answer,
      difficulty: level,
      recommendedTime: 35 + level * 10
    };
  }

  if (level <= 5) {
    const base = 12 + level * 4 + variant;
    const increments = [3 + (variant % 2), 6 + (variant % 3), 12 + (variant % 4)];
    const sequence = [base];
    increments.forEach((value) => sequence.push(sequence[sequence.length - 1] + value));
    const answerValue = sequence[sequence.length - 1] + (24 + variant * 2);
    const answer = String(answerValue);
    return {
      category: "Numerisk",
      title: "Se mønsteret",
      prompt: `Økningen endrer seg for hvert steg. Hvilket tall kommer etter ${sequence.join(", ")}?`,
      options: shuffle([answer, String(answerValue + 6), String(answerValue - 3), String(answerValue + 12)]),
      answer,
      difficulty: level,
      recommendedTime: 45 + level * 10
    };
  }

  const a = 2 + level + (variant % 2);
  const b = 3 + level;
  const c = 5 + level + variant;
  const answerValue = a * b + c * 2;
  const answer = String(answerValue);
  return {
    category: "Numerisk",
    title: "Hvilket svar er riktig?",
    prompt: `Regn ut uttrykket ${a} x ${b} + ${c} x 2.`,
    options: shuffle([answer, String(answerValue + level), String(answerValue - 4), String(answerValue + 6)]),
    answer,
    difficulty: level,
    recommendedTime: 55 + level * 8
  };
}

function buildVerbalQuestion(level, variant) {
  const analogySets = [
    { stem: "bok er til lese som gaffel er til", answer: "spise", distractors: ["skrive", "kutte", "vaske"] },
    { stem: "kompass er til retning som termometer er til", answer: "temperatur", distractors: ["tid", "vekt", "vind"] },
    { stem: "arkitekt er til bygning som komponist er til", answer: "musikk", distractors: ["teater", "maling", "poesi"] },
    { stem: "frø er til plante som idé er til", answer: "prosjekt", distractors: ["papir", "møte", "regel"] },
    { stem: "mikroskop er til detaljer som kikkert er til", answer: "avstand", distractors: ["lyd", "farge", "vekt"] },
    { stem: "strategi er til plan som improvisasjon er til", answer: "spontanitet", distractors: ["måling", "forsinkelse", "analyse"] },
    { stem: "pilot er til cockpit som kokk er til", answer: "kjøkken", distractors: ["resepsjon", "lager", "garasje"] },
    { stem: "kalender er til dato som klokke er til", answer: "tid", distractors: ["retning", "temperatur", "fart"] }
  ];
  const item = analogySets[(level + variant - 1) % analogySets.length];
  return {
    category: "Verbal",
    title: level <= 3 ? "Ordforståelse" : "Språklig analogi",
    prompt: `Velg ordet som best fullfører analogien: ${item.stem} ...`,
    options: shuffle([item.answer, ...item.distractors]),
    answer: item.answer,
    difficulty: level,
    recommendedTime: 35 + level * 8
  };
}

function buildLogicQuestion(level, variant) {
  if (level <= 3) {
    const patterns = [
      { prompt: "sirkel, trekant, sirkel, trekant, ...", answer: "sirkel", distractors: ["trekant", "kvadrat", "stjerne"] },
      { prompt: "rød, blå, grønn, rød, blå, ...", answer: "grønn", distractors: ["rød", "gul", "lilla"] },
      { prompt: "2, 4, 8, 16, ...", answer: "32", distractors: ["24", "18", "20"] },
      { prompt: "firkant, femkant, sekskant, ...", answer: "syvkant", distractors: ["trekant", "åttekant", "sirkel"] }
    ];
    const item = patterns[(level + variant - 1) % patterns.length];
    return {
      category: "Logisk",
      title: "Mønstergjenkjenning",
      prompt: `Hva kommer videre i mønsteret: ${item.prompt}`,
      options: shuffle([item.answer, ...item.distractors]),
      answer: item.answer,
      difficulty: level,
      recommendedTime: 40 + level * 8
    };
  }

  const statements = [
    {
      prompt: "Alle analytikere er nøyaktige. Nora er analytiker. Hva kan du konkludere?",
      answer: "Nora er nøyaktig",
      distractors: ["Alle nøyaktige er analytikere", "Nora er leder", "Ingen sikre konklusjoner"]
    },
    {
      prompt: "Ingen prosjekter blir levert uten plan. Team X leverte prosjektet sitt. Hva følger logisk?",
      answer: "Team X hadde en plan",
      distractors: ["Planen var perfekt", "Alle team leverer", "Team X er større enn andre team"]
    },
    {
      prompt: "Hvis alle tester er tidsbestemte, og denne oppgaven er en test, hva vet du da?",
      answer: "Oppgaven er tidsbestemt",
      distractors: ["Oppgaven er enkel", "Alle tidsbestemte ting er tester", "Oppgaven kan hoppes over"]
    },
    {
      prompt: "Alle kandidater som trener jevnlig forbedrer seg. Amir trener jevnlig. Hva følger logisk?",
      answer: "Amir forbedrer seg",
      distractors: ["Alle som forbedrer seg trener jevnlig", "Amir består testen", "Ingen sikker konklusjon"]
    },
    {
      prompt: "Ingen rapporter sendes uten kvalitetssjekk. Denne rapporten ble sendt. Hva kan du slutte?",
      answer: "Rapporten ble kvalitetssjekket",
      distractors: ["Rapporten var feilfri", "Alle kvalitetssjekker fører til sending", "Rapporten var kort"]
    }
  ];
  const item = statements[(level + variant - 4) % statements.length];
  return {
    category: "Logisk",
    title: "Velg den beste konklusjonen",
    prompt: item.prompt,
    options: shuffle([item.answer, ...item.distractors]),
    answer: item.answer,
    difficulty: level,
    recommendedTime: 50 + level * 8
  };
}

function buildQuestion(category, level, variant) {
  if (category === "Numerisk") return buildNumericQuestion(level, variant);
  if (category === "Verbal") return buildVerbalQuestion(level, variant);
  return buildLogicQuestion(level, variant);
}

function getPracticeCategories(focusCategory) {
  const others = CATEGORIES.filter((category) => category !== focusCategory);
  if (!focusCategory || others.length !== 2) {
    return PRACTICE_LEVELS.map((_, index) => CATEGORIES[index % CATEGORIES.length]);
  }
  return [
    focusCategory, others[0], focusCategory, others[1],
    focusCategory, others[0], focusCategory, others[1],
    focusCategory, others[0], focusCategory, others[1]
  ];
}

function generateQuestions(mode, focusCategory) {
  if (mode === "practice") {
    const categories = getPracticeCategories(focusCategory);
    return PRACTICE_LEVELS.map((level, index) => ({
      id: `practice-${index + 1}`,
      mode,
      ...buildQuestion(categories[index], level, index)
    }));
  }

  return FULL_TEST_LEVELS.map((level, index) => {
    const category = CATEGORIES[index % CATEGORIES.length];
    return {
      id: `full-${index + 1}`,
      mode,
      ...buildQuestion(category, level, Math.floor(index / CATEGORIES.length))
    };
  });
}

function createEmptyCategoryScores() {
  return {
    Numerisk: { correct: 0, total: 0 },
    Verbal: { correct: 0, total: 0 },
    Logisk: { correct: 0, total: 0 }
  };
}

function getSummary(percent) {
  if (percent >= 80) return "Sterk prestasjon. Du håndterer også de vanskeligere oppgavene godt.";
  if (percent >= 60) return "Solid nivå. Du har et godt grunnlag og kan forbedre resultatet med noen målrettede økter.";
  return "Fin start. Nå ser du tydelig hvilke oppgavetyper som trenger mest trening.";
}

function getFeedback(percent, weakestCategory, sessionType) {
  if (sessionType === "practice") {
    return `Denne økten var skreddersydd for ${weakestCategory.toLowerCase()}. Fortsett med korte økter til treffsikkerheten blir jevnere.`;
  }
  if (percent >= 80) {
    return "Neste steg er å legge inn strengere tidspress og flere spørsmål på nivå 7 og 8.";
  }
  return `Neste økt bør fokusere på ${weakestCategory.toLowerCase()}. Prioriter å identifisere mønsteret raskt før du velger svar.`;
}

function buildResults(answers, sessionType) {
  const correct = answers.filter((item) => item.correct).length;
  const percent = Math.round((correct / answers.length) * 100);
  const categoryScores = answers.reduce((accumulator, item) => {
    accumulator[item.category].total += 1;
    if (item.correct) {
      accumulator[item.category].correct += 1;
    }
    return accumulator;
  }, createEmptyCategoryScores());

  const rankedCategories = Object.entries(categoryScores).sort((left, right) => {
    const leftScore = left[1].total ? left[1].correct / left[1].total : 0;
    const rightScore = right[1].total ? right[1].correct / right[1].total : 0;
    return rightScore - leftScore;
  });

  const strongest = rankedCategories[0];
  const weakest = [...rankedCategories].reverse()[0];
  const highestLevel = Math.max(...answers.filter((item) => item.correct).map((item) => item.difficulty), 0);

  return {
    correct,
    total: answers.length,
    percent,
    strongestCategory: strongest ? strongest[0] : "Ingen ennå",
    weakestCategory: weakest ? weakest[0] : "Numerisk",
    highestLevel: highestLevel ? `Nivå ${highestLevel}` : "Startnivå",
    categoryScores,
    summary: getSummary(percent),
    feedback: getFeedback(percent, weakest ? weakest[0] : "Numerisk", sessionType)
  };
}

function buildProfileInsights(profile) {
  const history = profile?.history || [];
  if (!history.length) {
    return {
      sessions: 0,
      averagePercent: 0,
      latestPercent: null,
      bestPercent: null,
      weakestCategory: "Numerisk"
    };
  }

  const averagePercent = Math.round(history.reduce((sum, session) => sum + session.percent, 0) / history.length);
  const latestPercent = history[history.length - 1].percent;
  const bestPercent = Math.max(...history.map((session) => session.percent));
  const categoryScores = history.reduce((accumulator, session) => {
    CATEGORIES.forEach((category) => {
      const current = session.categoryScores?.[category];
      if (current) {
        accumulator[category].correct += current.correct;
        accumulator[category].total += current.total;
      }
    });
    return accumulator;
  }, createEmptyCategoryScores());

  const weakestCategory = Object.entries(categoryScores).sort((left, right) => {
    const leftScore = left[1].total ? left[1].correct / left[1].total : 1;
    const rightScore = right[1].total ? right[1].correct / right[1].total : 1;
    return leftScore - rightScore;
  })[0]?.[0] || "Numerisk";

  return { sessions: history.length, averagePercent, latestPercent, bestPercent, weakestCategory };
}

function formatDateLabel(isoString) {
  return new Date(isoString).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" });
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      profiles: state.profiles,
      activeProfileId: state.activeProfileId
    })
  );
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state.profiles = Array.isArray(parsed.profiles) ? parsed.profiles : [];
    state.activeProfileId = parsed.activeProfileId || state.profiles[0]?.id || null;
  } catch {
    state.profiles = [];
    state.activeProfileId = null;
  }
}

function getActiveProfile() {
  return state.profiles.find((profile) => profile.id === state.activeProfileId) || null;
}

function switchScreen(screen) {
  state.screen = screen;
  elements.homeScreen.classList.toggle("active", screen === "home");
  elements.historyScreen.classList.toggle("active", screen === "home");
  elements.quizScreen.classList.toggle("active", screen === "quiz");
  elements.resultScreen.classList.toggle("active", screen === "result");
}

function renderProfiles() {
  elements.profilesList.innerHTML = "";
  state.profiles.forEach((profile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `profile-chip${profile.id === state.activeProfileId ? " selected" : ""}`;
    button.textContent = profile.name;
    button.addEventListener("click", () => {
      state.activeProfileId = profile.id;
      saveState();
      renderHome();
    });
    elements.profilesList.appendChild(button);
  });
}

function renderHistory(profile, insights) {
  if (!profile) {
    elements.historySummary.innerHTML = "";
    elements.historyList.innerHTML = "<p class='empty-copy'>Velg eller lag en bruker for å se historikk.</p>";
    return;
  }

  elements.historySummary.innerHTML = `
    <article><span>${insights.sessions}</span><p>økter</p></article>
    <article><span>${insights.averagePercent}%</span><p>snitt</p></article>
    <article><span>${insights.weakestCategory}</span><p>fokus</p></article>
  `;

  const recentSessions = [...(profile.history || [])].slice(-4).reverse();
  if (!recentSessions.length) {
    elements.historyList.innerHTML = "<p class='empty-copy'>Historikken fylles opp etter første gjennomførte test.</p>";
    return;
  }

  elements.historyList.innerHTML = recentSessions.map((session) => `
    <article class="history-item">
      <div>
        <strong>${session.type === "practice" ? "Fokusøkt" : "Full test"} · ${formatDateLabel(session.completedAt)}</strong>
        <p>${session.percent}% riktig · sterkest i ${session.strongestCategory.toLowerCase()}</p>
      </div>
      <span class="history-tag">${session.weakestCategory}</span>
    </article>
  `).join("");
}

function renderHome() {
  const activeProfile = getActiveProfile();
  const insights = buildProfileInsights(activeProfile);

  renderProfiles();
  switchScreen("home");

  if (!activeProfile) {
    elements.welcomeTitle.textContent = "Velg en bruker for å starte";
    elements.welcomeCopy.textContent = "Når du har valgt en profil kan du kjøre full test eller en fokusøkt for det du strever mest med.";
    elements.insightBox.classList.add("hidden");
    elements.startFullButton.disabled = true;
    elements.startPracticeButton.disabled = true;
    renderHistory(null, insights);
    return;
  }

  elements.welcomeTitle.textContent = `Klar for neste økt, ${activeProfile.name}?`;
  elements.welcomeCopy.textContent = "Full test gir bred trening. Fokusøkt vekter spørsmål mot kategorien du historisk har slitt mest med.";
  elements.insightBox.classList.remove("hidden");
  elements.insightText.textContent = insights.sessions
    ? `Siste resultat ${insights.latestPercent}%, beste resultat ${insights.bestPercent}% og mest behov for øving i ${insights.weakestCategory.toLowerCase()}.`
    : "Ingen lagrede tester ennå. Start med en full test for å bygge første profil.";
  elements.startFullButton.disabled = false;
  elements.startPracticeButton.disabled = false;
  renderHistory(activeProfile, insights);
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  const progress = ((state.currentIndex + 1) / state.questions.length) * 100;

  elements.sessionLabel.textContent = state.sessionType === "practice" ? "Fokusøkt" : "Full test";
  elements.progressText.textContent = `Spørsmål ${state.currentIndex + 1} av ${state.questions.length}`;
  elements.progressBar.style.width = `${progress}%`;
  elements.difficultyPill.textContent = `Nivå ${question.difficulty}`;
  elements.categoryChip.textContent = question.category;
  elements.timeChip.textContent = `Anbefalt: ${question.recommendedTime} sek`;
  elements.questionText.textContent = question.title;
  elements.questionPrompt.textContent = question.prompt;
  elements.optionsContainer.innerHTML = "";
  elements.nextButton.disabled = true;
  state.selectedOption = null;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => {
      state.selectedOption = option;
      elements.nextButton.disabled = false;
      [...elements.optionsContainer.children].forEach((child) => child.classList.remove("selected"));
      button.classList.add("selected");
    });
    elements.optionsContainer.appendChild(button);
  });
}

function startSession(type, focusCategory) {
  const activeProfile = getActiveProfile();
  if (!activeProfile) return;
  const insights = buildProfileInsights(activeProfile);
  state.sessionType = type;
  state.questions = generateQuestions(type, focusCategory || insights.weakestCategory);
  state.currentIndex = 0;
  state.answers = [];
  state.lastResult = null;
  switchScreen("quiz");
  renderQuestion();
}

function showResults() {
  const activeProfile = getActiveProfile();
  const result = buildResults(state.answers, state.sessionType);
  state.lastResult = result;

  const session = {
    id: `session-${Date.now()}`,
    type: state.sessionType,
    completedAt: new Date().toISOString(),
    ...result
  };

  state.profiles = state.profiles.map((profile) =>
    profile.id === state.activeProfileId
      ? { ...profile, history: [...(profile.history || []), session] }
      : profile
  );
  saveState();

  elements.scoreHeading.textContent = `${activeProfile.name} fikk ${result.correct} av ${result.total} riktige`;
  elements.scoreSummary.textContent = result.summary;
  elements.scorePercent.textContent = `${result.percent}%`;
  elements.bestCategory.textContent = result.strongestCategory;
  elements.levelReached.textContent = result.highestLevel;
  elements.feedbackText.textContent = result.feedback;

  switchScreen("result");
}

function handleNext() {
  const question = state.questions[state.currentIndex];
  state.answers.push({
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    correct: state.selectedOption === question.answer
  });

  if (state.currentIndex === state.questions.length - 1) {
    showResults();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
}

function addProfile() {
  const name = elements.profileNameInput.value.trim();
  if (!name) return;
  const profile = {
    id: `profile-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    history: []
  };
  state.profiles.push(profile);
  state.activeProfileId = profile.id;
  elements.profileNameInput.value = "";
  saveState();
  renderHome();
}

elements.addProfileButton.addEventListener("click", addProfile);
elements.profileNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addProfile();
});
elements.startFullButton.addEventListener("click", () => startSession("full"));
elements.startPracticeButton.addEventListener("click", () => {
  const insights = buildProfileInsights(getActiveProfile());
  startSession("practice", insights.weakestCategory);
});
elements.nextButton.addEventListener("click", handleNext);
elements.practiceFromResultButton.addEventListener("click", () => {
  if (state.lastResult) startSession("practice", state.lastResult.weakestCategory);
});
elements.restartFullButton.addEventListener("click", () => startSession("full"));
elements.backHomeButton.addEventListener("click", renderHome);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

loadState();
renderHome();

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

const QUESTION_BANK = {
  Numerisk: [
    { id: "n1", difficulty: 1, recommendedTime: 35, title: "Finn neste tall", prompt: "Hvilket tall kommer videre i rekken 12, 15, 18, 21, ...?", options: ["24", "23", "25", "27"], answer: "24" },
    { id: "n2", difficulty: 1, recommendedTime: 35, title: "Finn neste tall", prompt: "Hvilket tall kommer videre i rekken 4, 9, 16, 25, ...?", options: ["36", "30", "35", "49"], answer: "36" },
    { id: "n3", difficulty: 2, recommendedTime: 40, title: "Mønster i rekken", prompt: "Hvilket tall kommer videre i rekken 3, 6, 12, 24, ...?", options: ["48", "30", "36", "42"], answer: "48" },
    { id: "n4", difficulty: 2, recommendedTime: 40, title: "Prosentregning", prompt: "Hva er 25 % av 240?", options: ["60", "48", "72", "80"], answer: "60" },
    { id: "n5", difficulty: 3, recommendedTime: 45, title: "Tallfølge med skiftende hopp", prompt: "Hvilket tall kommer videre i rekken 14, 13, 11, 8, 4, ...?", options: ["-1", "0", "1", "2"], answer: "-1" },
    { id: "n6", difficulty: 3, recommendedTime: 45, title: "Gjennomsnitt", prompt: "Hva er gjennomsnittet av 14, 18, 23 og 25?", options: ["20", "19", "21", "22"], answer: "20" },
    { id: "n7", difficulty: 4, recommendedTime: 50, title: "Forhold og andeler", prompt: "Forholdet mellom røde og blå perler er 3:2. Hvis det er 25 perler totalt, hvor mange er blå?", options: ["10", "12", "15", "8"], answer: "10" },
    { id: "n8", difficulty: 4, recommendedTime: 50, title: "Fart og avstand", prompt: "Et tog kjører 180 km på 3 timer i samme fart. Hvor langt kjører det på 4,5 timer?", options: ["270 km", "240 km", "300 km", "225 km"], answer: "270 km" },
    { id: "n9", difficulty: 5, recommendedTime: 55, title: "Mønster i rekken", prompt: "Hvilket tall kommer videre i rekken 7, 11, 18, 29, 47, ...?", options: ["76", "74", "78", "82"], answer: "76" },
    { id: "n10", difficulty: 5, recommendedTime: 55, title: "Tallfølge", prompt: "Hvilket tall kommer videre i rekken 2, 6, 12, 20, 30, ...?", options: ["42", "40", "44", "46"], answer: "42" },
    { id: "n11", difficulty: 6, recommendedTime: 60, title: "Pris etter rabatt", prompt: "En jakke koster 800 kr. Den settes ned med 15 %. Hva blir ny pris?", options: ["680 kr", "720 kr", "660 kr", "700 kr"], answer: "680 kr" },
    { id: "n12", difficulty: 6, recommendedTime: 60, title: "Mønster i rekken", prompt: "Hvilket tall kommer videre i rekken 5, 9, 17, 33, ...?", options: ["65", "57", "61", "67"], answer: "65" },
    { id: "n13", difficulty: 7, recommendedTime: 65, title: "Lønn og prosent", prompt: "En årslønn på 500 000 kr øker med 8 %. Hva blir ny årslønn?", options: ["540 000 kr", "508 000 kr", "545 000 kr", "560 000 kr"], answer: "540 000 kr" },
    { id: "n14", difficulty: 7, recommendedTime: 65, title: "Brøk og tid", prompt: "En oppgave tar 3/5 av en time. Hvor mange minutter er det?", options: ["36", "30", "40", "45"], answer: "36" },
    { id: "n15", difficulty: 8, recommendedTime: 70, title: "Flere trinn", prompt: "Et tall dobles og deretter trekkes 7 fra. Resultatet er 29. Hva var tallet?", options: ["18", "11", "16", "14"], answer: "18" },
    { id: "n16", difficulty: 8, recommendedTime: 70, title: "Tallfølge med flere regler", prompt: "Hvilket tall kommer videre i rekken 81, 27, 9, 3, ...?", options: ["1", "0", "6", "9"], answer: "1" }
  ],
  Verbal: [
    { id: "v1", difficulty: 1, recommendedTime: 35, title: "Ordrelasjon", prompt: "Hvilket ord passer best: bok er til lese som gaffel er til ...", options: ["spise", "tegne", "skrive", "vaske"], answer: "spise" },
    { id: "v2", difficulty: 1, recommendedTime: 35, title: "Finn avvikeren", prompt: "Hvilket ord skiller seg ut? eple, pære, plomme, gulrot", options: ["gulrot", "eple", "pære", "plomme"], answer: "gulrot" },
    { id: "v3", difficulty: 2, recommendedTime: 40, title: "Synonym", prompt: "Hvilket ord betyr omtrent det samme som «presis»?", options: ["nøyaktig", "rask", "høflig", "kraftig"], answer: "nøyaktig" },
    { id: "v4", difficulty: 2, recommendedTime: 40, title: "Ordrelasjon", prompt: "Hvilket ord passer best: kompass er til retning som termometer er til ...", options: ["temperatur", "styrke", "avstand", "fart"], answer: "temperatur" },
    { id: "v5", difficulty: 3, recommendedTime: 45, title: "Antonym", prompt: "Hvilket ord betyr det motsatte av «midlertidig»?", options: ["permanent", "kort", "uklar", "enkel"], answer: "permanent" },
    { id: "v6", difficulty: 3, recommendedTime: 45, title: "Finn riktig par", prompt: "Hvilket ordpar har samme relasjon som arkitekt : bygning?", options: ["komponist : musikk", "sjåfør : vei", "forfatter : blyant", "svømmer : vann"], answer: "komponist : musikk" },
    { id: "v7", difficulty: 4, recommendedTime: 50, title: "Setningsforståelse", prompt: "Velg ordet som passer best i setningen: «Hun var så ___ i arbeidet sitt at ingen detaljer ble oversett.»", options: ["grundig", "tilfeldig", "stille", "kort"], answer: "grundig" },
    { id: "v8", difficulty: 4, recommendedTime: 50, title: "Finn avvikeren", prompt: "Hvilket ord skiller seg ut? violin, cello, piano, trompet", options: ["piano", "violin", "cello", "trompet"], answer: "piano" },
    { id: "v9", difficulty: 5, recommendedTime: 55, title: "Begrepsforståelse", prompt: "Hvilket ord beskriver best noe som er «omfattende»?", options: ["vidtrekkende", "midlertidig", "skjult", "presist"], answer: "vidtrekkende" },
    { id: "v10", difficulty: 5, recommendedTime: 55, title: "Ordrelasjon", prompt: "Hvilket ord passer best: frø er til plante som idé er til ...", options: ["prosjekt", "møte", "regel", "papir"], answer: "prosjekt" },
    { id: "v11", difficulty: 6, recommendedTime: 60, title: "Språklig analogi", prompt: "Hvilket ord passer best: strategi er til plan som improvisasjon er til ...", options: ["spontanitet", "analyse", "måling", "forsinkelse"], answer: "spontanitet" },
    { id: "v12", difficulty: 6, recommendedTime: 60, title: "Presis betydning", prompt: "Hvilket ord betyr omtrent det samme som «begrense»?", options: ["avgrense", "forklare", "utvide", "forsterke"], answer: "avgrense" },
    { id: "v13", difficulty: 7, recommendedTime: 65, title: "Begrepspar", prompt: "Hvilket ordpar har nærmest samme forhold som kalender : dato?", options: ["klokke : tid", "kart : bil", "komfyr : varme", "blyant : papir"], answer: "klokke : tid" },
    { id: "v14", difficulty: 7, recommendedTime: 65, title: "Språknyanse", prompt: "Hvilket ord passer best dersom noe er både gjennomtenkt og velbegrunnet?", options: ["reflektert", "hastig", "uklar", "ensidig"], answer: "reflektert" },
    { id: "v15", difficulty: 8, recommendedTime: 70, title: "Analogisk resonnement", prompt: "Hvilket ord passer best: pilot er til cockpit som kokk er til ...", options: ["kjøkken", "lager", "resepsjon", "garasje"], answer: "kjøkken" },
    { id: "v16", difficulty: 8, recommendedTime: 70, title: "Begrepsforståelse", prompt: "Hvilket ord beskriver best noe som er «konsekvent»?", options: ["sammenhengende", "tilfeldig", "urolig", "sjeldent"], answer: "sammenhengende" }
  ],
  Logisk: [
    { id: "l1", difficulty: 1, recommendedTime: 35, title: "Mønstergjenkjenning", prompt: "Hva kommer videre i mønsteret: sirkel, trekant, sirkel, trekant, ...", options: ["sirkel", "trekant", "kvadrat", "stjerne"], answer: "sirkel" },
    { id: "l2", difficulty: 1, recommendedTime: 35, title: "Mønstergjenkjenning", prompt: "Hva kommer videre i mønsteret: rød, blå, grønn, rød, blå, ...", options: ["grønn", "rød", "gul", "lilla"], answer: "grønn" },
    { id: "l3", difficulty: 2, recommendedTime: 40, title: "Bokstavmønster", prompt: "Hva kommer videre i rekken A, C, E, G, ...?", options: ["I", "H", "J", "K"], answer: "I" },
    { id: "l4", difficulty: 2, recommendedTime: 40, title: "Mønstergjenkjenning", prompt: "Hva kommer videre i mønsteret: 2, 4, 8, 16, ...", options: ["32", "24", "18", "20"], answer: "32" },
    { id: "l5", difficulty: 3, recommendedTime: 45, title: "Rekkefølge", prompt: "Anna er eldre enn Bo, og Bo er eldre enn Camilla. Hvem er yngst?", options: ["Camilla", "Anna", "Bo", "Kan ikke avgjøres"], answer: "Camilla" },
    { id: "l6", difficulty: 3, recommendedTime: 45, title: "Plassering", prompt: "Fire personer står i kø. Dina står foran Emil, men bak Filip. Hvem må stå foran Dina?", options: ["Filip", "Emil", "Ingen", "Begge"], answer: "Filip" },
    { id: "l7", difficulty: 4, recommendedTime: 50, title: "Logisk konklusjon", prompt: "Alle analytikere er nøyaktige. Nora er analytiker. Hva følger logisk?", options: ["Nora er nøyaktig", "Alle nøyaktige er analytikere", "Nora er leder", "Ingen sikker konklusjon"], answer: "Nora er nøyaktig" },
    { id: "l8", difficulty: 4, recommendedTime: 50, title: "Logisk konklusjon", prompt: "Ingen prosjekter leveres uten plan. Team X leverte prosjektet sitt. Hva følger logisk?", options: ["Team X hadde en plan", "Planen var perfekt", "Alle team leverer", "Ingen sikker konklusjon"], answer: "Team X hadde en plan" },
    { id: "l9", difficulty: 5, recommendedTime: 55, title: "Sann/usann", prompt: "Hvis alle tester er tidsbestemte, og denne oppgaven er en test, hva vet du da?", options: ["Oppgaven er tidsbestemt", "Oppgaven er enkel", "Alle tidsbestemte ting er tester", "Oppgaven kan hoppes over"], answer: "Oppgaven er tidsbestemt" },
    { id: "l10", difficulty: 5, recommendedTime: 55, title: "Utelukkelse", prompt: "Tre personer skal sitte ved siden av hverandre: Kari, Lars og Mona. Mona kan ikke sitte i midten. Hvilken plassering er mulig?", options: ["Kari, Lars, Mona", "Lars, Mona, Kari", "Mona, Lars, Kari", "Kari, Mona, Lars"], answer: "Kari, Lars, Mona" },
    { id: "l11", difficulty: 6, recommendedTime: 60, title: "Planlegging", prompt: "Et møte må holdes før rapporten skrives, og rapporten må skrives før presentasjonen. Hva må skje først?", options: ["Møtet", "Rapporten", "Presentasjonen", "Det kan ikke avgjøres"], answer: "Møtet" },
    { id: "l12", difficulty: 6, recommendedTime: 60, title: "Logisk resonnement", prompt: "Alle kandidater som trener jevnlig forbedrer seg. Amir trener jevnlig. Hva følger logisk?", options: ["Amir forbedrer seg", "Alle som forbedrer seg trener jevnlig", "Amir består testen", "Ingen sikker konklusjon"], answer: "Amir forbedrer seg" },
    { id: "l13", difficulty: 7, recommendedTime: 65, title: "Betinget resonnement", prompt: "Hvis det regner, blir bakken våt. Bakken er ikke våt. Hva kan du konkludere?", options: ["Det regner ikke", "Det regner", "Det har regnet tidligere", "Ingen sikker konklusjon"], answer: "Det regner ikke" },
    { id: "l14", difficulty: 7, recommendedTime: 65, title: "Kategorilogikk", prompt: "Alle roser er blomster. Noen blomster visner raskt. Hvilken påstand må være sann?", options: ["Roser er blomster", "Alle blomster er roser", "Noen roser visner raskt", "Ingen blomster visner"], answer: "Roser er blomster" },
    { id: "l15", difficulty: 8, recommendedTime: 70, title: "Flere regler samtidig", prompt: "Per kommer etter Oda i køen, men før Sara. Lars står foran Oda. Hvem står bakerst av disse fire?", options: ["Sara", "Per", "Oda", "Lars"], answer: "Sara" },
    { id: "l16", difficulty: 8, recommendedTime: 70, title: "Logisk konklusjon", prompt: "Ingen rapporter sendes uten kvalitetssjekk. Denne rapporten ble sendt. Hva kan du slutte?", options: ["Rapporten ble kvalitetssjekket", "Rapporten var feilfri", "Alle kvalitetssjekker fører til sending", "Rapporten var kort"], answer: "Rapporten ble kvalitetssjekket" }
  ]
};

function cloneQuestion(question, category) {
  return {
    id: question.id,
    category,
    difficulty: question.difficulty,
    recommendedTime: question.recommendedTime,
    title: question.title,
    prompt: question.prompt,
    answer: question.answer,
    options: shuffle([...question.options])
  };
}

function pickQuestion(category, targetDifficulty, usedIds) {
  const available = QUESTION_BANK[category].filter((question) => !usedIds.has(question.id));
  const ranked = available.sort((left, right) => {
    const leftDiff = Math.abs(left.difficulty - targetDifficulty);
    const rightDiff = Math.abs(right.difficulty - targetDifficulty);
    if (leftDiff !== rightDiff) return leftDiff - rightDiff;
    return left.difficulty - right.difficulty;
  });
  const choice = ranked[0] || QUESTION_BANK[category][0];
  usedIds.add(choice.id);
  return cloneQuestion(choice, category);
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
  const usedIds = {
    Numerisk: new Set(),
    Verbal: new Set(),
    Logisk: new Set()
  };

  if (mode === "practice") {
    const categories = getPracticeCategories(focusCategory);
    return PRACTICE_LEVELS.map((level, index) => ({
      id: `practice-${index + 1}`,
      mode,
      ...pickQuestion(categories[index], level, usedIds[categories[index]])
    }));
  }

  return FULL_TEST_LEVELS.map((level, index) => {
    const category = CATEGORIES[index % CATEGORIES.length];
    return {
      id: `full-${index + 1}`,
      mode,
      ...pickQuestion(category, level, usedIds[category])
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

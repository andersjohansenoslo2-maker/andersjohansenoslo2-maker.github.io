const STORAGE_KEY = "evnetest-trener-web-v1";
const APP_VERSION = "20260402f";
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
  reviewMode: false,
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
  subtypeChip: document.getElementById("subtype-chip"),
  timeChip: document.getElementById("time-chip"),
  questionText: document.getElementById("question-text"),
  questionPrompt: document.getElementById("question-prompt"),
  optionsContainer: document.getElementById("options-container"),
  answerReview: document.getElementById("answer-review"),
  answerStatus: document.getElementById("answer-status"),
  answerCorrect: document.getElementById("answer-correct"),
  answerExplanation: document.getElementById("answer-explanation"),
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
    { id: "n12", difficulty: 6, recommendedTime: 60, title: "Mønster i rekken", prompt: "Hvilket tall kommer videre i rekken 6, 12, 24, 48, ...?", options: ["96", "72", "84", "108"], answer: "96" },
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

const EXPLANATION_BY_ID = {
  n1: "Her øker rekken med 3 hver gang. 21 + 3 = 24.",
  n2: "Tallene er kvadrattall: 2², 3², 4², 5². Neste blir 6² = 36.",
  n3: "Hvert tall dobles. 24 ganger 2 gir 48.",
  n4: "25 prosent er en fjerdedel. 240 delt på 4 er 60.",
  n5: "Du trekker fra 1, så 2, så 3, så 4. Neste steg er minus 5, så svaret blir -1.",
  n6: "Legg sammen tallene: 14 + 18 + 23 + 25 = 80. Del på 4, så får du 20.",
  n7: "Forholdet 3:2 betyr 5 like deler totalt. 25 delt på 5 er 5 per del, og blå er 2 deler: 10.",
  n8: "Toget kjører 180 delt på 3 = 60 km/t. På 4,5 timer blir det 60 ganger 4,5 = 270 km.",
  n9: "Hvert nytt tall er summen av de to foregående. 29 + 47 = 76.",
  n10: "Forskjellene er 4, 6, 8 og 10. Neste forskjell er 12, så 30 + 12 = 42.",
  n11: "15 prosent av 800 er 120. 800 - 120 = 680.",
  n12: "Hvert tall dobles. 6 blir 12, 12 blir 24, 24 blir 48, så neste tall er 96.",
  n13: "8 prosent av 500 000 er 40 000. Ny lønn blir 540 000.",
  n14: "Tre femtedeler av 60 minutter er 36 minutter.",
  n15: "Tenk baklengs: 29 + 7 = 36, og 36 delt på 2 er 18.",
  n16: "Hvert tall deles på 3. 81, 27, 9, 3, 1.",
  v1: "Se etter funksjon: en bok brukes til å lese, og en gaffel brukes til å spise.",
  v2: "Tre ord er frukt. Gulrot er grønnsak og skiller seg ut.",
  v3: "Presis og nøyaktig betyr omtrent det samme i denne sammenhengen.",
  v4: "Kompass måler retning, termometer måler temperatur.",
  v5: "Midlertidig betyr ikke varig. Det motsatte er permanent.",
  v6: "En arkitekt lager bygninger, en komponist lager musikk.",
  v7: "Setningen handler om å ikke overse detaljer. Da passer grundig best.",
  v8: "Violin, cello og trompet er instrumenter man vanligvis holder og spiller enkelttoner på. Piano skiller seg ut som tangentinstrument.",
  v9: "Omfattende betyr at noe dekker mye eller har stor bredde, altså vidtrekkende.",
  v10: "Et frø utvikler seg til en plante. En idé kan utvikle seg til et prosjekt.",
  v11: "Strategi henger sammen med planlegging. Improvisasjon henger sammen med spontanitet.",
  v12: "Å begrense er å sette grenser for noe, altså å avgrense.",
  v13: "Kalender viser dato på samme måte som klokke viser tid.",
  v14: "Noe som er både gjennomtenkt og velbegrunnet beskrives best som reflektert.",
  v15: "Piloten jobber i cockpit. Kokken jobber på kjøkkenet.",
  v16: "Konsekvent handler om at noe henger sammen og gjøres på samme måte over tid.",
  l1: "Mønsteret veksler mellom sirkel og trekant, så neste figur blir sirkel.",
  l2: "Fargene går i repeterende rekkefølge: rød, blå, grønn.",
  l3: "Bokstavene hopper over én bokstav hver gang: A, C, E, G, I.",
  l4: "Tallene dobles for hvert steg: 2, 4, 8, 16, 32.",
  l5: "Hvis Anna er eldre enn Bo og Bo er eldre enn Camilla, må Camilla være yngst.",
  l6: "Dina står bak Filip og foran Emil. Da må Filip stå foran Dina.",
  l7: "Hvis alle analytikere er nøyaktige, gjelder det også Nora når hun er analytiker.",
  l8: "Hvis ingen prosjekter leveres uten plan, må et levert prosjekt ha hatt en plan.",
  l9: "Dette er en direkte regel: alle tester er tidsbestemte. Oppgaven er en test, altså er den tidsbestemt.",
  l10: "Mona kan ikke sitte i midten. Av alternativene er bare Kari, Lars, Mona mulig.",
  l11: "Reglene sier møte før rapport og rapport før presentasjon. Derfor må møtet skje først.",
  l12: "Alle som trener jevnlig forbedrer seg. Amir trener jevnlig, altså forbedrer han seg.",
  l13: "Hvis regn alltid fører til våt bakke, og bakken ikke er våt, kan det ikke regne nå.",
  l14: "Den eneste påstanden som alltid følger av premisset, er at roser er blomster.",
  l15: "Lars står foran Oda, Oda står foran Per, og Per står foran Sara. Da står Sara bakerst.",
  l16: "Hvis ingen rapporter sendes uten kvalitetssjekk, må en sendt rapport ha blitt kvalitetssjekket."
};

function cloneQuestion(question, category) {
  return {
    id: question.id,
    category,
    subtype: question.subtype || "Generell",
    difficulty: question.difficulty,
    recommendedTime: question.recommendedTime,
    title: question.title,
    prompt: question.prompt,
    answer: question.answer,
    explanation: question.explanation || EXPLANATION_BY_ID[question.id] || "Se etter hovedregelen i oppgaven og test den mot hvert svaralternativ.",
    options: shuffle([...question.options])
  };
}

function subtypeCategory(subtype) {
  const map = {
    Tallmønster: "Numerisk",
    Kvadrattall: "Numerisk",
    Prosent: "Numerisk",
    Forhold: "Numerisk",
    Fart: "Numerisk",
    Rabatt: "Numerisk",
    Deling: "Numerisk",
    Regnerekkefølge: "Numerisk",
    Baklengsregning: "Numerisk",
    Ordforråd: "Verbal",
    Antonym: "Verbal",
    Analogi: "Verbal",
    Avviker: "Verbal",
    Setningsforståelse: "Verbal",
    Begrepsforståelse: "Verbal",
    Mønstergjenkjenning: "Logisk",
    Bokstavmønster: "Logisk",
    Rekkefølge: "Logisk",
    Plassering: "Logisk",
    Konklusjon: "Logisk",
    Betingelser: "Logisk",
    Planlegging: "Logisk",
    Kategorilogikk: "Logisk",
    Utelukkelse: "Logisk"
  };
  return map[subtype] || "Numerisk";
}

function createOptions(answer, distractors) {
  return shuffle([answer, ...distractors.map(String)]);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numericVariant(level, variant, preferredSubtype) {
  const templates = [
    () => {
      const start = 8 + ((variant * 3) % 9);
      const step = 2 + (variant % 4);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const answer = String(start + step * 4);
      return {
        id: `num-a-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 35 + level * 4,
        subtype: "Tallmønster",
        title: "Finn neste tall",
        prompt: `Hvilket tall kommer videre i rekken ${seq.join(", ")}?`,
        answer,
        options: createOptions(answer, [Number(answer) + 1, Number(answer) - step, Number(answer) + step]),
        explanation: `Her øker rekken med ${step} hver gang. ${seq[3]} + ${step} = ${answer}.`
      };
    },
    () => {
      const base = 3 + (variant % 4);
      const seq = [base, base * 2, base * 4, base * 8];
      const answer = String(base * 16);
      return {
        id: `num-b-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 40 + level * 4,
        subtype: "Tallmønster",
        title: "Mønster i rekken",
        prompt: `Hvilket tall kommer videre i rekken ${seq.join(", ")}?`,
        answer,
        options: createOptions(answer, [Number(answer) - base, Number(answer) + base * 2, Number(answer) - base * 3]),
        explanation: "Hvert tall dobles. Når du ser at alle hoppene er ganger 2, blir neste tall enkelt å finne."
      };
    },
    () => {
      const n = 2 + (variant % 5);
      const seq = [n * n, (n + 1) * (n + 1), (n + 2) * (n + 2), (n + 3) * (n + 3)];
      const answer = String((n + 4) * (n + 4));
      return {
        id: `num-c-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 42 + level * 4,
        subtype: "Kvadrattall",
        title: "Kvadrattall",
        prompt: `Hvilket tall kommer videre i rekken ${seq.join(", ")}?`,
        answer,
        options: createOptions(answer, [Number(answer) - 1, Number(answer) + 4, (n + 5) * (n + 5)]),
        explanation: "Dette er kvadrattall etter hverandre. Finn neste heltall og gang det med seg selv."
      };
    },
    () => {
      const total = 120 + (variant % 5) * 40;
      const percent = [10, 20, 25, 30][variant % 4];
      const answer = String((total * percent) / 100);
      return {
        id: `num-d-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 45 + level * 4,
        subtype: "Prosent",
        title: "Prosentregning",
        prompt: `Hva er ${percent} % av ${total}?`,
        answer,
        options: createOptions(answer, [answer * 1 + total / 10, answer * 1 - total / 20, total / 2]),
        explanation: `Gjør prosent om til en andel av totalen. ${percent} % av ${total} blir ${answer}.`
      };
    },
    () => {
      const a = 10 + (variant % 8);
      const b = a + 4 + (variant % 3);
      const c = b + 5 + (variant % 2);
      const d = c + 6 + (variant % 4);
      const answer = String(d + 7 + (variant % 3));
      return {
        id: `num-e-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 48 + level * 4,
        subtype: "Tallmønster",
        title: "Tallfølge med økende hopp",
        prompt: `Hvilket tall kommer videre i rekken ${a}, ${b}, ${c}, ${d}, ...?`,
        answer,
        options: createOptions(answer, [Number(answer) - 1, Number(answer) + 2, Number(answer) - 3]),
        explanation: "Se på forskjellene mellom tallene. Når hoppene øker jevnt, kan du fortsette samme mønster ett steg til."
      };
    },
    () => {
      const first = 8 + (variant % 6);
      const second = first + 3 + (variant % 3);
      const third = first + second;
      const fourth = second + third;
      const answer = String(third + fourth);
      return {
        id: `num-f-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 52 + level * 4,
        subtype: "Tallmønster",
        title: "Finn mønsteret",
        prompt: `Hvilket tall kommer videre i rekken ${first}, ${second}, ${third}, ${fourth}, ...?`,
        answer,
        options: createOptions(answer, [Number(answer) - 2, Number(answer) + 3, Number(answer) - 5]),
        explanation: "Fra og med tredje ledd er hvert tall summen av de to foregående."
      };
    },
    () => {
      const ratioA = 2 + (variant % 4);
      const ratioB = 3 + (variant % 3);
      const multiplier = 4 + (variant % 4);
      const total = (ratioA + ratioB) * multiplier;
      const answer = String(ratioB * multiplier);
      return {
        id: `num-g-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 55 + level * 4,
        subtype: "Forhold",
        title: "Forhold og andeler",
        prompt: `Forholdet mellom røde og blå perler er ${ratioA}:${ratioB}. Hvis det er ${total} perler totalt, hvor mange er blå?`,
        answer,
        options: createOptions(answer, [ratioA * multiplier, total / 2, ratioB * multiplier + multiplier]),
        explanation: `Legg sammen delene i forholdet og finn hvor stor én del er. Deretter ganger du med blå sin andel.`
      };
    },
    () => {
      const speed = 40 + (variant % 5) * 10;
      const hours1 = 2 + (variant % 3);
      const hours2 = hours1 + 1.5;
      const distance = speed * hours1;
      const answer = String(speed * hours2);
      return {
        id: `num-h-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 58 + level * 4,
        subtype: "Fart",
        title: "Fart og avstand",
        prompt: `Et tog kjører ${distance} km på ${hours1} timer i samme fart. Hvor langt kjører det på ${String(hours2).replace(".", ",")} timer?`,
        answer: `${answer} km`,
        options: createOptions(`${answer} km`, [`${speed * (hours2 - 0.5)} km`, `${distance + speed} km`, `${speed * (hours2 + 0.5)} km`]),
        explanation: `Finn først fart per time ved å dele strekning på tid. Deretter ganger du farten med ny tid.`
      };
    },
    () => {
      const price = 400 + (variant % 6) * 100;
      const discount = [10, 15, 20, 25][variant % 4];
      const answer = `${price - (price * discount) / 100} kr`;
      return {
        id: `num-i-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 60 + level * 4,
        subtype: "Rabatt",
        title: "Pris etter rabatt",
        prompt: `En vare koster ${price} kr. Den settes ned med ${discount} %. Hva blir ny pris?`,
        answer,
        options: createOptions(answer, [`${price - (price * (discount - 5)) / 100} kr`, `${price - (price * (discount + 5)) / 100} kr`, `${price - price / 10} kr`]),
        explanation: `Finn rabattbeløpet først, og trekk det deretter fra opprinnelig pris.`
      };
    },
    () => {
      const original = 14 + (variant % 9);
      const subtract = 5 + (variant % 4);
      const result = original * 2 - subtract;
      return {
        id: `num-j-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 64 + level * 4,
        subtype: "Baklengsregning",
        title: "Jobb baklengs",
        prompt: `Et tall dobles og deretter trekkes ${subtract} fra. Resultatet er ${result}. Hva var tallet?`,
        answer: String(original),
        options: createOptions(String(original), [original - 2, original + 2, original - 1]),
        explanation: `Jobb baklengs: legg først til ${subtract}, og del deretter på 2.`
      };
    },
    () => {
      const total = 150 + (variant % 6) * 30;
      const part = 3 + (variant % 5);
      const answer = String(total / part);
      return {
        id: `num-k-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 52 + level * 4,
        subtype: "Deling",
        title: "Del av helhet",
        prompt: `Et beløp på ${total} kr skal deles likt på ${part} personer. Hvor mye får hver?`,
        answer: `${answer} kr`,
        options: createOptions(`${answer} kr`, [`${Number(answer) + 5} kr`, `${Number(answer) - 5} kr`, `${Number(answer) + 10} kr`]),
        explanation: "Når noe skal deles likt, deler du totalbeløpet på antall personer."
      };
    },
    () => {
      const start = 20 + (variant % 8) * 5;
      const increase = 10 + (variant % 4) * 5;
      const answer = String(start + increase);
      return {
        id: `num-l-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 54 + level * 4,
        subtype: "Prosent",
        title: "Økning i prosent",
        prompt: `Et tall på ${start} øker med ${Math.round((increase / start) * 100)} %. Hva blir det nye tallet?`,
        answer,
        options: createOptions(answer, [start + 5, start + increase + 5, start + increase - 5]),
        explanation: "Finn økningen i tall og legg den til startverdien. Her gir prosentøkningen et konkret tillegg."
      };
    },
    () => {
      const a = 1 + (variant % 4);
      const b = 2 + (variant % 4);
      const c = 3 + (variant % 4);
      const d = 4 + (variant % 4);
      const answer = String((a + b) * c - d);
      return {
        id: `num-m-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 58 + level * 4,
        subtype: "Regnerekkefølge",
        title: "Regnerekkefølge",
        prompt: `Hva er riktig svar på (${a} + ${b}) × ${c} - ${d}?`,
        answer,
        options: createOptions(answer, [Number(answer) + 2, Number(answer) - 2, (a + b + c) * d]),
        explanation: "Start med parentesen, gang deretter, og trekk til slutt fra siste tall."
      };
    },
    () => {
      const base = randomInt(3, 7) + (variant % 2);
      const seq = [base, base + 2, base + 6, base + 12];
      const answer = String(base + 20);
      return {
        id: `num-n-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 56 + level * 4,
        subtype: "Tallmønster",
        title: "Mønster med økende tillegg",
        prompt: `Hvilket tall kommer videre i rekken ${seq.join(", ")}?`,
        answer,
        options: createOptions(answer, [Number(answer) - 2, Number(answer) + 2, Number(answer) + 4]),
        explanation: "Forskjellene er 2, 4, 6. Neste forskjell blir 8, så du legger 8 til siste tall."
      };
    }
  ];

  const generated = templates.map((template) => template());
  const preferred = generated.find((item) => item.subtype === preferredSubtype);
  return preferred || generated[variant % generated.length];
}

function logicVariant(level, variant, preferredSubtype) {
  const people = [
    ["Anna", "Bo", "Camilla"],
    ["Ida", "Jon", "Kari"],
    ["Mia", "Noah", "Ola"],
    ["Per", "Sara", "Tina"]
  ];
  const trio = people[variant % people.length];
  const templates = [
    () => {
      const pattern = ["sirkel", "trekant", "sirkel", "trekant"];
      return {
        id: `log-a-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 35 + level * 4,
        subtype: "Mønstergjenkjenning",
        title: "Mønstergjenkjenning",
        prompt: `Hva kommer videre i mønsteret: ${pattern.join(", ")}, ...?`,
        answer: "sirkel",
        options: createOptions("sirkel", ["trekant", "kvadrat", "stjerne"]),
        explanation: "Mønsteret veksler mellom to figurer, så du fortsetter samme veksling."
      };
    },
    () => {
      const letters = [["A", "C", "E", "G"], ["B", "D", "F", "H"], ["C", "E", "G", "I"]][variant % 3];
      const answer = String.fromCharCode(letters[3].charCodeAt(0) + 2);
      return {
        id: `log-b-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 40 + level * 4,
        subtype: "Bokstavmønster",
        title: "Bokstavmønster",
        prompt: `Hva kommer videre i rekken ${letters.join(", ")}, ...?`,
        answer,
        options: createOptions(answer, [String.fromCharCode(answer.charCodeAt(0) - 1), String.fromCharCode(answer.charCodeAt(0) + 1), String.fromCharCode(answer.charCodeAt(0) + 2)]),
        explanation: "Bokstavene hopper over én bokstav hver gang. Fortsett samme hopp."
      };
    },
    () => {
      return {
        id: `log-c-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 45 + level * 4,
        subtype: "Rekkefølge",
        title: "Rekkefølge",
        prompt: `${trio[0]} er eldre enn ${trio[1]}, og ${trio[1]} er eldre enn ${trio[2]}. Hvem er yngst?`,
        answer: trio[2],
        options: createOptions(trio[2], [trio[0], trio[1], "Kan ikke avgjøres"]),
        explanation: "Når A er eldre enn B og B er eldre enn C, må C være yngst."
      };
    },
    () => {
      const names = [["Dina", "Emil", "Filip"], ["Hanna", "Iver", "Lukas"], ["Mona", "Nils", "Oskar"]][variant % 3];
      return {
        id: `log-d-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 48 + level * 4,
        subtype: "Plassering",
        title: "Plassering",
        prompt: `Tre personer står i kø. ${names[0]} står foran ${names[1]}, men bak ${names[2]}. Hvem må stå foran ${names[0]}?`,
        answer: names[2],
        options: createOptions(names[2], [names[1], "Ingen", "Begge"]),
        explanation: `Hvis ${names[0]} står bak ${names[2]}, må ${names[2]} stå foran ${names[0]}.`
      };
    },
    () => {
      const role = [["analytikere", "nøyaktige", "Nora"], ["utviklere", "strukturerte", "Lina"], ["revisorer", "grundige", "Amir"]][variant % 3];
      return {
        id: `log-e-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 52 + level * 4,
        subtype: "Konklusjon",
        title: "Logisk konklusjon",
        prompt: `Alle ${role[0]} er ${role[1]}. ${role[2]} er ${role[0].slice(0, -1)}. Hva følger logisk?`,
        answer: `${role[2]} er ${role[1]}`,
        options: createOptions(`${role[2]} er ${role[1]}`, [`Alle ${role[1]} er ${role[0]}`, `${role[2]} er leder`, "Ingen sikker konklusjon"]),
        explanation: "Dette er en direkte regel: hvis alle i gruppen har en egenskap, gjelder det også personen som tilhører gruppen."
      };
    },
    () => {
      const items = [["prosjekter", "plan", "Team X"], ["rapporter", "godkjenning", "Gruppe A"], ["søknader", "signatur", "Sak B"]][variant % 3];
      return {
        id: `log-f-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 56 + level * 4,
        subtype: "Konklusjon",
        title: "Logisk konklusjon",
        prompt: `Ingen ${items[0]} sendes uten ${items[1]}. ${items[2]} ble sendt. Hva følger logisk?`,
        answer: `${items[2]} hadde ${items[1]}`,
        options: createOptions(`${items[2]} hadde ${items[1]}`, [`${items[1]} var perfekt`, `Alle ${items[0]} blir sendt`, "Ingen sikker konklusjon"]),
        explanation: "Hvis noe ikke kan sendes uten et krav, må kravet ha vært oppfylt når det faktisk ble sendt."
      };
    },
    () => {
      return {
        id: `log-g-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 60 + level * 4,
        subtype: "Betingelser",
        title: "Betinget resonnement",
        prompt: "Hvis det regner, blir bakken våt. Bakken er ikke våt. Hva kan du konkludere?",
        answer: "Det regner ikke",
        options: createOptions("Det regner ikke", ["Det regner", "Det har regnet tidligere", "Ingen sikker konklusjon"]),
        explanation: "Når en regel alltid gjelder, kan du bruke den baklengs her: ingen våt bakke betyr at betingelsen ikke er oppfylt."
      };
    },
    () => {
      const queue = [["Oda", "Per", "Sara", "Lars"], ["Mia", "Noah", "Tina", "Elias"], ["Ida", "Jon", "Kari", "Petter"]][variant % 3];
      return {
        id: `log-h-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 64 + level * 4,
        subtype: "Rekkefølge",
        title: "Flere regler samtidig",
        prompt: `${queue[1]} kommer etter ${queue[0]} i køen, men før ${queue[2]}. ${queue[3]} står foran ${queue[0]}. Hvem står bakerst av disse fire?`,
        answer: queue[2],
        options: createOptions(queue[2], [queue[1], queue[0], queue[3]]),
        explanation: `Rekkefølgen blir ${queue[3]} foran ${queue[0]}, så ${queue[1]}, og til slutt ${queue[2]}.`
      };
    },
    () => {
      const sets = [["roser", "blomster"], ["laks", "fisk"], ["eiketrær", "trær"]];
      const [subset, superset] = sets[variant % sets.length];
      return {
        id: `log-i-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 58 + level * 4,
        subtype: "Kategorilogikk",
        title: "Kategorilogikk",
        prompt: `Alle ${subset} er ${superset}. Hvilken påstand må være sann?`,
        answer: `${subset[0].toUpperCase()}${subset.slice(1)} er ${superset}`,
        options: createOptions(`${subset[0].toUpperCase()}${subset.slice(1)} er ${superset}`, [`Alle ${superset} er ${subset}`, `Noen ${subset} er ikke ${superset}`, `Ingen ${superset} finnes`]),
        explanation: "Når alle i én gruppe tilhører en større gruppe, er nettopp den koblingen alltid sann."
      };
    },
    () => {
      const tasks = [["møte", "rapport", "presentasjon"], ["analyse", "utkast", "levering"], ["plan", "test", "lansering"]];
      const [first, second, third] = tasks[variant % tasks.length];
      return {
        id: `log-j-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 60 + level * 4,
        subtype: "Planlegging",
        title: "Planlegging",
        prompt: `${first} må skje før ${second}, og ${second} må skje før ${third}. Hva må skje først?`,
        answer: first,
        options: createOptions(first, [second, third, "Det kan ikke avgjøres"]),
        explanation: "Når A må før B og B må før C, er A alltid først i rekkefølgen."
      };
    },
    () => {
      const names = [["Kari", "Lars", "Mona"], ["Ida", "Jon", "Sara"], ["Eli", "Noah", "Per"]];
      const [a, b, c] = names[variant % names.length];
      return {
        id: `log-k-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 55 + level * 4,
        subtype: "Utelukkelse",
        title: "Utelukkelse",
        prompt: `${a}, ${b} og ${c} skal sitte ved siden av hverandre. ${c} kan ikke sitte i midten. Hvilken plassering er mulig?`,
        answer: `${a}, ${b}, ${c}`,
        options: createOptions(`${a}, ${b}, ${c}`, [`${b}, ${c}, ${a}`, `${c}, ${b}, ${a}`, `${a}, ${c}, ${b}`]),
        explanation: `Siden ${c} ikke kan sitte i midten, må du velge en rekkefølge der ${c} står ytterst.`
      };
    },
    () => {
      const letters = [["A", "B", "D", "G"], ["C", "D", "F", "I"], ["E", "F", "H", "K"]];
      const seq = letters[variant % letters.length];
      const answer = String.fromCharCode(seq[3].charCodeAt(0) + 4);
      return {
        id: `log-l-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 52 + level * 4,
        subtype: "Bokstavmønster",
        title: "Bokstavmønster",
        prompt: `Hva kommer videre i rekken ${seq.join(", ")}, ...?`,
        answer,
        options: createOptions(answer, [String.fromCharCode(answer.charCodeAt(0) - 1), String.fromCharCode(answer.charCodeAt(0) + 1), String.fromCharCode(answer.charCodeAt(0) + 2)]),
        explanation: "Hoppene mellom bokstavene øker her gradvis. Se på forskjellene før du velger neste bokstav."
      };
    }
  ];

  const generated = templates.map((template) => template());
  const preferred = generated.find((item) => item.subtype === preferredSubtype);
  return preferred || generated[variant % generated.length];
}

function verbalVariant(level, variant, preferredSubtype) {
  const synonymSets = [
    ["presis", "nøyaktig", ["rask", "kraftig", "høflig"]],
    ["rolig", "avslappet", ["hastig", "urolig", "streng"]],
    ["tydelig", "klar", ["sen", "smal", "hardt"]],
    ["begrense", "avgrense", ["utvide", "forsterke", "forklare"]],
    ["omfattende", "vidtrekkende", ["skjult", "kortvarig", "presist"]],
    ["konsekvent", "sammenhengende", ["tilfeldig", "sjeldent", "urolig"]]
  ];

  const antonymSets = [
    ["midlertidig", "permanent", ["kort", "uklar", "enkel"]],
    ["generøs", "gjerrig", ["høflig", "stille", "smart"]],
    ["optimistisk", "pessimistisk", ["vennlig", "effektiv", "rolig"]],
    ["komplisert", "enkel", ["nøyaktig", "alvorlig", "vid"]],
    ["innadvendt", "utadvendt", ["grundig", "sterk", "direkte"]]
  ];

  const analogySets = [
    ["bok", "lese", "gaffel", "spise", ["skrive", "kutte", "vaske"]],
    ["kompass", "retning", "termometer", "temperatur", ["avstand", "styrke", "fart"]],
    ["arkitekt", "bygning", "komponist", "musikk", ["teater", "vei", "vann"]],
    ["frø", "plante", "idé", "prosjekt", ["regel", "papir", "møte"]],
    ["pilot", "cockpit", "kokk", "kjøkken", ["lager", "garasje", "resepsjon"]],
    ["kalender", "dato", "klokke", "tid", ["retning", "fart", "temperatur"]]
  ];

  const oddOneOutSets = [
    [["eple", "pære", "plomme", "gulrot"], "gulrot", "Tre ord er frukt, mens ett er en grønnsak."],
    [["violin", "cello", "piano", "trompet"], "piano", "Tre er typisk melodiske instrumenter uten tangenter, mens piano er tangentinstrument."],
    [["mandag", "onsdag", "fredag", "juni"], "juni", "Tre ord er ukedager, mens ett er en måned."],
    [["løve", "tiger", "ulv", "ørret"], "ørret", "Tre ord er landdyr, mens ett er en fisk."],
    [["sirkel", "trekant", "kvadrat", "blå"], "blå", "Tre ord er former, mens ett er en farge."]
  ];

  const sentenceSets = [
    ["Hun var så ___ i arbeidet sitt at ingen detaljer ble oversett.", "grundig", ["tilfeldig", "stille", "kort"], "Setningen beskriver en person som jobber nøye og ser detaljer."],
    ["Lederen ga en ___ forklaring, slik at alle forstod planen.", "tydelig", ["sen", "streng", "mørk"], "Når alle forstår planen, må forklaringen være lett å forstå."],
    ["Forslaget var godt ___ og bygget på flere kilder.", "begrunnet", ["forsinket", "tilfeldig", "enkelt"], "Noe som bygger på flere kilder er vanligvis godt begrunnet."],
    ["Hun møtte situasjonen på en ___ måte og gjorde ingen forhastede valg.", "rolig", ["uklar", "skarp", "sint"], "Når man ikke gjør forhastede valg, opptrer man rolig."]
  ];

  const categorySets = [
    ["Hvilket ord beskriver best noe som er gjennomtenkt og velbegrunnet?", "reflektert", ["hastig", "uklar", "ensidig"], "Et reflektert svar er tenkt gjennom og godt begrunnet."],
    ["Hvilket ord beskriver best noe som skjer uten planlegging?", "spontant", ["strukturert", "forsinket", "avgrenset"], "Når noe skjer uten planlegging, er det spontant."],
    ["Hvilket ord beskriver best noe som er lett å stole på over tid?", "pålitelig", ["uklar", "midlertidig", "spontan"], "Noe pålitelig er stabilt og til å stole på."],
    ["Hvilket ord beskriver best noe som er veldig nøye utført?", "omhyggelig", ["tilfeldig", "hastig", "løs"], "Omhyggelig arbeid er gjort med stor nøyaktighet."]
  ];

  const templates = [
    () => {
      const [stem, answer, distractors] = synonymSets[variant % synonymSets.length];
      return {
        id: `ver-a-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 35 + level * 4,
        subtype: "Ordforråd",
        title: "Synonym",
        prompt: `Hvilket ord betyr omtrent det samme som «${stem}»?`,
        answer,
        options: createOptions(answer, distractors),
        explanation: `Se etter ordet som har nærmest samme betydning som «${stem}».`
      };
    },
    () => {
      const [stem, answer, distractors] = antonymSets[variant % antonymSets.length];
      return {
        id: `ver-b-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 38 + level * 4,
        subtype: "Antonym",
        title: "Antonym",
        prompt: `Hvilket ord betyr det motsatte av «${stem}»?`,
        answer,
        options: createOptions(answer, distractors),
        explanation: `Finn ordet som betyr det motsatte av «${stem}».`
      };
    },
    () => {
      const [a, b, c, answer, distractors] = analogySets[variant % analogySets.length];
      return {
        id: `ver-c-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 42 + level * 4,
        subtype: "Analogi",
        title: "Språklig analogi",
        prompt: `Hvilket ord passer best: ${a} er til ${b} som ${c} er til ...`,
        answer,
        options: createOptions(answer, distractors),
        explanation: `Se på forholdet mellom ${a} og ${b}, og finn samme type sammenheng for ${c}.`
      };
    },
    () => {
      const [words, answer, explanation] = oddOneOutSets[variant % oddOneOutSets.length];
      return {
        id: `ver-d-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 40 + level * 4,
        subtype: "Avviker",
        title: "Finn avvikeren",
        prompt: `Hvilket ord skiller seg ut? ${words.join(", ")}`,
        answer,
        options: [...words],
        explanation
      };
    },
    () => {
      const [prompt, answer, distractors, explanation] = sentenceSets[variant % sentenceSets.length];
      return {
        id: `ver-e-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 44 + level * 4,
        subtype: "Setningsforståelse",
        title: "Setningsforståelse",
        prompt: `Velg ordet som passer best i setningen: «${prompt}»`,
        answer,
        options: createOptions(answer, distractors),
        explanation
      };
    },
    () => {
      const [prompt, answer, distractors, explanation] = categorySets[variant % categorySets.length];
      return {
        id: `ver-f-${level}-${variant}`,
        difficulty: level,
        recommendedTime: 46 + level * 4,
        subtype: "Begrepsforståelse",
        title: "Begrepsforståelse",
        prompt,
        answer,
        options: createOptions(answer, distractors),
        explanation
      };
    }
  ];

  const generated = templates.map((template) => template());
  const preferred = generated.find((item) => item.subtype === preferredSubtype);
  return preferred || generated[variant % generated.length];
}

function pickQuestion(category, targetDifficulty, usedIds, variant, preferredSubtype) {
  if (category === "Numerisk") {
    return numericVariant(targetDifficulty, variant, preferredSubtype);
  }

  if (category === "Verbal") {
    return verbalVariant(targetDifficulty, variant, preferredSubtype);
  }

  if (category === "Logisk") {
    return logicVariant(targetDifficulty, variant, preferredSubtype);
  }

  const available = QUESTION_BANK[category].filter((question) => !usedIds.has(question.id));
  const ranked = available.sort((left, right) => {
    const leftDiff = Math.abs(left.difficulty - targetDifficulty);
    const rightDiff = Math.abs(right.difficulty - targetDifficulty);
    if (leftDiff !== rightDiff) return leftDiff - rightDiff;
    return left.difficulty - right.difficulty;
  });
  const choice = ranked[variant % ranked.length] || QUESTION_BANK[category][0];
  usedIds.add(choice.id);
  return cloneQuestion(choice, category);
}

function createEmptySubtypeScores() {
  return {};
}

function incrementSubtypeScore(store, subtype, correct) {
  if (!store[subtype]) {
    store[subtype] = { correct: 0, total: 0 };
  }
  store[subtype].total += 1;
  if (correct) {
    store[subtype].correct += 1;
  }
}

function weakestSubtypeFromScores(subtypeScores) {
  const entries = Object.entries(subtypeScores).filter((entry) => entry[1].total > 0);
  if (!entries.length) return "Tallmønster";
  return entries.sort((left, right) => {
    const leftScore = left[1].correct / left[1].total;
    const rightScore = right[1].correct / right[1].total;
    return leftScore - rightScore;
  })[0][0];
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

function generateQuestions(mode, focusTarget) {
  const seed = randomInt(1000, 999999);
  const usedIds = {
    Numerisk: new Set(),
    Verbal: new Set(),
    Logisk: new Set()
  };

  if (mode === "practice") {
    const focusSubtype = focusTarget?.subtype || null;
    const focusCategory = focusTarget?.category || subtypeCategory(focusSubtype);
    const categories = getPracticeCategories(focusCategory);
    return PRACTICE_LEVELS.map((level, index) => ({
      id: `practice-${index + 1}`,
      mode,
      ...pickQuestion(
        categories[index],
        level,
        usedIds[categories[index]],
        categories[index] === focusCategory ? index + seed + 11 : index + seed
        ,
        categories[index] === focusCategory ? focusSubtype : null
      )
    }));
  }

  return FULL_TEST_LEVELS.map((level, index) => {
    const category = CATEGORIES[index % CATEGORIES.length];
    return {
      id: `full-${index + 1}`,
      mode,
      ...pickQuestion(category, level, usedIds[category], index + seed, null)
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
  const subtypeScores = answers.reduce((accumulator, item) => {
    incrementSubtypeScore(accumulator, item.subtype, item.correct);
    return accumulator;
  }, createEmptySubtypeScores());

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
    weakestSubtype: weakestSubtypeFromScores(subtypeScores),
    highestLevel: highestLevel ? `Nivå ${highestLevel}` : "Startnivå",
    categoryScores,
    subtypeScores,
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
      weakestCategory: "Numerisk",
      weakestSubtype: "Tallmønster"
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
  const subtypeScores = history.reduce((accumulator, session) => {
    Object.entries(session.subtypeScores || {}).forEach(([subtype, score]) => {
      if (!accumulator[subtype]) {
        accumulator[subtype] = { correct: 0, total: 0 };
      }
      accumulator[subtype].correct += score.correct;
      accumulator[subtype].total += score.total;
    });
    return accumulator;
  }, createEmptySubtypeScores());

  const weakestCategory = Object.entries(categoryScores).sort((left, right) => {
    const leftScore = left[1].total ? left[1].correct / left[1].total : 1;
    const rightScore = right[1].total ? right[1].correct / right[1].total : 1;
    return leftScore - rightScore;
  })[0]?.[0] || "Numerisk";

  return {
    sessions: history.length,
    averagePercent,
    latestPercent,
    bestPercent,
    weakestCategory,
    weakestSubtype: weakestSubtypeFromScores(subtypeScores)
  };
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
    ? `Siste resultat ${insights.latestPercent}%, beste resultat ${insights.bestPercent}% og mest behov for øving i ${insights.weakestCategory.toLowerCase()} - spesielt ${insights.weakestSubtype.toLowerCase()}.`
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
  elements.subtypeChip.textContent = question.subtype;
  elements.timeChip.textContent = `Anbefalt: ${question.recommendedTime} sek`;
  elements.questionText.textContent = question.title;
  elements.questionPrompt.textContent = question.prompt;
  elements.optionsContainer.innerHTML = "";
  elements.answerReview.className = "answer-review hidden";
  elements.answerStatus.textContent = "";
  elements.answerCorrect.textContent = "";
  elements.answerExplanation.textContent = "";
  elements.nextButton.disabled = true;
  elements.nextButton.textContent = "Sjekk svar";
  state.selectedOption = null;
  state.reviewMode = false;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (state.reviewMode) return;
      state.selectedOption = option;
      elements.nextButton.disabled = false;
      [...elements.optionsContainer.children].forEach((child) => child.classList.remove("selected"));
      button.classList.add("selected");
    });
    elements.optionsContainer.appendChild(button);
  });
}

function showAnswerReview() {
  const question = state.questions[state.currentIndex];
  const isCorrect = state.selectedOption === question.answer;

  state.reviewMode = true;
  elements.answerReview.className = `answer-review${isCorrect ? " correct" : ""}`;
  elements.answerStatus.textContent = isCorrect ? "Riktig svar." : "Ikke helt riktig.";
  elements.answerCorrect.textContent = `Riktig svar var ${question.answer}.`;
  elements.answerExplanation.textContent = question.explanation;
  elements.nextButton.textContent = state.currentIndex === state.questions.length - 1 ? "Se resultat" : "Neste spørsmål";

  [...elements.optionsContainer.children].forEach((child) => {
    child.disabled = true;
    if (child.textContent === question.answer) {
      child.classList.add("selected");
    }
  });
}

function startSession(type, focusCategory) {
  const activeProfile = getActiveProfile();
  if (!activeProfile) return;
  const insights = buildProfileInsights(activeProfile);
  state.sessionType = type;
  const focusTarget = type === "practice"
    ? (focusCategory || { category: insights.weakestCategory, subtype: insights.weakestSubtype })
    : null;
  state.questions = generateQuestions(type, focusTarget);
  state.currentIndex = 0;
  state.answers = [];
  state.lastResult = null;
  state.reviewMode = false;
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

  if (!state.reviewMode) {
    showAnswerReview();
    return;
  }

  state.answers.push({
    id: question.id,
    category: question.category,
    subtype: question.subtype,
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
  startSession("practice", { category: insights.weakestCategory, subtype: insights.weakestSubtype });
});
elements.nextButton.addEventListener("click", handleNext);
elements.practiceFromResultButton.addEventListener("click", () => {
  if (state.lastResult) {
    startSession("practice", { category: state.lastResult.weakestCategory, subtype: state.lastResult.weakestSubtype });
  }
});
elements.restartFullButton.addEventListener("click", () => startSession("full"));
elements.backHomeButton.addEventListener("click", renderHome);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`).catch(() => {});
  });
}

loadState();
renderHome();

var listToRemember,
  selected_tmrsound,
  selected_tmfsound,
  selected_rsound,
  selected_fsound,
  selected_sound5,
  selected_tmr_list,
  selected_tmf_list,
  selected_r_list,
  selected_f_list;

const soundFiles = {
  sound1: "../sounds/tone_A.wav",
  sound2: "../sounds/tone_B.wav",
  sound3: "../sounds/tone_C.wav",
  sound4: "../sounds/tone_D.wav",
  sound5: "../sounds/tone_E.wav",
  bsp_e: "../sounds/Bsp_E.wav",
  bsp_v: "../sounds/Bsp_V.wav",
};

const sound1 = new Audio(soundFiles.sound1);
const sound2 = new Audio(soundFiles.sound2);
const sound3 = new Audio(soundFiles.sound3);
const sound4 = new Audio(soundFiles.sound4);
const sound5 = new Audio(soundFiles.sound5);
const bsp_e = new Audio(soundFiles.bsp_e);
const bsp_v = new Audio(soundFiles.bsp_v);
var settingsDone = false;

const cont_text = "Weiter";
const prev_text = "zurück";

// PVT

const default_background = "#fff";

const pvt_time_limit = 3 * 60000; // Task duration: 3 min
let pvt_start;

// Counting how many (practice) trials were valid.
var pvt_lapse_count = 0;
// only collects early responses during stopwatch trials, not during ITI
var pvt_premature_stopwatch_count = 0;
// only collects responses during the ITI, not during the stopwatch trials
var pvt_premature_iti_count = 0;
var repeat_practice = false;
var pvt_practice_round_counter = 0;
var pvt_practice_trial_counter = 0;
let pvt_failed_practice;
let n_practice_trials = 3;
let practice_correct_threshold = 2;
let max_practice_rounds = 2;

// Minimum and maximum waiting interval (ITI when the stopwatch is not counting up).
var min_wait = 2000;
var max_wait = 10000;

let psqi_components = {
  PSQIDURAT: null,
  PSQIDISTB: null,
  PSQILATEN: null,
  PSQIDAYDYS: null,
  PSQIHSE: null,
  PSQISLPQUAL: null,
  PSQIMEDS: null,
};

const EXCLUSION_CONFIG = {
  exclusionCriteria: {
    age: "<18|>35",
    // Mindestanforderung: mind. Fachhochschulreife (Abitur/Fachabitur)
    school_education: "none|hauptschule|realschule",
    // Keine/zu niedrige berufliche Qualifikation
    vocational_education: "none|ausbildung",

    // Sprache
    fluency: "no",

    // Wohnsituation
    living_situation: "betreut",

    // Zyklus/Schwangerschaft
    pregnancy: "ja",

    // Substanzen heute/gestern
    drugs_today: "ja",
    alcohol_today: "ja",
    smoking_today: "ja", // i.d.R. soft; harte Rule z.B. späte Uhrzeit
    caffeine: "ja",
    caffeine_time: "/^(1[2-9]|2[0-3]):/", // Koffein nach 16:00 (24h), harte Zeitnähe

    medication_today: "ja", // markiert „Medis aktuell“ (Details s.o.)

    // Schlaf / Tagesrhythmus
    wake_time: "/^(1[2-9]|2[0-3]):/", // Aufstehen ≥12:00 → eher ungünstig
    sleep_quality: "1|2", // sehr/ziemlich schlecht
    sleep_change: "ja",
    recent_stress: "ja",
  },
  softHardMap: {
    age: "hard",
    school_education: "hard",
    vocational_education: "hard",
    fluency: "hard",
    living_situation: "hard",
    pregnancy: "hard",
    drugs_today: "hard",
    alcohol_today: "hard",
    smoking_today: "soft",
    caffeine: "soft",
    caffeine_time: "hard",
    medication_today: "soft",
    wake_time: "soft",
    sleep_quality: "soft",
    sleep_change: "soft",
    recent_stress: "soft",
  },
};

const toNum = (v) => Number(String(v ?? "").replace(",", "."));

const cuedRecallTestList = [];

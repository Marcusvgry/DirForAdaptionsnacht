const meq_instr_text = `<div class="instructions">
    <p>Im folgenden werden Ihnen ein paar Fragen zu Ihrem typischen Tagesrhythmus gestellt.<br>
    Bitte lesen Sie jede Frage genau, bevor Sie sie beantworten.<br>
    Jede Frage sollte unabhängig von den vorherigen Fragen beantwortet werden.<br>
    Wählen Sie jeweils die Antwort, die am besten auf Sie und Ihren Tagesrhythmus zutrifft.
</div>`;

const meq_1_text = `<div class="instructions_c">
    <b>Wenn es nach Ihrem eigenen Wohlbefinden ginge und Sie Ihren Tag völlig frei einteilen könnten, wann würden 
    Sie dann aufstehen? Bitte markieren Sie die Uhrzeit auf der Zeitleiste.</b>
</div>`;

var meq_labels1 = [];

for (let i = 5; i < 13; i++) {
  i == 12 ? meq_labels1.push("12") : meq_labels1.push(i, "|", "|", "|");
}

/* Readable values to record the participant's response */
const meq_labels1_data = meq_labels1.map((item, index) => {
  if (item === "|") {
    const quarterIndex = index % 4; // 1, 2, or 3
    return `${Math.floor(index / 4) + 5}:${quarterIndex * 15}`.padStart(4, "0");
  }

  if (typeof item === "number") {
    return `${item}:00`;
  }

  return "12:00"; // for '12'
});

const meq_7_prompt =
  "<b>Wie müde fühlen Sie sich morgens in der ersten halben Stunde nach dem Aufwachen?</b>";

const meq_7_labels = [
  "sehr müde",
  "ziemlich müde",
  "ziemlich frisch",
  "sehr frisch",
];

var meq_labels10 = [];

for (let i = 20; i < 25; i++) {
  meq_labels10.push(i, "|", "|", "|");
}

for (let i = 1; i < 4; i++) {
  i == 3 ? meq_labels10.push(i) : meq_labels10.push(i, "|", "|", "|");
}

let currentHour = null;
const meq_labels10_data = meq_labels10.map((item, index) => {
  if (typeof item === "number") {
    currentHour = item;
    return `${currentHour}:00`;
  }
  if (item === "|") {
    // Find position within the group (1, 2, or 3)
    const pos = index % 4;
    const minutes = pos * 15;
    return `${currentHour}:${minutes.toString().padStart(2, "0")}`;
  }
  return item; // fallback, shouldn't happen
});

const meq_10_text = `<div class="instructions_c">
    <b>Um wie viel Uhr werden Sie abends müde und haben das Bedürfnis schlafen zu gehen? Bitte markieren Sie die Uhrzeit auf
    der Zeitleiste.</b>
</div>`;

const meq_midnight = "MITTERNACHT";
const meq_noon = "MITTAG";

var meq_labels18 = ["24"];

for (let i = 1; i < 25; i++) {
  meq_labels18.push(i);
}

const meq_labels18_data = meq_labels18.map((item) => {
  if (item === "24") {
    return "24:00";
  }

  if (typeof item === "number") {
    return `${item}:00`;
  }

  return item;
});

const meq_18_text = `<div class="instructions_c">
    <b>Zu welcher Tageszeit fühlen Sie sich Ihrer Meinung nach am besten?</b>
</div>`;

const meq_19_prompt =
  '<b>Man spricht bei Menschen von "Morgen"- und "Abendtypen". Zu welchem der folgenden Typen zählen Sie sich?</b>';
const meq_19_labels = [
  'eindeutig "Morgentyp"',
  'eher "Morgen"- als "Abendtyp"',
  'eher "Abend"- als "Morgentyp"',
  'eindeutig "Abendtyp"',
];

const meq_19_types = [
  'eindeutig "Morgentyp"',
  'eher "Morgen"- als "Abendtyp"',
  "weder Morgen- noch Abendtyp",
  'eher "Abend"- als "Morgentyp"',
  'eindeutig "Abendtyp"',
];

/* STAYS IN ENGLISH! Needed to safe the chronotype in a single language in the data base */
const meq_types_en = [
  'Definitely a "morning" type',
  'Rather a "morning" than an "evening" type',
  "neither type",
  'Rather an "evening" than a "morning" type',
  'Definitely an "evening" type',
];

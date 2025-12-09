const psqi_bed_warning =
  "Sie scheinen morgens/tagsüber ins Bett zu gehen. Stellen Sie sicher, dass es sich dabei nicht um einen Fehler handelt, bevor Sie Ihre Antwort abschicken.\n";
const psqi_wake_up_warning =
  "Sie scheinen sehr spät am Tag/in der Nacht aufzuwachen. Stellen Sie sicher, dass es sich dabei nicht um einen Fehler handelt, bevor Sie Ihre Antwort abschicken.\n";
const psqi_sleep_warning =
  "Sie scheinen länger zu schlafen, als Sie Zeit im Bett verbringen. Stellen Sie sicher, dass es sich dabei nicht um einen Fehler handelt, bevor Sie Ihre Antwort abschicken.\n";
const psqi_preamble = `<div class="instructions" style="margin-top: 50px">
    Die folgenden Fragen beziehen sich auf ihre üblichen Schlafgewohnheiten und zwar <span style="text-decoration: underline;">nur</span> 
    während der letzten vier Wochen. Ihre Antworten sollten möglichst genau sein und sich auf die 
    <span style="text-decoration: underline;">Mehrzahl</span> der Tage und Nächte während der letzten vier Wochen beziehen.
</div>`;

const psqi1_html = `<div class="questions">

    <b>Wann sind Sie während der letzten vier Wochen gewöhnlich abends zu Bett gegangen?</b><br>
    <input type="time" id="bedtime" class="large-time" name="bedtime" oninput="plausibleTime(this.value, 'bedtime')" required />

    <br><br>

    <b>Wie lange (in Minuten) hat es während der letzten vier Wochen gewöhnlich gedauert, bis Sie nachts eingeschlafen sind?</b><br>
    <input class="large-input" name="sleep-onset-m" id="sleep-onset-m" type="number" required="required" 
    min="0" max="1000" style="width: 3em"> m

    <br><br>

    <b>Wann sind Sie während der letzten vier Wochen gewöhnlich morgens aufgestanden?</b><br>
    <input type="time" id="wake" class="large-time" name="wake" oninput="plausibleTime(this.value, 'wake')" required />

    <br><br>

    <b>Wieviele Stunden haben Sie während der letzten vier Wochen pro Nacht <span style="text-decoration: underline;">tatsächlich geschlafen</span>? 
    (Das muss nicht mit der Anzahl der Stunden, die Sie im Bett verbracht haben, übereinstimmen.)</b><br>
    <input class="large-input" name="h-of-sleep" id="h-of-sleep" type="number" required="required" 
    min="0" max="24" step="0.1" style="width: 3em" oninput="sleepCheck()"> h

    <br><br>

    <span id="warning-bedtime" style="color:red;"></span>
    <span id="warning-wake" style="color:red;"></span>
    <span id="warning-h-sleep" style="color:red;"></span>

</div>`;

var pittsburghOptions = [
  `Während der letzten vier Wochen gar nicht`,
  `Weniger als einmal pro Woche`,
  `Einmal oder zweimal pro Woche`,
  `Dreimal oder häufiger pro Woche`,
];

var pittsburghQuestions1 = [
  `a. weil Sie nicht innerhalb von 30 Minuten einschlafen konnten?`,
  `b. weil Sie mitten in der Nacht oder früh morgens aufgewacht sind?`,
  `c. weil Sie aufstehen mussten, um zur Toilette zu gehen?`,
  `d. weil Sie Beschwerden beim Atmen hatten?`,
  `e. weil Sie husten mussten oder laut geschnarcht haben?`,
  `f. weil Ihnen zu kalt war?`,
  `g. weil Ihnen zu warm war?`,
  `h. weil Sie schlecht geträumt haben?`,
  `i. weil Sie Schmerzen hatten?`,
  `j. aus anderen Gründen?`,
];

var pittsburghQuestions2 = [
  `Wie oft haben Sie während der letzten vier Wochen Schlafmittel eingenommen (vom Arzt verschriebene oder frei verkäufliche)?`,
  `Wie oft haben Sie während der letzten vier Wochen Schwierigkeiten wachzubleiben, etwa beim Autofahren, beim Essen oder bei gesellschaftlichen Anlässen?`,
  `Hatten Sie während der letzten vier Wochen Probleme, mit genügend Schwung die üblichen Alltagsaufgaben zu erledigen?`,
];

const psqi_table_note =
  "Wie oft haben Sie während der letzten vier Wochen schlecht geschlafen, ...";
const psqi_open_answer = "Bitte beschreiben:";

const psqi_table_options = [
  "Sehr gut",
  "Ziemlich gut",
  "Ziemlich schlecht",
  "Sehr schlecht",
];

const psqi_sleep_q_prompt =
  "Wie würden Sie insgesamt die Qualität Ihres Schlafes während der letzten vier Wochen beurteilen?";

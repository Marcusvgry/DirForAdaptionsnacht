const demographics_trial = {
  type: jsPsychSurveyHtmlForm,
  html: text_demographics,
  button_label: "Weiter",
  on_load: function () {
    enforceDemographicsRequired();
  },
  on_finish: function (data) {
    const resp = data.response;
    const details = evaluateExclusions(
      resp,
      EXCLUSION_CONFIG.exclusionCriteria,
      EXCLUSION_CONFIG.softHardMap
    );
    data.isExcludedHard = details.isExcludedHard;
    data.exclusionItems = details.items;
    // HIER die neue Funktion einsetzen:
    data.markedFormHtml = prefillAndMark(
      text_demographics,
      resp,
      details.items
    );
  },
};

const exclusion_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    const last = jsPsych.data.get().last(1).values()[0] || {};
    const items = last.exclusionItems || [];

    if (!items.length) {
      return `<div class="instructions"><p>Alle Angaben wurden akzeptiert.</p></div>`;
    }

    return `<div class="instructions"><p>Bitte wenden Sie sich an die Versuchsleitung.</p></div>`;
  },
  choices: ["Weiter"],
};
const demographics_flagged_review = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    const last = jsPsych.data
      .get()
      .filter({ trial_type: "survey-html-form" })
      .last(1)
      .values()[0];
    const reviewHtml = last?.markedFormHtml || text_demographics;
    return `<div class="instructions"><p>Bitte prüfen Sie die markierten Antworten.</p></div><div class="demographics-review">${reviewHtml}</div>`;
  },
  choices: ["Weiter", "Experiment beenden"],
  on_finish: function (data) {
    if (data.response === 1) {
      if (typeof saveExperimentData === "function") {
        saveExperimentData("_abbruch");
      } else {
        jsPsych.data.get().localSave("csv", "DirFor1_Abbruch.csv");
      }
      jsPsych.endExperiment(
        "Das Experiment wurde beendet. Die bis dahin erhobenen Daten wurden gespeichert."
      );
    }
  },
};

// 2.4 Block mit Wiederholung solange harter Ausschluss
const demographics_block = {
  timeline: [
    demographics_trial,
    {
      timeline: [exclusion_screen, demographics_flagged_review],
      conditional_function: function () {
        const lastSurvey = jsPsych.data
          .get()
          .filter({ trial_type: "survey-html-form" })
          .last(1)
          .values()[0];
        return Array.isArray(lastSurvey?.exclusionItems)
          ? lastSurvey.exclusionItems.length > 0
          : false;
      },
    },
  ],
  loop_function: function () {
    return false;
  },
};
// PVT -----------------------------------------------------------------------------------------------

var pvt_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<span class = "fixation">00000</span>`,
  choices: " ",
  response_ends_trial: false,
  /* custom argument in html keyboard response plugin:
    log rts of alle key presses happening during fixation; allows us to record the number (and rts) 
    of all premature responses during the ITI */
  log_multiple: true,
  trial_duration: getRndInteger(min_wait, max_wait),
  on_finish: function (data) {
    data.trial = `${pvt_phase}_pvt_fixation`;
    // count all key presses during ITI as prematures
    pvt_premature_iti_count = pvt_premature_iti_count + data.rt.length;
  },
};

var pvt_stopwatch = {
  on_load: function () {
    startTimer();
  },
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><span id="time" class="time">00000</span></div>`,
  trial_duration: 10000,
  choices: [" "],
  on_finish: function (data) {
    /* diff and elapsed time are not completely aligned, so diff will stop
        at 99998 or something. So if the participants did not make a response,
        we set the display to 10000.*/
    if (data.rt === null) diff = "10000";

    if (data.rt == null || data.rt > lapse_time) {
      pvt_lapse_count++;
      data.pvt_correct = 0;
    } else if (data.rt != null && data.rt < premature_time) {
      pvt_premature_stopwatch_count++;
      data.pvt_correct = 0;
    } else {
      data.pvt_correct = 1;
    }

    data.pvt_stopwatch = diff;
    clearInterval(timer_interval);

    data.trial = `${pvt_phase}_pvt_stopwatch`;
  },
};

// Leave the time when the stopwatch was stopped on the screen for a bit
var pvt_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    let last_trial_data = jsPsych.data.getLastTrialData().values()[0];

    if (last_trial_data.rt === null) {
      diff = "10000";
    } else {
      diff = last_trial_data.pvt_stopwatch;
    }

    if (diff.length == 5) {
      disp = `<span style="color:  rgb(241, 26, 26);">${diff}</span>`;
    } else if (diff.length == 4) {
      disp = `<span style="color: rgb(104, 30, 30)">0</span><span style="color:  rgb(241, 26, 26);">${diff}</span>`;
    } else if (diff.length == 3) {
      disp = `<span style="color: rgb(104, 30, 30)">00</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 2) {
      disp = `<span style="color: rgb(104, 30, 30)">000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 1) {
      disp = `<span style="color: rgb(104, 30, 30)">0000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    }

    return `<div><span class="feedback">${disp}</span></div>`;
  },
  choices: "NO_KEYS",
  trial_duration: 1500,
  on_finish: function (data) {
    data.trial = `${pvt_phase}_pvt_feedback`;
  },
};

// INSTRUCTIONS -----------------------------------------------------------------------------------------

var pvt_start_screen = {
  type: jsPsychInstructions,
  pages: [pvt_start_p1, pvt_start_p2],
  show_clickable_nav: true,
  button_label_next: () => cont_text,
  allow_backward: false,

  data: { trial: "pvt_start_screen" },

  on_finish: (data) => {
    /* Turn background black for the PVT */
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";

    /* Record that we are in the practice phase right now. */
    pvt_phase = "practice";

    data.view_history = JSON.stringify(data.view_history);
  },
};

/* Evaluate the practice phase - participants need to get at least 2 out of 3 trials correct. 
For the evaluation of the practice phase, responses during the ITI are ignored, but participants 
receive a hint that they should not press any buttons during the ITI. */
var evalPvtPractice = {
  on_load: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },
  type: jsPsychHtmlButtonResponse,
  data: { trial: "practice_pvt_evaluation" },
  stimulus: function () {
    /* Number of correct trials: Number of trials - lapses - prematures */
    var feedback = pvt_feedback_text(
      n_practice_trials,
      pvt_lapse_count,
      pvt_premature_stopwatch_count,
      pvt_premature_iti_count
    );

    /* Add "well done" when they got at least practice_correct_threshold correct */
    if (
      n_practice_trials - pvt_lapse_count - pvt_premature_stopwatch_count >=
      practice_correct_threshold
    )
      feedback = feedback + pvt_praise;

    return feedback;
  },

  choices: () => [cont_text],

  on_finish: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";

    pvt_practice_round_counter++;

    /* After n_practice_trials failed practice rounds */
    if (pvt_practice_round_counter >= max_practice_rounds) {
      repeat_practice = false;
      if (
        n_practice_trials - pvt_lapse_count - pvt_premature_stopwatch_count >=
        practice_correct_threshold
      ) {
        pvt_failed_practice = 0;
      } else {
        pvt_failed_practice = 1;
      }
      pvt_failed_practice = 1;
    } else if (
      n_practice_trials - pvt_lapse_count - pvt_premature_stopwatch_count >=
      practice_correct_threshold
    ) {
      repeat_practice = false;
      pvt_failed_practice = 0;
    } else {
      repeat_practice = true;
    }
  },
};

/* If participants failed the practice phase, they get one more try. */
wrongPracticePVT = {
  on_load: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },
  type: jsPsychHtmlButtonResponse,
  data: { trial: "failed_practice_pvt" },
  stimulus: () => failed_pvt_feedback(),
  choices: () => [cont_text],
  on_finish: function () {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";
    // Reset counter for correct practice trials so practice can be repeated
    pvt_lapse_count = 0;
    pvt_premature_stopwatch_count = 0;
    pvt_premature_iti_count = 0;
  },
};

ifWrongPracticePVT = {
  timeline: [wrongPracticePVT],
  conditional_function: () => repeat_practice,
};

var pvt_main_instructions = {
  on_load: () => {
    // Reset counters after the practice phase
    pvt_lapse_count = 0;
    pvt_premature_stopwatch_count = 0;
    pvt_premature_iti_count = 0;
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },
  type: jsPsychHtmlButtonResponse,
  stimulus: pvt_main_instructions_text(),
  choices: () => [cont_text],
  data: { trial: "pvt_instructions" },
  on_finish: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";

    pvt_start = +new Date();

    pvt_phase = "main";
  },
};

var pvt_end_screen = {
  on_load: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },

  type: jsPsychHtmlButtonResponse,
  stimulus: pvt_end_text,
  choices: () => [cont_text],
  data: { trial: "pvt_end_screen" },
  on_finish: (data) => {
    // Log PVT performance
    data.pvt_failed_practice = pvt_failed_practice;
    data.pvt_lapses = pvt_lapse_count;
    data.pvt_prematures_stopwatch = pvt_premature_stopwatch_count;
    data.pvt_prematures_iti = pvt_premature_iti_count;

    // Log number of PVT trial for convenience
    let pvt_main_trials = jsPsych.data.get().filter({
      trial: "main_pvt_stopwatch",
    });

    data.pvt_n_trials = pvt_main_trials.trials.length;
  },
};

// PVT TIMELINE -----------------------------------------------------------------------------------------

var pvt_practice_inner = {
  timeline: [pvt_fixation, pvt_stopwatch, pvt_feedback],
  on_timeline_finish: () => pvt_practice_trial_counter++,
};

var pvt_practice_inner_loop = {
  timeline: [pvt_practice_inner],
  loop_function: () => pvt_practice_trial_counter < n_practice_trials,
  on_timeline_finish: () => (pvt_practice_trial_counter = 0),
};

/* Conditional: If participants get the practice trials wrong, they need to do them again
Move on if participants failed the practice twice, but exclude them from data analysis later. */
var pvt_practice_outer = {
  timeline: [pvt_practice_inner_loop, evalPvtPractice, ifWrongPracticePVT],
  loop_function: () => repeat_practice,
};

// PVT main procedure
var pvt_core = {
  timeline: [pvt_fixation, pvt_stopwatch, pvt_feedback],
  loop_function: () => +new Date() - pvt_start < pvt_time_limit,
};

var stanfordSleepiness = {
  on_load: () => {
    // The last option is just for reference an cannot be clicked.
    // Here, we disable the radiobutton and make it grey.
    lastOption = document.getElementById(
      "jspsych-survey-multi-choice-response-0-7"
    );
    lastOption.disabled = true;
    lastOption.style.backgroundColor = "#9b9b9b";
  },
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: () => sss_prompt,
      name: "stanford_sleepiness",
      options: () => sssOptions,
      required: true,
    },
  ],
  button_label: () => cont_text,
  data: { trial: "stanford_sleepiness" },
  on_finish: function (data) {
    delete data.question_order;
    // Turn response into numeric score
    var sleepiness_string = data.response.stanford_sleepiness;
    var index = sssOptions.indexOf(sleepiness_string);
    // Convert to SSS score from 1 - 7
    data.response = index + 1;
  },
};

var pittsburgh1 = {
  on_load: () => {
    /* Show a warning if people get up in the afternoon/evening or go to bed 
    in the morning */
    plausibleTime = function (time, id) {
      h = parseInt(time.split(":")[0]);
      // Are we talking about betime or wake time?
      if (id == "bedtime") {
        if ((h >= 4) & (h <= 17)) {
          // Insert fitting text for warning message
          let warningSpan = document.getElementById("warning-bedtime");
          warningSpan.innerText = psqi_bed_warning;
        } else {
          // Delete warning
          let warningSpan = document.getElementById("warning-bedtime");
          warningSpan.innerText = "";
        }
      } else if (id == "wake") {
        if ((h >= 12) | (h <= 3)) {
          // Insert fitting text for warning message
          let warningSpan = document.getElementById("warning-wake");
          warningSpan.innerText = psqi_wake_up_warning;
        } else {
          // Delete warning
          let warningSpan = document.getElementById("warning-wake");
          warningSpan.innerText = "";
        }
      }
    };

    /* Throw warning if people report more h of sleep than they spent in bed */
    sleepCheck = function () {
      // Only makes sense when bedtime, waketime and h of sleep have been filled out
      let bedtime_h = parseInt(
        document.getElementById("bedtime").value.split(":")[0]
      );
      let bedtime_m = parseInt(
        document.getElementById("bedtime").value.split(":")[1]
      );
      let wake_h = parseInt(
        document.getElementById("wake").value.split(":")[0]
      );
      let wake_m = parseInt(
        document.getElementById("wake").value.split(":")[1]
      );
      let h_of_sleep = document.getElementById("h-of-sleep").value;

      if (
        (bedtime_h != "") &
        (bedtime_m != "") &
        (wake_h != "") &
        (wake_m != "") &
        (h_of_sleep != "")
      ) {
        // Calculate time in bed. See calculations for component 4.
        // Dummy dates, because we only know the time participants went to bed, not the day
        let bedtime = new Date("02.02.02. " + bedtime_h + ":" + bedtime_m);
        let waketime = new Date("02.03.02. " + wake_h + ":" + wake_m);

        let h_in_bed = (waketime - bedtime) / (1000 * 60 * 60);
        h_in_bed = h_in_bed >= 24 ? h_in_bed - 24 : h_in_bed;

        if (h_of_sleep > h_in_bed) {
          // Insert fitting text for warning message
          let warningSpan = document.getElementById("warning-h-sleep");
          warningSpan.innerText = psqi_sleep_warning;
        } else {
          // Delete warning
          let warningSpan = document.getElementById("warning-h-sleep");
          warningSpan.innerText = "";
        }
      }
    };
  },

  type: jsPsychSurveyHtmlForm,
  preamble: () => psqi_preamble,
  html: () => psqi1_html,
  button_label: () => cont_text,
  data: { trial: "pittsburgh1" },

  on_finish: function (data) {
    // SCORING

    /* PSQIDURAT - DURATION OF SLEEP 
      IF Q4 >= 7, THEN set value to 0 
      IF Q4 < 7 and >= 6, THEN set value to 1 
      IF Q4 < 6 and >= 5, THEN set value to 2 
      IF Q4 < 5, THEN set value to 3 
      Minimum Score = 0 (better); Maximum Score = 3 (worse) */

    let h_of_sleep = Number(data.response["h-of-sleep"]);

    if (h_of_sleep >= 7) {
      psqi_components.PSQIDURAT = 0;
    } else if (h_of_sleep >= 6) {
      psqi_components.PSQIDURAT = 1;
    } else if (h_of_sleep >= 5) {
      psqi_components.PSQIDURAT = 2;
    } else if (h_of_sleep < 5) {
      psqi_components.PSQIDURAT = 3;
    }

    /* PSQILATEN SLEEP LATENCY 
      First, recode Q2 into Q2new thusly: 
      IF Q2 >= 0 and <= 15, THEN set value of Q2new to 0 
      IF Q2 > 15 and <= 30, THEN set value of Q2new to 1 
      IF Q2 > 30 and <= 60, THEN set value of Q2new to 2 
      IF Q2 > 60, THEN set value of Q2new to 3  
        
    The rest of component two will be calculated in the second part of 
    the questionnaire (becasue Item Q5a is needed for that). */

    let sleep_onset = Number(data.response["sleep-onset-m"]);

    if (sleep_onset <= 15) {
      psqi_components.PSQILATEN = 0;
    } else if (sleep_onset <= 30) {
      psqi_components.PSQILATEN = 1;
    } else if (sleep_onset <= 60) {
      psqi_components.PSQILATEN = 2;
    } else if (sleep_onset > 60) {
      psqi_components.PSQILATEN = 3;
    }

    /* PSQIHSE SLEEP EFFICIENCY
    
      Diffsec = Diffsec = Difference in seconds between times for Bed Time (Q1) and 
      Getting Up Time (Q3).
      Diffhour = Absolute value of diffsec / 3600 
      newtib =IF diffhour > 24, then newtib = diffhour â€“ 24 
      IF diffhour < 24, THEN newtib = diffhour 
      (NOTE, THE ABOVE JUST CALCULATES THE HOURS BETWEEN BED 
      TIME (Q1) AND GETTING UP TIME (Q3)
      tmphse = (Q4 / newtib) * 100 
      
      IF tmphse >= 85, THEN set value to 0 
      IF tmphse < 85 and >= 75, THEN set value to 1 
      IF tmphse < 75 and >= 65, THEN set value to 2 
      IF tmphse < 65, THEN set value to 3 
    
      Minimum Score = 0 (better); Maximum Score = 3 (worse) 
    
    Note: Why minus 24 h? If someone went to bed in the evening, and got up in the 
    morning, the day between going to bed/getting up changes. If they went to bed after 
    midnight, and got up in the morning, they go to bed/get up on the same day, which 
    is of course relevant for the time difference calculations. */

    let bedtime_h = parseInt(data.response["bedtime"].split(":")[0]);
    let bedtime_m = parseInt(data.response["bedtime"].split(":")[1]);
    let wake_h = parseInt(data.response["wake"].split(":")[0]);
    let wake_m = parseInt(data.response["wake"].split(":")[1]);

    // Dummy dates, because we only know the time participants went to bed, not the day
    let bedtime = new Date("02.02.02 " + bedtime_h + ":" + bedtime_m);
    let waketime = new Date("02.03.02 " + wake_h + ":" + wake_m);

    /* The difference between our times is in milliseconds, not seconds, so we need to 
    divide by 3600000 instead of 3600 */
    let h_in_bed = (waketime - bedtime) / (1000 * 60 * 60);
    h_in_bed = h_in_bed >= 24 ? h_in_bed - 24 : h_in_bed;

    // (total # of hours asleep)/(total # of hours in bed) x 100 >85%=0, 75%-84%=1, 65%-74%=2, <65%=3
    let sleep_efficiency = (h_of_sleep / h_in_bed) * 100;

    // Note: Because 85% is not scored according to this coding scheme, I switched > to >=
    if (h_in_bed == 0) {
      // sleep efficiency must be 0 if h in bed are 0, because otherwise, we'd divide by 0
      psqi_components.PSQIHSE = null;
    } else if (sleep_efficiency > 100) {
      // Can't calculate a meaningful value if more hours of sleep than in bed
      psqi_components.PSQIHSE = null;
    } else if (sleep_efficiency >= 85) {
      psqi_components.PSQIHSE = 0;
    } else if (sleep_efficiency >= 75) {
      psqi_components.PSQIHSE = 1;
    } else if (sleep_efficiency >= 65) {
      psqi_components.PSQIHSE = 2;
    } else if (sleep_efficiency < 65) {
      psqi_components.PSQIHSE = 3;
    }

    // Needs to be stringified, because arrays cannot be saved in a .csv file.
    data.response = JSON.stringify(data.response);
  },
};

var pittsburgh2 = {
  on_load: () => {
    lastQ = document.getElementsByName("Q9");

    lastQ.forEach((el) =>
      el.addEventListener("change", function () {
        if (lastQ[0].checked) {
          // Hide text field for specifications
          document.getElementById("other-div").style.display = "none";
          document.getElementById("other").removeAttribute("required");
        } else {
          // Display text field for specifications
          document.getElementById("other-div").style.display = "block";
          document.getElementById("other").setAttribute("required", "required");
        }
      })
    );
  },
  type: jsPsychSurveyHtmlForm,
  preamble: () => psqi_preamble,
  html: () => {
    // QUESTION 5, a - j
    let stim = `<div class="questions"><table class="likert-table">
      <tr>
        <th align ="left" style="font-size: 14px;">${psqi_table_note}</th>`;

    for (let i = 0; i < pittsburghOptions.length; i++) {
      stim =
        stim +
        `<th style="font-size: 14px; line-height: 1em;">${pittsburghOptions[i]}</th>`;
    }

    stim = stim + `</tr>`;

    for (let i = 0; i < pittsburghQuestions1.length; i++) {
      stim =
        stim +
        `<tr><td align ="left" style="font-size:14px;">${pittsburghQuestions1[i]}</td>`;

      for (let j = 0; j < pittsburghOptions.length; j++) {
        stim =
          stim +
          `<td><div class="center-radio"><input type="radio" name="Q${i}" value="${j}" required></div></td>`;
      }

      stim = stim + `</tr>`;
    }

    stim =
      stim +
      `</table><br>
        
    <div name="other-div" id="other-div" style="display:none; margin-bottom:20px;">
      ${psqi_open_answer}<br>
      <textarea class="small-text-field" name="other" id="other" rows="3" cols="40"></textarea>
    </div>`;

    // QUESTION 6
    stim =
      stim +
      `<div style="display: flex; justify-content: center;">
      <table class="likert-table" style="font-size:14px;">
        <tr>
          <th colspan="2" style="padding-bottom: 10px;">
            <b>${psqi_sleep_q_prompt}</b>
          </th>
        </tr>`;

    for (opt in psqi_table_options) {
      stim =
        stim +
        `<tr>
            <td>${psqi_table_options[opt]}</td>
            <td>
              <div class="center-radio"><input type="radio" name="Q${
                pittsburghQuestions1.length
              }" value="${opt}" ${opt === 0 ? "required" : ""}></div>
            </td>
          </tr>`;
    }

    stim = stim + `</table></div><br>`;

    // QUESTIONS 7 - 9
    stim =
      stim +
      `<table class="likert-table">
      <tr>
        <th align ="left" style="font-size: 14px;"></th>`;

    for (let i = 0; i < pittsburghOptions.length; i++) {
      stim =
        stim +
        `<th style="font-size: 14px; line-height: 1em;">${pittsburghOptions[i]}</th>`;
    }

    stim = stim + `</tr>`;

    for (let i = 0; i < pittsburghQuestions2.length; i++) {
      stim =
        stim +
        `<tr><td align ="left" style="font-size:14px;">${pittsburghQuestions2[i]}</td>`;

      for (let j = 0; j < pittsburghOptions.length; j++) {
        stim =
          stim +
          `<td align = "center"><div class="center-radio"><input type="radio" name="Q${
            i + pittsburghQuestions1.length + 1
          }" value="${j}" required></div></td>`;
      }

      stim = stim + `</tr>`;
    }

    stim = stim + `</table><br></div>`;

    return stim;
  },
  button_label: () => cont_text,
  data: { trial: "pittburgh2" },
  on_finish: function (data) {
    // SCORING

    /* PSQIDISTB - SLEEP DISTURBANCE 
      IF Q5b + Q5c + Q5d + Q5e + Q5f + Q5g + Q5h + Q5i + Q5j (IF Q5JCOM is null 
      or Q5j is null, set the value of Q5j to 0) = 0, THEN set value to 0 

      IF Q5b + Q5c + Q5d + Q5e + Q5f + Q5g + Q5h + Q5i + Q5j (IF Q5JCOM is null 
      or Q5j is null, set the value of Q5j to 0) >= 1 and <= 9, THEN set value to 1 
      
      IF Q5b + Q5c + Q5d + Q5e + Q5f + Q5g + Q5h + Q5i + Q5j (IF Q5JCOM is null 
      or Q5j is null, set the value of Q5j to 0) > 9 and <= 18, THEN set value to 2 
      
      IF Q5b + Q5c + Q5d + Q5e + Q5f + Q5g + Q5h + Q5i + Q5j (IF Q5JCOM is null 
      or Q5j is null, set the value of Q5j to 0) > 18, THEN set value to 3 
      
      Minimum Score = 0 (better); Maximum Score = 3 (worse)  
        
    Note that items 5 b - j are called Q1 - Q9 in our questionnaire. It can also never 
    happen that the text field for Q5 is null when Q5 is not, or the other way around. 
    So, we can just calculate the sum across 5b - 5j and work with that. */

    let distb_sum = 0;

    for (i = 1; i < 10; i++) {
      distb_sum += Number(data.response["Q" + i]);
    }

    if (distb_sum == 0) {
      psqi_components.PSQIDISTB = 0;
    } else if (distb_sum <= 9) {
      psqi_components.PSQIDISTB = 1;
    } else if (distb_sum <= 18) {
      psqi_components.PSQIDISTB = 2;
    } else if (distb_sum > 18) {
      psqi_components.PSQIDISTB = 3;
    }

    /* PSQILATEN SLEEP LATENCY (continued)
      Use values of recoded Q2 (see above), and then:
        
      IF Q5a + Q2new = 0, THEN set value to 0 
      IF Q5a + Q2new >= 1 and <= 2, THEN set value to 1 
      IF Q5a + Q2new >= 3 and <= 4, THEN set value to 2 
      IF Q5a + Q2new >= 5 and <= 6, THEN set value to 3

    Minimum Score = 0 (better); Maximum Score = 3 (worse) */

    psqi_components.PSQILATEN =
      psqi_components.PSQILATEN + Number(data.response["Q0"]);

    if (psqi_components.PSQILATEN == 0) {
      psqi_components.PSQILATEN = 0;
    } else if (psqi_components.PSQILATEN <= 2) {
      psqi_components.PSQILATEN = 1;
    } else if (psqi_components.PSQILATEN <= 4) {
      psqi_components.PSQILATEN = 2;
    } else if (psqi_components.PSQILATEN <= 6) {
      psqi_components.PSQILATEN = 3;
    }

    /* PSQIDAYDYS DAY DISFUNCTION DUE TO SLEEPINESS
    
      IF Q8 + Q9 = 0, THEN set value to 0 
      IF Q8 + Q9 >= 1 and <= 2, THEN set value to 1 
      IF Q8 + Q9 >= 3 and <= 4, THEN set value to 2 
      IF Q8 + Q9 >= 5 and <= 6, THEN set value to 3 

    Minimum Score = 0 (better); Maximum Score = 3 (worse) */

    psqi_components.PSQIDAYDYS =
      Number(data.response["Q12"]) + Number(data.response["Q13"]);

    if (psqi_components.PSQIDAYDYS == 0) {
      psqi_components.PSQIDAYDYS = 0;
    } else if (psqi_components.PSQIDAYDYS <= 2) {
      psqi_components.PSQIDAYDYS = 1;
    } else if (psqi_components.PSQIDAYDYS <= 4) {
      psqi_components.PSQIDAYDYS = 2;
    } else if (psqi_components.PSQIDAYDYS <= 6) {
      psqi_components.PSQIDAYDYS = 3;
    }

    /* PSQISLPQUAL OVERALL SLEEP QUALITY 
      Q6 
    Minimum Score = 0 (better); Maximum Score = 3 (worse) */
    psqi_components.PSQISLPQUAL = Number(data.response["Q10"]);

    /* PSQIMEDS NEEDS MEDS TO SLEEP
      Q7
    Minimum Score = 0 (better); Maximum Score = 3 (worse) */
    psqi_components.PSQIMEDS = Number(data.response["Q11"]);

    /* TOTAL 
      DURAT + DISTB + LATEN + DAYDYS + HSE + SLPQUAL + MEDS Minimum 
      Score = 0 (better); Maximum Score = 21 (worse) 
    
    Interpretation: TOTAL < 5 associated with good sleep quality */

    data.psqi_components = JSON.stringify(psqi_components);
    data.psqi_total = Object.values(psqi_components).reduce(
      (acc, val) => acc + val,
      0
    );

    data.response = JSON.stringify(data.response);
  },
};

var meq_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => meq_instr_text,
  choices: () => [cont_text],
  data: { trial: "meq_instructions" },
};

// Items -----------------------------------------------------------------------------------------------

// Items are numbered according to Horne & Ostberg, 1976
var mornEveItem1 = {
  type: jsPsychHtmlSliderResponse,
  stimulus: () => meq_1_text,
  min: 0,
  max: 28,
  steps: 1,
  slider_start: 0,
  labels: () => meq_labels1,
  require_movement: true,
  button_label: () => cont_text,
  data: { meq_item: 1, trial: "meq_item" },
  on_finish: function (data) {
    data.response_label = meq_labels1_data[data.response];
    // Calculate questionnaire score
    if (data.response <= 6) {
      data.meq_item_score = 5;
    } else if (data.response <= 11) {
      data.meq_item_score = 4;
    } else if (data.response <= 19) {
      data.meq_item_score = 3;
    } else if (data.response <= 24) {
      data.meq_item_score = 2;
    } else {
      data.meq_item_score = 1;
    }
  },
};

var mornEveItem7 = {
  type: jsPsychSurveyLikert,
  questions: [
    {
      prompt: () => meq_7_prompt,
      labels: () => meq_7_labels,
      required: true,
    },
  ],
  data: { meq_item: 7, trial: "meq_item" },
  button_label: () => cont_text,
  on_finish: function (data) {
    // Clean up: Question order is not needed because it's only a single item
    delete data.question_order;
    data.response = data.response["Q0"];
    data.response_label = meq_7_labels[data.response];
    // Calculate score
    data.meq_item_score = data.response + 1;
  },
};

var mornEveItem10 = {
  type: jsPsychHtmlSliderResponse,
  stimulus: () => meq_10_text,
  min: 0,
  max: 28,
  slider_start: 0,
  steps: 1,
  labels: meq_labels10,
  require_movement: true,
  button_label: () => cont_text,
  data: { meq_item: 10, trial: "meq_item" },
  on_finish: function (data) {
    data.response_label = meq_labels10_data[data.response];
    // Calculate questionnaire score
    if (data.response <= 4) {
      data.meq_item_score = 5;
    } else if (data.response <= 9) {
      data.meq_item_score = 4;
    } else if (data.response <= 19) {
      data.meq_item_score = 3;
    } else if (data.response <= 24) {
      data.meq_item_score = 2;
    } else {
      data.meq_item_score = 1;
    }
  },
};

var mornEveItem18 = {
  type: jsPsychHtmlSliderResponse,
  stimulus: () => meq_18_text,
  min: 0,
  max: 24,
  slider_start: 0,
  steps: 1,
  labels: () => meq_labels18,
  require_movement: true,
  button_label: () => cont_text,
  data: { meq_item: 18, trial: "meq_item" },
  on_finish: function (data) {
    data.response_label = meq_labels18_data[data.response];
    // Calculate questionnaire score
    if (data.response <= 4) {
      data.meq_item_score = 1;
    } else if (data.response <= 7) {
      data.meq_item_score = 5;
    } else if (data.response <= 9) {
      data.meq_item_score = 4;
    } else if (data.response <= 16) {
      data.meq_item_score = 3;
    } else if (data.response <= 21) {
      data.meq_item_score = 2;
    } else {
      data.meq_item_score = 1;
    }
  },
};

var mornEveItem19 = {
  type: jsPsychSurveyLikert,
  questions: [
    {
      prompt: () => meq_19_prompt,
      labels: () => meq_19_labels,
      required: true,
    },
  ],
  button_label: () => cont_text,
  data: { meq_item: 19, trial: "meq_item" },
  on_finish: function (data) {
    delete data.question_order;
    data.response = data.response["Q0"];
    data.response_label = meq_19_labels[data.response];
    data.meq_item_score = Math.abs(data.response - 3) * 2;

    // calculate total meq score
    let itemResponses = jsPsych.data.get().filterCustom(function (trial) {
      return trial.trial === "meq_item";
    });

    itemResponses = itemResponses.trials.map(
      ({ meq_item_score }) => meq_item_score
    );
    const meq_score = itemResponses.reduce((a, b) => a + b, 0);

    data.meq_total_score = meq_score;

    let meq_type;

    if (meq_score >= 22) {
      meq_type = meq_types_en[0];
    } else if (meq_score >= 18) {
      meq_type = meq_types_en[1];
    } else if (meq_score >= 12) {
      meq_type = meq_types_en[2];
    } else if (meq_score >= 8) {
      meq_type = meq_types_en[3];
    } else if (meq_score >= 4) {
      meq_type = meq_types_en[4];
    }

    data.meq_type = meq_type;
  },
};

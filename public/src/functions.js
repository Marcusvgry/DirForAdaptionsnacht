function startExperiment() {
  createTimeline();
  jsPsych.run(timeline);
}

/**
 * @param {Array<string>} tmrlist List that will be paired with tmrsound (remember + reaktiviert)
 * @param {Array<string>} tmflist List that will be paired with tmfsound (vergessen + reaktiviert)
 * @param {Array<string>} rlist List that will be paired with rsound (remember + nicht reaktiviert)
 * @param {Array<string>} flist List that will be paired with fsound (vergessen + nicht reaktiviert)
 * @param {number|string} tmrsound Sound that is played alongside remember words and is played during sleep (1-4)
 * @param {number|string} tmfsound Sound that is played alongside forget words and is played during sleep (1-4)
 * @param {number|string} rsound Sound that is played alongside remember words (1-4)
 * @param {number|string} fsound Sound that is played alongside forget words (1-4)
 * @returns {Array<Object>} Array in the timelinevariable Format of {word: string, instruction: string, sound: int}
 */
function createWordLists(
  tmrlist,
  tmflist,
  rlist,
  flist,
  tmrsound,
  tmfsound,
  rsound,
  fsound
) {
  const listcomplete = [];

  (tmrlist || []).forEach((word) =>
    listcomplete.push({ word, instruction: "EEE", sound: tmrsound })
  );
  (rlist || []).forEach((word) =>
    listcomplete.push({ word, instruction: "EEE", sound: rsound })
  );
  (tmflist || []).forEach((word) =>
    listcomplete.push({ word, instruction: "VVV", sound: tmfsound })
  );
  (flist || []).forEach((word) =>
    listcomplete.push({ word, instruction: "VVV", sound: fsound })
  );
  return listcomplete;
}

/**
 * @param {Array<Object>} stimuli: Array in the following format: {word: string, instruction: string, sound: int}
 * @returns {Array<Object>}: Shuffled array of stimuli with 3x "VVV" and 3x "EEE" in the first and last 6 positions
 */
function counteractPrimRecEffects(stimuli) {
  let poolVVV = stimuli.filter((s) => s.instruction === "VVV");
  let poolEEE = stimuli.filter((s) => s.instruction === "EEE");

  function sample(arr, n) {
    const actualN = Math.min(n, arr.length);
    return jsPsych.randomization.sampleWithoutReplacement(arr, actualN);
  }

  let firstVVV = sample(poolVVV, 3);
  poolVVV = poolVVV.filter((s) => !firstVVV.includes(s));
  let firstEEE = sample(poolEEE, 3);
  poolEEE = poolEEE.filter((s) => !firstEEE.includes(s));
  let blockFirst = jsPsych.randomization.shuffle([...firstVVV, ...firstEEE]);

  let lastVVV = sample(poolVVV, 3);
  poolVVV = poolVVV.filter((s) => !lastVVV.includes(s));
  let lastEEE = sample(poolEEE, 3);
  poolEEE = poolEEE.filter((s) => !lastEEE.includes(s));
  let blockLast = jsPsych.randomization.shuffle([...lastVVV, ...lastEEE]);

  let blockMiddle = jsPsych.randomization.shuffle([...poolVVV, ...poolEEE]);

  return [...blockFirst, ...blockMiddle, ...blockLast];
}

// Maps different sound representations (number, "sound1", Audio object, file key) to a playable Audio instance
function resolveSoundToAudio(sound) {
  if (!sound) return null;

  const known = {
    sound1: typeof sound1 !== "undefined" ? sound1 : null,
    sound2: typeof sound2 !== "undefined" ? sound2 : null,
    sound3: typeof sound3 !== "undefined" ? sound3 : null,
    sound4: typeof sound4 !== "undefined" ? sound4 : null,
    sound5: typeof sound5 !== "undefined" ? sound5 : null,
    bsp_e: typeof bsp_e !== "undefined" ? bsp_e : null,
    bsp_v: typeof bsp_v !== "undefined" ? bsp_v : null,
  };

  if (typeof sound.play === "function") {
    return sound;
  }

  const createFromKey = (key) => {
    if (known[key]) {
      return known[key];
    }
    if (soundFiles && soundFiles[key]) {
      return new Audio(soundFiles[key]);
    }
    return null;
  };

  if (typeof sound === "number") {
    const key = `sound${sound}`;
    if (typeof window !== "undefined" && window[key]) {
      return window[key];
    }
    return createFromKey(key);
  }

  if (typeof sound === "string") {
    const trimmed = sound.trim().toLowerCase();
    if (!trimmed) return null;

    const numberMatch =
      trimmed.match(/^sound\s*(\d)$/) || trimmed.match(/^(\d)$/);
    if (numberMatch) {
      const key = `sound${numberMatch[1]}`;
      if (typeof window !== "undefined" && window[key]) {
        return window[key];
      }
      return createFromKey(key);
    }

    if (soundFiles && soundFiles[trimmed]) {
      return new Audio(soundFiles[trimmed]);
    }
  }

  return null;
}

function buildToneLearningTimeline({
  rememberSleep,
  forgetSleep,
  remember,
  forget,
  toneDurationMs = 1500,
}) {
  const tones = [
    {
      label:
        "Dieser Ton wird zusammen mit Wörtern abgespielt, die sie Erinnern sollen.",
      sound: rememberSleep,
    },
    {
      label:
        "Dieser Ton wird zusammen mit Wörtern abgespielt, die sie Vergessen sollen.",
      sound: forgetSleep,
    },
    {
      label:
        "Dieser Ton wird zusammen mit Wörtern abgespielt, die sie Erinnern sollen.",
      sound: remember,
    },
    {
      label:
        "Dieser Ton wird zusammen mit Wörtern abgespielt, die sie Vergessen sollen.",
      sound: forget,
    },
  ];

  const maxReplays = 2;

  const toneTrials = tones.map(({ label, sound }) => ({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div class="instructions"><p>${label}</p></div>`,
    choices: "NO_KEYS",
    response_ends_trial: false,
    trial_duration: null,
    prompt: `
      <div class="tone-button-row" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 16px;">
        <button type="button" id="tone-replay-btn" class="jspsych-btn secondary-btn">Ton nochmal abspielen</button>
        <button type="button" id="tone-next-btn" class="jspsych-btn">Nächsten Ton abspielen</button>
      </div>
    `,
    on_load: function () {
      const audio = resolveSoundToAudio(sound);
      const display = jsPsych.getDisplayElement();
      const replayBtn = display.querySelector("#tone-replay-btn");
      const nextBtn = display.querySelector("#tone-next-btn");

      if (!replayBtn || !nextBtn) {
        jsPsych.finishTrial({
          sound_played: false,
          label,
          replay_count: 0,
          total_plays: 0,
        });
        return;
      }

      let replayCount = 0;
      let totalPlays = 0;
      let finished = false;
      let isPlaying = false;
      let endTimeout = null;
      let currentEndHandler = null;

      const setButtonsDisabled = (disabled) => {
        replayBtn.disabled = disabled || replayCount >= maxReplays;
        nextBtn.disabled = disabled;
      };

      const clearEndWatchers = () => {
        if (
          currentEndHandler &&
          audio &&
          typeof audio.removeEventListener === "function"
        ) {
          audio.removeEventListener("ended", currentEndHandler);
        }
        currentEndHandler = null;
        if (endTimeout) {
          clearTimeout(endTimeout);
          endTimeout = null;
        }
      };

      const finishTrial = (played) => {
        if (finished) return;
        finished = true;
        setButtonsDisabled(true);
        clearEndWatchers();
        if (audio && typeof audio.pause === "function") {
          audio.pause();
        }
        jsPsych.finishTrial({
          sound_played: !!played,
          label,
          replay_count: replayCount,
          total_plays: totalPlays,
        });
      };

      const resolveDuration = () => {
        if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
          return audio.duration * 1000;
        }
        return toneDurationMs;
      };

      const playTone = (onEnd) => {
        if (isPlaying) return false;
        if (!audio) {
          if (typeof onEnd === "function") {
            onEnd(false);
          }
          return false;
        }

        clearEndWatchers();

        if (typeof audio.pause === "function") {
          audio.pause();
        }
        audio.currentTime = 0;
        isPlaying = true;

        const wrappedEnd = (wasOk) => {
          if (!isPlaying) return;
          isPlaying = false;
          clearEndWatchers();
          if (typeof onEnd === "function") {
            onEnd(wasOk);
          }
        };

        currentEndHandler = () => wrappedEnd(true);
        if (typeof audio.addEventListener === "function") {
          audio.addEventListener("ended", currentEndHandler, { once: true });
        }

        const duration = resolveDuration();
        endTimeout = setTimeout(() => wrappedEnd(true), duration + 200);

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch((err) => {
            console.warn("Audio play failed", err);
            wrappedEnd(false);
          });
        }

        return true;
      };

      const startInitialPlayback = () => {
        if (!audio) {
          setButtonsDisabled(false);
          return;
        }
        setButtonsDisabled(true);
        const played = playTone(() => {
          setButtonsDisabled(false);
        });
        if (played) {
          totalPlays += 1;
        } else {
          setButtonsDisabled(false);
        }
      };

      replayBtn.addEventListener("click", () => {
        if (finished || replayCount >= maxReplays || isPlaying) return;
        setButtonsDisabled(true);
        const played = playTone(() => {
          setButtonsDisabled(false);
        });
        if (played) {
          replayCount += 1;
          totalPlays += 1;
        } else {
          setButtonsDisabled(false);
        }
      });

      nextBtn.addEventListener("click", () => {
        if (finished) return;
        if (isPlaying) return;
        setButtonsDisabled(true);
        finishTrial(totalPlays > 0);
      });

      // Play each tone once automatically when the trial loads; replays come from the replay button.
      startInitialPlayback();
    },
  }));

  return { timeline: toneTrials };
}

/**
 * @param {Array<string>} tmrlist Words for remember + reaktiviert
 * @param {Array<string>} tmflist Words for vergessen + reaktiviert
 * @param {Array<string>} rlist Words for remember + nicht reaktiviert
 * @param {Array<string>} flist Words for vergessen + nicht reaktiviert
 * @param {number|string} tmrsound Sound that is played alongside remember words and is played during sleep (1-4)
 * @param {number|string} tmfsound Sound that is played alongside forget words and is played during sleep (1-4)
 * @param {number|string} rsound Sound that is played alongside remember words (1-4)
 * @param {number|string} fsound Sound that is played alongside forget words (1-4)
 * @param {boolean} counterPrimRec Whether to counteract primacy and recency effects
 * @param {boolean} [testList] Whether to add EEE words to the cued recall test list
 */
function createLearningPhase(
  tmrlist,
  tmflist,
  rlist,
  flist,
  tmrsound,
  tmfsound,
  rsound,
  fsound,
  counterPrimRec,
  testList
) {
  let learningTimeline = createWordLists(
    tmrlist,
    tmflist,
    rlist,
    flist,
    tmrsound,
    tmfsound,
    rsound,
    fsound
  );

  if (counterPrimRec) {
    learningTimeline = counteractPrimRecEffects(learningTimeline);
  } else {
    learningTimeline = jsPsych.randomization.shuffle(learningTimeline);
  }

  // Prepopulate test recall list with the EEE words (after shuffling) so they are available later
  if (testList) {
    const seen = new Set(cuedRecallTestList);
    learningTimeline.forEach((item) => {
      if (
        item &&
        item.instruction === "EEE" &&
        typeof item.word === "string" &&
        !seen.has(item.word)
      ) {
        cuedRecallTestList.push(item.word);
        seen.add(item.word);
      }
    });
  }

  console.log(learningTimeline);
  return {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size: 60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: 500,
      },
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: jsPsych.timelineVariable("word"),
        choices: "NO_KEYS",
        trial_duration: 2000,
        stimulus_duration: 2000,
        css_classes: ["stimulus-large-text"],
        on_load: function () {
          if (testList && jsPsych.timelineVariable("instruction") == "EEE") {
            const word = jsPsych.timelineVariable("word");
            if (!cuedRecallTestList.includes(word)) {
              cuedRecallTestList.push(word);
            }
          }
        },
      },
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: jsPsych.timelineVariable("instruction"),
        choices: "NO_KEYS",
        trial_duration: null,
        css_classes: ["stimulus-large-text"],
        response_ends_trial: false,
        on_load: function () {
          const sound = jsPsych.evaluateTimelineVariable("sound");
          const audio = resolveSoundToAudio(sound);
          if (!audio) {
            console.warn("No valid sound provided for learning phase", sound);
            return;
          }
          let finished = false;
          const finish = () => {
            if (finished) return;
            finished = true;
            jsPsych.finishTrial();
          };
          audio.currentTime = 0;
          audio.play().catch((err) => {
            console.warn("Audio play failed", err);
            finish();
          });
          audio.addEventListener("ended", finish, { once: true });
          const duration =
            (audio && Number.isFinite(audio.duration) && audio.duration > 0
              ? audio.duration * 1000
              : 1500) || 1500;
          setTimeout(finish, duration + 200);
        },
      },
    ],
    timeline_variables: learningTimeline,
  };
}

/**
 * @param {Array<Object>} list: complete List
 * @param {number} rlist: List that will be remembered: 1 or 2
 * @return {Array<Object>} Array with the words, that will be remembered
 */
function getRememberedWords(list, rlist) {
  return rlist === 1
    ? list.slice(0, Math.floor(list.length / 2))
    : list.slice(Math.floor(list.length / 2));
}

// Fragebogen

const OPTIONAL_DEMOGRAPHIC_FIELDS = new Set([
  "misc_general",
  "misc_handedness",
  "misc_cycle",
  "study_field",
  "pregnancy",
  "cycle_known",
  "cycle_phase",
  "last_period",
  "cycle_day",
  "contraception",
  "contraception_type",
]);

const isOptionalDemographicField = (name) =>
  OPTIONAL_DEMOGRAPHIC_FIELDS.has(String(name ?? ""));

function checkOther(
  val,
  comparison,
  div_id = null,
  text_ids = null,
  select_ids = null
) {
  // Normalize to arrays
  if (text_ids && !Array.isArray(text_ids)) text_ids = [text_ids];
  if (select_ids && !Array.isArray(select_ids)) select_ids = [select_ids];

  const showExtraFields = comparison.includes(val);

  // Show/hide additional div if applicable
  if (div_id) {
    const div = document.getElementById(div_id);
    if (div) {
      div.style.display = showExtraFields ? "block" : "none";
      const elements = div.querySelectorAll("input, select, textarea");
      elements.forEach((el) => {
        const type = (el.getAttribute("type") || "").toLowerCase();
        const optional = isOptionalDemographicField(el.getAttribute("name"));
        if (showExtraFields) {
          if (!optional && !["button", "submit", "reset"].includes(type)) {
            el.setAttribute("required", "required");
          }
        } else {
          if (type === "checkbox" || type === "radio") {
            el.checked = false;
          } else if (el.tagName === "SELECT") {
            el.selectedIndex = 0;
          } else {
            el.value = "";
          }
          el.removeAttribute("required");
        }
      });
    }
  }

  // Handle text fields
  if (text_ids) {
    text_ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = showExtraFields ? "block" : "none";
        const optional = isOptionalDemographicField(el.getAttribute("name"));
        if (showExtraFields && !optional) {
          el.setAttribute("required", "required");
        } else {
          el.removeAttribute("required");
          el.value = "";
        }
      }
    });
  }

  // Handle select fields
  if (select_ids) {
    select_ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const optional = isOptionalDemographicField(el.getAttribute("name"));
        if (showExtraFields && !optional) {
          el.setAttribute("required", "required");
        } else {
          el.removeAttribute("required");
          el.value = "";
        }
      }
    });
  }

  if (typeof enforceDemographicsRequired === "function") {
    enforceDemographicsRequired();
  }
}

function enforceDemographicsRequired() {
  const container = document.querySelector(".questions");
  if (!container) return;

  const elements = container.querySelectorAll("input, select, textarea");
  elements.forEach((el) => {
    const type = (el.getAttribute("type") || "").toLowerCase();
    const name = el.getAttribute("name");
    if (["button", "submit", "reset", "hidden"].includes(type)) return;
    if (isOptionalDemographicField(name)) {
      el.removeAttribute("required");
      return;
    }
    if (el.disabled) {
      el.removeAttribute("required");
      return;
    }
    const style = window.getComputedStyle(el);
    const isVisible =
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      el.offsetParent !== null;

    if (isVisible) {
      el.setAttribute("required", "required");
    } else {
      el.removeAttribute("required");
    }
  });
}

// FUNCTIONS --------------------------------------------------------------------------------------------

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// PVT timer function
function startTimer() {
  var start = Date.now();

  // Interval in a variable so it can be reset
  timer_interval = setInterval(timer, 1); // now set the value of the timer_interval variable, which also starts the timer

  function timer() {
    // get the number of seconds that have elapsed since
    // startTimer() was called
    diff = (Date.now() - start) | 0;
    diff = String(diff);

    // add 00s if necessary
    if (diff.length == 4) {
      disp = `<span style="color: rgb(104, 30, 30)">0</span><span style="color:  rgb(241, 26, 26);">${diff}</span>`;
    } else if (diff.length == 3) {
      disp = `<span style="color: rgb(104, 30, 30)">00</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 2) {
      disp = `<span style="color: rgb(104, 30, 30)">000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 1) {
      disp = `<span style="color: rgb(104, 30, 30)">0000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    }

    display = document.querySelector("#time");
    display.innerHTML = disp;
  }
  // we don't want to wait a full second before the timer starts
  minutes = timer();
}

function matchTerm(answerRaw, termRaw) {
  const ansStr = String(answerRaw ?? "").trim();
  const numAns = toNum(answerRaw);
  let term = String(termRaw ?? "").trim();
  let negate = false;
  if (term.startsWith("!")) {
    negate = true;
    term = term.slice(1).trim();
  }

  if (term.startsWith("/") && term.lastIndexOf("/") > 0) {
    const last = term.lastIndexOf("/");
    const re = new RegExp(term.slice(1, last), term.slice(last + 1) || "i");
    const ok = re.test(ansStr);
    return negate ? !ok : ok;
  }

  if (
    (term.startsWith("*") && term.endsWith("*") && term.length > 2) ||
    term.startsWith("~")
  ) {
    const sub = term.startsWith("~") ? term.slice(1) : term.slice(1, -1);
    const ok = ansStr.toLowerCase().includes(String(sub).toLowerCase());
    return negate ? !ok : ok;
  }

  const m = term.match(/^(<=|>=|<|>|==|=|!=)\s*(.+)$/);
  if (m) {
    const [, op, rhsRaw] = m;
    const rhsNum = toNum(rhsRaw);
    const aNum = numAns;
    const aStr = ansStr.toLowerCase();
    const bStr = String(rhsRaw).trim().toLowerCase();
    let ok;
    if (!Number.isNaN(rhsNum) && !Number.isNaN(aNum)) {
      ok =
        op === "<"
          ? aNum < rhsNum
          : op === "<="
          ? aNum <= rhsNum
          : op === ">"
          ? aNum > rhsNum
          : op === ">="
          ? aNum >= rhsNum
          : op === "!="
          ? aNum !== rhsNum
          : aNum === rhsNum;
    } else {
      ok = op === "!=" ? aStr !== bStr : aStr === bStr;
    }
    return negate ? !ok : ok;
  }

  if (term.includes(",")) {
    const set = term
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const ok = set.includes(ansStr.toLowerCase());
    return negate ? !ok : ok;
  }

  const ok = ansStr.toLowerCase() === term.toLowerCase();
  return negate ? !ok : ok;
}

function splitCriterion(text, delimiter) {
  if (text == null) return [];
  const parts = [];
  let current = "";
  let inRegex = false;
  let escapeNext = false;

  for (const ch of String(text)) {
    if (escapeNext) {
      current += ch;
      escapeNext = false;
      continue;
    }
    if (ch === "\\") {
      current += ch;
      escapeNext = true;
      continue;
    }
    if (ch === "/" && !inRegex) {
      inRegex = true;
      current += ch;
      continue;
    }
    if (ch === "/" && inRegex) {
      inRegex = false;
      current += ch;
      continue;
    }
    if (!inRegex && ch === delimiter) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

function matchesCriterion(answer, criterion) {
  if (criterion == null) return false;
  const crit = String(criterion).trim();
  if (!crit) return false;
  const orGroups = splitCriterion(crit, "|")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!orGroups.length) return false;

  return orGroups.some((group) =>
    splitCriterion(group, "&")
      .map((s) => s.trim())
      .filter(Boolean)
      .every((t) => matchTerm(answer, t))
  );
}

function evaluateExclusions(participantData, exclusionCriteria, softHardMap) {
  const items = [];
  let hasHard = false;

  for (const [name, criterion] of Object.entries(exclusionCriteria)) {
    const severity = softHardMap[name]; // "hard" | "soft" | undefined
    if (!severity || String(criterion).trim() === "") continue;

    const answer = participantData[name];
    if (matchesCriterion(answer, criterion)) {
      items.push({ name, answer, severity, criterion: String(criterion) });
      if (severity === "hard") hasHard = true;
    }
  }
  return { isExcludedHard: hasHard, items };
}

function getLabelFromP(p) {
  if (!p) return "";
  const clone = p.cloneNode(true);
  clone
    .querySelectorAll("input,select,textarea,div")
    .forEach((n) => n.remove());
  return clone.textContent
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[:：]\s*$/, "");
}

function prefillAndMark(html, data, items) {
  const wrap = document.createElement("div");
  wrap.innerHTML = html;

  const ensureVisible = (element) => {
    let current = element;
    while (current && current !== wrap) {
      if (current.nodeType === 1) {
        if (current.hasAttribute("hidden")) {
          current.removeAttribute("hidden");
        }
        if (
          current.style &&
          typeof current.style.display === "string" &&
          current.style.display.toLowerCase() === "none"
        ) {
          current.style.removeProperty("display");
        }
      }
      current = current.parentElement;
    }
  };

  const controlHasValue = (control) => {
    const tag = control.tagName.toLowerCase();
    const type = (control.getAttribute("type") || "").toLowerCase();
    if (tag === "textarea") {
      return control.textContent && control.textContent.trim() !== "";
    }
    if (tag === "select") {
      return Array.from(control.querySelectorAll("option")).some((opt) =>
        opt.hasAttribute("selected")
      );
    }
    if (type === "radio" || type === "checkbox") {
      return control.hasAttribute("checked");
    }
    const attrVal = control.getAttribute("value");
    return attrVal != null && String(attrVal).trim() !== "";
  };

  const revealAnsweredBlocks = () => {
    const maybeReveal = (node) => {
      const inputs = node.querySelectorAll("input, select, textarea");
      if (Array.from(inputs).some((ctrl) => controlHasValue(ctrl))) {
        ensureVisible(node);
      }
    };

    wrap.querySelectorAll("[hidden]").forEach(maybeReveal);
    wrap.querySelectorAll("*[style]").forEach((node) => {
      if (
        node.style &&
        typeof node.style.display === "string" &&
        node.style.display.toLowerCase() === "none"
      ) {
        maybeReveal(node);
      }
    });
  };

  Object.entries(data || {}).forEach(([name, val]) => {
    wrap.querySelectorAll(`[name="${CSS.escape(name)}"]`).forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const type = (el.getAttribute("type") || "").toLowerCase();

      if (tag === "select") {
        el.querySelectorAll("option").forEach((opt) => {
          if (opt.value === String(val ?? "")) opt.setAttribute("selected", "");
          else opt.removeAttribute("selected");
        });
      } else if (tag === "textarea") {
        el.textContent = val ?? "";
      } else if (type === "checkbox" || type === "radio") {
        const checked = Array.isArray(val)
          ? val.includes(el.value)
          : String(val) === String(el.value) ||
            (type === "checkbox" && (val === true || val === "on"));
        if (checked) el.setAttribute("checked", "");
        else el.removeAttribute("checked");
      } else {
        if (val == null || val === "") el.removeAttribute("value");
        else el.setAttribute("value", String(val));
      }
    });
  });

  revealAnsweredBlocks();

  (items || []).forEach((item) => {
    if (!item || !item.name) return;
    wrap.querySelectorAll(`[name="${CSS.escape(item.name)}"]`).forEach((el) => {
      ensureVisible(el);
      const container =
        el.closest("[data-question]") ||
        el.closest("p") ||
        el.closest("fieldset") ||
        el.parentElement;
      if (!container) return;

      ensureVisible(container);
      const baseClass = "demographics-flag";
      const severityClass =
        item.severity === "hard"
          ? "demographics-flag-hard"
          : "demographics-flag-soft";
      container.classList.add(baseClass, severityClass);
    });
  });

  return wrap.innerHTML;
}

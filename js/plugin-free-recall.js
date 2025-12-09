var freeRecall = (function (jspsych) {
  "use strict";

  const info = {
    name: "freeRecall",
    version: "1.1.0",
    parameters: {
      prompt: {
        type: jspsych.ParameterType.STRING,
        default: "Bitte geben Sie ein Wort ein und drücken Sie Enter.",
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Fertig",
      },
      data: {
        type: jspsych.ParameterType.OBJECT,
        default: {},
      },
    },
  };

  class FreeRecallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      let words = []; // Eingegebene Wörter
      let reaction_times = []; // Reaktionszeiten pro Wort
      let all_responses_free_recall = []; // Array mit { word, reaction_time }

      let lastWordEndTime = performance.now(); // Wann das letzte Wort bestätigt wurde
      let firstKeypressTime = null; // Wann VPNdas erste Mal tippt (für aktuelles Wort)

      let html = `
        <div id="jspsych-free-recall" class="survey-container">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
          </div>
          <form id="jspsych-free-recall-form" style="width: 100%;">
            <!-- Eingabefeld -->
            <input
              type="text"
              id="free-recall-input"
              name="response"
              class="jspsych-input input-field"
              autofocus
            />
            <div class="recall-footer">
              <!-- Checkbox-Container -->
              <div id="confirmation-checkbox-container" style="display: none;">
                <input type="checkbox" id="confirmation-checkbox" />
                <label for="confirmation-checkbox" style="margin-left: 5px;">
                  Beenden bestätigen
                </label>
                <small id="confirmation-warning" style="display:none;color:#c62828;margin-left:8px;">
                </small>
              </div>
              <!-- Fertig-Button -->
              <button
                type="submit"
                id="free-recall-submit"
                class="jspsych-btn"
              >
                ${trial.button_label}
              </button>
            </div>
          </form>
        </div>
      `;

      display_element.innerHTML = html;

      const inputElement = display_element.querySelector("#free-recall-input");
      const formElement = display_element.querySelector(
        "#jspsych-free-recall-form"
      );
      const submitButton = display_element.querySelector("#free-recall-submit");
      const checkboxContainer = display_element.querySelector(
        "#confirmation-checkbox-container"
      );
      const confirmationCheckbox = display_element.querySelector(
        "#confirmation-checkbox"
      );
      const confirmationWarning = display_element.querySelector(
        "#confirmation-warning"
      );

      let buttonClickedOnce = false;

      inputElement.addEventListener("keydown", (e) => {
        if (
          !firstKeypressTime &&
          e.key.length === 1 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          firstKeypressTime = performance.now();
        }

        if (e.key === "Enter") {
          e.preventDefault();

          const value = inputElement.value.trim();
          if (value) {
            let rt = 0;
            if (firstKeypressTime) {
              rt = Math.round(firstKeypressTime - lastWordEndTime);
            }
            words.push(value);
            reaction_times.push(rt);
            all_responses_free_recall.push({ word: value, reaction_time: rt });

            lastWordEndTime = performance.now();
            firstKeypressTime = null;
            inputElement.value = "";
          }
        }
      });

      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        const value = inputElement.value.trim();
        if (value) {
          let rt = 0;
          if (firstKeypressTime) {
            rt = Math.round(firstKeypressTime - lastWordEndTime);
          }
          words.push(value);
          reaction_times.push(rt);
          all_responses_free_recall.push({ word: value, reaction_time: rt });

          lastWordEndTime = performance.now();
          firstKeypressTime = null;
          inputElement.value = "";
        }

        if (!buttonClickedOnce) {
          checkboxContainer.style.display = "flex";
          confirmationCheckbox.checked = false;
          confirmationWarning.style.display = "none";
          buttonClickedOnce = true;
          return;
        }

        if (!confirmationCheckbox.checked) {
          confirmationWarning.style.display = "inline";
          confirmationCheckbox.focus();
          return;
        }

        confirmationWarning.style.display = "none";

        const trialdata = {
          words: words,
          reaction_times: reaction_times,
          all_responses_free_recall: all_responses_free_recall,
          data: trial.data,
        };
        this.jsPsych.finishTrial(trialdata);
      });
    }
  }

  FreeRecallPlugin.info = info;
  return FreeRecallPlugin;
})(jsPsychModule);

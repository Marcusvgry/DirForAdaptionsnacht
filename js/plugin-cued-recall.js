var cuedRecall = (function (jspsych) {
  "use strict";

  const info = {
    name: "cuedRecall",
    version: "1.2.3",
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
      string_to_display: {
        type: jspsych.ParameterType.ARRAY,
        default: [],
      },
      randomized: {
        type: jspsych.ParameterType.BOOL,
        default: true,
      },
    },
  };

  class CuedRecallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    trial(display_element, trial) {
      let responses = [];
      let lastWordEndTime = performance.now();
      let firstKeypressTime = null;
      let currentWordIndex = 0;

      let wordsToDisplay = Array.isArray(trial.string_to_display)
        ? trial.string_to_display.slice()
        : [];

      if (wordsToDisplay.length === 0) {
        console.warn(
          "cuedRecall: string_to_display is empty or invalid.",
          trial.string_to_display
        );
        display_element.innerHTML = `
          <div id="jspsych-cued-recall" class="survey-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
            <p class="jspsych-prompt">Keine W��rter zum Abruf konfiguriert.</p>
          </div>
        `;
        this.jsPsych.finishTrial({
          responses: [],
          randomized_order: [],
          data: trial.data,
          error: "string_to_display_empty",
        });
        return;
      }

      if (trial.randomized) {
        wordsToDisplay = this.shuffleArray(wordsToDisplay);
      }

      function getFirstTwoLetters(word) {
        return typeof word === "string" ? word.slice(0, 2) : "";
      }

      let html = `
        <div id="jspsych-cued-recall" class="survey-container">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
            <div class="jspsych-initial-words-container">
              <p class="jspsych-initial-words" id="current-word">${getFirstTwoLetters(
                wordsToDisplay[currentWordIndex]
              )}</p><input
                type="text"
                id="cued-recall-input"
                name="response"
                class="jspsych-input cued-recall-line-input"
              />
            </div>
          </div>
          <form id="cued-recall-form" style="width: 100%;">
            <div class="recall-footer">
              <!-- Checkbox-Container -->
              <div id="confirmation-checkbox-container" class="invisible-visibility">
                <input type="checkbox" id="confirmation-checkbox" />
                <label for="confirmation-checkbox" style="margin-left: 5px;">
                  Beenden bestätigen
                </label>
              </div>
              <!-- Fertig-Button -->
              <button
                type="submit"
                id="cued-recall-submit"
                class="jspsych-btn invisible-visibility"
              >
                ${trial.button_label}
              </button>
            </div>
          </form>
        </div>
      `;

      display_element.innerHTML = html;

      const inputElement = display_element.querySelector("#cued-recall-input");
      const wordElement = display_element.querySelector("#current-word");
      const formElement = display_element.querySelector("#cued-recall-form");
      const checkboxContainer = display_element.querySelector(
        "#confirmation-checkbox-container"
      );
      const confirmationCheckbox = display_element.querySelector(
        "#confirmation-checkbox"
      );
      const submitButton = display_element.querySelector("#cued-recall-submit");

      inputElement.focus();

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
          if (currentWordIndex < wordsToDisplay.length - 1) {
            handleWordSubmission();
          }
        }
      });

      function handleWordSubmission() {
        const value = inputElement.value.trim();
        if (!value) return;

        let rt = 0;
        if (firstKeypressTime) {
          rt = Math.round(firstKeypressTime - lastWordEndTime);
        }
        const currentWord = wordsToDisplay[currentWordIndex];
        responses.push({ antwort: value, rt: rt, wort: currentWord });

        currentWordIndex++;
        if (currentWordIndex < wordsToDisplay.length) {
          wordElement.textContent = getFirstTwoLetters(
            wordsToDisplay[currentWordIndex]
          );
          lastWordEndTime = performance.now();
          firstKeypressTime = null;
          inputElement.value = "";
          inputElement.focus();
        }

        if (currentWordIndex === wordsToDisplay.length - 1) {
          makeVisible(submitButton);
        }
      }
      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        if (currentWordIndex === wordsToDisplay.length - 1) {
          const value = inputElement.value.trim();
          if (value) {
            let rt = 0;
            if (firstKeypressTime) {
              rt = Math.round(firstKeypressTime - lastWordEndTime);
            }
            const currentWord = wordsToDisplay[currentWordIndex];
            responses.push({ antwort: value, rt: rt, wort: currentWord });
          }
        }

        if (!buttonClickedOnce) {
          makeVisible(checkboxContainer);
          buttonClickedOnce = true;
          return;
        } else {
          if (!confirmationCheckbox.checked) {
            return;
          }
          const trialdata = {
            responses: responses,
            randomized_order: wordsToDisplay,
            data: trial.data,
          };
          this.jsPsych.finishTrial(trialdata);
        }
      });

      function makeVisible(element) {
        element.classList.remove("invisible-visibility");
      }
    }
  }

  CuedRecallPlugin.info = info;
  return CuedRecallPlugin;
})(jsPsychModule);

/* -----------------------------------------
   PLUGIN-SPEZIFISCHES CSS 
----------------------------------------- */
const styleCuedRecall = document.createElement("style");
styleCuedRecall.innerHTML = `
  .invisible-visibility {
    visibility: hidden;
  }

.jspsych-initial-words-container {
  display: grid !important;
  grid-template-columns: auto 1fr !important; 
  align-items: baseline !important;
  margin: 10px auto 0 !important;            
  width: 300px !important;                
  max-width: 300px !important;
}

.jspsych-initial-words,
.cued-recall-line-input {
  font-size: 24px !important;
  line-height: 1.2 !important;
  font-family: inherit !important;
  font-weight: normal !important;
  margin: 0 !important;
  padding: 0 !important;
}

.cued-recall-line-input {
  grid-column: 2 !important;  
  width: 100% !important;       
  border: none !important;
  border-bottom: 2px solid black !important;
  background: transparent !important;
  outline: none !important;
  box-sizing: border-box !important;
}




  .recall-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
  }
`;
document.head.appendChild(styleCuedRecall);

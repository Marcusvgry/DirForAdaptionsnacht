var timeline = [];
var dataAlreadySaved = false;

function saveExperimentData(filenameSuffix = "") {
  if (dataAlreadySaved) return;
  const suffix = filenameSuffix || "";

  try {
    const vpnForm =
      jsPsych.data.get().filter({ form_id: "vpn" }).last(1).values()[0] ||
      jsPsych.data
        .get()
        .filter({ trial_type: "survey-html-form" })
        .first(1)
        .values()[0];

    const responses = vpnForm && vpnForm.response ? vpnForm.response : null;
    const hasVpn = responses && responses["Participant-ID"];
    const baseName = hasVpn
      ? `DirFor1_VP${responses["Participant-ID"]}`
      : "DirFor1_NoVPN";
    const filename = `${baseName}${suffix}.csv`;
    jsPsych.data.get().localSave("csv", filename);
  } catch (error) {
    console.error("Error while saving data:", error);
    jsPsych.data.get().localSave("csv", `DirFor1_Error${suffix}.csv`);
  } finally {
    dataAlreadySaved = true;
  }
}

const jsPsych = initJsPsych({
  use_webaudio: false,
  override_safe_mode: true,
  on_finish: function () {
    saveExperimentData();
  },
});

const buildFromVPNTrial = {
  type: jsPsychCallFunction,
  async: true,
  func: (done) => {
    const proceed = () => {
      const vpnData =
        jsPsych.data.get().filter({ form_id: "vpn" }).last(1).values()[0] ||
        jsPsych.data
          .get()
          .filter({ trial_type: "survey-html-form" })
          .last(1)
          .values()[0];

      const resp = vpnData && vpnData.response ? vpnData.response : {};

      const toNumber = (val, fallback) => {
        const n = Number(val);
        return Number.isFinite(n) ? n : fallback;
      };

      const rest = [
        instructions,
        pvt_start_screen,
        pvt_practice_outer,
        pvt_main_instructions,
        pvt_core,
        pvt_end_screen,
        stanfordSleepiness,
        pittsburgh1,
        pittsburgh2,
        meq_instructions,
        mornEveItem1,
        mornEveItem7,
        mornEveItem10,
        mornEveItem18,
        mornEveItem19,
        Debriefing,
      ];

      timeline.push(...rest);

      done();
    };

    if (settingsDone && typeof settingsDone.then === "function") {
      settingsDone.then(proceed).catch((e) => {
        console.error(e);
        proceed();
      });
    } else {
      proceed();
    }
  },
};

function createTimeline() {
  timeline.length = 0;
  timeline.push(
    {
      ...CBC_VPNNummer,
      data: { ...(CBC_VPNNummer.data || {}), form_id: "vpn" },
    },
    demographics_block,
    buildFromVPNTrial
  );
}

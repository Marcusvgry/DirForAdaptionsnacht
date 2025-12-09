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

      const selected_tmrsound = toNumber(resp["Erinnert + Reaktiviert Ton"], 1);
      const selected_tmfsound = toNumber(
        resp["Vergessen + Reaktiviert Ton"],
        2
      );
      const selected_rsound = toNumber(
        resp["Erinnert + Nicht-Reaktiviert Ton"],
        3
      );
      const selected_fsound = toNumber(
        resp["Vergessen + Nicht-Reaktiviert Ton"],
        4
      );
      const selected_sound5 = toNumber(resp["Unasoziierter Ton"], 5);

      const selected_tmr_list = toNumber(
        resp["Erinnert + Reaktiviert Liste"],
        1
      );
      const selected_tmf_list = toNumber(
        resp["Vergessen + Reaktiviert Liste"],
        2
      );
      const selected_r_list = toNumber(
        resp["Erinnert + Nicht-Reaktiviert Liste"],
        3
      );
      const selected_f_list = toNumber(
        resp["Vergessen + Nicht-Reaktiviert Liste"],
        4
      );

      const mainWordListMap = {
        1: wordList1,
        2: wordList2,
        3: wordList3,
        4: wordList4,
      };
      const resolveList = (selection, fallback) =>
        mainWordListMap[selection] || mainWordListMap[fallback] || [];

      jsPsych.data.addProperties({
        selected_tmrsound,
        selected_tmfsound,
        selected_rsound,
        selected_fsound,
        selected_sound5,
        selected_tmr_list,
        selected_tmf_list,
        selected_r_list,
        selected_f_list,
      });

      const mainLists = {
        tmr: resolveList(selected_tmr_list, 1),
        tmf: resolveList(selected_tmf_list, 2),
        r: resolveList(selected_r_list, 3),
        f: resolveList(selected_f_list, 4),
      };

      const rest = [
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
    buildFromVPNTrial
  );
}

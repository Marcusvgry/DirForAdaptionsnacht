const text_demographics = `
<div class="questions">

  <fieldset>
    <legend><b>Demografische Angaben</b></legend>
    <p>Wann ist Ihr Geburtsdatum?: <input class="large-input" name="birthdate" type="date"></p>
    <p>Wie alt sind Sie?: <input class="large-input" name="age" type="number" min="18" max="100">
    <br>

    </p>
    <p>Was ist Ihr biologisches Geschlecht?:
      <select class="large-select" name="sex">
        <option value=""></option>
        <option value="male">männlich</option>
        <option value="female">weiblich</option>
        <option value="divers">divers</option>
        <option value="keine_angabe">keine Angabe</option>
      </select>
    </p>
    <p> Mit welchem Geschlecht identifizieren Sie sich?
      <select class="large-select" name="gender_identity" onchange="checkOther(this.value, 'self_describe', null, 'gender_other', null)">
        <option value=""></option>
        <option value="male">männlich</option>
        <option value="female">weiblich</option>
        <option value="non_binary">nicht-binär</option>
        <option value="dont_say">keine Angabe</option>
        <option value="self_describe">individuelle Angabe</option>
      </select>
    </p>
    <p><input class="large-input" name="gender_other" id="gender_other" type="text" placeholder="Geschlechtsidentität" style="display:none;"></p>
    <p>Was ist Ihre Muttersprache?:
      <select class="large-select" name="language" onchange="checkOther(this.value, 'other', null, 'language_other', null)">
        <option value=""></option>
        <option value="German">deutsch</option>
        <option value="other">andere</option>
      </select>
    </p>
    <p><input class="large-input" name="language_other" id="language_other" type="text" placeholder="Muttersprache" style="display:none; margin-left: 2rem;"></p>
    <p>Können Sie fließend Deutsch sprechen?:
      <select class="large-select" name="fluency">
        <option value=""></option>
        <option value="yes">ja</option>
        <option value="no">nein</option>
      </select>
    <p>Was ist Ihre Staatsangehörigkeit?: <input class="large-input" name="nationality" type="text"></p>
    </p>

    <p>Was ist Ihr höchster erreichter Schulabschluss?:
      <select class="large-select" name="school_education">
        <option value=""></option>
        <option value="none">kein Abschluss</option>
        <option value="hauptschule">Volks-/Hauptschule</option>
        <option value="realschule">Mittlere Reife</option>
        <option value="abitur">Abitur/Fachabitur</option>
      </select>
    </p>
    <p>Was ist Ihr erreichter Berufsabschluss?:
      <select class="large-select" name="vocational_education">
        <option value=""></option>
        <option value="none">keine Berufsausbildung</option>
        <option value="ausbildung">Lehre/Ausbildung</option>
        <option value="fh">Fachhochschule</option>
        <option value="uni">Hochschule</option>
      </select>
    </p>
    <p>Was für eine Beschäftigung üben Sie derzeit aus?:
      <select class="large-select" name="employment">
        <option value=""></option>
        <option value="none">ohne Beschäftigung</option>
        <option value="buergergeld">Bürgergeld</option>
        <option value="alg1">ALG I</option>
        <option value="gelegenheit">Gelegenheitsjob</option>
        <option value="1euro">1-Euro-Job</option>
        <option value="zeitarbeit">Zeitarbeitsfirma</option>
        <option value="fest">feste Anstellung</option>
        <option value="selbst">selbstständig</option>
        <option value="rente">EU/BU-Rente</option>
        <option value="altersrente">Altersrente</option>
        <option value="studierend">Student*in</option>
      </select>
      <p>Falls Sie studiert haben oder derzeit studieren. Um welche Fächer handelt(e) es sich dabei?:
      <input class="large-input" name="study_field" type="text">
    </p>
    <p><b>Sonstige Informationen?:</b><br><textarea class="large-input" name="misc_general"></textarea></p>
  </fieldset>

  <hr>

  <fieldset>
    <legend><b>Händigkeit</b></legend>

    <p>Welche Händigkeit haben Sie?:
      <select class="large-select" name="handedness">
        <option value=""></option>
        <option value="rechts">rechtshändig</option>
        <option value="links">linkshändig</option>
        <option value="beid">beidhändig</option>
      </select>
    </p>
    <p><b>Sonstige Informationen?:</b><br><textarea class="large-input" name="misc_handedness"></textarea></p>
  </fieldset>

  <hr>

  <fieldset>
    <legend><b>Wohnsituation</b></legend>
    <p>Was ist Ihre derzeitige Wohnsituation?:
      <select class="large-select" name="living_situation">
        <option value=""></option>
        <option value="privat">Privatwohnung / WG</option>
        <option value="betreut">betreutes Wohnen</option>
        <option value="heim">nicht-therapeutisches Heim</option>
        <option value="jva">Justizvollzugsanstalt</option>
        <option value="wohnungslos">ohne festen Wohnsitz</option>
      </select>
    </p>
    <p>Leben Sie zusammen mit:
      <select class="large-select" name="cohabitation">
        <option value=""></option>
        <option value="allein">allein</option>
        <option value="eltern">Eltern (auch Pflege/Adoptiv)</option>
        <option value="partner">(Ehe)partner</option>
        <option value="verwandte">Verwandte</option>
        <option value="wg">WG / Wohnheim</option>
      </select>
    </p>
    <p>Was ist Ihr Familienstand?:
      <select class="large-select" name="marital_status">
        <option value=""></option>
        <option value="verheiratet">verheiratet</option>
        <option value="verwitwet">verwitwet</option>
        <option value="getrennt">getrennt / Geschieden</option>
        <option value="ledig">ledig</option>
      </select>
    </p>
    <p>Was ist die Anzahl Ihrer leiblichen Kinder?: <input class="large-input" name="children" type="number" min="0"></p>
  </fieldset>

  <hr>

  <fieldset>
    <legend><b>Zyklus</b></legend>
    <p>Besteht die Möglichkeit einer Schwangerschaft oder sind Sie derzeit schwanger?:
      <select class="large-select" name="pregnancy">
        <option value=""></option>
        <option value="ja">Ja</option>
        <option value="nein">Nein</option>
      </select>
    </p>
    <p>Ist Ihnen bekannt, in welcher Zyklusphase Sie sich befinden (Menstruationsphase, Follikelphase, Eisprung oder Lutealphase)?
      <select class="large-select" name="cycle_known" onchange="checkOther(this.value, 'ja', 'cycle_phase_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="cycle_phase_block" style="display:none; margin-left: 2rem;">
      <p>In welcher Zyklusphase befinden Sie sich derzeit?:
        <input class="large-input" name="cycle_phase" type="text">
      </p>
    </div>
    <p> Wann war das Datum Ihrer letzten Periode?:
      <input class="large-input" name="last_period" type="date">
    </p>
    <p> Bei welchem Zyklustag befinden Sie sich heute? Der erste Tag des Zyklus ist der erste Tag der Menstruation:
      <input class="large-input" name="cycle_day" type="number">
    </p>
    <p>Verwenden Sie hormonelle Kontrazeption?
      <select class="large-select" name="contraception" onchange="checkOther(this.value, 'ja', 'contraception_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="contraception_block" style="display:none; margin-left: 2rem;">
      <p>Welche Art der hormonellen Kontrazeption verwenden Sie?
        <input class="large-input" name="contraception_type" type="text">
      </p>
    </div>
    <p><b>Sonstige Informationen:</b><br><textarea class="large-input" name="misc_cycle"></textarea></p>
  </fieldset>

  <hr>

  <fieldset>
    <legend><b>Substanz-Abfragen</b></legend>
    <p>Haben Sie heute Koffein konsumiert?:
      <select class="large-select" name="caffeine_today" onchange="checkOther(this.value, 'ja', 'caffeine_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="caffeine_block" style="display:none; margin-left: 2rem;">
      <p>Wie viel Koffein haben Sie heute konsumiert. Schreiben Sie dafür bitte in Referenzgläsergröße die Anzahl auf (z.B. 2 Tassen großer Kaffee (200ml); 1 Tasse Espresso; 1 Tasse Matcha; 1 Dose Cola (330ml):
        <input class="large-input" name="caffeine_amount" type="text">
      </p>
      <p>Wann haben Sie heute zuletzt Koffein konsumiert?:
        <input class="large-input" name="caffeine_time" type="time">
      </p>
    </div>

    <p>Haben Sie heute Alkohol konsumiert?:
      <select class="large-select" name="alcohol_today" onchange="checkOther(this.value, 'ja', 'alcohol_today_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="alcohol_today_block" style="display:none; margin-left: 2rem;">
      <p>Was haben Sie heute an Alkohol konsumiert (bitte mit Referenzgläsern: z.B. 1 Glas Rotwein; 1 x 0,5l Bier):
        <input class="large-input" name="alcohol_type_today" type="text">
      </p>
      <p>Wann haben Sie heute zuletzt Alkohol konsumiert?
        <input class="large-input" name="alcohol_time_today" type="time">
      </p>
    </div>

    <p>Haben Sie gestern Alkohol konsumiert?:
      <select class="large-select" name="alcohol_yesterday" onchange="checkOther(this.value, 'ja', 'alcohol_yesterday_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="alcohol_yesterday_block" style="display:none; margin-left: 2rem;">
      <p>Was haben Sie gestern an Alkohol konsumiert (bitte mit Referenzgläsern: z.B. 1 Glas Rotwein; 1 x 0,5l Bier):
        <input class="large-input" name="alcohol_type_yesterday" type="text">
      </p>
      <p>Wann haben Sie gestern zuletzt Alkohol konsumiert?
        <input class="large-input" name="alcohol_time_yesterday" type="time">
      </p>
    </div>

    <p>Haben Sie heute geraucht (Nikotin (Zigaretten) oder THC)?
      <select class="large-select" name="smoking_today" onchange="checkOther(this.value, 'ja', 'smoking_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="smoking_block" style="display:none; margin-left: 2rem;">
      <p>Was haben Sie heute geraucht (z.B. Zigaretten, Zigarre, THC, etc.)?:
        <input class="large-input" name="smoked_what" type="text">
      </p>
      <p>Wie viel haben Sie heute geraucht (z.B. 5 Zigaretten)?:
        <input class="large-input" name="smoked_amount" type="text">
      </p>
      <p>Wann haben Sie heute zuletzt geraucht?:
        <input class="large-input" name="smoking_time" type="time">
      </p>
    </div>

    <p>Haben Sie heute andere Drogen konsumiert?:
      <select class="large-select" name="drugs_today" onchange="checkOther(this.value, 'ja', 'drugs_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="drugs_block" style="display:none; margin-left: 2rem;">
      <p>Um was für Drogen hat es sich gehandelt?
        <input class="large-input" name="drugs_what" type="text">
      </p>
      <p>Wie viel haben Sie von dieser Droge heute konsumiert?
        <input class="large-input" name="drugs_amount" type="text">
      </p>
      <p>Wann haben Sie diese Droge zuletzt konsumiert?
        <input class="large-input" name="drugs_time" type="time">
      </p>
    </div>

        <p>Nehmen Sie derzeit Medikamente zu sich (in den letzten paar Tagen)?: 
      <select class="large-select" name="medication_recent" onchange="checkOther(this.value, 'ja', 'medication_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="medication_block" style="display:none; margin-left: 2rem;">
      <p>Was und wie viel (z.B. mg) nehmen Sie an Medikamenten zu sich?:
        <input class="large-input" name="medication_what" type="text">
      </p>
      <p>Weswegen konsumieren Sie dieses Medikament?:
        <input class="large-input" name="medication_why" type="text">
      </p>
      <p>Haben Sie heute dieses Medikament schon eingenommen?:
        <select class="large-select" name="medication_today" onchange="checkOther(this.value, 'ja', 'contraception_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
      </p>
    </div>
  </fieldset>



  <hr>

  <fieldset>
    <legend><b>Sport und letzter Schlaf</b></legend>
    <p>Haben Sie sich heute körperlich bewegt (z.B. Spaziergang, Fußball spielen, etc.)?
      <select class="large-select" name="sport_today" onchange="checkOther(this.value, 'ja', 'sport_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="sport_block" style="display:none; margin-left: 2rem;">
      <p>Welche Aktivitäten haben Sie heute durchgeführt?
        <input class="large-input" name="sport_activities" type="text">
      </p>
      <p>Von wann bis wann haben Sie diese Aktivität durchgeführt?
        <input class="large-input" name="sport_time" type="text">
      </p>
      <p>Wie viel Zeit haben Sie heute insgesamt mit körperlicher Aktivität insgesamt verbracht?
        <input class="large-input" name="sport_total" type="text">
      </p>
    </div>

    <p>Wie gut haben Sie letzte Nacht geschlafen?
      <select class="large-select" name="sleep_quality">
        <option value=""></option>
        <option value="1">sehr schlecht</option>
        <option value="2">schlecht</option>
        <option value="3">recht schlecht</option>
        <option value="4">recht gut</option>
        <option value="5">gut</option>
        <option value="6">sehr gut</option>
      </select>
    </p>
    <p>Wann sind Sie heute morgen aufgestanden?
      <input class="large-input" name="wake_time" type="time">
    </p>

    <p>Gab es Schlafveränderungen in letzter Zeit (z.B. häufigeres Aufwachen/Aufstehen, verstärktes Schnarchen, mehr Träume, etc.)?:
      <select class="large-select" name="sleep_change" onchange="checkOther(this.value, 'ja', 'sleep_change_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="sleep_change_block" style="display:none; margin-left: 2rem;">
      <p>Welche Veränderung gab es in Ihrem Schlaf?:
        <input class="large-input" name="sleep_change_what" type="text">
      </p>
      <p>Was könnte der Grund für diese Veränderungen sein (z.B. mehr Stress, starke Emotionen, etc.)?
        <input class="large-input" name="sleep_change_reason" type="text">
      </p>
    </div>

    <p>Hatten Sie in den letzten Tagen ungewöhnlich viel Stress oder Aufregung (kann auch positive Aufregung/Stress sein)?:
      <select class="large-select" name="recent_stress" onchange="checkOther(this.value, 'ja', 'stress_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="stress_block" style="display:none; margin-left: 2rem;">
      <p>Welche der genannten oder zusätzlichen Punkte gelten für Sie?
        <input class="large-input" name="stress_reason" type="text">
      </p>
    </div>

    <p>Haben Sie besondere Schlafgewohnheiten (z.B. Musik hören vor dem Schlafen, Lesen, TV schauen)?:
      <select class="large-select" name="sleep_habits" onchange="checkOther(this.value, 'ja', 'sleep_habits_block', null, null)">
        <option value=""></option>
        <option value="ja">ja</option>
        <option value="nein">nein</option>
      </select>
    </p>
    <div id="sleep_habits_block" style="display:none; margin-left: 2rem;">
      <p>Welche Schlafgewohnheit haben Sie?:
        <input class="large-input" name="sleep_habit_details" type="text">
      </p>
    </div>
  </fieldset>

  <hr>


</div>
`;

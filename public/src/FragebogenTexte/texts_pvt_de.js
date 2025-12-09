// const cont_text = "weiter"; // Already defined in texts_demographics_de.js

// PVT timing constants
const lapse_time = 10000; // 10 seconds in milliseconds
const premature_time = 100; // 0.1 seconds in milliseconds

const pvt_start_p1 = `<div class="instructions"> 
    Die nächste Aufgabe testet Ihre Aufmerksamkeit.  
    Eine <b>Stoppuhr</b> in der Mitte des Bildschirms wird irgendwann beginnen, rasch hochzuzählen. 
    Wenn das passiert, ist es Ihre Aufgabe, so schnell wie möglich die <b>Leertaste zu drücken. 
    Bitte verwenden Sie Ihre dominante Hand</b> (die Hand, mit der Sie normalerweise schreiben). 
    Dann stoppt die Uhr, und Ihre Reaktionszeit wird für einen kurzen Moment angezeigt.
</div>`;

const pvt_start_p2 = `<div class="instructions"> 
    <b>Sie müssen die Uhr innerhalb von ${
      lapse_time / 1000
    } s stoppen</b>, aber "übermenschliche" 
    Reaktionszeiten unter ${
      premature_time / 1000
    } s zählen ebenfalls als Fehler.<br>
    Aber keine Sorge, wenn Sie die Leertaste drücken, sobald die Uhr beginnt hochzuzählen, 
    werden Sie auf jeden Fall rechtzeitig genug reagieren.<br>
    Sie können die Aufgabe nun kurz üben.
</div>`;

const pvt_feedback_text = (n_trials, n_lapses, n_prematures, responses_iti) =>
  `Sie haben ${n_trials - n_lapses - n_prematures} 
von ${n_trials} Stoppuhren rechtzeitig gestoppt! 
${
  responses_iti > 0
    ? "<br><b>Hinweis:</b> Drücke keine Tasten, solange die Stoppuhr noch nicht hoch zählt!<br>"
    : ""
}
<br><br>`;

const pvt_praise = "<br>Gut gemacht!<br><br>";

const failed_pvt_feedback = () =>
  `<div class="instructions">
    Sorry, aber Sie müssen mindestens <b>${practice_correct_threshold} von ${n_practice_trials}</b> Stoppuhren rechtzeitig stoppen!<br>
    Sie müssen jede Uhr innerhalb von ${
      lapse_time / 1000
    } Sekunden stoppen, aber implausible 
    Reaktionszeiten (< ${premature_time / 1000} s) zählen als Fehler! 
    Bitte versuche es noch einmal.
</div>`;

const pvt_main_instructions_text = () =>
  `<div class="instructions"> 
    Super, Sie sind bereit für die Aufgabe!<br>
    Drücken Sie die Leertaste mit Ihrer dominanten Hand. 
    Wenn Sie auf "Weiter" klicken, beginnt die Aufgabe. 
    Sie wird ${pvt_time_limit / 60000} min in Anspruch nehmen.
</div>`;

const pvt_end_text = `<div class="instructions"> 
    Super, das war's mit der Stoppuhraufgabe!<br>
</div>`;

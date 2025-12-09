const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p>Willkommen! Vielen Dank, dass Sie an unserer Studie teilnehmen.</p>

<p>In dieser Studie geht es um das selektive Erinnern von konkreten Begriffen.</p>

<p>Die Studie besteht aus mehreren Phasen. Bitte lesen Sie die folgenden Instruktionen gründlich durch.</p>

<p>Wenn Sie während der Studie Fragen haben, können Sie sich jederzeit an die Versuchsleitung wenden.</p>

<p>Lesen Sie weiter mit dem Button.</p>

        </div>`,
    `<div class="instructions">
    <p>Die Studie beginnt mit einer Lernphase.</p>

<p>Dabei sehen Sie eine Reihe von einzelnen Wörtern, die nacheinander auf dem Bildschirm erscheinen.</p>

<p>Ihre Aufgabe wird es sein, sich einen Teil der Wörter für einen späteren Gedächtnistest zu merken.</p>

<p>Lesen Sie weiter mit dem Button.</p>

        </div>`,
    `<div class="instructions">
        <p>Von den Wörtern, die Ihnen gleich in der Lernphase gezeigt werden, sollen nur bestimmte Wörter gelernt werden.</p>

<p>Folgt auf ein Wort die Buchstabenkombination <b>EEE</b>, sollen Sie sich das vorangegangene Wort bitte für den Gedächtnistest merken. Die Buchstabenkombination <b>EEE</b> steht hierbei für "Erinnern".</p>

<p>Erscheint nach einem Wort die Buchstabenkombination <b>VVV</b>, sollen Sie sich das vorangegangene Wort bitte NICHT merken. Sie sollen das Wort dann also vergessen. Die Buchstabenkombination <b>VVV</b> steht hierbei für "Vergessen".</p>

        </div>`,
    `<div class="instructions">
    <p>Als nächstes werden Sie ein Beispiel sehen.</p>

<p>Ein Wort wird auf dem Bildschirm erscheinen. Auf das Wort folgt eine Buchstabenkombination.</p>

<p>Danach sehen Sie dann noch drei weitere Wörter, auf welche dann auch wieder eine Buchstabenkombination folgt.</p>

<p> Zusammen mit der Buchstabenkombination wird außerdem ein Ton abgespielt. Jeder Ton wird entweder NUR mit der Buchstabenkombination <b>EEE</b> oder NUR mit der Buchstabenkombination <b>VVV</b> abgespielt.</p> 

<p>Drücken Sie den Button, um das Beispiel zu sehen.</p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const instructions_2 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p>In diesem Beispiel hätten Sie sich nur die Wörter "Sonne" und "Rose" für den späteren Gedächtnistest merken sollen.</p>
<p>Das andere Wort hätten Sie vergessen sollen.</p>
        </div>`,
    `<div class="instructions">
    <p>Zusammenfassung:</p>

<p>Sie sehen gleich eine Reihe von Wörtern hintereinander. Von diesen Wörtern sollen Sie sich nur die Wörter einprägen, auf die die Buchstabenkombination <b>EEE</b> folgt.</p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const instructions_3 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
       <p>Bevor die richtige Lernphase beginnt, folgt nun eine Übung, in der Sie sich mit Ihrer Aufgabe vertraut machen können.</p>

<p>Drücken Sie den Button, um die Übung für die Lernphase zu starten.</p>
 </p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Übungsdurchgang beginnen",
  allow_backward: false,
};

const instructions_4 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> Nun folgt der Gedächtnistest. Zunächst einmal bitten wir Sie, alle Wörter, die Sie auch erinnern sollten, frei aus dem Gedächtnis abzurufen. </p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Gedächtnistest beginnen",
  allow_backward: false,
};

const instructions_5 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> In der vorherigen Lernphase hatten wir Ihnen 6 Wörter präsentiert, die Sie erinnern sollten. <br>
         Wir zeigen Ihnen von diesen Wörtern jetzt jeweils die ersten beiden Buchstaben und möchten Sie bitten, das Wort 
         dann entsprechend zu vervollständigen. <br> Auch wenn sie das Wort eben schon korrekt erinnert haben, sollen Sie es
          trotzdem noch einmal in diesem Test vervollständigen., </p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Vervollständigungsaufgabe beginnen",
  allow_backward: false,
};

const instructions_unrelatedSound = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p>Bevor Sie mit der eigentlichen Aufgabe beginnen, werden wir Ihnen noch einen Ton präsentieren. Hierbei müssen Sie nichts tun und keine Aufgabe erledigen. Bitte hören Sie trotzdem aufmerksam zu und schauen Sie auf das Kreuz in der Mitte des Bildschirms.</p>
      </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Beginnen",
  allow_backward: false,
};

const instructions_6 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> Das war der Übungsdurchgang. </p>
        <p> Bevor wir mit der eigentlichen Lernphase beginnen, werden wir Sie noch mit den Tönen vertraut machen, die Sie während der Lernphase hören werden. </p>
        <p> Insgesamt gibt es in der Lernphase vier verschieden Töne. Zwei davon werden nur mit der Buchstabenkombination <b>EEE</b> und zwei nur mit der Buchstabenkombination <b>VVV</b> abgespielt. </p>
        <p> Wenn Sie auf "Weiter" klicken, wird der erste Ton abgespielt. In der Anweisung steht außerdem, ob der Ton mit <b>EEE</b> oder <b>VVV</b> abgespielt wird. </p>
        <p> Insgesamt können Sie sich jeden Ton bis zu dreimal anhören. </p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const instructions_7 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> Haben Sie noch Fragen zur Lernphase oder zu Ihrer Aufgabe? </p>
        <p> Falls Sie noch Fragen haben, wenden Sie sich bitte jetzt an die Versuchsleitung. </p>
        <p> Wenn Sie keine Fragen mehr haben, drücken Sie den Button unten, um die Wörter für den späteren Gedächtnistest zu lernen. </p>
        <p> Bitte stellen Sie sich darauf ein, dass Sie jetzt in dieser Lernphase mehr Wörter präsentiert bekommen werden als in den Übungsdurchgängen </p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Lernphase beginnen",
  allow_backward: false,
};

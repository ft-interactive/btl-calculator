import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import { select, selectAll } from 'd3-selection';
import { calc } from './calculations';
import { userInputHolders, languageSettings, texts} from './settings';
import { Widget, slider, textInput, table, radioButtons } from './widgets';
import { detectIE } from './ie';
import { router } from './router';
const numeral = require('numeral');
numeral.language('en-gb', languageSettings);
numeral.language('en-gb');


document.addEventListener('DOMContentLoaded', () => {
    
    calc.stampDutyCalculations();
    calc.taxCalculations();
    calc.loanCalculations(userInputHolders.floor);
    radioButtons.create();
    router("radioInput", "newFloor")

    // make hover effects work on touch devices
    oHoverable.init();

    // remove the 300ms tap delay on mobile browsers
    attachFastClick(document.body);

    // Get IE or Edge browser version
    let version = detectIE();
   // version = "k"

    if (version === false) {
      slider.create();
      slider.initialize();  
      textInput.create("noIE");

      Widget.eventListeners();
      window.addEventListener('resize', resize);
      function resize() {

        console.log(window.innerWidth)
         selectAll ('#slider').each(function (d, i) {
         let lab = this.parentElement.children[4].id;
         let pos = Number(this.value);
         let newX = slider.calcLabelPos(pos, 'slider', 'else', i);
         slider.moveLabel(lab, pos, newX);
         mobileStuff();
        });
    }

    } else {
      textInput.create("IE");
      mobileStuff();
    }

    mobileStuff();
    let findOutMore = 0;
    function mobileStuff () {
        if(window.innerWidth<540 && findOutMore === 0) {

                    select("#table").select('tr:nth-child(4)').remove();
                    select("#table").select('th:nth-child(1)').style("opacity", "0");
                    selectAll(".o-big-number--standard").style("text-align", "center");
                    selectAll(".question_textinput , .question_add").style("text-align", "center");
                    selectAll(".table").style("margin-left", "20px").style("margin-top", "20px");
                    findOutMore = 1;       

        }

        if (window.innerWidth >540 && findOutMore === 1) {
                        findOutMore = 0;
                        select("#table").select('tr').select('#table a').remove();
        }
    }

    

       

});

export { userInputHolders };



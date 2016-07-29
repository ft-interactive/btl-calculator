/*jshint esversion: 6 */
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
    router("radioInput", "newFloor");
    calc.whichTaxBand();
    // make hover effects work on touch devices
    oHoverable.init();

    // remove the 300ms tap delay on mobile browsers
    attachFastClick(document.body);
    function resize() {
         mobileStuff();
         selectAll ('#slider').each(function (d, i) {
         let lab = this.parentElement.children[4].id;
         let pos = Number(this.value);
         let newX = slider.calcLabelPos(pos, 'slider', 'else', i);
         slider.moveLabel(lab, pos, newX);
        });
    }

    // Get IE or Edge browser version
    let version = detectIE(); // false or true
      let findOutMore = 0;
    if (version === false) {
      slider.create();
      slider.initialize();  
      textInput.create("noIE");
      mobileStuff();
      Widget.eventListeners();
      window.addEventListener('resize', resize);
      

    } else {
      textInput.create("IE");
      mobileStuff();
    }
   
    

    function mobileStuff () {
        if(window.innerWidth<540 && findOutMore === 0) {
                    
                    select("#table").select('tr:nth-child(4)').style('visibility', 'hidden');
                    select("#table").select('th:nth-child(1)').style("opacity", "0");
                    selectAll(".o-big-number--standard").style("text-align", "center");
                    selectAll(".question_textinput , .question_add").style("text-align", "center");
                    selectAll(".table").style("margin-left", "20px").style("margin-top", "20px");
                    findOutMore = 1;      
                   // select("#table").select('tr').select('#table a').remove();
                    select("#mobileFO").style('visibility', 'visible');
                    select("#table").select('tr:nth-child(3)').append('td').attr('id', 'mobile').html('<a href="https://next.ft.com/content/07c586a2-7323-11e5-a129-3fcc4f641d98"> Find out more.</a>'); 
                    select("tr:nth-child(3) td:nth-child(1)").style("text-align","right");
        }

        if(window.innerWidth>540 && findOutMore === 1) {
                    console.log("trigged bigger");
                    select("#table").select('tr:nth-child(4)').style('visibility', 'visible');
                    select("#table").select('th:nth-child(1)').style("opacity", "0");
                    selectAll(".o-big-number--standard").style("text-align", "center");
                    selectAll(".question_textinput , .question_add").style("text-align", "center");
                    selectAll(".table").style("margin-left", "20px").style("margin-top", "20px");    
                    select("#mobile").remove();
                    select("tr:nth-child(3) td:nth-child(1)").style("text-align","left");
                    findOutMore = 0;
        }
    }

     

       

});

export { userInputHolders };



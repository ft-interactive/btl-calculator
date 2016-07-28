import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import { select, selectAll } from 'd3-selection';
import d3 from 'd3';
import { calculateTaxes } from './tax_calculations';
import { calc } from './other_calculations';
import { userInputHolders, languageSettings, texts} from './settings';
import { Widget, slider, textInput, table, radioButtons } from './widgets';
import { detectIE } from './ie';
const numeral = require('numeral');




numeral.language('en-gb', languageSettings);
numeral.language('en-gb');


  

 let router =  function (source, input) {

            switch (source) {
                case "rentalIncome":
                    userInputHolders.rentalIncome = input * 12
                    userInputHolders.oldWTdeductions = Math.round(userInputHolders.rentalIncome * 0.1); 
                    calc.loanCalculations(userInputHolders.floor); 
                    calc.taxCalculations();
                    let selection = selectAll('#slider')
                    selection.each(function (d, i) {
                    if (this.parentElement.children[4].id === "WT") {
                          let newmax = (userInputHolders.rentalIncome - (userInputHolders.principal * userInputHolders.interestRate)) * 0.1
                          select(this).attr("max", (newmax))
                          select(this.parentElement.children[3]).text(numeral(newmax).format('($0)'));
                        };
                    })
                    break;
                case "employment":
                    userInputHolders.employment = input;
                    //selectAll('#tableTax').text(output);
                    calc.taxCalculations();
                    break;
                case "interestRate":
                    userInputHolders.interestRate = input / 100;
                    //selectAll('#tableTax').text(output);
                    calc.taxCalculations();
                    selection = selectAll('#slider')
                    selection.each(function (d, i) {
                    if (this.parentElement.children[4].id === "WT") {
                          let newmax = (userInputHolders.rentalIncome - (userInputHolders.principal * userInputHolders.interestRate)) * 0.1
                          select(this).attr("max", (newmax))
                          select(this.parentElement.children[3]).text(numeral(newmax).format('($0)'));
                          let lab = this.parentElement.children[4].id,
                          pos = Number(this.value),
                          newX = slider.calcLabelPos(pos, 'slider', 'else', i);
                          slider.moveLabel(lab, pos, newX);
                          router(lab, pos);
                        };
                    })
                    
                    break;
                case "propertyValue":
                    userInputHolders.propertyValue = input;
                    calc.loanCalculations(userInputHolders.floor); 
                    calc.stampDutyCalculations();
                    calc.taxCalculations();
                    break;
                case "calcLoan":
                    let leverage = input["LTVDifference"] || 0;
                    leverage = numeral(leverage).format('0%');

                    let LTV = input["LTV"] || 0;
                    LTV = numeral(LTV).format('0%');
                    
                    let deposit = input["depositDifference"] || 0;
                    deposit = numeral(deposit).format('($0a)');
                    
                    let depositNeeded = input["deposit"] || 0;
                    depositNeeded = numeral(depositNeeded).format('$0,0');
                    
                    let principal= input["principal"] || 0;
                    userInputHolders.principal = principal
                    select("#percentageNumber").text(leverage);
                    select("#LTVNumber").text(LTV);
                    select("#depositNumber").text(deposit);
                    select("#depositNeeded").text(depositNeeded);
                    select("#principalNumber").text(numeral(principal).format('($0a)'));
                    break;
                case "stampDuty":
                    let difference = input["difference"] || 0;
                    difference = numeral(difference).format('($0.[0]a)');
                    let newStampDuty = input["new"] || 0;
                    newStampDuty = numeral(newStampDuty).format('($0.[0]a)');
                    select("#stampDutyNumber").text(newStampDuty);
                    break;
                 case "interestPayments":
                    let IP = numeral(input).format('($0,[0][0])');
                    let propertyWorth = numeral(userInputHolders.propertyValue).format('($0,0)');
                    let principal2 = numeral(userInputHolders.principal).format('($0a)');
                    select("#principal2").text(principal2);
                    select("#interestPayments").text(IP);
                    select("#housePriceResult2").text(propertyWorth);
                    break;
                case "taxCalculations":
                    for (var i = 0; i < input[1].length; i++) {
                        let income = numeral(input[2]).format('$0,0');
                        let totalTax = numeral(input[0][i]).format('$0,0');
                        let niat = numeral(input[1][i]).format('$0,0');
                        select("#income" + [i]).text(income);
                        select("#totalTax" + [i]).text(totalTax);
                        select("#niat" + [i]).text(niat);
                    };
                    break;
                case "WT":       
                    userInputHolders.WTdeductions = input;
                    if (input === 0){
                        userInputHolders.WTdeductions = 1}
                    userInputHolders.oldWTdeductions = userInputHolders.rentalIncome * 0.1; 
                    calc.taxCalculations("WT");  
                    break;
                case "WTOut":
                    if (input<0) {input = 0};
                    let wtdifference = numeral(input).format('($ 0)');
                    select("#WTDifference").text(wtdifference);
                    break;
                case "radioInput":
                    userInputHolders.floor = input
                    if (input === "newFloor") { 
                        select("#icr").text("145") 
                        select("#LTVcaption").text(texts.newLTVCaption)
                        select("#principalCaption").text(texts.newPrincipalCaption)
                    } 
                    else { 
                        select("#icr").text("125") 
                        select("#LTVcaption").text(texts.oldLTVCaption)
                        select("#principalCaption").text(texts.oldPrincipalCaption)
                    }
                    console.log(userInputHolders.floor)
                    calc.loanCalculations(userInputHolders.floor);
                    calc.taxCalculations();

                };

                select("#principalTitle").text(texts.principalTitle);
                select("#ICRTitle").text(texts.ICRTitle);
                select("#LTVTitle").text(texts.LTVTitle);
                select("#stampDutyTitle").text(texts.stampDutyTitle);
                select("#rentalIncomeResult").text(numeral(userInputHolders.rentalIncome/12).format('$0,0[.]00'));
                select("#housePriceResult").text(numeral(userInputHolders.propertyValue).format('$0,0[.]00'));
                select("#mortgageRateResult").text(numeral(userInputHolders.interestRate).format('0%'));
                select("#salaryResult").text(numeral(userInputHolders.employment).format('$0,0[.]00'));
                if (userInputHolders.employment >= 150000) { 
                     select("#salaryResult").text(numeral(userInputHolders.employment).format('$0,0[.]00') + " or more");
                }

    }


document.addEventListener('DOMContentLoaded', () => {
    
    calc.stampDutyCalculations();
    calc.taxCalculations();
    calc.loanCalculations(userInputHolders.floor);
    // make hover effects work on touch devices
    oHoverable.init();

    // remove the 300ms tap delay on mobile browsers
    attachFastClick(document.body);

   

    radioButtons.create();

    
    
    router("radioInput", "newFloor")

    let findOutMore = 0;

    // Get IE or Edge browser version
    let version = detectIE();
   // version = "hepo"

    if (version === false) {
      slider.create();
      slider.initialize();  
      textInput.create("noIE");
    
      console.log("et käytä paskaa selainta");
      

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
    function mobileStuff () {
        if(window.innerWidth<540 && findOutMore === 0) {

                    select("#table").select('tr:nth-child(4)');
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

export { userInputHolders, router };



import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import { select, selectAll } from 'd3-selection';
import d3 from 'd3';
import { calculateTaxes } from './tax_calculations';
import { calc } from './other_calculations';
import { userInputHolders, languageSettings } from './settings';
import { Widget, slider, textInput, table } from './widgets';
const numeral = require('numeral');




numeral.language('en-gb', languageSettings);
numeral.language('en-gb');


   

 let router =  function (source, input) {

            switch (source) {
                case "rentalIncome":
                    userInputHolders.rentalIncome = input * 12
                    calc.loanCalculations(); 
                    calc.taxCalculations();
                    selectAll('#tableRentalIncome').text(output);
                    break;
                case "employment":
                    userInputHolders.employment = input;
                    selectAll('#tableTax').text(output);
                    calc.taxCalculations();
                    break;
                case "interestRate":
                    userInputHolders.interestRate = input / 100;
                    selectAll('#tableTax').text(output);
                    calc.taxCalculations();
                    break;
                case "propertyValue":
                    userInputHolders.propertyValue = input;
                    calc.loanCalculations(); 
                    calc.stampDutyCalculations();
                    calc.taxCalculations();
                    break;
                case "calcLoan":
                    let leverage = input["LTVDifference"] || 0;
                    leverage = numeral(leverage).format('0%');
                    let deposit = input["depositDifference"] || 0;
                    deposit = numeral(deposit).format('($0a)');
                    select("#percentageNumber").text(leverage);
                    select("#depositNumber").text(deposit);
                    break;
                case "stampDuty":
                    let difference = input["difference"] || 0;
                    difference = numeral(difference).format('($0.[0]a)');
                    let newStampDuty = input["new"] || 0;
                    newStampDuty = numeral(newStampDuty).format('($0.[0] a)');
                    select("#stampDutyNumber").text(difference);
                    break;
                case "taxCalculations":
                    for (var i = 0; i < input[1].length; i++) {
                        select("#income" + [i]).text(input[2]);
                        select("#totalTax" + [i]).text((input[0][i]));
                        select("#niat" + [i]).text(-(input[1][i]));
                    };
                   
                };
                select("#rentalIncomeResult").text(numeral(userInputHolders.rentalIncome/12).format('$0,0[.]00'));
                select("#housePriceResult").text(numeral(userInputHolders.propertyValue).format('$0,0[.]00'));
                select("#mortgageRateResult").text(numeral(userInputHolders.interestRate).format('0%'));
                select("#salaryResult").text(numeral(userInputHolders.employment).format('$0,0[.]00'));
                

    }


document.addEventListener('DOMContentLoaded', () => {
    calc.stampDutyCalculations();
    calc.taxCalculations();
    calc.loanCalculations();
    // make hover effects work on touch devices
    oHoverable.init();

    // remove the 300ms tap delay on mobile browsers
    attachFastClick(document.body);

    window.addEventListener('resize', resize);

    slider.create();
    textInput.create();
    //table.create();

   let resize =  function resize() {
        let newX = slider.calcLabelPos(initPos, 'slider');
        slider.moveLabel('savelab', initPos, newX);
    }

});

export { userInputHolders, router };



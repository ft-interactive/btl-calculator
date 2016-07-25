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
                    console.log(userInputHolders.rentalIncome)
                    calc.loanCalculations("new"); 
                    selectAll('#tableRentalIncome').text(output);
                    break;
                case "employment":
                    userInputHolders.employment = input;
                    selectAll('#tableTax').text(output);
                    calc.loanCalculations("new"); 
                    break;
                case "interestRate":
                    userInputHolders.interestRate = input / 100;
                    selectAll('#tableTax').text(output);
                    break;
                case "propertyValue":
                    userInputHolders.propertyValue = input;
                    calc.loanCalculations("new"); 
                    selectAll('#tableTax').text(output);
                    break;
                case "calcLoan":
                    let output = 0;
                    input = input || 0;
                    output = numeral(input).format('0%');
                    select("#percentageNumber").text(output);
                };
                select("#rentalIncomeResult").text(numeral(userInputHolders.rentalIncome/12).format('$0,0[.]00'));
                select("#housePriceResult").text(numeral(userInputHolders.propertyValue).format('$0,0[.]00'));
                select("#mortgageRateResult").text(numeral(userInputHolders.interestRate).format('0%'));
                select("#salaryResult").text(numeral(userInputHolders.employment).format('$0,0[.]00'));
                

    }


document.addEventListener('DOMContentLoaded', () => {

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



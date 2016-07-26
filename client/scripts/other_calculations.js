const numeral = require('numeral');
import { router } from './main';
import { calculateTaxes } from './tax_calculations';
import { taxbands, details, personalAllowance, userInputHolders, stampDutySettings, interestReliefArray } from './settings'

let depositNumber = 35; 
let percentageNumber = 4;


// IS THIS NEEDED ANYMORE?
// This function is "array.map" but works with object
// vanilla alternative for lodash#mapValues

Object.defineProperty(Object.prototype, 'map', {
    value: function(f, ctx) {
        ctx = ctx || this;
        var self = this, result = {};
        Object.keys(self).forEach(function(k) {
            result[k] = f.call(ctx, self[k], k, self); 
        });
        return result;
    }
});

let calc = {
		loanCalculations: function () {
			let doCalcs = function (floor) {
				let depositNotChecked = -((userInputHolders.rentalIncome - floor * (userInputHolders.stressTestIR * userInputHolders.propertyValue)) / (userInputHolders.stressTestIR * floor));
				let depositChecked = 0;
			
				if (depositNotChecked/userInputHolders.propertyValue <= 0.25) {
					depositChecked = userInputHolders.propertyValue * 0.25;
				} else { 
					depositChecked = depositNotChecked;
				};

				let principal = userInputHolders.propertyValue - depositChecked;
				let maxLTV = principal / userInputHolders.propertyValue;
				
				let array = [depositChecked, principal, maxLTV]
				return array
			}
			let newRulesArray = doCalcs(userInputHolders.floorNew);
			let oldRulesArray = doCalcs(userInputHolders.floorOld);

			let passObject = {
				"depositDifference": newRulesArray[0] - oldRulesArray[0],
				"LTVDifference": oldRulesArray[2] - newRulesArray[2],
				"LTV": newRulesArray[2],
				"Principal": newRulesArray[1],
				"Deposit": newRulesArray[1]
			}
			router("calcLoan", passObject);	
				
		},

		stampDutyCalculations: function () {

			let doCalcs = function (Array1, Array2) {

				// TODO: Tidy this

				function callback (element, index, array) {
					let value = userInputHolders.propertyValue > element
					value = value ? 1 : 0  
					let value2 = userInputHolders.propertyValue - element
					let value3 = value * value2
					return value3 
				}

				let trueOrFalse = Array1.map(callback); 
				
				function callbackSecond (element, index, array) {
					return trueOrFalse[index] * element 
				}

				let totalArray = Array2.map(callbackSecond)
				let sum = totalArray.reduce(function(a, b) { return a + b; }, 0);
				
				
				return sum	

			}

			let newRulesSum = doCalcs(stampDutySettings.newLimits, stampDutySettings.newTaxBrackets);
			let oldRulesSum = doCalcs(stampDutySettings.oldLimits, stampDutySettings.oldTaxBrackets);

			let passObject = {
				"difference": newRulesSum - oldRulesSum,
				"new": newRulesSum
			}

			router("stampDuty", passObject);	


		},

		taxCalculations: function() {

		let employmentTaxes = calculateTaxes(userInputHolders.employment)
		let old_WTdeductions = WTdeductions === 0 ? 0 : userInputHolders.rentalIncome * 0.1
		let WTdeductions = userInputHolders.WTdeductions;
		let otherTaxDeductions = userInputHolders.otherTaxDeductions;
		let WTDifference = WTdeductions - old_WTdeductions; 


		let interestPayments = userInputHolders.propertyValue * userInputHolders.interestRate,
			profits = userInputHolders.rentalIncome - interestPayments;



			let i = -1;
			let interestTaxable = [],
				interestReliefPounds = [],
				taxableAmountNewWT = [],
				taxableAmountOldWT = [],
				WTTax = [],
				WTTaxDeductionInterestRelief = [],
				WTTotalTax = [],
				WTProfitAfterTax = [];	

			

			interestReliefArray.map(function(value, key, object)
			{
				i+=1
				interestTaxable.push(interestPayments - value[1] * interestPayments);
				interestReliefPounds.push(interestPayments * value[1]); 
				taxableAmountNewWT.push(userInputHolders.rentalIncome - interestReliefPounds[i] - WTdeductions);
				taxableAmountOldWT.push(taxableAmountNewWT[i] + WTDifference);
			});
			
			
			let WTCalcs = function (input) {
				let WTTax = [],
					WTTaxDeductionInterestRelief = [],
					WTTotalTax = [],
					WTProfitAfterTax = [];	

			    i=-1;

				input.map(function(value, key, object) 
					{
						i += 1
						WTTax.push(calculateTaxes(userInputHolders.employment + value) - employmentTaxes)		
						let interestTaxableV = interestTaxable[Object.keys(interestTaxable)[i]] 		
						let dummy = 0;
								if ((interestTaxableV * 0.2) > WTTax[i]) {
									dummy = WTTax[i];
								} else {								
									dummy = interestTaxableV * 0.2;	
								};
						WTTaxDeductionInterestRelief.push(dummy)
						WTTotalTax.push(WTTax[i] - WTTaxDeductionInterestRelief[i])
						WTProfitAfterTax.push(userInputHolders.rentalIncome - interestPayments  - WTdeductions - otherTaxDeductions - WTTotalTax[i])	
						});

				let WTTotalTaxChecked = WTTotalTax.map(function(value) {
					value = value < 0 ? 0 : value;
					value = -(value)
					return value
				});
				
				return [WTTotalTaxChecked, WTProfitAfterTax, profits];	
			}

			//let passObject = [["Old Wear & Tear Rules", WTCalcs(taxableAmountOldWT)], ["New Wear & Tear Rules", WTCalcs(taxableAmountNewWT)]]
			let passObject = WTCalcs(taxableAmountNewWT)
			router("taxCalculations", passObject)

	}
};

    
	

	


export { calc }
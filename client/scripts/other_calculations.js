const numeral = require('numeral');
import { router } from './main';
import { calculateTaxes } from './tax_calculations';
import { taxbands, details, personalAllowance, userInputHolders } from './settings'

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
		loanCalculations: function (input) {
		
					
					let floor = 0;
					input === "new" ? floor = userInputHolders.floorNew : floor = userInputHolders.floorOld; 
					(function () {
					let depositNotChecked = -((userInputHolders.rentalIncome - floor * (userInputHolders.stressTestIR * userInputHolders.propertyValue)) / (userInputHolders.stressTestIR * floor));
					let depositChecked = 0;
					// Because the lenders (usually) expect the deposit to be AT LEAST 25 % property value,
					// let's check it
					if (depositNotChecked/userInputHolders.propertyValue <= 0.25) {
						depositChecked = userInputHolders.propertyValue * 0.25;
					} else { 
						depositChecked = depositNotChecked;
					};

					let principal = userInputHolders.propertyValue - depositChecked;
					let maxLTV = principal / userInputHolders.propertyValue;
					
					let array = [depositChecked, principal, maxLTV]
					console.log("tänne päästiin" + maxLTV)
					router("calcLoan", maxLTV, "moi");
				})();
		},
		tax: function(object2) {


				// pass these to stampDuty()
				let oldArray1 = [125000,250000,925000,1500000]
				let oldArray2 = [0.02, 0.03, 0.05, 0.02]
			
				// or these 
				let newArray1 = [0,125000,250000,925000,1500000]
				let newArray2 = [0.03,0.02,0.03,0.05,0.02]
			

			function stampDuty (Array1, Array2) {

				// TODO: Tidy this

				function callback (element, index, array) {
					let value = objekti.propertyValue > element
					value = value ? 1 : 0 
					return value
				}
				let trueOrFalse = Array1.map(callback); // Returns array containing 0 or 1 x4

				function callback2 (element, index, array) {
					return objekti.propertyValue - element
				}

				let taxableAmounts = Array1.map(callback2); 

				

				function callback3 (element, index, array) {
					return taxableAmounts[index] * trueOrFalse[index] * element 
				}

				let totalArray = Array2.map(callback3)
				let sum = totalArray.reduce(function(a, b) { return a + b; }, 0);
				
				console.log(sum)
				return sum
			}

		let employmentTaxes = calculateTaxes(objekti.employmentIncome)
		let old_WTdeductions = objekti.rentalIncome * 0.1
		let WTdeductions = 500;
		let otherTaxDeductions = 500;
		let WTDifference = WTdeductions - old_WTdeductions; 


		let profits = objekti.rentalIncome * 12,
			profitBeforeTax = profits - WTdeductions,
			interestRelief = {
				"2016": 1,
				"2017": 0.75,
				"2018": 0.5, 
				"2019": 0.25,
				"2020": 0,
			}

		let interestReliefArray = [["2016", 1], ["2017", 0.75], ["2018",0.5], ["2019", 0.25], ["2020", 0]];
			
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
				interestTaxable.push(objekti.interestPayments - value[1] * objekti.interestPayments);
				interestReliefPounds.push(objekti.interestPayments * value[1]); 
				taxableAmountNewWT.push(objekti.rentalIncome - interestReliefPounds[i] - WTdeductions);
				taxableAmountOldWT.push(taxableAmountNewWT[i] + WTDifference);
			});
			console.log(taxableAmountNewWT, taxableAmountOldWT)

			let WTCalcs = function (input) {
				let WTTax = [],
					WTTaxDeductionInterestRelief = [],
					WTTotalTax = [],
					WTProfitAfterTax = [];	

			    i=-1;

				input.map(function(value, key, object) 
					{
						i += 1
						WTTax.push(calculateTaxes(objekti.employmentIncome + value) - employmentTaxes)		
						let interestTaxableV = interestTaxable[Object.keys(interestTaxable)[i]] 		
						let dummy = 0;
								if ((interestTaxableV * 0.2) > WTTax[i]) {
									dummy = WTTax[i];
								} else {								
									dummy = interestTaxableV * 0.2;	
								};
						WTTaxDeductionInterestRelief.push(dummy)
						WTTotalTax.push(WTTax[i] - WTTaxDeductionInterestRelief[i])
						WTProfitAfterTax.push(objekti.rentalIncome - objekti.interestPayments  - WTdeductions - otherTaxDeductions - WTTotalTax[i])	
						});

				return [WTTotalTax, WTProfitAfterTax];	

			}

			let response = [["Old Wear & Tear Rules", WTCalcs(taxableAmountOldWT)], ["New Wear & Tear Rules", WTCalcs(taxableAmountNewWT)]]
			console.log(objekti)
			return response;

	}
};

    
	

	


export { calc }
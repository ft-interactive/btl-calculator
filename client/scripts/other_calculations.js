const numeral = require('numeral');
import { calculateTaxes } from './tax_calculations';


let depositNumber = 35; 
let percentageNumber = 4;

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
	profitBeforeTax: function (input) {
			let profits = input*12;
			return profits
		},

	depositNumber: function (input) {
		return depositNumber += 10
	},

	leveragePercentage: function (input) {
		return percentageNumber += 0.5
	},

	tax: function(object2) {
		
		let objekti =  {
			rentalincome: 25800,
			interestPayments: 12940.43887,
			employmentIncome: 100000,
		}
		let employmentTaxes = calculateTaxes(objekti.employmentIncome)
		console.log(employmentTaxes)
		let old_WTdeductions = objekti.rentalincome * 0.1
		let WTdeductions = 500;
		let otherTaxDeductions = 500;
		let WTDifference = WTdeductions - old_WTdeductions; 


		let profits = objekti.rentalincome * 12,
			profitBeforeTax = profits - WTdeductions,
			interestRelief = {
				"2016": 1,
				"2017": 0.75,
				"2018": 0.5, 
				"2019": 0.25,
				"2020": 0,
			}

			// The changes step into effect gradually. Due to this, we have to 

			// 1. First we count how much of the interest payments are taxable for each year 2016,2017...2020. This is handy in further calculations. 
		  	
			let interestTaxable	= interestRelief.map(function(value, key, object) 
			{
				return objekti.interestPayments - value * objekti.interestPayments
			});				

			
			// 2. Then count how much of the interest payments are taxable for each year 2016,2017...2020. This is needed in step 
			let interestReliefPounds = interestRelief.map(function(value, key, object)
			{
				return objekti.interestPayments * value 
			});

			let i=-1;


			// 3. We also have to take into account
			let taxableAmountNewWT = interestRelief.map(function(value, key, object)
			{
				i += 1
				return objekti.rentalincome - interestReliefPounds[Object.keys(interestReliefPounds)[i]] - WTdeductions;
			    
			});


			i=-1;
			let taxableAmountOldWT = taxableAmountNewWT.map(function(value, key, object)
			{
				i += 1
				return value + WTDifference;	    
			});



			// Next, let's calculate TAXES, DEDUCTIONS and PROFIT AFTER TAXES under NEW Wear & and Tear (WT) rules

			i=-1;

			let newWTTax = taxableAmountNewWT.map(function(value, key, object)
			{
				i += 1
				return calculateTaxes(objekti.employmentIncome + value) - employmentTaxes;	    
			});

			i= -1

			let newWTTaxDeductionInterestRelief = interestTaxable.map(function(value, key,object)
			{
					i += 1
					
					if ((value * 0.2) > newWTTax[Object.keys(newWTTax)[i]]) {
						
						return newWTTax[Object.keys(newWTTax)[i]]
					} else {
					
						return value * 0.2;	
					};
			});

			i = -1
			let newWTTotalTax = newWTTax.map(function(value, key,object)
			{
				i+=1
				return value - newWTTaxDeductionInterestRelief[Object.keys(newWTTaxDeductionInterestRelief)[i]]
			});

			i = -1
			let newWTProfitAfterTax = newWTTotalTax.map(function(value, key,object)
			{
				i+=1
			return	objekti.rentalincome - objekti.interestPayments  - WTdeductions - otherTaxDeductions - value;

			});

			// Unfortunately, next we have to do the same for old wear and tear rules...

			// TAXES, DEDUCTIONS and PROFIT AFTER TAXES under OLD Wear & and Tear rules


			i = -1
			let oldWTTax = taxableAmountOldWT.map(function(value, key, object)
			{
				i += 1
				return calculateTaxes(objekti.employmentIncome + value) - employmentTaxes;	    
			});

			i = -1

			let oldWTTaxDeductionInterestRelief = interestTaxable.map(function(value, key,object)
			{
					i += 1
					
					if ((value * 0.2) > newWTTax[Object.keys(oldWTTax)[i]]) {
						
						return oldWTTax[Object.keys(oldWTTax)[i]]
					} else {
					
						return value * 0.2;	
					};
			});


			i = -1
			let oldWTTotalTax = oldWTTax.map(function(value, key,object)
			{
				i+=1
				return value - oldWTTaxDeductionInterestRelief[Object.keys(oldWTTaxDeductionInterestRelief)[i]]
			});

			i = -1
			let oldWTProfitAfterTax = oldWTTotalTax.map(function(value, key,object)
			{
				i+=1
			return	objekti.rentalincome - objekti.interestPayments  - WTdeductions - otherTaxDeductions - value;

			});



	console.log(taxableAmountOldWT)
	console.log(oldWTTotalTax)
	}
};

    
	

	


export { calc }
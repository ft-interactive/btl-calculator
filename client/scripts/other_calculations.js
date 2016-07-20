const numeral = require('numeral');
let WTdeductions = 500;


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
	tax: function(object2) {
		
		let objekti =  {
			rentalincome: 2000,
			interestPayments: 12940.43887
		}

		let old_WTdeductions = objekti.rentalincome * 0.1

		let profits = objekti.rentalincome * 12,
			profitBeforeTax = profits - WTdeductions,
			interestRelief = {
				"2016": 1,
				"2017": 0.75,
				"2018": 0.5, 
				"2019": 0.25,
				"2020": 0,
			}
			let r = objekti.map(function(value, key, object) {
		     return key + " morjestaa";
		  	});
		  	
			let interestTaxable	= interestRelief.map(function(value, key, object) 
			{
				return objekti.interestPayments - value * objekti.interestPayments
			});				

			let interestReliefPounds = interestRelief.map(function(value, key, object)
			{
				return objekti.interestPayments * value + i
			});

			let i=0;

			let taxableAmountNewWT = interestRelief.map(function(value, key, object)
			{
				i += 1
				return objekti.rentalincome - interestReliefPounds[1] - WTdeductions 
			});


			
				

	console.log(taxableAmountNewWT)
	}
};

    
	

	


export { calc }
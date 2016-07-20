const numeral = require('numeral');
let deductions = 500;


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
			interestPayments: 1000
		}

		let profits = objekti.rentalincome * 12,
			profitBeforeTax = profits - deductions,
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
		  	
 	let yksi = objekti.interestPayments;
	let interestTaxable	= interestRelief.map(function(value, key, object) 
	{
		return value * objekti.interestPayments
	});	
	console.log(interestTaxable)
	}
};

    
	

	


export { calc }
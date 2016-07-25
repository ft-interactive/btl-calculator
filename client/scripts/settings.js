import {calcIncomeTax, calcPersonalAllowance } from './tax_calculations'



let taxbands = {
	//zero: [0,0], // Guess not needed?
	basic: [0.2, 32000],
	higher: [0.4, 150000],
	top: [0.45, 99999999999],
};

let details = {
  age: 30,
  blind: false,
  pensionContributions: 0,
};

let personalAllowance = {
  basicAllowance:	11000,
  age65_75Allowance: 11000,
  age75_overAllowance:	11000,
  blindAllowance:	2290,
  ageRelatedTreshold:	27700,
  taperThreshold:	100000,
};

let userInputHolders = {
    propertyValue: 0,
    employment: 0,
    rentalIncome: 0,
    interestRate: 0,
    stressTestIR: 0.055,
    floorNew: 1.45,
    floorOld: 1.25,
};

let stampDutySettings = {

      oldLimits: [125000,250000,925000,1500000],
      oldTaxBrackets: [0.02, 0.03, 0.05, 0.02],
      newLimits: [0,125000,250000,925000,1500000],
      newTaxBrackets: [0.03,0.02,0.03,0.05,0.02]
};

let languageSettings = {
   delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '£'
        }
};





export { taxbands, details, personalAllowance, userInputHolders, languageSettings, stampDutySettings }

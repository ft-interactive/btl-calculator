import {calcIncomeTax, calcPersonalAllowance } from './tax_calculations'

let userInputHolders = {
  // These are the initial values when page is loaded, feel free to change
    propertyValue: 700000,
    employment: 65000,
    rentalIncome: 2150*12,
    interestRate: 0.01,
    WTdeductions: 0,
    otherTaxDeductions: 0, // If you want that some tax deductions (other than Wear and tear and interest relief) are factored in the calculations - no user input for this!!!

    // Change these if you know what you are doing
    stressTestIR: 0.055,
    floorNew: 1.45,
    floorOld: 1.25,

    // Don't change!
    principal: 0,
    floor: "newFloor",
    oldWTDeductions: 2580
};

let texts = {
  principalTitle: "...get a loan worth...",
  LTVTitle: "... with a leverage of...",
  stampDutyTitle: "...and pay a stamp duty of",
  oldPrincipalCaption: "The amount that could be borrowed. It is assumed rent needs to cover 125 per cent of the interest payments at 5.5 per cent interest rate." , 
  newPrincipalCaption: "The amount that could be borrowed. It is assumed rent needs to cover 145 per cent of the interest payments at 5.5 per cent interest rate." ,
  oldLTVCaption: "The loan-to-value (LTV) leverage. It is assumed rent needs to cover 125 per cent of the interest payments at 5.5 per cent interest rate. " ,
  newLTVCaption: "The loan-to-value (LTV) leverage. It is assumed rent needs to cover 145 per cent of the interest payments at 5.5 per cent interest rate. "
}

let stampDutySettings = {
    oldLimits: [125000,250000,925000,1500000],
    oldTaxBrackets: [0.02, 0.03, 0.05, 0.02],
    newLimits: [0,125000,250000,925000,1500000],
    newTaxBrackets: [0.03,0.02,0.03,0.05,0.02]
};

let interestReliefArray = [1, 0.75, 0.5, 0.25, 0];


//[["2016", 1], ["2017", 0.75], ["2018",0.5], ["2019", 0.25], ["2020", 0]]

let taxbands = {
	//zero: [0,0], // not needed anymore?
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





export { taxbands, details, personalAllowance, userInputHolders, texts, languageSettings, stampDutySettings, interestReliefArray }

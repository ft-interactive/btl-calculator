import {calcIncomeTax, calcPersonalAllowance } from './tax_calculations'


/////// THE INITIAL VALUES

let userInputHolders = {
  // feel free to change
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

////// THE TEXTS IN THE PAGE


let texts = {
  IRCTitle: "Calculations based on xxxx:",
  principalTitle: "...get a loan worth...",
  LTVTitle: "... with a leverage of...",
  stampDutyTitle: "...and pay a stamp duty of",
  oldPrincipalCaption: "The amount that could be borrowed. It is assumed rent needs to cover 125 per cent of the interest payments at 5.5 per cent interest rate." , 
  newPrincipalCaption: "The amount that could be borrowed. It is assumed rent needs to cover 145 per cent of the interest payments at 5.5 per cent interest rate." ,
  oldLTVCaption: "The loan-to-value (LTV) leverage. It is assumed rent needs to cover 125 per cent of the interest payments at 5.5 per cent interest rate. " ,
  newLTVCaption: "The loan-to-value (LTV) leverage. It is assumed rent needs to cover 145 per cent of the interest payments at 5.5 per cent interest rate. "
}


////// THE WIDGETS

let sliderSettings = [{
        'divID': 'slider1',
        'className': 'slideholderTop',
        'HTML': 'Employment income',
        'labName': 'employment',
        'labelcss': 'slideLabelBig',
        'pos': userInputHolders.employment,
        'sliderID': 'slider',
        'min': 0,
        'max': 150000,
        'step': 1000,
        'labelright': "+",
        'destination': '#controls'
    }, {
        'divID': 'slider2',
        'className': 'slideholderTop',
        'HTML': 'Interest rate',
        'labName': 'interestRate',
        'pos': userInputHolders.interestRate*100,
        'labelcss': 'slideLabelSmall',
        'sliderID': 'slider',
        'min': 0,
        'max': 7,
        'step': 1, 
        'labelright': "%",
        'destination': '#controls'
    },
    {
        'divID': 'slider3',
        'className': 'slideholderTop',
        'HTML': 'Amount spent on furnishings',
        'labName': 'WT',
        'pos': 0,
        'labelcss': 'slideLabelBig',
        'sliderID': 'slider',
        'min': 0,
        'max': (userInputHolders.rentalIncome - (userInputHolders.principal * userInputHolders.interestRate)) * 0.1,
        'step': 10, 
        'labelright': "+",
        'destination': '#controls2'
    }];

let textInputSettings = [{
        'info': 'Rental income',
        'info_add': '£ per month ',
        'id': 'rentalIncome',
        'initialValue': userInputHolders.rentalIncome/12
    }, {
        'info': 'Property value',
        'info_add': '£',
        'id': 'propertyValue',
        'initialValue': userInputHolders.propertyValue
    }];

let tableArraySettings = [{
      // initial values
        'rentalIncome': 100,
        'employment': 1000,
        'fd': 12322
    }];

let radioInputSettings = [{
        "firstOption": "125 per cent interest coverage ratio (ICR)",
        "secondOption": "145 per cent interest coverage ratio (ICR)",
        "IRCTitle": "Calculations based on:"
}];


////// THE CALCULATIONS SETTINGS

let stampDutySettings = {
    oldLimits: [125000,250000,925000,1500000],
    oldTaxBrackets: [0.02, 0.03, 0.05, 0.02],
    newLimits: [0,125000,250000,925000,1500000],
    newTaxBrackets: [0.03,0.02,0.03,0.05,0.02]
};

let interestReliefArray = [1, 0.75, 0.5, 0.25, 0];

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

/////// LANGUAGE SETTINGS 


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





export { taxbands, details, sliderSettings, personalAllowance, userInputHolders, texts, languageSettings, stampDutySettings, interestReliefArray, textInputSettings, radioInputSettings, tableArraySettings }

const numeral = require('numeral');
import { router } from './router';
import { taxbands, userInputHolders, stampDutySettings, interestReliefArray, details, personalAllowance } from './settings'


let calc = {
    loanCalculations: function(floor) {
        let doCalcs = function(floor) {
            let depositNotChecked = -((userInputHolders.rentalIncome - floor * (userInputHolders.stressTestIR * userInputHolders.propertyValue)) / (userInputHolders.stressTestIR * floor));
            let depositChecked = 0;

            if (depositNotChecked / userInputHolders.propertyValue <= 0.25) {
                depositChecked = userInputHolders.propertyValue * 0.25;
            } else {
                depositChecked = depositNotChecked;
            };


            let principal = userInputHolders.propertyValue - depositChecked;

            userInputHolders.principal = principal

            let maxLTV = principal / userInputHolders.propertyValue;

            let array = [depositChecked, principal, maxLTV]
            return array
        }

        let passObject = {};

        if (floor === "newFloor") {

            let oldRulesArray = doCalcs(userInputHolders.floorOld);
            let newRulesArray = doCalcs(userInputHolders.floorNew);

            passObject = {
                "depositDifference": newRulesArray[0] - oldRulesArray[0],
                "LTVDifference": oldRulesArray[2] - newRulesArray[2],
                "LTV": newRulesArray[2],
                "principal": newRulesArray[1],
                "deposit": newRulesArray[0]
            }

        } else if (floor === "oldFloor") {

            let oldRulesArray = doCalcs(userInputHolders.floorOld);

            passObject = {
                "depositDifference": 0,
                "LTVDifference": 0,
                "LTV": oldRulesArray[2],
                "principal": oldRulesArray[1],
                "deposit": oldRulesArray[0]
            }
        } else {
            console.log("error occurred, no floor defined")
            return
        }

        let interestPayments = userInputHolders.principal * userInputHolders.interestRate
        router("interestPayments", interestPayments)

        router("calcLoan", passObject);


    },

    stampDutyCalculations: function() {

        let doCalcs = function(Array1, Array2) {

            // TODO: Tidy this

            function callback(element, index, array) {
                let value = userInputHolders.propertyValue > element
                value = value ? 1 : 0
                let value2 = userInputHolders.propertyValue - element
                let value3 = value * value2
                return value3
            }

            let trueOrFalse = Array1.map(callback);

            function callbackSecond(element, index, array) {
                return trueOrFalse[index] * element
            }

            let totalArray = Array2.map(callbackSecond)
            let sum = totalArray.reduce(function(a, b) {
                return a + b;
            }, 0);


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

    taxCalculations: function(WT) {


        let interestPayments = userInputHolders.principal * userInputHolders.interestRate, //
            profits = userInputHolders.rentalIncome - interestPayments;



        let employmentTaxes = calculateTaxes(userInputHolders.employment)
        let WTdeductions = userInputHolders.WTdeductions;
        let old_WTdeductions = WTdeductions === 0 ? 0 : (userInputHolders.rentalIncome - interestPayments) * 0.1
        let otherTaxDeductions = userInputHolders.otherTaxDeductions;
        let WTDifference = WTdeductions - old_WTdeductions;

        let i = -1;
        let interestTaxable = [],
            interestReliefPounds = [],
            taxableAmountNewWT = [],
            taxableAmountOldWT = [],
            WTTax = [],
            WTTaxDeductionInterestRelief = [],
            WTTotalTax = [],
            WTProfitAfterTax = [];


        interestReliefArray.map(function(value, key, object) {
            i += 1
            interestTaxable.push(interestPayments - value * interestPayments);
            interestReliefPounds.push(interestPayments * value);
            taxableAmountNewWT.push(userInputHolders.rentalIncome - interestReliefPounds[i] - WTdeductions);
            taxableAmountOldWT.push(taxableAmountNewWT[i] + WTDifference);
        });




        let WTCalcs = function(input) {
            let WTTax = [],
                WTTaxDeductionInterestRelief = [],
                WTTotalTax = [],
                WTProfitAfterTax = [];

            i = -1;

            input.map(function(value, key, object) {
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
                WTProfitAfterTax.push(userInputHolders.rentalIncome - interestPayments - WTdeductions - otherTaxDeductions - WTTotalTax[i])
            });

            let WTTotalTaxChecked = WTTotalTax.map(function(value) {
                value = value < 0 ? 0 : value;
                value = -(value)
                return value
            });

            return [WTTotalTaxChecked, WTProfitAfterTax, profits];
        }

        if (WT != undefined) {
            passObject = [WTCalcs(taxableAmountNewWT), WTCalcs(taxableAmountOldWT)];


            var sum = passObject[0][1].map(function(num, idx) {
                return passObject[1][1][idx] - num;
            });

            router("WTOut", sum[0]);

            return // skip the rest
        }

        let passObject = WTCalcs(taxableAmountNewWT)
        router("taxCalculations", passObject)

    },
    whichTaxBand:  function() {
        
        // This thing tells user in which tax band he is 

        let employment = userInputHolders.employment,
            rentalincome = userInputHolders.rentalIncome,
            message = "",
            pAllowance = personalAllowance.basicAllowance,
            basic = pAllowance,
            higher = taxbands.basic[1] + pAllowance, 
            top = taxbands.higher[1],
            total = employment + rentalincome;

        if(total < pAllowance) {
                console.log("not tax");
                message="you pay no tax.";
        } else if (total > pAllowance && total <= higher) {
                message= "you pay tax at 20 per cent rate.";
        } else if (higher < total && total < top) {
                if (employment >= higher) {
                       message= "you pay tax at 40 per cent rate.";
                    } else {
                       message= "you pay tax partly at 20 per cent and partly at 40 per cent rate. ";
                    }
        } else if (total > top) {
                if (employment >= top) {
                       message= "you pay tax at 45 per cent rate.";
                    } else if (higher < employment && employment <= top){
                       message= "you pay tax partly at 40 per cent and partly at 45 per cent rate.";
                    } else {
                       message= "you pay tax partly at 20 per cent, partly at 40 per cent and also partly at 45 per cent rate.";
                    }
        } else {
            message = "error occurred"
        }

    router("whichTaxBand", message)
    
    }


};





// This scipt calculates the AMOUNT OF TAXES for any given sum 
// Usage:  calculateTaxes(sum) 
// Could be used also outside the project

let thisbind = calcPersonalAllowance.bind(personalAllowance)

function calculateTaxes(input) {
    return thisbind(input);
}

let income = 0;

function calcPersonalAllowance(input) {
    // Basic
    let basicAllowance = this.basicAllowance;
    income = input
        // Age related contribution 
    let ageContribution = 0;
    if (details.age < 65) {
        ageContribution = 0;
    } else if (details.age < 75) {
        ageContribution = this.age65_75Allowance - this.basicAllowance;
    } else {
        ageContribution = this.age75_overAllowance - this.basicAllowance;
    }

    // Age related taper deduction
    let ageTaperDeduction = 0;
    if ((income - this.ageRelatedTreshold) < 0) {
        ageTaperDeduction = 0;
    } else if (((income - this.ageRelatedTreshold) / 2) > ageContribution) {
        ageTaperDeduction = ageContribution;
    } else {
        ageTaperDeduction = (income - this.ageRelatedTreshold) / 2;
    }

    // Allowance after age adjust
    let allowanceAgeAdjusted = basicAllowance + ageContribution + ageTaperDeduction;

    // The taper deduction
    let taperDeduction = 0;
    if (((income - details.pensionContributions) - this.taperThreshold) < 0) {
        taperDeduction = 0;
    } else if ((((income - details.pensionContributions) - this.taperThreshold) / 2) > allowanceAgeAdjusted) {
        taperDeduction = allowanceAgeAdjusted;
    } else {
        taperDeduction = ((income - details.pensionContributions) - this.taperThreshold) / 2;
    }

    let thisbind = calcIncomeTax.bind(taxbands)
        // And finally, the personal allowance 
    let personalAllowance = allowanceAgeAdjusted - taperDeduction;
    return thisbind(personalAllowance, income);
}

function calcIncomeTax(pA) {
    let pa = pA;
    // if person is blind, an extra allowance is granted...
    if (details.blind) {
        pa = pa + personalAllowance.blindAllowance;
    }
    let personalAllowance = pa;

    // Taxable income = income - allowances
    let taxableIncome = income - personalAllowance;
    let carryOver = taxableIncome;
    let basicTax = 0,
        hightTax = 0,
        topTax = 0,
        difference_old = 0,
        difference = this.basic[1] - difference_old,
        i = 0,
        moreTax = 0,
        totalTax = 0;

    for (i in this) {
        if (carryOver > 0) { // if there is income left, then...
            if (carryOver >= this[i][1] - difference_old) { // income exceeds the bands limits
                moreTax = (this[i][1] - difference_old) * this[i][0] // apply tax to band
            } else {
                moreTax = carryOver * this[i][0]; // income does not exceed the band
            }
        } else {
            moreTax = 0; // Income is zero
        }
        if ((carryOver - (this[i][1] - difference_old)) > 0) { // if there is taxable left for the bigger bands...
            carryOver = carryOver - (this[i][1] - difference_old);
        } else { // if not then ...
            carryOver = 0;
        }
        totalTax += moreTax;
        difference_old = this[i][1];
    }

    return totalTax

}


export { calc, calcIncomeTax, calcPersonalAllowance, calculateTaxes, income }
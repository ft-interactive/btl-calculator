import { taxbands, details, personalAllowance } from './settings'

// This scipt calculates the AMOUNT OF TAXES for any given sum 
// See settings.js 
// Usage:  calculateTaxes(sum) 

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

    //console.log("tässä" + totalTax);

}

export { calcIncomeTax, calcPersonalAllowance, calculateTaxes, income }
import { router } from './main.js' 
import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import d3 from 'd3';
import { calculateTaxes } from './tax_calculations';
import { calc } from './other_calculations';
import { userInputHolders } from './settings';
const numeral = require('numeral');


let Widget = {
        resize: function() {
            let newX = this.calcLabelPos(initPos, 'slider');
            this.moveLabel('savelab', initPos, newX);
        },
        eventListeners: function ()  {  
            // EL for text inputs
            selectAll('.o-forms-text').on('input', function(d, i) {
                select(this).property('value', numeral(this.value).format('0,0'));
                let output = numeral().unformat(this.value);
                let source = this.id;
                router(source, output);
            });
            // EL for sliders
            selectAll('#slider').on('input', function(d, i) {
                // console.log(this.parentElement);
                let lab = this.parentElement.children[4].id,
                    pos = Number(this.value),
                    newX = slider.calcLabelPos(pos, 'slider', 'else', i);
                slider.moveLabel(lab, pos, newX);
                router(lab, pos);
                }); 

            // EL for radio buttons

            selectAll('input[type=radio]').on('change', function(d, i){
                select(this).attr('class', 'o-forms-radio o-forms-radio--highlight')

                if (this.id === "newFloor") { userInputHolders.floor = "new "} 
                 else if (this.id === "oldFloor") {
                    userInputHolders.floor = "old"
                } else {
                    console.log("error occured, no floor defined");
                    return 
                }
                router("radioInput", this.id)
            });
            }

    };


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

let htmlString = '',
        label = 0,
        osoite = 0;

let slider = Object.create(Widget);
let textInput = Object.create(Widget);
let table = Object.create(Widget);

slider.sliderTemplate = function(annotations) {
    return `
  <div data-o-grid-colspan="12 S6" style="padding-top: 13px">
    <div class="question_slider">${annotations.HTML}</div>
    <input class='slider' id=${annotations.sliderID} type='range' value=${annotations.pos} max=${annotations.max} min=${annotations.min} step=${annotations.step}>
    <div class='rangeleft'>${annotations.min}</div>
    <div class='rangeright'>${numeral(annotations.max).format('0,0')} ${annotations.labelright}</div>
    <div class=${annotations.labelcss} id=${annotations.labName} ${annotations.labelright}></div>
  </div>
  `;
};



slider.create = function() {
    //  let thisbind = this.moveLabel.bind(callback);
    //  let thisbind2 = this.sliderTemplate.bind(callback);
    sliderSettings.forEach(callback);

    function callback(element, index, array) {
        let i = index;
        // build slider

       // let builder = function () {

            let slideHolder = select(sliderSettings[i].destination);
            slideHolder
                .insert("div",":first-child")
                .attr('id', 'liuku')
                .html(slider.sliderTemplate(sliderSettings[i]));

            // Let's send the stuff to moveLabels() which creates the label
            // and positions it

            slider.moveLabel(
                sliderSettings[i].labName, // the name of the slider
                Number(sliderSettings[i].pos), // the starting position of the slider
                slider.calcLabelPos(Number(sliderSettings[i].pos), // the x coordinate for the starting position
                    sliderSettings[i].sliderID, 'firstTime') // the ID of the slider -- TODO: GET RID OF THIS
            );
        }
  //  }
    
};

slider.moveLabel = function(divId, labelText, pos) {
        let topPos = 0;
        if ((window.innerWidth) > 640) {
            topPos = -79;
        } else { topPos = -80; };
        osoite = '#' + divId;
        label = select(osoite)
            .html(labelText)
            .style('top', topPos + 'px')
            .style('left', pos + 'px');
};


slider.initialize = function() {
     sliderSettings.forEach(callback);
     
        function callback(element, index, array) {
            let labName = sliderSettings[index].labName
            let pos = Number(sliderSettings[index].pos)
            if (index === 0) { index = 1} else if (index === 1) { index = 0 }
             let newX = slider.calcLabelPos(pos, 'slider', 'else', index);
            slider.moveLabel(labName, pos, newX);
        }
}

slider.calcLabelPos = function(pos, SliderID, state, number) {

    let slider = selectAll('#slider');
    let array = 0;

     if (state == 'firstTime') {
        slider.each(function(d, i) {
            let increment = this.max/this.step + 1; 
            let posX = this.getBoundingClientRect().width;
            let point = (pos/this.step) * (posX/increment);
            let gradualOffset = 0; 
            let staticOffset = 0;
            if (slider.max > 100) {
            staticOffset = 15
            gradualOffset = (slider.value/slider.max * 32);} 
            else { 
            staticOffset = -2
            gradualOffset = 0
            }
            array = point - staticOffset - gradualOffset;
        });


    } else {
        let slider2_filtered = slider.filter(function(d, i) {
            return i === number;
        });

        slider = slider2_filtered._groups[0][0];
            let increment = slider.max/slider.step + 1; 
            let posX = slider.getBoundingClientRect().width;
            let point = (pos/slider.step) * (posX/increment);
            let gradualOffset = 0; 
            let staticOffset = 0;
            if (slider.max > 100) {
            staticOffset = 15
            gradualOffset = (slider.value/slider.max * 32);} 
            else { 
            staticOffset = -1
            gradualOffset = -(slider.value/slider.max * 5 )
            }
            array = point - staticOffset - gradualOffset;
        };

    return array;
};

textInput.textInputTemplate = function(object) {

    return `
    <div data-o-grid-colspan="12 S3">
    <div class="textInput">
      <div class="o-forms-group">
        <div class="question_textinput">${object.info}</div>
        <div class="question_add">${object.info_add}</div>
        <input maxlength="8" type="text" value=${numeral(object.initialValue).format('0,0')} id=${object.id} placeholder="placeholder" class="o-forms-text"></input>
      </div>
    </div>
    </div>
  `;
};

textInput.create = function() {
    //  let thisbind = this.moveLabel.bind(callback);
    //  let thisbind2 = this.sliderTemplate.bind(callback);
    textInputSettings.forEach(callback);

    function callback(element, index, array) {
        let i = index;
        // build slider
        let inputHolder = select('#textInputHolder');
        inputHolder
            .insert("div",":first-child")
            .attr('id', 'textInput')
            .html(textInput.textInputTemplate(textInputSettings[i]));

        // Let's send the stuff to moveLabel() which creates the label
        // and positions it
    }
    Widget.eventListeners();
};

table.create = function() {
    tableArraySettings.forEach(callback);

    function callback(element, index, array) {
        let i = index;
        let tableHolder = select('#tableHolder');
        tableHolder
            .insert("div",":first-child")
            .attr('id', 'resultsTable')
            .html(table.tableTemplate(tableArraySettings[i]));
    }
};

export { Widget, slider, textInput, table }
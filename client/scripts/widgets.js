/*jshint esversion: 6 */
import { router } from './router.js';
import { select, selectAll } from 'd3-selection';
import { calc } from './calculations';
import { userInputHolders, sliderSettings, textInputSettings, tableArraySettings, radioInputSettings } from './settings';
const numeral = require('numeral');


let Widget = {
    resize: function() {
        let newX = this.calcLabelPos(initPos, 'slider');
        this.moveLabel('savelab', initPos, newX);
    },
    eventListeners: function() {
        // EL for text inputs
        selectAll('.o-forms-text').on('input', function(d, i) {
            let output = this.value;
            if (this.id != "interestRate") {
                select(this).property('value', numeral(this.value).format('0,0'));
                output = numeral().unformat(this.value);
            }
            let source = this.id;
            router(source, output);
        });
        // EL for sliders
        selectAll('#slider').on('input', function(d, i) {
            let lab = this.parentElement.children[4].id,
                pos = Number(this.value),
                newX = slider.calcLabelPos(pos, 'slider', 'else', i);
            slider.moveLabel(lab, pos, newX);
            router(lab, pos);
        });

        // EL for radio buttons
        selectAll('input[type=radio]').on('change', function(d, i) {
            console.log("triggered")
            select(this).attr('class', 'o-forms-radio o-forms-radio--highlight');
            if (this.id === "newFloor") { userInputHolders.floor = "new "; } else if (this.id === "oldFloor") {
                userInputHolders.floor = "old";
            } else {
                console.log("error occured, no floor defined");
                return;
            }
            router("radioInput", this.id);
        });
    }

};

let htmlString, label, osoite;

let slider = Object.create(Widget);
let textInput = Object.create(Widget);
let table = Object.create(Widget);
let radioButtons = Object.create(Widget);

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
    sliderSettings.forEach(callback);

    function callback(element, index, array) {
        let i = index;
        let slideHolder = select(sliderSettings[i].destination);
        slideHolder
            .insert("div", ":first-child")
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
        topPos = -75;
    } else { topPos = -75; }
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        // Firefox fix
        topPos = -98;
    }
    osoite = '#' + divId;
    label = select(osoite)
        .html(labelText)
        .style('top', topPos + 'px')
        .style('left', pos + 'px');
};


slider.initialize = function() {
    sliderSettings.forEach(callback);

    function callback(element, index, array) {
        let labName = sliderSettings[index].labName;
        let pos = Number(sliderSettings[index].pos);
        if (index === 0) { index = 1; } else if (index === 1) { index = 0; }
        let newX = slider.calcLabelPos(pos, 'slider', 'else', index);
        slider.moveLabel(labName, pos, newX);
    }
};

slider.calcLabelPos = function(pos, SliderID, state, number) {

    let slider = selectAll('#slider');
    let array = 0;

    if (state == 'firstTime') {
        slider.each(function(d, i) {
            let increment = this.max / this.step + 1;
            let posX = this.getBoundingClientRect().width;
            let point = (pos / this.step) * (posX / increment);
            let gradualOffset = 0;
            let staticOffset = 0;
            if (slider.max > 100) {
                staticOffset = 15;
                gradualOffset = (slider.value / slider.max * 32);
            } else {
                staticOffset = -2;

                gradualOffset = (slider.value / slider.max * 32);
            }
            array = point - staticOffset - gradualOffset;
        });


    } else {
        let slider2_filtered = slider.filter(function(d, i) {
            return i === number;
        });

        slider = slider2_filtered._groups[0][0];
        let increment = slider.max / slider.step + 1;
        let posX = slider.getBoundingClientRect().width;
        let point = (pos / slider.step) * (posX / increment);
        let gradualOffset = 0;
        let staticOffset = 0;
        if (slider.max > 100) {
            staticOffset = 15;
            gradualOffset = (slider.value / slider.max * 32);
        } else {
            staticOffset = -1;
            gradualOffset = (slider.value / slider.max * 5);
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                // Firefox fix
                gradualOffset = (slider.value / slider.max * 5);
            }
        }
        array = point - staticOffset - gradualOffset;
    }

    return array;
};

textInput.textInputTemplate = function(object) {
    let size, max;
    if (object.ie === true && object.id != "interestRate") {
        size = "<div data-o-grid-colspan='12 S6'>";
        max = "7";
    } else if (object.ie === true && object.id === "interestRate") {
        size = "<div data-o-grid-colspan='12 S6'>";
        object.info = object.info + " in % e.g. 0.5, 2.1, 3";
        max = "3";
    } else {
        size = "<div data-o-grid-colspan='12 S3'>";
        max = "8";
    }

    return `
    ${size}
    <div class="textInput">
      <div class="o-forms-group">
        <div class="question_textinput">${object.info}</div>
        <div class="question_add">${object.info_add}</div>
        <input maxlength=${max} type="text" value=${numeral(object.initialValue).format('0,0')} id=${object.id} placeholder="placeholder" class="o-forms-text"></input>
      </div>
    </div>
    </div>
  `;
};

textInput.create = function(ie) {
    textInputSettings.forEach(callback);

    function callback(element, index, array) {
        let i = index;
        // build slider
        let inputHolder = select('#textInputHolder');
        inputHolder
            .insert("div", ":first-child")
            .attr('id', 'textInput')
            .html(textInput.textInputTemplate(textInputSettings[i]));


    }


    // IF the user uses IE, we have to replace all the sliders with textinputs
    function callbackIE(element, index, array) {
            let i = index;
            let objekti = { info: sliderSettings[i].HTML, info_add: "", initialValue: sliderSettings[i].Pos, id: sliderSettings[i].labName, ie: true };
            let inputHolder = select(sliderSettings[i].destination);
            inputHolder
                .insert("div", ":first-child")
                .attr('id', 'textInput')
                .html(textInput.textInputTemplate(objekti));
        }
    if (ie === "IE") {
        sliderSettings.forEach(callbackIE);
    }
    Widget.eventListeners();

};

radioButtons.radioInputTemplate = function(object) {
    return `
    <div data-o-grid-colspan="12 S6">
    <div class="o-forms-group">
    <label class="o-forms-label"><span id=${object.ICRTitle}></span></label>
        <input type="radio" id="oldFloor" name="radio" value="1" class="o-forms-radio"></input>
        <label for="oldFloor" class="o-forms-label">${object.firstOption}</label>
        <input type="radio" name="radio" id="newFloor" value="3" class="o-forms-radio o-forms-radio--highlight" checked></input>
        <label for="newFloor" class="o-forms-label">${object.secondOption}</label>
    </div>
    </div>
     `;
};

radioButtons.create = function(object) {
    radioInputSettings.forEach(callback);

    function callback(element, index, array) {
        let i = index;
        let radioInputHolder = select('#radioInputHolder');
        radioInputHolder
            .append("div")
            .attr('id', 'radioInputDiv')
            .html(radioButtons.radioInputTemplate(radioInputSettings[i]));
    }
};




export { Widget, slider, textInput, table, radioButtons };
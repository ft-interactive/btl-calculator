import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import { select, selectAll } from 'd3-selection';
import d3 from 'd3';
import { calculateTaxes } from './tax_calculations';
import { calc } from './other_calculations';
const numeral = require('numeral');

document.addEventListener('DOMContentLoaded', () => {
    // make hover effects work on touch devices
    oHoverable.init();

    // remove the 300ms tap delay on mobile browsers
    attachFastClick(document.body);

    window.addEventListener('resize', resize);

    let initPos = 1;
    let deductions = 0;

    let sliderArray = [{
        'divID': 'testi',
        'className': 'slideholderTop',
        'HTML': 'Employment income',
        'labName': 'employment',
        'labelcss': 'slideLabelBig',
        'pos': 30000,
        'sliderID': 'slider',
        'min': 0,
        'max': 150000,
        'step': 1000,
        'labelright': "+"
    }, {
        'divID': 'testi2',
        'className': 'slideholderTop',
        'HTML': 'Interest rate',
        'labName': 'second',
        'pos': 90,
        'labelcss': 'slideLabelSmall',
        'sliderID': 'slider',
        'min': 0,
        'max': 8,
        'step': 0.5, 
        'labelright': "%" 
    }];

    let textInputArray = [{
        'info': 'How much is your rental income after expenses per month in £?',
        'id': 'rentalincome',
        'initialValue': 0
    }, {
        'info': 'What is the property value?',
        'id': 'propertyvalue',
        'initialValue': 0
    }];

    let tableArray = [{
      // initial values
        'rentalincome': 100,
        'employment': 1000,
        'fd': 12322
    }];

    let htmlString = '',
        label = 0,
        osoite = 0;

    let Widget = {
        resize: function() {
            let newX = this.calcLabelPos(initPos, 'slider');
            this.moveLabel('savelab', initPos, newX);
        },
        inputValues: function(source, input) {
          if (source === 'rentalincome') {
              let output = numeral(calc.profitBeforeTax(input)).format('0,0');
              selectAll('#tableRentalIncome').text(output);
          };

          if (source === 'employment') {
              let output = numeral(calc.profitBeforeTax(input)).format('0,0');
              selectAll('#tableTax').text(output);
          };
        }
    };

    
    let slider = Object.create(Widget);
    let textInput = Object.create(Widget);
    let table = Object.create(Widget);

    slider.sliderTemplate = function(annotations) {
        return `
      <div id=${annotations.divID} class=${annotations.className}>
        <div>${annotations.HTML}</div>
        <input class='slider' id=${annotations.sliderID} type='range' value=${annotations.pos} max=${annotations.max} min=${annotations.min} step=${annotations.step}>
        <div class='rangeleft'>${annotations.min}</div>
        <div class='rangeright'>${numeral(annotations.max).format('0,0')} ${annotations.labelright}</div>
        <div class=${annotations.labelcss} id=${annotations.labName} ${annotations.labelright}></div>
      </div>
      `;
    };

calc.tax();

    slider.create = function() {
        //  let thisbind = this.moveLabel.bind(callback);
        //  let thisbind2 = this.sliderTemplate.bind(callback);
        sliderArray.forEach(callback);

        function callback(element, index, array) {
            let i = index;
            // build slider
            let slideHolder = select('#controls');
            slideHolder
                .append('div')
                .attr('id', 'liuku')
                .html(slider.sliderTemplate(sliderArray[i]));

            // Let's send the stuff to moveLabel() which creates the label
            // and positions it

            slider.moveLabel(
                sliderArray[i].labName, // the name of the slider
                Number(sliderArray[i].pos), // the starting position of the slider
                slider.calcLabelPos(Number(sliderArray[i].pos), // the x coordinate for the starting position
                    sliderArray[i].sliderID, 'firstTime') // the ID of the slider -- TODO: GET RID OF THIS
            );
        }
        slider.eventListener();
    };

    slider.moveLabel = function(divId, labelText, pos) {
            let topPos = 0;
            if ((window.innerWidth) > 640) {
                topPos = 23;
            } else { topPos = 21; };
            osoite = '#' + divId;
            label = select(osoite)
                .html(labelText)
                .style('top', topPos + 'px')
                .style('left', pos + 'px');
    };

    slider.eventListener = function() {
        let saveevent = selectAll('#slider'),
            thisbind = this.inputValues.bind(callback),
            callback = function(d, i) {
                // console.log(this.parentElement);
                let lab = this.parentElement.children[4].id,
                    pos = Number(this.value),
                    newX = slider.calcLabelPos(pos, 'slider', 'else', i);
                slider.moveLabel(lab, pos, newX);
                calculateTaxes(40000);
                thisbind(lab, pos);
            };

        saveevent.on('input', callback);

    };

    slider.calcLabelPos = function(pos, SliderID, state, number) {

        let slider = selectAll('#' + String(SliderID));
        let array = 0;
         if (state == 'firstTime') {

            slider.each(function(d, i) {
                //console.log(i,this.value)
                let increment = this.max - this.min;
                let percentage = 100 / increment * pos;
                let posX = this.getBoundingClientRect().width;
                let offset = ((30 / increment) * pos);
                posX = ((posX / 100) * percentage) - offset;
                array = posX;
            });

        } else {

            let slider2_filtered = slider.filter(function(d, i) {
                return i === number;
            });
            slider = slider2_filtered._groups[0][0];
            let increment = slider.max - slider.min;
            let percentage = 100 / increment * pos;
            let posX = slider.getBoundingClientRect().width;
            let offset = ((30 / increment) * pos);
            posX = ((posX / 100) * percentage) - offset;
            array = posX;
        };
        return array;
    };

    textInput.eventListener = function() {
        selectAll('.o-forms-text').on('input', function() {
            select(this).property('value', numeral(this.value).format('0,0'));
            let output = numeral().unformat(this.value);
            let source = this.id;
            Widget.inputValues(source, output);
        });
    };

    textInput.textInputTemplate = function(object) {

        return `
          <div class="o-forms-group">
            <small class="o-forms-additional-info">${object.info}</small>
            <input type="text" value=${object.initialValue} id=${object.id} placeholder="placeholder" class="o-forms-text"></input>
          </div>
      `;
    };

    textInput.create = function() {
        //  let thisbind = this.moveLabel.bind(callback);
        //  let thisbind2 = this.sliderTemplate.bind(callback);
        textInputArray.forEach(callback);

        function callback(element, index, array) {
            let i = index;
            // build slider
            let inputHolder = select('#inputControls');
            inputHolder
                .append('div')
                .attr('id', 'textInput')
                .html(textInput.textInputTemplate(textInputArray[i]));

            // Let's send the stuff to moveLabel() which creates the label
            // and positions it
        }
        textInput.eventListener();
    };

    table.tableTemplate = function(object) {
        return `
          <table class="o-table o-table--responsive-overflow o-table--row-stripes" data-o-component="o-table">
            <thead>
            <th></th>
            <th data-o-table-data-type="numeric" class="o-table__cell--numeric">2016 <span class="o-table__cell--content-secondary">(GBP)</span></th>
              <th data-o-table-data-type="numeric" class="o-table__cell--numeric">2016 <span class="o-table__cell--content-secondary">(GBP)</span></th>
              <th data-o-table-data-type="numeric" class="o-table__cell--numeric">2017 <span class="o-table__cell--content-secondary">(GBP)</span></th>
                <th data-o-table-data-type="numeric" class="o-table__cell--numeric">2018 <span class="o-table__cell--content-secondary">(GBP)</span></th>
                <th data-o-table-data-type="numeric" class="o-table__cell--numeric">2019 <span class="o-table__cell--content-secondary">(GBP)</span></th>
                <th data-o-table-data-type="numeric" class="o-table__cell--numeric">2020 <span class="o-table__cell--content-secondary">(GBP)</span></th>
            <tbody>
                <tr>
                    <td><b>Profit before tax</b></td>
                    <td data-o-table-data-type="numeric" id="tableRentalIncome" class="o-table__cell--numeric">${tableArray[0]['rentalincome']}</td>
                    <td data-o-table-data-type="numeric" id="tableRentalIncome" class="o-table__cell--numeric">${tableArray[0]['rentalincome']}</td>
                    <td data-o-table-data-type="numeric" id="tableRentalIncome" class="o-table__cell--numeric">${tableArray[0]['rentalincome']}</td>
                    <td data-o-table-data-type="numeric" id="tableRentalIncome" class="o-table__cell--numeric">${tableArray[0]['rentalincome']}</td>
                    <td data-o-table-data-type="numeric" id="tableRentalIncome" class="o-table__cell--numeric">${tableArray[0]['rentalincome']}</td>
                    <td data-o-table-data-type="numeric" id="tableRentalIncome" class="o-table__cell--numeric">${tableArray[0]['rentalincome']}</td>                   
                </tr>
                <tr>
                    <td><b>Tax</b></td>
                    <td data-o-table-data-type="numeric" id="tableTax" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" id="tableTax" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" id="tableTax" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" id="tableTax" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" id="tableTax" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" id="tableTax" class="o-table__cell--numeric">2</td>
                </tr>
                <tr>
                    <td><b>Profit after tax</b></td>
                    <td data-o-table-data-type="numeric" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" class="o-table__cell--numeric">2</td>
                    <td data-o-table-data-type="numeric" class="o-table__cell--numeric">1.56</td>                    
                    <td data-o-table-data-type="numeric" class="o-table__cell--numeric">1.56</td>                    
                    <td data-o-table-data-type="numeric" class="o-table__cell--numeric">1.56</td> 
                </tr>
            </tbody>
          </table>
      `;
    };

    table.create = function() {
        tableArray.forEach(callback);

        function callback(element, index, array) {
            let i = index;
            // build slider
            let tableHolder = select('#tableHolder');
            tableHolder
                .append('div')
                .attr('id', 'resultsTable')
                .html(table.tableTemplate(tableArray[i]));
        }
    };

    slider.create();
    textInput.create();
    table.create();

    function resize() {
        var newX = slider.calcLabelPos(initPos, 'slider');
        slider.moveLabel('savelab', initPos, newX);
    }

});
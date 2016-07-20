import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import { select, selectAll } from 'd3-selection';
import d3 from 'd3';
import {calculateTaxes} from './tax_calculations'

document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
		oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
		attachFastClick(document.body);


	window.addEventListener('resize', resize);

	//Variables that hold the slider.values
	var savePerYear=50;
	var timeToRetire=40;
	var nomReturn=6.0;
	var charges=2.1
	var returns=2
	var newCharges=0.5;
	var newReturns=0;
	var totalValue=0;
	var revisedValue=0;
	var difference=0
	var feesDiff=0
	var percentDif=0
	var firstrun=true;

	//Intial set up perameters for the sliders
	var slideValues = [{
	    "divID": "testi",
	    "className": "slideholderTop",
	    "HTML": "This is a test slider",
	    "labName": "first",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	},
	{
	    "divID": "testi2",
	    "className": "slideholderTop",
	    "HTML": "This is an another slider",
	    "labName": "second",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	},
	{
	    "divID": "testi3",
	    "className": "slideholderTop",
	    "HTML": "This is the third slider",
	    "labName": "third",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	},
	{
	    "divID": "testi4",
	    "className": "slideholderTop",
	    "HTML": "This is the fourth slider",
	    "labName": "fourth",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	},
		
	{
	    "divID": "testi5",
	    "className": "slideholderTop",
	    "HTML": "This is the fifth slider",
	    "labName": "fifth",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	},
		
	{
	    "divID": "testi6",
	    "className": "slideholderTop",
	    "HTML": "This is the sixth slider",
	    "labName": "sixth",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	},
		
	{
	    "divID": "testi7",
	    "className": "slideholderTop",
	    "HTML": "This is the seventh slider",
	    "labName": "seventh",
	    "pos": savePerYear,
	    "sliderID": "sltesti",
	    "min": 0,
	    "max": 100,
	    "step": 10
	}]


	//Add sliders first four siders into #inputs
	var htmlString="";

	for (var i = 0; i < slideValues.length; i++) {
		var slideHolder=select("#controls");
		htmlString=htmlString+slidertemplate (slideValues[i]);
		slideHolder.html(htmlString);
	}

	function slidertemplate (annotations) {
		return `
			<div id=${annotations.divID} class=${annotations.className}>
				<div>${annotations.HTML}</div>
				<input class='slider' id=${annotations.sliderID} type='range' value=${annotations.pos} max=${annotations.max} min=${annotations.min} step=${annotations.step}>
				<div class='rangeleft'>${annotations.min}</div>
				<div class='rangeright'>${annotations.max}</div>
			</div>
			`;
 	}

	//Add labels to slider then move them to correct postion.
	for (var i = 0; i < slideValues.length; i++) {
		var div=slideValues[i].divID;
		var labName=slideValues[i].labName;
		addLabel(div,labName);
		var labelValue=Number(slideValues[i].pos);
		var slideID=slideValues[i].sliderID;
		var newX=calcLabelPos(labelValue,slideID);
		moveLabel(labName,labelValue,newX);
	}

	//Add event listeners to slsave slider
	var saveevent=selectAll("#sltesti");
	saveevent.on("input", function(d){
		let lab = this.parentElement.children[4].id;
		let pos=Number(this.value);
		var newX=calcLabelPos(pos,"sltesti")
		console.log(newX)
		moveLabel(lab,pos,newX);
		calculateTaxes(40000);
		updateText(lab,pos)
	})

	//Adds a dive to hold the slider label
	function addLabel(divID,labelID) {
		var label=select('#'+String(divID)).append("div");
		label
		.attr('id', labelID)
		.attr('class', 'slideLabel');
	}

	//Calculates the postion x position of the label so its under the slider thumb
	function calcLabelPos (pos, SliderID) {
		var slider=select('#'+String(SliderID));
		var increments=slider.node().max-slider.node().min;
		var percentage=(100/(slider.node().max-slider.node().min)*(pos));
		var posX=slider.node().getBoundingClientRect().width;
		var offset=((30/increments)*pos);
		console.log(offset)
		posX=((posX/100)*percentage)-offset;
		return posX;
	}

	//Moves the label over the top of new thumb position
	function moveLabel (divId, labelText, pos) {
		if ((window.innerWidth)>640) {
			var topPos=23
		}
		else {var topPos=21};
		var label=select('#'+String(divId))
		.html(labelText)
		.style('left', pos+'px')
		.style('top', topPos+'px');
	}


	function resize(){
		var newX=calcLabelPos(savePerYear,"sltesti")
		moveLabel("savelab",savePerYear,newX);
	}

	function updateText(lab, pos){
		if (timeToRetire>0 && savePerYear>0 && nomReturn>0 && charges>0) {
			htmlString=chartText1(lab, pos)
			var div=select("#chartText1");
			div.html(htmlString);
		}
	}


	function chartText1(lab, pos) {
		let upotus = lab
		let pos1 = pos
		return `
			<div class="dynamichighlights">${"Event detected! The"} ${lab} ${"slider was moved to"} ${pos1} </div>
			`;
	}


});

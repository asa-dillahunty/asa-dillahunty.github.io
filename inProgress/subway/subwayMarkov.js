let currInterval;
let laneNumber;
let P;
let Q;
let flashingColors = false;
let laneArray = [];

let randomNum;
let maxVal;

let dynamicFillStyle = 0;
let dynamicFillStyleString = "";

let barWidth;
let barStartX;

const BackgroundWhite = "#EEEEEE";
const DefaultBarRed = "#FF6868";
const MaxBarRed = "#E55D5D";
const TextBlack = "#0F0F0F";

const myCanvas = document.getElementById("graph-canvas");
myCanvas.width = myCanvas.getBoundingClientRect().width;
myCanvas.height = myCanvas.getBoundingClientRect().height;
const ctx = myCanvas.getContext("2d");

ctx.font = "24px serif";
ctx.save();
ctx.fillStyle = BackgroundWhite;
ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
ctx.restore();

function startCounting() {
	if (currInterval) stopCounting();
	
	if (document.getElementById("Custom-Inputs").checked === true) {
		P = document.getElementById("P-Input").value;
		Q = document.getElementById("Q-Input").value;
		laneNumber = document.getElementById("N-Input").value;
	}
	else {
		// P = .1;
		// Q = .1;
		P = 1/3;
		Q = 1/3;
		laneNumber = 3;
		document.getElementById("P-Input").value = P;
		document.getElementById("Q-Input").value = Q;
	}
	flashingColors = document.getElementById("Flashing-Colors").checked;
	// start in the middle
	currPosition = Math.floor(laneNumber/2);

	// empty the array
	// laneArray = Array(laneNumber).fill(0); 	WHY DOES THIS FILL WIN NANs
	laneArray.length = 0;
	for (let i=0;i<laneNumber;i++) {
		laneArray.push(0);
	}
	setUpPaint();
	
	// start the Interval or whatever
	currInterval = setInterval(step);
}

function step() {
	// am I an edge?
	randomNum = Math.random();
	if (currPosition === 0) {
		if (randomNum < P) {
			currPosition += 1;
		}
	} else if (currPosition === laneNumber - 1) {
		if (randomNum < P) {
			currPosition -= 1;
		}
	} // else I am a 'center' lane
	else if (randomNum < Q) // go left
		currPosition -= 1;
	else if (randomNum > 1-Q) // go right
		currPosition += 1;
	// else position stays same

	laneArray[currPosition] += 1;

	// paint update
	paint();
}

function setUpPaint() {
	// todo: adjust for padding
	// values for width only need to be calculated once 
	barWidth = myCanvas.width/laneNumber;
	barStartX = {};
	for (let i=0;i<laneNumber;i++)
		barStartX[i] = i*barWidth;
}

function paint() {
	if (flashingColors) incDynamicFillStyle();
	maxVal = Math.max(...laneArray);
	if (maxVal === laneArray[currPosition]) fullPaint();
	else {
		ctx.save();
		paintSquare(currPosition, laneArray[currPosition], maxVal);
		ctx.restore();
	}
}

function fullPaint() {
	ctx.save();
	ctx.fillStyle = BackgroundWhite;
	ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
	
	laneArray.map((val,index) => {
		paintSquare(index, val, maxVal);
	});
	ctx.restore();
}

function stopCounting() {
	clearInterval(currInterval);
}

function paintSquare(index, val, maxVal) {
	let barHeight = myCanvas.height*(val/maxVal);
	let barStartY = myCanvas.height - barHeight;
	
	setBarFillStyle(val);
	ctx.fillRect(barStartX[index], barStartY, barWidth, barHeight);

	// write value
	ctx.fillStyle = TextBlack;
	ctx.fillText(val, barStartX[index]+5, myCanvas.height - 5);
}

function incDynamicFillStyle() {
	dynamicFillStyle = (dynamicFillStyle+1)%4096; //16777216
	dynamicFillStyleString = dynamicFillStyle.toString(16);
	while (dynamicFillStyleString.length < 3) dynamicFillStyleString = "0" + dynamicFillStyleString;

	dynamicFillStyleString = "#" + dynamicFillStyleString;
}

function setBarFillStyle(currVal) {
	if (flashingColors) ctx.fillStyle = dynamicFillStyleString;
	else if (maxVal === currVal) {
		ctx.fillStyle = MaxBarRed;
	}
	else {
		ctx.fillStyle = DefaultBarRed
	}
}
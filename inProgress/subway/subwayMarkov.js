let currInterval;
let laneNumber;
let P;
let Q;
let laneArray;

function startCounting() {
	// grab the number of things => start with 3
	if (document.getElementById("Custom-Inputs").checked === true) {
		console.log("here");
		P = document.getElementById("P-Input").value;
		Q = document.getElementById("Q-Input").value;
	}
	else {
		P = 1/3;
		Q = 1/3;
		laneNumber = 3;
		document.getElementById("P-Input").value = P;
		document.getElementById("Q-Input").value = Q;
	}

	
	// start in the middle
	currPosition = Math.floor(laneNumber/2);

	// empty the array
	laneArray = Array(laneNumber).fill(0);
	console.log(laneArray);
	setUpPaint();
	
	// start the Interval or whatever
	currInterval = setInterval(step);
}

let randomNum;
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

let barElements;
let numberElements;
function setUpPaint() {
	// grab the elements for painting
	barElements = document.getElementsByClassName("bar");
	numberElements = document.getElementsByClassName("bar-label")
}

let maxVal;
function paint() {
	maxVal = Math.max(...laneArray);
	laneArray.map((val,index) => {
		barElements[index].style.height = Math.floor((val/maxVal)*1000)/10 + "%";
		numberElements[index].value = val;
	});
}


function stopCounting() {
	clearInterval(currInterval);
}
function startSolve() {
	const outputDivHeader = document.getElementById("solutionBoxHeader");
	outputDivHeader.textContent = "LOADING ...";
	// unhide ghost
	const ghostCanvas = document.getElementById('GhostCanvas');
	if (ghostCanvas) ghostCanvas.style.display = 'inherit';
	// start solve
	solve().then( (areSolutions) =>  {
		// hide ghost on finish
		const ghostCanvas = document.getElementById('GhostCanvas');
		if (ghostCanvas) ghostCanvas.style.display = 'none';

		if (areSolutions) document.getElementById("solutionBox").style = "margin-top: 10px;border-top:2px solid var(--black);";
		else document.getElementById("solutionBox").style = "margin-top: 0; border-top: none";
	});
}

// testFunc();
function testFunc() {
	const word = "creationplum";
	const inputs = document.querySelectorAll('.letter-input');
	for (let i=0;i<inputs.length;i++) {
		inputs[i].value = word[i];
	}
}

// returns true/false if solutions are found/not found
async function solve() {
	const letters = getLetters();
	for (let i=0;i<letters.length;i++) {
		for (let j=0;j<letters[i].length;j++) {
			if (letters[i][j] !== '') continue;
			displayIsInvalidPuzzle("Must fill in all puzzle letters");
			return false;
		}
	}
	const letterSet = getLetterSet(letters);
	if (letterSet.size < 12) {
		displayIsInvalidPuzzle("Puzzle letters must all be unique");
		return false;
	}
	const forbiddenSequences = getForbiddenSequences(letters);

	const scrabbleDictionary = await getDictionary(letterSet, forbiddenSequences, SCRABBLE_DICTIONARY);
	const badDictionary = await getDictionary(letterSet, forbiddenSequences, MASSIVE_DICTIONARY);

	let depth = 1; // start with a depth of 2 (after the ++)
	let solutions = [];
	while (solutions.length < 1) {
		depth++;
		if (depth > 4) break;
		solutions = findSolutions(depth, scrabbleDictionary);
		if (depth > 2 && solutions.length < 1) {
			solutions = findSolutions(depth - 1, badDictionary);
		} 
	}
	displaySolutions(solutions);

	if (solutions.length > 0) {
		drawWords(solutions[0]);
		return true;
	}
	else return false;
}

function getLetters() {
	const topInputs = document.getElementById('top-letters').querySelectorAll('.letter-input');
	const top = Array.from(topInputs).map(input => input.value.toLowerCase());

	const rightInputs = document.getElementById('right-letters').querySelectorAll('.letter-input');
	const right = Array.from(rightInputs).map(input => input.value.toLowerCase());

	const bottomInputs = document.getElementById('bottom-letters').querySelectorAll('.letter-input');
	const bottom = Array.from(bottomInputs).map(input => input.value.toLowerCase());

	const leftInputs = document.getElementById('left-letters').querySelectorAll('.letter-input');
	const left = Array.from(leftInputs).map(input => input.value.toLowerCase());

	const letters = [top,right,bottom,left];
	return letters;
}

async function getDictionary(letterSet, forbiddenSequences, filePath) {
	const finalDict = {};

	let response = await fetch(filePath);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	const dictionary = await response.json();

	// filter dictionary
	dictionary.forEach((word) => {
		if (canBuild(word, letterSet, forbiddenSequences)) {
			if (!finalDict[word[0]]) finalDict[word[0]] = [];
			finalDict[word[0]].push(word); 
		}
	});

	return finalDict;
}

function canBuild(word, letterSet, forbiddenSequences) {

	// words of  length 1 or 2 not allowed
	if (word.length < 3) return false;
	// words with repeating letters not allowed
	else if (hasRepeatingLetters(word)) return false;
	else if (!containsCorrectLetters(word, letterSet)) return false;
	else if (hasForbiddenSequence(word, forbiddenSequences)) return false;
	else return true;
}

// this was stolen from the internet
function hasRepeatingLetters(word) {
	return /(.)\1/.test(word);
}

function hasForbiddenSequence(word, forbiddenSequences) {
	for (let i =0;i<forbiddenSequences.length;i++) {
		if (word.includes(forbiddenSequences[i])) return true;
	}
	return false;
}

function getForbiddenSequences(letters) {
	const forbiddenSequences = [];
	letters.forEach((side) => {
		forbiddenSequences.push(side[0]+side[1]);
		forbiddenSequences.push(side[0]+side[2]);

		forbiddenSequences.push(side[1]+side[0]);
		forbiddenSequences.push(side[1]+side[2]);

		forbiddenSequences.push(side[2]+side[0]);
		forbiddenSequences.push(side[2]+side[1]);
	});
	return forbiddenSequences;
}

function containsCorrectLetters(word, letterSet) {
	for (let i = 0; i<word.length; i++) {
		if (!letterSet.has(word[i])) return false;
	}

	return true;
}

function getLetterSet(letters) {
	const allowedSet = new Set();
	letters.forEach((side) => {
		side.forEach((letter) => allowedSet.add(letter) );
	});
	return allowedSet;
}

function isSolution(words) {
	// words is an array of strings
	if (words.length < 1) return;
	
	const lettersUsed = new Set();
	words.forEach((word) => {
		for (let i=0;i<word.length;i++) {
			lettersUsed.add(word[i]);
		}
	});
	if (lettersUsed.size === 12) return true;
}

function findSolutions(depth, dictionary) {
	const solutions = [];
	alphabetArray.forEach((letter) => {
		findSolutionHelper(solutions, [], depth, dictionary, letter);
	});
	return solutions;
}

function findSolutionHelper(solutionArray, currSolution, depth, dictionary, startingLetter) {
	if (depth === 0) {
		if (isSolution(currSolution)) solutionArray.push([...currSolution]);
		return;
	}
	else if (isSolution(currSolution)) return; // can't have a solution that finishes early

	const wordOptions = dictionary[startingLetter];
	if (!wordOptions) return;

	wordOptions.forEach((word) => {
		currSolution.push(word);

		findSolutionHelper(solutionArray, currSolution, depth-1, dictionary, word[word.length-1]);
		currSolution.pop();
	});
}

function displaySolutions(solutions) {
	const outputDivHeader = document.getElementById("solutionBoxHeader");
	outputDivHeader.textContent = "Solutions found: " + solutions.length;

	let solutionBlob = "";
	const outputDiv = document.getElementById("solutionBox");
	solutions.forEach((solution) => {
		solutionBlob += `<p onclick="drawWords([`;
		for (let i=0;i<solution.length;i++) {
			if (i !== 0) solutionBlob += ",";
			solutionBlob += "'" + solution[i] + "'";
		}
		solutionBlob += `])">`
		for (let i=0;i<solution.length;i++) {
			if (i !== 0) solutionBlob += " | ";
			solutionBlob += solution[i];
		}
		solutionBlob += "</p>";
	});
	outputDiv.innerHTML = solutionBlob;
}

function displayIsInvalidPuzzle(reason) {
	const outputDivHeader = document.getElementById("solutionBoxHeader");
	outputDivHeader.textContent = "Invalid Puzzle: ";

	const outputDiv = document.getElementById("solutionBox");
	outputDiv.innerHTML = "<p>"+reason+"</p>";
}

function displaySelectSolve() {
	if (Object.keys(drawingSteps).length > 1) clearDrawing();
	const outputDivHeader = document.getElementById("solutionBoxHeader");
	outputDivHeader.textContent = "Select solve to begin solving";

	const outputDiv = document.getElementById("solutionBox");
	outputDiv.innerHTML = "";
}

function setLetterState(circle, letter, addState, removeState) {
	if (addState) {
		circle.classList.add(addState);
		letter.classList.add(addState);
	}
	if (removeState) {
		circle.classList.remove(removeState);
		letter.classList.remove(removeState);
	}
}

function queueStateChange(circle, letter, delay, addState, removeState) {
	if (!drawingSteps[delay]) drawingSteps[delay] = []; 
	drawingSteps[delay].push({
		circle:circle,
		letter:letter,
		addState:addState,
		removeState:removeState
	});
}

function drawWords(words) {
	console.log("Entering Draw");
	// clean up before we start
	clearDrawing();
	const inputs = document.querySelectorAll('.letter-input');
	const circles = document.querySelectorAll('.circle');
	const list = { };
	for (let i=0;i<inputs.length;i++) {
		list[inputs[i].value] = circles[i].getBoundingClientRect();
		list[inputs[i].value].index = i;
	}
	const drawTime = .5;
	console.log("Draw Checkpoint 1");

	const lineLayer = document.getElementById('lineLayer');
	const LLCords = lineLayer.getBoundingClientRect();
	let lineBlob = '';
	let letterCounter = 1;

	let svgSize = 320;
	let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	if (vw <= 767) svgSize = Math.floor(svgSize*3/4);
	console.log("Draw Checkpoint 2");

	for (let i=0;i<words.length;i++) {
		const word = words[i];
		console.log("Draw Checkpoint 3, iteration: ",i);

		// select the first letter
		if (i > 0) queueStateChange(circles[list[word[0]].index], inputs[list[word[0]].index], letterCounter, 'selected', 'final');
		else queueStateChange(circles[list[word[0]].index], inputs[list[word[0]].index], letterCounter, 'selected');

		lineBlob +=`<svg width="${svgSize}" height="${svgSize}" style="animation: fadeLines .1s linear forwards; animation-delay:${drawTime*(letterCounter + word.length - 1)}s">`;

		for (let j=0;j<word.length-1;j++) {
			console.log("Draw Checkpoint 4, iteration: ",j);
			const x1 = list[word[j]].x - LLCords.x + list[word[j]].width/2;
			const y1 = list[word[j]].y - LLCords.y + list[word[j]].height/2;
		
			const x2 = list[word[j+1]].x - LLCords.x + list[word[j+1]].width/2;
			const y2 = list[word[j+1]].y - LLCords.y + list[word[j+1]].height/2;

			const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

			lineBlob += `
				<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} 
					style="
						stroke-dasharray:${lineLength}; stroke-dashoffset:${lineLength}; 
						animation: drawLine ${drawTime}s ease forwards; animation-delay: ${drawTime*letterCounter}s;"
				/>
			`;
			letterCounter++;
			queueStateChange(circles[list[word[j]].index], inputs[list[word[j]].index], letterCounter, 'solved', 'selected');
			queueStateChange(circles[list[word[j+1]].index], inputs[list[word[j+1]].index], letterCounter, 'selected', 'final');
		}
		
		letterCounter++; // add a fake letter for a pause between words
		lineBlob += `</svg>`;

		// queue up the fade at the pause
		for (let j=0;j<word.length;j++) {
			// if not last word, skip last letter
			if (i !== words.length - 1 && j === word.length - 1) continue;
			queueStateChange(circles[list[word[j]].index], inputs[list[word[j]].index], letterCounter, 'final', 'solved');
		}
		// pause again
		letterCounter++;
	}
	// set last letter to final
	// const index = list[words[words.length - 1][words[words.length - 1].length - 1]].index;
	// queueStateChange(circles[index], inputs[index], letterCounter, 'final','selected');

	console.log("Draw Checkpoint 5");
	lineLayer.innerHTML = lineBlob;
	drawingIntervalCounterMax = Math.max(...Object.keys(drawingSteps));

	// start the interval =>
	drawingInterval = setInterval( intervalStep, drawTime*1000);
	intervalStep(); // do step 0
	console.log("Exiting Draw");
}

function intervalStep() {
	if (drawingIntervalCounter > drawingIntervalCounterMax) clearInterval(drawingInterval);
	if (drawingSteps[drawingIntervalCounter]) {
		for (let i=0;i<drawingSteps[drawingIntervalCounter].length;i++) {
			const instructions = drawingSteps[drawingIntervalCounter][i];
			setLetterState( instructions.circle, instructions.letter, instructions.addState, instructions.removeState );
		}
	}
	drawingIntervalCounter++;
}

let drawingInterval = 0;
let drawingIntervalCounter = 0;
let drawingIntervalCounterMax = 0;
let drawingSteps = {};
function clearDrawing() {
	console.log("Entering Clear");
	// stop all timeouts from executing
	clearInterval(drawingInterval);
	drawingIntervalCounter = 0;
	drawingIntervalCounterMax = 0;
	drawingSteps = {};

	const lineLayer = document.getElementById('lineLayer');
	lineLayer.innerHTML = "";

	const inputs = document.querySelectorAll('.letter-input');
	const circles = document.querySelectorAll('.circle');
	for (let i=0;i<inputs.length;i++) {
		// clear formatting before we start
		inputs[i].classList.remove('final');
		circles[i].classList.remove('final');
		inputs[i].classList.remove('selected');
		circles[i].classList.remove('selected');
		inputs[i].classList.remove('solved');
		circles[i].classList.remove('solved');
	}
	console.log("Exiting Clear");
}

const MASSIVE_DICTIONARY = "dictionaries/massive_dictionary.json";
const SCRABBLE_DICTIONARY = "dictionaries/benjamincrom_scrabble_dictionary.json";
const alphabetArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
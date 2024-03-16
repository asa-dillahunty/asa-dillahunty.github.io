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

// returns true/false if solutions are found/not found
async function solve() {
	const letters = getLetters();
	const letterSet = getLetterSet(letters);
	const forbiddenSequences = getForbiddenSequences(letters);

	const dictionary = await getDictionary(letterSet, forbiddenSequences);

	let depth = 1; // start with a depth of 2 (after the ++)
	let solutions = [];
	while (solutions.length < 1) {
		depth++;
		if (depth > 4) break;
		solutions = findSolutions(depth, dictionary);
	}
	displaySolutions(solutions);

	if (solutions.length > 0) return true;
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

async function getDictionary(letterSet, forbiddenSequences) {
	const finalDict = {};
	const filePath = "dictionaries/words_dictionary.json";


	let response = await fetch(filePath);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	let dictionary = await response.json();
	let words = Object.keys(dictionary);

	// filter dictionary
	words.forEach((word) => {
		if (!canBuild(word, letterSet, forbiddenSequences)) {
			delete dictionary[word];
		}
	});

	// return filtered dictionary as array
	words = Object.keys(dictionary);

	alphabetArray.forEach((letter) => {
		let wordList = words.filter( word => word.startsWith(letter));
		if ( wordList.length > 0 ) finalDict[letter] = wordList;
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
		solutionBlob += "<p>";
		for (let i=0;i<solution.length;i++) {
			if (i !== 0) solutionBlob += " | ";
			solutionBlob += solution[i];
		}
		solutionBlob += "</p>";
	});
	outputDiv.innerHTML = solutionBlob;
}


const alphabetArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
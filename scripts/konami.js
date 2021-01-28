/**
 * @author Asa Dillahunty
 * 
 * This script listens for someone to enter the 'konami code'
 * (up up down down left right left right b a enter) and alters the
 * HTML to make it look really gross.
 */

var konamiHintContent = `
<div id="konamiHint">
<!-- up up -->
<div class="bubble"><span>&#8593;</span></div>
<div class="bubble"><span>&#8593;</span></div>
<!-- down down -->
<div class="bubble"><span>&#8595;</span></div>
<div class="bubble"><span>&#8595;</span></div>
<!-- left right -->
<div class="bubble"><span>&#8592;</span></div>
<div class="bubble"><span>&#8594;</span></div>
<!-- left right -->
<div class="bubble"><span>&#8592;</span></div>
<div class="bubble"><span>&#8594;</span></div>
<!-- B A -->
<div class="bubble"><span>B</span></div>
<div class="bubble"><span>A</span></div>
</div>`;

var gamepadContent = `<section id="gamepad"><div class="dPad"><div id="dPadUp" class="up"><div class="arrow"></div></div><div id="dPadRight" class="right"><div class="arrow"></div></div><div id="dPadDown" class="down"><div class="arrow"></div></div><div id="dPadLeft" class="left"><div class="arrow"></div></div><div id="dPadCenter" class="center"><div class="arrow"></div></div></div><div class="actionButtons"><div class="track"><button id="aButton" class="aButton">A</button><button id="bButton" class="bButton">B</button></div></div></section>`;

document.getElementsByTagName('footer')[0].innerHTML += konamiHintContent + gamepadContent;

let konamiHint = document.getElementById("konamiHint");
konamiHint.style.display = 'flex';
konamiHint.addEventListener("touchstart", togglePhoneHelper);

console.log(localStorage.getItem('gg'));
var isNormal = 'true' != localStorage.getItem("konamiValue");
change();
var konami = 0;

document.body.addEventListener('keyup', function(event) {
	if (event.code === "ArrowUp") inputHandler('up');
	else if (event.code === "ArrowDown") inputHandler('down');
	else if (event.code === "ArrowLeft") inputHandler('left');
	else if (event.code === "ArrowRight") inputHandler('right');
	else if (event.code === "KeyB") inputHandler('b');
	else if (event.code === "KeyA") inputHandler('a');
	else inputHandler('false');
});

function change() {
	if (isNormal) static();
	else normalize();
	
	isNormal = !isNormal;
	localStorage.setItem("konamiValue", isNormal);
	localStorage.setItem("gg", 'isNormal');
}

function togglePhoneHelper() {
	activateGamePad(inputHandler);
	var gPad = document.getElementById("gamepad");
	gPad.style.display == "flex" ? gPad.style.display = "none" : gPad.style.display = "flex";
}

function static() {
	var img = document.getElementById("cover");
	if (img) {
		img.src = 'images/aceTreeW.png';
	}

	document.body.classList='static';
}

function inputHandler(input) {
	console.log(input);

	if (input == "up") {
		if (konami == 0 || konami == 1) konami++;
		else if (konami == 2) konami = 2;
		else konami = 1;
	}
	else if (input == "down") {
		if (konami == 2 || konami == 3) konami++;
		else konami = 0;
	}
	else if (input == "left") {
		if (konami == 4 || konami == 6) konami++;
		else konami = 0;
	}
	else if (input == "right") {
		if (konami == 5 || konami == 7) konami++;
		else konami = 0;
	}
	else if (input == "b") {
		if (konami == 8) konami++;
		else konami = 0;
	}
	else if (input == "a") {
		if (konami == 9) {
			change();
		}
		konami = 0;
	}
	else konami = 0;
}

function normalize() {
	var img = document.getElementById("cover");
	if (img) {
		img.src = 'images/stantontree.JPG';
		img.style = '';
	}

	document.body.classList="";
}

function activateGamePad (gPadPress) {
	var gamepad = document.getElementById("gamepad");
	gamepad.addEventListener("touchstart", function (event) { event.preventDefault(); });
	
	var upArrow = document.getElementById("dPadUp");
	upArrow.addEventListener("touchstart", function (event) {
		event.preventDefault();
		gPadPress('up');
	});

	var downArrow = document.getElementById("dPadDown");
	downArrow.addEventListener("touchstart", function (event) {
		event.preventDefault();
		gPadPress('down');
	});

	var leftArrow = document.getElementById("dPadLeft");
	leftArrow.addEventListener("touchstart", function (event) {
		event.preventDefault();
		gPadPress('left');
	});

	var rightArrow = document.getElementById("dPadRight");
	rightArrow.addEventListener("touchstart", function (event) {
		event.preventDefault();
		gPadPress('right');
	});

	var bButton = document.getElementById("aButton");
	bButton.addEventListener("touchstart", function (event) {
		event.preventDefault();
		gPadPress('a');
	});

	var bButton = document.getElementById("bButton");
	bButton.addEventListener("touchstart", function (event) {
		event.preventDefault();
		gPadPress('b');
	});
}
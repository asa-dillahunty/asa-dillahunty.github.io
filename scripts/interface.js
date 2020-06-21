var game_status = 'not started';
var gameBoard;
var turn;
var turnCount;
var players;
var bot = null;

/** This function has been depricated */
// var input = document.getElementById("message");
// input.addEventListener("keyup", function(event) {
// 	// Number 13 is the "Enter" key on the keyboard
// 	if (event.keyCode === 13) {
// 	  // Trigger the button element with a click
// 	  document.getElementById("sendMessage").click();
// 	}
// });

/** This function has been depricated */
// function sendMessage() {
// 	var msg = document.getElementById('message').value;
// 	document.getElementById('message').value = '';
	
// 	if (game_status == 'not started') {
// 		return; // IDK
// 	}

// 	//parse the entered numbers
// 	var list = msg.split(",");
// 	var slice = parseInt(list[0]) - 1;
// 	var col = parseInt(list[1]) - 1;
// 	var row = parseInt(list[2]) - 1;

// 	if (turnCount > 63) {
// 		alert('Tie Game!');
// 	}
// 	if (validMove(slice,col,row) == false) {
// 		return; // IDK
// 	}

// 	sendMove(slice,col,row);
// }

function boardInit() {
	// Clears the html board
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++)
			for (var k=0;k<4;k++) {
				var cell = document.getElementsByClassName("slice")[i].children[4].children[j].children[k];
				cell.innerHTML='&nbsp;';
				cell.classList='';
			}

	//creates an empty board array
	var board = [];
	for (var i=0;i<4;i++) {
		var slice = [];
		for (var j=0;j<4;j++) {
			var row = [' ',' ',' ',' '];
			slice.push(row);
		}
		board.push(slice);
	}
	return board;
}

// This does so much work for me, thank the lord :)
function makeClickable() {
	// object.addEventListener("click", myScript);
	var slices = document.getElementsByClassName("slice");
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++)
			for (var k=0;k<4;k++) {
				var cell = document.getElementsByClassName("slice")[i].children[4].children[j].children[k];
				cell.setAttribute("onClick","clickedSquare("+i+','+j+','+k+");")
			}
}

function clickedSquare(i,j,k) {
	if (validMove(i,j,k)) sendMove(i,j,k);
	else return;


	if (bot != null) {
		var move = bot.getBotMove();

		if (move != 0 && validMove(move[0],move[1],move[2])) 
			sendMove(move[0],move[1],move[2]);
	}
}

function validMove(i,j,k) {
	if (game_status != 'in progress') return false;

	if (i>3 || j>3 || k>3) return false;
	if (i<0 || j<0 || k<0) return false;

	if (gameBoard[i][j][k] == ' ') return true;
	else return false;
}

function sendMove(i,j,k) {
	markCell(i,j,k,players[turn]);
	gameBoard[i][j][k] = players[turn];


	if (getWinner() != 0) {
		markWinner();
		console.log(players[turn] + ' wins!')
		game_status = 'finshed';
		alert(players[turn] + ' wins!')
	}
	turn = (turn+1)%2;
	turnCount++;
}

function markCell(i,j,k,mark) {
	var cell = document.getElementsByClassName("slice")[i].children[4].children[j].children[k];

	cell.innerHTML = mark;
	cell.classList += mark;

	if (players[turn] == 'X')
		cubeBoard[i][j][k].material = THREE.MeshFaceMaterial(xcubeMaterials);
	else if (players[turn] == 'O')
		cubeBoard[i][j][k].material = THREE.MeshFaceMaterial(ocubeMaterials);
}

function markWinner() {
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++)
			for (var k=0;k<4;k++)
				for(var dx=-1;dx<=1;dx++)
					for(var dy=-1;dy<=1;dy++)
						for(var dz=-1;dz<=1;dz++)
						{
							if (dx==0 && dy==0 && dz==0) continue;
							if (i+dx*3 > 3 || i+dx*3 < 0) continue;
							if (j+dy*3 > 3 || j+dy*3 < 0) continue;
							if (k+dz*3 > 3 || k+dz*3 < 0) continue;
								if(gameBoard[i][j][k]!=' ' && 
									gameBoard[i][j][k]==gameBoard[i+dx][j+dy][k+dz] && 
									gameBoard[i][j][k]==gameBoard[i+2*dx][j+2*dy][k+2*dz] && 
									gameBoard[i][j][k]==gameBoard[i+3*dx][j+3*dy][k+3*dz]) {

										document.getElementsByClassName("slice")[i].children[4].children[j].children[k].classList+=' winning-move';
										document.getElementsByClassName("slice")[i+dx].children[4].children[j+dy].children[k+dz].classList+=' winning-move';
										document.getElementsByClassName("slice")[i+dx*2].children[4].children[j+dy*2].children[k+dz*2].classList+=' winning-move';
										document.getElementsByClassName("slice")[i+dx*3].children[4].children[j+dy*3].children[k+dz*3].classList+=' winning-move';

										return gameBoard[i][j][k];
									}

						}
	return 0;
}

function getWinner() {
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++)
			for (var k=0;k<4;k++)
				for(var dx=-1;dx<=1;dx++)
					for(var dy=-1;dy<=1;dy++)
						for(var dz=-1;dz<=1;dz++)
						{
							if (dx==0 && dy==0 && dz==0) continue;
							if (i+dx*3 > 3 || i+dx*3 < 0) continue;
							if (j+dy*3 > 3 || j+dy*3 < 0) continue;
							if (k+dz*3 > 3 || k+dz*3 < 0) continue;
								if(gameBoard[i][j][k]!=' ' && 
									gameBoard[i][j][k]==gameBoard[i+dx][j+dy][k+dz] && 
									gameBoard[i][j][k]==gameBoard[i+2*dx][j+2*dy][k+2*dz] && 
									gameBoard[i][j][k]==gameBoard[i+3*dx][j+3*dy][k+3*dz]) {

										return gameBoard[i][j][k];
									}

						}
	return 0;
}

function startGame(type) {
	game_status = 'in progress';
	gameBoard = boardInit();
	players = ['X','O'];
	turn = 0;
	makeClickable();
	document.getElementsByClassName("board")[0].style.display = "inline-flex";

	if (type == 'single') {
		//make a bot
		bot = newBot('point');
	}
	if (type == 'two') {
		bot = null;
	}
}


// Bot Code //

function getMove() {
	var result = canWin();
	if (result != 0) sendMove(result[0],result[1],result[2]);

	var highScore = -1;
	var bestMove = [0,0,0];

	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++)
			for(var k=0;k<4;k++) {
				if (!validMove(i,j,k)) continue;
				
				score = getScore(i,j,k);
				if (score < highScore) continue;
				if (score == highScore) 
					if (Math.random() < .5) continue;

				bestMove[0] = i;
				bestMove[1] = j;
				bestMove[2] = k;
			}

	markCell(bestMove[0],bestMove[1],bestMove[2],players[turn]);
	gameBoard[bestMove[0]][bestMove[1]][bestMove[2]] = players[turn];
}

function canWin() {
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++)
			for (var k=0;k<4;k++) {
				if (validMove(i,j,k)) gameBoard[i][j][k] = players[turn];
				else continue;
				
				if (getWinner() != 0) {
					gameBoard[i][j][k] = ' ';
					return [i,j,k];
				}
				else gameBoard[i][j][k] = ' ';
			}
	return 0;
}

// function getScore(x,y,z) {
// 	return 10;
// }

function getScore(x,y,z) {
	var OTHER_POINTS = 10;
	var THIS_POINTS = 10;

	var OTHER;
	var THIS;

	var rowScore = 1;
	var score = 0;

	for(var dx=-1;dx<=1;dx++)
		for(var dy=-1;dy<=1;dy++)
			for(var dz=-1;dz<=1;dz++) {
				if (dx==0 && dy==0 && dz==0) continue;

				rowScore = 1;
				OTHER = false;
				THIS = false;

				for (var i=-4;i<4;i++) {
					if (i==0) continue; // We know this space is blank
					
					if (x+dx*i > 3 || x+dx*i < 0) continue;
					if (y+dy*i > 3 || y+dy*i < 0) continue;
					if (z+dz*i > 3 || z+dz*i < 0) continue;
					
					if (gameBoard[x + i*dx][y + i*dy][z + i*dz] == players[turn]) {
						rowScore *= THIS_POINTS;
						// System.out.println("Me: "+(x+i*dx) +","+(y+i*dx) +","+(z+i*dx));
						THIS = true;
					}
					else if (gameBoard[x + i*dx][y + i*dy][z + i*dz] == players[(turn+1)%2]) {
						rowScore *= OTHER_POINTS;
						// System.out.println("Them: "+(x+i*dx) +","+(y+i*dx) +","+(z+i*dx));
						OTHER = true;
					}
				}
				if (THIS && OTHER) continue; // if it has both, neither of us can win that row
				score += rowScore;
			}
			
	if (x==0||y==0||z==0||x==3||y==3||z==3) score++;
	return score;
}

function newBot(type) {
	if (type == 'point') {
		var pointBot = {
			type:'point',
			getBotMove : function() {
				var result = canWin();
				if (result != 0) return result;

				var highScore = -1;
				var bestMove = [0,0,0];

				for(var i=0;i<4;i++)
					for(var j=0;j<4;j++)
						for(var k=0;k<4;k++) {
							if (!validMove(i,j,k)) continue;
							
							score = getScore(i,j,k);
							if (score < highScore) continue;
							if (score == highScore) 
								if (Math.random() < .5) continue;

							bestMove[0] = i;
							bestMove[1] = j;
							bestMove[2] = k;
							highScore = score;
						}
				return bestMove;
			}
		};
		return pointBot;
	}
    else if (type == 'random') {
		// Make new random bot
		var randoBot = {
			type:'rando',
			getBotMove : function() {
				if (game_status != 'in progress') return 0;
				var i = 0;
				var j = 0;
				var k = 0;

				while(!validMove(i,j,k)) {
					i = Math.floor(Math.random()*4);
					j = Math.floor(Math.random()*4);
					k = Math.floor(Math.random()*4);
				}
				var move = [i,j,k];
				return move;
			}
		};
		return randoBot;
    }
}

/** THE CANVAS ** ALL HAIL THE CANVAS **/


// var loader = new THREE.CubeTextureLoader();
// loader.setPath( 'https://asa-dillahunty.github.io/images/' );
// var textureCube = loader.load( [
// 	'Ghost.png', 'Ghost.png',
// 	'Ghost.png', 'Ghost.png',
// 	'Ghost.png', 'Ghost.png'
// ] );
// var xmaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

var xcubeMaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/x.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/x.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/x.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/x.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/x.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/x.png'), side: THREE.DoubleSide})
];

var ocubeMaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/o.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/o.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/o.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/o.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/o.png'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://asa-dillahunty.github.io/images/o.png'), side: THREE.DoubleSide})
];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// controls = new THREE.OrbitControls(camera,renderer.domElement);

const CUBE_SIZE = 200;

var cubeBoard = [];
for (var i=0;i<4;i++) {
    var cubeSlice = [];
    for (var j=0;j<4;j++) {
        var cubeRow = [];
        for (var k=0;k<4;k++) {
            // make a cube
            var geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 1, 1, 1);
            var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});

            // material = THREE.MeshFaceMaterial(xcubeMaterials);
            // material = xmaterial;
            var cube = new THREE.Mesh(geometry, material);

            // center cube
            cube.position.x -= CUBE_SIZE*1.5;
            cube.position.y -= CUBE_SIZE*1.5;
            cube.position.z -= CUBE_SIZE*1.5;

            cube.position.x += CUBE_SIZE*k;
            cube.position.y += CUBE_SIZE*j;
            cube.position.z += CUBE_SIZE*i;

            scene.add(cube);

            // add to row
            cubeRow.push(cube);
        }
        // add row to slice
        cubeSlice.push(cubeRow);
    }
    cubeBoard.push(cubeSlice);
}

// var geometry = new THREE.BoxGeometry(100, 100, 100, 1, 1, 1);
// var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
// var cube = new THREE.Mesh(geometry, material);
// var geometry2 = new THREE.BoxGeometry(100, 100, 100, 1, 1, 1);
// var material2 = new THREE.MeshBasicMaterial({color: 0x333333, wireframe: true});
// var cube2 = new THREE.Mesh(geometry2, material2);

// cube2.position.y += 100;
// scene.add(cube);
// scene.add(cube2);




// cubeBoard[0][0][0].material = THREE.MeshFaceMaterial(xcubeMaterials);

camera.position.z = 1000;

function render() {
    requestAnimationFrame(render);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    scene.rotation.x += 0.005;
    scene.rotation.y += 0.005;
    renderer.render(scene, camera);
};

render();
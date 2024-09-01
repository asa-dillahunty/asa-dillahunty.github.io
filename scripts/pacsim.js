class Pacman {
	constructor(arcade, x, y, size) {
		this.arcade = arcade;
		this.x = x;
		this.y = y;
		this.food = 100;
		this.mate = 0;
		this.step = Math.floor(Math.random() * 4);
		this.size = size;
		this.open = true;
		this.speed = Math.floor(size/5);
		this.direction = Math.random() * 360;

		// Animation properties
		this.mouthOpenAngle = 0.5 * Math.PI;
		this.mouthCloseAngle = 0;
		this.mouthAngle = this.mouthOpenAngle;
		this.mouthDirection = 1;
	}

	draw(ctx) {
		ctx.beginPath();
	
		const startAngle = this.direction * Math.PI / 180 + this.mouthAngle / 2;
		const endAngle = this.direction * Math.PI / 180 - this.mouthAngle / 2;
	
		// If mouth is fully closed, draw a full circle
		if (this.mouthAngle <= 0.01 * Math.PI) {
			ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
		} else {
			ctx.arc(this.x, this.y, this.size / 2, startAngle, endAngle, false);
			ctx.lineTo(this.x, this.y);
		}
		
		ctx.closePath();
	
		ctx.fillStyle = 'yellow';
		ctx.fill();
	
		this.animateMouth();
	}

	animateMouth() {
		// Open and close the mouth
		if (this.mouthDirection === 1) {
			this.mouthAngle -= 0.1 * Math.PI;
			if (this.mouthAngle <= this.mouthCloseAngle) {
				this.mouthDirection = -1;
			}
		} else {
			this.mouthAngle += 0.1 * Math.PI;
			if (this.mouthAngle >= this.mouthOpenAngle) {
				this.mouthDirection = 1;
			}
		}
	}

	takeStep() {
		if (this.arcade.pacs.length < 8) {
			this.food--;
		} else {
			this.food -= 4;
		}
		// this.food--;
		this.step++;

		if (this.food < 0) {
			this.arcade.toKill.push(this);
			return;
		}
		
		let nearestGhost = this.arcade.nearestGhost(this);
		if (nearestGhost) {
			let distance = this.distance(nearestGhost.x, nearestGhost.y);
			if (distance < this.size && !this.arcade.toKill.includes(nearestGhost)) {
				this.food += 40;
				this.arcade.toKill.push(nearestGhost);
			} else if (distance < this.size*3) {
				this.direction = this.towards(nearestGhost.x, nearestGhost.y);
			}
		}

		let nearestPac = this.arcade.nearestPac(this);
		if (nearestPac && nearestPac !== this) {
			// this.speed = 5;
			let distance = this.distance(nearestPac.x, nearestPac.y);
			if (distance < this.size + 5) {
				this.direction = this.towards(nearestPac.x, nearestPac.y) - 180;
			}
		} else {
			// this.speed = 10;
		}

		if (this.food > 1500) {
			this.food -= 1100;
			let newPacman = new Pacman(this.arcade, this.x, this.y, this.size);
			newPacman.x += Math.cos(this.direction) * this.size;
			newPacman.y += Math.sin(this.direction) * this.size;
			this.arcade.toBirth.push(newPacman);
		}

		this.moveForward();
	}

	moveForward() {
		this.x += Math.cos(this.direction * Math.PI / 180) * this.speed;
		this.y += Math.sin(this.direction * Math.PI / 180) * this.speed;

		// pacman should "bounce" here so we need to reflect his x or y direction
		// Boundary check
		if (this.x < 0) {
			this.x = 0;
			this.direction = (180 - this.direction) % 360;
		}
		else if (this.x > this.arcade.width) {
			this.x = this.arcade.width;
			this.direction = (180 - this.direction) % 360;
		}

		if (this.y < 0) {
			this.y = 0;
			this.direction = (360 - this.direction) % 360;
		}
		else if (this.y > this.arcade.height) {
			this.y = this.arcade.height;
			this.direction = (360 - this.direction) % 360;
		}
	}

	distance(x, y) {
		return Math.hypot(this.x - x, this.y - y);
	}

	towards(x, y) {
		return Math.atan2(y - this.y, x - this.x) * 180 / Math.PI;
	}
}

const Ghost_Colors = ["lightblue", "red", "orange", "pink"];
class Ghost {
	constructor(arcade, x, y, size) {
		this.arcade = arcade;
		this.x = x;
		this.y = y;
		this.mate = Math.floor(Math.random() * 35);
		this.size = size;
		this.speed = size/8;
		this.count = 0;
		this.inked = false;
		this.direction = Math.random() * 360;
		this.color = Ghost_Colors[ Math.floor(Math.random() * Ghost_Colors.length) ]
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
	
		// Draw the main body
		ctx.beginPath();
		ctx.arc(0, 0, this.size / 2, Math.PI, 0, false); // Top half of the ghost
		ctx.lineTo(this.size / 2, this.size / 2);
	
		// Draw the squiggles at the bottom
		const squiggleCount = 5; // Number of squiggles
		const squiggleWidth = this.size / squiggleCount; // Width of each squiggle
		const squiggleHeight = this.size / 8; // Height of each squiggle (adjust as needed)
	
		for (let i = 0; i < squiggleCount; i++) {
			ctx.quadraticCurveTo(
				this.size / 2 - squiggleWidth * (i + 0.5), 
				this.size / 2 + squiggleHeight * ((i % 2 === 0) ? 1 : -1),
				this.size / 2 - squiggleWidth * (i + 1), 
				this.size / 2
			);
		}
	
		ctx.lineTo(-this.size / 2, this.size / 2);
		ctx.closePath();
	
		ctx.fillStyle = this.inked ? "darkblue" : this.color;
		ctx.fill();
	
		// Draw the eyes
		const eyeWidth = this.size / 8;  // Horizontal radius of the eyes
		const eyeHeight = this.size / 5; // Vertical radius of the eyes
		const eyeOffsetX = this.size / 5; // Horizontal offset from the center
		// const eyeOffsetY = this.size / 16; // Vertical offset from the top of the ghost
		const eyeOffsetY = 0; // Vertical offset from the top of the ghost
	
		ctx.fillStyle = 'white'; // Eye color
		ctx.beginPath();
		ctx.ellipse(-eyeOffsetX, -eyeOffsetY, eyeWidth, eyeHeight, 0, 0, 2 * Math.PI); // Left eye
		ctx.ellipse(eyeOffsetX, -eyeOffsetY, eyeWidth, eyeHeight, 0, 0, 2 * Math.PI); // Right eye
		ctx.fill();
	
		ctx.fillStyle = 'black'; // Pupil color
		const pupilSize = eyeWidth / 2; // Radius of the pupils
		ctx.beginPath();
		ctx.ellipse(-eyeOffsetX + pupilSize, -eyeOffsetY, pupilSize, pupilSize, 0, 0, 2 * Math.PI); // Left pupil
		ctx.ellipse(eyeOffsetX  + pupilSize, -eyeOffsetY, pupilSize, pupilSize, 0, 0, 2 * Math.PI); // Right pupil
		ctx.fill();
	
		ctx.restore();
	}

	takeStep() {
		if (this.inked) {
			this.mate += 2;
		} else {
			this.mate++;
		}
		this.count--;

		if (this.mate > 80) {
			let ghosty = new Ghost(this.arcade, this.x, this.y, this.size);
			ghosty.x += Math.cos(this.direction) * this.size;
			ghosty.y += Math.sin(this.direction) * this.size;
			this.arcade.toBirth.push(ghosty);
			this.mate = 0;
		}

		let nearestPac = this.arcade.nearestPac(this);
		if (nearestPac) {
			let distance = this.distance(nearestPac.x, nearestPac.y);
			if (distance < this.size*4) {
				this.direction = this.towards(nearestPac.x, nearestPac.y) + 180;
			}
		}

		let nearestGhost = this.arcade.nearestGhost(this);
		if (nearestGhost && nearestGhost !== this) {
			let distance = this.distance(nearestGhost.x, nearestGhost.y);
			if (distance < this.size) {
				this.direction = this.towards(nearestGhost.x, nearestGhost.y) + 180;
			}
		} else if (!this.inked) {
			this.inkself();
		}

		if (this.count === 0) {
			this.unInk();
		}

		this.moveForward();
	}

	moveForward() {
		this.x += Math.cos(this.direction * Math.PI / 180) * this.speed;
		this.y += Math.sin(this.direction * Math.PI / 180) * this.speed;

		// Boundary check
		if (this.x < 0) {
			this.x = 0;
			this.direction = (180 - this.direction) % 360;
		}
		else if (this.x > this.arcade.width) {
			this.x = this.arcade.width;
			this.direction = (180 - this.direction) % 360;
		}

		if (this.y < 0) {
			this.y = 0;
			this.direction = (360 - this.direction) % 360;
		}
		else if (this.y > this.arcade.height) {
			this.y = this.arcade.height;
			this.direction = (360 - this.direction) % 360;
		}
	}

	distance(x, y) {
		return Math.hypot(this.x - x, this.y - y);
	}

	towards(x, y) {
		return Math.atan2(y - this.y, x - this.x) * 180 / Math.PI;
	}

	inkself() {
		this.inked = true;
		this.count = 100;
	}

	unInk() {
		this.inked = false;
	}
}

class Arcade {
	constructor(canvasWidth, canvasHeight) {
		this.ghosts = [];
		this.pacs = [];
		this.toKill = [];
		this.toBirth = [];
		this.width = canvasWidth;
		this.height = canvasHeight;
	}

	nearestPac(thingy) {
		let nearest = null;
		let minDistance = Infinity;

		this.pacs.forEach(pac => {
			if (pac !== thingy) {
				let dist = thingy.distance(pac.x, pac.y);
				if (dist < minDistance) {
					minDistance = dist;
					nearest = pac;
				}
			}
		});

		return nearest;
	}

	nearestGhost(thingy) {
		let nearest = null;
		let minDistance = Infinity;

		this.ghosts.forEach(ghost => {
			if (ghost !== thingy && !ghost.inked) {
				let dist = thingy.distance(ghost.x, ghost.y);
				if (dist < minDistance) {
					minDistance = dist;
					nearest = ghost;
				}
			}
		});

		return nearest;
	}

	addGhost(ghost) {
		this.ghosts.push(ghost);
	}

	addPacman(pac) {
		this.pacs.push(pac);
	}

	run(ctx) {
		this.pacs.forEach(pac => pac.takeStep());
		this.ghosts.forEach(ghost => ghost.takeStep());

		this.pacs.forEach(pac => pac.draw(ctx));
		this.ghosts.forEach(ghost => ghost.draw(ctx));

		this.handleBirthsAndDeaths();
	}

	handleBirthsAndDeaths() {
		this.toKill.forEach(entity => {
			if (entity instanceof Pacman) {
				this.pacs = this.pacs.filter(p => p !== entity);
			} else if (entity instanceof Ghost) {
				this.ghosts = this.ghosts.filter(g => g !== entity);
			}
		});

		this.toBirth.forEach(entity => {
			if (entity instanceof Pacman) {
				this.addPacman(entity);
			} else if (entity instanceof Ghost) {
				this.addGhost(entity);
			}
		});

		this.toKill = [];
		this.toBirth = [];
	}
}

// Initialize canvas and arcade
function initSim() {
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	const spriteSize = Math.sqrt((canvas.width * canvas.height)/400);

	clearInterval(currentInterval);
	arcade = new Arcade(canvas.width, canvas.height);

	// Add initial entities
	for (let i = 0; i < 8; i++) {
		arcade.addPacman(new Pacman(arcade, Math.random() * canvas.width, Math.random() * canvas.height, spriteSize));
	}
	for (let i = 0; i < 100; i++) {
		arcade.addGhost(new Ghost(arcade, Math.random() * canvas.width, Math.random() * canvas.height, spriteSize));
	}
	// Start with the initial frame rate
	startGameLoop(30);
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	arcade.run(ctx);
	if (arcade.pacs.length < 1 || arcade.ghosts.length < 1) {
		clearInterval(currentInterval);
	}
}

function startGameLoop(fps) {
	if (currentInterval) clearInterval(currentInterval);
	const interval = 1000 / fps;
	currentInterval = setInterval(gameLoop, interval);
}

function startSim() {
	initSim();
	simWrapper.style.opacity = 1;
	simWrapper.style.zIndex = 1;
}

function stopSim() {
	clearInterval(currentInterval);
	simWrapper.style.opacity = 0;
	simWrapper.style.zIndex = 0;
}

const simWrapper = document.getElementById("sim-wrapper");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let arcade = new Arcade(canvas.width, canvas.height);

let currentInterval;


const canvas = document.getElementById("GhostCanvas");
const context = canvas.getContext('2d');

function newSprite(imageWidth, imageHeight, imageURL, frameArray) {
	var sprite = {
		imgW: imageWidth,
		imgH: imageHeight,
		img: new Image(),
		frameCount: 0,
		frameIndex: 0,
		frameArr: frameArray,
		draw: function() {
			context.drawImage(this.img,this.imgW*(this.frameArr[this.frameIndex]),0,this.imgW,this.imgH,0,0,canvas.width,canvas.height)
			this.frameIndex = (this.frameIndex + 1) % this.frameArr.length;
		}
	}

	sprite.img.src = imageURL;
	return sprite;
}

const Ghost = newSprite(38,39,"./images/confusedGhost.png",[0,1])

context.imageSmoothingEnabled = false;

const fps = 2;
const fCount = Math.floor(60/fps);
const scale=1

var frameCount=fCount; // draws on first render
function renderCanvas() {
	frameCount++;
	if (frameCount < fCount) {
		// skips the drawing for this frame
		requestAnimationFrame(renderCanvas);
		return;
	}
	else frameCount = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);
	// context.fillStyle = "#999999";
	// context.fillRect(0,0,canvas.width,canvas.height);

	

	Ghost.draw()
	requestAnimationFrame(renderCanvas);
}

requestAnimationFrame(renderCanvas);
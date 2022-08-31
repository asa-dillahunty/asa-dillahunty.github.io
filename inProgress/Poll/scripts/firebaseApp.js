const emojis = {
	people:['😃','😅','😎','🤡','🚼'],
	things:['🎓','🎮','🎧','🌶','🗑'],
	animals:['🐛','🦞','🦥','🐣','🦔'],
}
const defaultEmoji = "👋";
let choice=null;

function populateEmojiDemo() {
	let rent = document.getElementById("emoji-demo");

	rent.insertAdjacentHTML("beforeend","<p>people</p>")
	emojis.people.forEach( (emoji) => {
		rent.insertAdjacentHTML('beforeend',`${emoji}`);
	});
	rent.insertAdjacentHTML("beforeend","<p>things</p>")
	emojis.things.forEach( (emoji) => {
		rent.insertAdjacentHTML('beforeend',`${emoji}`);
	});
	rent.insertAdjacentHTML("beforeend","<p>animals</p>")
	emojis.animals.forEach( (emoji) => {
		rent.insertAdjacentHTML('beforeend',`${emoji}`);
	});
}

populateEmojiDock();
function populateEmojiDock() {
	updateChoice(null);

	let dock = document.getElementById("emoji-dock");
	clearElem(dock);

	// people
	// things
	// animals
	let index = 0;
	for (listID in emojis) {
		let temp = pickRandom(emojis[listID]);
		dock.insertAdjacentHTML('beforeend', 
			`<button class="emoji-select" onclick="updateChoice(${index})">
				<span class="emoji-span${index}">${temp}</span>
				<span class="emoji-span-invisible">${temp}</span>
			</button>`);
		index++;
	}
}

function updateChoice(num) {
	const emojiSelect = document.getElementsByClassName("emoji-select");
	if (choice !== null) emojiSelect[choice].classList.remove("selected");

	if (choice === num) num = null;

	choice = num;
	if (num === null) return; // if left as if (!num), num=0 satisfies that condition

	// do sum bout it
	emojiSelect[num].classList.add("selected");
}

function pickRandom(array) {
	return array[Math.floor(Math.random()*array.length)];
}

function signIn() {
	let name = document.getElementById("sign-in-name").value;
	if (name == '') return;
	else {
		document.getElementById('sign-in').disabled = true; // disable the button
		sendData({
			name:name,
			emoji: choice === null ? defaultEmoji : 
				document.getElementsByClassName("emoji-select")[choice].firstElementChild.textContent, // I'm using an invisible one to make the bubble the correct size, must remove it
		});
	}
}

function sendData(userData) {
	db.collection('users').add(userData)
	// db.collection('users').doc("mark").set({mark:0,apple:3})
		.then((docRef) => {
			console.log("updated: ", docRef.id);
		})
		.catch((error) => {
			alert("Something happened :/\n Could not sign in");
		})
}

function clearElem(elem) {
	while (elem.hasChildNodes())
		elem.removeChild(elem.firstChild);
}

function pullUsers() {
	var usersRef = db.collection("users");
	var temp = document.getElementById("signed-in");
	clearElem(temp);

	usersRef.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			// console.log(doc.id, " => ", doc.data());
			let newP = document.createElement("p");
			let newContent = document.createTextNode(`${doc.data().name} ${doc.data().emoji}`);
			newP.appendChild(newContent);
			temp.insertAdjacentElement("beforeend",newP);
		});
	});
}
const emojis = {
	people:['😃','😅','😎','🤡','🚼'],
	things:['🎓','🎮','🎧','🌶','🗑'],
	animals:['🐛','🦞','🦥','🐣','🦔'],
}

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

function sendData(userData) {
	db.collection('users').add(userData)
	// db.collection('users').doc("mark").set({mark:0,apple:3})
		.then((docRef) => {
			console.log("updated: ", docRef.id);
		})
		.catch((error) => {
			alert("Something happened :/\n Could not add your top");
		})
}
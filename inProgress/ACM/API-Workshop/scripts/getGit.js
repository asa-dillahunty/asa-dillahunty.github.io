let currUserData = null;
let currRepoData = null;

// logData(example_data["repos_url"]);
// logData("https://api.github.com/repos/asa-dillahunty/asa-dillahunty.github.io/contributors");

document.getElementById("github-search").addEventListener("click", () => {
	let val = document.getElementById("github-username").value;
	console.log(val);
	// setUserData(example_data, example_data2);
	getUserRepos(val);
});


function logData(url) {
	console.log(url);
	
	var request = new XMLHttpRequest();
	request.open('get', url);
	request.onreadystatechange = () => {
		if (request.readyState == 4)
			console.log(request.response);

		console.log(request.readyState);
	}
	request.send();
}

function getUserRepos(username) {
	var request = new XMLHttpRequest();
	request.open('get',`https://api.github.com/users/${username}`);
	request.onreadystatechange = () => {
		if (request.readyState === 4) {
			if (request.status === 404) {
				console.log('not found');
				setUserData(null,null);
			}
			else {
				currUserData = JSON.parse(request.response);
				getUserRepos2(currUserData.repos_url);
			}
		}

		// console.log(request.readyState);
	}
	request.send();
}

function getUserRepos2(url) {
	var request = new XMLHttpRequest();
	request.open('get', url);
	request.onreadystatechange = () => {
		if (request.readyState === 4) {
			if (request.status === 404) {
				console.log('not found');
				setUserData(null,null);
			}
			else {
				currRepoData = JSON.parse(request.response);

				// userdata needs to be an object, repo data needs to be an array
				setUserData(currUserData,currRepoData);
			}
		}

		// console.log(request.readyState);
	}
	request.send();
}

function getGitData() {
	var request = new XMLHttpRequest();
	request.open('get','https://api.github.com/users/asa-dillahunty');
	request.onreadystatechange = () => {
		if (request.readyState == 4)
			console.log(request.response);

		console.log(request.readyState);
	}
	request.send();
}


function setUserData(userData, repoData) {
	if (!userData) {
		userData = {
			name:"User's Name",
			login:"username",
			avatar_url:"assets/person.png",
		};
		repoData = [];
	}
	// name
	// html_url
	// login (username)
	// bio (if has)
	// avatar_url
	document.getElementById("user's-name").textContent = userData["name"];
	document.getElementById("username").textContent = userData['login'];
	document.getElementById("user-pfp").src = userData["avatar_url"];

	// remove past repos
	let repoParent = document.getElementById("repo-field");
	while (repoParent.hasChildNodes()) {
		repoParent.removeChild(repoParent.firstChild);
	}

	// add current repos
	// name
	// html_url
	// description
	// language
	// forks
	// stargazers_count
	// some repos will have social previews (how get?)
	repoData.forEach( (elem) => {

		// if (elem.fork) return;

		repoParent.insertAdjacentHTML('beforeend', 
			`<div class="repo">
				<div class="repo-top-info">
					<p class="repo-title">${elem['name']}</p>
					<div class="repo-tags">
						<div class="repo-tag">
							${ elem["forks_count"] ? elem['forks_count'] : 0}
							<i class="fas fa-code-branch"></i>
						</div>
						<div class="repo-tag">
							${ elem["stargazers_count"] ? elem['stargazers_count'] : 0}
							<i class="fas fa-star"></i>
						</div>
					</div>
				</div>
				<p class="repo-description">${elem["description"] ? elem["description"] : "" }
			</div>`
		);
		
		console.log(elem['name']);
		console.log(elem['html_url']);
	});
}
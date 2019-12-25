function showLogin(lableId) {

	var data = document.getElementById(lableId);
	var loginId;

	if (data.innerHTML.includes("\u{02227}")) { // up arrow
		data.innerHTML = data.innerHTML.replace("\u{02227}", "\u{02228}");
		loginId = lableId + "Login";

		data = document.getElementById(loginId);
		data.innerHTML = "";
	}
	else { // down arrow
		data.innerHTML = data.innerHTML.replace("\u{02228}", "\u{02227}");
		loginId = lableId + "Login";

		var input = "<form action=\"myPhp\"> <label for=\"username\">Username:</label></br> <input type=\"text\" name=\"username\" id=\"username\" placeholder=\"jonnyappleseed\"></br> <label for=\"password\">Password:</label></br> <input type=\"password\" name=\"password\" id=\"password\"></br> <input type=\"submit\" id=\"submit\"> </form>";
		data = document.getElementById(loginId);
		data.innerHTML = input;
	}

	// this removes all other submit sections
	var ids = ['member','serviceProvider','manager'];
	for (var i=0;i<ids.length;i++) {
		if (lableId == ids[i]) continue;
		else {
			data = document.getElementById(ids[i]);
			data.innerHTML = data.innerHTML.replace("\u{02227}", "\u{02228}");
			loginId = ids[i] + "Login";

			data = document.getElementById(loginId);
			data.innerHTML = "";
		}
	}
}
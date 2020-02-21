function postQuestion() {
	var x = document.getElementById("questionForm");
	var arry = ['','',''];
	var j = 0;
	var i;
	console.log("husH");
	for (i = 0; i < x.length ;i++) {
		if (x.elements[i].value) {
			arry[j] = x.elements[i].value;
			j++;
			if (j>2) break;
		}
	}

	post(arry[0],arry[1],arry[2]);
}

function post(username, subject_line, full_text) {

	var data = document.getElementById('forumPosts');
	var html = document.documentElement.innerHTML;

	//perform the replacements to prevent html injections
	// username.replace('\\','\\\\');
	// username.replace('<','\\<');
	// username.replace('>','\\>');

	// subject_line.replace('\\','\\\\');
	// subject_line.replace('<','\\<');
	// subject_line.replace('>','\\>');

	// full_text.replace('\\','\\\\');
	// full_text.replace('<','\\<');
	// full_text.replace('>','\\>');

	var newData = "<div id='756879' class='postContainer'>";
	
	newData += '<h3 class=\'username\'>'+username+'</h3>';
	newData += '<h3 class=\'subjectLine\'>'+subject_line+'</h3>';
	newData += '<p class=\'qText\'>'+full_text+'</p>';

	newData += '</div>';

	data.innerHTML += newData;

	console.log(newData);

	// html.replace(data.innerHTML, newData);
	// // console.log(html);

	// document.open("text/html","replace");
	// document.write(html);
	// document.close();
}
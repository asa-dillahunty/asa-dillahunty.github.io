console.log('Hello World!');

function populateDates() {
	var selectMonth = document.getElementsByName("Month")[0];
	console.log(selectMonth);
	console.log(selectMonth.selectedIndex);
	var selectedMonth = selectMonth.options[selectMonth.selectedIndex].value;
	console.log(selectedMonth);

	// build URLs
	var possibleUrl;
	for (var i=1;i<32;i++) {
		possibleUrl='file:///C:/Users/Asa/Documents/GitHub/asa-dillahunty.github.io/inProgress/ACM/a';
		// forces numbers to be two digits
		// possibleUrl+=("0" + (selectMonth.selectedIndex+1)).slice(-2);
		// possibleUrl+='-';
		// possibleUrl+=("0" + i).slice(-2);
		// possibleUrl+='/';
		// console.log(possibleUrl);

		var checker = new XMLHttpRequest();
		checker.open('get', possibleUrl, true);
		checker.onreadystatechange = function() {
			// console.log('here');
			if (checker.readyState === XMLHttpRequest.DONE) {
				if (checker.status == 0 || (checker.status >= 200 && checker.status < 400)) {
					// alert('page exists');
					
					console.log('Page text: '+checker.responseText);
					console.log(checker);
				}
			}
		};
		checker.send();
		break;
	}
}

function addDate(date) {
	console.log("Adding date: "+date);
}
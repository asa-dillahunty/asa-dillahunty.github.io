// var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Trvvx_8lFaVHNWYulPRGw7MgfXynrDGq56Yjj2MpPQQ/edit?usp=sharing';

// Tabletop.init( { key: publicSpreadsheetUrl,
// callback: formatData,
// simpleSheet: true } )

// function formatData(data, tabletop) {
// 	if (data == null) {
// 		var retry = "Sorry, something went wrong.<br/>";
// 		var da = document.getElementById("data");
// 		da.innerHTML = retry;
// 		return;
// 	}
// 	else {
// 		console.log(data);
// 	}
// }

var MONTH_DEFAULT;
var DATE_DEFAULT;
var date_data;

setUp();

function setUp() {

	var thing = document.getElementById('Date-Selection-Page');
	// this prevents the setup script from running on pages it does not need to be run on
	if (thing == null) return;

	MONTH_DEFAULT = "- MONTH -";
	DATE_DEFAULT = "- DATE -";

	// this needs to be imported from somewhere
	date_data = {};

	date_data[MONTH_DEFAULT] = [];
	date_data["January"] = [ 1, 10, 14, 22, 24, 27, 29, 30, 31 ];
	date_data["February"] = [ 2 ];

	populateMonths();
	populateDates(); // populateDates now calls linkButton
}

function populateMonths() {
	// get the month select element
	var selectMonth = document.getElementsByName("Month_Select")[0];
	
	// clear months and get ready for the data
	selectMonth.innerHTML = "";

	// adds every key from the object to the option list, in this case months
	Object.keys(date_data).forEach(value => addOption(value,selectMonth));
}

function populateDates() {
	// get the select elements
	var selectMonth = document.getElementsByName("Month_Select")[0];
	var selectDate = document.getElementsByName("Date_Select")[0];
	
	// get chosen month
	var month_value = selectMonth.options[selectMonth.selectedIndex].text;
	
	// clear old date options
	selectDate.innerHTML = `<option value='${DATE_DEFAULT}'>${DATE_DEFAULT}</option>`;
	
	// populate the dates
	date_data[month_value].forEach(value => addOption(value,selectDate));

	linkButton();
}

// Adds an option element with the specified option to the document element
function addOption(option, doc_element) {
	doc_element.innerHTML += `<option value='${option}'>${option}</option>`;
}

function linkButton() {
	// get select elements
	var selectMonth = document.getElementsByName("Month_Select")[0];
	var selectDate = document.getElementsByName("Date_Select")[0];

	// get selected values
	var month_value = selectMonth.options[selectMonth.selectedIndex].text;
	var date_value = selectDate.options[selectDate.selectedIndex].text;
	
	// get button element
	var button = document.getElementById("go_to_page");
	
	// build and link url
	var newUrl = ('0' + (selectMonth.selectedIndex)).slice(-2) +'-'+ ('0'+date_value).slice(-2);
	button.href = newUrl;

	
	// this makes the anchor tag unclickable when there is an invalid date
	if (month_value == MONTH_DEFAULT || date_value == DATE_DEFAULT) {
		button.onclick = function(event) {
			// prevents the going to other page
			event.preventDefault();

			//alerts the user their date is invalid
			alert("Invalid Date");
		};
	}
	else {
		// undoes the above
		button.onclick = '';
	}
}

/**
 * Currently this function is weighted so that months are equal, meaning
 * for months that have fewer dates, their dates get chosen more frequently.
 */
function randomDate() {
	// get random month
	var keys = Object.keys(date_data);
	//keys.length -1 paired with the +1 to Math.floor() removes the MONTH option
	var randomKeyIndex = Math.floor(Math.random()* (keys.length-1) ) +1;
	var randomKey = keys[randomKeyIndex];

	// get random date
	var randomDateIndex = Math.floor(Math.random()*date_data[randomKey].length);
	var randomDate = date_data[randomKey][randomDateIndex];

	// create new url
	var newUrl = ('0' + (randomKeyIndex)).slice(-2) +'-'+ ('0'+randomDate).slice(-2);

	// get select elements
	var selectMonth = document.getElementsByName("Month_Select")[0];
	var selectDate = document.getElementsByName("Date_Select")[0];

	// set their selected index
	selectMonth.selectedIndex = randomKeyIndex;
	populateDates(); // update date options
	selectDate.selectedIndex = randomDateIndex+1; // +1 to account for DATE
	linkButton();
}

function fullyRandomDate() {
	// get select elements
	var selectMonth = document.getElementsByName("Month_Select")[0];
	var selectDate = document.getElementsByName("Date_Select")[0];

	// count all options
	var keys = Object.keys(date_data);
	var total_dates = 0;

	var i,j;
	for (i=0;i<keys.length;i++)
		total_dates += date_data[keys[i]].length;

	// choses a random date from all options
	var randomDateIndex = Math.floor(Math.random()*total_dates);
	
	for (i=0;i<keys.length;i++) {
		for (j=0;j<date_data[keys[i]].length && randomDateIndex > 0;j++,randomDateIndex--);
		
		// handles edge cases when the date is the first of the month
		if (j == date_data[keys[i]].length && randomDateIndex == 0) {
			j=0,i++;
		}
		if (randomDateIndex < 1) {
			selectMonth.selectedIndex = i;
			populateDates(); // update date options
			selectDate.selectedIndex = j+1; // +1 to account for DATE
			linkButton();
			// go to random link
			// window.location.href = newUrl;
			return;
		}
	}
}
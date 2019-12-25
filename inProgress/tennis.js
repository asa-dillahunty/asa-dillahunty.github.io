var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Trvvx_8lFaVHNWYulPRGw7MgfXynrDGq56Yjj2MpPQQ/edit?usp=sharing';

	function displayRanks() {
		Tabletop.init( { key: publicSpreadsheetUrl,
		callback: showInfo,
		simpleSheet: true } )
    }
    
    function addBall(elemId) {
        var da = document.getElementById(elemId);
		da.innerHTML = da.innerHTML + " \u{1F3BE}";
    }

	/*
	function showInfo(data, tabletop) {
		//alert('Successfully processed!')
		//console.log(data);

		var dataTable = "";

		dataTable += "<table>"

		dataTable += "<tr><th>Ranking</th><th>Male Travel Team</th><th>Female Travel Team</th></tr>";

		for (var i=0;i<data.length;i++) {
			dataTable += "<tr>";
			
			dataTable += "<td>"+data[i].Ranking+"</td>";
			//console.log(data[i].Ranking);

			dataTable += "<td>"+data[i]['Dude Travel Team']+"</td>";
			//console.log(data[i]['Dude Travel Team']);

			dataTable += "<td>"+data[i]['Chick Travel Team']+"</td>";
			//console.log(data[i]['Chick Travel Team']);

			dataTable += "</tr>";
		}

		dataTable += "</table>"

		var da = document.getElementById("data");
		da.innerHTML = dataTable;
		da.style.color = 'green';
	}
	*/

	function hideRanks() {
		var retry = "<button type=\"button\" id=\"ViewRank\" onclick=\"displayRanks()\">View Travel Team Rankings</button> <button type=\"button\" id=\"addball\" onclick=\"addBall('banner')\">Add Ball</button>";
		var da = document.getElementById("data");
		da.innerHTML = retry;
	}

	function showInfo(data, tabletop) {
		if (data == null) {
			var retry = "Sorry, something went wrong.<br/>";
			retry += "<button type=\"button\" id=\"ViewRank\" onclick=\"displayRanks()\">View Travel Team Rankings</button> <button type=\"button\" id=\"addball\" onclick=\"addBall('banner')\">Add Ball</button>";
			var da = document.getElementById("data");
			da.innerHTML = retry;
			return;
		}
		//alert('Successfully processed!')
		//console.log(data);
		//<button type="button" id="ViewRank" onclick="displayRanks()">View Travel Team Rankings</button>

		var maleTable = "";
		var femaleTable = "";
		
		maleTable += "<table>";
		femaleTable += "<table>";
				
		maleTable += "<tr><th colspan=\"2\">Men's Rankings</th></tr>";
		femaleTable += "<tr><th colspan=\"2\">Women's Rankings</th></tr>";
		// tables can have captions??? Yes??

		for (var i=0;i<data.length;i++) {
            if (data[i]['Dude Travel Team']) {
                maleTable += "<tr>";
                maleTable += "<td>"+data[i]['Ranking']+"</td>";
                maleTable += "<td>"+data[i]['Dude Travel Team']+"</td>";
                maleTable += "</tr>";
            }

            if (data[i]['Chick Travel Team']) {
                femaleTable += "<tr>";
                femaleTable += "<td>"+data[i]['Ranking']+"</td>";
                femaleTable += "<td>"+data[i]['Chick Travel Team']+"</td>";
                femaleTable += "</tr>";
            }
		}

		maleTable += "</table>"
		femaleTable += "</table>"
		
		var da = document.getElementById("data");
		var injection = "<div id=\"RankTables\">" + maleTable + femaleTable +"</div>";
		injection += "<button type=\"button\" id=\"HideRank\" onclick=\"hideRanks()\">Hide Travel Team Rankings</button> <button type=\"button\" id=\"addball\" onclick=\"addBall('banner')\">Add Ball</button>"
		da.innerHTML = injection;
	}
	
	// window.addEventListener('DOMContentLoaded', init)
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Trvvx_8lFaVHNWYulPRGw7MgfXynrDGq56Yjj2MpPQQ/edit?usp=sharing';

function init() {
    Tabletop.init( { key: publicSpreadsheetUrl,
                     callback: showInfo,
                     simpleSheet: true } )
  }

  function showInfo(data, tabletop) {
    alert('Successfully processed!')
    console.log(data);
  }

  //window.addEventListener('DOMContentLoaded', init)

	/*function showInfo(data, tabletop) {
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
	}*/
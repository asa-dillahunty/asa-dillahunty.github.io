// fetch('file.txt')
// 	.then(response => response.text())
// 	.then(text => console.log(text))

setUp();

function setUp() {
	let skis = document.querySelectorAll('span.ASCII');

	updateAscii("https://asa-dillahunty.github.io/textFiles/NotreDame.txt", skis[0]);
	updateAscii("https://asa-dillahunty.github.io/textFiles/Monalisa.txt", skis[1]);
}

function updateAscii(fileLocation, htmlLocation) {
	var txtFile = new XMLHttpRequest();  
	txtFile.open("GET", fileLocation, true);  
	txtFile.onreadystatechange = function() {  
		if (txtFile.readyState === 4) {  
			// Makes sure the document is ready to parse.  
			if (txtFile.status === 200) {  
				// Makes sure it's found the file.  
				htmlLocation.insertAdjacentHTML('beforeend',txtFile.responseText)
				// htmlLocatoin.innerHTML = txtFile.responseText;
			}
		}
	}
	txtFile.send(null);
}
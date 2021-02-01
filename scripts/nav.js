const contactInfo = 
`<div id="contact-modal">
	<div class="modal-bg"></div>

	<div class="modal-card GitHub" onclick="window.location='https://github.com/asa-dillahunty'">
		<a href="https://github.com/asa-dillahunty">
			<img src="https://simpleicons.org/icons/github.svg" alt="GitHub"/>
		</a>
		<p>Check out my work on GitHub!</p>
	</div>

	<div class="modal-card LinkedIn" onclick="window.location='https://www.linkedin.com/in/asa-dillahunty'">
		<a href="https://www.linkedin.com/in/asa-dillahunty">
			<img src="https://simpleicons.org/icons/linkedin.svg" alt="LinkedIn"/>
		</a>
		<p>Check out my LinkedIn!</p>
	</div>

	<div class="modal-card Email" onclick="copyToClipboard('asdillahunty@crimson.ua.edu');">
		<a href="mailto:asdillahunty@crimson.ua.edu" target="_blank">
			<img src="https://simpleicons.org/icons/gmail.svg" alt="E-mail"></svg></a>
		<p>Shoot me an email at <span id="email-address">asdillahunty@crimson.ua.edu</span>!</p>
	</div>

	<div class="modal-card close">
		Close <span>+</span>
	</div>
</div>
<div id="notification">Copied to clipboard</div>
`;
setUp();

function setUp() {
	// console.log(document.body.innerHTML);
	// document.getElementById("full-body").innerHTML+= contactInfo;
	document.body.insertAdjacentHTML('afterend', contactInfo);
	// console.log(document.body.innerHTML);
	var modal_id = "contact-modal";
	var nav = document.getElementsByTagName("nav")[0];
	document.getElementsByClassName("modal-bg")[0].setAttribute("onClick",`closeModal("${modal_id}");`);

	nav.children[0].children[3].onclick = function(event) {
		event.preventDefault();
		openModal(modal_id);
	}

	var modal = document.getElementById(modal_id);
	var close_card = modal.getElementsByClassName("close")[0];
	// var moduleBG = document.getElementById(modal_id);
	close_card.setAttribute("onClick",`closeModal("${modal_id}");`);
}

function openModal(modal_id) {
	var moduleBG = document.getElementById(modal_id);
	moduleBG.style.display = "flex";
}

function closeModal(modal_id) {
	var moduleBG = document.getElementById(modal_id);
	moduleBG.style.display = "none";
}

function copyToClipboard(copiedText) {
	navigator.clipboard.writeText(copiedText).then(function() {
		// success
		notify("Copied to clipboard");
	}, function() {
		// failure
		document.getElementById("email-address");
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	});
}

function notify(notification) {
	var note = document.getElementById("notification");
	note.className="";
	note.innerText=notification;

	// I don't know what this does but it fixed it
	// Someone said it doesn't work in strict mode but idk what that is so idc
	void note.offsetWidth;

	note.className="fade-out";
}
var contactInfo = 
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

	<div class="modal-card Email">
		<a href="mailto:asdillahunty@crimson.ua.edu" target="_blank">
			<img src="https://simpleicons.org/icons/gmail.svg" alt="E-mail"></svg></a>
		<p>Shoot me an email at asdillahunty@crimson.ua.edu!</p>
	</div>

	<div class="modal-card close">
		Close <span>+</span>
	</div>
</div>`;
setUp();

function setUp() {
	document.body.innerHTML += contactInfo;

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
	disableScroll();
}

function closeModal(modal_id) {
	var moduleBG = document.getElementById(modal_id);
	moduleBG.style.display = "none";
	enableScroll();
}

/**
 * This code (disable and enable scroll) was copy and pasted
 * from geeksforgeeks.org 9/15/2020
 */
function disableScroll() { 
    // Get the current page scroll position 
    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
  
        // if any scroll is attempted, set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
} 
  
function enableScroll() { 
    window.onscroll = function() {}; 
} 
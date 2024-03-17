// Get all input fields
const inputs = document.querySelectorAll('.letter-input');

// Add input event listener to each input field
inputs.forEach((input, index) => {
	
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Backspace' && input.value === '') {
			if (index > 0) {
				inputs[index - 1].focus();
			}
			else { // index === 0
				inputs[inputs.length - 1].focus();
			}
			displaySelectSolve();
		}
	});

	input.addEventListener("focus", () => {
		input.select();
	});

	input.addEventListener('input', (e) => {
		// If the input value is not empty and the next input field exists, focus on it
		const inputValue = e.target.value;
		const lastChar = inputValue[inputValue.length - 1];
		if (!/^[a-zA-Z]*$/.test(lastChar)) {
			e.target.value = ''; // Clear the input value if it's not a letter
		}
		else {
			// force lowercase letters
			if (input.value = input.value.toLowerCase());

			if (input.value !== '') input.classList.remove("isEmpty");
			else input.classList.add('isEmpty');

			if (index === inputs.length - 1) {
				inputs[0].focus();
			}
			if (input.value && inputs[index + 1]) {
				inputs[index + 1].focus();
			}
		}
		displaySelectSolve();
	});
});
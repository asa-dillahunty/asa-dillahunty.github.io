var input = document.getElementById("message");
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById("sendMessage").click();
    }
  });

function sendMessage() {
    var msg = document.getElementById('message').value;
    document.getElementById("perm").innerHTML += "<div class=letter type=home><p class='home'>" + msg + "</p><div>";
    document.getElementById('message').value = '';
    //need to find how to scroll to bottom of #perm when clicked
}
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

    //parse the entered numbers
    var list = msg.split(",");
    var slice = parseInt(list[0]) - 1;
    var col = parseInt(list[1]) - 1;
    var row = parseInt(list[2]) - 1;

    // console.log(slice+" "+col+" "+row);
    
    //mark the place
    var slices = document.getElementsByClassName("slice");

    var new_list = slices[slice].getElementsByClassName("row"+row);
    var children = new_list[0].children;

    console.log(children.innerHTML);

    //children[col].innerHTML="X";
    //children[col].classList += "X";

    markCell(slice,row,col,"X");

}

function markCell(i,j,k,mark) {
//don't have a tab on mobile ¯\_(ツ)_/¯

var cell = document.getElementsByClassName("slice")[i].children[j].children[k];
cell.innerHTML = mark;
cell.classList += mark;

}

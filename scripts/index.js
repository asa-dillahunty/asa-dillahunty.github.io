// var input = document.getElementById("message");
// input.addEventListener("keyup", function(event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.keyCode === 13) {
//       // Trigger the button element with a click
//       document.getElementById("sendMessage").click();
//     }
//   });

var count = 1;
var passage = 0;
var konami = 0;

document.body.addEventListener('keyup', function(event) {
    if (event.keyCode === 38) { // up
        if (konami == 0 || konami == 1) konami++;
        else konami = 0;
    }
    else if (event.keyCode === 40) { // down
        if (konami == 2 || konami == 3) konami++;
        else konami = 0;
    }
    else if (event.keyCode === 37) { // left
        if (konami == 4 || konami == 6) konami++;
        else konami = 0;
    }
    else if (event.keyCode === 39) { // right
        if (konami == 5 || konami == 7) konami++;
        else konami = 0;
    }
    else if (event.keyCode === 66) { // b
        if (konami == 8) konami++;
        else konami = 0;
    }
    else if (event.keyCode === 65) { // a
        if (konami == 9) konami++;
        else konami = 0;
    }
    else if (event.keyCode === 13) { // enter (start)
        if (konami == 10) {
            if (count == 1) static();
            else normalize();
            count = (count+1)%2
        }
        konami = 0;
    }
    else konami = 0;

    // if (event.keyCode === 68) { // d
    //     if (passage == 0) passage++;
    //     else passage = 0;
    // }
    // else if (event.keyCode === 83) { // s
    //     if (passage == 1) passage++;
    //     else passage = 0;
    // }
    // else if (event.keyCode === 65) { // a
    //     if (passage == 2) passage++;
    //     else passage = 0;
    // }
    // else if(event.keyCode === 13) { // enter
    //     if (passage == 3) {
    //         if (count == 1) static();
    //         else normalize();
    //         count = (count+1)%2
    //     }
    //     passage = 0;
    // }
    // else passage = 0;
});

function change() {
    if (img == "images/aceTreeW.png") normalize();
    else static();
}

function static() {
    var img = document.getElementById("cover");
    img.src = 'images/aceTreeW.png';
    img.style = 'filter:invert(100%);';

    var title = document.getElementById("titleName");
    title.className = 'moveMe';

    var wrap = document.getElementById("wrapper");
    wrap.style = 'filter:invert(100%);';

    document.body.style = "background-color: black;background-image: url(images/static2.png);background: linear-gradient( rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.66) ), url('images/static2.png');";
}

function normalize() {
    var img = document.getElementById("cover");
    img.src = 'images/stantontree.JPG';
    img.style = '';

    var title = document.getElementById("titleName");
    title.className = '';

    var wrap = document.getElementById("wrapper");
    wrap.style = '';

    document.body.style = "";
}
/**
 * @author Asa Dillahunty
 * 
 * This script listens for someone to enter the 'konami code'
 * (up up down down left right left right b a enter) and alters the
 * HTML to make it look really gross.
 * 
 * It also exposes a link to my inProgress projects
 */

 var count = 1;
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

            count = (count+1)%2;
        }
        konami = 0;
    }
    else konami = 0;
});


var bodyStyle;

function static() {
    console.log("static");
    bodyStyle = document.body.style;
    document.body.style = "filter:invert(100%);";

    var h2s = document.getElementsByTagName("h2");
    // h2s.classList.add("floatAway");
    var i;
    for (i=0;i<h2s.length;i++) {
        h2s[i].className = "floatAway";
    }

    var divs = document.getElementsByTagName("div");
    // h2s.classList.add("floatAway");
    for (i=0;i<divs.length;i++) {
        divs[i].classList.add("static");
    }

    var hide = document.getElementsByClassName("bar");
    for (i=0;i<hide.length;i++) {
        hide[i].removeAttribute("hidden");
    }
}

function normalize() {
    console.log("normalize");
    document.body.style = "";

    var h2s = document.getElementsByTagName("h2");
    // h2s.classList.remove("floatAway");
    var i;
    for (i=0;i<h2s.length;i++) {
        h2s[i].className = "";
    }

    var divs = document.getElementsByTagName("div");
    // h2s.classList.remove("floatAway");
    for (i=0;i<divs.length;i++) {
        divs[i].classList.remove("static");
    }

    var hide = document.getElementsByClassName("bar");
    for (i=0;i<hide.length;i++) {
        hide[i].setAttribute("hidden", "true");
    }
}


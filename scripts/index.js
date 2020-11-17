/**
 * @author Asa Dillahunty
 * 
 * This script listens for someone to enter the 'konami code'
 * (up up down down left right left right b a enter) and alters the
 * HTML to make it look really gross.
 */

var count = 1;
var konami = 0;

document.body.addEventListener('keyup', function(event) {
    if (event.code === "ArrowUp") { // up
        if (konami == 0 || konami == 1) konami++;
        else if (konami == 2) konami = 2;
        else konami = 1;
    }
    else if (event.code === "ArrowDown") { // down
        if (konami == 2 || konami == 3) konami++;
        else konami = 0;
    }
    else if (event.code === "ArrowLeft") { // left
        if (konami == 4 || konami == 6) konami++;
        else konami = 0;
    }
    else if (event.code === "ArrowRight") { // right
        if (konami == 5 || konami == 7) konami++;
        else konami = 0;
    }
    else if (event.code === "KeyB") { // b
        if (konami == 8) konami++;
        else konami = 0;
    }
    else if (event.code === "KeyA") { // a
        if (konami == 9) konami++;
        else konami = 0;
    }
    else if (event.code === "Enter") { // enter (start)
        if (konami == 10) {
            if (count == 1) static();
            else normalize();
            
            count = (count+1)%2;
        }
        konami = 0;
    }
    else konami = 0;
});

function change() {
    if (img == "images/aceTreeW.png") normalize();
    else static();
}

function static() {
    var img = document.getElementById("cover");
    img.src = 'images/aceTreeW.png';
    img.style = 'filter:invert(100%);';

    var titls = document.getElementsByTagName("h1");
    for (i=0;i<titls.length;i++) {
        titls[i].classList.add("static");
    }

    var wrap = document.getElementById("wrapper");
    wrap.style = 'filter:invert(100%);';

    document.body.style = "background-color: black;background-image: url(images/static2.png);background: linear-gradient( rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.66) ), url('images/static2.png');";

    var navs = document.getElementsByTagName("nav");
    // h2s.classList.add("floatAway");
    for (i=0;i<navs.length;i++) {
        navs[i].classList.add("static");
    }
}

function normalize() {
    var img = document.getElementById("cover");
    img.src = 'images/stantontree.JPG';
    img.style = '';

    var titls = document.getElementsByTagName("h1");
    for (i=0;i<titls.length;i++) {
        titls[i].classList.remove("static");
    }

    var wrap = document.getElementById("wrapper");
    wrap.style = '';

    document.body.style = "";

    var navs = document.getElementsByTagName("nav");
    // h2s.classList.add("floatAway");
    for (i=0;i<navs.length;i++) {
        navs[i].classList.remove("static");
    }
}
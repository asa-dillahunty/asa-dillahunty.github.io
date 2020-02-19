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
}


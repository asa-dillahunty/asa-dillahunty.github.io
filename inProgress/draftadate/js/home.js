function leftswipe(){
    var top = document.getElementById('top');
    top.className ='leftswipe';

    var bot = document.getElementById('bottom');

    //then just remove it afterwards
    //for now remove class
    setTimeout(() => {  top.className =''; 
                        bot.id = 'top';
                        top.id = 'bottom';}, 1000);
}

function rightswipe(){

    var top = document.getElementById('top');
    top.className ='rightswipe';

    var bot = document.getElementById('bottom');

    //then just remove it afterwards
    //for now remove class
    setTimeout(() => {  top.className =''; 
                        bot.id = 'top';
                        top.id = 'bottom';}, 1000);
}

function editable() {
    document.getElementById('name').removeAttribute('readonly');
    document.getElementById('age').removeAttribute('readonly');
    document.getElementById('f-age').removeAttribute('readonly');
    document.getElementById('height').removeAttribute('readonly');
    document.getElementById('year').removeAttribute('readonly');
    document.getElementById('biog').removeAttribute('readonly');

    document.getElementById('name').style.border = '1px solid grey';
    document.getElementById('age').style.border = '1px solid grey';
    document.getElementById('f-age').style.border = '1px solid grey';
    document.getElementById('height').style.border = '1px solid grey';
    document.getElementById('year').style.border = '1px solid grey';
    document.getElementById('biog').style.border = '1px solid grey';

    document.getElementById('saveButton').innerHTML = "<button id='save' onclick='uneditable()'>Save Changes</button>";
}

function uneditable() {
    document.getElementById('name').setAttribute('readonly','readonly');
    document.getElementById('age').setAttribute('readonly','readonly');
    document.getElementById('f-age').setAttribute('readonly','readonly');
    document.getElementById('height').setAttribute('readonly','readonly');
    document.getElementById('year').setAttribute('readonly','readonly');
    document.getElementById('biog').setAttribute('readonly','readonly');

    document.getElementById('name').style.border = 'none';
    document.getElementById('age').style.border = 'none';
    document.getElementById('f-age').style.border = 'none';
    document.getElementById('height').style.border = 'none';
    document.getElementById('year').style.border = 'none';
    document.getElementById('biog').style.border = 'none';

    document.getElementById('saveButton').innerHTML = "";
}
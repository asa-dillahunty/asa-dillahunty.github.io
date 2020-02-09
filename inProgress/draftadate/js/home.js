function leftswipe(){
    document.getElementById('checking').className ='leftswipe';
    //then just remove it afterwards
    //for now remove class
    setTimeout(() => {  document.getElementById('checking').className =''; }, 2000);
  }

  function rightswipe(){
    document.getElementById('checking').className ='rightswipe';
    //then just remove it afterwards
    //for now remove class
    setTimeout(() => {  document.getElementById('checking').className =''; }, 2000);
  }
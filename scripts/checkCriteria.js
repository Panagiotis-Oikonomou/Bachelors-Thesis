const area1 = document.getElementById('area1');
const area2 = document.getElementById('area2');
const sun1 = document.getElementById('sun1');
const sun2 = document.getElementById('sun2');
const per1 = document.getElementById('per1');
const per2 = document.getElementById('per2');
const charea = document.getElementById('charea');
const chsun = document.getElementById('chsun');
const chper = document.getElementById('chper');

const msg = document.getElementById("msg");

area1.addEventListener('input', function(){
    area1.max = area2.value;
});

area2.addEventListener('input', function(){
    area2.min = area1.value;
});

sun1.addEventListener('input', function(){
    sun1.max = sun2.value;
});

sun2.addEventListener('input', function(){
    sun2.min = sun1.value;
});

per1.addEventListener('input', function(){
    per1.max = per2.value;
});

per2.addEventListener('input', function(){
    per2.min = per1.value;
});

charea.addEventListener("input", function() {
    if(charea.checked){
        area1.value = "0";
        area2.value = "0";
    }
    else{
        area1.value = "0";
        area2.value = "132";
    }
});

chsun.addEventListener("input", function() {
    if(chsun.checked){
        sun1.value = "0";
        sun2.value = "0";
    }
    else{
        sun1.value = "0";
        sun2.value = "100";
    }
});

chper.addEventListener("input", function() {
    if(chper.checked){
        per1.value = "0";
        per2.value = "0";
    }
    else{
        per1.value = "0";
        per2.value = "100";
    }
});
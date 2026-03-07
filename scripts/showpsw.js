const showpsw = document.getElementById('pswshow');
const passw = document.getElementById('psw');

const showcpsw = document.getElementById('cpswshow');
const cpass = document.getElementById('cpsw');

showpsw.addEventListener('input', function(){
    if(passw.type == "password"){
        passw.type = "text";
    }
    else{
        passw.type = "password";
    }
});

showcpsw.addEventListener('input', function(){
    if(cpass.type == "password"){
        cpass.type = "text";
    }
    else{
        cpass.type = "password";
    }
});
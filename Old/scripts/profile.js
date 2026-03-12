const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const clock = document.getElementById('clock');
const user = document.getElementById('usr');
const pass = document.getElementById('psw');
const conpsw = document.getElementById('cpsw');
const fileName = window.location.pathname.split("/").pop();

const msg1 = document.getElementById('error_msg1');
const msg2 = document.getElementById('error_msg2');
const msg3 = document.getElementById('error_msg3');
const msg4 = document.getElementById('error_msg4');
const msg5 = document.getElementById('error_msg5');
const msg6 = document.getElementById('error_msg6');
const msg7 = document.getElementById('pswmatch');

var subm = new Array(6);
subm.fill(true);

fname.addEventListener("input", function(){
    let fn = fname.value.trim();
    let len = fn.length;
    let regex = /\d/;

    if(len == 0){
        msg1.textContent = "";
        subm[0] = false;
    }
    else if(len <= 3 || len >= 16){
        msg1.textContent = "Το όνομά σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";
        subm[0] = false;
    }
    else if(fn.includes(" ")){
        msg1.textContent = "Το όνομά σας δεν μπορεί να περιέχει κενά";
        subm[0] = false;
    }
    else if(regex.test(fn)){
        msg1.textContent = "Το όνομά σας δεν επιτρέπεται να περιέχει ψηφία";
        subm[0] = false;
    }
    else{
        msg1.textContent = "";
        subm[0] = true;
    }       
});

lname.addEventListener("input", function(){
    let ln = lname.value.trim();
    let len = ln.length;
    let regex = /\d/;

    if(len == 0){
        msg2.textContent = "";
        subm[1] = false;
    }
    else if(len <= 3 || len >= 16){
        msg2.textContent = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";
        subm[1] = false;
    }
    else if(ln.includes(" ")){
        msg2.textContent = "Το επιθετό σας δεν μπορεί να περιέχει κενά";
        subm[1] = false;
    }
    else if(regex.test(ln)){
        msg2.textContent = "Το επιθετό σας δεν επιτρέπεται να περιέχει ψηφία";
        subm[1] = false;
    }
    else{
        msg2.textContent = "";
        subm[1] = true;
    }
});

clock.addEventListener("input", function(){
    let cl = clock.value.trim();
    let patt = /^\d-\d{8}-\d{2}$/;

    if(cl.length == 0){
        msg3.textContent = "";
        subm[2] = false;
    }
    else if(patt.test(cl)){
        msg3.textContent = "";
        subm[2] = true;
    }
    else{
        msg3.textContent = "Ο αριθμός πρέπει να είναι αυτής της μορφής χ-χχχχχχχχ-χχ";
        subm[2] = false;
    }
});

user.addEventListener("input", function(){
    let usr = user.value.trim();
    let len = usr.length;

    if(len == 0){
        msg4.textContent = "";
        subm[3] = false;
    }
    else if(len <= 4 || len >= 16){
        msg4.textContent = "Το username σας πρέπει να αποτελείται απο 5 μέχρι 15 γράμματα";
        subm[3] = false;
    }
    else if(usr.includes(" ")){
        msg4.textContent = "Το username σας δεν μπορεί να περιέχει κενά";
        subm[3] = false;
    }
    else{
        msg4.textContent = "";
        subm[3] = true;
    }
});

pass.addEventListener("input", function(){
    let psw = pass.value.trim();
    let cpsw = conpsw.value.trim();
    let len = psw.length;
    let cpswlen = cpsw.length;
    let special = new Array("!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", ";", "'", ":", "\"", "\\", "|", "<", ">", ",", ".", "?", "/");

    if(fileName == "profile.html"){
        if(len != 0 || cpswlen != 0){
            pass.required = true;
            conpsw.required= true;
            subm[4] = false;
        }
        else if(len == 0 && cpswlen == 0){
            pass.required = false;
            conpsw.required= false;
            subm[4] = true;
        }
    }

    if(psw == cpsw && len != 0){
        msg6.textContent = "";
        msg7.textContent = "Οι δύο κωδικοί ταιρίαζουν";
        subm[4] = true;
        subm[5] = true;
    }
    else if(psw != cpsw && len == 0 && cpswlen == 0){
        msg6.textContent = "";
        msg7.textContent = "";
        subm[4] = false;
        subm[5] = false;
    }
    else if(psw != cpsw && len == 0){
        msg6.textContent = "Οι δύο κωδικοί δεν ταιρίαζουν";
        msg7.textContent = "";
        subm[4] = false;
        subm[5] = false;
    }
    else if(psw != cpsw && cpswlen == 0){
        msg6.textContent = "";
        msg7.textContent = "";
        subm[4] = false;
        subm[5] = false;
    }
    else if(psw != cpsw){
        msg6.textContent = "Οι δύο κωδικοί δεν ταιρίαζουν";
        msg7.textContent = "";
        subm[4] = false;
        subm[5] = false;
    }

    msg5.textContent = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";

    for(let i = 0;i < len;i++){
        if(psw.includes(special[i])){
            if(len <= 4 || len >= 16){
                msg5.textContent = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";
                subm[4] = false;
            }
            else if(psw.includes(" ")){
                msg5.textContent = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";
                subm[4] = false;
            }
            else{
                msg5.textContent = "";
                subm[4] = true;
            }
        }
    }

    if(len == 0){
        msg5.textContent = "";
        subm[4] = false;
    }
    
});

conpsw.addEventListener("input", function(){
    let cpsw = conpsw.value.trim();
    let psw = pass.value.trim();
    let len = psw.length;
    let cpswlen = cpsw.length;

    if(fileName == "profile.html"){
        if(len != 0 || cpswlen != 0){
            pass.required = true;
            conpsw.required= true;
            subm[4] = false;
        }
        else if(len == 0 && cpswlen == 0){
            pass.required = false;
            conpsw.required= false;
            subm[5] = true;
        }
    }

    if(len == 0){
        msg6.textContent = "";
        msg7.textContent = "";
        subm[5] = false;
    }
    else if(psw != cpsw){
        msg6.textContent = "Οι δύο κωδικοί δεν ταιρίαζουν";
        msg7.textContent = "";
        subm[5] = false;
    }
    else if(psw == cpsw){
        msg6.textContent = "";
        msg7.textContent = "Οι δύο κωδικοί ταιρίαζουν";
        subm[5] = true;
    }
});
const paroxos = document.getElementById('paroxos');

const msg1 = document.getElementById('error_msg1');

var subm = true;

paroxos.addEventListener("input", function(){
    let par = paroxos.value.trim();
    let len = par.length;
    let regex = /\d/;

    if(len == 0){
        msg1.textContent = "";
        subm = false;
    }
    else if(regex.test(par)){
        msg1.textContent = "Το παρόχου δεν επιτρέπεται να περιέχει ψηφία";
        subm = false;
    }
    else if(len <= 2 || len >= 16){
        msg1.textContent = "Το όνομά παρόχου πρέπει να αποτελείται από 3 μεχρι 15 γράμματα";
        subm = false;
    }
    else{
        msg1.textContent = "";
        subm = true;
    }       
});

function checkParoxo(){
    const msg = document.getElementById("error_msg2");
    if(!subm){
        msg.textContent = "Παρακαλώ συμπληρώστε τα λάθος πεδία";
        return false;
    }
    msg.textContent = "";
    return true;
}
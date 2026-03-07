const area = document.getElementById('area-name');

const msg1 = document.getElementById('error_msg1');

const fileName = window.location.pathname.split("/").pop();

if(fileName == "addarea.html"){
    var subm = false;
}
else if(fileName == "managearea.html"){
    var subm = true;
}


area.addEventListener("input", function(){
    let ar = area.value.trim();
    let len = ar.length;
    let regex = /\d/;

    if(len == 0){
        msg1.textContent = "";
        subm = false;
    }
    else if(regex.test(ar)){
        msg1.textContent = "Το όνομα της περιοχής δεν επιτρέπεται να περιέχει ψηφία";
        subm = false;
    }
    else if(len <= 2 || len >= 16){
        msg1.textContent = "Το όνομά της περιοχής πρέπει να αποτελείται από 3 μεχρι 15 γράμματα";
        subm = false;
    }
    else{
        msg1.textContent = "";
        subm = true;
    }       
});

function checkArea(){
    const msg = document.getElementById("error_msg2");
    if(!subm){
        msg.textContent = "Παρακαλώ συμπληρώστε τα λάθος πεδία";
        return false;
    }
    msg.textContent = "";
    return true;
}
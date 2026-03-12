function checkForm(){
    const msg = document.getElementById("not_send");
    for(let i = 0; i < subm.length; i++){
        if(!subm[i]){
            msg.textContent = "Παρακαλώ συμπληρώστε τα λάθος πεδία";
            return false;
        }
    }
    msg.textContent = "";
    return true;
}
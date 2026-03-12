function displayMessage(){
    const charea = document.getElementById('charea');
    const chsun = document.getElementById('chsun');
    const chper = document.getElementById('chper');

    const msg = document.getElementById("msg");

    if(charea.checked && chsun.checked && chper.checked){
        msg.textContent = "Πρέπει να επιλέξεις τουλάχιστον ένα κριτήριο";
        return false;
    }
    else{
        msg.textContent = "";
        return true;
    }
}
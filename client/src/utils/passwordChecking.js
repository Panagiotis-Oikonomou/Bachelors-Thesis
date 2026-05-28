const passwordChecking = (name, password, conPassword, originalPassword, setCpswRequired) => {
    let cpswmatch = "";
    let cpswerror = "";
    let len = password.length;
    let cpswlen = conPassword.length;

    switch (name) {
        case "password": {
            if (!originalPassword) return;

            setCpswRequired(originalPassword !== password);

            if (originalPassword === password) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (originalPassword !== password) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (password === conPassword && len !== 0) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
            else if (password !== conPassword && cpswlen === 0) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (password !== conPassword && len !== 0) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            break;
        }
        case "cpsw": {
            if (!originalPassword) return;

            if (cpswlen === 0 || password == originalPassword) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (conPassword !== password) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (conPassword === password) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
            break;
        }

        default:
            break;
    }

    return {cpswerror, cpswmatch};
}

export default passwordChecking;
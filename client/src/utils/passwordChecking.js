const passwordChecking = (name, password, conPassword, setCpswRequired) => {
    let cpswmatch = "";
    let cpswerror = "";
    let len = !password ? 0 : password.length;
    let cpswlen = conPassword.length;
    const emptyPassword = !password || password.trim() === "";

    switch (name) {
        case "password": {
            setCpswRequired(!emptyPassword);

            if (emptyPassword) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (password === conPassword && len !== 0) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
            else if (!emptyPassword) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
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
            if (emptyPassword) break;

            if (cpswlen === 0 || emptyPassword) {
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
    }

    return { cpswerror, cpswmatch };
}

export default passwordChecking;
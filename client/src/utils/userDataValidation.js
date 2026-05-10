const userDataValidation = (name, value) => {
    let error = "";
    let len = value.length;
    const regex = /^[\p{L}]+$/u;
    const clockRegex = /^\d-\d{8}-\d{2}$/;
    const specialRegex = /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]/;

    switch (name) {
        case "fname": {
            if (len === 0) error = "Το όνομα είναι κενό";

            else if (len < 4 || len > 15) error = "Το όνομά σας πρέπει να αποτελείται από 4 μέχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (!regex.test(value)) error = "Το όνομά σας περιέχει μη έγκυρους χαρακτήρες";
            break;
        }
        case "lname": {
            if (len === 0) error = "";

            else if (len < 4 || len > 15) error = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το επιθετό σας δεν μπορεί να περιέχει κενά";

            else if (!regex.test(value)) error = "Το επιθετό σας περιέχει μη έγκυρους χαρακτήρες";
            break;
        }
        case "clock": {
            if (len === 0) error = "";

            else if (clockRegex.test(value)) error = "";

            else error = "Ο αριθμός πρέπει να είναι αυτής της μορφής χ-χχχχχχχχ-χχ";
            break;
        }
        case "email": {
            if (len === 0) error = "Το email σας είναι κενό";
            else error = "";
            break;
        }
        case "username": {
            if (len === 0) error = "Το username σας είναι κενό";

            else if (len < 5 || len > 10) error = "Το username σας πρέπει να αποτελείται από 5 μέχρι 10 γράμματα";

            else if (value.includes(" ")) error = "Το username σας δεν μπορεί να περιέχει κενά";

            break;
        }
        case "password": {
            if (len === 0) error = "Ο κωδικός σας είναι κενός";

            else if (len < 5 || len > 15) error = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";

            else if (value.includes(" ")) error = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";

            else if (!specialRegex.test(value)) error = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";
            break;
        }
    }

    return error;
}

export default userDataValidation;
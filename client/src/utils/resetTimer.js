const resetTimer = (value, setValue) => {
    if(value !== ""){
        const timer = setTimeout(() => {
                setValue("");
            }, 3000);

            return () => clearTimeout(timer);
    }
}

export default resetTimer;
class Tools{
    isMobile(){
        if (window.innerWidth <= 767) return true
        else return false;
    }
    titleCase(valueString, valueToRemove=null){
        if (typeof valueToRemove === "string"){
            valueString = valueString.replace(valueToRemove,"");
        }
        let stringArray = valueString.split("");
        const firstChar = stringArray[0];
        stringArray[0] = firstChar.toUpperCase();
        return stringArray.join("");
    }
    async toBase64(file){
        try{
            return await new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onload = e => res(e.target.result);
                reader.onerror = e => rej(e);
                reader.readAsDataURL(file); 
            });
        }catch(error){
            console.log(error)
            return "";
        }
    };
}

export const tools = new Tools();
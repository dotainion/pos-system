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
}

export const tools = new Tools();
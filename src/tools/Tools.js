import { routes } from "../global/Routes";

class Routes{
    key = "routes-for-admin-access";
    set(route){
        window.localStorage.setItem(this.key, JSON.stringify(route));
    }
    get(){
        const route = window.localStorage.getItem(this.key);
        if (route) return JSON.parse(route);
        return routes.orderEntry;
    }
}
class Tools{
    route = new Routes();
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
    isEmailValid(email){
        //check if email in valid format
        var validate = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (validate.test(email)) return true;
        else return false;
    }
}

export const tools = new Tools();
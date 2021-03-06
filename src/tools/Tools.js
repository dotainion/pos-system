import { routes } from "../global/Routes";
const jwt = require('jsonwebtoken');

class Token{
    tokenKey = "somekey";
    storagekey = "pop-token";
    set(ref="",hour=1){
        const token = jwt.sign({email:ref}, this.tokenKey, { expiresIn: `${hour}h`});
        try{
            const getToken = this.get();
            if (getToken){
                let tokenList = [];
                for (let tok of getToken) tokenList.push(tok);
                tokenList.push({email:ref, key:token});
                this.save(tokenList);
            }else this.save([token]);
        }catch{
            this.save([{email:ref, key:token}]);
        }
    }
    save(obj){
        window.localStorage.setItem(this.storagekey,JSON.stringify(obj));
    }
    get(){
        const token = window.localStorage.getItem(this.storagekey);
        if (token) return JSON.parse(token);
        return [];
    }
    detete(ref, refToken=null){
        let storeSave = [];
        for (let token of this.get()){
            if (!refToken){
                if (token?.email !== ref) storeSave.push(token);
            }else{
                if (token?.email === ref && token.key !== refToken) storeSave.push(token);
            }
        }
        this.save(storeSave);
    }
    isActive(ref=""){
        try{
            for (let token of this.get()){
                let res = null;
                try{
                    res = jwt.verify(token?.key, this.tokenKey);
                }finally{
                    if (res){
                        if (res.email === ref) return true;
                    }else this.detete(ref, token?.key);
                }
            }
            return false;
        }catch{return false;}
    }
    clear(key="all"){
        if (key.toLowerCase() === "all") window.localStorage.clear();
        else window.localStorage.removeItem(key);
    }
}

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
    token = new Token();
    isMobile(){
        if (window.innerWidth <= 767) return true
        else return false;
    }
    titleCase(valueString, valueToRemove=null){
        if (typeof valueToRemove === "string"){
            valueString = valueString?.replace(valueToRemove,"");
        }
        let stringArray = valueString?.split("") || [];
        const firstChar = stringArray?.[0];
        stringArray[0] = firstChar?.toUpperCase();
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
    async toast(message, color="light", duration=500, position="top"){
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.position = position;
        toast.duration = duration;
        toast.color = color;
      
        document.body.appendChild(toast);
        await toast.present();
      
        const { role } = await toast.onDidDismiss();
    }
    async toastWithOption(message, color="light", duration=400, position="top", header=""){
        const toast = document.createElement('ion-toast');
        toast.header = header;
        toast.message = message;
        toast.position = position;
        toast.duration = duration;
        toast.color = color;
        toast.buttons = [
            {
                side: 'start',
                icon: 'star',
                text: 'Favorite',
                handler: () => {
                    console.log('Favorite clicked');
                }
            }, {
                text: 'Done',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ];
      
        document.body.appendChild(toast);
        await toast.present();
      
        const { role } = await toast.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }
    nowDate(){
        return new Date().toLocaleDateString("en-GB");
    }
    nowTime(){
        return new Date().toLocaleTimeString();
    }
    formatDate(date){
        const farmated = new Date(date).toLocaleDateString("en-GB");//zh-Hans-CN
        if(farmated === "Invalid Date") return "";
        return farmated;
    }
    randomColor(range=100){
        /*colors = [];
        const randNum = (Math.random() * range) + 1;
        const randRange = Math.floor(randNum);
        colors[randRange];*/
        const cL = Math.floor((Math.random()*100)+1);
        const cC = Math.floor((Math.random()*100)+1);
        const cR = Math.floor((Math.random()*100)+1);
        return `rgb(${cL},${cC},${cR})`;
    }
}

export const tools = new Tools();
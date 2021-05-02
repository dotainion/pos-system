import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/auth';
import { roles } from '../content/lists';
import { getProducts, getUser } from '../database/database';


const ContextProvider = createContext();
export const useStore = () => useContext(ContextProvider);

export const AppContext = ({children}) =>{
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [cart, setCart] = useState([]);
    const [cartOnHold, setCartOnHold] = useState([]);
    const [products, setProducts] = useState([]);
    const [mostRecent, setMostRecent] = useState([]);

    const signIn = async(email, password) =>{
        try{
            const response = await auth.signInWithEmailAndPassword(email, password);
            return response;
        }catch(error){
            return {error:error.message};
        }
    }

    const createUser = async(email, password) =>{
        try{
            const response = await auth.createUserWithEmailAndPassword(email, password);
            return response;
        }catch(error){
            return {error: error.message};
        }
    }

    const saveMostRecent = (item) =>{
        let most_recent = window.localStorage.getItem("most-recent");
        if (most_recent){
            most_recent = JSON.parse(most_recent);
            for (let obj of most_recent){
                if (obj?.id === item?.id) return;
            }
            most_recent.push(item);
            setMostRecent(most_recent);
            window.localStorage.setItem("most-recent", JSON.stringify(most_recent));
        }else{
            setMostRecent([item]);
            window.localStorage.setItem("most-recent", JSON.stringify([item]));
        }
    }

    const removeMostRecent = (item) =>{
        let holdRemainder = [];
        let most_recent = window.localStorage.getItem("most-recent");
        if (most_recent){
            for (let record of JSON.parse(most_recent)){
                if (item?.id !== record?.id) holdRemainder.push(record);
            }
            setMostRecent(holdRemainder);
            window.localStorage.setItem("most-recent", JSON.stringify(holdRemainder));
        }
    }

    const initProducts = async() =>{
        setProducts(await getProducts());
        //window.localStorage.clear();
        setMostRecent(JSON.parse(window.localStorage.getItem("most-recent") || []));
    }

    //on search value
    const searchProducts = async(value) =>{
        const isInclued = (id) =>{
            for (let obj of storeSorted){
                if (obj?.id === id) return true;
            }
            return false;
        }
        let storeSorted = [];
        let prods = await getProducts();
        const title = prods.filter((prod)=>prod?.info?.title?.toLowerCase()?.includes(value?.toLowerCase()));
        const salePrice = prods.filter((prod)=>prod?.info?.salePrice?.toLowerCase()?.includes(value?.toLowerCase()));
        for (let obj of [...title, ...salePrice]){
            if (!isInclued(obj?.id)) storeSorted.push(obj);
        }
        setProducts(storeSorted);
    }

    const initialize = () =>{
        initProducts();
    }

    useEffect(()=>{
        initialize();
        auth.onAuthStateChanged(async(user)=>{
            setIsAuthenticated(user);
            setLoading(false);
        });
    },[]);  
    return(
        <ContextProvider.Provider value={{
            cart,
            setCart,
            cartOnHold,
            setCartOnHold,
            signIn,
            createUser,
            isAuthenticated,
            products,
            initProducts,
            searchProducts,
            mostRecent,
            saveMostRecent,
            removeMostRecent,
        }}>
            {!loading && children}
        </ContextProvider.Provider>
    )
}
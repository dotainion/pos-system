import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/auth';
import { roles } from '../content/lists';
import { getCustomer, getProducts, getUser } from '../database/database';


const ContextProvider = createContext();
export const useStore = () => useContext(ContextProvider);

export const AppContext = ({children}) =>{
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [cart, setCart] = useState([]);
    const [cartOnHold, setCartOnHold] = useState([]);
    const [products, setProducts] = useState([]);
    const [mostRecent, setMostRecent] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showProductLoader, setShowProductLoader] = useState(false);

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

    const signOut = async() =>{
        await auth.signOut();
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
        setShowProductLoader(true);
        setProducts(await getProducts());
        //window.localStorage.clear();
        setMostRecent(JSON.parse(window.localStorage.getItem("most-recent") || []));
        setShowProductLoader(false);
    }

    //on search value
    const searchProducts = async(value) =>{
        const isInclued = (id) =>{
            for (let obj of storeSorted){
                if (obj?.id === id) return true;
            }
            return false;
        }
        setShowProductLoader(true);
        let storeSorted = [];
        let prods = await getProducts();
        const title = prods.filter((prod)=>prod?.info?.title?.toLowerCase()?.includes(value?.toLowerCase()));
        const salePrice = prods.filter((prod)=>prod?.info?.salePrice?.toLowerCase()?.includes(value?.toLowerCase()));
        for (let obj of [...title, ...salePrice]){
            if (!isInclued(obj?.id)) storeSorted.push(obj);
        }
        setProducts(storeSorted);
        setShowProductLoader(false);
    }

    const initCustomers = async() =>{
        setCustomers(await getCustomer());
    }

    const initialize = () =>{
        initProducts();
        initCustomers();
    }

    useEffect(()=>{
        auth.onAuthStateChanged(async(user)=>{
            initialize();
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
            signOut,
            createUser,
            isAuthenticated,
            products,
            initProducts,
            showProductLoader,
            searchProducts,
            mostRecent,
            saveMostRecent,
            removeMostRecent,
            customers,
            initCustomers
        }}>
            {!loading && children}
        </ContextProvider.Provider>
    )
}
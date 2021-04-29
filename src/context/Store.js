import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/auth';


const ContextProvider = createContext();
export const useStore = () => useContext(ContextProvider);

export const AppContext = ({children}) =>{
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [cart, setCart] = useState([]);

    const signIn = async(email, password) =>{
        try{
            await auth.signInWithEmailAndPassword(email, password);
        }catch(error){
            return {error:error.message};
        }
    }

    const createUser = async(email, password) =>{
        try{
            await auth.createUserWithEmailAndPassword(email, password);
        }catch(error){
            return error.message;
        }
    }

    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
            setIsAuthenticated(user);
            setLoading(false);
        });
    },[]);  
    return(
        <ContextProvider.Provider value={{
            cart,
            setCart,
            signIn,
            createUser,
            isAuthenticated
        }}>
            {!loading && children}
        </ContextProvider.Provider>
    )
}
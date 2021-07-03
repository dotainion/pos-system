import { IonButton, IonItem } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { Entry } from '../widgets/Entry';
import { useStore } from '../context/Store';


export const ConfirmAuthentication = ({isOpen, onConfirmed, onClose}) =>{
    const { signIn } = useStore();

    const [error, setError] = useState("");

    const emailRef = useRef();
    const passwordRef = useRef();

    const verifyAuth = async() =>{
        setError("");
        const response = await signIn(emailRef.current.value, passwordRef.current.value);
        if (response?.error) return setError(response?.error);
        emailRef.current.value = "";
        passwordRef.current.value = "";
        onConfirmed?.();
    }
    return(
        <div hidden={!isOpen} className="backdrop dark">
            <div className="float-center silver pad-xxl radius max-width-on-mobile">
                <div className="pad-v-xl center" style={{color:"black"}}>
                    <label>NEEDS ADMINISTRATOR ACCESS</label>
                    <div className="font" style={{color:"red"}}>{error}</div>
                </div>
                <Entry labelColor="black" entryRef={emailRef} label="Email" placeholder="example@gmail.com" type="email" />
                <Entry labelColor="black" entryRef={passwordRef} label="Password" placeholder="Password1#" type="password" />
                <button onClick={verifyAuth} className="pad radius silver click" style={{float:"right"}}>Confirm</button>
                <button onClick={onClose} className="pad radius silver click" style={{float:"right",marginRight:"10px"}}>Cancel</button>
            </div>
        </div>
    )
}
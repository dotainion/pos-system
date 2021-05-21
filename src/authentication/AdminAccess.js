import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonPage, IonRow } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Entry } from '../components/Entry';
import { useStore } from '../context/Store';
import { routes } from '../global/Routes';
import { tools } from '../tools/Tools';
import { Progressing } from '../widgets/Progressing';


export const AdminAccess = () =>{
    const history = useHistory();

    const { signIn, adminAccess, setAdminAccess } = useStore();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const verifyAuth = async() =>{
        setError("");
        setLoading(true);
        const response = await signIn(emailRef.current.value, passwordRef.current.value);
        setLoading(false);
        if (response?.error) return setError(response?.error);
        emailRef.current.value = "";
        passwordRef.current.value = "";
        setAdminAccess(true);
    }

    const onEnterPress = (e) =>{
        if (e.key === "Enter") verifyAuth();
    }

    //detects change in adminAccess and push route
    useEffect(()=>{
        if (adminAccess) history.push(tools.route.get());
    },[adminAccess]);
    return(
        <IonPage>
            <IonContent>
                <IonGrid class="dark">
                    <IonRow>
                        <IonCol sizeMd="4" offsetMd="4">
                            <div className="login-main-container">
                                <div className="login-container no-select float-center">
                                    <div className="pad-v-xl center" style={{color:"white"}}>
                                        <label>NEEDS ADMINISTRATOR ACCESS</label>
                                        <div className="font" style={{color:"red"}}>{error}</div>
                                    </div>
                                    <Progressing isOpen={loading} />
                                    <Entry onKeyPress={onEnterPress} entryRef={emailRef} labelColor="white" label="Email" placeholder="example@gmail.com" type="email" />
                                    <Entry onKeyPress={onEnterPress} entryRef={passwordRef} labelColor="white" label="Password" placeholder="Password1#" type="password" />
                                    <div style={{marginLeft:"20px", marginRight:"20px"}}>
                                        <IonButton onClick={verifyAuth} shape="round" size="small" color="light" style={{float:"right"}}>Confirm</IonButton>
                                        <IonButton onClick={()=>history.push(routes.orderEntry)} shape="round" size="small" color="light" style={{float:"right",marginRight:"10px"}}>Cancel</IonButton>
                                    </div>
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}
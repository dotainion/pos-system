import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../context/Store";
import { routes } from "../global/Routes";
import { Progressing } from "../widgets/Progressing";



export const Login = () =>{
    const { signIn, isAuthenticated } = useStore();
    const history = useHistory();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const onSignIn = async() =>{
        setError("");
        setLoading(true);
        const response = await signIn(emailRef.current.value, passwordRef.current.value);
        setLoading(false);
        if (response?.error) setError(response?.error);
    }

    const onEnterPress = (e) =>{
        if (e.key === "Enter") onSignIn();
    }

    //detect when user is loged in and route to order entery
    useEffect(()=>{
        if (isAuthenticated) history.push(routes.orderEntry);
    },[isAuthenticated]);

    return(
        <IonPage className="page">
            <IonContent>
                <IonGrid class="background-image">
                    <IonRow>
                        <IonCol sizeMd="4" offsetMd="4">
                            <div className="login-main-container">
                                <div className="login-container no-select float-center">
                                    <div className="float-top-center singin-error">{error}</div>
                                    <p><Progressing isOpen={loading}/></p>
                                    <IonItem color="light" lines="none">
                                        <IonLabel position="floating">User Name/Email</IonLabel>
                                        <IonInput ref={emailRef} onKeyPress={onEnterPress} type="email" />
                                    </IonItem>
                                    <IonItem color="light" lines="none">
                                        <IonLabel position="floating">Password</IonLabel>
                                        <IonInput ref={passwordRef} onKeyPress={onEnterPress} type='password' />
                                    </IonItem>
                                    <IonLabel style={{textShadow:"1px 1px 1px black"}} class="link-hover" color="danger">Forget Password</IonLabel>
                                    <IonButton onClick={onSignIn} style={{float:"right"}} size="small" color="light">Login</IonButton>
                                    <div className="singup-btn">
                                        <label onClick={()=>history.push(routes.register)}>Sign up</label>
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
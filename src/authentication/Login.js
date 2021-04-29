import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow } from "@ionic/react";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../context/Store";
import { routes } from "../global/Routes";



export const Login = () =>{
    const { signIn } = useStore();
    const history = useHistory();
    const [error, setError] = useState("");

    const emailRef = useRef();
    const passwordRef = useRef();

    const onSignIn = async() =>{
        setError("");
        const response = await signIn(emailRef.current.value, passwordRef.current.value);
        if (response?.error) setError(response?.error);
        else history.push(routes.orderEntry);
    }

    return(
        <IonPage className="page">
            <IonContent>
                <IonGrid class="background-image">
                    <IonRow>
                        <IonCol sizeMd="4" offsetMd="4">
                            <div className="login-main-container">
                                <div className="login-container no-select float-center">
                                    <div className="float-top-center singin-error">{error}</div>
                                    <IonItem color="light" lines="none">
                                        <IonLabel position="floating">User Name/Email</IonLabel>
                                        <IonInput ref={emailRef} type="email" />
                                    </IonItem>
                                    <IonItem color="light" lines="none">
                                        <IonLabel position="floating">Password</IonLabel>
                                        <IonInput ref={passwordRef} type='password' />
                                    </IonItem>
                                    <IonLabel style={{textShadow:"1px 1px 1px black"}} class="link-hover" color="danger">Forget Password</IonLabel>
                                    <IonButton onClick={onSignIn} style={{float:"right"}} size="small" color="light">Login</IonButton>
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}
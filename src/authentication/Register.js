import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { Entry } from '../components/Entry';


export const Register = () =>{
    return(
        <IonPage>
            <IonContent>
                <Entry placeholder="Email" />
                <Entry placeholder="Password" />
                <button>Save</button>
            </IonContent>
        </IonPage>
    )
}
import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';
import { MenuBarWrapper } from '../components/MenuBar';



export const Settings = () =>{
    return(
        <IonPage>
            <MenuBarWrapper>
                <IonList class="item-container">
                    hello oworld
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
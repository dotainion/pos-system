import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';
import { MenuBarWrapper } from '../components/MenuBar';



export const Reports = () =>{
    return(
        <IonPage>
            <MenuBarWrapper onSearch>
                <IonList class="item-container">
                    hello oworld
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
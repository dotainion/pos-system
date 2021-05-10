import { IonContent, IonList, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React from 'react';
import { MenuBar, MenuBarWrapper } from '../components/MenuBar';


export const Administration = () =>{
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
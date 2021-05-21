import { IonContent, IonList, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React from 'react';
import { MenuBar, MenuBarWrapper } from '../components/MenuBar';
import { BlankPage } from '../widgets/BlankPage';


export const Administration = () =>{
    return(
        <IonPage>
            <MenuBarWrapper>
                <IonList class="item-container" style={{height:"80vh"}}>
                    <BlankPage title="Administration" />
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
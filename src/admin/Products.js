import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';
import { MenuBarWrapper } from '../components/MenuBar';
import img from '../images/beach.jpg';



export const Products = () =>{
    return(
        <IonPage>
            <MenuBarWrapper onSearch>
                <IonList class="item-container">
                    {
                        [1].length?
                        [1,1,2,2,2].map((employee, key)=>(
                            <div className="item-info-container" key={key}>
                                <div className="flex item-sub-info-container">
                                    <IonThumbnail>
                                        <IonImg class="max-size" src={img}/>
                                    </IonThumbnail>
                                    <div>
                                        <div>Title</div>
                                        <div>Price</div>
                                        <div>Quantity</div>
                                    </div>
                                </div>
                            </div>
                        )):
                        <IonList>
                            <IonLabel>No Empolyee</IonLabel>
                        </IonList>
                    }
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
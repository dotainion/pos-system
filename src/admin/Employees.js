import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';
import { MenuBarWrapper } from '../components/MenuBar';
import img from '../images/beach.jpg';
import { SearchBar } from '../widgets/SearchBar';


export const Employees = () =>{
    return(
        <IonPage>
            <MenuBarWrapper onSearch={(value)=>{alert(value)}}>
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
                                        <div>name name name</div>
                                        <div>example@gmail.com</div>
                                        <div>1473-459-8999</div>
                                        <div>grenada, st.georges, tempe</div>
                                        <div>role: Admin</div>
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
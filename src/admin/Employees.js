import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { CreateEmployee } from '../components/CreateEmployee';
import { MenuBarWrapper } from '../components/MenuBar';
import img from '../images/beach.jpg';
import { SearchBar } from '../widgets/SearchBar';


export const Employees = () =>{
    const [showCreateEmployee, setShowCreateEmployee] = useState(false);
    return(
        <IonPage>
            <CreateEmployee
                isOpen={showCreateEmployee}
                onClose={()=>setShowCreateEmployee(false)}
            />
            <MenuBarWrapper onAdd={()=>setShowCreateEmployee(true)}>
                <IonList class="item-container">
                    {
                        [1]?.length?
                        [1,1,2,2,2].map((employee, key)=>(
                            <div className="item-info-container" key={key}>
                                <div className="item-sub-info-container">
                                    <IonThumbnail>
                                        <IonImg class="max-size" src={img}/>
                                    </IonThumbnail>
                                    <div style={{paddingTop:"10px"}}>
                                        <div className="pad-v-mini">name name name</div>
                                        <div className="pad-v-mini">example@gmail.com</div>
                                        <div className="pad-v-mini">1473-459-8999</div>
                                        <div className="pad-v-mini">grenada, st.georges, tempe</div>
                                        <div className="pad-v-mini">role: Admin</div>
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
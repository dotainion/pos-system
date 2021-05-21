import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonViewWillLeave } from '@ionic/react';
import { addOutline, settings } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { MenuBarWrapper } from '../components/MenuBar';
import { useStore } from '../context/Store';



export const Settings = () =>{
    const { settings, setSettings, changeSettings } = useStore();

    const [isChange, setIsChange] = useState(false);
    const rewardRef = useRef();
    const taxRef = useRef();

    const settingsObj = () =>{
        return {
            reward: rewardRef.current.value,
            tax: taxRef.current.value,
        }
    }
    const onSave = async() =>{
        setIsChange(false);
        setSettings(settingsObj());
        //await changeSettings(settingsObj());
    }

    useEffect(()=>{
        rewardRef.current.value = settings?.reward || "";
        taxRef.current.value = settings?.tax || "";
    },[]);

    return(
        <IonPage>
            <MenuBarWrapper onSave={onSave} saveBtnHilight={isChange}>
                <IonList class="item-container">
                    <div className="pad-h-xl silver border radius">
                        <div className="flex d-flex-on-mobile">
                            <Entry onChange={()=>setIsChange(true)} entryRef={rewardRef} label="Customer reward persentage" style={{width:"100%"}} labelColor="black" placeholder="Reward percentage amount" type="number" percentSign />
                            <Entry onChange={()=>setIsChange(true)} entryRef={taxRef} label="Tax Rate" style={{width:"100%"}} labelColor="black" placeholder="Tax rate" type="number" percentSign />
                        </div>
                    </div>
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
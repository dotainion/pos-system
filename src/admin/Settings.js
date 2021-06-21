import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonViewWillLeave } from '@ionic/react';
import { addOutline, settings } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { MenuBarWrapper } from '../components/MenuBar';
import { useStore } from '../context/Store';
import { UpdateDiscount } from '../widgets/UpdateDiscount';



export const Settings = () =>{
    const { settings, changeSettings, discounts, setDiscounts} = useStore();

    const [isChange, setIsChange] = useState(false);

    const rewardRef = useRef();
    const taxRef = useRef();
    
    const onSave = async() =>{
        await changeSettings({
            discounts: discounts,
            reward: rewardRef.current.value,
            tax: taxRef.current.value,
        });
        setIsChange(false);
    }

    const onClearChanges = () =>{
        //reset discounts lists
        setDiscounts(settings?.discounts);
        //reset sales wreward adn text value
        rewardRef.current.value = settings?.reward || "";
        taxRef.current.value = settings?.tax || "";
        //reset change make value
        setIsChange(false);
    }

    useEffect(()=>{
        rewardRef.current.value = settings?.reward || "";
        taxRef.current.value = settings?.tax || "";
    },[settings]);

    return(
        <IonPage>
            <MenuBarWrapper onSave={onSave} barChildren={
                <div>
                    <button hidden={!isChange} onClick={onClearChanges} className="silver radius pad click" style={{color:"orangeRed"}}>Clear Changes</button>
                </div>
            } saveBtnHilight={isChange}>
                <IonList class="item-container">
                    <div hidden={!isChange} className="float-top-left centered max-width pad-mini" style={{color:"green"}}>You may have items that needs to be save</div>
                    <div className="pad-h-xl gray border radius" style={{marginBottom:"20px"}}>
                        <div className="popup-header">Sales reward and tax rate</div>
                        <div className="flex d-flex-on-mobile">
                            <Entry onChange={()=>setIsChange(true)} entryRef={rewardRef} label="Customer reward persentage" style={{width:"100%"}} placeholder="Reward percentage amount" type="number" percentSign />
                            <Entry onChange={()=>setIsChange(true)} entryRef={taxRef} label="Tax Rate" style={{width:"100%"}} placeholder="Tax rate" type="number" percentSign />
                        </div>
                    </div>
                    <UpdateDiscount
                        isOpen={true}
                        onChangeDetect={setIsChange}
                    />
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
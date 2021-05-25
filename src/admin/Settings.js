import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonViewWillLeave } from '@ionic/react';
import { addOutline, settings } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { MenuBarWrapper } from '../components/MenuBar';
import { Select } from '../components/Select';
import { useStore } from '../context/Store';
import { discountTypes } from '../content/lists';



export const Settings = () =>{
    const { settings, changeSettings } = useStore();

    const [isChange, setIsChange] = useState(false);
    const [appendedDiscounts, setAppendedDiscounts] = useState([]);
    const [onDiscountTypeChange, setOnDiscountTypeChange] = useState();
    const [discRunsOnce, setDiscRunsOnce] = useState(true);
    const [discRunsMulti, setDiscRunsMulti] = useState(false);

    const rewardRef = useRef();
    const taxRef = useRef();
    const discountTypRef = useRef();
    const discountNameRef = useRef();
    const discountAmountRef = useRef();

    const appendDiscount = () =>{
        if (!discountNameRef.current.value) return;
        if (!discountAmountRef.current.value) return;
        let type = "";
        if (discountTypRef.current.value.includes("%")) type = "%";
        if (discountTypRef.current.value.includes("$")) type = "$";
        setAppendedDiscounts([
            ...appendedDiscounts,
            {
                type: type,
                title: discountNameRef.current.value,
                discount: discountAmountRef.current.value,
                runOnce: discRunsOnce,
            }
        ]);
        setIsChange(true);
    }
    
    const onSave = async() =>{
        await changeSettings({
            discounts: appendedDiscounts,
            reward: rewardRef.current.value,
            tax: taxRef.current.value,
        });
        setIsChange(false);
    }

    const toggleDiscRuns = (cmd) =>{
        if (cmd === "once"){
            setDiscRunsOnce(true);
            setDiscRunsMulti(false);
        }if (cmd === "multi"){
            setDiscRunsMulti(true);
            setDiscRunsOnce(false);
        }
        console.log(discRunsOnce);
        console.log(discRunsMulti);
    }

    //detect change in discount list and delete feilds
    useEffect(()=>{
        discountNameRef.current.value = "";
        discountAmountRef.current.value = "";
    },[appendedDiscounts]);

    useEffect(()=>{
        setOnDiscountTypeChange(discountTypRef.current.value);
        setAppendedDiscounts(settings?.discounts || []);
        rewardRef.current.value = settings?.reward || "";
        taxRef.current.value = settings?.tax || "";
    },[]);

    return(
        <IonPage>
            <MenuBarWrapper onSave={onSave} saveBtnHilight={isChange}>
                <IonList class="item-container">
                    <div className="pad-h-xl silver border radius">
                        <div className="popup-header">Sales reward and tax rate</div>
                        <div className="flex d-flex-on-mobile">
                            <Entry onChange={()=>setIsChange(true)} entryRef={rewardRef} label="Customer reward persentage" style={{width:"100%"}} placeholder="Reward percentage amount" type="number" percentSign />
                            <Entry onChange={()=>setIsChange(true)} entryRef={taxRef} label="Tax Rate" style={{width:"100%"}} placeholder="Tax rate" type="number" percentSign />
                        </div>
                    </div>
                    <div className="pad-h-xl silver border radius" style={{marginTop:"20px"}}>
                        <div className="popup-header">Apply discounts</div>
                        <div className="flex d-flex-on-mobile">
                            <div className="settings-discount-container gray3 scrollbar">
                                {
                                    appendedDiscounts?.length?
                                    appendedDiscounts?.map((disc, key)=>(
                                        <div className="discount-item click" key={key}>
                                            <label>{disc?.title}</label>
                                        </div>
                                    )):
                                    <div>No discounts</div>
                                }
                            </div>
                            <div className="settings-discount-left-container">
                                <Select label="Discount type" selectRef={discountTypRef} onChange={e=>setOnDiscountTypeChange(e.target.value)} options={discountTypes} defaultValue={discountTypes[1]} />
                                <Entry label="Name of discount" entryRef={discountNameRef} placeholder="Give discount a name" />
                                <Entry label="Discounts" entryRef={discountAmountRef} placeholder="Play discount here" type="number" dollarSign={onDiscountTypeChange?.includes?.("$")} percentSign={onDiscountTypeChange?.includes?.("%")} />
                            </div>
                        </div>
                        <div onClick={()=>toggleDiscRuns("once")} className="flex pad-mini">
                            <input onChange={()=>toggleDiscRuns("once")} checked={discRunsOnce} type="checkbox"/>
                            <label className="pad-h-mini">Allow discount to be applied only once</label>
                        </div>
                        <div onClick={()=>toggleDiscRuns("multi")} className="flex pad-mini">
                            <input onChange={()=>toggleDiscRuns("multi")} checked={discRunsMulti} type="checkbox"/>
                            <label className="pad-h-mini">Allow discount to be applied multiple times</label>
                        </div>
                        <div className="pad-xl" style={{textAlign:"right"}}>
                            <button onClick={appendDiscount} className="pad shadow silver radius click">Add discount</button>
                        </div>
                    </div>
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
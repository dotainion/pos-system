import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonViewWillLeave } from '@ionic/react';
import { addOutline, settings, timeOutline, timeSharp } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../../widgets/Entry';
import { useStore } from '../../context/Store';
import { Select } from '../../widgets/Select';


let optionList = [];
for (let i=0;i<24;i++){
    const hour = i===0?"hour":"hours";
    optionList.push(`${i+1} ${hour}`);
}

export const LoginState = ({onChange, isChange, onChangeMade}) =>{
    const { settings } = useStore();

    const [entryIdleAction, setEntryIdleAction] = useState(false);
    const [adminIdleAction, setAdminIdleAction] = useState(false);

    const entryIdleRef = useRef();
    const adminIdleRef = useRef();

    //call onChange funtion each time change is made to update value
    const triggerOnChange = () =>{
        onChange({
            entry: entryIdleAction? entryIdleRef.current.value: "",
            admin: adminIdleAction? adminIdleRef.current.value: ""
        });
    }

    //this will trigger useEffect with [adminIdleAction, entryIdleAction]
    //to trigger input value initialization
    const inititialize = () =>{
        if (settings?.loginIdle?.admin) setAdminIdleAction(true);
        else setAdminIdleAction(false);
        if (settings?.loginIdle?.entry) setEntryIdleAction(true);
        else setEntryIdleAction(false);
    }

    //check for change in isChange and if its false re-inititialize value;
    useEffect(()=>{
        if (!isChange) inititialize();
    },[isChange]);


    //detect change in check box selection and init values in input
    useEffect(()=>{
        const idle = settings?.loginIdle;
        if (adminIdleAction) adminIdleRef.current.value = idle?.admin || optionList[0];
        else adminIdleRef.current.value = "Off";
        if (entryIdleAction) entryIdleRef.current.value = idle?.entry || optionList[0];
        else entryIdleRef.current.value = "Off";
        triggerOnChange();
    },[adminIdleAction, entryIdleAction]);

    //detect change in setings and initialize value
    useEffect(()=>{
        inititialize();
    },[settings]);
    
    return(
        <div>
            <div className="pad-h-xl gray border radius margin-v-bottom" style={{paddingBottom:"20px"}}>
                <div className="popup-header">Login State</div>
                <div className="flex border-bottom" style={{marginBottom:"10px",paddingBottom:"10px"}}>
                    <div className="max-width">
                        <Select
                            options={optionList} 
                            defaultValue="Off"
                            optionStyle={{paddingLeft:"20px"}} 
                            cssClass="half-width max-width-on-mobile" 
                            label="Order entry iddle time" 
                            selectRef={entryIdleRef}
                            onChange={()=>onChangeMade(true)}
                            disabled={!entryIdleAction}
                        >
                            <IonIcon 
                                style={{
                                    paddingLeft:"20px",
                                    marginTop:"5px",
                                    color:"var(--dark-gray)"
                                }} 
                                icon={timeSharp} 
                            />
                        </Select>
                    </div>
                    <div className="flex pad-mini max-width relative">
                        <div className="float-left" style={{paddingLeft:"10px"}}>
                            <input onClick={()=>onChangeMade(true)} onChange={e=>setEntryIdleAction(e.target.checked)} checked={entryIdleAction} type="checkbox"/>
                            <label className="pad-h-mini">Log off <b>order entry</b> when iddle for <span>(order entry iddle time)</span></label>
                        </div>
                    </div>
                </div>
                <div className="flex border-bottom" style={{marginBottom:"10px",paddingBottom:"10px"}}>
                    <div className="max-width">
                        <Select
                            options={optionList} 
                            defaultValue="Off"
                            optionStyle={{paddingLeft:"20px"}} 
                            cssClass="half-width max-width-on-mobile" 
                            label="Admin iddle time" 
                            selectRef={adminIdleRef}
                            onChange={()=>onChangeMade(true)}
                            disabled={!adminIdleAction}
                        >
                            <IonIcon 
                                style={{
                                    paddingLeft:"20px",
                                    marginTop:"5px",
                                    color:"var(--dark-gray)",
                                }} 
                                icon={timeSharp} 
                            />
                        </Select>
                    </div>
                    <div className="flex pad-mini max-width relative">
                        <div className="float-left" style={{paddingLeft:"10px"}}>
                            <input onClick={()=>onChangeMade(true)} onChange={e=>setAdminIdleAction(e.target.checked)} checked={adminIdleAction} type="checkbox"/>
                            <label className="pad-h-mini">Log off <b>admin</b> when iddle for <span>(admin iddle time)</span></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
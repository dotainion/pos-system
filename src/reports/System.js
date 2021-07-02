import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { useStore } from '../context/Store';
import { Loader } from '../components/Loader';



export const System = ({isOpen, setBarChild}) =>{
    const { user, settings, changeSettings } = useStore();

    const [loading, setLoading] = useState(false);

    const lowStockLimitRef = useRef();

    const onSave = async() =>{
        setLoading(true);
        await changeSettings({
            lowStock: lowStockLimitRef.current.value,
        });
        setLoading(false);
    }
    
    useEffect(()=>{
        lowStockLimitRef.current.value = settings?.lowStock || "";
    },[settings]);

    //set icon to menuBar header
    useEffect(()=>{
        if (isOpen) setBarChild?.(<button
                className="pad radius silver click"
                onClick={onSave}
                disabled={loading}
            >Save</button>);
        else setBarChild(null);
    },[isOpen]);
    return(
        <div hidden={!isOpen} className="relative" style={{height:"80vh"}}>
            <Loader isOpen={loading}/>
            <div className="half-width max-width-on-mobile float-top-center">
                <div className="popup-header">Report System</div>
                <Entry label="Low stock limit" entryRef={lowStockLimitRef} type="number" placeholder="Set low stock limit value here" />
            </div>
        </div>
    )
}
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';


export const Dropdown = ({cssClass, onSelect, options, children}) =>{
    const [showDropdown, setShowDropdown] = useState(false);

    const triggerSelect = (value) =>{
        if (typeof onSelect === "function") onSelect(value?.title);
        if (typeof value?.command === "function") value?.command (value?.title);
        setShowDropdown(false);
    }
    return(
        <div onMouseOver={()=>setShowDropdown(true)} onMouseLeave={()=>setShowDropdown(false)} className={cssClass} style={{position:"relative"}}>
            <label>{children}<IonIcon icon={chevronDownOutline}/></label>
            <div hidden={!showDropdown} className="float-bottom-overflow dropdown">
                {options?.map((option, key)=>(
                    <div onClick={()=>triggerSelect(option)} key={key}>{option?.title}</div>
                ))}
            </div>
        </div>
    )
}
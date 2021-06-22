import { IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import React, { useState } from 'react';


export const FlickerLabel = ({isOpen, cssClass, innerCssClass, message, onIconClick}) =>{
    const [showLabel, setShowLabel] = useState(false);
    return(
        <div hidden={!isOpen} className={`centered pad-mini ${cssClass}`}>
            <div className={`flicker ${innerCssClass}`}>
                <label className="relative" style={{color:"white"}}>
                    <span>{message}</span>
                    <div className="float-right" style={{right:"-20px"}}>
                        <IonIcon onClick={onIconClick} onMouseEnter={()=>setShowLabel(true)} onMouseLeave={()=>setShowLabel(false)} icon={closeCircleOutline}/>
                        <div hidden={!showLabel} className="bg pad-mini border float-bottom-overflow" style={{fontSize:"12px"}}>Reset</div>
                    </div>
                </label>
            </div>
        </div>
    )
}
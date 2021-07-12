import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';

export const FlexContainer = ({isOpen, onClose, closeOnBackdrop, style, alertType, transparent, children}) =>{
    return(
        <div hidden={!isOpen} onClick={()=>{closeOnBackdrop && onClose?.()}} className="backdrop" style={{background:transparent && "transparent"}}>
            <div className="float-center bg radius shadow2" style={{width: alertType && "350px",...style}} onClick={(e)=>e.stopPropagation()}>
                <IonIcon hidden={!onClose} onClick={onClose} class="close" icon={closeOutline}/>
                {children}
            </div>
        </div>
    )
}
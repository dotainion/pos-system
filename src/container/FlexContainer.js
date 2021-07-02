import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';

export const FexContainer = ({isOpen, onClose, closeOnBackdrop, style, children}) =>{
    return(
        <div hidden={!isOpen} onClick={()=>{closeOnBackdrop && onClose?.()}} className="backdrop">
            <div className="float-center bg radius shadow2" style={style} onClick={(e)=>e.stopPropagation()}>
                <IonIcon hidden={onClose} onClick={onClose} class="close" icon={closeOutline}/>
                {children}
            </div>
        </div>
    )
}
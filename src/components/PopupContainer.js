import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';


export const PopupContainer = ({isOpen, onClose, style, noBackdropDismist, children}) =>{
    const closeOnBackdrop = () =>{
        if (!noBackdropDismist) onClose?.();
    }
    return(
        <div hidden={!isOpen} onClick={closeOnBackdrop} className="backdrop">
            <div className="float-center popup-container silver" style={style} onClick={(e)=>e.stopPropagation()}>
                <IonIcon onClick={onClose} class="close" icon={closeOutline}/>
                {children}
            </div>
        </div>
    )
}
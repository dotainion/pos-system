import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';


export const ModalContainer = ({isOpen, onClose, style, noBackdropDismist, bgTransparant, floatMaxWidth, children}) =>{
    const closeOnBackdrop = () =>{
        if (!noBackdropDismist) onClose?.();
    }
    return(
        <div hidden={!isOpen} onClick={closeOnBackdrop} className="backdrop" style={{background:bgTransparant && "transparent"}}>
            <div className="float-center popup-container bg shadow2" style={{width:floatMaxWidth && "100%",...style}} onClick={(e)=>e.stopPropagation()}>
                <IonIcon onClick={onClose} class="close" icon={closeOutline}/>
                {children}
            </div>
        </div>
    )
}
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';


export const PopupContainer = ({isOpen, onClose, style, children}) =>{
    return(
        <div hidden={!isOpen} onClick={onClose} className="backdrop">
            <div className="float-center popup-container popup-bg" style={style} onClick={(e)=>e.stopPropagation()}>
                <IonIcon onClick={onClose} class="close" icon={closeOutline}/>
                {children}
            </div>
        </div>
    )
}
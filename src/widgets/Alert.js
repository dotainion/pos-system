import { IonAlert } from '@ionic/react';
import React from 'react';


export const Alert = ({isOpen, hideCancelButton, header, message, onConfirm, onClose}) =>{
    const onTriggerConfirm = () =>{
        onConfirm?.();
        onClose?.();
    }
    return(
        <div hidden={!isOpen} onClick={onClose} className="backdrop">
            <div className="float-center alert-container silver" onClick={e=>e.stopPropagation()}>
                <p><b>{header || "Confirm!"}</b></p>
                <p>{message}</p>
                <p>
                    <button onClick={onTriggerConfirm} className="pad radius silver" style={{float:"right"}}>Okay</button>
                    <button hidden={hideCancelButton} onClick={onClose} className="pad radius silver" style={{float:"right"}}>Cancel</button>
                </p>
            </div>
        </div>
    )
}
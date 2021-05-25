import { IonAlert } from '@ionic/react';
import React from 'react';


export const Alert = ({isOpen, hideCancelButton, header, message, onConfirm, onClose, okText, cancelText, headerColor, messageColor}) =>{
    const onTriggerConfirm = () =>{
        onConfirm?.();
        onClose?.();
    }
    return(
        <div hidden={!isOpen} onClick={onClose} className="backdrop">
            <div className="float-center alert-container silver" onClick={e=>e.stopPropagation()}>
                <p style={{color:headerColor}}><b>{header || "Confirm!"}</b></p>
                <p style={{color:messageColor}}>{message}</p>
                <p>
                    <button onClick={onTriggerConfirm} className="pad radius silver" style={{float:"right",minWidth:"50px"}}>{okText || "Okay"}</button>
                    <button hidden={hideCancelButton} onClick={onClose} className="pad radius silver" style={{float:"right",minWidth:"50px"}}>{cancelText || "Cancel"}</button>
                </p>
            </div>
        </div>
    )
}
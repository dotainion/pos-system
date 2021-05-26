import { IonAlert } from '@ionic/react';
import React from 'react';


export const Alert = ({isOpen, hideCancelButton, header, message, onConfirm, onClose, okText, cancelText, headerColor, messageColor}) =>{
    const onTriggerConfirm = () =>{
        onConfirm?.();
        onClose?.();
    }
    return(
        <div hidden={!isOpen} onClick={onClose} className="backdrop">
            <div className="float-center alert-container bg" onClick={e=>e.stopPropagation()}>
                <p className="gray2 pad" style={{color:headerColor}}><b>{header || "Confirm!"}</b></p>
                <p className="pad-xl" style={{color:messageColor}}>{message}</p>
                <p style={{paddingRight:"25px"}}>
                    <button onClick={onTriggerConfirm} className="btn">{okText || "Okay"}</button>
                    <button hidden={hideCancelButton} onClick={onClose} className="btn">{cancelText || "Cancel"}</button>
                </p>
            </div>
        </div>
    )
}
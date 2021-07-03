import { IonAlert } from '@ionic/react';
import React from 'react';
import { FlexContainer } from '../container/FlexContainer';
import { Button } from '../widgets/Button';


export const Alert = ({isOpen, hideCancelButton, header, message, onConfirm, onClose, okText, cancelText, headerColor, messageColor}) =>{
    const onTriggerConfirm = () =>{
        onConfirm?.();
        onClose?.();
    }
    return(
        <FlexContainer isOpen={isOpen} onClose={onClose}>
            <div className="radius-top">
                <div className="gray2 radius-top pad" style={{color:headerColor}}><b>{header || "Confirm!"}</b></div>
                <p className="pad-xl" style={{color:messageColor}}>{message}</p>
                <p style={{paddingRight:"25px",textAlign:"right"}}>
                    <Button onClick={onTriggerConfirm} text={okText || "Okay"} spacing />
                    <Button hidden={hideCancelButton} onClick={onClose} text={cancelText || "Cancel"} />
                </p>
            </div>
        </FlexContainer>
    )
}
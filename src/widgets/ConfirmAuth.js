import React from 'react';
import { Entry } from '../components/Entry';


export const ConfirmAuthentication = ({isOpen, onClose}) =>{
    return(
        <div hidden={!isOpen} className="backdrop">
            <div className="float-center">
                <Entry label="Email"/>
                <Entry label="Password"/>
            </div>
        </div>
    )
}
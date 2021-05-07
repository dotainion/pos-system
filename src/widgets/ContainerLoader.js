import React from 'react';
import { ImSpinner9 } from 'react-icons/im';


export const ContainerLoader = ({isOpen}) =>{
    return(
        <div hidden={!isOpen} className="container-backdrop">
            <ImSpinner9 className="float-center spinner" />
        </div>
    )
}
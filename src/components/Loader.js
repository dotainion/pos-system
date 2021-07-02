import React from 'react';
import { ImSpinner9 } from 'react-icons/im';


export const Loader = ({isOpen,noBackdrop}) =>{
    return(
        <div hidden={!isOpen} className="container-backdrop" style={{backgroundColor:noBackdrop && "transparent"}}>
            <ImSpinner9 className="float-center spinner" style={{color:noBackdrop && "black"}} />
        </div>
    )
}
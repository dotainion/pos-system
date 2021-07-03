import { IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import React from 'react';
import { FaDatabase } from 'react-icons/fa';


export const NoRecords = ({onRefresh, float, message, contentCenter, color, cssClass, style}) =>{
    return(
        <div className={`max-size relative ${cssClass}`} 
            style={{textAlign:!contentCenter && "center",...style}}>
            <div className={`${!float && "float-center"}`} style={{color:color}}>
                <label>{message || "No Records Found"}</label>
                <IonIcon hidden={!onRefresh} onClick={onRefresh} class="pad-h-mini" icon={refreshOutline}/>
                <div className="pad relative" style={{fontSize:"30px"}}>
                    <FaDatabase/>
                    <div className="float-center" style={{color:"red"}}>X</div>
                </div>
            </div>
        </div>
    )
}
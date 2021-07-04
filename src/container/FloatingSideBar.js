import { IonIcon } from '@ionic/react';
import { exitOutline, reorderFourOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';



export const FloatingSideBar = ({isOpen, onClose, right, header, children}) =>{
    const [flicker, setFlicker] = useState("");

    useEffect(()=>{
        if(flicker) setTimeout(() => {
            setFlicker("");
        }, 300);
    },[flicker]);
    return(
        <div hidden={!isOpen} onClick={()=>setFlicker("alert-shack")} className="floating-side-bar-backdrop">
            <div className={`floating-side-bar bg shadow2 ${flicker}`} style={{right: right && "0"}} onClick={e=>e.stopPropagation()}>
                <div className="flex pad-xl"
                    style={{
                        fontSize:"30px",
                        borderBottom:"1px solid black",
                        marginLeft:"10px",
                        marginRight:"10px"
                    }}>
                    <IonIcon onClick={onClose} icon={reorderFourOutline} />
                    <div className="pad-mini" style={{fontSize:"20px"}}>{header || "Menu Items"}</div>
                </div>
                {children}
            </div>
        </div>
    )
}
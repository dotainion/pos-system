import { IonIcon } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import React, { useState } from 'react';


export const ButtonWithOption = ({isOpen, options, cssClass, iconCssClass, style, iconStyle, icon}) =>{
    const [showChildren, setShowChildren] = useState(false);
    const onCommand = (obj) =>{
        obj?.command?.()
        setShowChildren(false);
    }
    return(
        <div className={cssClass} style={style}>
            <IonIcon onClick={()=>setShowChildren(true)} class={`close-hover click ${iconCssClass}`} style={{fontSize:"20px",...iconStyle}} icon={icon?icon:trashOutline} />
            <div hidden={!showChildren} onMouseLeave={()=>setShowChildren(false)} className="float-center bg shadow2" style={{borderRadius:"8px",zIndex:"99"}}>
                {options?.map((opt, key)=>(
                    <div
                        className="label-hover pad-h-mini no-wrap radius"
                        style={{padding:"3px",margin:"3px"}}
                        key={key}
                        onClick={()=>onCommand(opt)}
                    >
                        <label>{opt?.title}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}
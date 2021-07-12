import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';


export const Button = ({text, infoMessage, color, left, right, disabled, shadow, type, heilight, backgroundColor, defaultColor, withBorder, withBorderColor, transparent, cssClass, hidden, largeIcon, spacing, topSpacing, onClick, style, children}) =>{
    const [showInfo, setShowInfo] = useState(false);

    const timeoutRef = useRef();

    const triggerShowInfo = () =>{
        if (infoMessage){
            timeoutRef.current = setTimeout(() => {
                setShowInfo(true);
            }, 1000);
        }
    }

    const triggerHideInfo = () =>{
        clearTimeout(timeoutRef.current);
        setShowInfo(false);
    }

    return(
        <button
            onClick={()=>onClick?.({value: text})}
            onMouseEnter={triggerShowInfo}
            onMouseLeave={triggerHideInfo}
            disabled={disabled}
            hidden={hidden}
            style={{
                ...style,
                color: !color? heilight && "var(--border-heilight)":color,
                minWidth:"50px",
                marginTop: topSpacing && "5px",
                marginLeft: spacing && "10px" || left,
                marginRight: spacing && "10px" || right,
                background: !backgroundColor? transparent && "transparent":backgroundColor,
                border:!heilight? transparent && withBorder? `1px solid ${withBorderColor}`: "none":"1px solid var(--border-heilight)",
                boxShadow:transparent && "none" || shadow,
            }}
            className={`${cssClass} ${defaultColor && "btn-color-override"} pad-mini no-wrap btn relative`}
        >{text}{children}
            {
                type?.includes("add")
                ?   <IonIcon
                        class="btn-dark-hoverride" 
                        style={{fontSize: largeIcon && "30px",borderRadius:"50%"}} 
                        icon={addOutline}
                    />
                :   null
            }
            <div hidden={!showInfo} className="float-bottom-overflow no-wrap border" style={{fontSize:"11px",backgroundColor:"white",padding:"2px"}}>
                <span>{infoMessage}</span>
            </div>
        </button>
    )
}
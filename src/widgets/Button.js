import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';


export const Button = ({text, disabled, type, heilight, defaultColor, withBorder, transparent, cssClass, hidden, largeIcon, spacing, onClick, style, children}) =>{
    return(
        <button
            onClick={onClick}
            disabled={disabled}
            hidden={hidden}
            style={{
                ...style,
                color: heilight && "var(--border-heilight)",
                marginLeft: spacing && "10px",
                marginRight: spacing && "10px",
                background: transparent && "transparent",
                border:!heilight? transparent && withBorder? "": "none":"1px solid var(--border-heilight)",
                boxShadow:transparent && "none",
            }}
            className={`${cssClass} ${defaultColor && "btn-color-override"} pad btn`}
        >{text}
            {
                type?.includes("add")
                ?   <IonIcon
                        class="btn-dark-hoverride" 
                        style={{fontSize: largeIcon && "30px",borderRadius:"50%"}} 
                        icon={addOutline}
                    />
                :   null
            }
        </button>
    )
}
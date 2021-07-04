import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React from 'react';


export const Button = ({text, color, disabled, type, heilight, backgroundColor, defaultColor, withBorder, withBorderColor, transparent, cssClass, hidden, largeIcon, spacing, topSpacing, onClick, style, children}) =>{
    return(
        <button
            onClick={onClick}
            disabled={disabled}
            hidden={hidden}
            style={{
                ...style,
                color: !color? heilight && "var(--border-heilight)":color,
                marginTop: topSpacing && "5px",
                marginLeft: spacing && "10px",
                marginRight: spacing && "10px",
                background: !backgroundColor? transparent && "transparent":backgroundColor,
                border:!heilight? transparent && withBorder? `1px solid ${withBorderColor}`: "none":"1px solid var(--border-heilight)",
                boxShadow:transparent && "none",
            }}
            className={`${cssClass} ${defaultColor && "btn-color-override"} pad btn`}
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
        </button>
    )
}
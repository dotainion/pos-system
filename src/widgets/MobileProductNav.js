import { IonIcon } from '@ionic/react';
import { addOutline, cartOutline } from 'ionicons/icons';
import React, { useState } from 'react';


export const MobileOrderEntryNav = ({onClick,value}) =>{
    const [changeIcon, setChangeIcon] = useState(addOutline);
    const triggerClick = () =>{ //backdrop-on-mobile  //hide-on-mobile
        if (value === "hide-on-mobile"){
            setChangeIcon(cartOutline);
            onClick?.("backdrop-on-mobile");
        }else{
            setChangeIcon(addOutline);
            onClick?.("hide-on-mobile");
        }
    }
    return(
        <div className="cart-mobile-bottom-nav hide-on-desktop dark">
            <IonIcon onClick={triggerClick} class="float-center mobile-bottom-nav-icon" icon={changeIcon}/>
        </div>
    )
}
import { IonProgressBar } from '@ionic/react';
import React from 'react';

export const Progressing = ({isOpen,color="light"}) =>{
    return(
        <IonProgressBar
            style={{visibility:!isOpen && "hidden"}}
            color={color}
            type="indeterminate"
            value={0.5}
        />
    )
}
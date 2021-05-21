import React from 'react';
import { BlankPage } from '../widgets/BlankPage';



export const System = ({isOpen}) =>{
    return(
        <div hidden={!isOpen} style={{height:"80vh"}}>
            <BlankPage title="System" />
        </div>
    )
}
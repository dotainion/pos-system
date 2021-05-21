import React from 'react';
import { BlankPage } from '../widgets/BlankPage';



export const CashDrawers = ({isOpen}) =>{
    return(
        <div hidden={!isOpen} style={{height:"80vh"}}>
            <BlankPage title="Cash Drawers"/>
        </div>
    )
}
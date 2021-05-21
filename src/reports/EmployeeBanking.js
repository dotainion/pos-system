import React from 'react';
import { BlankPage } from '../widgets/BlankPage';



export const EmployeeBanking = ({isOpen}) =>{
    return(
        <div hidden={!isOpen} style={{height:"80vh"}}>
            <BlankPage title="Employee Banking" />
        </div>
    )
}
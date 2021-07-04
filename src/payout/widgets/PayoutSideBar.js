import React, { useState } from 'react';
import { Calendar } from '../../app/Calendar';
import { FloatingSideBar } from '../../container/FloatingSideBar';


export const PayoutSideBar = ({isOpen, onClose}) =>{
    const [showCalendar, setShowCalendar] = useState(false);
    const menuList = [
        {
            title: "Options",
            command: null
        }
    ];

    const toggleCalendar = () =>{
        if(showCalendar) setShowCalendar(false);
        else setShowCalendar(true);
    }
    return(
        <FloatingSideBar isOpen={isOpen} onClose={onClose} right>
            
            <div className="pad">
                <Calendar hidden={!showCalendar} />
                <div className="pad-v-mini">
                    <div 
                        onClick={toggleCalendar} 
                        className="pad" 
                        style={{
                            backgroundColor:"var(--dark-gray)",
                            color:showCalendar?"orange":"white"
                        }}
                    >{showCalendar?"Hide Calendar":"Filter By Date"}</div>
                </div>
                {menuList.map((btn, key)=>(
                    <div className="pad-v-mini" key={key}>
                        <div onClick={()=>btn.command?.()}
                            className="pad"
                            style={{backgroundColor:"var(--dark-gray)",color:"white"}}
                        >{btn.title}</div>
                    </div>
                ))}
            </div>
        </FloatingSideBar>
    )
}
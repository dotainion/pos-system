import { IonIcon, IonItem } from '@ionic/react';
import { backspaceOutline, people, peopleOutline, reorderFourOutline, reorderThreeOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { IoReturnUpBack } from 'react-icons/io5';
import { reportBtns } from '../content/lists';

export const ReportBtnAndContainer = ({isOpen, onSelect, btnHilight, children}) =>{
    const [showChildReport, setShowChildReport] = useState("");
    

    const triggerSelect = (value) =>{
        onSelect?.(value);
        setShowChildReport("show-on-mobile");
    }
    return(
        <div hidden={!isOpen} className="flex d-flex-on-mobile relative">
            <div className={`half-width max-width-on-mobile report-mobile-show-over ${showChildReport}`} style={{backgroundColor:"white"}}>
                <div className="flex">
                    <IoReturnUpBack onClick={()=>setShowChildReport("hide-on-mobile")} className="hide-on-desktop" style={{fontSize:"30px",margin:"5px"}}/>
                    <div className="relative hide-on-desktop">
                        <label className="float-left pad">Reports</label>
                    </div>
                </div>
                <div className="report-children-container scrollbar">
                    {children}
                </div>
            </div>
            <div className="report-main-container">
                {reportBtns.map((title, key)=>(
                    <div className="report-container" key={key}>
                        <div onClick={()=>triggerSelect(title)} style={{color:btnHilight === title? "orange": ""}} className="report-inner-container flex dark">
                            <div className="pad">
                                <AiOutlineMenuUnfold style={{fontSize:"30px"}}/>
                            </div>
                            <div className="relative max-width">
                                <span className="float-left">{title}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
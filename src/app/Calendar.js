import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { tools } from '../tools/Tools';


export const CalendarPopup = ({isOpen, onClose, onSelect, closeOnSelect}) =>{
    const [value, setValue] = useState(new Date());
    const tiggerSelect = (dateValue) =>{
        onSelect?.(dateValue);
        setValue(dateValue);
        if (closeOnSelect) onClose?.();
    }
    return(
        <div hidden={!isOpen} onClick={onClose} className="backdrop">
            <div className="float-center" onClick={e=>e.stopPropagation()}>
                <IonIcon onClick={onClose} icon={closeOutline} class="pad close-hover" style={{float:"right"}}/>
                <Calendar onSelect={tiggerSelect} />
                <div className="pad relative" style={{backgroundColor:"white",margin:"1px",textAlign:"right"}}>
                    <label className="float-left pad-mini">{tools.formatDate(value)}</label>
                    <button onClick={onClose} className="pad-mini silver">Done</button>
                </div>
            </div>
        </div>
    )
}


export const Calendar= ({hidden, onSelect}) =>{
    const [value, setValue] = useState(new Date());
    const tiggerSelect = (dateValue) =>{
        onSelect?.(dateValue);
    }
    return(
        <div hidden={hidden}>
            <ReactCalendar
                onChange={setValue}
                value={value}
                onClickDay={tiggerSelect}
            />
        </div>
    )
}
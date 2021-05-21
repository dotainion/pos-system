import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


export const Calendar = ({isOpen, onClose, onSelect}) =>{
    const [value, setValue] = useState(new Date());
    return(
        <div hidden={!isOpen} onClick={onClose} className="backdrop">
            <div className="float-center" onClick={e=>e.stopPropagation()}>
                <IonIcon onClick={onClose} icon={closeOutline} class="pad close-hover" style={{float:"right"}}/>
                <ReactCalendar
                    onChange={setValue}
                    value={value}
                    onClickDay={onSelect}
                />
                <div className="pad" style={{backgroundColor:"white",margin:"1px",textAlign:"right"}}>
                    <button onClick={onClose} className="pad-mini silver">Done</button>
                </div>
            </div>
        </div>
    )
}
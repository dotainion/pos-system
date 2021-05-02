import React, { useState } from 'react';


export const Entry = ({placeholder, edit, entryRef, onChange, label, cssClass, type, dollarSign}) =>{
    const [value, setValue] = useState("");
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }
    return(
        <div className={`entry-input-container ${cssClass}`}>
            <div><label>{label}</label></div>
            <span className={dollarSign && "dollar-sign"}>
                <input ref={entryRef} onChange={triggerChange} type={type} className="input" placeholder={placeholder} />
            </span>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
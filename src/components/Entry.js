import React, { useState } from 'react';


export const Entry = ({placeholder, edit, entryRef, onChange, label, cssClass, type, dollarSign, labelColor, style, error}) =>{
    const [value, setValue] = useState("");
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }
    return(
        <div className={`entry-input-container ${cssClass}`} style={style}>
            <div><label style={{color:labelColor}}>{label}</label></div>
            <span className={dollarSign && "dollar-sign"} style={{position:"relative"}}>
                <input ref={entryRef} onChange={triggerChange} type={type} style={{border:error && "1px solid red"}} className="input" placeholder={placeholder} />
                <div className="float-bottom-overflow font-mini" style={{color:"red",bottom:"-45%"}}>{error}</div>
            </span>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
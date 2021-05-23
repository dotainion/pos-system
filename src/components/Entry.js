import React, { useEffect, useState } from 'react';


export const Entry = ({placeholder, edit, entryRef, required, optional, onChange, onClick, onKeyPress, inputPops, label, cssClass, type, dollarSign, percentSign, labelColor, style, error}) =>{
    const [value, setValue] = useState("");
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }
    return(
        <div className={`entry-input-container ${cssClass}`} style={style}>
            <div>
                <label style={{color:labelColor || "rgb(3, 37, 68)"}}>{label}</label>
                <span style={{color:"red"}}>{required && "*"}</span>
                <span style={{fontSize:"11px",color:"dodgerblue"}}>{optional && " Optional"}</span>
            </div>
            <span className={dollarSign && "dollar-sign" || percentSign && "percent-sign"} style={{position:"relative"}}>
                <input ref={entryRef} onKeyPress={onKeyPress} onClick={onClick} {...inputPops} onChange={triggerChange} type={type} style={{border:error && "1px solid red",height:type === "date"?"34px":null}} className="input" placeholder={placeholder} />
                <div className="float-bottom-overflow font-mini" style={{color:"red",bottom:"-45%"}}>{error}</div>
            </span>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
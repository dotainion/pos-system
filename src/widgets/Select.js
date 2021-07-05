import React, { useState } from 'react';


export const Select = ({disabled, options, hide, defaultValue, edit, selectRef, onChange, label, style, optionStyle, wrapperStype, cssOptionClass, cssClass, children}) =>{
    const [value, setValue] = useState("");
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }
    return(
        <div hidden={hide} className={`entry-input-container relative ${cssClass}`} style={style}>
            <div style={{color:"var(--bg-text-color)"}}><label>{label}</label></div>
            <select disabled={disabled} ref={selectRef} onChange={triggerChange} className={`input ${cssOptionClass}`} style={optionStyle}>
                <option defaultChecked hidden>{defaultValue || options?.[0]}</option>
                {options?.map((option, key)=>(
                    <option key={key}>{option}</option>
                ))}
            </select>
            <div className="float-left" style={{top:"60%",color:"var(--bg-text-color)",borderRadius:"50%"}}>
                {children}
            </div>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
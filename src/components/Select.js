import React, { useEffect, useState } from 'react';


export const Select = ({options, hide, defaultValue, edit, selectRef, onChange, label, style, optionStyle, cssOptionClass, cssClass}) =>{
    const [value, setValue] = useState("");
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }
    return(
        <div hidden={hide} className={`entry-input-container ${cssClass}`} style={style}>
            <div style={{color:"rgb(3, 37, 68)"}}><label>{label}</label></div>
            <select ref={selectRef} onChange={triggerChange} className={`input ${cssOptionClass}`} style={optionStyle}>
                <option defaultChecked hidden>{defaultValue || options?.[0]}</option>
                {options?.map((option, key)=>(
                    <option key={key}>{option}</option>
                ))}
            </select>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
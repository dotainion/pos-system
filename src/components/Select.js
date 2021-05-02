import React, { useEffect, useState } from 'react';


export const Select = ({options, defaultValue, edit, selectRef, onChange, label, cssClass}) =>{
    const [value, setValue] = useState("");
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }
    return(
        <div className={`entry-input-container ${cssClass}`}>
            <div><label>{label}</label></div>
            <select ref={selectRef} onChange={triggerChange} className="input">
                <option defaultChecked hidden>{defaultValue || options?.[0]}</option>
                {options?.map((option, key)=>(
                    <option key={key}>{option}</option>
                ))}
            </select>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
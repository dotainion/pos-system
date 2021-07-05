import React, { useEffect, useState } from 'react';


export const Entry = ({placeholder, edit, disabled, inherit, entryRef, required, options, optionRef, optional, onChange, onOptionChange, onClick, onKeyPress, border, inputPops, label, defaultOptionValue, cssClass, inputCss, type, dollarSign, percentSign, labelColor, style, error}) =>{
    const [value, setValue] = useState("");
    const [showOption, setShowOption] = useState(false);
    const triggerChange = (e) =>{
        setValue(e.target.value);
        if (typeof onChange === "function") onChange(e);
    }

    useEffect(()=>{
        if (options || onOptionChange || defaultOptionValue){
            setShowOption(true);
        }else setShowOption(false);
    },[options, onOptionChange, defaultOptionValue]);
    return(
        <div className={`entry-input-container ${cssClass}`} style={style}>
            <div className="relative">
                <label style={{color:labelColor || "var(--bg-text-color)"}}>
                    <span>{label}</span>
                    <select hidden={!showOption} onChange={onOptionChange} ref={optionRef} className="option-in-entry">
                        <option defaultChecked hidden>{defaultOptionValue}</option>
                        {options?.map((opts, key)=>(
                            <option key={key}>{opts}</option>
                        ))}
                    </select>
                </label>
                <span style={{color:"red"}}>{required && "*"}</span>
                <span style={{fontSize:"11px",color:"dodgerblue"}}>{optional && " Optional"}</span>
            </div>
            <span className={dollarSign && "dollar-sign" || percentSign && "percent-sign"} style={{position:"relative"}}>
                <input disabled={disabled} ref={entryRef} onKeyPress={onKeyPress} onClick={onClick} {...inputPops} onChange={triggerChange} type={type} style={{border:error && "1px solid red" || !border && "none",height:type === "date"?"34px":null,marginTop:"3px"}} className={`input ${inputCss} ${inherit && "inherit"}`} placeholder={placeholder} />
                <div className="float-bottom-overflow font-mini" style={{color:"red",bottom:"-110%"}}>{error}</div>
            </span>
            <div hidden={!edit} className="input" style={{border:"none",height:"35px"}}>{value}</div>
        </div>
    )
}
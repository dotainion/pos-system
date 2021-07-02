import { IonIcon } from '@ionic/react';
import { add, closeOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { TiTimes,TiEquals,TiDivide,TiPlus,TiBackspace,TiMinus } from 'react-icons/ti';



const btns = [
    "AC","CE","C",
    {title:<TiBackspace/>,cmd:"<="},
    7,8,9,
    {title:<TiMinus/>,cmd:"-"},
    4,5,6,
    {title:<TiDivide/>,cmd:"/"},
    1,2,3,
    {title:<TiTimes/>,cmd:"*"},
    {title:<BsDot/>,cmd:"."},
    0,
    {title:<TiPlus/>,cmd:"+"},
    {title:<TiEquals/>,cmd:"="}
]

export const Calculator = ({doPrevent}) =>{
    const [stashed, setStashed] = useState();
    const [inputValue, setInputValue] = useState(0);

    const calculate = () =>{
        let newStashed = stashed?.split?.("");
        const opt = newStashed?.pop?.();
        if (!opt) return;
        const numerator = parseFloat(newStashed.join(""));
        const denominator = parseFloat(inputValue);
        if (opt?.includes?.("+")) return numerator + denominator;
        if (opt?.includes?.("/")) return numerator / denominator;
        if (opt?.includes?.("-")) return numerator - denominator;
        if (opt?.includes?.("*")) return numerator * denominator;
    }

    const onCalcHandler = (value) =>{
        let rawVal = inputValue.toString();
        if (value === "<=" || value === "Backspace"){//remove last value from input
            rawVal = rawVal.split("");
            rawVal.pop();
            if (!rawVal.length) return setInputValue(0);
            const joinedVal = rawVal.join("");
            setInputValue(joinedVal);
            return calculate(joinedVal);
        }
        if (value === "="){
            if (!stashed || !rawVal) return;
            setStashed(null);
            return setInputValue(calculate());
        }
        if (value === "CE") return setInputValue(0);
        if (value === "C") return setInputValue(0);
        if (value === "AC"){
            setStashed(null);
            return setInputValue(0);
        }
        //mare sure only one decimal point included
        if (rawVal.includes(".") && value === ".") return;
        if (/[a-zA-Z]/.test(value)) return;
        if (!parseInt(rawVal || 0) && isNaN(value)) return;
        //if incomming value is not a number and not . then calculate
        //and stash incomming operator with results
        if (isNaN(value) && value !== "."){
            const calced = calculate();
            if (calced) setStashed(`${calced}${value}`);
            else setStashed(`${rawVal}${value}`);
            return setInputValue(0);
        }
        //if the value in input is 0 and incomming value is still 0 return;
        if (value === 0 && parseInt(rawVal || 0) === 0) return;
        //clear value before adding of input value less then or equal to 0
        if (parseInt(rawVal|| 0) === 0) setInputValue(value);
        else setInputValue(`${inputValue}` + value);
    }

    return(
        <div className="calculator bg">
            <div className="border pad-xxl relative">
                <div className="float-top-left pad-mini pad-h-xl">{stashed}</div>
                <input className="calculator-input" onKeyDown={e=>onCalcHandler(e.key)} onChange={()=>null} {...doPrevent} value={inputValue}/>
            </div>
            <div className="pad" {...doPrevent}>
                {btns.map((num, key)=>(
                    <div className="calculator-number-pad" key={key}>
                        <div onClick={()=>onCalcHandler(num?.cmd || num)} className="max-size relative click" style={{backgroundColor:"lightgray"}}>
                            <div className="float-center"><b>{num?.title || num}</b></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const CalculatorDragable = ({isOpen, onClose, onBackdropDismiss}) =>{
    const [posY, setPosY] = useState();
    const [posX, setPosX] = useState();
    const [dragable, setDragable] = useState(false);
    const [preventDrag, setPreventDrag] = useState(false);

    const onBackdropClose = () =>{
        if (onBackdropDismiss) onClickClose();
    }

    const onClickClose = () =>{
        onClose?.();
    }

    const onGrab = (e) =>{
        setDragable(true);
    }

    const onRelease = (e) =>{
        setDragable(false);
    }

    const doPrevent = {
        onMouseDown: ()=>setPreventDrag(true),
        onMouseLeave: ()=>setPreventDrag(false)
    }

    const onDragging = (e) =>{
        if (dragable && !preventDrag){
            const calc = document.getElementById("calculator");
            if ((calc.offsetHeight / 2) <= e.clientY){
                setPosX(e.clientX);
                setPosY(e.clientY);
            }else setPosX(e.clientX);
        }
    }
    return(
        <div hidden={!isOpen} onClick={onBackdropClose} className="backdrop">
            <div hidden={!isOpen} onClick={onClickClose} className="backdrop">
                <div id="calculator" onMouseMove={onDragging} onMouseDown={onGrab} onMouseUp={onRelease} onClick={e=>e.stopPropagation()} className="float-center no-select" style={{left:`${posX}px`,top:`${posY}px`}}>
                    <IonIcon hidden={!onClose} onClick={onClickClose} class="close" {...doPrevent} style={{fontSize:"18px"}} icon={closeOutline}/>
                    <Calculator doPrevent={doPrevent} />
                </div>
            </div>
        </div>
    )
}
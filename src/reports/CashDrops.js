import { IonIcon } from '@ionic/react';
import { backspaceOutline, calendarOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { useStore } from '../context/Store';
import { addCashDrops, getCashDrops } from '../database/database';
import { tools } from '../tools/Tools';
import { Calendar } from '../widgets/Calendar';
import { Loader } from '../widgets/Loader';



export const CashDrops = ({isOpen, setBarChild}) =>{
    const { user } = useStore();

    const [loading, setLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [cashDrops, setCashDrops] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const noteRef = useRef();

    const onAddCashDrops = async() =>{
        if (!inputValue) return alert("Invalid cash");
        setLoading(true);
        const cashDropsValues = {
            date: tools.nowDate(),
            time: tools.nowTime(),
            openBy: user?.name,
            cash: inputValue,
            note: noteRef.current.value,
            storeId: user?.storeId,
        }
        await addCashDrops(cashDropsValues);
        setCashDrops([{info:cashDropsValues}, ...cashDrops]);
        setLoading(false);
        onClear();
    }

    const onSearch = async(value) =>{
        setLoading(true);
        setCashDrops(await getCashDrops(tools.formatDate(value), user?.storeId));
        setLoading(false);
    }

    const onClear = () =>{
        setInputValue("");
        noteRef.current.value = "";
    }

    const onAddInputValue = (num) =>{
        if (num === "<=" || num === "Backspace"){
            let nums = inputValue.split("");
            nums.pop();
            return setInputValue(nums.join(""))
        }
        if (isNaN(num) && num !== ".") return;
        if (inputValue?.includes?.(".") && num === ".") return;
        if (!inputValue?.split?.("").length && num === ".") return;
        setInputValue(`${inputValue}${num}`);
    }

    useEffect(()=>{
        onSearch(tools.nowDate());
    },[]);

    //set icon to menuBar header
    useEffect(()=>{
        if (isOpen) setBarChild?.(<IonIcon
                style={{fontSize:"30px"}}
                icon={calendarOutline}
                onClick={()=>setShowCalendar(true)}
            />);
        else setBarChild(null);
    },[isOpen]);
    return(
        <>
        <Calendar
            isOpen={showCalendar}
            onClose={()=>setShowCalendar(false)}
            onSelect={onSearch}
            closeOnSelect
        />
        <div hidden={!isOpen} className="flex">
            <div className="half-width scroll pad scrollbar2 relative" style={{height:"80vh"}}>
                <Loader isOpen={loading}/>
                {
                    cashDrops.length?
                    cashDrops.map((drops, key)=>(
                        <div style={{marginBottom:"20px"}} key={key}>
                            <div>Date: {`${drops?.info?.date} ${drops?.info?.time}`}</div>
                            <div>Opened by: {drops?.info?.openBy}</div>
                            <div>Drop cash: ${drops?.info?.cash}</div>
                            <div>Note: {drops?.info?.note && <b style={{backgroundColor:"lightgray",padding:"1px"}}>{drops?.info?.note}</b>}</div>
                        </div>
                    )):
                    <div>No drops</div>
                }
            </div>
            <div className="half-width pad-xxl">
                <div style={{width:"250px"}}>
                    <Entry label="Amount" inputPops={{value:inputValue,onKeyDown:e=>onAddInputValue(e.key)}} dollarSign placeholder="Cash drop amount" />
                    <div className="number-pad-container">
                        {[1,2,3,4,5,6,7,8,9,".",0,"<="].map((num, key)=>(
                            <div className="number-pad" key={key}>
                                <div onClick={()=>onAddInputValue(num)} className="silver click">
                                    <label hidden={num === "<="} className="float-center"><b>{num}</b></label>
                                    <IonIcon hidden={num !== "<="} className="float-center" icon={backspaceOutline}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pad-v-xl">
                        <div>Note</div>
                        <textarea ref={noteRef} className="max-width number-pad-note"/>
                    </div>
                    <div>
                        <button onClick={onAddCashDrops} disabled={loading} className="pad silver click">Add Cash</button>
                        <button onClick={onClear} className="pad silver click" style={{marginLeft:"5px"}}>Clear</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
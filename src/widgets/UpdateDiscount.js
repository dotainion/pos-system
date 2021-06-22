import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { Select } from '../components/Select';
import { discountTypes } from '../content/lists';
import { useStore } from '../context/Store';
import { tools } from '../tools/Tools';


export const UpdateDiscount = ({onChangeDetect, isChange}) =>{
    const { settings, discounts, setDiscounts } = useStore();

    const [onDiscountTypeChange, setOnDiscountTypeChange] = useState();
    const [discRoundsOnce, setDiscRunsOnce] = useState(true);
    const [discRoundsMulti, setDiscRunsMulti] = useState(false);
    const [discSelected, setDiscSelected] = useState({});
    const [allowEdit, setAllowEdit] = useState(false);
    const [error, setError] = useState("");

    const discountTypRef = useRef();
    const discountNameRef = useRef();
    const discountAmountRef = useRef();

    const getType = () =>{
        let type = "";
        if (discountTypRef.current.value.includes("%")) type = "%";
        if (discountTypRef.current.value.includes("$")) type = "$";
        return {type, value: discountTypRef.current.value};
    }

    const getDiscountObject = () =>{
        return {
            type: getType().type,
            title: discountNameRef.current.value,
            discount: discountAmountRef.current.value,
            runOnce: discRoundsOnce,//either true of false
        }
    }

    const appendDiscountOrEdit = () =>{
        if (!allowEdit) return;
        if (Object.keys(discSelected || {})?.length <= 0){
            setError("");
            const addObj = getDiscountObject();
            if (!discountNameRef.current.value) return setError("Discount name was not provided");
            if (!discountAmountRef.current.value) return setError("A value amount was not provided");
            for (let isExist of discounts){
                if (isExist?.title === addObj?.title){
                    return setError("Title alrady exist");
                }
            }
            setDiscounts([...discounts, addObj]);
            onChangeDetect?.(true);
        }else{
            let index = 0;
            let newObject = JSON.parse(JSON.stringify(discounts));
            for (let obj of newObject){
                if (discSelected?.title === obj?.title){
                    const editObj = getDiscountObject();

                    if (editObj?.type === obj?.type &&
                        editObj?.title === obj?.title &&
                        editObj?.discount === obj?.discount &&
                        editObj?.runOnce === obj?.runOnce
                    ) return setError("No change detected");

                    for (let isExist of newObject){
                        if (isExist?.title === editObj?.title){
                            return setError("Title alrady exist");
                        }
                    }

                    newObject[index] = editObj;
                    onChangeDetect?.(true);
                } index ++;
            }
            setDiscounts(newObject)
        }
        setDiscSelected({});
    }

    const toggleDiscRounds = (cmd) =>{
        if (cmd === "once"){
            setDiscRunsOnce(true);
            setDiscRunsMulti(false);
        }if (cmd === "multi"){
            setDiscRunsMulti(true);
            setDiscRunsOnce(false);
        }
    }

    const isIncluedInDb = (obj) =>{
        for (let sObj of settings?.discounts){
            if (obj?.title === sObj?.title) return "";
        }
        return "1px solid dodgerblue";
    }

    //detect discount selected and init values
    useEffect(()=>{
        if (Object.keys(discSelected || {})?.length > 0){
            if (discountTypes[0].includes(discSelected?.type)){
                discountTypRef.current.value = discountTypes[0];
            }else discountTypRef.current.value = discountTypes[1];
            if (discSelected?.runOnce) toggleDiscRounds("once");
            else toggleDiscRounds("multi");
            discountNameRef.current.value = discSelected?.title || "";
            discountAmountRef.current.value = discSelected?.discount || "";
        }else{
            discountTypRef.current.value = discountTypes[0];
            discountNameRef.current.value = "";
            discountAmountRef.current.value = "";
            toggleDiscRounds("once");
        }
    },[discSelected]);

    //detect change in discount list and delete feilds
    useEffect(()=>{
        discountNameRef.current.value = "";
        discountAmountRef.current.value = "";
    },[discounts]);

    //detech when isChange value is false and clear error
    useEffect(()=>{
        if (!isChange || !allowEdit) setError("");
    },[isChange, allowEdit]);

    useEffect(()=>{
        setOnDiscountTypeChange(discountTypRef.current.value);
        setDiscounts(settings?.discounts || []);
    },[]);
    return(
        <div className="pad-h-xl gray border radius">
            <div className="popup-header">
                <span>
                    <label>Discounts</label>
                    <div hidden={!error} className="float-bottom-left" style={{fontSize:"13px",color:"red",bottom:"5px"}}>
                        {!error?.includes("name") && !error?.includes("amount") ? error : null}
                    </div>
                </span>
                <div className="float-right flex pad-mini" style={{fontSize:"13px"}}>
                    <input onChange={(e)=>setAllowEdit(e.target.checked)} checked={allowEdit} type="checkbox"/>
                    <label className="pad-h-mini">Allow edit</label>
                </div>
            </div>
            <div className="flex d-flex-on-mobile">
                <div className="settings-discount-container gray2 scrollbar">
                    {
                        discounts?.length?
                        discounts?.map((disc, key)=>(
                            <div onClick={()=>setDiscSelected(disc)} className="discount-item click" style={{border:isIncluedInDb(disc)}} key={key}>
                                <label>{disc?.title}</label>
                            </div>
                        )):
                        <div>No discounts</div>
                    }
                </div>
                <div className="settings-discount-left-container relative">
                    <div hidden={allowEdit} className="float-top-left max-size" style={{zIndex:"9"}}/>
                    <Select label="Discount type" selectRef={discountTypRef} onChange={e=>setOnDiscountTypeChange(e.target.value)} options={discountTypes} defaultValue={discountTypes[1]} />
                    <Entry label="Name of discount" entryRef={discountNameRef} error={error?.includes("name") ? error : ""} placeholder="Give discount a name" />
                    <Entry label="Discounts" entryRef={discountAmountRef} error={error?.includes("amount") ? error : ""} placeholder="Play discount here" type="number" dollarSign={onDiscountTypeChange?.includes?.("$")} percentSign={onDiscountTypeChange?.includes?.("%")} />
                </div>
            </div>
            <div onClick={()=>toggleDiscRounds("once")} className="flex pad-mini">
                <input onChange={()=>toggleDiscRounds("once")} checked={discRoundsOnce} type="checkbox"/>
                <label className="pad-h-mini">Allow discount to be applied only once</label>
            </div>
            <div onClick={()=>toggleDiscRounds("multi")} className="flex pad-mini">
                <input onChange={()=>toggleDiscRounds("multi")} checked={discRoundsMulti} type="checkbox"/>
                <label className="pad-h-mini">Allow discount to be applied multiple times</label>
            </div>
            <div className="pad-xl" style={{textAlign:"right",visibility: !allowEdit && "hidden"}}>
                {Object.keys(discSelected || {})?.length
                    ?   <>
                            <button onClick={()=>setDiscSelected({})} className="pad shadow silver radius click" style={{borderTop:"1px solid red", borderBottom:"1px solid red"}}>Cancel</button>
                            <button onClick={appendDiscountOrEdit} className="pad shadow silver radius click" style={{marginLeft:"10px",borderTop:"1px solid blue", borderBottom:"1px solid blue"}}>Edit Discount</button>
                        </>:
                        <button onClick={appendDiscountOrEdit} className="pad shadow radius radius click" style={{borderTop:"1px solid green", borderBottom:"1px solid green"}}>Add Discount</button>
                }
            </div>
        </div>
    )
}

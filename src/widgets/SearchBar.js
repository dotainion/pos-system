import { IonIcon } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { closeOutline, searchOutline } from 'ionicons/icons';



export const SearchBar = ({placeholder, onTyping, onSearch, clearOnSearch, onCleared, hidden, searchRef, defaultValue}) =>{
    const [value, setValue] = useState("");
    const [hideClose, setHideClose] = useState(false);

    const onTriggerSearch = (e) =>{
        if (typeof onSearch === "function") onSearch(value); 
        if (!clearOnSearch) onTriggerCear();
    }

    const onTriggerTyping = (e) =>{
        setValue(e.target.value);
        if (typeof onTyping === "function") onTyping(e.target.value);
    }

    const onTriggerCear = ()=>{
        setValue("");
        if (typeof onTyping === "function") onCleared();
    };

    const onTriggerEnterKey = (e) =>{
        if (e.key === "Enter"){
            if (typeof onSearch === "function") onSearch(e.target.value); 
            if (!clearOnSearch) onTriggerCear();
        }
    }

    useEffect(()=>{
        if (!value) setHideClose(true);
        else setHideClose(false);
    },[value]);

    //apply default value
    useEffect(()=>{
        if (defaultValue) setValue(defaultValue);
    },[defaultValue]);
    return(
        <div hidden={hidden} className="search-container">
            <input onChange={onTriggerTyping} ref={searchRef} onKeyPress={onTriggerEnterKey} placeholder={placeholder} value={searchRef?.current?.value || value}/>
            <IonIcon class="close-hover" hidden={hideClose} onClick={onTriggerCear} icon={closeOutline}/>
            <IonIcon onClick={onTriggerSearch} icon={searchOutline}/>
        </div>
    )
}
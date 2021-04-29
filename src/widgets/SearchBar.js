import { IonIcon } from '@ionic/react';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { closeOutline, searchOutline } from 'ionicons/icons';



export const SearchBar = ({placeholder, onTyping, onSearch, clearOnSearch, onCleared, hidden}) =>{
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
    return(
        <div hidden={hidden} className="search-container">
            <input onChange={onTriggerTyping} onKeyPress={onTriggerEnterKey} placeholder={placeholder} value={value}/>
            <IonIcon class="close-hover" hidden={hideClose} onClick={onTriggerCear} icon={closeOutline}/>
            <IonIcon onClick={onTriggerSearch} icon={searchOutline}/>
        </div>
    )
}
import { IonIcon, IonItemDivider } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/Store';
import { Button } from '../widgets/Button';


export const Discounts = ({isOpen, onClose, onSelect}) =>{
    const { cart, settings } = useStore();

    const [error, setError] = useState("");
    const timeOutVar = useRef();

    const onSelected = (discount) =>{
        clearInterval(timeOutVar);
        let idExt = "";
        const msg = "This discount can only be added once";
        if (discount?.runOnce){
            for (let item of cart){
                if (item?.info?.discount?.includes?.(discount?.discount)) return setError(msg);
            }
            idExt = "discount";
        }else{
            let index = 0;
            for (let item of cart){
                index ++;
                if (item?.id?.includes?.(discount?.title)) idExt = `discount${index}`;;
            }
        }
        onSelect?.({info:discount, id:`${discount?.title}-${idExt}`});
    }

    const triggerClose = () =>{
        onClose?.();
    }

    //detect change in error
    useEffect(()=>{
        if (error) timeOutVar.current = setTimeout(() => {
            setError("");
        }, 4000);
    },[error]);

    return(
        <div hidden={!isOpen} onClick={triggerClose} className="backdrop">
            <div className="float-center shadow2 bg" onClick={e=>e.stopPropagation()}>
                <IonIcon onClick={triggerClose} class="close" icon={closeOutline}/>
                <div className="popup-header silver">
                    <span>Apply Discounts</span>
                    <div className="float-bottom-left pad-h error max-width" style={{fontWeight:"normal"}}>{error}</div>
                </div>
                <div className="discount-container radius bg scrollbar">
                    {
                        settings?.discounts?.length?
                        settings?.discounts?.map((disc, key)=>(
                            <div onClick={()=>onSelected(disc)} className="discount-item relative click" key={key}>
                                <div>{disc?.title}</div>
                                <div className="float-right">{disc?.type}{disc?.discount}</div>
                            </div>
                        )):
                        <div>No discounts</div>
                    }
                </div>
                <div className="pad-xl" style={{textAlign:"right"}}>
                    <Button onClick={triggerClose} text="Done" />
                </div>
            </div>
        </div>
    )
}
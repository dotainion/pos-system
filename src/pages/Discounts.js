import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store';


export const Discounts = ({isOpen, onClose, onSelect}) =>{
    const { cart, settings } = useStore();

    const [error, setError] = useState("");

    const onSelected = (discount) =>{
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
        if (error) setTimeout(() => {
            setError("");
        }, 4000);
    },[error]);

    return(
        <div hidden={!isOpen} onClick={triggerClose} className="backdrop">
            <div className="float-center silver" onClick={e=>e.stopPropagation()}>
                <IonIcon onClick={triggerClose} class="close" icon={closeOutline}/>
                <div className="popup-header">
                    <span>Apply discounts</span>
                    <div className="float-bottom-left pad-h error max-width" style={{fontWeight:"normal"}}>{error}</div>
                </div>
                <div className="discount-container scrollbar">
                    {
                        settings?.discounts?.length?
                        settings?.discounts?.map((disc, key)=>(
                            <div onClick={()=>onSelected(disc)} className="discount-item relative click" key={key}>
                                <div className="float-left">{disc?.title}</div>
                                <div className="float-right">{disc?.type}{disc?.discount}</div>
                            </div>
                        )):
                        <div>No discounts</div>
                    }
                </div>
                <div hidden className="pad-xl" style={{textAlign:"right"}}>
                    <button className="pad radius click silver">Apply</button>
                </div>
            </div>
        </div>
    )
}
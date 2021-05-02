import { IonIcon, IonImg, IonList, IonLoading, IonProgressBar, IonThumbnail } from '@ionic/react';
import { closeOutline, imagesOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { roles } from '../content/lists';
import { useStore } from '../context/Store';
import { addProducts, addUser, updateProducts } from '../database/database';
import { Entry } from './Entry';
import { Select } from './Select';
import img from '../images/beach.jpg';
import { tools } from '../tools/Tools';
import { PopupContainer } from './PopupContainer';


export const AddProducts = ({isOpen, record, onClose}) =>{
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");
    const [error, setError] = useState("");

    const imageRef = useRef();
    const titleRef = useRef();
    const salepriceRef = useRef();
    const costPriceRef = useRef();
    const quantityRef = useRef();

    const onClear = () =>{
        setImage("");
        titleRef.current.value = "";
        salepriceRef.current.value = "";
        costPriceRef.current.value = "";
        quantityRef.current.value = "";
    }

    const onAddProduct = async() =>{
        if (!titleRef.current.value) return setError("Must provide title");
        if (!salepriceRef.current.value) return setError("Must provide sale price");
        if (!quantityRef.current.value) return setError("Must provide quantity of item");
        setLoading(true);
        const object = {
            image: image,
            title: titleRef.current.value || "",
            salePrice: salepriceRef.current.value || "",
            costPrice: costPriceRef.current.value || "",
            qty: quantityRef.current.value || ""
        }
        if (Object.keys(record || {})?.length > 0) await updateProducts(object, record?.id);
        else await addProducts(object);
        onClear();
        setLoading(false);
        if (typeof onClose === "function") onClose();
    }

    useEffect(()=>{
        if (Object.keys(record || {})?.length > 0){
            setImage(record?.info?.image);
            titleRef.current.value = record?.info?.title;
            salepriceRef.current.value = record?.info?.salePrice;
            costPriceRef.current.value = record?.info?.costPrice;
            quantityRef.current.value = record?.info?.qty;
        }
    },[record]);
    return(
        <PopupContainer isOpen={isOpen} onClose={onClose}>
            <div className="popup-header popup-bg">
                <div>Add new product to inventory</div>
                <div style={{fontWeight:"normal",fontSize:"15px",color:"orangered",textAlign:"center"}}>{error}</div>
            </div>
            <IonProgressBar hidden={!loading} color="light" type="indeterminate" value={0.5}/>
            <div className="flex d-flex-on-mobile pad">
                <div className="max-width">
                    <IonThumbnail class="add-product-pop-thumbnail">
                        <IonIcon onClick={()=>imageRef.current?.click()} class="float-top-left add-image-icon" icon={imagesOutline}/>
                        <IonImg src={image || img} class="max-size" />
                    </IonThumbnail>
                </div>
                <div className="max-width">
                    <Entry entryRef={titleRef} cssClass="input-style" label="Title" placeholder="Title" />
                    <Entry entryRef={salepriceRef} cssClass="input-style" label="Sale Price" placeholder="Sale price" type="number" dollarSign />
                    <Entry entryRef={costPriceRef} cssClass="input-style" label="Cost Price" placeholder="Cost price" type="number" dollarSign />
                    <Entry entryRef={quantityRef} cssClass="input-style" label="Quantity" placeholder="Quantity" type="number" dollarSign />
                </div>
            </div>
            <div className="half-width max-width-on-mobile item-center">
                <button disabled={loading} onClick={onAddProduct} className="add-btn" style={{float:"right",fontSize:"15px"}}>Save</button>
            </div>
            <input hidden ref={imageRef} onChange={async(e)=>setImage(await tools.toBase64(e.target.files[0]))} type="file"/>
        </PopupContainer>
    )
}
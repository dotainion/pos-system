import { IonIcon, IonImg, IonList, IonLoading, IonThumbnail } from '@ionic/react';
import { closeOutline, imagesOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { productQtyType, roles } from '../content/lists';
import { useStore } from '../context/Store';
import { addProducts, addUser, updateProducts } from '../database/database';
import { Entry } from '../widgets/Entry';
import { Select } from '../widgets/Select';
import img from '../images/beach.jpg';
import { tools } from '../tools/Tools';
import { ModalContainer } from '../container/ModalContainer';
import { Progressing } from '../widgets/Progressing';
import { Button } from '../widgets/Button';


export const AddProducts = ({isOpen, record, onUpdateComplete, onClose}) =>{
    const { user } = useStore();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");
    const [error, setError] = useState("");
    const [inputStyle, setInputStyle] = useState("");

    const imageRef = useRef();
    const titleRef = useRef();
    const salepriceRef = useRef();
    const costPriceRef = useRef();
    const quantityRef = useRef();
    const quantityTypeRef = useRef();

    const onClear = () =>{
        setImage("");
        titleRef.current.value = "";
        salepriceRef.current.value = "";
        costPriceRef.current.value = "";
        quantityRef.current.value = "";
        quantityTypeRef.current.value = "";
    }

    const onAddProduct = async() =>{
        if (!titleRef.current.value) return setError("Must provide title");
        if (!salepriceRef.current.value) return setError("Must provide sale price");
        if (!quantityRef.current.value) return setError("Must provide quantity of item");
        if (!quantityTypeRef.current.value) return setError("Must provide quantity type");
        setLoading(true);
        const object = {
            image: image,
            title: titleRef.current.value || "",
            salePrice: salepriceRef.current.value || "",
            costPrice: costPriceRef.current.value || "",
            qty: quantityRef.current.value || "",
            storeId: user?.storeId || "",
            qtyType: quantityTypeRef.current.value
        }
        if (Object.keys(record || {})?.length > 0) await updateProducts(object, record?.id);
        else await addProducts(object);
        onClear();
        setLoading(false);
        onClose?.();
        onUpdateComplete?.();
    }

    useEffect(()=>{
        if (Object.keys(record || {})?.length > 0){
            setImage(record?.info?.image);
            titleRef.current.value = record?.info?.title;
            salepriceRef.current.value = record?.info?.salePrice;
            costPriceRef.current.value = record?.info?.costPrice;
            quantityRef.current.value = record?.info?.qty;
            quantityTypeRef.current.value = record?.info?.qtyType;
        }else{
            setImage("");
            titleRef.current.value = "";
            salepriceRef.current.value = "";
            costPriceRef.current.value = "";
            quantityRef.current.value = "";
            quantityTypeRef.current.value = productQtyType[0];
        }
    },[record]);
    return(
        <ModalContainer isOpen={isOpen} onClose={onClose}>
            <div className="popup-header centered">
                <div className="pad" style={{borderBottom:"1px solid black"}}>Add new product to inventory</div>
                <div style={{fontWeight:"normal",fontSize:"15px",color:"orangered",textAlign:"center"}}>{error}</div>
            </div>
            <Progressing isOpen={loading} color="medium"/>
            <div className="flex d-flex-on-mobile pad" style={{marginTop:"20px"}}>
                <div className="max-width">
                    <IonThumbnail onClick={()=>imageRef.current?.click()} class="add-product-pop-thumbnail">
                        <IonIcon class="float-top-left add-image-icon" icon={imagesOutline}/>
                        <IonImg src={image || img} class="max-size" />
                    </IonThumbnail>
                </div>
                <div className="max-width">
                    <Entry entryRef={titleRef} label="Title" placeholder="Title" />
                    <Entry entryRef={salepriceRef} label="Sale Price" placeholder="Sale price" type="number" dollarSign />
                    <Entry entryRef={costPriceRef} label="Cost Price" placeholder="Cost price" type="number" dollarSign />
                    <Entry entryRef={quantityRef} placeholder={productQtyType} type="number" optionRef={quantityTypeRef} options={productQtyType} />
                </div>
            </div>
            <div className="item-center max-width" style={{textAlign:"right",padding:"40px"}}>
                <Button disabled={loading} onClick={onAddProduct} text={Object.keys(record || {})?.length? "Update": "Save"} />
            </div>
            <input hidden ref={imageRef} onChange={async(e)=>setImage(await tools.toBase64(e.target.files[0]))} type="file"/>
        </ModalContainer>
    )
}
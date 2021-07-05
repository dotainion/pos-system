import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../../widgets/Entry';
import { FlexContainer } from '../../container/FlexContainer';
import { Button } from '../../widgets/Button';
import { Discounts } from '../../app/Discounts';
import { useStore } from '../../context/Store';
import { calc } from '../../calc/Calculate';

const discType = {
    order: "Order",
    item: "Item"
};
let holdItemToREsetCart = [];
export const EditCart = ({isOpen, onClose, record}) =>{
    const {cart, setCart} = useStore();

    const [showDiscounts, setShowDiscounts] = useState(false);
    const [discTypeSelected, setDiscTypeSelected] = useState("");

    const qtyRef = useRef();

    const discountOpen = (type) =>{
        setDiscTypeSelected(type);
        setShowDiscounts(true);
    }

    const onDelete = () =>{
        let tempCart = [];
        for (let item of cart){
            if (item?.id !== record?.id) tempCart.push(item);
        }
        setCart(tempCart);
        onClose?.();
    }

    const onCancel = () =>{
        setCart(holdItemToREsetCart);
        onClose?.();
    }

    const onApply = () =>{
        onClose?.();
    }

    const onChangeQty = (e) =>{
        calc.updateCartQty(record, e?.target?.value);
    }

    const onDiscSelected = (discount) =>{
        if (discTypeSelected.includes(discType.order)){
            setCart([...cart,discount]);
        }else if (discTypeSelected.includes(discType.item)){
            addItemDiscount(discount);
        }
    }

    const addItemDiscount = (disc) =>{
        let tempDiscCart = [];
        let cartClone = JSON.parse(JSON.stringify(cart));
        for (let item of cartClone){
            let itemClone = item?.info;
            let rawPrice = parseFloat(itemClone["salePrice"]);
            itemClone["discount"] = {
                type: disc?.info?.type,
                salePrice: rawPrice
            }
            if (disc?.info?.type?.includes("$")){
                rawPrice = rawPrice - parseFloat(disc?.info?.discount);
                itemClone["salePrice"] = rawPrice.toString();
                item["info"] = itemClone;
            }else if (disc?.info?.type?.includes("%")){
                let perc = calc.percentOf(disc?.info?.discount, rawPrice);
                itemClone["salePrice"] = rawPrice - perc;
                item["info"] = itemClone;
            }
            tempDiscCart.push(item);
        }
        setCart(tempDiscCart);
    }

    useEffect(()=>{
        qtyRef.current.value = record?.qty || "";
        holdItemToREsetCart = JSON.parse(JSON.stringify(cart));
    },[record]);
    return(
        <>
        <FlexContainer isOpen={isOpen} onClose={onClose} alertType>
            <div className="pad-mini gray2 radius-top no-select">
                <label>Edit item : </label>
                <label style={{color:"dodgerblue"}}>{record?.info?.title}</label>
            </div>
            <div className="pad-xl relative radius no-select">
                <div hidden={!record?.info?.discount} className="float-center max-size no-select" style={{zIndex:"1"}}>
                    <div className="float-center half-width pad-xl centered bg border radius">
                        <div>Will you like to delete this discount</div>
                        <div className="pad-xl" style={{float:"right"}}>
                            <Button onClick={onDelete} text="Yes" transparent spacing />
                            <Button onClick={onClose} text="No" transparent />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <Button onClick={()=>discountOpen(discType.order)} topSpacing color="blue" text="Order Descount" cssClass="max-width" left="2px" right="2px" />
                    <Button onClick={()=>discountOpen(discType.item)} topSpacing color="dodgerblue" text="Item Descount" cssClass="max-width" left="2px" right="2px" />
                    <Button onClick={onApply} text="Apply" topSpacing color="green" cssClass="block max-width" />
                </div>
                <div className="flex">
                    <Button onClick={onCancel} text="Cancel" topSpacing color="black" cssClass="max-width" left="2px" right="2px" />
                    <Button onClick={onDelete} text="Delete" topSpacing color="red" cssClass="max-width" left="2px" right="2px" />
                    <Button onClick={()=>{}} text="Other" topSpacing color="teal" cssClass="max-width" left="2px" right="2px" />
                </div>
                <div className="flex">
                    <Entry label={record?.info?.qtyType} labelColor="dodgerblue" entryRef={qtyRef} onChange={onChangeQty} placeholder="Quantity" />
                    <div className="relative half-width" style={{color:"dodgerblue"}}>
                        <div className="float-center">${parseFloat?.(record?.info?.salePrice || 0)?.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </FlexContainer>
        <Discounts
            isOpen={showDiscounts}
            onClose={()=>setShowDiscounts(false)}
            onSelect={onDiscSelected}
        />
        </>
    )
}
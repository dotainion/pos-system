import React, { useRef, useState } from 'react';
import { useStore } from '../../context/Store';
import { tools } from '../../tools/Tools';
import { Button } from '../../widgets/Button';
import { Entry } from '../../widgets/Entry';


export const Stash = ({isOpen}) =>{
    const { cart, setCart, cartOnHold, setCartOnHold } = useStore();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const titleRef = useRef();

    const onSaveCartItem = () =>{
        setError("");
        if (cart?.length <= 0) return setError("No item to be save");
        if (!titleRef.current.value) return setError("Must provide a title");
        for (let obj of cartOnHold){
            if (obj?.title === titleRef.current.value) return setError("Title already exist");
        }
        setCartOnHold([{title: titleRef.current.value, order: cart}, ...cartOnHold]);
        setCart([]);
        titleRef.current.value = "";
        tools.toast("Successful", "success", 3000, "middle");
    }

    return(
        <div hidden={!isOpen} className="pad entry-action-sub">
            <div className="half-width item-center flex" style={{marginBottom:"15px"}}>
                <Entry entryRef={titleRef} error={error} style={{color:"var(--bg-text-color)"}} placeholder="Give a title to this order" />
                <div className="pad-xl" style={{position:"relative"}}>
                    <div className="float-left">
                        <Button 
                            onClick={onSaveCartItem}
                            text="Save"
                            spacing
                        />
                    </div>
                </div>
            </div>
            <div className="max-size entry-action-mini scrollbar" style={{position:"relative"}}>
                <div className="gray">
                    <div style={{border:"none"}} className="sales-item-name-header radius">Title</div>
                    <div style={{border:"none"}} className="sales-item-qty-header radius">Qty</div>
                    <div style={{border:"none"}} className="sales-item-price-header radius">Price</div>
                </div>
                {
                    cart?.length?
                    cart.map((order, key)=>(
                        <div style={{borderBottom:"1px solid white"}} key={key}>
                            <div className="sales-item-name-header radius" style={{border:"none"}}>{order?.info?.title || "Not Provided"}</div>
                            <div className="sales-item-qty-header radius" style={{border:"none"}}>{order?.qty || 1}</div>
                            <div className="sales-item-price-header radius" style={{border:"none"}}>${order?.info?.salePrice || "Not Provided"}</div>
                        </div>
                    )):
                    <div>Cart is empty</div>
                }
            </div>
        </div>
    )
}
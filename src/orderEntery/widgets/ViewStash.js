import { IonIcon } from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { Alert } from '../../components/Alert';
import { useStore } from '../../context/Store';
import { Button } from '../../widgets/Button';


export const ViewStash = ({isOpen}) =>{
    const { cart, setCart, cartOnHold, setCartOnHold } = useStore();
    const [showCartNotEmptyAlert, setShowCartNotEmptyAlert] = useState({state:false,data:null});

    const onRestore = (e,index) =>{
        e?.stopPropagation?.();
        if (!cart.length || e?.includes?.("override")){
            let holdStore = [];
            let newOnHold = JSON.parse(JSON.stringify(cartOnHold || []));
            for (let order of newOnHold){
                if (newOnHold?.[index]?.title !== order?.title){
                    holdStore.push(order);
                }
            }
            if (newOnHold?.[index]){
                setCart(newOnHold?.[index]?.order);
                setCartOnHold(holdStore);
            }
        }else{
            setShowCartNotEmptyAlert({state:true,data:index});
        }
    }

    const toggleItemOnHold = (id) =>{
        let element = document.getElementById(id);
        let elementUp = document.getElementById(`${id}up`);
        let elementDown = document.getElementById(`${id}down`);

        if (element.hidden){
            element.hidden = false;
            elementUp.hidden = false;
            elementDown.hidden = true;
        }else{
            element.hidden = true;
            elementUp.hidden = true;
            elementDown.hidden = false;
        }
    }

    return(
        <>
        <div hidden={!isOpen} className="pad entry-action-sub">
            <div className="max-size entry-action-mini scrollbar">
                {
                    cartOnHold?.length?
                    cartOnHold.map((hold, key)=>(
                        <div key={key}>
                            <div onClick={()=>toggleItemOnHold(`${hold?.title}`)} className="pad radius max-width pointer no-select silver border-bottom relative">
                                <span>{hold?.title}</span>
                                <div className="float-right pad-mini flex">
                                    <IonIcon class="pad" hidden id={`${hold?.title}up`} icon={chevronUpOutline}/>
                                    <IonIcon class="pad" id={`${hold?.title}down`} icon={chevronDownOutline}/>
                                    <Button onClick={e=>onRestore(e,key)} text="Restore" />
                                </div>
                            </div>
                            <div hidden id={`${hold?.title}`} className="no-select" style={{backgroundColor:"rgb(0,0,0,0.5)"}}>
                                {hold?.order?.map((order, key)=>(
                                    <div style={{color:"white"}} key={key}>
                                        <div className="sales-item-name-header radius">{order?.info?.title || "Not Provided"}</div>
                                        <div className="sales-item-qty-header radius">{order?.qty || 1}</div>
                                        <div className="sales-item-price-header radius">{order?.info?.salePrice || "Not Provided"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )):
                    <div>No item on hold</div>
                }
            </div>
        </div>
        <Alert
            isOpen={showCartNotEmptyAlert.state}
            transparent
            header="Alert!!"
            message="There is existing item in the cart. Must first stash items or continue to override?"
            onClose={()=>setShowCartNotEmptyAlert({state:false,data:null})}
            onConfirm={()=> onRestore("override", showCartNotEmptyAlert.data)}
        />
        </>
    )
}
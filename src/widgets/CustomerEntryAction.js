import { IonIcon } from '@ionic/react';
import { addOutline, chevronDownOutline, chevronUpOutline, closeOutline, eyeOutline, saveOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { PopupContainer } from '../components/PopupContainer';
import { useStore } from '../context/Store';
import { addCustomer } from '../database/database';
import { SearchBar } from './SearchBar';
import img from '../images/beach.jpg';
import { tools } from '../tools/Tools';
import { AddCustomer } from './AddCustomer';
import { Alert } from './Alert';


export const CustomerEntryActions = ({isOpen, onClose, onCustomerSelected, searchValue}) =>{
    const { cart, setCart, cartOnHold, setCartOnHold, customers } = useStore();
    const [toggleDisplay, setToggleDisplay] = useState({saveItem:true,viewItem:false,addCustomer:false});
    const [error, setError] = useState("");
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [customer, setCustomer] = useState({});
    const [defaultSearchValue, setDefaultSearchValue] = useState("");
    const [showCartNotEmptyAlert, setShowCartNotEmptyAlert] = useState({state:false,data:null});

    //hold image
    const [image, setImage] = useState("");

    //for add cart on hold and name it
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
    }

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

    const onCustomerSearch = (value) =>{
        
    }

    const toggleContainer = (cmd) =>{
        if (cmd === "save-item") setToggleDisplay({saveItem:true,viewItem:false,addCustomer:false});
        if (cmd === "view-item") setToggleDisplay({saveItem:false,viewItem:true,addCustomer:false});
        if (cmd === "add-customer") setToggleDisplay({saveItem:false,viewItem:false,addCustomer:true});
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

    //detech change in error and close after time
    useEffect(()=>{
        setTimeout(() => {
            setError("");
        }, 8000);
    },[error]);

    //detech change in customer selected and fire callback
    useEffect(()=>{
        onCustomerSelected?.(customer);
    },[customer]);
    
    //detech change in search for customer on order enter
    useEffect(()=>{
        if (searchValue){
            onCustomerSearch(searchValue);
            setDefaultSearchValue(searchValue);
            setToggleDisplay({saveItem:false,viewItem:false,addCustomer:true});
        }
    },[searchValue]);
    return(
        <>
        <PopupContainer isOpen={isOpen} onClose={onClose}>
            <div hidden={!toggleDisplay.addCustomer}  className="pad-xxl max-width" style={{color:"black"}}>
                <div className="half-width max-width-on-mobile item-center">
                    <SearchBar
                        placeholder="Search customer..."
                        defaultValue={defaultSearchValue}
                        onSearch={onCustomerSearch}
                    />
                </div>
            </div>
            <p hidden={toggleDisplay.addCustomer}  className="pad-xl relative no-select">
                Stash item thats in cart.<br/>
                Give a name to this order to be saved so it can be itdentify when needed.<br/>
                <label className="float-bottom-overflow max-width" style={{color:"red",textAlign:"center"}}>{error}</label>
            </p>
            <div className="flex pad-xxl no-select" style={{backgroundColor:"gray"}}>
                <div className="max-width centered">
                    <button onClick={()=>toggleContainer("save-item")} style={{color:toggleDisplay.saveItem && "brown"}} className="pad btn-font radius silver shadow click">Stash for later <IonIcon icon={saveOutline}/></button>
                </div>
                <div className="max-width centered">
                    <button onClick={()=>toggleContainer("view-item")} style={{color:toggleDisplay.viewItem && "brown"}} className="pad btn-font radius silver shadow click">View stash lists <IonIcon icon={eyeOutline}/></button>
                </div>
                <div className="max-width centered">
                    <button onClick={()=>toggleContainer("add-customer")} style={{color:toggleDisplay.addCustomer && "brown"}} className="pad btn-font radius silver shadow click">Customers <IonIcon icon={eyeOutline}/>/<IonIcon icon={addOutline}/></button>
                </div>
            </div>
            <div hidden={!toggleDisplay.saveItem} className="pad entry-action-sub">
                <div className="half-width item-center flex">
                    <Entry cssClass="bg" entryRef={titleRef} style={{color:"rgb(3, 37, 68)"}} placeholder="Give a title to this order" label="Title" />
                    <div className="pad-xl" style={{position:"relative"}}>
                        <div className="float-left">
                            <button onClick={onSaveCartItem} className="btn" style={{marginLeft:"20px"}}>Save</button>
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
            
            <div hidden={!toggleDisplay.viewItem} className="pad entry-action-sub">
                <div className="max-size entry-action-mini scrollbar">
                    {
                        cartOnHold?.length?
                        cartOnHold.map((hold, key)=>(
                            <div key={key}>
                                <div onClick={()=>toggleItemOnHold(`${hold?.title}${key}`)} className="pad radius max-width pointer no-select silver border-bottom">
                                    <span>{hold?.title}<IonIcon hidden id={`${hold?.title}${key}up`} icon={chevronUpOutline}/><IonIcon id={`${hold?.title}${key}down`} icon={chevronDownOutline}/></span>
                                    <button onClick={e=>onRestore(e,key)} style={{backgroundColor:"inherit",color:"darkgreen",float:"right"}}>Restore</button>
                                </div>
                                <div hidden id={`${hold?.title}${key}`} className="no-select" style={{backgroundColor:"rgb(0,0,0,0.5)"}}>
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

            <div hidden={!toggleDisplay.addCustomer} className="pad entry-action-sub">
                <div>
                    <div style={{float:"left"}}>Selected Customer: <b style={{color:"brown"}}>{customer?.info?.name}</b></div>
                    <IonIcon onClick={()=>setShowAddCustomer(true)} class="entry-action-add-btn" icon={addOutline}/>
                </div>
                <div className="max-size entry-action-mini scrollbar">
                    {
                        customers?.length?
                        customers.map((customer, key)=>(
                            <div onClick={()=>setCustomer(customer)} className="flex customer-item-container silver border-bottom" key={key}>
                                <div className="inline max-width pad">{customer?.info?.name}</div>
                                <div className="inline max-width pad">{customer?.info?.email}</div>
                                <div className="inline max-width pad">{customer?.info?.number}</div>
                                <div className="inline max-width pad">{customer?.info?.id}</div>
                            </div>
                        )):
                        <div>No customers</div>
                    }
                </div>
            </div>
        </PopupContainer>
        <AddCustomer
            isOpen={showAddCustomer}
            onClose={()=>setShowAddCustomer(false)}
        />
        <Alert
            isOpen={showCartNotEmptyAlert.state}
            header="Alert!!"
            message="There is existing item in the cart. Must first stash items or continue to override?"
            onClose={()=>setShowCartNotEmptyAlert({state:false,data:null})}
            onConfirm={()=> onRestore("override", showCartNotEmptyAlert.data)}
        />
        </>
    )
}
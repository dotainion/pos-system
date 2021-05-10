import { IonCard, IonCardContent, IonContent, IonIcon, IonLabel, IonList, IonPage } from '@ionic/react';
import { addOutline, chevronDown, chevronDownOutline, chevronUpOutline, closeOutline, pencilOutline, personOutline, saveOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { getProducts, addSale, updateCustomerReward, getCustomerReward } from '../database/database';
import { ToolBar } from '../layout/ToolBar';
import { Alert } from '../widgets/Alert';
import { Loader } from '../widgets/Loader';
import { CustomerEntryActions } from '../widgets/CustomerEntryAction';
import { PaymentWindow } from '../widgets/PaymentWindow';
import { RefundCustomer } from '../widgets/RefundCustomer';
import { SearchBar } from '../widgets/SearchBar';


const OrderEntry = () => {
    const { cart, setCart, products, showProductLoader, mostRecent, saveMostRecent, removeMostRecent, searchProducts, setAdminAccess } = useStore();
    const [loading, setLoading] = useState(false);
    const [moreOption, setMoreOption] = useState(false);
    const [tax, setTax] = useState(0);
    const [net, setNet] = useState(0);
    const [total, setTotal] = useState(0);
    const [showCustomerAction, setShowCustomerAction] = useState(false);
    const [customer, setCustomer] = useState({});
    const [customerSearchValue, setCustomerSearchValue] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showPaymentWindow, setShowPaymentWindow] = useState(false);
    const [showRefundWindow, setShowRefundWindow] = useState(false);
    const [reward, setReward] = useState({});
    const [paymentSubmited, setPaymentSubmited] = useState(true);

    const moreOptionToggle = () =>{
        if (moreOption) setMoreOption(false);
        else setMoreOption(true);
    }

    const updateCartQty = (item,value=null) =>{
        let tempCart = [];
        for (let cartItem of cart){
            if (cartItem?.id === item?.id){
                if (value) cartItem["qty"] = value;
                else cartItem["qty"] = parseInt(cartItem["qty"]) +1;
            }
            tempCart.push(cartItem);
        }
        setCart(tempCart);
    }

    const addToCart = (item) =>{
        for (let cartItem of cart){
            if (cartItem?.id === item?.id) return updateCartQty(item);
        }
        item["qty"] = 1;
        setCart([item,...cart]);
    }

    const deleteFromCart = (item) =>{
        let tempCart = [];
        for (let cartItem of cart){
            if (cartItem?.id !== item?.id) tempCart.push(cartItem);
        }
        setCart(tempCart);
    }

    const onCloseSale = async() =>{
        try{
            if (cart?.length <= 0) return;
            setLoading(true);
            setPaymentSubmited(false);
            let cusId = "";
            if (Object.keys(cusId || {})?.length > 0) cusId = customer?.id;
            const date = new Date().getTime();
            await addSale({
                products: cart,
                tax,
                net,
                total,
                date,
                customerId: cusId
            });
            if (Object.keys(customer || {}).length > 0){
                const cusReward = {
                    store: "",
                    reward: parseFloat(reward?.reward || 0) +1,//reward is done base on the percentage amount towards total price
                    visits: parseFloat(reward?.visits || 0) +1
                }
                await updateCustomerReward(cusReward,customer?.id);
            }
            /**
             * print receipt 
             */
            setPaymentSubmited(true);
        }catch{
            console.log("someting went wrong");
        }finally{
            setCart([]);
            setLoading(false);
        }
    }

    //open customer list on search
    const openCustomerListOnSearch = (value) =>{
        if (value){
            setCustomerSearchValue(value);
            setShowCustomerAction(true);
        }
    }

    //get customer rewards when customer selected
    const initCustomerReward = async() =>{
        setReward(await getCustomerReward(customer?.id));
    }

    //detect change in cart and update NET and TOTAL accordingly
    useEffect(()=>{
        let sub = 0;
        for (let cartItem of cart){
            let qty = parseFloat(cartItem?.qty);
            let price = parseFloat(cartItem?.info?.salePrice);
            sub = sub + (price * qty);
        }
        let tempTax = ((sub / 100) * 15);
        setNet(sub);
        setTax(tempTax);
        setTotal(sub + tempTax);
    },[cart]);

    //detect change in customer and update accordingly
    useEffect(()=>{
        initCustomerReward(customer);
    },[customer]);

    return (
        <IonPage className="page">
            <ToolBar/>
            <CustomerEntryActions
                isOpen={showCustomerAction}
                onClose={()=>setShowCustomerAction(false)}
                searchValue={customerSearchValue}
                onCustomerSelected={setCustomer}
            />
            <PaymentWindow
                isOpen={showPaymentWindow}
                net={net}
                tax={tax}
                total={total}
                loading={loading}
                onClose={()=>setShowPaymentWindow(false)}
                onConfirmPayment={onCloseSale}
                paymentSubmited={paymentSubmited}
            />
            <RefundCustomer
                isOpen={showRefundWindow}
                onClose={()=>setShowRefundWindow(false)}
            />
            <Alert
                isOpen={showAlert}
                onClose={()=>setShowAlert(false)}
                onConfirm={()=>setCart([])}
                message="Are you sure you will like to clear the cart?"
            />
            <IonContent>
                <div className="flex no-select" style={{minWidth:"670px"}}>
                    <div style={{width:"40%",padding:"20px",borderRight:"5px solid rgb(48, 46, 46)"}}>
                        <div className="flex">
                            <div className="max-width pad">
                                <SearchBar onSearch={openCustomerListOnSearch} placeholder="Customer"/>
                            </div>
                            <div className="max-width pad">
                                <SearchBar onSearch={searchProducts} placeholder="Product"/>
                            </div>
                        </div>

                        <div className="flex pad-v-xl font" style={{marginLeft:"40px"}}>
                            <IonIcon class="customer-image-icon" icon={personOutline}/>
                            <div style={{position:"relative"}}>
                                <div className="float-left no-wrap" style={{left:"20px",color:"white"}}>
                                    <div>{customer?.info?.name || "Customer"}</div>
                                    <div>Loyalty program</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex font dark reward-container">
                            <div className="max-width pad-h">
                                <div>STORE</div>
                                <div className="text-right pad-v">{reward?.store || "0.0"}</div>
                            </div>
                            <div className="max-width pad-h border-l-r">
                                <div>REWARD</div>
                                <div className="text-right pad-v">${reward?.reward || "0.0"}</div>
                            </div>
                            <div className="max-width pad-h">
                                <div>VISIT</div>
                                <div className="text-right pad-v">{reward?.visits || 0}</div>
                            </div>
                        </div>

                        <div className="sales-item-header-container">
                            <div className="sales-item-name-header dark">name</div>
                            <div className="sales-item-qty-header dark">Qty</div>
                            <div className="sales-item-price-header dark">Price</div>
                        </div>

                        <div className="sales-item-container">
                            {cart.map((order, key)=>(
                                <div className="cart-item-hover relative" key={key}>
                                    <div className="sales-item-name-header">{order?.info?.title || "Not Provided"}</div>
                                    <div className="sales-item-qty cart-qty-item-hover">
                                        <input onChange={(e)=>updateCartQty(order,e.target.value)} value={order?.qty || 1}/>
                                    </div>
                                    <div className="sales-item-price-header">${order?.info?.salePrice || "Not Provided"}</div>
                                    <span className="hide">
                                        <IonIcon onClick={()=>deleteFromCart(order)} class="float-right close-hover font-xl" icon={closeOutline}/>
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="cost-display-container pad-xl dark">
                            <div className="flex">
                                <div className="max-width pad-mini"><b>TOTAL</b></div>
                                <div className="max-width pad-mini"><b>${total.toFixed(2)}</b></div>
                            </div>
                            <div className="flex font-mini">
                                <div className="max-width pad-mini">TEX</div>
                                <div className="max-width pad-mini">{tax.toFixed(2)}</div>
                            </div>
                            <div className="flex font-mini">
                                <div className="max-width pad-mini">NET</div>
                                <div className="max-width pad-mini">{net.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{width:"60%"}}>
                        <div style={{height:"90vh"}} className="silver2">
                            <div className="scroll relative scrollbar2" style={{height:"78vh",paddingBottom:"40px"}}>
                                <Loader isOpen={showProductLoader} />
                                {
                                    products.length?
                                    products.map((item, key)=>(
                                    <div className="sales-item" key={key}>
                                        <div onClick={()=>addToCart(item)} className="sales-item-sub dark-blue click">
                                            <div className="sales-item-image">
                                                <img hidden={!item?.info?.image} className="max-size" src={item?.info?.image} alt=""/>
                                            </div>
                                            <div className="sales-item-content">
                                                <div>{item?.info?.title}</div>
                                                <div>${item?.info?.salePrice}</div>
                                            </div>
                                            <div onClick={e=>e.stopPropagation()} className="float-bottom-right pad-mini">
                                                <IonIcon onClick={()=>saveMostRecent(item)} icon={saveOutline}/>
                                            </div>
                                        </div>
                                    </div>
                                    )):
                                    <div className="pad-xxl">No records</div>
                                }
                            </div> 
                            <div className="more-option-float">
                                <div onClick={moreOptionToggle} className="dark dark-hover pad-mini" style={{position:"relative",width:"60%",textAlign:"center"}}>
                                    <div className="more-option-btn pad-mini">
                                        <label>More</label>
                                        <div className="float-right">
                                            <IonIcon hidden={moreOption} style={{fontSize:"20px"}} icon={chevronUpOutline}/>
                                        </div>
                                        <div className="float-right">
                                            <IonIcon hidden={!moreOption} style={{fontSize:"20px"}} icon={chevronDownOutline}/>
                                        </div>
                                    </div>
                                </div>
                                <div hidden={!moreOption} className="more-option-item-container scrollbar2">
                                    {mostRecent.map((item, key)=>(
                                        <div className="sales-item" key={key}>
                                            <div onClick={()=>addToCart(item)} className="sales-item-sub dark-blue click">
                                                <div className="sales-item-image">
                                                    <img hidden={!item?.info?.image} className="max-size" src={item?.info?.image} alt=""/>
                                                </div>
                                                <div className="sales-item-content">
                                                    <div>{item?.info?.title}</div>
                                                    <div>${item?.info?.salePrice}</div>
                                                </div>
                                                <div onClick={e=>e.stopPropagation()} className="float-bottom-right pad-mini">
                                                    <IonIcon onClick={()=>removeMostRecent(item)} class="close-hover" icon={closeOutline}/>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>   
                            <div className="action-btn-container">
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>setShowCustomerAction(true)} className="sales-action-btn click dodger">
                                        <IonIcon className="float-center" style={{fontSize:"60px"}} icon={addOutline} />
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>cart?.length? setShowAlert(true): null} className="sales-action-btn click dark dark-hover">
                                        <div className="float-center">CLEAR</div>
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>setShowRefundWindow(true)} className="sales-action-btn click danger">
                                        <div className="float-center">CANCEL</div>
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>cart?.length? setShowPaymentWindow(true): null} className="sales-action-btn click success">
                                        <div className="float-center">PAY</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default OrderEntry;

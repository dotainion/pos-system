import { IonCard, IonCardContent, IonContent, IonIcon, IonLabel, IonList, IonPage } from '@ionic/react';
import { addOutline, chevronDown, chevronDownOutline, chevronUpOutline, closeOutline, pencilOutline, personOutline, reorderFourOutline, saveOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/Store';
import { getProducts, addSale, updateCustomerReward, getCustomerReward, updateProducts, getEndOfDayReporByTimeStamp } from '../database/database';
import { ToolBar } from '../layout/ToolBar';
import { Alert } from '../widgets/Alert';
import { Loader } from '../widgets/Loader';
import { CustomerEntryActions } from '../widgets/CustomerEntryAction';
import { PaymentWindow } from '../widgets/PaymentWindow';
import { SearchBar } from '../widgets/SearchBar';
import { useHistory } from 'react-router';
import { routes } from '../global/Routes';
import { tools } from '../tools/Tools';
import posImage from '../images/pos.jpg';
import prodImage from '../images/product-icon.png';



const OrderEntry = () => {
    const history = useHistory();

    const { cart, user, setCart, products, initProducts, showProductLoader, mostRecent, saveMostRecent, removeMostRecent, searchProducts, settings } = useStore();
    const [loading, setLoading] = useState(false);
    const [moreOption, setMoreOption] = useState(false);
    const [tax, setTax] = useState(0);
    const [net, setNet] = useState(0);
    const [total, setTotal] = useState(0);
    const [showCustomerAction, setShowCustomerAction] = useState(false);
    const [customer, setCustomer] = useState({});
    const [customerSearchValue, setCustomerSearchValue] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showRefundAlert, setShowRefundAlert] = useState(false);
    const [showPaymentWindow, setShowPaymentWindow] = useState(false);
    const [reward, setReward] = useState({});
    const [paymentSubmited, setPaymentSubmited] = useState(false);
    const [showProductsOnMobile, setShowProductsOnMobile] = useState("hide-on-mobile");

    const tenderedRef = useRef();

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
                if (tools.isMobile()) tools.toast(`(${item?.info?.title}) quantity changed to ${cartItem["qty"]}`);
            }
            tempCart.push(cartItem);
        }
        setCart(tempCart);
    }

    const addToCart = (item) =>{
        const qtyMessage = "No more item in stock";
        for (let cartItem of cart){
            if (cartItem?.id === item?.id){
                if (parseInt(cartItem?.qty) >= parseInt(item?.info?.qty)) return tools.toast(qtyMessage);
                return updateCartQty(item);
            }
        }
        if (parseInt(item?.info?.qty) <= 0) return tools.toast(qtyMessage);
        if (tools.isMobile()) tools.toast(`(${item?.info?.title}) was added`);
        let newItem = JSON.parse(JSON.stringify(item));
        newItem["qty"] = 1;
        delete newItem?.info["image"];
        delete newItem?.info["costPrice"];
        setCart([newItem,...cart]);
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
            if (!user?.storeId) alert("Invalid store id");
            setLoading(true);
            setPaymentSubmited(false);
            const submited = await addSale({
                products: cart,
                tax,
                net,
                total,
                date: tools.nowDate(),
                time: tools.nowTime(),
                storeId: user?.storeId || "",
                customerId: customer?.id || ""
            });
            for (let item of cart){
                const qty = parseFloat(item?.info?.qty) - parseFloat(item?.qty) || 0;
                await updateProducts({qty},item?.id);
            }
            await initProducts(user?.storeId);
            if (Object.keys(customer || {}).length > 0){
                const rewardPercentage = ((total / 100) * parseFloat(settings?.reward) || 0);
                const cusReward = {
                    store: "",
                    reward: parseFloat(reward?.reward || 0) + rewardPercentage,
                    visits: parseFloat(reward?.visits || 0) +1
                }
                await updateCustomerReward(cusReward,customer?.id);
            }
            if (submited){
                setCart([]);
                setPaymentSubmited(true);
            }
        }catch(error){
            console.log("someting went wrong");
        }finally{
            if (!paymentSubmited && loading) alert("Something when wrong");
            tenderedRef.current.value = "";
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
        let tempTax = ((sub / 100) * parseFloat(settings?.tax) || 0);
        setNet(sub);
        setTax(tempTax);
        setTotal(sub + tempTax);
    },[cart, settings]);

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
                tenderedRef={tenderedRef}
            />
            <Alert
                isOpen={showAlert}
                onClose={()=>setShowAlert(false)}
                onConfirm={()=>setCart([])}
                message="Are you sure you will like to clear the cart?"
            />
            <Alert
                isOpen={showRefundAlert}
                header="Administrator alert!!"
                onClose={()=>setShowRefundAlert(false)}
                onConfirm={()=>{
                    tools.route.set(routes.refund);
                    history.push(routes.refund);
                }}
                message="Refund of customers requires admin profilage, will you like to continue?"
            />
            <IonContent>
                <div className="toggle-prod-and-order-entry hide-on-desktop" style={{position:"fixed",top:"60px"}}>
                    <img onClick={()=>setShowProductsOnMobile("backdrop-on-mobile")} src={prodImage} alt=""/>
                </div>

                <div className="order-entry-main-container">
                    <div className="order-entry-cart-container">
                        <div className="flex">
                            <div className="max-width search-left-pad-on-mobile pad">
                                <SearchBar onSearch={openCustomerListOnSearch} placeholder="Customer"/>
                            </div>
                            <div className="max-width pad hide-on-mobile">
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
                    <div className="order-entry-product-container">
                        <div className="order-entry-product-sub-container silver2">
                            <div className={`${showProductsOnMobile} order-entry-product-for-mobile`}>

                                <div className="toggle-prod-and-order-entry hide-on-desktop">
                                    <img onClick={()=>setShowProductsOnMobile("hide-on-mobile")} src={posImage} alt=""/>
                                </div>

                                <div className="scroll relative scrollbar2 order-entry-product-mini-container">
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
                                <div hidden className="more-option-float">
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
                            </div>
                            <div className="action-btn-container">
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>setShowCustomerAction(true)} className="sales-action-btn click dodger">
                                        <IonIcon className="float-center" style={{fontSize:"60px"}} icon={addOutline} />
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>cart?.length? setShowAlert(true): null} className="sales-action-btn click dark">
                                        <div className="float-center">CLEAR</div>
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>setShowRefundAlert(true)} className="sales-action-btn click danger">
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

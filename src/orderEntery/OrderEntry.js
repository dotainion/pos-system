import { IonCard, IonCardContent, IonContent, IonIcon, IonLabel, IonList, IonPage, useIonViewWillEnter } from '@ionic/react';
import { addOutline, chevronDown, chevronDownOutline, chevronUpOutline, closeOutline, pencilOutline, personOutline, radioButtonOnOutline, reorderFourOutline, saveOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/Store';
import { getProducts, addSale, updateCustomerReward, getCustomerReward, updateProducts, getEndOfDayReporByTimeStamp, getProductsById } from '../database/database';
import { ToolBar } from '../layout/ToolBar';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { PaymentWindow } from './widgets/PaymentWindow';
import { SearchBar } from '../widgets/SearchBar';
import { useHistory } from 'react-router';
import { routes } from '../global/Routes';
import { tools } from '../tools/Tools';
import { MobileOrderEntryNav } from '../layout/MobileProductNav';
import { CalculatorDragable } from '../app/Calculator';
import { Discounts } from '../app/Discounts';
import { EditCart } from './widgets/EditCart';
import { calc } from '../calc/Calculate';
import { NoRecords } from '../widgets/NoRecords';
import { OrderEntryAction } from './widgets/OrderEntryAction';



const OrderEntry = () => {
    const history = useHistory();

    const { cart, user, net, tax, discount, total, setCart, products, initProducts, showProductLoader, mostRecent, saveMostRecent, removeMostRecent, searchMostRecent, searchProducts, settings } = useStore();
    
    const [loading, setLoading] = useState(false);
    const [moreOption, setMoreOption] = useState(false);
    const [showCustomerAction, setShowCustomerAction] = useState(false);
    const [customer, setCustomer] = useState({});
    const [customerSearchValue, setCustomerSearchValue] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showPayOutAlert, setShowPayOutAlert] = useState(false);
    const [showPaymentWindow, setShowPaymentWindow] = useState(false);
    const [reward, setReward] = useState({});
    const [paymentSubmited, setPaymentSubmited] = useState(false);
    const [showProductsOnMobile, setShowProductsOnMobile] = useState("hide-on-mobile");
    const [showCalculator, setShowCalculator] = useState(false);
    const [showRecentAlert, setShowRecentAlert] = useState({state:false,data:null});
    const [showDiscounts, setShowDiscounts] = useState(false);
    const [showCostingAlert, setShowCostingAlert] = useState(false);
    const [showEditCart, setShowEditCart] = useState({state:false,data:{}});

    const tenderedRef = useRef();

    const moreOptionToggle = () =>{
        if (moreOption) setMoreOption(false);
        else setMoreOption(true);
    }

    const isInMostRecent = (order) =>{
        for (let recent of mostRecent){
            if (recent?.id === order?.id) return true;
        }
        return false;
    }

    const searchRecent = (value) =>{
        searchMostRecent(value);
    }

    const updateCartQty = (item,value=null) =>{
        calc.updateCartQty(item, value);
    }

    const addToCart = (item) =>{
        calc.addToCart(item);
    }

    const addMostRecentToCart = async(item) =>{
        const prod = await calc.addMostRecentToCart(item);
        if (Object.keys(prod || {}).length <= 0) setShowRecentAlert({state:true,data:item});
    }

    const deleteFromCart = (item) =>{
        calc.deleteFromCart(item);
    }

    const onCloseSale = async() =>{
        try{
            if (cart?.length <= 0) return;
            if (!user?.storeId) alert("Invalid store id");
            setLoading(true);
            setPaymentSubmited(false);
            //store discount titles
            let cartCopy = [];
            let cartConfig = [];
            for (let item of cart){
                if (item?.info?.type) cartConfig.push(item?.info);
                else cartCopy.push(item);
            }
            const submited = await addSale({
                products: cartCopy,
                tax,
                net,
                total: total + discount,
                discountTotal: discount,
                discounts: cartConfig,
                date: tools.nowDate(),
                time: tools.nowTime(),
                processBy: user?.name || "",
                storeId: user?.storeId || "",
                customerId: customer?.id || ""
            });
            //update product quantity in database
            for (let item of cartCopy){
                const qty = parseFloat(item?.info?.qty) - parseFloat(item?.qty) || 0;
                await updateProducts({qty},item?.id);
            }
            //reinit product to access current value
            await initProducts(user?.storeId);
            //update customer reward
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

    //check before opening checkout window
    const onConfirmToCheckout = () =>{
        if (!cart?.length) return tools.toast("No item in cart","warning",3000);
        if (total <= 0) return setShowCostingAlert(true);
        setShowPaymentWindow(true);
    }

    //detect change in cart and update NET and TOTAL accordingly
    useEffect(()=>{
        calc.caclulate();
    },[cart, settings]);

    //detect change in customer and update accordingly
    useEffect(()=>{
        initCustomerReward(customer);
    },[customer]);

    return (
        <IonPage className="page">
            <ToolBar
                onOpenCalc={()=>setShowCalculator(true)}
                onOpenPayOut={()=>setShowPayOutAlert(true)}
                onOpenDiscounts={()=>setShowDiscounts(true)}
            />
            <OrderEntryAction
                isOpen={showCustomerAction}
                onClose={()=>setShowCustomerAction(false)}
                onCustomerSelected={setCustomer}
                searchValue={customerSearchValue}
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
                okText="Yes"
                cancelText="No"
            />
            <Alert
                isOpen={showPayOutAlert}
                header="Administrator Alert!!"
                onClose={()=>setShowPayOutAlert(false)}
                onConfirm={()=>{
                    tools.route.set(routes.refund);
                    history.push(routes.refund);
                }}
                message="Pay out requires admininistrator profilage. Will you like to continue?"
                okText="Yes"
                cancelText="No"
            />
            <Alert
                isOpen={showRecentAlert.state}
                header="Product Alert!!"
                message="This product is no longer available or can't be reach at this time. Will you like to remove it?"
                onClose={()=>setShowRecentAlert({state:false,data:null})}
                onConfirm={()=>removeMostRecent(showRecentAlert.data)}
            />
            <Alert
                isOpen={showCostingAlert}
                header="Costing alert!!"
                message={`Total costing is in a negative state ($${total?.toFixed?.(2)}). Try removing discounts.`}
                onClose={()=>setShowCostingAlert(false)}
                hideCancelButton
            />
            <CalculatorDragable
                isOpen={showCalculator}
                onClose={()=>setShowCalculator(false)}
                onBackdropDismiss
            />
            <Discounts
                isOpen={showDiscounts}
                onClose={()=>setShowDiscounts(false)}
                onSelect={(discount)=>setCart([...cart, discount])}
            />
            <EditCart
                isOpen={showEditCart.state}
                record={showEditCart.data}
                onClose={()=>setShowEditCart({state:false,data:null})}
            />
            <IonContent>
                <div className="order-entry-main-container">
                    <div className="order-entry-cart-container">
                        <div className="flex">
                            <div className="max-width pad">
                                <SearchBar onSearch={openCustomerListOnSearch} placeholder="Customer"/>
                            </div>
                            <div className="max-width pad hide-on-mobile">
                                <SearchBar onSearch={searchProducts} placeholder="Product"/>
                            </div>
                        </div>

                        <div className="flex pad-v-xl font relative" style={{marginLeft:"40px",color:"white"}}>
                            <div className="float-top-right">{user?.businessName}</div>
                            <IonIcon class="customer-image-icon" icon={personOutline}/>
                            <div style={{position:"relative"}}>
                                <div className="float-left no-wrap" style={{left:"20px"}}>
                                    <div>{customer?.info?.name || "Customer"}</div>
                                    <div>Loyalty program</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex font dark reward-container">
                            <div className="max-width pad-h">
                                <div>STORE</div>
                                <div className="text-right pad-v">{reward?.store || ""}</div>
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
                            <div className="sales-item-name-header dark">Product</div>
                            <div className="sales-item-qty-header dark">Qty</div>
                            <div className="sales-item-price-header dark">Price</div>
                        </div>

                        <div className="sales-item-container bg">
                            {cart.map((order, key)=>(
                                <div onClick={()=>setShowEditCart({state:true,data:order})} className="cart-item-hover flex relative" key={key} style={{color:order?.info?.type && "purple" || order?.info?.discount && "dodgerblue"}}>
                                    <div className="sales-item-name-header" style={{border:"none"}}>{order?.info?.title}</div>
                                    <div onClick={e=>e.stopPropagation()} className="sales-item-qty cart-qty-item-hover" style={{border:"none"}}>
                                        <div className="inline">{order?.qty}&nbsp;</div>
                                        <div className="inline">{order?.info?.qtyType}</div>
                                        <input 
                                            hidden={order?.info?.type}
                                            className="float-center max-height hide"
                                            onChange={(e)=>updateCartQty(order,e.target.value)} 
                                            value={order?.qty}
                                            type="number"
                                        />
                                    </div>
                                    <div className="sales-item-price-header" style={{border:"none"}}>
                                        {order?.info?.type? order?.info?.type: "$"}
                                        {order?.info?.type && "-"}{order?.info?.salePrice || order?.info?.discount}
                                    </div>
                                    <span onClick={e=>e.stopPropagation()} className="hide" style={{border:"none"}}>
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
                                <div className="max-width pad-mini">TAX</div>
                                <div className="max-width pad-mini">{tax.toFixed(2)}</div>
                            </div>
                            <div className="flex font-mini">
                                <div className="max-width pad-mini">NET</div>
                                <div className="max-width pad-mini">{net.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="order-entry-product-container">
                        <div className="order-entry-product-sub-container bg">
                            <div className={`${showProductsOnMobile} order-entry-product-for-mobile`}>
                                <div className="scroll relative scrollbar2 order-entry-product-mini-container">
                                    <Loader isOpen={showProductLoader} />
                                    <div className="max-width pad-xl hide-on-desktop">
                                        <SearchBar onSearch={searchProducts} placeholder="Search product"/>
                                    </div>
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
                                            </div>
                                            <div onClick={e=>e.stopPropagation()} className={`float-bottom-right pad-mini hide ${isInMostRecent(item) || "click2"}`} style={{right:"10px",bottom:"8px"}}>
                                                <IonIcon hidden={isInMostRecent(item)} color="primary" onClick={()=>saveMostRecent(item)} icon={saveOutline}/>
                                                <IonIcon hidden={!isInMostRecent(item)} color="success" icon={radioButtonOnOutline}/>
                                            </div>
                                        </div>
                                        )):
                                        <NoRecords/>
                                    }
                                </div> 
                                <div className="float-recent-option">
                                    <div onClick={moreOptionToggle} className="float-top-left dark dark-hover recent-option-btn">
                                        <div hidden={moreOption} className="flex">
                                            <label>Recent</label>
                                            <IonIcon icon={chevronUpOutline}/>
                                        </div>
                                        <div hidden={!moreOption} className="flex" onClick={e=>e.stopPropagation()} style={{width:"250px"}}>
                                            <SearchBar onSearch={searchRecent} placeholder="Search Recent" />
                                            <IonIcon onClick={moreOptionToggle} style={{fontSize:"30px",color:"red"}} icon={closeOutline}/>
                                        </div>
                                    </div>
                                    <div hidden={!moreOption} className="more-option-item-container scrollbar2">
                                        {
                                            mostRecent.length?
                                            mostRecent.map((item, key)=>(
                                                <div className="sales-item" key={key}>
                                                    <div onClick={()=>addMostRecentToCart(item)} className="sales-item-sub dark-blue click">
                                                        <div className="sales-item-image">
                                                            <img hidden={!item?.info?.image} className="max-size" src={item?.info?.image} alt=""/>
                                                        </div>
                                                        <div className="sales-item-content">
                                                            <div>{item?.info?.title}</div>
                                                            <div>${item?.info?.salePrice}</div>
                                                        </div>
                                                    </div>
                                                    <div onClick={e=>e.stopPropagation()} className="float-bottom-right pad-mini click2"  style={{right:"10px",bottom:"8px"}}>
                                                        <IonIcon onClick={()=>removeMostRecent(item)} class="close-hover" icon={closeOutline}/>
                                                    </div>
                                                </div>
                                            )):
                                            <div style={{height:"200px"}}>
                                                <NoRecords onRefresh={()=>searchRecent("")} color="white" />
                                            </div>
                                        }
                                    </div>
                                </div> 
                            </div>
                            <div className="action-btn-container">
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>setShowCustomerAction(true)} className="sales-action-btn click dodger">
                                        <IonIcon className="float-center" style={{fontSize:"50px"}} icon={addOutline} />
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>cart?.length? setShowAlert(true): null} className="sales-action-btn click dark">
                                        <div className="float-center">CLEAR</div>
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>setShowPayOutAlert(true)} className="sales-action-btn click danger">
                                        <div className="float-center">PAY OUT</div>
                                    </div>
                                </div>
                                <div className="sales-action-btn-container">
                                    <div onClick={()=>onConfirmToCheckout()} className="sales-action-btn click success">
                                        <div className="float-center">PAY</div>
                                    </div>
                                </div>
                            </div>
                            <MobileOrderEntryNav onClick={setShowProductsOnMobile} onOptonClick={moreOptionToggle} value={showProductsOnMobile} />
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default OrderEntry;

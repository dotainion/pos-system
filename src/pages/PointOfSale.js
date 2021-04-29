import { IonCard, IonCardContent, IonContent, IonIcon, IonLabel, IonList, IonPage } from '@ionic/react';
import { addOutline, chevronDown, chevronDownOutline, chevronUpOutline, personOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { ToolBar } from '../layout/ToolBar';
import { SearchBar } from '../widgets/SearchBar';


const Sales = () => {
    const { cart, setCart } = useStore();
    const [moreOption, setMoreOption] = useState(false);
    const [tax, setTax] = useState(0);
    const [net, setNet] = useState(0);
    const [total, setTotal] = useState(0);

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
            if (cartItem?.id === item?.id){
                return updateCartQty(item);
            }
        }
        item["qty"] = 1;
        setCart([item,...cart]);
    }

    //detect change in cart and update NET and TOTAL accordingly
    useEffect(()=>{
        let sub = 0;
        for (let cartItem of cart){
            let qty = parseFloat(cartItem?.qty);
            let price = parseFloat(cartItem?.info?.price);
            sub = sub + (price * qty);
        }
        let tempTax = ((sub / 100) * 15);
        setNet(sub);
        setTax(tempTax);
        setTotal(sub + tempTax);
    },[cart]);
    return (
        <IonPage className="page">
            <ToolBar/>
            <IonContent>
                <div className="flex no-select" style={{minWidth:"700px"}}>
                    <div style={{width:"40%",padding:"20px",borderRight:"5px solid rgb(48, 46, 46)"}}>
                        <div className="flex">
                            <div className="max-width pad">
                                <SearchBar placeholder="Customer"/>
                            </div>
                            <div className="max-width pad">
                                <SearchBar placeholder="Product"/>
                            </div>
                        </div>

                        <div className="flex pad-v-xl font" style={{marginLeft:"40px"}}>
                            <IonIcon class="customer-image-icon" icon={personOutline}/>
                            <div style={{position:"relative"}}>
                                <div className="float-left no-wrap" style={{left:"20px",color:"white"}}>
                                    <div>Jhon Wick</div>
                                    <div>Loyalty program</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex pad-v-xl font dark">
                            <div className="max-width pad-h">
                                <div>STORE</div>
                                <div className="text-right pad-v">0.000</div>
                            </div>
                            <div className="max-width pad-h border-l-r">
                                <div>REWARD</div>
                                <div className="text-right pad-v">4200</div>
                            </div>
                            <div className="max-width pad-h">
                                <div>VISIT</div>
                                <div className="text-right pad-v">19</div>
                            </div>
                        </div>

                        <div className="sales-item-header-container">
                            <div className="sales-item-name-header dark">name</div>
                            <div className="sales-item-qty-header dark">Qty</div>
                            <div className="sales-item-price-header dark">Price</div>
                        </div>

                        <div className="sales-item-container">
                            {cart.map((order, key)=>(
                                <div key={key}>
                                    <div className="sales-item-name-header">{order?.info?.title || "Not Provided"}</div>
                                    <div className="sales-item-qty"><input onChange={(e)=>updateCartQty(order,e.target.value)} value={order?.qty || 1}/></div>
                                    <div className="sales-item-price-header">{order?.info?.price || "Not Provided"}</div>
                                </div>
                            ))}
                        </div>

                        <div className="cost-display pad-xl dark">
                            <div className="flex">
                                <div className="max-width pad-mini"><b>TOTAL</b></div>
                                <div className="max-width pad-mini"><b>${total}</b></div>
                            </div>
                            <div className="flex font-mini">
                                <div className="max-width pad-mini">TEX</div>
                                <div className="max-width pad-mini">{tax}</div>
                            </div>
                            <div className="flex font-mini">
                                <div className="max-width pad-mini">NET</div>
                                <div className="max-width pad-mini">{net}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{width:"60%"}}>
                        <div style={{height:"90vh",backgroundColor:"lightgray"}}>
                            <div style={{overflowY:"auto",height:"78vh",paddingBottom:"40px"}}>
                                {
                                    [{id:"test-id",info:{title:"test title",price:"5.00"}},{id:"test-id-2",info:{title:"test title",price:"20.00"}}].map((item, key)=>(
                                    <div class="sales-item" key={key}>
                                        <div onClick={()=>addToCart(item)} className="sales-item-sub dark-blue click">
                                            <div className="float-center">
                                                <div style={{textAlign:"center"}}>Food</div>
                                                <div style={{fontSize:"13px",textAlign:"center"}}>$0.00</div>
                                            </div>
                                        </div>
                                    </div>
                                    ))
                                }
                            </div> 
                            <div className="more-option-float">
                                <div onClick={moreOptionToggle} className="dark dark-hover pad-mini" style={{position:"relative",width:"60%",textAlign:"center"}}>
                                    <div className="more-option-btn pad-mini">
                                        <label>More</label>
                                        <IonIcon hidden={!moreOption} class="float-center" style={{fontSize:"20px",left:"54%"}} icon={chevronUpOutline}/>
                                        <IonIcon hidden={moreOption} class="float-center" style={{fontSize:"20px",left:"54%"}} icon={chevronDownOutline}/>
                                    </div>
                                </div>
                                <div hidden={!moreOption} className="more-option-item-container">
                                    {[1,21,2,1,2,2,1,21,23,4,5,6,8,7,95,4,5,5,2,2,1,2,2,1,2,2,1,21,2,1,2,2,1,2].map((item, key)=>(
                                        <div class="sales-item" key={key}>
                                            <div className="sales-item-sub teal click">
                                                <div className="float-center">
                                                    <div style={{textAlign:"center"}}>Food</div>
                                                    <div style={{fontSize:"13px",textAlign:"center"}}>$0.00</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>   
                            <div>
                                <div class="sales-item">
                                    <div className="sales-item-sub click dodger">
                                        <IonIcon className="float-center" style={{fontSize:"60px"}} icon={addOutline} />
                                    </div>
                                </div>
                                <div class="sales-item">
                                    <div className="sales-item-sub click dark dark-hover">
                                        <div className="float-center">CLEAR</div>
                                    </div>
                                </div>
                                <div class="sales-item">
                                    <div className="sales-item-sub click danger">
                                        <div className="float-center">CANCEL</div>
                                    </div>
                                </div>
                                <div class="sales-item">
                                    <div className="sales-item-sub click success">
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

export default Sales;

import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowUndoOutline, cartOutline, chevronDownOutline, chevronUpOutline, ellipsisVerticalOutline, homeOutline, reorderFourOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useStore } from '../context/Store';
import { addPayout, getCustomer, getCustomerById, getSales, getUser, updateSales } from '../database/database';
import { routes } from '../global/Routes';
import { tools } from '../tools/Tools';
import { Alert } from '../components/Alert';
import { Dropdown } from '../widgets/Dropdown';
import { Loader } from '../components/Loader';
import { SearchBar } from '../widgets/SearchBar';
import { PayoutSideBar } from './widgets/PayoutSideBar';
import { Button } from '../widgets/Button';


let payoutContainerIds = [];
export const Payout = () =>{
    const history = useHistory();

    const { user } = useStore();

    const [sales, setSales] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState({state:false,data:null});
    const [showMenu, setShowMenu] = useState(false);

    const onRefund = async(object) =>{
        if (object?.info?.refunded) return;
        if (!Object.keys(object || {}).length) return;
        setShowLoader(true);
        setLoading(true);
        delete object?.info?.["products"];
        await addPayout({
            ...object?.info,
            saleId: object?.id,
            date: tools.nowDate(),
            time: tools.nowTime(),
        });
        await updateSales({refunded: true},object?.id);
        await initSales();
        setShowLoader(false);
        setLoading(false);
    }

    const initSales = async() =>{
        setShowLoader(true);
        let index = 0;
        let tempStorage = [];
        const customerSales = await getSales(user?.storeId);
        for (let cusSale of customerSales){
            cusSale["customer"] = await getCustomerById(cusSale?.info?.customerId);
            tempStorage.push(cusSale);
            payoutContainerIds.push(`${cusSale?.id}${index}`);
            index ++;
        };
        setSales(tempStorage);
        setShowLoader(false);
    }

    const collapps = () =>{
        for (let id of payoutContainerIds){
            let element = document.getElementById(id);
            let mainElement = document.getElementById(`${id}main`);
            if (!element.hidden){
                element.hidden = true;
                mainElement.style.padding = "0px";
                mainElement.style.border = "none";
            }
        }
    }

    const toggleItemOnHold = (id) =>{
        collapps();
        let element = document.getElementById(id);
        let mainElement = document.getElementById(`${id}main`);
        if (element.hidden){
            element.hidden = false;
            mainElement.style.padding = "3px";
            mainElement.style.border = "2px solid teal";
        }else element.hidden = true;
    }

    useEffect(()=>{
        initSales?.();
    },[]);
    return(
        <IonPage>
            <Alert
                isOpen={showAlert.state}
                okText="Yes"
                cancelText="No"
                header="Alert!!"
                headerColor="orangered"
                message="Are you sure you want to process this refund?"
                onClose={()=>setShowAlert({state:false,data:null})}
                onConfirm={()=>onRefund(showAlert.data)}
            />
            <IonContent>
                <div className="max-size relative silver no-select">
                    <Loader isOpen={showLoader}/>
                    <PayoutSideBar
                        isOpen={showMenu} 
                        onClose={()=>setShowMenu(false)}
                    />
                    <div className="pad-xl dark">
                        <div onClick={()=>history.push(routes.orderEntry)} class="float-top-left pad-xl">
                            <IonIcon style={{fontSize:"30px"}} icon={arrowUndoOutline}/>
                            <div style={{fontSize:"8px"}}>Order entry</div>
                        </div>
                        <IonIcon hidden={showMenu} onClick={()=>setShowMenu(true)} class="float-top-right pad-xl" icon={reorderFourOutline} style={{fontSize:"30px"}} />
                        <div className="payout-search-container">
                            <SearchBar placeholder="Search Customer"/>
                        </div>
                    </div>
                    <div className="max-size refund-container item-center scrollbar scroll bg relative">
                        {
                            sales?.length?
                            sales.map((sale, key)=>(
                                <div id={`${sale?.id}${key}main`} className="radius" style={{marginTop:"10px"}} key={key}>
                                    <div onClick={()=>toggleItemOnHold(`${sale?.id}${key}`)} 
                                        className="pad radius pointer no-select border" 
                                        style={{
                                            backgroundColor:sale?.info?.refunded && "darkred" || "var(--dark-gray)",
                                            color:"white",
                                        }}>
                                        <div className="flex d-flex-on-mobile">
                                            <div className="max-width">Date: {sale?.info?.date}</div>
                                            <div className="max-width">Time: {sale?.info?.time}</div>
                                            <div className="max-width">Customer: <b style={{color:"dodgerblue"}}>{sale?.customer?.name || <span style={{color:"navy"}}>None</span>}</b></div>
                                            <div className="max-width">Net: {sale?.info?.net?.toFixed(2)}</div>
                                            <div className="max-width">Tax: {sale?.info?.tax?.toFixed(2)}</div>
                                            <div className="max-width">Total: <b>{sale?.info?.total?.toFixed(2)}</b></div>
                                        </div>
                                    </div>
                                    <div hidden id={`${sale?.id}${key}`} style={{marginBottom:"50px",backgroundColor:"teal"}}>
                                        <div className="no-select dark" style={{borderBottom:"1px solid gray",color:"white",marginTop:"5px"}} key={key}>
                                            <div className="sales-item-name-header radius" style={{border:"none"}}>Item Name</div>
                                            <div className="sales-item-qty-header radius" style={{border:"none"}}>Quantity</div>
                                            <div className="sales-item-price-header radius" style={{border:"none"}}>Price</div>
                                        </div>
                                        <div className="pad-xl">
                                            <Button 
                                                text="Pay Out"
                                                disabled={loading}
                                                hidden={sale?.info?.refunded}
                                                onClick={()=>setShowAlert({state:true,data:sale})}
                                            />
                                            <div hidden={!sale?.info?.refunded} style={{color:"orangered"}}>Refunded</div>
                                        </div>
                                        {sale?.info?.products?.map((prod, key)=>(
                                            <div className="no-select" style={{borderBottom:"1px solid gray",color:"white",marginLeft:"10px"}} key={key}>
                                                <div className="sales-item-name-header radius" style={{border:"none"}}>{prod?.info?.title || "Not Provided"}</div>
                                                <div className="sales-item-qty-header radius" style={{border:"none"}}>{prod?.info?.qty || 1}</div>
                                                <div className="sales-item-price-header radius" style={{border:"none"}}>${prod?.info?.salePrice || "Not Provided"}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )):
                            <div>No Record</div>
                        }
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}
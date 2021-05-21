import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, homeOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useStore } from '../context/Store';
import { getCustomer, getCustomerById, getSales, getUser } from '../database/database';
import { routes } from '../global/Routes';
import { Dropdown } from '../widgets/Dropdown';
import { Loader } from '../widgets/Loader';
import { SearchBar } from '../widgets/SearchBar';


export const CustomerRefend = () =>{
    const history = useHistory();
    const { user } = useStore();
    const [sales, setSales] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    const onGetSales = async() =>{
        setShowLoader(true);
        let tempStorage = [];
        const customerSales = await getSales(user?.storeId);
        for (let cusSale of customerSales){
            cusSale["customer"] = await getCustomerById(cusSale?.info?.customerId);
            tempStorage.push(cusSale);
        };
        setSales(tempStorage);
        setShowLoader(false);
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

    useEffect(()=>{
        onGetSales?.();
    },[]);
    return(
        <IonPage>
            <IonContent>
                <div className="max-size relative silver">
                    <Loader isOpen={showLoader}/>
                    <div className="pad-xxl dark">
                        <IonIcon onClick={()=>history.push(routes.orderEntry)} class="float-top-left pad-xl" style={{fontSize:"30px"}} icon={homeOutline}/>
                        <div className="half-width max-width-on-mobile search-left-pad-on-mobile item-center" style={{color:"black"}}>
                            <SearchBar placeholder="Search Customer" />
                        </div>
                        <div className="item-center max-width-on-mobile">
                            <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                            <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                            <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                            <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                        </div>
                    </div>
                    <div className="max-size refund-container item-center scrollbar scroll" style={{backgroundColor:"white"}}>
                        {
                            sales?.length?
                            sales.map((sale, key)=>(
                                <div style={{marginTop:"10px"}} key={key}>
                                    <div onClick={()=>toggleItemOnHold(`${sale?.id}${key}`)} className="pad radius max-width pointer no-select silver relative">
                                        <div>
                                            <div>Date: {sale?.info?.date}</div>
                                            <div>Time: {sale?.info?.time}</div>
                                            <div>Customer: <b style={{color:"dodgerblue"}}>{sale?.customer?.name || <span style={{color:"teal"}}>None</span>}</b></div>
                                            <div>Net: {sale?.info?.net?.toFixed(2)}</div>
                                            <div>Tax: {sale?.info?.tax?.toFixed(2)}</div>
                                            <div>Total: <b>{sale?.info?.total?.toFixed(2)}</b></div>
                                        </div>
                                        <div className="float-right pad">
                                            <IonIcon hidden id={`${sale?.id}${key}up`} icon={chevronUpOutline}/>
                                            <IonIcon id={`${sale?.id}${key}down`} icon={chevronDownOutline}/>
                                        </div>
                                    </div>
                                    <div hidden id={`${sale?.id}${key}`} style={{marginBottom:"50px"}}>
                                        <div className="no-select dark" style={{borderBottom:"1px solid gray",color:"white",marginTop:"5px",marginLeft:"10px"}} key={key}>
                                            <div className="sales-item-name-header radius" style={{border:"none"}}>Item Name</div>
                                            <div className="sales-item-qty-header radius" style={{border:"none"}}>Quantity</div>
                                            <div className="sales-item-price-header radius" style={{border:"none"}}>Price</div>
                                        </div>
                                        {sale?.info?.products?.map((prod, key)=>(
                                            <div className="no-select" style={{borderBottom:"1px solid gray",color:"black",marginLeft:"10px"}} key={key}>
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
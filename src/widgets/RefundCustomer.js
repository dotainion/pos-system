import { IonIcon } from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { PopupContainer } from '../components/PopupContainer';
import { Dropdown } from './Dropdown';
import { SearchBar } from './SearchBar';
import { getSales } from '../database/database';


export const RefundCustomer = ({isOpen, onClose}) =>{
    const [sales, setSales] = useState([]);
    const onGetSales = async() =>{
        setSales(await getSales());
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

    const handleDate = (date) =>{
        return new Date(date).toString();
    }

    useEffect(()=>{
        if (isOpen) onGetSales?.();
    },[isOpen]);
    return(
        <PopupContainer isOpen={isOpen} onClose={onClose}>
            <div className="dark max-size">
                <div className="pad-xxl dark" style={{color:"black"}}>
                    <div className="half-width max-width-on-mobile item-center">
                        <SearchBar placeholder="Search Customer" />
                    </div>
                    <div className="item-center max-width-on-mobile" style={{color:"white"}}>
                        <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                        <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                        <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                        <Dropdown cssClass="inline pad" options={["jeack"]}>Filter</Dropdown>
                    </div>
                </div>
                <div className="max-size refund-container item-center scrollbar scroll">
                    {
                        sales?.length?
                        sales.map((sale, key)=>(
                            <div key={key}>
                                <div onClick={()=>toggleItemOnHold(`${sale?.id}${key}`)} className="pad radius max-width pointer no-select dark">
                                    <span>{handleDate(sale?.info?.date)}</span>
                                    <IonIcon style={{float:"right"}} hidden id={`${sale?.id}${key}up`} icon={chevronUpOutline}/>
                                    <IonIcon style={{float:"right"}} id={`${sale?.id}${key}down`} icon={chevronDownOutline}/>
                                </div>
                                <div hidden id={`${sale?.id}${key}`}>
                                    {sale?.info?.products?.map((prod, key)=>(
                                        <div className="no-select" style={{backgroundColor:"rgb(0,0,0,0.5)",color:"white"}} key={key}>
                                            <div className="sales-item-name-header radius">{prod?.info?.title || "Not Provided"}</div>
                                            <div className="sales-item-qty-header radius">{prod?.info?.qty || 1}</div>
                                            <div className="sales-item-price-header radius">${prod?.info?.salePrice || "Not Provided"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )):
                        <div>No Record</div>
                    }
                </div>
            </div>
        </PopupContainer>
    )
}
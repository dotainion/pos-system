import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/Store';
import { SearchBar } from '../../widgets/SearchBar';
import { AddCustomer } from './AddCustomer';


export const ViewCustomers = ({isOpen, onCustomerSelected, searchValue}) =>{
    const { customers } = useStore();

    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [customer, setCustomer] = useState({});
    const [defaultSearchValue, setDefaultSearchValue] = useState("");

    const onCustomerSearch = (value) =>{
        
    }

    //detech change in customer selected and fire callback
    useEffect(()=>{
        onCustomerSelected?.(customer);
    },[customer]);

    //detech change in search for customer on order enter
    useEffect(()=>{
        if (searchValue){
            onCustomerSearch(searchValue);
            setDefaultSearchValue(searchValue);
        }
    },[searchValue]);
    
    return(
        <>
        <div hidden={!isOpen} className="pad entry-action-sub">
            <div className="half-width max-width-on-mobile item-center">
                <SearchBar
                    placeholder="Search customer..."
                    defaultValue={defaultSearchValue}
                    onSearch={onCustomerSearch}
                />
            </div>
            <div className="relative">
                <div style={{float:"left"}}>Selected Customer: <b className="float-bottom-overflow pad-mini" style={{color:"brown"}}>{customer?.info?.name}</b></div>
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
        <AddCustomer
            isOpen={showAddCustomer}
            onClose={()=>setShowAddCustomer(false)}
        />
        </>
    )
}
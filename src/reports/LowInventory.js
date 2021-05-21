import { IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { getLowStocks } from '../database/database';
import { Loader } from '../widgets/Loader';


export const LowInventory = ({isOpen}) =>{
    const { user } = useStore();

    const [lowStocks, setLowStocks] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    const initLowStocks = async() =>{
        setShowLoader(true);
        const stocks = await getLowStocks(user?.storeId);
        const lowQtyStocks = stocks.filter((stock)=>parseInt(stock?.info?.qty) <= 5);
        setLowStocks(lowQtyStocks);
        setShowLoader(false);
    }
    useEffect(()=>{
        initLowStocks();
    },[]);
    return(
        <div hidden={!isOpen} className="max-size relative">
            <Loader isOpen={showLoader}/>
            <div className="centered pad-xxl">
                <div onClick={initLowStocks} class="float-top-right" style={{marginRight:"40px",marginTop:"10px"}}>
                    <IonIcon icon={refreshOutline}/>
                    <div style={{fontSize:"9px"}}>Refresh</div>
                </div>
                <div className="pad-xl">
                    <div>My Restaurant</div>
                    <div>600 blcayne Blvd</div>
                    <div>Miami, Fl 33120</div>
                    <div>1 (473) 999 9999</div>
                </div>
                <div className="pad" style={{borderTop:"1px dashed black",borderBottom:"1px dashed black"}}>
                    <div>INVENTORY LOW STOCK</div>
                    <div>4/15/2021 3:21.00 AM</div>
                </div>
                <div className="pad-xxl" style={{borderBottom:"1px dashed black"}}>
                    <div className="pad" style={{textAlign:"right"}}>IN STOCK/REORDER LEVEL</div>
                    <div className="flex silver" style={{textAlign:"left"}}>
                        <div className="max-width pad">Title</div>
                        <div className="max-width pad">Qty</div>
                        <div className="max-width pad">Price</div>
                    </div>
                    <div>
                        {
                            lowStocks.length?
                            lowStocks.map((prod, key)=>(
                                <div className="flex" style={{textAlign:"left"}} key={key}>
                                    <div className="max-width pad">{prod?.info?.title}</div>
                                    <div className="max-width pad">{prod?.info?.qty}</div>
                                    <div className="max-width pad">${prod?.info?.salePrice}</div>
                                </div>
                            )):
                            <div className="pad" style={{color:"green"}}>NO LOW STOCKS</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
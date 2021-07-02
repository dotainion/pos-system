import { IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { getLowStocks } from '../database/database';
import { tools } from '../tools/Tools';
import { Loader } from '../components/Loader';


export const LowInventory = ({isOpen}) =>{
    const { user, settings } = useStore();

    const [lowStocks, setLowStocks] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    const initLowStocks = async() =>{
        setShowLoader(true);
        setLowStocks([]);
        const stocks = await getLowStocks(user?.storeId);
        const lowQtyStocks = stocks.filter((stock)=>parseInt(stock?.info?.qty) <= parseInt(settings?.lowStock || 5));
        setLowStocks(lowQtyStocks);
        setShowLoader(false);
    }
    useEffect(()=>{
        initLowStocks();
    },[settings]);
    return(
        <div hidden={!isOpen} className="max-size relative">
            <Loader isOpen={showLoader}/>
            <div className="centered pad-xxl">
                <div onClick={initLowStocks} className="float-top-right" style={{marginRight:"40px",marginTop:"10px"}}>
                    <IonIcon icon={refreshOutline}/>
                    <div style={{fontSize:"9px"}}>Refresh</div>
                </div>
                <div className="pad-xl">
                    <div>{user?.businessName}</div>
                    <div>{user?.address}</div>
                    <div>{user?.city}, {user?.country} {user?.zip}</div>
                    <div>{user?.number}</div>
                </div>
                <div className="pad" style={{borderTop:"1px dashed black",borderBottom:"1px dashed black"}}>
                    <div>INVENTORY LOW STOCK</div>
                    <div>{tools.nowDate()} {tools.nowTime()}</div>
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
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { getEndOfDayReporByTimeStamp } from '../database/database';
import { tools } from '../tools/Tools';



export const CashDrawers = ({isOpen}) =>{
    const { user } = useStore();

    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0); 
    const [transactionCount, setTransactionCount] = useState(0);

    const configureCashDrawer = async() =>{
        const salesItems = await getEndOfDayReporByTimeStamp(tools.nowDate(), user?.storeId);
        if (salesItems?.length){
            setTransactionCount(salesItems?.length);
            let tempTax = 0;
            let tempNet = 0;
            let tempTotal = 0;
            for (let item of salesItems){
                tempTax = tempTax + item?.info?.tax;
                tempNet = tempNet + item?.info?.net;
                tempTotal = tempTotal + item?.info?.total;
            }
            setTax(tempTax);
            setSubTotal(tempNet);
            setGrandTotal(tempTotal);
        }
    }
    useEffect(()=>{
        if (isOpen) configureCashDrawer();
    },[isOpen]);
    return(
        <div hidden={!isOpen} className="relative gray2" style={{height:"80vh"}}>
            <div className="float-top-center half-width max-width-on-mobile" style={{whiteSpace:"nowrap",height:"100%"}}>
                <div className="popup-header">Cash Drawers for today {tools.nowDate()}</div>
                <div className="pad-xl gray2" style={{border:"1px solid lightgray",margin:"10px",overflow:"hidden"}}>
                    <div>TOTAL TRANSACTIONS</div>
                    <div><b>{transactionCount}</b></div>
                </div>
                <div className="pad-xl gray2" style={{border:"1px solid lightgray",margin:"10px",overflow:"hidden"}}>
                    <div>TOTAL TAX</div>
                    <div><b>${tax?.toFixed(2)}</b></div>
                </div>
                <div className="pad-xl gray2" style={{border:"1px solid lightgray",margin:"10px",overflow:"hidden"}}>
                    <div>TOTAL WITHOUT TAX</div>
                    <div><b>${subTotal?.toFixed(2)}</b></div>
                </div>
                <div className="pad-xl gray2" style={{border:"1px solid lightgray",margin:"10px",overflow:"hidden"}}>
                    <div>CASH IN DRAWER</div>
                    <div><b>${grandTotal?.toFixed(2)}</b></div>
                </div>
            </div>
        </div>
    )
}
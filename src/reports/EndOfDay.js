import { IonIcon, useIonViewWillEnter } from '@ionic/react';
import { calendarOutline, printOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Select } from '../widgets/Select';
import { useStore } from '../context/Store';
import { getEndOfDayReporByTimeStamp, getPayout } from '../database/database';
import { printer } from '../document/Printer';
import { tools } from '../tools/Tools';
import { Loader } from '../components/Loader';


const unavailable = "Locked";
export const EndOfDay = ({isOpen, onRunEndOfDay, dateSelected}) =>{
    const { user } = useStore();
    
    const [showLoader, setShowLoader] = useState(false);
    const [lastEndOfDay, setLastEndOfDay] = useState("");
    const [transactionCount, setTransactionCount] = useState("");
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [discounts, setDiscount] = useState(0);
    const [cashPayout, setCashPayout] = useState(0);
    const [settledOrderCount, setSettledOrderCount] = useState(0);

    const resetEndOfDayValues = () =>{
        setTransactionCount("");
        setSubTotal(0);
        setTax(0);
        setCashPayout(0);
        setGrandTotal(0);
    }

    const searchEndOfDay = async(timeStamp) =>{
        setShowLoader(true);
        const payoutReport = await getPayout(timeStamp, user?.storeId);
        const salesReport = await getEndOfDayReporByTimeStamp(timeStamp, user?.storeId);
        configureEndOfDay(salesReport, payoutReport);
    }

    const configureEndOfDay = (salesItems, payoutItems) =>{
        if (salesItems?.length){
            setTransactionCount(salesItems?.length);
            setSettledOrderCount(salesItems?.length - payoutItems?.length);
            let tempTax = 0;
            let tempNet = 0;
            let tempTotal = 0;
            let tempDiscount = 0;

            for (let item of salesItems){
                tempTax = tempTax + item?.info?.tax;
                tempNet = tempNet + item?.info?.net;
                tempTotal = tempTotal + item?.info?.total;
                tempDiscount = tempDiscount + item?.info?.discountTotal;
            }

            let payout = 0;
            for (let refund of payoutItems){
                payout += refund?.info?.total;
            }
            setTax(tempTax);
            setSubTotal(tempNet);
            setCashPayout(payout);
            setDiscount(tempDiscount);
            setGrandTotal((tempTotal - payout) - tempDiscount);
        }else resetEndOfDayValues();
        setShowLoader(false);
    }

    useEffect(()=>{
        let dateformat = tools.formatDate(dateSelected) || tools.nowDate();
        setLastEndOfDay(dateformat);
        searchEndOfDay(dateformat);
    },[dateSelected]);

    useIonViewWillEnter(()=>{
        let dateformat = tools.formatDate(dateSelected) || tools.nowDate();
        setLastEndOfDay(dateformat);
        searchEndOfDay(dateformat);
    });
    return(
        <div id="end-of-day" hidden={!isOpen}>
            <Loader isOpen={showLoader} />
            <div className="dark" style={{borderRadius:"25px"}}>
                <Select options={["CURRENT DAY - POS STATIONS"]} />
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">LAST END OF DAY SELECT</div>
                <div className="max-width pad">{lastEndOfDay}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">OPEN ORDERS COUNT</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">OPEN ORDERS TOTAL</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">OPEN PREAUTH COUNT</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">SETTLED ORDERS COUNT</div>
                <div className="max-width pad">{settledOrderCount}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">TRANSACTIONS COUNT</div>
                <div className="max-width pad">{transactionCount || 0}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">VOIDS COUNT</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">VOIDS TOTAL</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">SUBTOTAL</div>
                <div className="max-width pad">${subTotal?.toFixed?.(2) || 0}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">TAX</div>
                <div className="max-width pad">${tax?.toFixed?.(2) || 0}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">DISCOUNTS</div>
                <div className="max-width pad">$-{discounts?.toFixed?.(2) || 0}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">CASH PAID OUT</div>
                <div className="max-width pad">$-{cashPayout?.toFixed?.(2) || 0}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">DELIVERY CHARGES</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">GRATUITIES</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">SURCHARGES</div>
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">GRAND TOTAL</div>
                <div className="max-width pad">${grandTotal?.toFixed?.(2) || 0}</div>
            </div>
            <div className="flex pad dark">
                <div className="pad">
                    <IonIcon onClick={onRunEndOfDay} style={{fontSize:"30px"}} icon={calendarOutline}/>
                </div>
                <div className="half-width max-width-on-mobile pad relative">
                    <span onClick={onRunEndOfDay} className="float-left">RUN END OF DAY</span>
                    <IonIcon onClick={()=>printer.print("end-of-day","end-of-day-frame")} className="float-right" style={{fontSize:"30px",marginLeft:"40px"}} icon={printOutline} />
                </div>
            </div>
            <iframe id="end-of-day-frame" className="print-preview-iframe"/>
        </div>
    )
}
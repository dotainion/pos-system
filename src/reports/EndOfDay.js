import { IonIcon } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Select } from '../components/Select';
import { getEndOfDayReporByTimeStamp } from '../database/database';
import { printer } from '../document/Printer';
import { tools } from '../tools/Tools';


const unavailable = "Locked";
export const EndOfDay = ({isOpen, onRunEndOfDay, dateSelected}) =>{
    const [lastEndOfDay, setLastEndOfDay] = useState("");
    const [transactionCount, setTransactionCount] = useState("");
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const resetEndOfDayValues = () =>{
        //setLastEndOfDay("");
        setTransactionCount("");
        setSubTotal(0);
        setTax(0);
        setGrandTotal(0);
    }
    const sarchEndOfDay = async(timeStamp) =>{
        configureEndOfDay(await getEndOfDayReporByTimeStamp(timeStamp));
    }

    const configureEndOfDay = (salesItems) =>{
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
        }else resetEndOfDayValues();
    }

    useEffect(()=>{
        const dateformat = tools.formatDate(dateSelected);
        if(dateformat === "Invalid Date") setLastEndOfDay("");
        else setLastEndOfDay(dateformat);
        sarchEndOfDay(dateformat);
    },[dateSelected]);
    return(
        <div id="end-of-day" hidden={!isOpen}>
            <div className="dark" style={{borderRadius:"25px"}}>
                <Select options={["CURRENT DAY - POS STATIONS"]} />
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">LAST END OF DAY SELECT</div>
                <div className="max-width pad">{lastEndOfDay || "None selected"}</div>
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
                <div className="max-width pad">{unavailable}</div>
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
                <div className="max-width pad">{unavailable}</div>
            </div>
            <div className="flex border-bottom">
                <div className="max-width pad">CASH PAID OUT</div>
                <div className="max-width pad">{unavailable}</div>
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
                <div className="max-width pad relative">
                    <span onClick={onRunEndOfDay} className="float-left">RUN END OF DAY</span>
                </div>
                <div className="max-width pad relative">
                    <span onClick={()=>printer.print("end-of-day","end-of-day-frame")} className="float-left" style={{color:"dodgerblue"}}>Print</span>
                </div>
            </div>
            <iframe id="end-of-day-frame" className="print-preview-iframe"/>
        </div>
    )
}
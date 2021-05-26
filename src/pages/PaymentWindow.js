import { IonItemDivider } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { PopupContainer } from '../components/PopupContainer';
import { useStore } from '../context/Store';
import { ReceiptPreview } from '../document/Preview';
import { printer } from '../document/Printer';
import { Progressing } from '../widgets/Progressing';



export const PaymentWindow = ({isOpen, onClose, onConfirmPayment, paymentSubmited, tenderedRef, loading, total, tax, net}) =>{
    const { cart } = useStore();

    const [changed, setChanged] = useState("");
    const [tendered, setTendered] = useState("");
    const [error, setError] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [record, setRecord] = useState([]);

    const onTriggerPayment = () =>{
        setError("");
        const msg = "Incorrect tendered amount";
        if (showPreview) return setError("Payment already submited");
        if (!tendered) return setError(msg);
        if (/[a-zA-Z]/g.test(tendered)) return setError(msg);
        if (tenderedRef?.current?.value === "") return setError(msg);
        if (parseFloat(tendered) < parseFloat(total)) return setError(msg);
        if (typeof onConfirmPayment === "function"){
            setRecord({
                tax:JSON.parse(JSON.stringify(tax)),
                net:JSON.parse(JSON.stringify(net)),
                total:JSON.parse(JSON.stringify(total)),
                order:JSON.parse(JSON.stringify(cart))
            });
            onConfirmPayment();
        }
    }

    const onTriggerClose = () =>{
        onClose?.();
        setShowPreview(false);
    }

    //update change when tendered an total changes
    useEffect(()=>{
        setChanged(parseFloat(tendered) - parseFloat(total));
    },[tendered]);

    //do something when paymentSubmited
    useEffect(()=>{
        if (paymentSubmited){
            setShowPreview(true);
            tenderedRef.current.value = "";
        }
    },[paymentSubmited]);
    return(
        <>
        <PopupContainer isOpen={isOpen} onClose={onTriggerClose} noBackdropDismist>
            <div className="max-size shadow2">
                <p className="pad-xl font-xl half-width item-center" style={{textAlign:"center",borderBottom:"1px solid lightgray"}}>
                    Payment<br/>
                    <label className="float-bottom-overflow max-width error" style={{left:"0px"}}>{error}</label>
                </p>
                <div className="float-center half-width bg pad" style={{minWidth:"350px"}}>
                    <IonItemDivider class="gray2" style={{marginTop:"20px",marginBottom:"20px"}}>
                        <div className="flex font-mini">
                            <div className="pad-mini">{cart?.length} Items</div>
                        </div>
                    </IonItemDivider>
                    <Progressing isOpen={loading} color="medium" />
                    <div className="flex font-mini">
                        <div className="max-width pad-mini">NET</div>
                        <div className="max-width pad-mini">{net?.toFixed(2) || 0.0}</div>
                    </div>
                    <div className="flex font-mini">
                        <div className="max-width pad-mini">TEX</div>
                        <div className="max-width pad-mini">{tax?.toFixed(2) || 0.0}</div>
                    </div>
                    <div className="flex">
                        <div className="max-width pad-mini"><b>TOTAL</b></div>
                        <div className="max-width pad-mini"><b>${total?.toFixed(2) || 0.0}</b></div>
                    </div>
                    <Entry cssClass="bg2" dollarSign label="Tendered" onChange={(e)=>setTendered(e.target.value)} entryRef={tenderedRef} placeholder="Tendered Amount" type="number" />
                    <div className="pad-xl" style={{height:"70px"}}>
                        <div style={{float:"left"}}>Change ${changed && changed?.toFixed(2) || 0.0}</div>
                        <div><button onClick={onTriggerPayment} disabled={loading} className="btn" style={{float:"right"}}>PAY {total?.toFixed(2)}</button></div>
                    </div>
                </div>
            </div>
        </PopupContainer>
        <ReceiptPreview
            isOpen={showPreview}
            onClose={()=>{
                onClose?.();
                setShowPreview(false);
            }}
            record={record}
        />
        </>
    )
}
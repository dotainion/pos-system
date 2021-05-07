import { IonItemDivider, IonProgressBar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { PopupContainer } from '../components/PopupContainer';
import { useStore } from '../context/Store';



export const PaymentWindow = ({isOpen, onClose, onConfirmPayment, paymentSubmited, loading, total, tax, net}) =>{
    const { cart } = useStore();
    const [changed, setChanged] = useState("");
    const [tendered, setTendered] = useState("");
    const [error, setError] = useState("");

    const tenderedRef = useRef();

    const onTriggerPayment = () =>{
        setError("");
        const msg = "Incorrect tendered amount";
        if (!tendered) return setError(msg);
        if (/[a-zA-Z]/g.test(tendered)) return setError(msg);
        if (parseFloat(tendered) < parseFloat(total)) return setError(msg);
        if (typeof onConfirmPayment === "function") onConfirmPayment();
    }

    //update change when tendered an total changes
    useEffect(()=>{
        setChanged(parseFloat(tendered) - parseFloat(total));
    },[tendered]);

    //do something when paymentSubmited
    useEffect(()=>{
        if (paymentSubmited){
            tenderedRef.current.value = "";
        }
    },[paymentSubmited]);
    return(
        <PopupContainer isOpen={isOpen} onClose={onClose}>
            <div className="dark max-size">
                <p className="pad-xl font-xl half-width item-center" style={{textAlign:"center",borderBottom:"1px solid white"}}>
                    Payment<br/>
                    <label className="float-bottom-overflow max-width font" style={{color:"red",left:"0px"}}>{error}</label>
                </p>
                <div className="float-center half-width dark">
                    <IonItemDivider style={{marginTop:"20px",marginBottom:"20px",color:"white"}}>
                        <div className="flex font-mini">
                            <div className="pad-mini">{cart?.length} Items</div>
                        </div>
                    </IonItemDivider>
                    <IonProgressBar style={{visibility:!loading && "hidden"}} color="light" type="indeterminate" value={0.5}/>
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
                    <Entry cssClass="dark" label="Tendered" onChange={(e)=>setTendered(e.target.value)} entryRef={tenderedRef} placeholder="Tendered Amount" type="number" />
                    <div className="pad-xl" style={{height:"70px"}}>
                        <div style={{float:"left"}}>Change ${changed && changed?.toFixed(2) || 0.0}</div>
                        <div><button onClick={onTriggerPayment} disabled={loading} className="dark pad radius pad-h-xl click" style={{float:"right"}}>PAY {total?.toFixed(2)}</button></div>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}
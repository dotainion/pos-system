import React, { useRef, useState } from 'react';
import { Entry } from '../components/Entry';
import { tools } from '../tools/Tools';
import img from '../images/beach.jpg';
import { ModalContainer } from '../container/ModalContainer';
import { addCustomer } from '../database/database';
import { useStore } from '../context/Store';


export const AddCustomer = ({isOpen, onClose}) =>{
    const { user, initCustomers } = useStore();

    const [image, setImage] = useState("");
    const [error, setError] = useState("");

    const imageRef = useRef();
    const customerNameRef = useRef();
    const customerEmailRef = useRef();
    const customerNumberRef = useRef();
    const customerIdRef = useRef();

    const onClearValues = () =>{
        customerNameRef.current.value = "";
        customerEmailRef.current.value = "";
        customerNumberRef.current.value = "";
        customerIdRef.current.value = "";
    }

    const onSaveCustomer = async() =>{
        setError("");
        if (!customerNameRef.current.value) return setError("Name is required");
        await addCustomer({
            name: customerNameRef.current.value || "",
            email: customerEmailRef.current.value || "",
            number: customerNumberRef.current.value || "",
            id: customerIdRef.current.value || "",
            storeId: user?.storeId || "",
        });
        onClearValues();
        initCustomers();
    }
    return(
        <ModalContainer isOpen={isOpen} onClose={onClose}>
            <p className="pad-xl font-xl" style={{position:"relative",textAlign:"center"}}>
                Add valued customer<br/>
                <label className="float-bottom-overflow max-width font" style={{color:"red",left:"0px",textAlign:"center"}}>{error}</label>
            </p>
            <div className="flex pad-xxl">
                <div className="half-width pad-xl" style={{position:"relative"}}>
                    <img onClick={()=>imageRef.current?.click()} src={image || img} className="float-center img-hover" style={{width:"80%",height:"150px",top:"40%"}} alt=""/>
                </div>
                <div className="max-width">
                    <Entry entryRef={customerNameRef} type="text" cssClass="bg2" label="Name" placeholder="Name" />
                    <Entry entryRef={customerEmailRef} type="email" cssClass="bg2" label="Email" placeholder="example@gmail.com" />
                    <Entry entryRef={customerNumberRef} type="number" cssClass="bg2" label="Phone Number" placeholder="1474999999" />
                    <Entry entryRef={customerIdRef} type="text" cssClass="bg2" label="Id Number" placeholder="Id#" />
                    <button onClick={onSaveCustomer} className="btn" style={{float:"right",margin:"20px"}}>Save</button>
                </div>
            </div>
            <input hidden ref={imageRef} onChange={async e=>setImage(await tools.toBase64(e.target.files[0] || "") || "")} type="file"/>
        </ModalContainer>
    )
}
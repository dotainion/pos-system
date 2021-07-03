import React, { useRef, useState } from 'react';
import { Entry } from '../widgets/Entry';
import { tools } from '../tools/Tools';
import img from '../images/beach.jpg';
import { ModalContainer } from '../container/ModalContainer';
import { addCustomer } from '../database/database';
import { useStore } from '../context/Store';
import { Button } from '../widgets/Button';


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
                    <Entry entryRef={customerNameRef} type="text" label="Name" placeholder="Name" />
                    <Entry entryRef={customerEmailRef} type="email" label="Email" placeholder="example@gmail.com" />
                    <Entry entryRef={customerNumberRef} type="number" label="Phone Number" placeholder="1474999999" />
                    <Entry entryRef={customerIdRef} type="text" label="Id Number" placeholder="Id#" />
                    <div className="pad-xl" style={{float:"right"}}>
                        <Button 
                            onClick={onSaveCustomer}
                            text="Save"
                        />
                    </div>
                </div>
            </div>
            <input hidden ref={imageRef} onChange={async e=>setImage(await tools.toBase64(e.target.files[0] || "") || "")} type="file"/>
        </ModalContainer>
    )
}
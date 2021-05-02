import { IonIcon, IonList, IonProgressBar } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { roles } from '../content/lists';
import { useStore } from '../context/Store';
import { addUser } from '../database/database';
import { Entry } from './Entry';
import { PopupContainer } from './PopupContainer';
import { Select } from './Select';


export const CreateEmployee = ({isOpen, record, onClose}) =>{
    const { createUser } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [inputStyle, setInputStyle] = useState("");
    const [showEmplyeeInput, setShowEmployeeInput] = useState({
        first: true,
        second: false,
        third: false
    });

    const credsEmailRef = useRef();
    const credsPasswordRef = useRef();
    const credsConfirmRef = useRef();

    const roleRef = useRef();

    const nameRef = useRef();
    const emailRef = useRef();
    const phoneLine1Ref = useRef();
    const phoneLine2Ref = useRef();
    const countryRef = useRef();
    const cityRef = useRef();
    const addressRef = useRef();

    const nextOfKinNameRef = useRef();
    const nextOfKinEmailRef = useRef();
    const nextOfKinPhoneLine1Ref = useRef();
    const nextOfKinPhoneLine2Ref = useRef();
    const nextOfKinCountryRef = useRef();
    const nextOfKinCityRef = useRef();
    const nextOfKinAddressRef = useRef();

    const onAddEmployee = async() =>{
        const response = await createUser(
            credsEmailRef.current.value,
            credsPasswordRef.current.value,
        );
        setLoading(true);
        setError("")
        if (response?.error){
            setError(response?.error);
        }else {
            const employee = {
                name: nameRef.current.value || "",
                email: emailRef.current.value || "",
                phone1: phoneLine1Ref.current.value || "",
                phone2: phoneLine2Ref.current.value || "",
                country: countryRef.current.value || "",
                city: cityRef.current.value || "",
                address: addressRef.current.value || "",

                role: roleRef.current.value || "",
                
                kinName: nextOfKinNameRef.current.value || "",
                kinEmail: nextOfKinEmailRef.current.value || "",
                kinPhone1: nextOfKinPhoneLine1Ref.current.value || "",
                kinPhone2: nextOfKinPhoneLine2Ref.current.value || "",
                kinCountry: nextOfKinCountryRef.current.value || "",
                kinCity: nextOfKinCityRef.current.value || "",
                kinAddress: nextOfKinAddressRef.current.value || "",
            }
            await addUser(employee, response?.user?.uid);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if (Object.keys(record || {})?.length > 0){
            setInputStyle("");
            nameRef.current.value = record?.info?.name || "";
            emailRef.current.value = record?.info?.email || "";
            phoneLine1Ref.current.value = record?.info?.phone1 || "";
            phoneLine2Ref.current.value = record?.info?.phone2 || "";
            countryRef.current.value = record?.info?.country || "";
            cityRef.current.value = record?.info?.city || "";
            addressRef.current.value = record?.info?.address || "";

            roleRef.current.value = record?.info?.role || "";
        
            nextOfKinNameRef.current.value = record?.info?.kinName || "";
            nextOfKinEmailRef.current.value = record?.info?.kinEmail || "";
            nextOfKinPhoneLine1Ref.current.value = record?.info?.kinPhone1 || "";
            nextOfKinPhoneLine2Ref.current.value = record?.info?.kinPhone2 || "";
            nextOfKinCountryRef.current.value = record?.info?.kinCountry || "";
            nextOfKinCityRef.current.value = record?.info?.kinCity || "";
            nextOfKinAddressRef.current.value = record?.info?.kinAddress || "";
        }else setInputStyle("input-style");
    },[record]);
    return(
        <PopupContainer isOpen={isOpen} onClose={onClose}>
            <div className="popup-header  popup-bg">
                <IonIcon onClick={onClose} class="close" icon={closeOutline}/>
                <div className="pad">
                    {
                        showEmplyeeInput.first && "Add employee information" ||
                        showEmplyeeInput.second && "Add Next of Kin informatino" ||
                        showEmplyeeInput.third && "Add employee credentials and role"
                    }
                </div>
            </div>
            <IonProgressBar hidden={!loading} color="light" type="indeterminate" value={0.5}/>
            <div className="pad">
                <div hidden={!showEmplyeeInput.first}>
                    <div className="flex d-flex-on-mobile">
                        <div className="max-width">
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nameRef} placeholder="Full name" label="Full Name" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={emailRef} placeholder="example@gmail.com" label="Email" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={phoneLine1Ref} placeholder="Phone number" label="Phone Line 1" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={phoneLine2Ref} placeholder="Phone number" label="Phone Line 2" />
                        </div>
                        <div className="max-width">
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={countryRef} placeholder="Country" label="Country" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={cityRef} placeholder="city" label="City" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={addressRef} placeholder="Address" label="Address" />
                        </div>
                    </div>
                    <div style={{float:"right"}}>
                        <button onClick={()=>setShowEmployeeInput({first:false,second:true,third:false})} style={{fontSize:"15px"}} className="add-btn">Next</button>
                    </div>
                </div>
                <div hidden={!showEmplyeeInput.second} className="max-width">
                    <div className="flex d-flex-on-mobile">
                        <div className="max-width">
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinNameRef} placeholder="Full name" label="Next of kin Full Name" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinEmailRef} placeholder="example@gmail.com" label="Next of kin Email" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinPhoneLine1Ref} placeholder="Phone number" label="Next of kin Phone Line 1" />
                        </div>
                        <div className="max-width">
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinPhoneLine2Ref} placeholder="Phone number" label="Next of kin Phone Line 2" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinCountryRef} placeholder="Country" label="Next of kin Country" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinCityRef} placeholder="city" label="Next of kin City" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={nextOfKinAddressRef} placeholder="Address" label="Next of kin Address" />
                        </div>
                    </div>
                    <div style={{float:"right"}}>
                        <button onClick={()=>setShowEmployeeInput({first:true,second:false,third:false})} style={{fontSize:"15px"}} className="add-btn">Back</button>
                        <button onClick={()=>setShowEmployeeInput({first:false,second:false,third:true})} style={{fontSize:"15px"}} className="add-btn">Next</button>
                    </div>
                </div>
                <div hidden={!showEmplyeeInput.third}>
                    <div className="flex d-flex-on-mobile">
                        <div className="max-width">
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={credsEmailRef} placeholder="example@gmail.com" label="Email" type="email" />
                            <Select edit={!inputStyle} cssClass={inputStyle} selectRef={roleRef} label="Role" options={roles}/>
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={credsPasswordRef} placeholder="*********" label="Password" type="password" />
                            <Entry edit={!inputStyle} cssClass={inputStyle} entryRef={credsConfirmRef} placeholder="*********" label="Confirm Password" type="password" />                
                        </div>
                        <div className="max-width no-select pad">
                            <p>
                                Email can be the user existing email or one of your choice.<br/>
                                Email can be <span className="link">automatically generated</span>
                            </p>
                            <p style={{color:"red"}}>{error}</p>
                        </div>
                    </div>
                    <div style={{float:"right"}}>
                        <button onClick={()=>setShowEmployeeInput({first:false,second:true,third:false})} style={{fontSize:"15px"}} className="add-btn">Back</button>
                        <button disabled={loading} onClick={onAddEmployee} style={{fontSize:"15px"}} className="add-btn">Save</button>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}
import { IonIcon, IonImg, IonList, IonThumbnail } from '@ionic/react';
import { closeOutline, imagesOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { roles } from '../../../content/lists';
import { useStore } from '../../../context/Store';
import { addEmployee, addUser } from '../../../database/database';
import { Entry } from '../../../widgets/Entry';
import { ModalContainer } from '../../../container/ModalContainer';
import { Select } from '../../../widgets/Select';
import img from '../../../images/beach.jpg';
import { tools } from '../../../tools/Tools';
import { Progressing } from '../../../widgets/Progressing';
import { Button } from '../../../widgets/Button';



export const CreateEmployee = ({isOpen, record, onUpdateComplete, onClose}) =>{
    const { user } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [image, setImage] = useState("");
    const [showEmplyeeInput, setShowEmployeeInput] = useState({
        first: true,
        second: false,
        third: false
    });

    const credsPasswordRef = useRef();
    const credsConfirmRef = useRef();

    const imageRef = useRef();

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
        setError("");
        setLoading(true);
        if (!user?.storeId) return  alert("error with current user")
        if (Object.keys(user || {}).length <= 0) return alert("no user");
        const employee = {
            name: nameRef.current.value || "",
            email: emailRef.current.value || "",
            phone1: phoneLine1Ref.current.value || "",
            phone2: phoneLine2Ref.current.value || "",
            country: countryRef.current.value || "",
            city: cityRef.current.value || "",
            address: addressRef.current.value || "",
            
            kinName: nextOfKinNameRef.current.value || "",
            kinEmail: nextOfKinEmailRef.current.value || "",
            kinPhone1: nextOfKinPhoneLine1Ref.current.value || "",
            kinPhone2: nextOfKinPhoneLine2Ref.current.value || "",
            kinCountry: nextOfKinCountryRef.current.value || "",
            kinCity: nextOfKinCityRef.current.value || "",
            kinAddress: nextOfKinAddressRef.current.value || "",

            role: roleRef.current.value || "",
            image: image || "",
            storeId: user?.storeId || "",
        }
        await addEmployee(employee);
        setLoading(false);
        onUpdateComplete?.();
    }

    useEffect(()=>{
        if (Object.keys(record || {})?.length > 0){
            nameRef.current.value = record?.info?.name || "";
            emailRef.current.value = record?.info?.email || "";
            phoneLine1Ref.current.value = record?.info?.phone1 || "";
            phoneLine2Ref.current.value = record?.info?.phone2 || "";
            countryRef.current.value = record?.info?.country || "";
            cityRef.current.value = record?.info?.city || "";
            addressRef.current.value = record?.info?.address || "";

            roleRef.current.value = record?.info?.role || "";
            setImage(record?.info?.image || "");
        
            nextOfKinNameRef.current.value = record?.info?.kinName || "";
            nextOfKinEmailRef.current.value = record?.info?.kinEmail || "";
            nextOfKinPhoneLine1Ref.current.value = record?.info?.kinPhone1 || "";
            nextOfKinPhoneLine2Ref.current.value = record?.info?.kinPhone2 || "";
            nextOfKinCountryRef.current.value = record?.info?.kinCountry || "";
            nextOfKinCityRef.current.value = record?.info?.kinCity || "";
            nextOfKinAddressRef.current.value = record?.info?.kinAddress || "";
        }
    },[record]);
    return(
        <ModalContainer isOpen={isOpen} onClose={onClose}>
            <div className="popup-header centered">
                <IonIcon onClick={onClose} class="close" icon={closeOutline}/>
                <div className="pad" style={{borderBottom:"1px solid black"}}>
                    {
                        showEmplyeeInput.first && `${Object.keys(record || {})?.length? "Update": "Add"} employee information` ||
                        showEmplyeeInput.second && `${Object.keys(record || {})?.length? "Update": "Add"} Next of Kin informatino` ||
                        showEmplyeeInput.third && `${Object.keys(record || {})?.length? "Update": "Add"} employee credentials and role`
                    }
                </div>
            </div>
            <Progressing isOpen={loading} color="medium"/>
            <div className="pad" style={{marginTop:"20px"}}>
                <div hidden={!showEmplyeeInput.first}>
                    <div className="flex d-flex-on-mobile">
                        <div className="max-width">
                            <Entry entryRef={nameRef} placeholder="Full name" label="Full Name" />
                            <Entry entryRef={phoneLine1Ref} placeholder="Phone number" label="Phone Line 1" />
                            <Entry entryRef={phoneLine2Ref} placeholder="Phone number" label="Phone Line 2" />
                        </div>
                        <div className="max-width">
                            <Entry entryRef={countryRef} placeholder="Country" label="Country" />
                            <Entry entryRef={cityRef} placeholder="city" label="City" />
                            <Entry entryRef={addressRef} placeholder="Address" label="Address" />
                            <IonThumbnail onClick={()=>imageRef.current?.click()} class="item-center relative" style={{width:"100px",height:"100px",borderRadius:"50%",marginTop:"40px"}}>
                                <IonImg src={image || img} class="max-size" style={{borderRadius:"50%"}} />
                                <IonIcon icon={imagesOutline} class="float-top-left" style={{boxShadow:"2px 2px 5px black",margin:"5px"}} />
                            </IonThumbnail>
                            <input hidden type="file" ref={imageRef} onChange={async e=>setImage(await tools.toBase64(e.target.files[0]))} />
                        </div>
                    </div>
                    <div className="pad-xxl" style={{float:"right"}}>
                        <Button onClick={()=>setShowEmployeeInput({first:false,second:true,third:false})} text="Next" />
                    </div>
                </div>
                <div hidden={!showEmplyeeInput.second} className="max-width">
                    <div className="flex d-flex-on-mobile">
                        <div className="max-width">
                            <Entry entryRef={nextOfKinNameRef} placeholder="Full name" label="Next of kin Full Name" />
                            <Entry entryRef={nextOfKinEmailRef} placeholder="example@gmail.com" label="Next of kin Email" />
                            <Entry entryRef={nextOfKinPhoneLine1Ref} placeholder="Phone number" label="Next of kin Phone Line 1" />
                        </div>
                        <div className="max-width">
                            <Entry entryRef={nextOfKinPhoneLine2Ref} placeholder="Phone number" label="Next of kin Phone Line 2" />
                            <Entry entryRef={nextOfKinCountryRef} placeholder="Country" label="Next of kin Country" />
                            <Entry entryRef={nextOfKinCityRef} placeholder="city" label="Next of kin City" />
                            <Entry entryRef={nextOfKinAddressRef} placeholder="Address" label="Next of kin Address" />
                        </div>
                    </div>
                    <div className="pad-xxl" style={{float:"right"}}>
                        <Button onClick={()=>setShowEmployeeInput({first:true,second:false,third:false})} text="Back" />
                        <Button onClick={()=>setShowEmployeeInput({first:false,second:false,third:true})} text="Next" spacing />
                    </div>
                </div>
                <div hidden={!showEmplyeeInput.third}>
                    <div className="flex d-flex-on-mobile">
                        <div className="max-width">
                            <Entry entryRef={emailRef} placeholder="example@gmail.com" label="Email" type="email" />
                            <Select selectRef={roleRef} label="Role" options={roles}/>
                            <Entry entryRef={credsPasswordRef} placeholder="*********" label="Password" type="password" />
                            <Entry entryRef={credsConfirmRef} placeholder="*********" label="Confirm Password" type="password" />                
                        </div>
                        <div className="max-width no-select pad">
                            <p>
                                Email can be the user existing email or one of your choice.<br/>
                                Email can be <span className="link">automatically generated</span>
                            </p>
                            <p style={{color:"red"}}>{error}</p>
                        </div>
                    </div>
                    <div className="pad-xxl" style={{float:"right"}}>
                        <Button onClick={()=>setShowEmployeeInput({first:false,second:true,third:false})} text="Back" />
                        <Button disabled={loading} onClick={onAddEmployee} text={Object.keys(record || {})?.length? "Update": "Save"} spacing />
                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}
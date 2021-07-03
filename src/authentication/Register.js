import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import { addOutline, arrowBack, arrowBackOutline, arrowForwardOutline, cardOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Entry } from '../widgets/Entry';
import { useStore } from '../context/Store';
import { addUser } from '../database/database';
import { routes } from '../global/Routes';
import posImage from '../images/pos.jpg';
import { tools } from '../tools/Tools';
import { RiVisaLine } from 'react-icons/ri';
import { FaCcMastercard, FaCcDiscover } from 'react-icons/fa';


export const Register = () =>{
    const history = useHistory();
    const { createUser, adminAccess, setAdminAccess } = useStore();
    const [pages, setPages] = useState({first:true,second:false,third:false});

    const [firstNameError, setFirstNameError] = useState();
    const [lastNameError, setLastNameError] = useState();
    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [confirmPasswordError, setConfirmPasswordError] = useState();
    const [businessNameError, setBusinessNameError] = useState();
    const [websiteError, setWebsiteError] = useState();
    const [countryError, setCountryError] = useState();
    const [cityError, setCityError] = useState();
    const [addressError, setAddressError] = useState();
    const [phoneNumberError, setPhoneNumberError] = useState();

    const [cardHolderNameError, setCardHolderNameError] = useState();
    const [cardNumberError, setCardNumberError] = useState();
    const [cardExpireError, setCardExpireError] = useState();
    const [cardCvcError, setCardCvcError] = useState();

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const businessNameRef = useRef();
    const websiteRef = useRef();
    const countryRef = useRef();
    const cityRef = useRef();
    const addressRef = useRef();
    const phoneNumberRef = useRef();

    const cardHolderNameRef = useRef();
    const cardNumberRef = useRef();
    const cardExpireRef = useRef();
    const cardCvcRef = useRef();

    const reset = (cmd) =>{
        if(cmd === "f"){
            setFirstNameError("");
            firstNameRef.current.style.border = "";
        }if(cmd === "l"){
            setLastNameError("");
            lastNameRef.current.style.border = "";
        }if(cmd === "e"){
            setEmailError("");
            emailRef.current.style.border = "";
        }if(cmd === "p"){
            setPasswordError("");
            passwordRef.current.style.border = "";
        }if(cmd === "c"){
            setConfirmPasswordError("");
            confirmPasswordRef.current.style.border = "";
        }if(cmd === "b"){
            setBusinessNameError("");
            businessNameRef.current.style.border = "";
        }if(cmd === "w"){
            websiteRef.current.style.border = "";
        }if(cmd === "co"){
            setCountryError("");
            countryRef.current.style.border = "";
        }if(cmd === "ci"){
            setCityError("");
            cityRef.current.style.border = "";
        }if(cmd === "a"){
            setAddressError("");
            addressRef.current.style.border = "";
        }if(cmd === "chn"){
            setCardHolderNameError("");
            cardHolderNameRef.current.style.border = "";
        }if(cmd === "cn"){
            setCardNumberError("");
            cardNumberRef.current.style.border = "";
        }if(cmd === "ce"){
            setCardExpireError("");
            cardExpireRef.current.style.border = "";
        }if(cmd === "cc"){
            setCardCvcError("");
            cardCvcRef.current.style.border = "";
        }if(cmd === "ph"){
            setPhoneNumberError("");
            phoneNumberRef.current.style.border = "";
        }
    }

    const onNext = (cmd) =>{
        let ERROR = false;
        if (cmd === "first"){
            if (!firstNameRef.current.value){
                ERROR = true;
                setFirstNameError("First name is required");
            }if (!lastNameRef.current.value){
                ERROR = true;
                setLastNameError("Last name is required");
            }if (!tools.isEmailValid(emailRef.current.value)){
                ERROR = true;
                setEmailError("Email is required");
            }if (!businessNameRef.current.value){
                ERROR = true;
                setBusinessNameError("Business Name is required");
            }
            if (ERROR) return;
            setPages({first:false,second:true,third:false});
        }else if (cmd === "second"){
            if (!countryRef.current.value){
                ERROR = true;
                setCountryError("Country is required");
            }if (!cityRef.current.value){
                ERROR = true;
                setCityError("City is required");
            }if (!addressRef.current.value){
                ERROR = true;
                setAddressError("Address is required");
            }if (!passwordRef.current.value){
                ERROR = true;
                setPasswordError("Password is required");
            }if (!confirmPasswordRef.current.value){
                ERROR = true;
                setConfirmPasswordError("Password mistmatch");
            }if (passwordRef.current.value !== confirmPasswordRef.current.value){
                ERROR = true;
                setConfirmPasswordError("Password mistmatch");
            }
            if (ERROR) return;
            setPages({first:false,second:false,third:true});
        }else if (cmd === "create"){
            if (!cardHolderNameRef.current.value){
                ERROR = true;
                setCardHolderNameError("Card holder name is required");
            }if (!phoneNumberRef.current.value){
                ERROR = true;
                setPhoneNumberError("Contact number is required");
            }if (!cardNumberRef.current.value){
                ERROR = true;
                setCardNumberError("Card number is required");
            }if (!cardExpireRef.current.value){
                ERROR = true;
                setCardExpireError("Card expire date is required");
            }if (!cardCvcRef.current.value){
                ERROR = true;
                setCardCvcError("Card cvc is required");
            }
            if (ERROR) return;
            //onSubmit();
            alert("Unsuccessful payment");
        }
    }

    const onSubmit = async() =>{
        const response = await createUser(emailRef.current.value, passwordRef.current.value);
        if (response?.error) return alert(response?.error);
        const userAdmin = {
            name: `${firstNameRef.current.value || ""} ${lastNameRef.current.value || ""}`,
            email: emailRef.current.value || "",
            number: phoneNumberRef.current.value || "",
            businessName: businessNameRef.current.value || "",
            website: websiteRef.current.value || "",
            country: countryRef.current.value || "",
            city: cityRef.current.value || "",
            address: addressRef.current.value || "",
            storeId: response?.user?.uid || "",
            zip: "",
            role: "admin"
        }
        const userResponse = await addUser(userAdmin, response?.user?.uid);
        if (userResponse) setAdminAccess(true);
    }

    useEffect(()=>{
        if (adminAccess) history.push(routes.administration);
    },[adminAccess]);

    return(
        <IonPage>
            <IonContent class="silver no-select">
                <div className="flex d-flex-on-mobile border radius pad-xxl register-pad-on-mobile half-width silver2 float-center max-width-on-mobile">
                    <div className="max-width">
                        <div hidden={!pages.first}>
                            <Entry onChange={()=>reset("f")} entryRef={firstNameRef} error={firstNameError} labelColor="rgb(5, 5, 5)" label="First Name" required placeholder="First Name" />
                            <Entry onChange={()=>reset("l")} entryRef={lastNameRef} error={lastNameError} labelColor="rgb(5, 5, 5)" label="Last Name" required placeholder="Last Name" />
                            <Entry onChange={()=>reset("e")} entryRef={emailRef} error={emailError} labelColor="rgb(5, 5, 5)" label="Email" required placeholder="Email" />
                            <Entry onChange={()=>reset("b")} entryRef={businessNameRef} error={businessNameError} labelColor="rgb(5, 5, 5)" label="Business Name" required placeholder="Business Name" />
                            <Entry onChange={()=>reset("w")} entryRef={websiteRef} error={websiteError} labelColor="rgb(5, 5, 5)" label="Website" optional placeholder="Website" />
                            <div className="pad-xxl">
                                <button onClick={()=>onNext("first")} className="pad pad-h radius click silver shadow" style={{float:"right"}}>Next <IonIcon icon={arrowForwardOutline}/></button>
                            </div>
                        </div>
                        <div hidden={!pages.second}>
                            <Entry onChange={()=>reset("p")} entryRef={passwordRef} error={passwordError} type="password" labelColor="rgb(5, 5, 5)" required label="Password" placeholder="Password" />
                            <Entry onChange={()=>reset("c")} entryRef={confirmPasswordRef} error={confirmPasswordError} type="password" labelColor="rgb(5, 5, 5)" required label="Confirm Password" placeholder="Confirmm Password" />
                            <Entry onChange={()=>reset("co")} entryRef={countryRef} error={countryError} labelColor="rgb(5, 5, 5)" label="Country" required placeholder="Country" />
                            <Entry onChange={()=>reset("ci")} entryRef={cityRef} error={cityError} labelColor="rgb(5, 5, 5)" label="City" required placeholder="City" />
                            <Entry onChange={()=>reset("a")} entryRef={addressRef} error={addressError} labelColor="rgb(5, 5, 5)" label="Address" required placeholder="Address" />
                            <div className="pad-xxl">
                                <button onClick={()=>onNext("second")} className="pad pad-h radius click silver shadow" style={{float:"right",marginLeft:"10px"}}>Next <IonIcon icon={addOutline}/></button>
                                <button onClick={()=>setPages({first:true,second:false,third:false})} className="pad pad-h radius click silver shadow" style={{float:"right"}}><IonIcon icon={arrowBackOutline}/> Previous</button>
                            </div>
                        </div>
                        <div hidden={!pages.third}>
                            <div className="centered silver pad">PAYMENT DETAILS</div>
                            <div className="entry-input-container" style={{color:"black"}}>
                                <label>Accept cards</label>
                                <div className="inline" style={{fontSize:"40px"}}>
                                    <span className="pad"><RiVisaLine/></span>
                                    <span className="pad"><FaCcMastercard/></span>
                                    <span className="pad"><FaCcDiscover/></span>
                                </div>
                            </div>
                            <Entry onChange={()=>reset("chn")} entryRef={cardHolderNameRef} error={cardHolderNameError} type="password" labelColor="rgb(5, 5, 5)" required label="Card Holder's Name" placeholder="Full name" />
                            <Entry onChange={()=>reset("ph")} entryRef={phoneNumberRef} error={phoneNumberError} type="number" labelColor="rgb(5, 5, 5)" required label="Phone Number" placeholder="Phone Number" />
                            <Entry onChange={()=>reset("cn")} entryRef={cardNumberRef} error={cardNumberError} type="number" labelColor="rgb(5, 5, 5)" required label="Card Number" placeholder="Card number" />
                            <div className="flex">
                                <Entry onChange={()=>reset("ce")} entryRef={cardExpireRef} error={cardExpireError} labelColor="rgb(5, 5, 5)" type="date" label="Expire Date" required placeholder="Expire date" />
                                <div style={{minWidth:"100px"}}><Entry onChange={()=>reset("cc")} entryRef={cardCvcRef} error={cardCvcError} labelColor="rgb(5, 5, 5)" type="number" label="CVC" required placeholder="Cvc" /></div>
                            </div>
                            <div className="pad-xxl">
                                <button onClick={()=>onNext("create")} className="pad pad-h radius click silver shadow" style={{float:"right",marginLeft:"10px"}}>Create <IonIcon icon={addOutline}/></button>
                                <button onClick={()=>setPages({first:false,second:true,third:false})} className="pad pad-h radius click silver shadow" style={{float:"right"}}><IonIcon icon={arrowBackOutline}/> Previous</button>
                            </div>
                        </div>
                    </div>
                    <div className="half-width hide-on-mobile" style={{position:"relative",overflow:"hidden"}}>
                        <img className="float-center" style={{borderRadius:"50%"}} src={posImage} alt="" />
                    </div>
                    <button onClick={()=>history.push(routes.login)} className="float-bottom-left pad pad-h radius click silver shadow" style={{float:"right",margin:"30px"}}>Login instead</button>
                </div>
            </IonContent>
        </IonPage>
    )
}
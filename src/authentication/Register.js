import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import { addOutline, arrowBack, arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Entry } from '../components/Entry';
import { routes } from '../global/Routes';
import posImage from '../images/pos.jpg';
import { tools } from '../tools/Tools';


export const Register = () =>{
    const history = useHistory();
    const [pages, setPages] = useState({first:true,second:false});

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
        }
    }

    const onNext = () =>{
        let ERROR = false;
        if (!firstNameRef.current.value){
            ERROR = true;
            setFirstNameError("First name is required");
        }if (!lastNameRef.current.value){
            ERROR = true;
            setLastNameError("Last name is required");
        }if (!tools.isEmailValid(emailRef.current.value)){
            ERROR = true;
            setEmailError("Email is required");
        }if (!passwordRef.current.value){
            ERROR = true;
            setPasswordError("Password is required");
        }if (!confirmPasswordRef.current.value){
            ERROR = true;
            setConfirmPasswordError("Password is required");
        }if (passwordRef.current.value !== confirmPasswordRef.current.value){
            ERROR = true;
            setConfirmPasswordError("Password is required");
        }
        if(ERROR) return;

        setPages({first:false,second:true});
    }

    const onSubmit = () =>{
        let ERROR = false;
        const msg = "1px solid red";
        if(!businessNameRef.current.value){
            ERROR = true;
            setBusinessNameError("Business name is required");
        }if(!countryRef.current.value){
            ERROR = true;
            setCountryError("Country is required");
        }if(!cityRef.current.value){
            ERROR = true;
            setCityError("City is required");
        }if(!addressRef.current.value){
            ERROR = true;
            setAddressError("Address is required");
        }
        if(ERROR) return;
        
        
    }

    return(
        <IonPage>
            <IonContent class="silver no-select">
                <div className="flex border radius pad-xxl half-width silver2 float-center">
                    <div className="max-width">
                        <div hidden={!pages.first}>
                            <Entry onChange={()=>reset("f")} entryRef={firstNameRef} error={firstNameError} labelColor="rgb(5, 5, 5)" label="First Name" placeholder="First Name" />
                            <Entry onChange={()=>reset("l")} entryRef={lastNameRef} error={lastNameError} labelColor="rgb(5, 5, 5)" label="Last Name" placeholder="Last Name" />
                            <Entry onChange={()=>reset("e")} entryRef={emailRef} error={emailError} labelColor="rgb(5, 5, 5)" label="Email" placeholder="Email" />
                            <Entry onChange={()=>reset("p")} entryRef={passwordRef} error={passwordError} labelColor="rgb(5, 5, 5)" label="Password" placeholder="Password" />
                            <Entry onChange={()=>reset("c")} entryRef={confirmPasswordRef} error={confirmPasswordError} labelColor="rgb(5, 5, 5)" label="Confirm Password" placeholder="Confirmm Password" />
                            <div className="pad-xxl">
                                <button onClick={onNext} className="pad pad-h radius click dark" style={{float:"right"}}>Next <IonIcon icon={arrowForwardOutline}/></button>
                            </div>
                        </div>
                        <div hidden={!pages.second}>
                            <Entry onChange={()=>reset("b")} entryRef={businessNameRef} error={businessNameError} labelColor="rgb(5, 5, 5)" label="Business Name" placeholder="Business Name" />
                            <Entry onChange={()=>reset("w")} entryRef={websiteRef} error={websiteError} labelColor="rgb(5, 5, 5)" label="Website" placeholder="Website" />
                            <Entry onChange={()=>reset("co")} entryRef={countryRef} error={countryError} labelColor="rgb(5, 5, 5)" label="Country" placeholder="Country" />
                            <Entry onChange={()=>reset("ci")} entryRef={cityRef} error={cityError} labelColor="rgb(5, 5, 5)" label="City" placeholder="City" />
                            <Entry onChange={()=>reset("a")} entryRef={addressRef} error={addressError} labelColor="rgb(5, 5, 5)" label="Address" placeholder="Address" />
                            <div className="pad-xxl">
                                <button onClick={onSubmit} className="pad pad-h radius click dark" style={{float:"right",marginLeft:"10px"}}>Create <IonIcon icon={addOutline}/></button>
                                <button onClick={()=>setPages({first:true,second:false})} className="pad pad-h radius click dark" style={{float:"right"}}><IonIcon icon={arrowBackOutline}/> Previous</button>
                            </div>
                        </div>
                    </div>
                    <div className="half-width" style={{position:"relative",overflow:"hidden"}}>
                        <img className="float-center" style={{borderRadius:"50%"}} src={posImage} alt="" />
                    </div>
                    <button onClick={()=>history.push(routes.login)} className="float-bottom-left pad pad-h radius click silver2" style={{float:"right",margin:"30px"}}>Login instead</button>
                </div>
            </IonContent>
        </IonPage>
    )
}
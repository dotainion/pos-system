import { IonIcon } from '@ionic/react';
import { saveOutline, trashOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { ModalContainer } from '../../container/ModalContainer';
import { Button } from '../../widgets/Button';
import { Stash } from './Stash';
import { AddCustomersAction, ViewCustomers } from './ViewCustomers';
import { ViewStash } from './ViewStash';


export const OrderEntryAction = ({isOpen, onClose, onCustomerSelected, searchValue}) =>{
    const [showWindow, setShowWindow] = useState({stash:true,stashed:false,customer:false});
    
    const btnContent = [
        {text: "Stash for later", active: showWindow.stash}, 
        {text: "View stash lists", active: showWindow.stashed}, 
        {text: "Customers", active: showWindow.customer}
    ];

    const taggleWindow = (cmd) =>{
        if (cmd.includes(btnContent[0].text)){
            setShowWindow({stash:true,stashed:false,customer:false});
        }else if (cmd.includes(btnContent[1].text)){
            setShowWindow({stash:false,stashed:true,customer:false});
        }else if (cmd.includes(btnContent[2].text)){
            setShowWindow({stash:false,stashed:false,customer:true});
        }
    }

    //detech change in search for customer on order enter
    useEffect(()=>{
        if (searchValue){
            taggleWindow(btnContent[2].text);
        }
    },[searchValue]);

    return(
        <ModalContainer isOpen={isOpen} onClose={onClose}>
            <div className="flex pad no-select" style={{backgroundColor:"gray",borderBottom:"1px solid black"}}>
                {btnContent.map((btn, key)=>(
                    <Button 
                        key={key}
                        onClick={(e)=>taggleWindow(e.value)}
                        color={btn.active && "brown"}
                        cssClass="silver max-width pad"
                        style={{padding:"8px"}}
                        text={btn.text}
                        shadow="none"
                        spacing
                    >
                    &nbsp;<IonIcon icon={saveOutline}/>
                </Button>
                ))}
            </div>
            <ViewCustomers
                isOpen={showWindow.customer}
                searchValue={searchValue}
                onCustomerSelected={onCustomerSelected}
            />
            <ViewStash 
                isOpen={showWindow.stashed}
            />
            <Stash
                isOpen={showWindow.stash}
            />
        </ModalContainer>
    )
}
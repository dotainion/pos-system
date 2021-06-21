import { IonContent, IonList, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React, { useState } from 'react';
import { MenuBar, MenuBarWrapper } from '../components/MenuBar';
import { BlankPage } from '../widgets/BlankPage';
import { Employees } from './Employees';


export const Administration = () =>{
    const [showEmployees, setShowEmployees] = useState(true);

    const pageList = [
        {
            title: "Employees",
            open: ()=>setShowEmployees(true)
        },
    ];

    const closeBefore = (action) =>{
        setShowEmployees(false);
        action?.();
    }
    return(
        <IonPage>
            <MenuBarWrapper barChildren={
                <div className="pad no-select">
                    {pageList.map((page, key)=>(
                        <label onClick={()=>closeBefore(page?.open)} className="pad border" key={key}>
                            <span>{page.title}</span>
                        </label>
                    ))}
                </div>
            }>
                <IonList class="item-container" style={{height:"80vh"}}>
                    <Employees isOpen={showEmployees}/>
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
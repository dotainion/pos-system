import { IonContent, IonList, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React, { useState } from 'react';
import { MenuBar, MenuBarWrapper } from '../container/MenuBar';
import { BlankPage } from '../widgets/BlankPage';
import { Button } from '../widgets/Button';
import { Employees } from './Employees';


export const Administration = () =>{
    const [showEmployees, setShowEmployees] = useState(true);
    const [createEmployee, setCreateEmployee] = useState(false);

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
                        <Button
                            key={key}
                            onClick={()=>closeBefore(page?.open)} 
                            text={page.title}
                            cssClass="btn-dark-hoverride"
                            heilight={showEmployees}
                            largeIcon
                            transparent
                            withBorder
                        />
                    ))}
                </div>
            } onAdd={()=>setCreateEmployee(true)}>
                <IonList class="item-container" style={{height:"80vh"}}>
                    <Employees
                        isOpen={showEmployees}
                        onCreateOpen={createEmployee}
                        onCreateClose={()=>setCreateEmployee(false)}
                    />
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
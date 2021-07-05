import { IonContent, IonList, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import React, { useState } from 'react';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { MenuBar, MenuBarWrapper } from '../container/MenuBar';
import { BlankPage } from '../widgets/BlankPage';
import { Button } from '../widgets/Button';
import { Employees } from './employee/Employees';


export const Administration = () =>{
    const [showEmployees, setShowEmployees] = useState(true);
    const [createEmployee, setCreateEmployee] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState({state:false,confirm:false,data:null});

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
                            transparent
                            withBorder
                            spacing
                        />
                    ))}
                </div>
            } onAdd={()=>setCreateEmployee(true)} noScroll>
                <div className="scroll scrollbar2" style={{height:"92vh"}}>
                    <Employees
                        isOpen={showEmployees}
                        onCreateOpen={createEmployee}
                        onCreateClose={()=>setCreateEmployee(false)}
                        confirmDelete={showDeleteAlert}
                        showconfirmDelete={setShowDeleteAlert}
                    />
                </div>
            </MenuBarWrapper>
        </IonPage>
    )
}
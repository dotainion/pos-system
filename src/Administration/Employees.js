import { IonIcon, IonImg, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { FaDivide } from 'react-icons/fa';
import { CreateEmployee } from '../components/CreateEmployee';
import { MenuBarWrapper } from '../container/MenuBar';
import { useStore } from '../context/Store';
import { getEmployees } from '../database/database';
import img from '../images/beach.jpg';


export const Employees = ({ isOpen, onCreateOpen, onCreateClose }) => {
    const { user } = useStore();
    const [showCreateEmployee, setShowCreateEmployee] = useState(false);
    const [holdEmployeeToBeEdited, setHoldEmployeeToBeEdited] = useState({});
    const [employees, setEmployees] = useState([]);

    const getMyEmployees = async () => {
        let recordOfEmployees = await getEmployees(user?.storeId);
        recordOfEmployees = recordOfEmployees.filter((agent) => !agent?.info?.role.includes("admin"));
        setEmployees(recordOfEmployees);
    }

    const onAddEmployee = () => {
        setHoldEmployeeToBeEdited({});
        setShowCreateEmployee(true);
    }

    const onEditEmployee = (employee) => {
        setHoldEmployeeToBeEdited(employee);
        setShowCreateEmployee(true);
    }

    useEffect(() => {
        getMyEmployees();
    }, []);

    useEffect(()=>{
        if (onCreateOpen) onAddEmployee();
    },[onCreateOpen]);

    useEffect(()=>{
        if (!showCreateEmployee) onCreateClose?.();
    },[showCreateEmployee]);
    return (
        <div hidden={!isOpen}>
            <CreateEmployee
                isOpen={showCreateEmployee}
                record={holdEmployeeToBeEdited}
                onClose={() => setShowCreateEmployee(false)}
                onUpdateComplete={getMyEmployees}
            />

            <IonList class="item-container">
                {
                    employees?.length ?
                        employees.map((employee, key) => (
                            <div onClick={() => onEditEmployee(employee)} className="item-info-container" key={key}>
                                <div className="item-sub-info-container dark">
                                    <IonThumbnail>
                                        <IonImg class="max-size" src={img} />
                                    </IonThumbnail>
                                    <div style={{ paddingTop: "10px" }}>
                                        <div className="pad-v-mini">{employee?.info?.name}</div>
                                        <div className="pad-v-mini">{employee?.info?.email}</div>
                                        <div className="pad-v-mini">{employee?.info?.phone1}</div>
                                        <div className="pad-v-mini">{`${employee?.info?.city} ${employee?.info?.country} ${employee?.info?.address}`}</div>
                                        <div className="pad-v-mini">{employee?.info?.role}</div>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <div>No Empolyee</div>
                }
            </IonList>
        </div>
    )
}
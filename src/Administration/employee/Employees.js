import { IonIcon, IonImg, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { FaDivide } from 'react-icons/fa';
import { CreateEmployee } from './widgets/CreateEmployee';
import { MenuBarWrapper } from '../../container/MenuBar';
import { useStore } from '../../context/Store';
import { deleteEmployeeById, getEmployees } from '../../database/database';
import img from '../../images/beach.jpg';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { NoRecords } from '../../widgets/NoRecords';
import { ButtonWithOption } from '../../widgets/ButtonWithOption';
import { Button } from '../../widgets/Button';


export const Employees = ({ isOpen, onCreateOpen, onCreateClose, confirmDelete, showconfirmDelete }) => {
    const { user } = useStore();
    const [showCreateEmployee, setShowCreateEmployee] = useState(false);
    const [holdEmployeeToBeEdited, setHoldEmployeeToBeEdited] = useState({});
    const [employees, setEmployees] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showMultipleSelect, setShowMultipleSelect] = useState(false);
    const [holdMultiple, setHoldMultiple] = useState([]);

    const getMyEmployees = async () => {
        let recordOfEmployees = await getEmployees(user?.storeId);
        recordOfEmployees = recordOfEmployees.filter((agent) => !agent?.info?.role.includes("admin"));
        setEmployees(recordOfEmployees);
    }

    const onDeleteRecord = async(record, multi=null) =>{
        setShowLoader(true);
        if (multi){
            for (let item of holdMultiple){
                await deleteEmployeeById(item?.id);
            }
            setHoldMultiple([]);
            setShowMultipleSelect(false);
        }else await deleteEmployeeById(record?.id);
        await getMyEmployees();
        setShowLoader(false);
    }

    const onSelectMultiple = (checked, record) =>{
        if (checked) setHoldMultiple([...holdMultiple, record]);
        else{
            let temp = [];
            for (let item of holdMultiple){
                if (item?.id !== record?.id) temp.push(item);
            }
            setHoldMultiple(temp);
        }
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
            <Loader isOpen={showLoader} />
            <NoRecords hidden={employees?.length} style={{height:"92vh"}} />
            <Button
                hidden={!holdMultiple.length}
                onClick={()=>onDeleteRecord(null, true)} 
                text={"Delete"}
                cssClass="btn-dark-hoverride float-top-left dark"
                style={{zIndex:"99",top:"10px",left:"10px",}}
            />
            <div class="item-container">
                {
                    employees?.length ?
                    employees.map((employee, key) => (
                        <div className="item-info-container relative" style={{color:"white"}} key={key}>
                            <div onClick={() => onEditEmployee(employee)} className="item-sub-info-container dark">
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
                            <ButtonWithOption
                                options={[{
                                    title: "Delete",
                                    command: ()=>onDeleteRecord(employee)
                                },{
                                    title: "Delete Multiple",
                                    command: ()=>setShowMultipleSelect(true)
                                }]}
                                cssClass="float-bottom-right"
                                style={{margin:"20px"}}
                            />
                            <input 
                                hidden={!showMultipleSelect}
                                className="float-top-left" 
                                style={{margin:"20px"}} 
                                type="checkbox" 
                                onChange={(e)=>onSelectMultiple(e.target.checked, employee)}
                            />
                        </div>
                    )) :null
                }
            </div>
        </div>
    )
}
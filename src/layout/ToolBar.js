import { IonHeader, IonList, IonTitle, IonToolbar } from "@ionic/react"
import { useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../context/Store";
import { routes } from "../global/Routes";
import { tools } from "../tools/Tools";
import { Alert } from "../widgets/Alert";
import { Dropdown } from "../widgets/Dropdown"


export const ToolBar = ({onOpenCalc, onOpenPayOut, onOpenDiscounts}) =>{
    const history = useHistory();
    const { signOut, adminAccess } = useStore();
    const [showAlert,setShowAlert] = useState({state:false, route:""});

    const edits = [
        {
            title: "Pay out",
            command: ()=>onOpenPayOut?.()
        }
    ];
    const files = [
        {
            title: "Calculator",
            command: ()=>onOpenCalc?.()
        },{
            title: "Discounts",
            command: ()=>onOpenDiscounts?.()
        }
    ];
    const views = [
        {
            title: tools.titleCase(routes.products,"/"),
            command: ()=>routeTo(routes.products)
        },{
            title: tools.titleCase(routes.reports,"/"),
            command: ()=>routeTo(routes.reports)
        },{
            title: tools.titleCase(routes.employees,"/"),
            command: ()=>routeTo(routes.employees)
        }
    ];
    const settings = [
        {
            title: tools.titleCase(routes.settings,"/"),
            command: ()=>routeTo(routes.settings)
        }
    ];

    const routeTo = (path) =>{
        for (let link of views){
            if (path.includes(link.title.toLowerCase()) && !adminAccess){
                return setShowAlert({state:true, route:path});
            }
        }
        tools.route.set(path);
        history.push(path);
    }
    return(
        <>
            <Alert
                isOpen={showAlert.state}
                header="Administrator alert!!"
                onClose={()=>setShowAlert({state:false, route:""})}
                onConfirm={()=>{
                    tools.route.set(showAlert.route);
                    history.push(showAlert.route);
                }}
                message="Requires admin profilage, will you like to continue?"
            />
            <div className="no-select h-seperator pad dark font-mini" style={{position:"relative"}}>
                <Dropdown options={files} cssClass="inline pad-mini dark-hover v-seperator">File</Dropdown>
                <Dropdown options={edits} cssClass="inline pad-mini dark-hover v-seperator">Edit</Dropdown>
                <Dropdown options={views} cssClass="inline pad-mini dark-hover v-seperator">View</Dropdown>
                <Dropdown options={settings} cssClass="inline pad-mini dark-hover">Settings</Dropdown>
                <label onClick={signOut} className="float-right pad-h-xl close-hover">Sign out</label>
            </div>
        </>
    )
}
import { IonHeader, IonList, IonTitle, IonToolbar } from "@ionic/react"
import { useHistory } from "react-router";
import { routes } from "../global/Routes";
import { tools } from "../tools/Tools";
import { Dropdown } from "../widgets/Dropdown"


export const ToolBar = () =>{
    const history = useHistory();

    const edits = [

    ];
    const files = [
        
    ];
    const views = [
        {
            title: tools.titleCase(routes.products,"/"),
            command: ()=>history.push(routes.products)
        },{
            title: tools.titleCase(routes.administration,"/"),
            command: ()=>history.push(routes.administration)
        },{
            title: tools.titleCase(routes.reports,"/"),
            command: ()=>history.push(routes.reports)
        },{
            title: tools.titleCase(routes.employees,"/"),
            command: ()=>history.push(routes.employees)
        }
    ];
    const settings = [
        
    ];
    return(
            <div className="no-select h-seperator pad dark font-mini">
                <Dropdown options={files} cssClass="inline pad-mini dark-hover v-seperator">File</Dropdown>
                <Dropdown options={edits} cssClass="inline pad-mini dark-hover v-seperator">Edit</Dropdown>
                <Dropdown options={views} cssClass="inline pad-mini dark-hover v-seperator">View</Dropdown>
                <Dropdown options={settings} cssClass="inline pad-mini dark-hover">Settings</Dropdown>
            </div>
    )
}
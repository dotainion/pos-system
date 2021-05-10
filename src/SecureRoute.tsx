import { IonContent, IonPage } from "@ionic/react";
import { Redirect, useHistory } from "react-router";
import { AdminAccess } from "./authentication/AdminAccess";
import { useStore } from "./context/Store";
import { routes } from "./global/Routes";


const SecureRoutes = ({Components}:any) =>{
    const history = useHistory();
    const { isAuthenticated, adminAccess } = useStore();

    const path = history.location.pathname;
    if (isAuthenticated && adminAccess) return <Components/>;
    else if (!path.includes(routes.login) && !path.includes(routes.register) && !path.includes(routes.orderEntry)){
        return <AdminAccess path={path}/>;
    }else if (isAuthenticated) return <Components/>;
    else return <Redirect to={routes.login}/>;
}

export default SecureRoutes;
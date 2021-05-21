import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Route } from "workbox-routing";
import { AdminAccess } from "./authentication/AdminAccess";
import { useStore } from "./context/Store";
import { routes } from "./global/Routes";


const SecureRoutes = ({Components}) =>{
    const history = useHistory();
    const { isAuthenticated, adminAccess } = useStore();
    const path = history.location.pathname;
    if (isAuthenticated && adminAccess) return <Components/>;
    else if (!path.includes(routes.orderEntry)){
        if (isAuthenticated) return <Redirect to={routes.adminAccess}/>;
        else return <Redirect to={routes.login}/>;
    }
    else if (isAuthenticated) return <Components/>;
    else return <Redirect to={routes.login}/>;
}

export default SecureRoutes;
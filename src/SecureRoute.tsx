import { IonContent, IonPage } from "@ionic/react";
import { Redirect } from "react-router";
import { useStore } from "./context/Store";
import { routes } from "./global/Routes";


const SecureRoutes = ({Components}:any) =>{
    const { isAuthenticated } = useStore();

    if (isAuthenticated) return <Components/>
    else return <Redirect to={routes.login}/>
}

export default SecureRoutes;
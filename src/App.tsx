import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/general.css';
import './theme/responsive.css';
import './theme/actions.css';

/* pages */
import OrderEntry from './orderEntery/OrderEntry';
import { Login } from './authentication/Login';
import { routes } from './global/Routes';
import SecureRoutes from './SecureRoute';
import { AppContext} from './context/Store';
import { Products } from './admin/Products';
import { Administration } from './Administration/Administration';
import { Settings } from './settings/Settings';
import { Register } from './authentication/Register';
import { Payout } from './payout/Payout';
import { AdminAccess } from './authentication/AdminAccess';
import { ReportWindow } from './reports/ReportMain';


const App: React.FC = () =>{
  return (
    <IonApp>
      <AppContext>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path={routes.products} render={()=><SecureRoutes Components={Products}/>}/>
            <Route exact path={routes.administration} render={()=><SecureRoutes Components={Administration}/>}/>
            <Route exact path={routes.orderEntry} render={()=><SecureRoutes Components={OrderEntry}/>}/>
            <Route exact path={routes.reports} render={()=><SecureRoutes Components={ReportWindow}/>}/>
            <Route exact path={routes.settings} render={()=><SecureRoutes Components={Settings}/>}/>
            <Route exact path={routes.refund} render={()=><SecureRoutes Components={Payout}/>}/>
            <Route exact path={routes.adminAccess} render={()=><AdminAccess/>}/>
            <Route exact path={routes.login} render={()=><Login/>}/>
            <Route exact path={routes.register} render={()=><Register/>}/>
            <Route exact path={routes.default} render={()=><Redirect to={routes.orderEntry}/>}/>
          </IonRouterOutlet>
        </IonReactRouter>
      </AppContext>
    </IonApp>
  );
}

export default App;

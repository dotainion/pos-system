import {IonButton, IonContent,IonIcon,IonItem,IonLabel,IonList,IonListHeader,IonMenu,IonMenuToggle,IonNote, IonRouterOutlet,} from '@ionic/react';
import { addOutline, cartOutline, constructOutline, peopleOutline, podiumOutline, pricetagOutline, reorderFourOutline, statsChartOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { routes } from '../global/Routes';
import { tools } from '../tools/Tools';
import { SearchBar } from '../widgets/SearchBar';



const nav = [
    {
        title: "Order Entry",
        icon: cartOutline,
        url: routes.orderEntry
    },{
        title: "Administrator",
        icon: podiumOutline,
        url: routes.administration
    },{
        title: "Products",
        icon: pricetagOutline,
        url: routes.products
    },{
        title: "Repors",
        icon: statsChartOutline,
        url: routes.reports
    },{
        title: "Employees",
        icon: peopleOutline,
        url: routes.employees
    },{
        title: "Settings",
        icon: constructOutline,
        url: routes.settings
    }
];

export const MenuBarWrapper = ({onAdd, onSearch, children}) =>{
    const history = useHistory();
    const [showSideMenu, setShowSideMenu] = useState("hide-menu");
    const [hideToolbar, setHideToolbar] = useState(true);

    const toggleMenu = () =>{
        if (showSideMenu === "show-menu") setShowSideMenu("hide-menu");
        else setShowSideMenu("show-menu");
    }

    const isSelected = (page) =>{
        const locate = history.location.pathname;
        if (locate !== page) return "";
        else return "menu-button-selected";
    }

    useEffect(()=>{
        if (onAdd || onSearch) setHideToolbar(false);
        else setHideToolbar(true);
        if (tools.isMobile()) setHideToolbar(false);
    },[onAdd, onSearch,]);
    return(
        <div className="flex">
            <div className={`menu-container ${showSideMenu}`}>
                <IonList style={{marginBottom:"20px"}}>
                    <IonListHeader>POS System</IonListHeader>
                    <IonNote style={{marginLeft:"30px"}}>POS System</IonNote>
                </IonList>
                {nav.map((appPage, index) => (
                    <IonMenuToggle autoHide={false} key={index}>
                        <IonItem className={`menu-button ${isSelected(appPage.url)}`} routerLink={appPage.url} routerDirection="none" lines="none">
                            <IonIcon class="menu-button-icon" slot="start" icon={appPage.icon} />
                            <IonLabel>{appPage.title}</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                ))}
            </div>
            <div onClick={(e)=>setShowSideMenu("hide-menu")} className="max-width">
                <div className="max-screen-height scroll menu-content-page">
                    <div hidden={hideToolbar} onClick={(e)=>e.stopPropagation()} className="fixed flex menu-toolbar-container">
                        <div>
                            <button hidden={!onAdd} onClick={onAdd} className="add-btn hide-on-mobile">Add<IonIcon icon={addOutline}/></button>
                            <IonIcon onClick={toggleMenu} class="hamburger-menu hide-on-desktop" icon={reorderFourOutline}/>
                        </div>
                        <div className="float-center menu-toolbar-search">
                            <SearchBar hidden={!onSearch} onSearch={onSearch} placeholder="Find employee"/>
                        </div>
                    </div>
                    {children}
                    <IonIcon hidden={!onAdd} onClick={onAdd} class="add-btn-2 add-btn-on-mobile hide-on-desktop" icon={addOutline}/>
                </div>
            </div>
        </div>
    )
}
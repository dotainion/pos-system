import {IonButton, IonContent,IonIcon,IonItem,IonLabel,IonList,IonListHeader,IonMenu,IonMenuToggle,IonNote, IonRouterOutlet,} from '@ionic/react';
import { addOutline, calendarOutline, cartOutline, constructOutline, logOutOutline, peopleOutline, podiumOutline, pricetagOutline, reorderFourOutline, statsChartOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useStore } from '../context/Store';
import { routes } from '../global/Routes';
import { tools } from '../tools/Tools';
import { Calendar } from '../widgets/Calendar';
import { SearchBar } from '../widgets/SearchBar';



const nav = [
    {
        title: "Order Entry",
        icon: cartOutline,
        url: routes.orderEntry,
        hidden: false
    },{
        title: "Administrator",
        icon: podiumOutline,
        url: routes.administration,
        hidden: false
    },{
        title: "Products",
        icon: pricetagOutline,
        url: routes.products,
        hidden: false
    },{
        title: "Repors",
        icon: statsChartOutline,
        url: routes.reports,
        hidden: false
    },{
        title: "Settings",
        icon: constructOutline,
        url: routes.settings,
        hidden: false
    }
];

export const MenuBarWrapper = ({onAdd, onSearch, onSave, saveBtnHilight, options, optionsTitle, optionWillClick, barChild, barChildren, children}) =>{
    const history = useHistory();
    const { setAdminAccess, user } = useStore();
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

    const routeTo = (path) =>{
        history.push({pathname:path,state:path});
    }

    useEffect(()=>{
        if (onAdd || onSearch || onSave || barChild || barChildren) setHideToolbar(false);
        else setHideToolbar(true);
        if (tools.isMobile()) setHideToolbar(false);
    },[onAdd, onSearch, onSave, barChild, barChildren]);
    
    return(
        <div className="flex">
            <div hidden={!showSideMenu.includes("show-menu")} onClick={toggleMenu} className="menu-backdrop"/>
            <div className={`menu-container scroll scrollbar dark no-select ${showSideMenu}`}>
                <IonList style={{marginBottom:"20px"}}>
                    <IonListHeader>POS System</IonListHeader>
                    <IonNote style={{marginLeft:"30px"}}>{user?.businessName}</IonNote>
                </IonList>
                {nav.map((appPage, key) => (
                    <IonMenuToggle hidden={appPage.hidden} autoHide={false} key={key}>
                        <IonItem className={`menu-button menu-hover ${isSelected(appPage.url)}`} onClick={()=>routeTo(appPage.url)} routerDirection="none" lines="none">
                            <IonIcon class="menu-button-icon" slot="start" icon={appPage.icon} />
                            <IonLabel>{appPage.title}</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                ))}
                <IonMenuToggle autoHide={false}>
                    <IonItem onClick={()=>{history.push(routes.orderEntry); setAdminAccess(false)}} className="menu-button close-hover" lines="none">
                        <IonIcon class="menu-button-icon" slot="start" icon={logOutOutline} />
                        <IonLabel>Log off</IonLabel>
                    </IonItem>
                </IonMenuToggle>
                <div className="menu-button-option-container">
                    <div hidden={!optionsTitle} className="pad silver">{optionsTitle}</div>
                    {options?.map((option, key) => (
                        <IonMenuToggle autoHide={false} key={key}>
                            <IonItem className={`menu-button menu-hover ${option.selected && "menu-button-selected"}`} onClick={()=>{optionWillClick?.();toggleMenu();option.command?.()}} routerDirection="none" lines="none">
                                <IonIcon class="menu-button-icon" slot="start" icon={option.icon} />
                                <IonLabel>{option.title}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    ))}
                </div>
            </div>
            <div onClick={(e)=>setShowSideMenu("hide-menu")} className="menu-content-page bg max-width-on-mobile">
                <div hidden={hideToolbar} onClick={(e)=>e.stopPropagation()} className="fixed flex dark menu-toolbar-container">
                    <div className="relative menu-bar-btn-container hide-on-desktop">
                        <IonIcon onClick={toggleMenu} class="hamburger-menu silver" icon={reorderFourOutline}/>
                    </div>
                    <div hidden={!onAdd} className="relative menu-bar-btn-container">
                        <button onClick={onAdd} style={{borderRadius:"50%",fontSize:"25px"}} className="float-center silver click2 pad hide-on-mobile"><IonIcon icon={addOutline}/></button>
                    </div>
                    <div hidden={!onSave} className="relative menu-bar-btn-container">
                        <button onClick={onSave} className={`float-center ${saveBtnHilight? "success2":"silver"} pad radius click2`}>Save</button>
                    </div>
                    <div hidden={!barChild} className="relative menu-bar-btn-container">
                        <div className="float-center">{barChild}</div>
                    </div>
                    <div hidden={!barChildren} className="relative menu-bar-children-btn-container">
                        <div className="float-center max-width">{barChildren}</div>
                    </div>
                    <div hidden={!onSearch} className="float-center menu-toolbar-search" style={{color:"black"}}>
                        <SearchBar onSearch={onSearch} placeholder="Find employee"/>
                    </div>
                </div>
                <div className="max-screen-height-for-menu-wrapper scroll scrollbar2">
                    {children}
                    <IonIcon hidden={!onAdd} onClick={onAdd} class="add-btn-2 add-btn-on-mobile hide-on-desktop" icon={addOutline}/>
                </div>
            </div>
        </div>
    )
}
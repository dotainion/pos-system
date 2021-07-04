import { IonList, IonPage } from '@ionic/react';
import { businessOutline, calendarOutline, documentOutline, expandOutline, settingsOutline, shareOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { MenuBarWrapper } from '../container/MenuBar';
import { EndOfDay } from './EndOfDay';
import { ReportBtnAndContainer } from './ReportBtnAndContainer';
import { reportBtns } from '../content/lists';
import { LowInventory } from './LowInventory';
import { CalendarPopup } from '../app/Calendar';
import { CashDrawers } from './CashDrawers';
import { CashDrops } from './CashDrops';
import { System } from './System';
import { EmployeeBanking } from './EmployeeBanking';
import { BlankPage } from '../widgets/BlankPage';
import { useHistory } from 'react-router';
import { routes } from '../global/Routes';



export const ReportWindow = () =>{
    const [showEndOfDay, setShowEndOfDay] = useState(true);
    const [showReports, setShowReports] = useState(false);
    const [switchState, setSwitchState] = useState(reportBtns[4]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calenderValue, setCalandarValue] = useState();
    const [showCashDrops, setShowCashDrops] = useState(false);
    const [showCashDrawers, setShowCashDrawers] = useState(false);
    const [showEmployeeBanking, setShowEmployeeBanking] = useState(false);
    const [showSystem, setShowSystem] = useState(false);
    const [barChild, setBarChild] = useState();//hold component for menuBar top header


    const sideNav = [
        {
            title: "CASH DRAWERS",
            icon: expandOutline,
            selected: showCashDrawers,
            command: ()=>setShowCashDrawers(true)
        },{
            title: "END OF DAY",
            icon: calendarOutline,
            selected: showEndOfDay,
            command: ()=>setShowEndOfDay(true)
        },{
            title: "REPORTS",
            icon: documentOutline,
            selected: showReports,
            command: ()=>setShowReports(true)
        },{
            title: "CASH DROPS",
            icon: shareOutline,
            selected: showCashDrops,
            command: ()=>setShowCashDrops(true)
        },{
            title: "EMPLOYEE BANKING",
            icon: businessOutline,
            selected: showEmployeeBanking,
            command: ()=>setShowEmployeeBanking(true)
        },{
            title: "SYSTEM",
            icon: settingsOutline,
            selected: showSystem,
            command: ()=>setShowSystem(true)
        }
    ];

    //close all windows before opening spesific one
    const onClose = () =>{
        setShowSystem(false);
        setShowReports(false);
        setShowEndOfDay(false);
        setShowCashDrops(false);
        setShowCashDrawers(false);
        setShowEmployeeBanking(false);
    }

    return(
        <IonPage>
            <CalendarPopup
                isOpen={showCalendar}
                onClose={()=>setShowCalendar(false)}
                onSelect={setCalandarValue}
                closeOnSelect
            />
            <MenuBarWrapper options={sideNav} optionWillClick={onClose} optionsTitle="Reports" barChild={barChild}>
                <IonList class="item-container">
                    <EndOfDay
                        isOpen={showEndOfDay}
                        dateSelected={calenderValue}
                        onRunEndOfDay={()=>setShowCalendar(true)}
                    />
                    <CashDrawers isOpen={showCashDrawers} />
                    <CashDrops isOpen={showCashDrops} setBarChild={setBarChild} />
                    <System isOpen={showSystem} setBarChild={setBarChild} />
                    <EmployeeBanking isOpen={showEmployeeBanking} />
                    <ReportBtnAndContainer isOpen={showReports} onSelect={setSwitchState} btnHilight={switchState}>
                        <LowInventory isOpen={switchState === reportBtns[4]}/>
                        <div hidden={switchState === reportBtns[4]} className="relative max-size" style={{height:"60vh"}}>
                            <BlankPage title={switchState} />
                        </div>
                    </ReportBtnAndContainer>
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
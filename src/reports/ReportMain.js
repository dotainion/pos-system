import { IonList, IonPage } from '@ionic/react';
import { businessOutline, calendarOutline, documentOutline, expandOutline, settingsOutline, shareOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { MenuBarWrapper } from '../components/MenuBar';
import { EndOfDay } from './EndOfDay';
import { ReportBtnAndContainer } from './ReportBtnAndContainer';
import { reportBtns } from '../content/lists';
import { LowInventory } from './LowInventory';
import { Calendar } from '../widgets/Calendar';
import { CashDrawers } from './CashDrawers';
import { CashDrops } from './CashDrops';
import { System } from './System';
import { EmployeeBanking } from './EmployeeBanking';
import { BlankPage } from '../widgets/BlankPage';



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


    const sideNav = [
        {
            title: "CASH DRAWERS",
            icon: expandOutline,
            selected: null,
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
            selected: null,
            command: ()=>setShowCashDrops(true)
        },{
            title: "EMPLOYEE BANKING",
            icon: businessOutline,
            selected: null,
            command: ()=>setShowEmployeeBanking(true)
        },{
            title: "SYSTEM",
            icon: settingsOutline,
            selected: null,
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
            <Calendar
                isOpen={showCalendar}
                onClose={()=>setShowCalendar(false)}
                onSelect={setCalandarValue}
            />
            <MenuBarWrapper options={sideNav} optionWillClick={onClose} optionsTitle="Reports">
                <IonList class="item-container">
                    <EndOfDay
                        isOpen={showEndOfDay}
                        dateSelected={calenderValue}
                        onRunEndOfDay={()=>setShowCalendar(true)}
                    />
                    <CashDrawers isOpen={showCashDrawers} />
                    <CashDrops isOpen={showCashDrops} />
                    <System isOpen={showSystem} />
                    <EmployeeBanking isOpen={showEmployeeBanking} />
                    <ReportBtnAndContainer isOpen={showReports} onSelect={setSwitchState} btnHilight={switchState}>
                        <LowInventory isOpen={switchState === reportBtns[4]} />
                        <div hidden={switchState === reportBtns[4]} className="relative max-size" style={{height:"60vh"}}>
                            <BlankPage title={switchState} />
                        </div>
                    </ReportBtnAndContainer>
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}
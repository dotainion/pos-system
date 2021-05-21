import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/Store';
import { printer } from './Printer';


export const ReceiptPreview = ({isOpen, onClose, record}) =>{
    const { setCart } = useStore();

    const onPrint = () =>{
        printer.print(
            "print-preview",
            "print-preview-frame"
        );
        triggerClose();
    }

    const triggerClose = () =>{
        setCart([]);
        onClose?.();
    }    

    return(
        <div hidden={!isOpen} className="backdrop-left">
            <div className="float-center" style={{height:"90vh"}}>
                <Receipt record={record}/>
                <div className="print-preview-action-container" style={{paddingBottom:"25px"}}>
                    <div className="float-center max-width">
                        <button onClick={triggerClose} className="print-btn">Done</button>
                        <button onClick={onPrint} className="print-btn">Print</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Receipt = ({record}) =>{
    return(
        <div className="print-preview-container scrollbar">
            <div id="print-preview" className="print-preview">
                <img src="./logo.png" alt="Logo"/>
                <p className="centered">
                    <span>RECEIPT EXAMPLE</span><br/>
                    <span>Address line 1</span><br/>
                    <span>Address line 2</span>
                </p>
                <table>
                    <thead>
                        <tr>
                            <th className="quantity">Q.</th>
                            <th className="description">Description</th>
                            <th className="price">$$</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            record?.order?.map((receipt, key)=>(
                                <tr key={key}>
                                    <td className="quantity">{receipt?.qty}</td>
                                    <td className="description">{receipt?.info?.title}</td>
                                    <td className="price">${receipt?.info?.salePrice}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <p className="centered border-top">
                    <span>Tax ${record?.tax?.toFixed?.(2) || 0}</span><br/>
                    <span>Net ${record?.net?.toFixed?.(2) || 0}</span><br/>
                    <span><b>Total ${record?.total?.toFixed?.(2) || 0}</b></span>
                </p>
                <p className="centered">
                    <span>Thanks for your purchase!</span><br/>
                    <span>parzibyte.me/blog</span>
                </p>
            </div>
            <iframe id="print-preview-frame" className="print-preview-iframe"/>
        </div>
    )
}
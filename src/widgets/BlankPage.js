import React from 'react';


export const BlankPage = ({title}) =>{
    return(
        <div className="backdrop">
            <div className="float-center" style={{width:"300px"}}>
                <div className="pad-xxl silver" style={{fontSize:"20px"}}>
                    <div>{title}</div>
                    <div className="centered pad" style={{color:"orangeRed"}}>LOCKED</div>
                </div>
            </div>
        </div>
    )
}
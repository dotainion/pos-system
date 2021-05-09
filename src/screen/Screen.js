import React, {Component} from 'react'
 
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
 
export const Portrait = ({children}) =>{
    return (
        <DeviceOrientation lockOrientation={'portrait'}>
            {/* Will stay in DOM, but is only visible in portrait */}
            <Orientation orientation='portrait'>
                <div>
                    {children}
                </div>
            </Orientation>
        </DeviceOrientation>
    )
}

export const Landscape = ({children}) =>{
    return (
        <DeviceOrientation lockOrientation={'landscape'}>
            {/* Will only be in DOM in landscape */}
            <Orientation orientation='landscape' alwaysRender={true}>
                <div>
                    {children}
                </div>
            </Orientation>
        </DeviceOrientation>
    )
}
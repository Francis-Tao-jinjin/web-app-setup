import React, { useContext } from 'react';
import { FrontendClient } from '../client';
const style = require('./style.css');

export const ClientContext = React.createContext<FrontendClient|null>(null);
export function useClientContext() {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error(`ClientContext is not initialized`);
    }
    return context;
}

export function FrontendUI (props:{
    client:FrontendClient,
}) {

    return <ClientContext.Provider value={props.client}>
        <div className='text-center text-2xl'>
            Hello World.
        </div>
        <div className={style.container}>
            This text has blue color
            <div className={style.testBgImg}>
            </div>
        </div>
    </ClientContext.Provider>
}
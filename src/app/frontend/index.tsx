import React, { useContext } from 'react';
import { FrontendClient } from '../client';

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
        <div>
            Hellow
        </div>
    </ClientContext.Provider>
}
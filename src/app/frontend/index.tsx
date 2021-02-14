import React, { useContext, useEffect, useState } from 'react';
import { FrontendClient } from '../client';
import { Equation } from './calculator/equation';
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
    useEffect(() => {
        console.log('call caculator api hello')
        props.client.rpc.caculator.api.hello()
            .then((answer) => {
                console.log('receive from rpc server:', answer);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return <ClientContext.Provider value={props.client}>
        <div className='text-center text-4xl font-mono text-blue-700 leading-loose'>
            RPC Caculator
        </div>
        <div className='sm:container sm:mx-auto'>
            <div className='grid grid-cols-1'>
                <div>
                    <Equation
                        symbol={'+'}
                        cal={(a:number, b:number) => {
                            return props.client.rpc.caculator.api.add({a, b});
                        }}
                    ></Equation>
                    <Equation
                        symbol={'-'}
                        cal={(a:number, b:number) => {
                            return props.client.rpc.caculator.api.sub({a, b});
                        }}
                    ></Equation>
                    <Equation
                        symbol={'*'}
                        cal={(a:number, b:number) => {
                            return props.client.rpc.caculator.api.mul({a, b});
                        }}
                    ></Equation>
                    <Equation
                        symbol={'%'}
                        cal={(a:number, b:number) => {
                            return props.client.rpc.caculator.api.mod({a, b});
                        }}
                    ></Equation>
                </div>
            </div>
        </div>
    </ClientContext.Provider>
}
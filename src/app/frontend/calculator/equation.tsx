import React, { useContext, useEffect, useState } from 'react';

const style = require('./style.css');

export function Equation (props:{
    symbol: string,
    cal: (a:number, b:number) => Promise<number>;
}) {

    const [numberA, setNumberA] = useState(0);
    const [displayA, setDisplayA] = useState('0');
    const [numberB, setNumberB] = useState(0);
    const [displayB, setDisplayB] = useState('0');
    const [result, updateResult] = useState(0);

    useEffect(() => {
        props.cal(numberA, numberB)
            .then((ans) => {
                updateResult(ans);
            })
    }, [numberA, numberB]);

    return (
        <div className={['flex justify-center', style.equation].join(' ')}>
            <input
                className='w-32 border border-gray-300 p-2 my-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200'
                value={displayA}
                onChange={(e) => {
                    const text = e.target.value.trim();
                    if (text == '') {
                        setNumberA(0);
                        setDisplayA('0');
                        return;
                    }
                    const match = text.match(/[-+]?[0-9]*\.?[0-9]*/);
                    if (match && match[0] !== '') {
                        setDisplayA(match[0]);
                        const parseValue = parseFloat(match[0]);
                        if (!Number.isNaN(parseValue)) {
                            setNumberA(parseValue);
                        }
                    }
                }}
                ></input>
            <span className={style.symbol}>{props.symbol}</span>
            <input
                className='w-32 border border-gray-300 p-2 my-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200'
                value={displayB}
                onChange={(e) => {
                    const text = e.target.value.trim();
                    if (text == '') {
                        setNumberB(0);
                        setDisplayB('0');
                        return;
                    }
                    const match = text.match(/[-+]?[0-9]*\.?[0-9]*/);
                    if (match && match[0] !== '') {
                        setDisplayB(match[0]);
                        const parseValue = parseFloat(match[0]);
                        if (!Number.isNaN(parseValue)) {
                            setNumberB(parseValue);
                        }
                    }
                }}
                ></input>
            <span className={style.symbol}>=</span>
            <div
                className='w-20 border border-gray-300 p-2 my-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200 truncate'
                >{result}</div>
        </div>
    );
}
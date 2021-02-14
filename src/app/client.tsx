import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Logger } from '../utils/logger';
import { clientConfig } from './client-config';
import { FrontendUI } from './frontend';
import './global.css';
import { WebAppRPCClient } from './service/calculator-client';

export class FrontendClient {
    public logger:Logger;
    public rpc:WebAppRPCClient;

    private rootDiv:HTMLDivElement;

    constructor(spec:{
        logger:Logger,
    }) {
        console.log('backend URL is', clientConfig.backendURL);
        this.rpc = new WebAppRPCClient(clientConfig.backendURL);

        this.logger = spec.logger;
        this.rootDiv = document.createElement('div');
        this.rootDiv.style.left = '0';
        this.rootDiv.style.right = '0';
        document.body.appendChild(this.rootDiv);
    }

    public start() {
        this.render();
    }

    public render() {
        ReactDOM.render(
            <FrontendUI
                client={this}
            ></FrontendUI>,
            this.rootDiv,
        );
    }
}
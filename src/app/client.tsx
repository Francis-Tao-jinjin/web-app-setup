import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Logger } from '../utils/logger';
import { FrontendUI } from './frontend';

export class FrontendClient {
    public logger:Logger;
    private rootDiv:HTMLDivElement;

    constructor(spec:{
        logger:Logger,
    }) {
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
import path from 'path';

export const ROOT = path.join(__dirname, '../../..');

export const SRC = path.join(ROOT, 'src');
export const ASSETS = path.join(ROOT, 'assets');
export const BUILD = path.join(ROOT, 'build');
export const PUBLIC = path.join(ROOT, 'public');

// bundled client javascript and CSS goes in here
export const STATICS = path.join(ASSETS, 'build');

// frontend js and css references
export const WEBAPP_WORKER = path.join(BUILD, 'bundle.app.worker.dev.js');
export const FRONTEND_CSS = path.join(BUILD, 'bundle.app.dev.css');
export const FRONTEND_JS = path.join(BUILD, 'bundle.app.dev.js');
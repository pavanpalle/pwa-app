import React from 'react';
import ReactDOM, { render } from 'react-dom';

import store from './store';
import './index.css';
import './font.css';
import app from '@magento/peregrine/lib/store/actions/app';
import Adapter from '@magento/venia-ui/lib/components/Adapter';
import { registerSW } from './registerSW';
import Newsletter from "@magento/venia-ui/lib/components/Newsletter";


// server rendering differs from browser rendering
const isServer = !globalThis.document;

// TODO: on the server, the http request should provide the origin
const origin = isServer
    ? process.env.MAGENTO_BACKEND_URL
    : globalThis.location.origin;

// on the server, components add styles to this set and we render them in bulk
const styles = new Set();

const configureLinks = links => [...links.values()];

const tree = (
    <Adapter
        configureLinks={configureLinks}
        origin={origin}
        store={store}
        styles={styles}
    />
);
document.addEventListener("DOMContentLoaded", () => {
    const newsletterSection = document.getElementById("newsletter-section");
    console.log("newsletter-section", newsletterSection);
    if (newsletterSection) {
        ReactDOM.render(<Newsletter />, newsletterSection);
    }
});

if (isServer) {
    // TODO: ensure this actually renders correctly
    import('react-dom/server').then(({ default: ReactDOMServer }) => {
        console.log(ReactDOMServer.renderToString(tree));
    });
} else {
    render(tree, document.getElementById('root'));
    registerSW();

    globalThis.addEventListener('online', () => {
        store.dispatch(app.setOnline());
    });
    globalThis.addEventListener('offline', () => {
        store.dispatch(app.setOffline());
    });
}


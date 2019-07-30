import React from "react";
import {render} from "react-dom";

// webpack.config.jsの、DefinePluginを参照
declare var NODE_ENV;
(() => {
    const toggler: HTMLButtonElement = document.querySelector("#btn-localstorage-inspector");
    if (NODE_ENV == "production") {
        toggler.remove();
        return;
    }
    let hidden = true;
    const container: HTMLDivElement = document.querySelector("#localstorage-inspector-container");
    const inspector: HTMLDivElement = container.querySelector("#localstorage-inspector");
    const show = () => {
        container.style.display = "block";
        const dictionary: { [key: string]: any } = {};
        for (let key in window.localStorage) {
            if (!Object.prototype.hasOwnProperty.call(window.localStorage, key)) continue;
            const raw = window.localStorage.getItem(key);
            try {
                const value = JSON.parse(raw);
                dictionary[key] = value;
            } catch (err) {
                dictionary[key] = raw;
            }
        }
        inspector.innerHTML = JSON.stringify(dictionary, null, 4);
    };
    const hide = () => {
        container.style.display = "none";
    };
    toggler.addEventListener("click", () => {
        hidden = !hidden;
        hidden ? hide() : show();
    });
})();

import App from "../Applications/Components/Options";

render(<App />, document.querySelector("main#app"));

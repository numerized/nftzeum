import { r as registerInstance, h } from './index-341669be.js';

const appRootCss = "";

const AppRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("ion-app", null, h("ion-router", { useHash: false }, h("ion-route", { url: "/", component: "app-home" }), h("ion-route", { url: "/profile/:name", component: "app-profile" }), h("ion-route", { url: "/gallery", component: "app-gallery" }), h("ion-route", { url: "/aframe", component: "app-aframe-museum" })), h("ion-nav", null)));
  }
};
AppRoot.style = appRootCss;

export { AppRoot as app_root };

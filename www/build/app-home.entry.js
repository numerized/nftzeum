import { r as registerInstance, h } from './index-c2c2ebef.js';

const appHomeCss = "";

const AppHome = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [
      h("ion-header", null, h("ion-toolbar", { color: "primary" }, h("ion-title", null, "Home"))),
      h("ion-content", { class: "ion-padding" }, h("safe-moon-cycle", null)),
    ];
  }
};
AppHome.style = appHomeCss;

export { AppHome as app_home };

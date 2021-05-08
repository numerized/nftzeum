import { r as registerInstance, h } from './index-341669be.js';

function sayHello() {
  return Math.random() < 0.5 ? 'Hello' : 'Hola';
}

const appProfileCss = "";

const AppProfile = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.state = false;
  }
  formattedName() {
    if (this.name) {
      return this.name.substr(0, 1).toUpperCase() + this.name.substr(1).toLowerCase();
    }
    return '';
  }
  render() {
    return [
      h("ion-header", null, h("ion-toolbar", { color: "primary" }, h("ion-buttons", { slot: "start" }, h("ion-back-button", { defaultHref: "/" })), h("ion-title", null, "Profile: ", this.name))),
      h("ion-content", { class: "ion-padding" }, h("p", null, sayHello(), "! My name is ", this.formattedName(), ". My name was passed in through a route param!"), h("ion-item", null, h("ion-label", null, "Setting (", this.state.toString(), ")"), h("ion-toggle", { checked: this.state, onIonChange: ev => (this.state = ev.detail.checked) }))),
    ];
  }
};
AppProfile.style = appProfileCss;

export { AppProfile as app_profile };

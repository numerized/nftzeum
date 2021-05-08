import { r as registerInstance, h } from './index-341669be.js';
import { c as createCommonjsModule, b as getDefaultExportFromCjs, C as CovalentAPI } from './_commonjsHelpers-54585025.js';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var asyncToGenerator = _asyncToGenerator;

var dynamic = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _asyncToGenerator = _interopDefault(asyncToGenerator);

/**
 * Copyright (c) 2019 Emilio Almansi. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */

/**
 * Error thrown by setIntervalAsync when invalid arguments are provided.
 */
class SetIntervalAsyncError extends Error {}

Object.defineProperty(SetIntervalAsyncError.prototype, 'name', {
  value: 'SetIntervalAsyncError'
});

/**
 * Copyright (c) 2019-2021 Emilio Almansi. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */
const MIN_INTERVAL_MS = 10;
/**
 * @private
 *
 * @param {function} handler - Handler function to be executed in intervals.<br>
 *                             May be asynchronous.
 */

function validateHandler(handler) {
  if (!(typeof handler === 'function')) {
    throw new SetIntervalAsyncError('Invalid argument: "handler". Expected a function.');
  }
}
/**
 * @private
 *
 * @param {number} interval - Interval in milliseconds. Must be at least 10 ms.
 */

function validateInterval(interval) {
  if (!(typeof interval === 'number' && MIN_INTERVAL_MS <= interval)) {
    throw new SetIntervalAsyncError(`Invalid argument: "interval". Expected a number greater than or equal to ${MIN_INTERVAL_MS}.`);
  }
}
/**
 * @private
 *
 * @param {SetIntervalAsyncTimer} timer
 */

function validateTimer(timer) {
  if (!(timer && 'stopped' in timer && 'timeouts' in timer && 'promises' in timer)) {
    throw new SetIntervalAsyncError('Invalid argument: "timer". Expected an instance of SetIntervalAsyncTimer.');
  }
}

/**
 * Stops an execution cycle started by setIntervalAsync.<br>
 * Any ongoing function executions will run until completion,
 * but all future ones will be cancelled.
 *
 * @param {SetIntervalAsyncTimer} timer
 * @returns {Promise}
 *          A promise which resolves when all pending executions have finished.
 */

function clearIntervalAsync(_x) {
  return _clearIntervalAsync.apply(this, arguments);
}

function _clearIntervalAsync() {
  _clearIntervalAsync = _asyncToGenerator(function* (timer) {
    validateTimer(timer);
    timer.stopped = true;

    for (const iterationId in timer.timeouts) {
      clearTimeout(timer.timeouts[iterationId]);
      delete timer.timeouts[iterationId];
    }

    for (const iterationId in timer.promises) {
      try {
        yield timer.promises[iterationId];
      } catch (_) {// Do nothing.
      }

      delete timer.promises[iterationId];
    }
  });
  return _clearIntervalAsync.apply(this, arguments);
}

/**
 * Copyright (c) 2019 Emilio Almansi. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */

/**
 * Timer object returned by setIntervalAsync.<br>
 * Can be used together with {@link clearIntervalAsync} to stop execution.
 */
class SetIntervalAsyncTimer {
  constructor() {
    this.stopped = false;
    this.timeouts = {};
    this.promises = {};
  }

}

/**
 * Copyright (c) 2021 Emilio Almansi. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */

/**
 * @private
 *
 * @param {SetIntervalAsyncTimer} timer
 */
function getNextIterationId(iterationId) {
  if (iterationId === Number.MAX_SAFE_INTEGER) {
    return 0;
  }

  return iterationId + 1;
}
/**
 * @private
 */

function noop() {
  return _noop.apply(this, arguments);
}

function _noop() {
  _noop = _asyncToGenerator(function* () {});
  return _noop.apply(this, arguments);
}

/**
 * Attempts to execute the given handler at regular intervals, while preventing<br>
 * multiple concurrent executions. The handler will never be executed concurrently<br>
 * more than once in any given moment. If the running time of any execution exceeds<br>
 * the desired interval, the following execution will be scheduled as soon as<br>
 * possible; ie. immediately after the previous execution concludes.
 *
 * @param {function} handler - Handler function to be executed in intervals.<br>
 *                             May be asynchronous.
 * @param {number} interval - Interval in milliseconds. Must be at least 10 ms.
 * @param {...*} args - Any number of arguments to pass on to the handler.
 * @returns {SetIntervalAsyncTimer}
 *          A timer object which can be used to stop execution with {@link clearIntervalAsync}.
 *
 * @alias [Dynamic] setIntervalAsync
 */

function setIntervalAsync(handler, interval, ...args) {
  validateHandler(handler);
  validateInterval(interval);
  const timer = new SetIntervalAsyncTimer();
  const iterationId = 0;
  timer.timeouts[iterationId] = setTimeout(timeoutHandler, interval, timer, iterationId, handler, interval, ...args);
  return timer;
}
/**
 * @private
 *
 * @param {SetIntervalAsyncTimer} timer
 * @param {number} iterationId
 * @param {function} handler
 * @param {number} interval
 * @param {...*} args
 */


function timeoutHandler(timer, iterationId, handler, interval, ...args) {
  delete timer.timeouts[iterationId];
  timer.promises[iterationId] = runHandler(timer, iterationId, handler, interval, ...args);
}
/**
 * @private
 *
 * @param {SetIntervalAsyncTimer} timer
 * @param {number} iterationId
 * @param {function} handler
 * @param {number} interval
 * @param {...*} args
 */


function runHandler(_x, _x2, _x3, _x4) {
  return _runHandler.apply(this, arguments);
}

function _runHandler() {
  _runHandler = _asyncToGenerator(function* (timer, iterationId, handler, interval, ...args) {
    // The next line ensures that timer.promises[iterationId] is set
    // before running the handler.
    yield noop();
    const startTime = new Date();

    try {
      yield handler(...args);
    } finally {
      if (!timer.stopped) {
        const endTime = new Date();
        const executionTime = endTime - startTime;
        const timeout = interval > executionTime ? interval - executionTime : 0;
        const nextIterationId = getNextIterationId(iterationId);
        timer.timeouts[nextIterationId] = setTimeout(timeoutHandler, timeout, timer, nextIterationId, handler, interval, ...args);
      }

      delete timer.promises[iterationId];
    }
  });
  return _runHandler.apply(this, arguments);
}

exports.SetIntervalAsyncError = SetIntervalAsyncError;
exports.SetIntervalAsyncTimer = SetIntervalAsyncTimer;
exports.clearIntervalAsync = clearIntervalAsync;
exports.setIntervalAsync = setIntervalAsync;
//# sourceMappingURL=index.js.map
});

const index = /*@__PURE__*/getDefaultExportFromCjs(dynamic);

const appHomeCss = "";

const AppHome = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.holdersCount = 1300000;
    this.safemoonInfos = null;
    this.safemoonTxs = [];
    this.safemoonBalance = 0;
    this.safemoonWallet = null;
    this.safemoonFarmed = null;
    this.account = null;
  }
  async componentDidLoad() {
    if (window['ethereum']) {
      await window['ethereum'].enable();
    }
    console.log('metamask', this.isMetaMaskInstalled());
    console.log('accounts', this.getMetamaskAccounts());
    this.coingeckoTokenInfos();
    this.account = await this.getMetamaskAccounts();
    let tokenBalances = await CovalentAPI.getTokenBalances(this.account, 56, true);
    this.safemoonWallet = tokenBalances.data.items.filter(item => item.contract_name === 'SafeMoon')[0];
    this.safemoonWallet.decimal_balance = this.safemoonWallet.balance / Math.pow(10, this.safemoonWallet.contract_decimals);
    let safemoonTxsResponse = await this.request(`https://api.covalenthq.com/v1/56/address/${this.account}/transactions_v2/`);
    console.log(safemoonTxsResponse);
    safemoonTxsResponse.data.items.forEach(item => {
      item.log_events.forEach(element => {
        if (element.sender_address === '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3' && element.decoded.name === 'Transfer') {
          this.safemoonTxs.push(element);
        }
      });
    });
    this.safemoonTxs.forEach(tx => {
      if (tx.decoded.params[1].value === this.account.toLowerCase()) {
        this.safemoonBalance += Number(tx.decoded.params[2].value);
      }
      if (tx.decoded.params[0].value === this.account.toLowerCase()) {
        this.safemoonBalance -= Number(tx.decoded.params[2].value);
      }
    });
    this.safemoonBalance = this.safemoonBalance / Math.pow(10, this.safemoonWallet.contract_decimals);
    this.safemoonFarmed = this.safemoonWallet.decimal_balance - this.safemoonBalance;
    this.holdersCount = await CovalentAPI.getTokenHolders(1, 56);
    dynamic.setIntervalAsync(async () => {
      this.coingeckoTokenInfos();
      this.safemoonFarmed = this.safemoonWallet.decimal_balance - this.safemoonBalance;
      this.holdersCount = await CovalentAPI.getTokenHolders(1, 56);
    }, 60000 * 5);
  }
  async coingeckoTokenInfos() {
    let coingeckoSafemoonRequest = 'https://api.coingecko.com/api/v3/coins/safemoon';
    let safemoonInfosResponse = await this.request(coingeckoSafemoonRequest);
    this.safemoonInfos = safemoonInfosResponse;
  }
  async request(requestString) {
    let response = await fetch(requestString);
    return await response.json();
  }
  //Created check function to see if the MetaMask extension is installed
  isMetaMaskInstalled() {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(window['ethereum'] && window['ethereum'].isMetaMask);
  }
  async getMetamaskAccounts() {
    //we use eth_accounts because it returns a list of addresses owned by us.
    const accounts = await window['ethereum'].request({ method: 'eth_accounts' });
    console.log('accounts', accounts[0]);
    return accounts[0];
    //We take the first address in the array of addresses and display it
  }
  render() {
    return [
      // <ion-header>
      //   <ion-toolbar color="primary">
      //     <ion-title>Home</ion-title>
      //   </ion-toolbar>
      // </ion-header>,
      h("ion-content", { class: "ion-padding bg-class center-container" }, h("br", null), h("safe-moon-cycle", { class: "center-container" }), h("br", null), this.safemoonBalance && h("h1", { class: "safemoon-font center-container safemoon-color" }, this.safemoonWallet.decimal_balance.commarize()), h("h1", { class: "safemoon-font-2 center-container ion-text-center" }, "SafeMoon"), h("br", null), h("br", null), h("h6", { class: "safemoon-font-2 center-container ion-text-center" }, "holding reward"), this.safemoonFarmed && h("h2", { class: "safemoon-font center-container ion-text-center safemoon-color" }, this.safemoonFarmed.commarize()), h("br", null), h("br", null), h("h6", { class: "safemoon-font-2 center-container ion-text-center" }, "Price"), this.safemoonInfos && h("h2", { class: "safemoon-font center-container safemoon-color" }, this.safemoonInfos.market_data.current_price.usd, "$"), h("br", null), h("br", null), this.safemoonInfos && (h("span", null, h("h6", { class: "safemoon-font-2 center-container ion-text-center" }, "Price Change"), h("ion-row", null, h("ion-col", null, h("p", { class: "safemoon-font-2 center-container ion-text-center smaller" }, "24h"), h("p", { class: "safemoon-font safemoon-color center-container ion-text-center" }, this.safemoonInfos.market_data.price_change_percentage_24h.toFixed(1), "%")), h("ion-col", null, h("p", { class: "safemoon-font-2 center-container ion-text-center smaller" }, "7d"), h("p", { class: "safemoon-font safemoon-color center-container ion-text-center" }, this.safemoonInfos.market_data.price_change_percentage_7d.toFixed(1), "%")), h("ion-col", null, h("p", { class: "safemoon-font-2 center-container ion-text-center smaller" }, "14d"), h("p", { class: "safemoon-font safemoon-color center-container ion-text-center" }, this.safemoonInfos.market_data.price_change_percentage_14d.toFixed(1), "%")), h("ion-col", null, h("p", { class: "safemoon-font-2 center-container ion-text-center smaller" }, "30d"), h("p", { class: "safemoon-font safemoon-color center-container ion-text-center" }, this.safemoonInfos.market_data.price_change_percentage_30d.toFixed(1), "%"))))), h("br", null), h("br", null), h("h6", { class: "safemoon-font-2 center-container ion-text-center" }, "Holders"), this.holdersCount && h("h2", { class: "safemoon-font center-container safemoon-color" }, this.holdersCount.commarize())),
      h("ion-footer", { class: "ion-no-border" }, h("ion-toolbar", null, h("ion-buttons", { slot: "start" }, h("ion-button", { slot: "start" }, h("ion-icon", { slot: "icon-only", name: "caret-forward-outline" }))), h("ion-buttons", { slot: "end" }, h("ion-button", null, h("ion-icon", { slot: "icon-only", name: "radio-outline" }))), h("ion-title", null, "Artist - Title"))),
    ];
  }
};
function commarize() {
  // 1e6 = 1 Million, begin with number to word after 1e6.
  if (this >= 1e6) {
    var units = [
      'Million',
      'Billion',
      'Trillion',
      'Quadrillion',
      'Quintillion',
      'Sextillion',
      'Septillion',
      'Octillion',
      // ... Put others here, you can look them up here:
      // http://bmanolov.free.fr/numbers_names.php
      // If you prefer to automate the set of numbers, look at the number vocabulary:
      // https://gist.github.com/MartinMuzatko/1b468b7596c71e83838c
      // Javascript allows plain numbers to a maximum of ~1.79e308
    ];
    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    var unit = Math.floor((this / 1000).toFixed(0).toString().length);
    const unitfactor = '1e' + (unit + 2);
    // Calculate the remainder. 1,000,000 = 1.000 Mill
    var num = (this / unitfactor).toFixed(3);
    var unitname = units[Math.floor(unit / 3) - 1];
    // output number remainder + unitname
    return num + ' ' + unitname;
  }
  // Split floating number
  var parts = this.toString().split('.');
  // Only manipulate first part (not the float number)
  // If you prefer europe style numbers, you can replace . with ,
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
// Add method to prototype. this allows you to use this function on numbers and strings directly
Number.prototype['commarize'] = commarize;
String.prototype['commarize'] = commarize;
AppHome.style = appHomeCss;

export { AppHome as app_home };

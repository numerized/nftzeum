import { Component, h, State } from '@stencil/core';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import { CovalentAPI } from '../../services/covalent-api';

const WALLET = '0x796fc008cC6c051D84C9D5A7181DD5F0153AbA2c';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  @State() holdersCount: any = 1300000;
  @State() safemoonInfos: any = null;
  @State() safemoonTxs: any = [];
  @State() safemoonBalance: any = 0;
  @State() safemoonWallet: any = null;
  @State() safemoonFarmed: any = null;

  async componentDidLoad() {
    this.coingeckoTokenInfos();

    let tokenBalances = await CovalentAPI.getTokenBalances(WALLET);
    this.safemoonWallet = tokenBalances.data.items.filter(item => item.contract_name === 'SafeMoon')[0];
    this.safemoonWallet.decimal_balance = this.safemoonWallet.balance / Math.pow(10, this.safemoonWallet.contract_decimals);

    let safemoonTxsResponse = await this.request('https://api.covalenthq.com/v1/56/address/0x796fc008cC6c051D84C9D5A7181DD5F0153AbA2c/transactions_v2/');
    console.log(safemoonTxsResponse);

    safemoonTxsResponse.data.items.forEach(item => {
      item.log_events.forEach(element => {
        if (element.sender_address === '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3' && element.decoded.name === 'Transfer') {
          this.safemoonTxs.push(element);
        }
      });
    });

    this.safemoonTxs.forEach(tx => {
      if (tx.decoded.params[1].value === WALLET.toLowerCase()) {
        this.safemoonBalance += Number(tx.decoded.params[2].value);
      }
      if (tx.decoded.params[0].value === WALLET.toLowerCase()) {
        this.safemoonBalance -= Number(tx.decoded.params[2].value);
      }
    });

    this.safemoonBalance = this.safemoonBalance / 1000000000;
    this.safemoonFarmed = this.safemoonWallet.decimal_balance - this.safemoonBalance;

    this.holdersCount = await CovalentAPI.getTokenHolders(1);

    setIntervalAsync(async () => {
      this.coingeckoTokenInfos();
      this.safemoonFarmed = this.safemoonWallet.decimal_balance - this.safemoonBalance;
      this.holdersCount = await CovalentAPI.getTokenHolders(1);
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

  render() {
    return [
      // <ion-header>
      //   <ion-toolbar color="primary">
      //     <ion-title>Home</ion-title>
      //   </ion-toolbar>
      // </ion-header>,

      <ion-content class="ion-padding bg-class center-container">
        <br />
        <safe-moon-cycle class="center-container" />
        <br />
        {this.safemoonBalance && <h1 class="safemoon-font center-container safemoon-color">{this.safemoonWallet.decimal_balance.commarize()}</h1>}
        <h1 class="safemoon-font-2 center-container ion-text-center">SafeMoon</h1>
        <br />
        <br />
        <h6 class="safemoon-font-2 center-container ion-text-center">holding reward</h6>
        {this.safemoonFarmed && <h2 class="safemoon-font center-container ion-text-center safemoon-color">{this.safemoonFarmed.commarize()}</h2>}
        <br />
        <br />
        <h6 class="safemoon-font-2 center-container ion-text-center">Price</h6>
        {this.safemoonInfos && <h2 class="safemoon-font center-container safemoon-color">{this.safemoonInfos.market_data.current_price.usd}$</h2>}
        <br />
        <br />
        {this.safemoonInfos && (
          <span>
            <h6 class="safemoon-font-2 center-container ion-text-center">Price Change</h6>
            <ion-row>
              <ion-col>
                <p class="safemoon-font-2 center-container ion-text-center smaller">24h</p>
                <p class="safemoon-font safemoon-color center-container ion-text-center">{this.safemoonInfos.market_data.price_change_percentage_24h.toFixed(1)}%</p>
              </ion-col>
              <ion-col>
                <p class="safemoon-font-2 center-container ion-text-center smaller">7d</p>
                <p class="safemoon-font safemoon-color center-container ion-text-center">{this.safemoonInfos.market_data.price_change_percentage_7d.toFixed(1)}%</p>
              </ion-col>
              <ion-col>
                <p class="safemoon-font-2 center-container ion-text-center smaller">14d</p>
                <p class="safemoon-font safemoon-color center-container ion-text-center">{this.safemoonInfos.market_data.price_change_percentage_14d.toFixed(1)}%</p>
              </ion-col>
              <ion-col>
                <p class="safemoon-font-2 center-container ion-text-center smaller">30d</p>
                <p class="safemoon-font safemoon-color center-container ion-text-center">{this.safemoonInfos.market_data.price_change_percentage_30d.toFixed(1)}%</p>
              </ion-col>
            </ion-row>
          </span>
        )}
        <br />
        <br />
        <h6 class="safemoon-font-2 center-container ion-text-center">Holders</h6>
        {this.holdersCount && <h2 class="safemoon-font center-container safemoon-color">{this.holdersCount.commarize()}</h2>}
        {/* "price_change_24h": -6e-7,
    "price_change_percentage_24h": -11.43456,
    "price_change_percentage_7d": -19.41795,
    "price_change_percentage_14d": 537.90819,
    "price_change_percentage_30d": 1076.99463, */}
      </ion-content>,
    ];
  }
}

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
    var unit: any = Math.floor((this / 1000).toFixed(0).toString().length);

    const unitfactor: any = '1e' + (unit + 2);
    // Calculate the remainder. 1,000,000 = 1.000 Mill
    var num: any = (this / unitfactor).toFixed(3);
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

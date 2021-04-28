const BASE_URL = 'https://api.covalenthq.com/v1/';
const CHAIN_ID = 56;
const TOKEN_ID = '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3';
const API_KEY = 'ckey_79709e01a4a049a4aa31effc66e';

class CovalentAPIController {
  constructor() {}

  async request(requestString) {
    let response = await fetch(requestString);
    return await response.json();
  }

  async getTokenHolders(pageSize) {
    const TOKEN_HOLDERS = `tokens/${TOKEN_ID}/token_holders/?page-size=${pageSize}&format=json&key=${API_KEY}`;

    let requestString = `${BASE_URL}${CHAIN_ID}/${TOKEN_HOLDERS}`;
    let response = await this.request(requestString);
    return response.data.pagination.total_count;
  }

  async getTokenBalances(address) {
    const TOKEN_BALANCES = `address/${address}/balances_v2/?nft=true&format=json&key=${API_KEY}`;

    let requestString = `${BASE_URL}${CHAIN_ID}/${TOKEN_BALANCES}`;
    let response = await this.request(requestString);
    return response;
  }
}

export const CovalentAPI = new CovalentAPIController();

const BASE_URL = 'https://api.covalenthq.com/v1/';
const TOKEN_ID = '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3';
const API_KEY = 'ckey_79709e01a4a049a4aa31effc66e';

class CovalentAPIController {
  constructor() {}

  async request(requestString) {
    let response = await fetch(requestString);
    return await response.json();
  }

  async getTokenHolders(pageSize, chainId) {
    const TOKEN_HOLDERS = `tokens/${TOKEN_ID}/token_holders/?page-size=${pageSize}&format=json&key=${API_KEY}`;

    let requestString = `${BASE_URL}${chainId}/${TOKEN_HOLDERS}`;
    let response = await this.request(requestString);
    return response.data.pagination.total_count;
  }

  async getTokenBalances(address, chainId, noNftFetch) {
    const TOKEN_BALANCES = `address/${address}/balances_v2/?nft=true&no-nft-fetch=${noNftFetch}&format=json&key=${API_KEY}`;

    let requestString = `${BASE_URL}${chainId}/${TOKEN_BALANCES}`;
    let response = await this.request(requestString);
    return response;
  }
}

export const CovalentAPI = new CovalentAPIController();

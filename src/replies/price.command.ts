import {
  nftkeyInterestedCollectionsByFullName,
  tokenPairOneContracts,
} from '../constants';
import axios from 'axios';
import { NftkeyCollection } from '../types';

// global variables for caching
export let priceResponse = 'Fetching token prices...';
export let nftFloorResponse = '';

export const numMinutesCache = 1;

export interface PlotEarning {
  count: number;
  countListed: number;
  earningSpeed: number;
  floorPrice: number;
}

// cache every numMinutesCache in background (not upon query)
(async () => {
  while (true) {
    axios
      .all([
        axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=harmony&vs_currencies=usd'
        ),
        ...tokenPairOneContracts.map((tp) =>
          axios.get(
            `https://api.dexscreener.io/latest/dex/pairs/harmony/${tp.contract}`
          )
        ),
      ])
      .then((respArr) => {
        const priceONEperUSD: number = respArr[0].data['harmony']['usd'];

        let tokenResponses = '';
        for (
          let tpIndex = 0;
          tpIndex < tokenPairOneContracts.length;
          tpIndex++
        ) {
          const tp = tokenPairOneContracts[tpIndex];
          const pairData = respArr[tpIndex + 1].data['pair'];

          tokenResponses += `1 ${tp.name} \\= **${pairData['priceNative']} ONE** \\= **$${pairData['priceUsd']}** (${pairData['priceChange']['h24']}% last 24h)\n`;
        }

        priceResponse = `
1 ONE \\= **$${priceONEperUSD.toFixed(3)}**
${tokenResponses}`.trim();
      })
      .catch((err) => {
        console.log('internal pricing error', err);
      });

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 60 * numMinutesCache)
    );
  }
})();

// nftkey floor price
(async () => {
  while (true) {
    let tempNftFloorResponse = '';
    const nftkeyGraphqlEndpoint = 'https://nftkey.app/graphql';
    const nftkeyQuery =
      'query GetERC721Collections {\n  erc721Collections {\n    name\n  floor\n  }\n}\n';

    try {
      const res = await axios.post(nftkeyGraphqlEndpoint, {
        operationName: 'GetERC721Collections',
        variables: {},
        query: nftkeyQuery,
      });

      const respData = await res.data;
      if (
        respData['data'] &&
        respData['data']['erc721Collections'] &&
        respData['data']['erc721Collections'].length > 0
      ) {
        const collectionsData: NftkeyCollection[] =
          respData['data']['erc721Collections'];

        for (const c of collectionsData) {
          const { name, floor } = c;
          if (nftkeyInterestedCollectionsByFullName.includes(name)) {
            tempNftFloorResponse += `${name} floor: **${floor} ONE**\n`;
          }
        }
      }

      nftFloorResponse = tempNftFloorResponse;
    } catch (error) {
      console.log('nftkey error', error);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 60 * numMinutesCache)
    );
  }
})();

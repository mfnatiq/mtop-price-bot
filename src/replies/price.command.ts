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
          'https://api.coingecko.com/api/v3/simple/price?ids=harmony&vs_currencies=usd&include_24hr_change=true'
        ),
        ...tokenPairOneContracts.map((tp) =>
          axios.get(
            `https://api.dexscreener.io/latest/dex/pairs/harmony/${tp.pairContract}`
          )
        ),
      ])
      .then((respArr) => {
        const priceONEperUSD: number = respArr[0].data['harmony']['usd'];
        const priceChangeONEperUSD: number =
          respArr[0].data['harmony']['usd_24h_change'];

        // const tokenResponses: string[] = [];
        const tokenGainers: string[] = [];
        const tokenLosers: string[] = [];
        const tokenNoChange: string[] = [];
        for (
          let tpIndex = 0;
          tpIndex < tokenPairOneContracts.length;
          tpIndex++
        ) {
          const tp = tokenPairOneContracts[tpIndex];
          const pairData = respArr[tpIndex + 1].data['pair'];

          try {
            const priceChange: number = pairData['priceChange']['h24'];

            const tokenDataDisplayNo24hChange = `1 ${tp.name} \\= **${pairData['priceNative']} ONE** \\= **$${pairData['priceUsd']}**`;
            const tokenDataDisplayNo24hChangeWithSwap = `${tokenDataDisplayNo24hChange} ([swap](${tp.swap}))`;
            const tokenDataDisplay = `${tokenDataDisplayNo24hChange} (${priceChange}% last 24h, [swap](${tp.swap}))`;
            if (priceChange > 0) {
              tokenGainers.push(tokenDataDisplay);
            } else if (priceChange < 0) {
              tokenLosers.push(tokenDataDisplay);
            } else {
              tokenNoChange.push(tokenDataDisplayNo24hChangeWithSwap);
            }
          } catch (tokenErr) {
            console.log('error fetching dexscreener data for', tp, pairData);
          }
        }

        priceResponse = `**Last Updated:** <t:${Math.floor(new Date().getTime() / 1000).toString()}>

1 ONE \\= **$${priceONEperUSD.toFixed(3)}** (${priceChangeONEperUSD.toFixed(
          2
        )}% last 24h)
${
  tokenGainers.length > 0
    ? `\n**GAINERS:**
${tokenGainers.sort((a, b) => a.localeCompare(b)).join('\n')}`
    : ''
}
${
  tokenLosers.length > 0
    ? `\n**LOSERS:**
${tokenLosers.sort((a, b) => a.localeCompare(b)).join('\n')}`
    : ''
}
${
  tokenNoChange.length > 0
    ? `\n**NO CHANGE LAST 24H:**
${tokenNoChange.sort((a, b) => a.localeCompare(b)).join('\n')}`
    : ''
}

`.trim();
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
    let tempNftFloorResponse: string[] = [];
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
            tempNftFloorResponse.push(`${name} floor: **${floor} ONE**`);
          }
        }
      }

      nftFloorResponse = `**Last Updated:**  <t:${Math.floor(new Date().getTime() / 1000).toString()}>

${tempNftFloorResponse.sort((a, b) => a.localeCompare(b)).join('\n')}`;
    } catch (error) {
      console.log('nftkey error', error);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 60 * numMinutesCache)
    );
  }
})();

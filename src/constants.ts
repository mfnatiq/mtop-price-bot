import { TokenPairContractWithName } from './types';

// note that "contract" is the important field; "name" is for display purposes only
export const tokenPairOneContracts: TokenPairContractWithName[] = [
  {
    name: 'MTOP',
    contract: '0x36a7e3028277899f18d595933316510b94acac3a',
  },
  {
    name: 'JEWEL',
    contract: '0xeb579ddcd49a7beb3f205c9ff6006bb6390f138f',
  },
  {
    name: 'HVILLE',
    contract: '0x63cd1cd3e3b5475ccf095b4dd1f7199dc77f5d1e',
  },
  {
    name: 'CLNY',
    contract: '0xcd818813f038a4d1a27c84d24d74bbc21551fa83',
  },
  {
    name: 'OIL',
    contract: '0xc60ed49b9ac4ec55b56956d9a0b2611a3b683954',
  },
  {
    name: 'EVO',
    contract: '0xd6e76742962379e234e9fd4e73768cef779f38b5',
  },
  {
    name: 'STAR',
    contract: '0x1e35802a66f5346b350ab10169cc7868dcd0c32d',
  },
  {
    name: 'FIRA',
    contract: '0x08de72c31ecf51dda637624d1e767578d1914dca',
  },
  {
    name: 'TRANQ',
    contract: '0xb91945e55bb4ff672ace118179cfdf281877bf35',
  },
  {
    name: 'KNIGHT',
    contract: '0x772b8b924d197108c5cc9483dc7bfd7a15a0a513',
  },
  {
    name: 'ROY',
    contract: '0x4db87db6eadb02c5612eb4cf522d8188fb80a9ad',
  },
  {
    name: 'GRAV',
    contract: '0x839ec337c1028ad48d21181ad09aec620c563f89',
  },
  {
    name: 'FOX',
    contract: '0x670240cd8f514ebad7e375ecba7e9e6b761e893a',
  },
  {
    name: 'COINKX',
    contract: '0x2106d0b3de14dfe921e79a203037acbd0de2c1d5',
  },
  {
    name: 'FUNDS',
    contract: '0x34bba7f4a1fe053b92f59de9501ea051693b81c1',
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const nftkeyInterestedCollectionsByFullName = [
  'MarsColony',
  'Moon Robots Eggs',
  'Martian Colonists',
  'Knights and Peasants',
  'Rocket Monsters Star Fighter',
  'WenLamboNFT',
  'Moon Robots Items',
  'Tranquility City Houses',
  'Knights and Peasants',
  'Cosmic Wizards',
  'Cosmic Wizards 3D',
  'Hello Gophers',
  'Puffs',
  'HarmonyWorld',
  'Chibi Cats',
  'DeFi: The Gods!',
  'CryptoPigs',
  'Lost Samurais Whitelist',
];

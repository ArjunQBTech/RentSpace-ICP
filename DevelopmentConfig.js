//Decides if canister ids used are of production or development
const production = false;

export const host = production ? 'https://icp-api.io' : 'http://127.0.0.1:4943';

export const nodeBackend = production
  // ? 'https://rentspace.kaifoundry.com'
  ? 'http://209.38.36.2:5000'
  : 'http://localhost:5000';


export const payPalUrl = 'https://api-m.sandbox.paypal.com';

export const ids = {
  userCan: production
    ? 'ttotv-cyaaa-aaaao-a3o2a-cai'
    : 'a3shf-5eaaa-aaaaa-qaafa-cai', // rajnish
  // :"avqkn-guaaa-aaaaa-qaaea-cai", // atharva

  hotelCan: production
    ? 'tilpq-yaaaa-aaaao-a3oyq-cai'
    : 'b77ix-eeaaa-aaaaa-qaada-cai', // rajnish
  // :"br5f7-7uaaa-aaaaa-qaaca-cai", // atharva

  backendCan: production
    ? '5cjoy-nqaaa-aaaan-qlqsa-cai'
    : 'be2us-64aaa-aaaaa-qaabq-cai',
  reviewCan: production
    ? 'tbiem-oiaaa-aaaao-a3oza-cai'
    : 'avqkn-guaaa-aaaaa-qaaea-cai', // rajnish
  // :"b77ix-eeaaa-aaaaa-qaada-cai", // atharva
  bookingCan: production
    ? 'rsxhm-gqaaa-aaaao-a3oxq-cai'
    : 'br5f7-7uaaa-aaaaa-qaaca-cai', // rajnish
  // :"bd3sg-teaaa-aaaaa-qaaba-cai", // atharva
  ICPtokenCan: production
    ? 'ryjl3-tyaaa-aaaaa-aaaba-cai'
    : 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  ckBTCtokenCan: production
    ? 'mxzaz-hqaaa-aaaar-qaada-cai'
    : 'mxzaz-hqaaa-aaaar-qaada-cai',
  ckETHtokenCan: production
    ? 'ss2fx-dyaaa-aaaar-qacoq-cai'
    : 'ss2fx-dyaaa-aaaar-qacoq-cai',
  commentCan: production
    ? 'tpkje-vyaaa-aaaao-a3oya-cai'
    : 'bw4dl-smaaa-aaaaa-qaacq-cai', // rajnish
  // :"be2us-64aaa-aaaaa-qaabq-cai", // atharva
  supportCan: production
    ? 'tgjcy-dqaaa-aaaao-a3ozq-cai'
    : 'asrmz-lmaaa-aaaaa-qaaeq-cai', // rajnish
  // :"by6od-j4aaa-aaaaa-qaadq-cai", // atharva
};

// {
//     "Review": {
//       "ic": "wdm7v-zaaaa-aaaan-qlwsq-cai"
//     },
//     "User": {
//       "ic": "wenzb-uyaaa-aaaan-qlwsa-cai"
//     },
//     "backend": {
//       "ic": "5cjoy-nqaaa-aaaan-qlqsa-cai"
//     },
//     "comment": {
//       "ic": "wnos5-cqaaa-aaaan-qlwtq-cai"
//     },
//     "hotel": {
//       "ic": "wkpuj-piaaa-aaaan-qlwta-cai"
//     },
//     "supportChat": {
//       "ic": "xaawt-nyaaa-aaaan-qlwua-cai"
//     }
//   }
// https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=xhbqh-aaaaa-aaaan-qlwuq-cai--> bookingcan

//Decides if canister ids used are of production or development
const production = false;

export const host = production ? 'https://icp-api.io' : 'http://127.0.0.1:4943';

export const nodeBackend = production
  ? 'https://rentspace.kaifoundry.com'
  // : 'http://localhost:5000';
  : 'https://3ced-2401-4900-5998-4b0f-b048-6038-2d53-f59d.ngrok-free.app'


export const payPalUrl = 'https://api-m.sandbox.paypal.com';

export const ids = {
  userCan: production
    ? 'ttotv-cyaaa-aaaao-a3o2a-cai'
    // : 'by6od-j4aaa-aaaaa-qaadq-cai', // rajnish
  // :"avqkn-guaaa-aaaaa-qaaea-cai", // atharva
  : 'ajuq4-ruaaa-aaaaa-qaaga-cai', // Arjun

  hotelCan: production
    ? 'tilpq-yaaaa-aaaao-a3oyq-cai'
    // : 'be2us-64aaa-aaaaa-qaabq-cai', // rajnish
  // :"br5f7-7uaaa-aaaaa-qaaca-cai", // atharva
  : 'aax3a-h4aaa-aaaaa-qaahq-cai', // Arjun

  backendCan: production
    ? '5cjoy-nqaaa-aaaan-qlqsa-cai'
    : 'be2us-64aaa-aaaaa-qaabq-cai',
  reviewCan: production
    ? 'tbiem-oiaaa-aaaao-a3oza-cai'
    // : 'bw4dl-smaaa-aaaaa-qaacq-cai', // rajnish
  // :"b77ix-eeaaa-aaaaa-qaada-cai", // atharva
  : 'ahw5u-keaaa-aaaaa-qaaha-cai',   // Arjun
  bookingCan: production
    ? 'rsxhm-gqaaa-aaaao-a3oxq-cai'
    // : 'bkyz2-fmaaa-aaaaa-qaaaq-cai', // rajnish
  // :"bd3sg-teaaa-aaaaa-qaaba-cai", // atharva
  : 'c2lt4-zmaaa-aaaaa-qaaiq-cai',
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
    // : 'bd3sg-teaaa-aaaaa-qaaba-cai', // rajnish
  // :"be2us-64aaa-aaaaa-qaabq-cai", // atharva
  :'c5kvi-uuaaa-aaaaa-qaaia-cai',
  supportCan: production
    ? 'tgjcy-dqaaa-aaaao-a3ozq-cai'
    // : 'b77ix-eeaaa-aaaaa-qaada-cai', // rajnish
  // :"by6od-j4aaa-aaaaa-qaadq-cai", // atharva
  :'a4tbr-q4aaa-aaaaa-qaafq-cai',
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

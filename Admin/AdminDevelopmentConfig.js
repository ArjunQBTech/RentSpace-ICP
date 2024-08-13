//Decides if canister ids used are of production or development
const production = false;

export const host = production ? 'https://icp-api.io' : 'http://127.0.0.1:4943';

export const ids = {
  userCan: production
    ? 'ttotv-cyaaa-aaaao-a3o2a-cai'
    // : 'by6od-j4aaa-aaaaa-qaadq-cai', // rajnish
    // :"avqkn-guaaa-aaaaa-qaaea-cai", // atharva
    : "ajuq4-ruaaa-aaaaa-qaaga-cai",   // Arjun

  hotelCan: production
    ? 'tilpq-yaaaa-aaaao-a3oyq-cai'
    // : 'be2us-64aaa-aaaaa-qaabq-cai', // rajnish
    // :"br5f7-7uaaa-aaaaa-qaaca-cai", // atharva
    :"aax3a-h4aaa-aaaaa-qaahq-cai",  // Arjun
  bookingCan: production
    ? 'rsxhm-gqaaa-aaaao-a3oxq-cai'
    // : 'bkyz2-fmaaa-aaaaa-qaaaq-cai', // rajnish
    // :"bd3sg-teaaa-aaaaa-qaaba-cai", // atharva
      : "c2lt4-zmaaa-aaaaa-qaaiq-cai",   // Arjun
  supportCan: production
    ? 'tgjcy-dqaaa-aaaao-a3ozq-cai'
    // : 'b77ix-eeaaa-aaaaa-qaada-cai', // rajnish
    // :"by6od-j4aaa-aaaaa-qaadq-cai", // atharva
    : "a4tbr-q4aaa-aaaaa-qaafq-cai" // Arjun
    ,
    reviewCan : production ? 'tbiem-oiaaa-aaaao-a3oza-ca' // Mainnet
    : 'ahw5u-keaaa-aaaaa-qaaha-cai' // Arjun
}
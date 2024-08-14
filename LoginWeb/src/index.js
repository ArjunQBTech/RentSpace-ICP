import {backend, createActor} from '../../src/declarations/backend/index';
import {AuthClient} from '@dfinity/auth-client';
import {HttpAgent, fromHex} from '@dfinity/agent';
import {
  DelegationIdentity,
  Ed25519PublicKey,
  ECDSAKeyIdentity,
  DelegationChain,
} from '@dfinity/identity';

let actor = backend;
var url = new URL(window.location.href);
let authClient;
// One day in nanoseconds
const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);
const numDays = BigInt(5); // number of days delegation is valid for
// Get the search parameters from the URL
var params = new URLSearchParams(url.search);

const loginButton = document.getElementById('login');
loginButton.onclick = async e => {
  e.preventDefault();

  //   var middleKeyIdentity = await ECDSAKeyIdentity.generate({extractable: true});
  let publicKey = params.get('publicKey');
  let newIdentity = new ECDSAKeyIdentity(
    {publicKey: fromHex(publicKey)},
    fromHex(publicKey),
    null,
  );
  authClient = await AuthClient.create({identity: newIdentity});
  await new Promise(resolve => {
    authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === 'ic'
          ? 'https://identity.ic0.app'
          : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,

      maxTimeToLive: days * hours * nanoseconds * numDays,
      onSuccess: resolve,
      onerror: e => {
        alert(e);
      }
    });
  });

  const identity = authClient.getIdentity();

  var delegationString = JSON.stringify(identity.getDelegation().toJSON());

  const encodedDelegation = encodeURIComponent(delegationString);

  loginButton.style.display = 'none';

  console.log(encodedDelegation);

  // const resp = await ECDSAKeyIdentity.generate

  // var url = `rentspace://auth?delegation=${encodedDelegation}`;
  // window.open(url, '_self');
  // const chain = DelegationChain.fromJSON(
  //   JSON.parse(decodeURIComponent(encodedDelegation)),
  // );
  // const middleIdentity = DelegationIdentity.fromDelegation(
  //   newIdentity,
  //   chain,
  // );
  // const agent = new HttpAgent({identity: middleIdentity});
  // const actor = createActor("be2us-64aaa-aaaaa-qaabq-cai",{agent});
  // const result = await actor.whoami()
  // console.log(result)

  console.log(identity.getPrincipal().toText());

  return false;
};

const redirectBtn = document.getElementById('open');
redirectBtn.onclick = () => {
  const identity = authClient.getIdentity();

  var delegationString = JSON.stringify(identity.getDelegation().toJSON());

  const encodedDelegation = encodeURIComponent(delegationString);

  var url = `rentspace://auth?delegation=${encodedDelegation}`;
  window.open(url, '_self');
  return false;
};

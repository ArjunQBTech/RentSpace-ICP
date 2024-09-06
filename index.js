/**
 * @format
 */
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import 'react-native-polyfill-globals/auto';
import 'react-native-fetch-api';
import 'fast-text-encoding';
import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Link, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState, useRef} from 'react';
import Main from './src/components/NavScreens/UserScreens/HotelsSearch/Main';
import BottomNav from './src/components/Navigation/BottomNav';
import Profile from './src/app/Profile';
import Store from './src/redux/store';
import {Provider} from 'react-redux';
import HostHome from './src/components/NavScreens/HostScreens/HostHome/HostHome';
import MenuPage from './src/components/NavScreens/HostScreens/MenuPage/MenuPage';
import Listings from './src/components/NavScreens/HostScreens/Listings/Listings';
import AllChats from './src/components/NavScreens/HostScreens/ChatPage/AllChats/AllChats';
import UserDetailDemo from './src/components/NavScreens/UserScreens/Profile/Modals/UserDetailDemo';
// import Map from './src/components/NavScreens/UserScreens/Map/Map';
import Reels from './src/components/NavScreens/UserScreens/Reels/Reels';
import {User} from './src/declarations/User';
import {Hotel} from './src/declarations/Hotel';
import {backend} from './src/declarations/backend';
import PolyfillCrypto from 'react-native-webview-crypto';
import {
  DelegationIdentity,
  Ed25519PublicKey,
  ECDSAKeyIdentity,
  DelegationChain,
} from '@dfinity/identity';
import {Actor, HttpAgent, toHex, fromHex} from '@dfinity/agent';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {createActor} from './src/declarations/backend';
import {createActor as createUserActor} from './src/declarations/User';
import {createActor as createHotelActor} from './src/declarations/Hotel/';
import {createActor as createBookingActor} from './src/declarations/Booking';
import {createActor as createReviewActor} from './src/declarations/Review';
import {createActor as createCommentActor} from './src/declarations/Comment';
import {createActor as createSupportActor} from './src/declarations/Support';
import store from './src/redux/store';
import {setActor} from './src/redux/actor/actions';
import {setPrinciple} from './src/redux/principle/actions';
import {setUser} from './src/redux/users/actions';
import ChatContainer from './src/components/NavScreens/UserScreens/ChatPage/ChatContainer/ChatContainer';
import {idlFactory} from './Backend/RentSpace_backend/wallet/legder.did';
import {createTokenActor} from './src/components/NavScreens/UserScreens/HotelsSearch/HotelDetails/BookingForm/utils/utils';
import {setAuthData} from './src/redux/authData/actions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {host, ids, nodeBackend} from './DevelopmentConfig';
import MainProfile from './src/components/NavScreens/UserScreens/Profile/MainProfile/MainProfile';
import HotelChoice from './src/components/NavScreens/HostScreens/Availibility/HotelChoice/HotelChoice';
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from 'react-native-alert-notification';
import {AlertThemes} from './src/constants/themes';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['rentspace://'],
};

// firebase.

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
  channelId: '1',
});

const RootComponent: React.FC = () => {
  const btmSheetLoginRef = useRef(null);
  const btmSheetFinishRef = useRef(null);
  const [middleKeyIdentity, setMiddleKeyIdentity] = useState('');

  async function delegationValidation(pubKey, priKey, delegation) {
    try {
      let publicKey = await crypto.subtle.importKey(
        'raw',
        Buffer.from(fromHex(pubKey)),
        {name: 'ECDSA', namedCurve: 'P-256'}, // Adjust the algorithm and curve as needed
        true, // Whether the key is extractable
        ['verify'],
      );
      // console.log("generateKey._keyPair.publicKey",publicKey)

      let privateKey = await crypto.subtle.importKey(
        'pkcs8',
        Buffer.from(fromHex(priKey)),
        {name: 'ECDSA', namedCurve: 'P-256'}, // Adjust the algorithm and curve as needed
        true, // Whether the key is extractable
        ['sign'],
      );
      console.log('generateKey._keyPair.privateKey', privateKey);
      let newKeyPair = await ECDSAKeyIdentity.fromKeyPair({
        privateKey,
        publicKey,
      });
      console.log('newKeyPair', toHex(newKeyPair.getPublicKey().toDer()));

      const Delchain = DelegationChain.fromJSON(
        JSON.parse(decodeURIComponent(delegation)),
      );
      console.log('chain', Delchain);
      const middleIdentity = DelegationIdentity.fromDelegation(
        newKeyPair,
        Delchain,
      );
      console.log('middleIdentity', middleIdentity);
      const agent = new HttpAgent({
        identity: middleIdentity,
        fetchOptions: {
          reactNative: {
            __nativeResponseType: 'base64',
          },
        },
        callOptions: {
          reactNative: {
            textStreaming: true,
          },
        },
        fetch,
        blsVerify: () => true,
        host: host,
        verifyQuerySignatures: false,
      });

      // console.log("agent",agent);

      newActor = createActor(ids.backendCan, {
        agent,
      });
      // console.log("actor",newActor);

      console.log('middleIdentityy', middleIdentity.getPrincipal().toString());

      let principal = await newActor?.whoami().catch(async err => {
        console.log(err);
        // await AsyncStorage.clear()
        console.log(err);
        // alert('no previous data found!')
      });
      console.log(`principal from del validation : ${principal}`);
      if (principal == '2vxsx-fae') {
        await AsyncStorage.clear();
      } else {
        btmSheetLoginRef.current.dismiss();
      }
      let actorUser = createUserActor(ids.userCan, {agent});
      let actorHotel = createHotelActor(ids.hotelCan, {agent});
      let actorBooking = createBookingActor(ids.bookingCan, {agent});
      let actorToken = Actor.createActor(idlFactory, {
        agent,
        blsVerify: () => true,
        canisterId: ids.tokenCan,
      });
      let actorReview = createReviewActor(ids.reviewCan, {agent});
      let actorComment = createCommentActor(ids.commentCan, {agent});
      // console.log("actor review : ",actorReview)
      store.dispatch(
        setActor({
          backendActor: newActor,
          userActor: actorUser,
          hotelActor: actorHotel,
          bookingActor: actorBooking,
          tokenActor: actorToken,
          reviewActor: actorReview,
          commentActor: actorComment,
        }),
      );

      store.dispatch(setPrinciple(principal));
      console.log('user', principal);

      await actorUser
        ?.getUserInfo()
        .then(res => {
          if (res[0]?.firstName != null) {
            store.dispatch(setUser(res[0]));
            btmSheetLoginRef.current.dismiss();
            // Alert.alert(`welcome`,`You are welcome again ${res[0]?.firstName}!`);
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'WELCOME',
              textBody: `You are welcome again ${res[0]?.firstName}!`,
              button: 'OK',
            });
          } else {
            // Alert.alert('Now please follow the registeration process!');
            Dialog.show({
              type: ALERT_TYPE.INFO,
              title: 'INFO',
              textBody: 'Now please follow the registeration process!',
              button: 'OK',
            });
            btmSheetLoginRef.current.dismiss();
            btmSheetFinishRef.current.present();
          }
        })
        .catch(err => console.error(err));
      console.log('principal from new login : ', principal);
    } catch (err) {
      console.log(err);
      // alert("No previous data found!")
    }
  }
  const storeInAsyncStorage = async (key, item) => {
    await AsyncStorage.setItem(key, item)
      .catch(err => {
        console.log(`Asyncstorage err set ietm : ${err}`);
      })
      .then(res => {
        console.log(`Response for setitem Async store : ${res}`);
      });
  };
  const getFromAsyncStore = async key => {
    let data;
    await AsyncStorage.getItem(key)
      .then(res => {
        data = res;
        console.log(`Async store get item res : ${res}`);
      })
      .catch(err => {
        console.log(`Async store get item err : ${err}`);
      });
    return data;
  };

  const generateIdentity = async () => {
    let p = new Promise(async (resolve, reject) => {
      await ECDSAKeyIdentity.generate({extractable: true})
        .then(async res => {
          setMiddleKeyIdentity(res);
          console.log('generate key:', res);
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

    return p;
  };

  let resp;

  const handleLogin = async setLoader => {
    const newDel = await getFromAsyncStore('delegation');
    const newPri = await getFromAsyncStore('prikey');
    const newpub = await getFromAsyncStore('pubkey');
    // delegationValidation(newpub,newPri,newDel)
    // console.log("stringified key iden : ",JSON.parse(JSON.stringify(await getFromAsyncStore("keyIden"))))

    await generateIdentity()
      .then(async res => {
        resp = res;
        console.log('running handle login', res);
        // console.log("ids : ",ids)
        try {
          Linking.addEventListener('url', handleDeepLink);
          // setTimeout(async () => {
          // const url = `https://xmzaw-5iaaa-aaaao-a3oda-cai.icp0.io?publicKey=${toHex(res.getPublicKey().toDer())}`;
          // const url = `http://127.0.0.1:4943/?canisterId=bw4dl-smaaa-aaaaa-qaacq-cai&publicKey=${toHex( // for atharva local
          const url = `http://127.0.0.1:4943/?canisterId=cbopz-duaaa-aaaaa-qaaka-cai&publicKey=${toHex(res.getPublicKey().toDer(), 
            // const url = `http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&publicKey=${toHex( // for rajnish local 
            //   res.getPublicKey().toDer(),
            )}`;
          if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: 'cancel',
              preferredBarTintColor: '#453AA4',
              preferredControlTintColor: 'white',
              readerMode: false,
              animated: true,
              modalPresentationStyle: 'fullScreen',
              modalTransitionStyle: 'coverVertical',
              modalEnabled: true,
              enableBarCollapsing: false,
              // Android Properties
              showTitle: true,
              // toolbarColor: '#6200EE',
              toolbarColor: 'black',
              secondaryToolbarColor: 'black',
              navigationBarColor: 'black',
              navigationBarDividerColor: 'white',
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
              animations: {
                startEnter: 'slide_in_right',
                startExit: 'slide_out_left',
                endEnter: 'slide_in_left',
                endExit: 'slide_out_right',
              },
              headers: {
                'my-custom-header': 'my custom header value',
              },
            });

            // AppState.addEventListener('change',handleDeepLink)
            // await this.sleep(800);
            // console.log(await Linking.getInitialURL())

            if (result.type === 'cancel') {
              console.log('User manually closed the browser.');
              setLoader(false); // Stop loader only if closed manually else it will be stopped in handleDeepLink function
            }
          } else {
            Linking.openURL(url);
            // alert('opening external link');
          }
          // }, 1000);
        } catch (error) {
          console.log(error);
          setLoader(false);
          // alert(error);
        }
      })
      .catch(err => {
        console.log("Err in 350 : ",err);
        // alert(err);
        setLoader(false);
      });
  };
  const handleDeepLink = async event => {
    // alert('inside handle deeplink')
    try {
      // alert('inside handle deeplink try')
      // let actor = backend;
      const deepLink = event.url;
      const urlObject = new URL(deepLink);
      const delegation = urlObject.searchParams.get('delegation');
      if (delegation == null) {
        console.log('no delegation');
        return;
      }
      console.log('del signature', delegation);
      // alert('Getting delegation')
      const chain = DelegationChain.fromJSON(
        JSON.parse(decodeURIComponent(delegation)),
      );
      const middleIdentity = DelegationIdentity.fromDelegation(resp, chain);
      console.log('identity : ', middleIdentity);
      const agent = new HttpAgent({
        identity: middleIdentity,
        fetchOptions: {
          reactNative: {
            __nativeResponseType: 'base64',
          },
        },
        callOptions: {
          reactNative: {
            textStreaming: true,
          },
        },
        blsVerify: () => true,
        verifyQuerySignatures: false,
        host: host,
      });
      await agent.fetchRootKey();
      //New Login through api

      // alert('ágent created')

      let pubKey = toHex(
        await crypto.subtle.exportKey(
          'raw',
          middleIdentity._inner._keyPair.publicKey,
        ),
      );
      let priKey = toHex(
        await crypto.subtle.exportKey(
          'pkcs8',
          middleIdentity._inner._keyPair.privateKey,
        ),
      );

      // delegationValidation(pubKey,priKey,delegation)

      //New Login through api end
      console.log(`new private : ${priKey}\n new public : ${pubKey}`);

      // alert('Retrieved keypair')

      let signObj;
      async function getSignObject() {
        const principalM = middleIdentity.getPrincipal().toString();
        const encoder = new TextEncoder();
        let message = encoder.encode(principalM);
        let publicKey = toHex(middleIdentity.getPublicKey().toDer());
        // let pubKey = await crypto.subtle.exportKey('raw', middleIdentity._inner._keyPair.publicKey);
        let signature;
        let pubKey = toHex(
          await crypto.subtle.exportKey(
            'raw',
            middleIdentity._inner._keyPair.publicKey,
          ),
        );
        let priKey = toHex(
          await crypto.subtle.exportKey(
            'pkcs8',
            middleIdentity._inner._keyPair.privateKey,
          ),
        );
        // await middleIdentity.sign(message).then((res)=>{
        //   signature=res
        //   console.log(`principal : ${principalM} \n public key : ${toHex(publicKey)} \n signature : ${toHex(signature)}`)
        // console.log({
        // privateKey:priKey,
        // publicKey:pubKey,
        // delegation:delegation
        // })
        signObj = {
          privateKey: priKey,
          publicKey: pubKey,
          delegation: delegation,
        };
        console.log(signObj);
        // }).catch((err)=>{console.log(err)})
      }
      // alert('try registering user')
      await getSignObject().then(async () => {
        console.log('getting sign obj : ', signObj);
        store.dispatch(setAuthData(signObj));
        // const baseUrl="http://localhost:5000"
        // alert('implementing chat register')
        // const baseUrl = 'https://rentspace.kaifoundry.com';
        const baseUrl = nodeBackend;
        await axios
          .post(
            `${baseUrl}/api/v1/register/user`,
            {},
            {
              headers: {
                'x-private': signObj.privateKey,
                'x-public': signObj.publicKey,
                'x-delegation': signObj.delegation,
              },
            },
          )
          .then(res => {
            console.log('chat register resp : ', res);
          })
          .catch(err => {
            console.log('chat register error : ', err);
            if (err?.response?.data?.error == 'User already exists') {
              console.log('chat user already exists!');
            } else {
              console.log('err resp : ', err);
            }
          });
      });
      console.log("Creating actor")
      // alert('craeting actor')
      let actorUser = createUserActor(ids.userCan, {agent});
      console.log("Actor User created", actorUser)
      let actorHotel = createHotelActor(ids.hotelCan, {agent});
      console.log("Actor Hotel created", actorHotel)
      let actorBooking = createBookingActor(ids.bookingCan, {agent});
      console.log("Actor Booking created", actorBooking)
      let actorICPToken = Actor.createActor(idlFactory, {
        agent,
        blsVerify: () => true,
        canisterId: ids.ICPtokenCan,
      });
      let actorCkBTCToken = Actor.createActor(idlFactory, {
        agent,
        blsVerify: () => true,
        canisterId: ids.ckBTCtokenCan,
      });
      let actorCkETHToken = Actor.createActor(idlFactory, {
        agent,
        blsVerify: () => true,
        canisterId: ids.ckETHtokenCan,
      });
      let actorReview = createReviewActor(ids.reviewCan, {agent});
      console.log("Actor Review created", actorReview)
      let actorComment = createCommentActor(ids.commentCan, {agent});
      console.log("Actor Comment created", actorComment)
      let actorSupport = createSupportActor(ids.supportCan, {agent});
      console.log("Actor Support created", actorSupport)
      // console.log("actor review : ",actorReview)
      console.log("Store :: ",store)
      store.dispatch(
        setActor({
          userActor: actorUser,
          hotelActor: actorHotel,
          bookingActor: actorBooking,
          icpTokenActor: actorICPToken,
          ckbtcTokenActor: actorCkBTCToken,
          ckETHtokenActor: actorCkETHToken,
          reviewActor: actorReview,
          commentActor: actorComment,
          supportActor: actorSupport,
        }),
      );

      // console.log("actor : ",actor)
      // alert('calling whoami')
      let whoami = await actorUser.whoami();
      store.dispatch(setPrinciple(whoami));
      console.log('user', whoami);
      console.log('ids : ', ids);
      storeInAsyncStorage('delegation', delegation);
      storeInAsyncStorage('keyIden', JSON.stringify(resp));
      storeInAsyncStorage('prikey', priKey);
      storeInAsyncStorage('pubkey', pubKey);

      console.log('Getting user data');
      setTimeout(async () => {
        await actorUser
          ?.getuserDetails()
          .then(res => {
            if (res?.ok?.firstName != null) {
              store.dispatch(setUser(res?.ok));
              btmSheetLoginRef.current.dismiss();
              // Alert.alert(`Welcome`,`You are welcome again ${res[0]?.firstName}!`);
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'WELCOME',
                textBody: `You are welcome again ${res?.ok?.firstName}!`,
                button: 'OK',
              });
            } else {
              // Alert.alert("Continue",'Now please follow the registeration process!');
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'CONTINUE',
                textBody: 'Now please follow the registeration process!',
                button: 'OK',
              });
              btmSheetLoginRef.current.dismiss();
              btmSheetFinishRef.current.present();
            }
          })
          .catch(err => {
            console.error("Err in 559 : ",err);
            // alert('got error while fetching user data');
          });
      }, 2000);

      // await AsyncStorage.setItem('user',JSON.stringify(middleIdentirfrty))
      //   .then((res)=>console.log('data stored successfully',middleIdentity))
      //   .catch((err)=>console.log(err))
      //   alert(whoami);
      // getUserData()
    } catch (err) {
      console.log("Err in 571 : ", err)
      //alert(err)
      setLoader(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'WARNING',
        textBody: err,
        button: 'OK',
      });
    }
  };

  return (
    <>
      <PolyfillCrypto />
      <Provider store={Store}>
        <AlertNotificationRoot colors={AlertThemes} theme="light">
          <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName="reels">
              <Stack.Screen
                options={{headerShown: false}}
                name="Launch"
                component={Main}
                initialParams={{
                  handleLogin,
                  btmSheetLoginRef,
                  btmSheetFinishRef,
                  delegationValidation,
                }}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="UserChat"
                component={ChatContainer}
                initialParams={{newChat: ''}}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="profile"
                component={MainProfile}
              />
              {/* <Stack.Screen
              options={{headerShown: false}}
              name="mapSearch"
              component={Map}
            /> */}
              <Stack.Screen
                options={{headerShown: false}}
                name="reels"
                component={Reels}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="hostHome"
                component={HostHome}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="hostMenu"
                component={MenuPage}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="hostListing"
                component={Listings}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="hostChat"
                component={AllChats}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="hotelAvailable"
                component={HotelChoice}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AlertNotificationRoot>
      </Provider>
    </>
  );
};

AppRegistry.registerComponent(appName, () => RootComponent);
// AppRegistry.registerComponent(appName, () => App);

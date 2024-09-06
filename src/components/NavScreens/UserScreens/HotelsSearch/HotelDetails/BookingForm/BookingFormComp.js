import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {COLORS, SIZES} from '../../../../../../constants/themes';
import Header from './Header/Header';
import TripDetails from './TripDetails/TripDetails';
import ChoosePayment from './ChoosePayment/ChoosePayment';
import PriceDetails from './PriceDetails/PriceDetails';
import PaymentMethods from './PaymentMethods/PaymentMethods';
import RequiredPhone from './RequiredPhone/RequiredPhone';
import {useDispatch, useSelector} from 'react-redux';
import {createTokenActor, formatTokenMetaData} from './utils/utils';
// import {Principal} from "@dfinity/principal"
import PushNotification from 'react-native-push-notification';
import {TransakWebViewIntegration} from './transakScreens/transakTest';
import WebView from 'react-native-webview';
import {
  global_transak_key,
  transak_key,
  transak_secret_phrase,
} from '../../../../../../../transakConfig';
import {
  AccountIdentifier,
  principalToAccountIdentifier,
} from '@dfinity/ledger-icp';
import BalanceScreen from './cryptoScreens/BalanceScreen';
import CheckAnim from './CheckAnim';
import {
  Connection,
  Transaction,
  SystemInstruction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {Buffer} from 'buffer';
global.Buffer = global.Buffer || Buffer;
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import {decryptPayload} from './utils/decryptPayload';
import {encryptPayload} from './utils/encryptPayload';
import PhantomPayment from './cryptoScreens/PhantomPayment';
import axios from 'axios';
import {ids, nodeBackend} from '../../../../../../../DevelopmentConfig';
import {Principal} from '@dfinity/principal';
import {toHex} from '@dfinity/agent';
import {fromHexString} from '@dfinity/candid';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {clearScreenDown} from 'readline';
import Rooms from './RoomSelection/Rooms';
import {payPalUrl} from '../../../../../../../DevelopmentConfig';
import PayPalApi from './Paypal/PayPalApi';
import queryString from 'query-string';

let paypalPayment = false;
const onConnectRedirectLink = 'rentspace://onConnect';
const connection = new Connection(clusterApiUrl('devnet'));
const onSignAndSendTransactionRedirectLink =
  'rentspace://onSignAndSendTransaction';
const SOLANA_DEVNET_USDC_PUBLIC_KEY =
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

const baseURL = nodeBackend;

const BookingFormComp = ({
  days,
  setBookingForm,
  setBooking,
  booking,
  loading,
  item,
  setLoading,
  showBookingAnimation,
  bookingAnimation,
  setOpen,
}) => {
  const {user} = useSelector(state => state.userReducer);
  const [fullPayment, setFullPayment] = useState(true);
  const {actors} = useSelector(state => state.actorReducer);
  const {principle} = useSelector(state => state.principleReducer);
  const [userId, setUserId] = useState('sample');
  const [metaData, setMetaData] = useState(null);
  const [Balance, setBalance] = useState(0);
  const [tokenActor, setTokenActor] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ICP');
  const [paymentType, setPaymentType] = useState('cypto');
  const [balanceScreen, setBalanceScreen] = useState(false);
  const [total, setTotal] = useState(0);
  const [cryptoPrice, setCryptoPrice] = useState();
  const {authData} = useSelector(state => state.authDataReducer);

  // console.log('Item', item);
  const [roomModal, setRoomModal] = useState(false);

  const [roomData, setRoomData] = useState([]); //[{roomID: '1', totalRooms: 0, roomPrice: 0, bill: 0}]);
  const [totalBill, setTotalBill] = useState(0);

  //Transak integration essential states

  const [wallet, setWallet] = useState('');
  const skipable = useRef(true);
  const [fiatPaymentStart, setFiatPaymentStart] = useState(false);

  //SOL phantom integration essential states

  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState(null);
  const [sharedSecret, setSharedSecret] = useState(null);
  const [session, setSession] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [phantomModal, setPhantomModal] = useState(false);

  // --------------------- paypal functionality -------------------
  const [paypalModal, setPaypalModal] = useState(false);
  const [approvedUrl, setApprovedUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');

  console.log('Paypal ID in form : ', item?.payPalId);

  const onPayPal = async () => {
    try {
      const token = await PayPalApi.generateToken(
        item?.payPalId,
        item?.payPalSecret,
      );
      console.log('PayPal Token : ', token);
      setAccessToken(token);
      const res = await PayPalApi.createOrder(token, total);
      console.log('PayPal Order : ', res);
      // console.log("Approve : ", res?.links[1]?.href);
      // setApprovedUrl(res?.links[1]?.href);

      if (!!res?.links) {
        const findUrl = res?.links.find(data => data.rel == 'approve');
        console.log('Approve : ', findUrl);
        setApprovedUrl(findUrl?.href);
        setPaypalModal(true);
      }
    } catch (error) {
      console.log('Error in onPayPal: ', error);
    }
  };

  const onUrlChange = webViewState => {
    console.log('webViewState : ', webViewState);
    if (webViewState.url.includes('https://example.com/cancel')) {
      setPaypalModal(false);
      console.log('Payment Cancelled');
      return;
    }
    if (webViewState.url.includes('https://example.com/return')) {
      const urlValue = queryString.parseUrl(webViewState.url);

      console.log('URL Value : ', urlValue);

      const {token} = urlValue.query;

      console.log('Token : ', token);

      if (!!token) {
        paymentSuccess(token);
      }
    }
  };

  const paymentSuccess = async id => {
    try {
      const res = await PayPalApi.capturePayment(id, accessToken);

      console.log('Payment Capture : ', res);
      Alert.alert('Payment Success');
      setPaypalModal(false);
      console.log('totalBill for creditCard : ', totalBill);
      // afterPaymentFlow('creditCard Payment', 100);
      if (!paypalPayment) {
        paypalPayment = true;
        afterPaymentFlow('Credit card payment', 100);
      }
    } catch (error) {
      console.log('error raised in payment capture : ', error);
    }
  };
  // ---------------------------------------------------------------

  // update the room data on booking
  const updateRoomData = async (
    propertyId,
    checkIn,
    checkOut,
    newRoomData,
    roomData,
  ) => {
    // console.log('New Room Data on Booking Update : ', newRoomData);
    const passData = {
      propertyId: propertyId,
      checkIn: checkIn,
      checkOut: checkOut,
      rooms: newRoomData,
      roomData: roomData,
    };
    console.log('Room Pass Data : ', passData);
    await axios
      .post(`${baseURL}/api/v1/booking/create`, passData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  //booking flow general functions
  function notifyBookingConfirm() {
    console.log('hoetl item : ', item?.propertyName);
    PushNotification.localNotification({
      title: 'Booking Successful!',
      message: `${user?.firstName}, your booking for ${item?.propertyName} is successful!`,
      channelId: '1',
    });
  }

  const book = async (obj, notify, amnt, id) => {
    try {
      let paymentOpt = null;
      let opt = {
        id: parseInt(id),
      };

      if (paymentMethod == 'ckEth') {
        paymentOpt = {ckETH: opt};
      } else if (paymentMethod == 'SOL') {
        paymentOpt = {sol: null};
      } else if (paymentMethod == 'ckBTC') {
        paymentOpt = {ckBTC: opt};
      } else if (paymentMethod == 'creditCard') {
        paymentOpt = {creditCard: null};
      } else if (paymentMethod == 'paypal') {
        paymentOpt = {paypal: null};
      } else {
        paymentOpt = {icp: opt};
      }
      console.log(
        'POpp :> ',
        paymentOpt,
        'PMeth :> ',
        paymentMethod,
        'Obj :> ',
        obj,
        'AmNt :> ',
        amnt,
        'Total :> ',
        total,
      );

      console.log('Booking Actor : ', actors?.bookingActor?.createBooking);

      let bookingRes = await actors?.bookingActor?.createBooking(
        paymentOpt,
        obj,
        amnt,
        total,
      );
      console.log('booking response : ', bookingRes);
      if (bookingRes?.err != undefined) {
        setLoading(false);
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Some Error Occcured',
          textBody: bookingRes?.err,
          button: 'OK',
        });
        return;
      }
      // ------------------- update the room data on booking-------------------
      // let roomData = [];
      console.log('Obj on room update : ', roomData);
      console.log('OBJ : ', obj);
      console.log('checkout : ', obj?.checkOutDate);
      console.log('Room Item : ', item.propertyId);

      let newRoomData = item.rooms.map(room => {
        let roomObj = roomData.find(data => data.roomID == room.roomID);
        if (roomObj) {
          room.totalAvailableRooms =
            room.totalAvailableRooms - roomObj.totalRooms;
        }
        return room;
      });

      // console.log("New Room Data : ", newRoomData);

      // send propertyId and rooms to update function

      // propertyId, bookedRooms, checkIn, checkOut, rooms
      await updateRoomData(
        item.propertyId,
        obj?.checkInDate,
        obj?.checkOutDate,
        newRoomData,
        roomData,
      );

      // -----------------------------------------
      notify();
      setLoading(false);
      showBookingAnimation(true);
      setTimeout(() => {
        setBookingForm(false);
        setOpen(false);
      }, 2000);
    } catch (err) {
      console.log('the error is : ', err);
      setLoading(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Some Error Occcured',
        textBody: `Some Error Occured While Booking the Hotel `,
        button: 'OK',
      });
    }
  };

  const afterPaymentFlow = async (paymentId, amnt) => {
    // setBooking({...booking, paymentStatus: true, paymentId: paymentId});
    // const newObj = {
    //   ...booking,
    //   paymentId: paymentId,
    //   paymentStatus: true,
    //   hotelId: item?.id,
    //   // bookedAt:"start",
    //   // bookedTill:"end"
    // };
    // alert("in after payment")
    console.log('booking : ', booking);
    console.log('paymentId : ', paymentId);
    console.log('amnt : ', amnt);

    book(booking, notifyBookingConfirm, amnt, paymentId);
    setBalanceScreen(false);
  };

  //crypto payment functions except solana
  const transferApprove = async (sendAmount, sendPrincipal, tokenActor) => {
    setLoading(true);
    console.log('metaData[decimals]', metaData);
    let amnt = parseInt(
      Number(sendAmount) * Math.pow(10, parseInt(metaData?.['icrc1:decimals'])),
    );

    console.log('amount', amnt, principle, sendPrincipal);

    // try{
    console.log('canid is anonymous', Principal.fromText(ids.bookingCan));
    console.log(
      'canid principal',
      Principal.fromHex(
        principalToAccountIdentifier(Principal.fromText(ids.bookingCan)),
      ),
    );
    if ((await getBalance()) >= amnt) {
      let transaction = {
        amount: Number(amnt) + Number([metaData?.['icrc1:fee']]),
        from_subaccount: [],
        spender: {
          owner: Principal.fromText(ids.bookingCan),
          subaccount: [],
        },
        fee: [metaData?.['icrc1:fee']],
        memo: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      };
      console.log(tokenActor?.icrc2_approve);
      await tokenActor
        ?.icrc2_approve(transaction)
        .then(async res => {
          if (res?.Err) {
            setLoading(false);
            console.log(res);
            return;
          } else {
            console.log(res);
            afterPaymentFlow(parseInt(res?.Ok).toString(), amnt);
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else {
      console.log('balance is less : ', amnt, sendAmount);
      setLoading(false);
    }
  };

  const transakPayment = async (sendAmount, sendPrincipal) => {
    setLoading(true);
    let newActor = actors?.icpTokenActor;
    setTokenActor(actors?.icpTokenActor);
    await newActor
      .icrc1_metadata()
      .then(res => {
        console.log('icrc1_metadata res : ', res);

        setMetaData(formatTokenMetaData(res));
        transferApprove(sendAmount, sendPrincipal, newActor);
      })
      .catch(err => {
        console.log(err);
      });
  };

  async function settingToken() {
    let canID = '';
    let newActor;
    console.log(paymentMethod);
    if (paymentMethod == 'ckBTC') {
      newActor = actors?.ckbtcTokenActor;
      setTokenActor(actors?.ckbtcTokenActor);
    } else if (paymentMethod == 'ckEth') {
      newActor = actors?.ckETHtokenActor;
      setTokenActor(actors?.ckETHtokenActor);
    } else {
      newActor = actors?.icpTokenActor;
      setTokenActor(actors?.icpTokenActor);
    }
    setTokenActor(newActor);
    console.log('token actor', tokenActor);
    await newActor
      .icrc1_metadata()
      .then(res => {
        console.log('icrc1_metadata res : ', res);

        setMetaData(formatTokenMetaData(res));
      })
      .catch(err => {
        console.log(err);
      });
  }
  const getCryptoPrice = async method => {
    await axios
      // .get('https://api.coinbase.com/v2/exchange-rates?currency=USD')
      .get('https://api.coinbase.com/v2/exchange-rates?currency=EUR')
      .then(res => {
        console.log(res?.data?.data?.rates?.ICP, paymentMethod);
        if (paymentMethod == 'ICP') {
          setCryptoPrice(res?.data?.data?.rates?.ICP);
        } else if (paymentMethod == 'ckBTC') {
          setCryptoPrice(res?.data?.data?.rates?.BTC);
          console.log('BTC ', res?.data?.data?.rates?.BTC);
        } else if (paymentMethod == 'ckEth') {
          setCryptoPrice(res?.data?.data?.rates?.ETH);
          console.log('ETH', res?.data?.data?.rates?.ETH);
        } else if (paymentMethod == 'SOL') {
          setCryptoPrice(res?.data?.data?.rates?.SOL);
          console.log('SOL', res?.data?.data?.rates?.SOL);
        } else {
          console.log('else');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getBalance = async () => {
    let bal = await tokenActor.icrc1_balance_of({
      owner: Principal.fromText(principle),
      subaccount: [],
    });
    console.log('balance : ', parseInt(bal));
    setBalance(parseInt(bal));
    return parseInt(bal);
  };

  //Transak functions
  function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
  }
  const getOwner = () => {
    setUserId(item?.id?.split('#')[0]);
    console.log(userId);
    let walletId = AccountIdentifier.fromPrincipal({
      principal: Principal.fromText(principle),
    });
    setWallet(toHexString(walletId.bytes));
  };
  const launchTransac = () => {
    setFiatPaymentStart(true);
  };

  //Phantom wallet functions
  const connect = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      cluster: 'devnet',
      app_url: 'https://rentspace.kaifoundry.com',
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      redirect_link: onConnectRedirectLink,
    });
    console.log(params.toString());
    const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
    console.log(url);
    Linking.openURL(url);
    // Linking.addEventListener('url', handleDeepLink);
  };
  const handleDeepLink = async event => {
    console.log(event.url);
    setDeepLink(event.url);
  };
  const sendNewTransaction = async total => {
    // const hostAccID="F8MVciLX7XFv2ZtBsCgQNSstMLwC4r7EXtcurB73o1Hz"
    // const hostAccID="CUT6rrZag3dpAYPZksQ7LvqcHrxatcdqxjCnTvxXdHo8"
    setLoading(true);
    if (!phantomWalletPublicKey) {
      // Alert.alert("Connection Required",'Please connect to phantom wallet first!')
      setShowAlertPop({
        type: 'default',
        title: 'Connection Required',
        message: 'Please connect to phantom wallet first!',
        color: COLORS.black,
        visibility: true,
      });

      return;
    }
    const transaction = new Transaction();
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = phantomWalletPublicKey;
    transaction.instructions = [
      SystemProgram.transfer({
        fromPubkey: phantomWalletPublicKey,
        toPubkey: new PublicKey(item?.phantomWalletID),
        lamports: 0.1 * LAMPORTS_PER_SOL,
      }),
    ];
    console.log(transaction);

    const seriealizedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });
    console.log(seriealizedTransaction);
    const payload = {
      session,
      transaction: bs58.encode(seriealizedTransaction),
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onSignAndSendTransactionRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    console.log(params);
    const url = `https://phantom.app/ul/v1/signAndSendTransaction?${params.toString()}`;
    Linking.openURL(url);
  };
  const initializeDeeplinks = async () => {
    const initialUrl = await Linking.getInitialURL();
    console.log(initialUrl, 'ini');
    if (initialUrl) {
      setDeepLink(initialUrl);
    } else {
      setDeepLink(onConnectRedirectLink);
    }
  };
  const phantomHandleError = url => {
    const error = url.searchParams.get('errorCode');
    console.log('error: ', error);
    setLoading(false);
    if (error == 4001) {
      // Alert.alert("Transaction failed","You rejected the payment request!")
      setShowAlertPop({
        type: 'default',
        title: 'Transaction failed',
        message: 'You rejected the payment request!',
        color: COLORS.black,
        visibility: true,
      });
    }
    // if(error==-32503){
    //   Alert.alert("Transaction failed","Insufficient balance in the account you are trying to pay with!")
    // }
  };
  const handleConnection = allParams => {
    setLoading(false);
    console.log('we received a connect response from Phantom: ', allParams);
    const sharedSecretDapp = nacl.box.before(
      bs58.decode(allParams.phantom_encryption_public_key),
      dappKeyPair.secretKey,
    );
    const connectData = decryptPayload(
      allParams.data,
      allParams.nonce,
      sharedSecretDapp,
    );
    console.log(connectData, 'connect data');
    setPhantomWalletPublicKey(new PublicKey(connectData?.public_key));
    setSession(connectData?.session);
    setSharedSecret(sharedSecretDapp);
    console.log(`connected to ${connectData.public_key.toString()}`);
  };
  const handleTransactionSuccessful = allParams => {
    const signAndSendTransactionData = decryptPayload(
      allParams.data,
      allParams.nonce,
      sharedSecret,
    );
    console.log('transaction submitted: ', signAndSendTransactionData);
    setPhantomModal(false);
    afterPaymentFlow('Sol payment', total);
  };

  useEffect(() => {
    try {
      if (deepLink == undefined || !deepLink) return;
      if (paymentMethod != 'SOL') return;

      const url = new URL(deepLink);

      let data = url.searchParams.get('data');
      let phantom_encryption_public_key = url.searchParams.get(
        'phantom_encryption_public_key',
      );
      let nonce = url.searchParams.get('nonce');
      let allParams = {
        data: data,
        phantom_encryption_public_key: phantom_encryption_public_key,
        nonce: nonce,
      };
      if (url.searchParams.get('errorCode')) {
        phantomHandleError(url);
        return;
      }

      if (url.toString().includes('onConnect?')) {
        handleConnection(allParams);
        return;
      } else if (url.toString().includes('onSignAndSendTransaction')) {
        handleTransactionSuccessful(allParams);
        return;
      } else {
        console.log('not connect but no error as well!');
      }
    } catch (err) {
      console.log(err?.code, ' err code');
      setFiatPaymentStart(false);
      if (err.code == 4001) {
        // Alert.alert("Transaction Rejected","You rejected the transaction")
        setShowAlertPop({
          type: 'default',
          title: 'Transaction Rejected',
          message: 'You rejected the transaction',
          color: COLORS.black,
          visibility: true,
        });
      } else if (err.code == 32603) {
        // Alert.alert("Transaction Rejected","The transaction is rejected, check if you have enough balance in your wallet!")
        setShowAlertPop({
          type: 'default',
          title: 'Transaction Rejected',
          message:
            'The transaction is rejected, check if you have enough balance in your wallet!',
          color: COLORS.black,
          visibility: true,
        });
      }
    }
  }, [deepLink]);

  useEffect(() => {
    getOwner();
    PushNotification.createChannel(
      {
        channelId: '1',
        channelName: 'booking',
      },
      () => {
        console.log('booking notification channel created!');
      },
    );

    initializeDeeplinks();
    const listener = Linking.addEventListener('url', handleDeepLink);
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    if (
      paymentMethod == 'ICP' ||
      paymentMethod == 'ckBTC' ||
      paymentMethod == 'ckEth'
    ) {
      console.log(paymentMethod);
      getCryptoPrice();
      settingToken();
      setPaymentType('crypto');
    } else if (paymentMethod == 'SOL') {
      getCryptoPrice();
      console.log('SOL selected!');
      setPaymentType('phantom');
    }
    //-------------------------------------------------------------------------- PayPal for credit card
    else if (paymentMethod == 'creditCard') {
      // Alert.alert("PayPal", "PayPal payment is choosen !");
      setPaymentType('paypal');
      // setPaymentType('fiat');
    } else if (paymentMethod == 'paypal') {
      console.log('PayPal selected!');
      setPaymentType('paypal');
    } else {
      Alert.alert(
        'KYC needed',
        'For this option, if you are a first time transak user, you may need to complete your KYC!',
      );
      setPaymentType('fiat');
    }
  }, [paymentMethod]);

  // useEffect(() => {
  //   console.log("Room Data : ", roomData);
  // }, [roomData]);

  console.log('PayPal Approved URL : ', approvedUrl);

  return (
    <View style={styles.page}>
      <View style={styles.backIconCont}>
        <TouchableOpacity onPress={() => setBookingForm(false)}>
          <Icon color={COLORS.black} name="chevron-left" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollPart}>
        <Header hotelname={item?.propertyName} hotelAddress={item?.location} />
        {/* <View style={styles.line} /> */}
        {/* <TripDetails /> */}
        <View style={styles.line} />
        {/* <ChoosePayment
          fullPayment={fullPayment}
          setFullPayment={setFullPayment}
          price={total}
        /> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '87%',
            marginLeft: 5,
          }}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: SIZES.medium,
              fontWeight: 'bold',
            }}>
            Select Room Type
          </Text>
          <TouchableOpacity onPress={() => setRoomModal(true)}>
            <Icon color={COLORS.black} name="chevron-right" size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <PriceDetails
          basePrice={item?.price}
          nights={booking?.bookingDuration}
          fullPayment={fullPayment}
          checkIn={booking?.date}
          days={days}
          roomData={roomData}
          setRoomData={setRoomData}
          setTotal={setTotal}
        />
        <View style={styles.line} />
        <PaymentMethods
          method={paymentMethod}
          setMethod={setPaymentMethod}
          connect={connect}
          item={item}
        />
        <View style={styles.line} />
        <RequiredPhone />
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (total == 0) {
              Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Room Selected',
                textBody: 'Please select a room to proceed!',
                button: 'OK',
              });
            } else {
              if (paymentType == 'fiat') {
                launchTransac();
              } else if (paymentType == 'phantom') {
                // console.log(connection)
                // connect()
                // sendNewTransaction()
                setPhantomModal(true);
              }
              // ----------------------------------------- PayPal for credit card
              else if (paymentType == 'paypal') {
                Alert.alert('PayPal', 'PayPal payment selected!');
                console.log(payPalUrl);
                onPayPal();
              } else {
                getBalance();
                setBalanceScreen(true);
              }
            }
          }}>
          <Text style={styles.btnText}>Confirm and pay</Text>
        </TouchableOpacity>
      </ScrollView>
      <ActivityIndicator animating={loading} size={40} style={styles.loader} />
      <Modal
        visible={fiatPaymentStart}
        animationType="fade"
        onRequestClose={() => {
          if (skipable.current) {
            Alert.alert(
              'Interrupt Transaction',
              'Do you relly want to cancel the transaction?',
              [
                {
                  text: 'Yes',
                  onPress: () => {
                    setFiatPaymentStart(false);
                    Alert.alert(
                      'Transaction failed',
                      'Fiat transaction interrupted by the user!',
                    );
                  },
                },
                {
                  text: 'No',
                  onPress: () => console.log('Transaction continued!'),
                },
              ],
            );
          } else {
            console.log(skipable.current);
            Alert.alert(
              'Cancel request rejected',
              'Cannot cancel transaction after order creation, Please do not close the screen unitl completion!',
            );
          }
        }}>
        {TransakWebViewIntegration(
          wallet,
          user?.userEmail,
          fullPayment ? total : total / 2,
          transakPayment,
          wallet,
          setFiatPaymentStart,
          paymentMethod,
          skipable,
        )}
      </Modal>
      <Modal
        transparent
        visible={balanceScreen}
        animationType="fade"
        onRequestClose={() => {
          setBalanceScreen(false);
        }}>
        <BalanceScreen
          self={setBalanceScreen}
          paymentMethod={paymentMethod}
          balance={Balance}
          walletID={wallet}
          total={fullPayment ? total : total / 2}
          receiver={item?.hotelTitle}
          transfer={transferApprove}
          userId={userId}
          tokenActor={tokenActor}
          loading={loading}
          cryptoPrice={cryptoPrice}
        />
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={bookingAnimation}
        onRequestClose={() => {
          showBookingAnimation(false);
        }}>
        <CheckAnim self={showBookingAnimation} />
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={phantomModal}
        onRequestClose={() => {
          setPhantomModal(false);
        }}>
        <PhantomPayment
          loading={loading}
          accountId={item?.phantomWalletID}
          sendNewTransaction={sendNewTransaction}
          connect={connect}
          total={fullPayment ? total : total / 2}
          connected={phantomWalletPublicKey != null}
          cryptoPrice={cryptoPrice}
        />
      </Modal>

      {/* Room modal */}
      <Modal
        visible={roomModal}
        animationType="slide"
        onRequestClose={() => setRoomModal(false)}>
        <Rooms
          item={item}
          totalBill={totalBill}
          setTotalBill={setTotalBill}
          booking={booking}
          roomData={roomData}
          setRoomData={setRoomData}
          setRoomModal={setRoomModal}
        />
      </Modal>

      {/* Paypal Modal */}
      <Modal
        visible={paypalModal}
        animationType="fade"
        onRequestClose={() => setPaypalModal(false)}>
        <View style={{flex: 1}}>
          <WebView
            source={{uri: approvedUrl}}
            onNavigationStateChange={onUrlChange}
          />
        </View>
      </Modal>
    </View>
  );
};

export default BookingFormComp;

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.newBG,
    // zIndex:60
  },
  backIconCont: {
    position: 'absolute',
    width: '100%',
    backgroundColor: COLORS.newBG,
    zIndex: 10,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  line: {
    width: '100%',
    backgroundColor: COLORS.black,
    height: 0.5,
    opacity: 0.23,
    marginVertical: 15,
  },
  btn: {
    width: '82%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  scrollView: {
    width: '100%',
    backgroundColor: COLORS.newBG,
  },
  scrollPart: {
    width: '100%',
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
});

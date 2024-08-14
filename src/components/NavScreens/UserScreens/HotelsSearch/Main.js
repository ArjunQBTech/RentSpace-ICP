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
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLORS, SIZES} from '../../../../constants/themes';
import BottomNav from '../../../Navigation/BottomNav';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheetLogin from '../../../BottomSheets/BottomSheetLogin';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottomSheetFinishSignUp from '../../../BottomSheets/BottomSheetFinishSignUp';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import BottomSheetCommunity from '../../../BottomSheets/BottomSheetCommunity';
import BottomSheetNotification from '../../../BottomSheets/BottomSheetNotification';
import SplashScreen from 'react-native-splash-screen';
import BottomSheetDetails from '../../../BottomSheets/BottomSheetDetails';
import ModalSafety from './HotelDetails/Modals/ModalSafety';
import ModalCancellation from './HotelDetails/Modals/ModalCancellation';
import ModalHouseRules from './HotelDetails/Modals/ModalHouseRules';
import HeaderSearch from '../Reusables/Header/HeaderSearch';
import BookHotelPage from './BookHotelPage';
import HotelCreationForm from '../Profile/Modals/HotelCreationForm';
import HotelDetailPage from './HotelDetails/HotelDetailPage';
import {
  DelegationIdentity,
  Ed25519PublicKey,
  ECDSAKeyIdentity,
  DelegationChain,
} from '@dfinity/identity';
import {HttpAgent, toHex, fromHex} from '@dfinity/agent';
import {createActor, backend} from '../../../../declarations/backend';
import {createActor as createUserActor} from '../../../../declarations/User';
import {createActor as createHotelActor} from '../../../../declarations/hotel';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../../redux/users/actions';
import {setPrinciple} from '../../../../redux/principle/actions';
import {setActor} from '../../../../redux/actor/actions';
import {useRoute} from '@react-navigation/native';
import {setAgent} from '../../../../redux/agent/actions';
import Filters from './Filters/Filters';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {host, ids} from '../../../../../DevelopmentConfig';
import Geolocation from '@react-native-community/geolocation';
import { nodeBackend } from '../../../../../DevelopmentConfig';
global.Buffer = require('buffer').Buffer;

const Main = ({navigation}) => {
  // const [loading,setLoading]=useState(false)

  // const baseQueryUrl=`https://rentspace.kaifoundry.com/api/v1/hotel/filters?`
  // const baseQueryUrl = `http://localhost:5000/api/v1/hotel/filters?`;
  const baseQueryUrl = `${nodeBackend}/api/v1/property/filters?`

  const route = useRoute();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.userReducer);
  const {hotels} = useSelector(state => state.hotelsReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const {principle} = useSelector(state => state.principleReducer);
  const {
    handleLogin,
    btmSheetFinishRef,
    btmSheetLoginRef,
    delegationValidation,
  } = route.params;
  //States for managing modals
  const [safetyModal, setSafetyModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [rulesModal, setRulesModal] = useState(false);
  const [hotelCreateForm, setHotelCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [queryHotels, setQueryHotels] = useState([]);
  const [rateHawkHotel, setRateHawkHotel] = useState([]);

  // const [query, setQuery] = useState(
  //   `maxPrice=${800}&pageSize=${15}&amenities=${[]}&propertyType=${'Hotel'}`,
  // );

  const [query, setQuery] = useState({
    location: null,
    minPrice: 0,
    maxPrice: 1000,
    pageSize: 15,
    amenities: [],
    propertyType: '',
    name: '',
    latitude: 0,
    longitude: 0,
  });

  const [searchText, setSearchText] = useState('');

  // function to get current location of user (city name) and set it to the query
  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(loc => {
      const coordinates = loc.coords;
      console.log(
        'coordinates : ' + coordinates.latitude + ' ' + coordinates.longitude,
      );
      axios
        .get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`,
        )
        .then(res => {
          console.log('City : ' + res.data.city);
          setQuery({
            ...query,
            location: res.data.city,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          });
        })
        .catch(err => console.log(err));
    });
  };

  useEffect(() => {
    SplashScreen.hide();
    // getUserAgent()
    if (principle != '') {
      console.log(principle);
    } else {
      btmSheetLoginRef.current.present();
    }

    // getAsyncData()
    // clearAsyncStore()

    if (principle != '') {
      console.log(principle);
    } else {
      btmSheetLoginRef.current.present();
    }

    getCurrentLocation();

    // generateIdentity();
  }, []);

  useEffect(() => {
    console.log("filter query'");
    filterQuery();

    console.log(query.location);
  }, [query]);

  // const getAsyncData=async()=>{
  //   let data=await AsyncStorage.getItem("d2")
  //   console.log("async fetched data",JSON.parse(data))
  //   let parsedData =JSON.parse(data)
  //   delegationValidation(parsedData.publicKey,parsedData.privateKey,parsedData.delegation)
  // }

  const clearAsyncStore = async () => {
    await AsyncStorage.clear();
  };

  //Refs for managing bottomsheets
  // const btmSheetLoginRef = useRef(null);
  // const btmSheetFinishRef = useRef(null);

  const btmSheetCommRef = useRef(null);
  const btmSheetNotiRef = useRef(null);
  const btmExtraDetailsRef = useRef(null);
  const btmUserDetailsRef = useRef(null);
  const snapPoints = ['94%'];

  const handlePresentModal = () => {
    btmSheetLoginRef.current.present();
  };

  const openFilters = () => {
    console.log('executing');
    setShowFilters(true);
  };

  const filterQuery = async () => {

    setQueryHotels([]);
    setRateHawkHotel([]);

    let finalquery = `minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&pageSize=${query.pageSize}&amenities=${query.amenities}&propertyType=${query.propertyType}&location=${query.location}&name=${query.name}&latitude=${query.latitude}&longitude=${query.longitude}`;

    console.log('filter query func', finalquery);
    await axios
      .get(`${baseQueryUrl}${finalquery}`)
      .then(res => {
        if (
          res?.data?.hotels === undefined ||
          (res?.data?.hotels.length == 0 &&
            res?.data?.externalHotels.length == 0) ||
          res?.data?.externalHotels === undefined
        ) {
          console.log('no hotels found');
          console.log(res);
          setQueryHotels([]);
          setRateHawkHotel([]);
        } else {
          setQueryHotels([...res?.data?.hotels]);
          setRateHawkHotel([...res?.data?.externalHotels]);
          // console.log(res.data);
          console.log('External hotels : ' + res.data.externalHotels);
          console.log('Internal hotels : ' + res.data.hotels);
          // console.log('External hotels ID :' + res.data.externalHotelsIDs);
        }
      })
      .catch(err => console.log(err));
  };

  const getUserData = async () => {
    // console.log(actors)
    await actors.userActor
      ?.getUserInfo()
      .then(res => {
        if (res[0].firstName != '') {
          dispatch(setUser(res[0]));
          btmSheetLoginRef.current.dismiss();
          alert(`welcome back ${res[0].firstName}!`);
        } else {
          alert('Now please follow the registeration process!');
          btmSheetLoginRef.current.dismiss();
          btmSheetFinishRef.current.present();
        }
      })
      .catch(err => console.error(err));
    // await AsyncStorage.clear()
  };

  //methods for opening and closing bottomsheets
  const closeModal = valRef => {
    valRef.current.dismiss();
  };
  const openComm = () => {
    btmSheetCommRef.current.present();
  };
  const openNotiModal = () => {
    btmSheetNotiRef.current.present();
  };

  return (
    // Necessary for capturing touch gestures in the screen
    <GestureHandlerRootView style={styles.view}>
      <BottomSheetModalProvider>
        {/* Modals Defined */}

        <Modal visible={safetyModal} animationType="fade">
          <ModalSafety setSafetyModal={setSafetyModal} />
        </Modal>

        <Modal visible={cancelModal} animationType="fade">
          <ModalCancellation setCancelModal={setCancelModal} />
        </Modal>

        <Modal visible={rulesModal} animationType="fade">
          <ModalHouseRules setRulesModal={setRulesModal} />
        </Modal>
        <Modal visible={hotelCreateForm} animationType="slide">
          <HotelCreationForm setHotelCreateForm={setHotelCreateForm} />
        </Modal>

        <Modal visible={showFilters} animationType="slide" transparent>
          <Filters
            query={query}
            setQuery={setQuery}
            setShowFilters={setShowFilters}
          />
        </Modal>

        {/* navigation Bar */}
        <BottomNav navigation={navigation} />

        {/* searchBar Top */}
        <HeaderSearch
          filterAction={openFilters}
          query={query}
          setQuery={setQuery}
          setSearchText={setSearchText}
          searchText={searchText}
        />

        {/* <UserDetailDemo user={user}/> */}
        <BookHotelPage
          navigation={navigation}
          queryHotels={queryHotels}
          rateHawkHotel={rateHawkHotel}
          filterQuery={filterQuery}

        />

        {/* BottomSheets */}
        <BottomSheetModal
          ref={btmSheetLoginRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}>
          <BottomSheetLogin
            handleLogin={handleLogin}
            delegationValidation={delegationValidation}
            navigation={navigation}
          />
        </BottomSheetModal>
        <BottomSheetModal
          ref={btmSheetFinishRef}
          index={0}
          enablePanDownToClose={false}
          snapPoints={snapPoints}>
          <BottomSheetFinishSignUp
            openComm={openComm}
            closeModal={() => {
              closeModal(btmSheetFinishRef);
            }}
          />
        </BottomSheetModal>
        <BottomSheetModal
          ref={btmSheetCommRef}
          index={0}
          snapPoints={snapPoints}>
          <BottomSheetCommunity
            selfMod={btmSheetCommRef}
            openNotiModal={openNotiModal}
          />
        </BottomSheetModal>
        <BottomSheetModal
          ref={btmSheetNotiRef}
          index={0}
          snapPoints={snapPoints}>
          <BottomSheetNotification self={btmSheetNotiRef} />
        </BottomSheetModal>
        <BottomSheetModal
          ref={btmExtraDetailsRef}
          index={0}
          snapPoints={snapPoints}>
          <BottomSheetDetails />
        </BottomSheetModal>
        {/* <ActivityIndicator animating={loading} style={styles.loader} size={40}/> */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Main;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.newBG,
  },
  loader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
});

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SIZES} from '../../../../constants/themes';
import BottomNavHost from '../../../Navigation/BottomNavHost';
import IdentityCard from './IdentityCard';
import Reservations from '../Reservations/Reservations';
import IDProcessManager from './Identification/IDProcessManager';
import ChatDrawer from '../ChatPage/ChatDrawer/ChatDrawer';
import {useSelector} from 'react-redux';
import HostWelcomeManager from '../../../HostViewNew/HostWelcomeManager';
import Step1Manager from '../../../HostViewNew/Step1Manager';
import Step2Manager from '../../../HostViewNew/Step2Manager';
import Step3Manager from '../../../HostViewNew/Step3Manager';
import ReservationCard from '../Reservations/ReservationCard';
import {Principal} from '@dfinity/principal';
import axios, {all} from 'axios';
import {nodeBackend} from '../../../../../DevelopmentConfig';

const HostHome = ({navigation}) => {
  const [idprocess, setIdprocess] = useState(0);
  const [reservationType, setReservationType] = useState('Checked out');
  const [showReservation, setShowReservations] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [hostModal, setHostModal] = useState(0);
  const {user} = useSelector(state => state.userReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const {hotels} = useSelector(state => state.hotelsReducer);
  const [reservationList, setReservationList] = useState([]);
  const [outCount, setOutCount] = useState(0);
  const [arrCount, setArrCount] = useState(0);
  const [hostingCount, setHostingCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const {principle} = useSelector(state => state.principleReducer);

  const hostImg = user.userImage;
  // console.log('Gov ID : ', typeof user.userGovID);

  const reservationTypes = [
    {
      title: 'Checked out',
      count: outCount,
    },
    {
      title: 'Currently hosting',
      count: hostingCount,
    },
    {
      title: 'Arriving soon',
      count: arrCount,
    },
  ];

  const parseDMY = s => {
    let [d, m, y] = s.split(/\D/);
    return new Date(y, m - 1, d);
  };

  const getFilteredArray = (type, arr) => {
    return arr.filter(item => item.status == type);
  };
  const getHotelDetails = async () => {
    console.log('from home page');
  };

  const getStatus = bookingRes => {
    let checkInDate = parseDMY(bookingRes?.checkInDate);
    let checkOutDate = parseDMY(bookingRes?.checkOutDate);
    let currentDate = new Date();
    console.log(checkInDate, checkOutDate, currentDate);
    let status = null;
    if (currentDate < checkOutDate && currentDate >= checkInDate) {
      status = 'Currently hosting';
      console.log(' cur');
      setHostingCount(prev => prev + 1);
    } else if (currentDate < checkInDate) {
      status = 'Arriving soon';
      console.log(' arr');
      setArrCount(prev => prev + 1);
    } else {
      console.log(' out');
      status = 'Checked out';
      setOutCount(prev => prev + 1);
    }
    return status;
  };

  async function getReservations() {
    try {
      setRefreshing(true);
      console.log('executing getreservations');
      let hotelIds = await getAllHotelList();
      if (hotelIds == [] || hotelIds == undefined) {
        setRefreshing(false);
        console.log('receiving empty hotel id : ', hotelIds);
        return;
      }
      let allBookings = [];

      for (let i = 0; i < hotelIds?.length; i++) {
        console.log(`hotel id ${i + 1} : ${hotelIds[i]}`);
        let bookingRes = await actors?.bookingActor?.getAllHotelBookings(
          hotelIds[i],
        );
        if (bookingRes?.err != undefined) {
          console.log(`err for booking in hotel ${i + 1} : ${bookingRes?.err}`);
          continue;
        }
        // allBookings=[...allBookings,...bookingRes?.ok]
        for (let j = 0; j < bookingRes?.ok?.length; j++) {
          let userRes = await actors?.userActor?.getUserByPrincipal(
            Principal.fromText(bookingRes?.ok[j]?.userId),
          );
          if (userRes?.err != undefined) {
            continue;
          }
          allBookings.push({
            bookingData: bookingRes?.ok[j],
            bookingId: bookingRes?.ok[j]?.bookingId,
            customerId: bookingRes?.ok[j]?.userId,
            customerData: userRes?.ok,
            status: getStatus(bookingRes?.ok[j]),
          });
        }
        // console.log(bookingRes?.ok)
      }
      console.log(allBookings);
      setRefreshing(false);

      setReservationList([...allBookings]);
    } catch (err) {
      console.log(err);
      setRefreshing(false);
    }
  }

  async function getAllHotelList() {
    setArrCount(0);
    setHostingCount(0);
    setOutCount(0);
    try {
      console.log('fetching hotels for : ', principle);
      let hotelRes = await axios.get(
        `${nodeBackend}/api/v1/property/all?userPrincipal=${principle}`,
      );
      // console.log(hotelRes?.data?.properties)
      if (hotelRes?.data?.properties == undefined) {
        console.log('getting undefined properties');
        setRefreshing(false);
        return;
      }
      let hotelIds = [];
      for (let i = 0; i < hotelRes?.data?.properties?.length; i++) {
        hotelIds?.push(hotelRes?.data?.properties[i]?.propertyId);
      }
      console.log('hotels returned : ', hotelIds);
      if (hotelIds.length == 0) {
        setHostModal(1);
      }
      return hotelIds;
    } catch (err) {
      console.log(err);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // getAllReservations();
    // console.log('fetching reservations!');
    // getAllHotelList()
    getReservations();
  }, []);

  return (
    <View style={styles.view}>
      <View style={styles.headerCont}>
        <Text style={styles.title}>Welcome, {user.firstName}!</Text>
        <View style={styles.imgCont}>
          {hostImg == null || hostImg == '' || hostImg == undefined ? (
            <Image
              source={require('../../../../assets/images/newProfile.png')}
              style={styles.profile}
            />
          ) : (
            <Image source={{uri: hostImg}} style={styles.profile} />
          )}
        </View>
      </View>
      {user.userGovID === '' ? (
        <IdentityCard setIdprocess={setIdprocess} />
      ) : (
        // <Text style={styles.verificationText}>{
        //   user.isVerified ? 'Your ID is verified' : 'Your ID is under verification'
        // }</Text>
        <View style={styles.card}>
          <Text style={styles.verificationText}>
            {user.isVerified
              ? 'Your ID is verified'
              : 'Your ID is under verification'}
          </Text>
        </View>
      )}

      <Text style={styles.subHeading}>Your reservations</Text>
      <FlatList
        style={styles.reservationTitleList}
        data={reservationTypes}
        renderItem={item => {
          return (
            <TouchableOpacity
              onPress={() => setReservationType(item.item.title)}
              style={
                item.item.title == reservationType
                  ? styles.selectedReservationType
                  : styles.reservationType
              }>
              <Text
                style={
                  item.item.title == reservationType
                    ? styles.selectedReservationTypeText
                    : styles.reservationTypeText
                }>
                {item.item.title} ({item.item.count})
              </Text>
            </TouchableOpacity>
          );
        }}
        horizontal={true}
      />
      {reservationList.length == 0 ||
      !(
        (reservationType == 'Checked out' && reservationTypes[0].count > 0) ||
        (reservationType == 'Currently hosting' &&
          reservationTypes[1].count > 0) ||
        (reservationType == 'Arriving soon' && reservationTypes[2].count > 0)
      ) ? (
        <View style={styles.reservationsCont}>
          <Text style={styles.simpleText1}>Sorry!</Text>
          <Text style={styles.simpleText}>
            You don’t have any guest checking out today or tomorrow
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.reservationCardList}
          data={getFilteredArray(reservationType, reservationList)}
          renderItem={item => {
            if (item.item?.status == reservationType) {
              return <ReservationCard item={item.item} />;
            }
          }}
          keyExtractor={(item, index) => index}
          horizontal={true}
        />
      )}

      <TouchableOpacity
        style={{marginLeft: '5%'}}
        onPress={() => setShowReservations(true)}>
        <Text style={styles.link}>
          All resevations ({reservationList.length})
        </Text>
      </TouchableOpacity>
      <BottomNavHost
        navigation={navigation}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      />
      {/*Modals */}
      <Modal animationType="fade" visible={showDrawer} transparent>
        <ChatDrawer
          navigation={navigation}
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={showReservation}
        onRequestClose={() => setShowReservations(false)}>
        <Reservations
          setShowReservations={setShowReservations}
          navigation={navigation}
          reservationList={reservationList}
          reservationTypes={reservationTypes}
          getAllReservations={getReservations}
          getFilteredArray={getFilteredArray}
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      </Modal>
      <Modal animationType="slide" visible={idprocess > 0 ? true : false}>
        <IDProcessManager idprocess={idprocess} setIdprocess={setIdprocess} />
      </Modal>

      {/* 
            Hotel creation models
      */}
      <Modal
        animationType="slide"
        visible={hostModal > 0 && hostModal <= 3 ? true : false}>
        <HostWelcomeManager
          hostModal={hostModal}
          setHostModal={setHostModal}
          navigation={navigation}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={hostModal > 3 && hostModal <= 8 ? true : false}>
        <Step1Manager hostModal={hostModal} setHostModal={setHostModal} />
      </Modal>
      <Modal
        animationType="slide"
        visible={hostModal > 8 && hostModal <= 16 ? true : false}>
        <Step2Manager hostModal={hostModal} setHostModal={setHostModal} />
      </Modal>
      <Modal
        animationType="slide"
        visible={hostModal > 16 && hostModal <= 23 ? true : false}>
        <Step3Manager
          hostModal={hostModal}
          setHostModal={setHostModal}
          getHotelDetails={getHotelDetails}
        />
      </Modal>
      <ActivityIndicator
        animating={refreshing}
        style={styles.loader}
        size={40}
      />
    </View>
  );
};

export default HostHome;

const styles = StyleSheet.create({
  card: {
    width: '85%',
    backgroundColor: 'white',
    elevation: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginLeft: '5%',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },

  verificationText: {
    marginLeft: '5%',
    fontSize: SIZES.large,
    color: COLORS.black,
    fontWeight: '600',
  },

  headerCont: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  imgCont: {
    backgroundColor: COLORS.newBG,
    padding: 10,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 20,
  },

  profile: {
    width: 80,
    height: 80,
    elevation: 50,
    borderRadius: 50,
  },

  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
    backgroundColor: COLORS.newBG,
  },
  title: {
    width: '45%',
    color: COLORS.black,
    fontSize: SIZES.xxLarge,
    fontWeight: '500',
    marginBottom: 30,
    marginLeft: '5%',
    marginTop: 40,
  },
  subHeading: {
    marginLeft: '5%',
    marginVertical: 20,
    fontSize: SIZES.large,
    color: COLORS.black,
    fontWeight: '600',
  },
  reservationTitleList: {
    maxHeight: 52,
    marginLeft: '5%',
  },
  reservationType: {
    display: 'row',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    height: 40,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    borderRadius: 30,
  },
  reservationTypeText: {
    fontSize: SIZES.small,
    color: COLORS.textLightGrey,
    fontWeight: '600',
  },
  selectedReservationType: {
    display: 'row',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    height: 40,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    borderRadius: 30,
    backgroundColor: COLORS.black,
  },
  selectedReservationTypeText: {
    fontSize: SIZES.small,
    color: 'white',
    fontWeight: '400',
  },
  reservationsCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 20,
    minHeight: 220,
  },
  simpleText: {
    fontSize: SIZES.preMedium,
    color: COLORS.black,
    textAlign: 'center',
    maxWidth: '70%',
    marginBottom: 10,
    fontWeight: '300',
  },
  simpleText1: {
    fontSize: SIZES.medxLarge,
    color: COLORS.black,
    textAlign: 'center',
    maxWidth: '70%',
    marginBottom: 10,
    fontWeight: '500',
  },
  link: {
    fontSize: SIZES.preMedium,
    textDecorationLine: 'underline',
    color: COLORS.textLightGrey,
    marginVertical: 3,
    fontWeight: '500',
    marginTop: 15,
  },
  reservationCardList: {
    // width:'100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxHeight: 160,
  },
  loader: {
    position: 'absolute',
    top: '60%',
    left: '45%',
  },
});

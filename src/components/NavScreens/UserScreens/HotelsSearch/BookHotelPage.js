import {
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {images} from '../../../../constants';
import {COLORS, SIZES} from '../../../../constants/themes';
import HotelCard from './HotelDetails/cards/HotelCard';
import {useDispatch, useSelector} from 'react-redux';
import {setHotelList} from '../../../../redux/hotelList/actions';
import {setBookings} from '../../../../redux/UserBookings/actions';
import ShowBookings from './HotelDetails/ShowBookings/ShowBookings';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import RateHawk from './Ratehawk/RateHawk';
import RateHawkCard from './HotelDetails/cards/RateHawkCard';

const BookHotelPage = ({navigation, queryHotels, rateHawkHotel, filterQuery}) => {
  const [hotelProfile, setHotelProfile] = useState(false);

  const firstRender = useRef(true);
  const {user} = useSelector(state => state.userReducer);
  const {hotels} = useSelector(state => state.hotelsReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const {principle} = useSelector(state => state.principleReducer);
  // const {authData}=useSelector(state=>state.authDataReducer)
  const dispatch = useDispatch();
  const [hotelsList, setHotelsList] = useState([]);
  const [showReservation, setShowReservations] = useState(false);
  const sampleName = 'DreamLiner Hotel';
  const sampleDes = '2972 Westheimer Rd. Santa Ana, Illinois 85486 ';
  const [bookingList, setBookingList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // const [bottom,setBottom]=useState(70)

  // async function getReservations(setRefreshing) {
  //   setRefreshing(true);
  //   setBookingList([]);
  //   await actors?.bookingActor
  //     .getBookingId()
  //     .then(res => {
  //       console.log('getid resp : ', res);

  //       console.log('all bookings1: ', res[0]);
  //       if (res.length <= 0) {
  //         setRefreshing(false);
  //         return;
  //       }
  //       res.map(async r => {
  //         setRefreshing(true);
  //         console.log('booking-->', r);
  //         let hotelId = r.split('#')[0] + '#' + r.split('#')[1];
  //         console.log(hotelId);
  //         await actors?.bookingActor
  //           .getBookingDetials(r)
  //           .then(async resp => {
  //             let hotel = null;

  //             await actors?.hotelActor
  //               .getHotel(hotelId)
  //               .then(hRes => {
  //                 setRefreshing(false);
  //                 hotel = {...hRes[0], hotelId: hotelId};
  //               })
  //               .catch(err => {
  //                 console.log(err);
  //                 setRefreshing(false);
  //               });
  //             console.log('booking details : ', resp);
  //             console.log({...resp[0], hotel: hotel, bookingId: r});
  //             setBookingList(b => [
  //               ...b,
  //               {...resp[0], hotel: hotel, bookingId: r},
  //             ]);
  //           })
  //           .catch(err => {
  //             console.log(err);
  //             setRefreshing(false);
  //           });
  //       });
  //     })
  //     .catch(err => {
  //       console.log('getid err :', err);
  //       setRefreshing(false);
  //     });
  //   console.log('bookingList', bookingList);
  // }

  async function getReservations(setRefreshing){
    try{
      setRefreshing(true)
      console.log(actors?.bookingActor?.getAllUserBookings)
      let bookingRes=await actors?.bookingActor?.getAllUserBookings()

      if(bookingRes?.err!=undefined){
        setRefreshing(false)
        setBookingList([])
        return
      }
      console.log(bookingRes?.ok)
      let bookingListInfo = bookingRes?.ok

      setBookingList(bookingListInfo.reverse())
      setRefreshing(false)
      console.log("end of fetching bookings")
    }catch(err){
      console.log(err)
      setRefreshing(false)
    }
  }
  async function dispatchBookingData() {
    setShowReservations(true);
    console.log('final booking', bookingList);
  }
  async function getQueryHotelDetails() {
    const newArr = [];
    setRefreshing(true);
    if (queryHotels.length == 0) {
      setRefreshing(false);
      setHotelsList([]);
      return;
    }
    console.log('queryHotelsLength : ', queryHotels.length)
    for (let i = 0; i < queryHotels?.length; i++) {
      console.log(`Property ${i} ID : `, queryHotels[i].propertyId);
      // await actors.hotelActor
      //   ?.getHotel(queryHotels[i].hotelId)
      //   .then(res => {
      //     newArr.push({
      //       ...res[0],
      //       id: queryHotels[i].hotelId,
      //       details: queryHotels[i],
      //     });
      //     setRefreshing(false);
      //     setHotelsList([...newArr]);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     setRefreshing(false);
      //   });
      setRefreshing(false);
      setHotelsList([...queryHotels]);
    }
    // console.log(queryHotels)
  }
  const refresh = () => {
    // console.log(queryHotels);
    filterQuery();
    getQueryHotelDetails();
    getReservations(setRefreshing);
  };

  // useEffect(()=>{
  //     Keyboard.addListener('keyboardDidShow',()=>{
  //         setBottom(0)
  //     })
  //     Keyboard.addListener('keyboardDidHide',()=>{
  //         setBottom(70)
  //     })
  // })

  useEffect(() => {
    if (firstRender.current) {
      console.log(firstRender.current);
      firstRender.current = false;
    } else {
      getQueryHotelDetails();
      // getReservations()
    }
  }, [queryHotels, principle]);

  if (hotelsList?.length > 0 || rateHawkHotel?.length > 0) {
    return (
      <>
        <View style={styles.btnCont}>
          <TouchableOpacity style={[styles.btn]} onPress={refresh}>
            <Icon2 name="reload-circle-sharp" size={20} color={COLORS.black} />
            <Text style={styles.btnText}>Reload Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={()=>setShowReservations(true)}>
            <Icon name="address-book" size={20} color={COLORS.black} />
            <Text style={styles.btnText}>Show my bookings</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{width: '100%', marginBottom: 65, backgroundColor:'#F5F5F5'}}>
          {hotelsList.map((item, index) => {
            return (
              <HotelCard key={index} item={item} navigation={navigation} />
            );
          })}

          {rateHawkHotel.map((item, index) => {
            return (
              <RateHawkCard key={index} item={item} navigation={navigation} />
            );
          })}
        </ScrollView>

        <Modal
          animationType="slide"
          visible={showReservation}
          onRequestClose={() => setShowReservations(false)}>
          <ShowBookings
            getReservations={getReservations}
            bookingList={bookingList}
            setShowReservations={setShowReservations}
          />
        </Modal>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.btnCont}>
          <TouchableOpacity style={[styles.btn]} onPress={refresh}>
            <Icon2 name="reload-circle-sharp" size={20} color={COLORS.black} />
            <Text style={styles.btnText}>Reload Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={dispatchBookingData}>
            <Icon name="address-book" size={20} color={COLORS.black} />
            <Text style={styles.btnText}>Show my bookings</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.empty}>Please hold on while we fetch the best hotel options for you.{"\n"}If no results appear, try adjusting your search criteria.</Text>
        <ActivityIndicator animating={true} size={40} color={COLORS.black} style={styles.loader} />
        <Modal
          animationType="slide"
          visible={showReservation}
          onRequestClose={() => setShowReservations(false)}>
          <ShowBookings
            getReservations={getReservations}
            bookingList={bookingList}
            setShowReservations={setShowReservations}
          />
        </Modal>
      </>
    );
  }
};

export default BookHotelPage;

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: '45%',
    marginHorizontal: '50%',
  },
  hotelPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '98%',
    backgroundColor: COLORS.mainPurple,
    paddingTop: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.mainPurple,
    marginLeft: 4,
    // marginBottom:20
  },
  title: {
    fontSize: SIZES.preMedium,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  img: {
    width: '80%',
    height: 240,
    borderRadius: 30,
    marginBottom: 10,
  },
  desc: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.6,
    width: '80%',
  },
  bookBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  bookTxt: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: SIZES.medium,
  },
  descCont: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
  },
  btnCont: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: '8%',
    backgroundColor: COLORS.newBG,
    paddingBottom: 10,
  },
  btn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '45%',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 8,
    elevation: 10,
  },
  btnText: {
    color: COLORS.black,
    fontSize: SIZES.small,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  empty: {
    width: '90%',
    height: 180,
    fontSize: 17,
    color: COLORS.textLightGrey,
    fontWeight: '500',
    backgroundColor: COLORS.white,
    borderWidth:1,
    borderRadius: 20,
    marginTop: 40,
    marginLeft: '5%',
    textAlign: 'center',
    paddingTop: 20,
    paddingHorizontal: 20

  },
});

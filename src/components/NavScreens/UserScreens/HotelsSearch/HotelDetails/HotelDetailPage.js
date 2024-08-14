import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS, SIZES} from '../../../../../constants/themes';
import {images} from '../../../../../constants';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import HostBand from './cards/HostBand';
import HotelFacilityCard from './cards/HotelFacilityCard';
import ReserveBtn from './cards/ReserveBtn';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Reviews from './subComponents/Reviews/Reviews';
import {useSelector} from 'react-redux';
import BookingFormComp from './BookingForm/BookingFormComp';
import FirstForm from './BookingForm/FirstForm';
import {Principal} from '@dfinity/principal';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const HotelDetailPage = ({item, setOpen, navigation}) => {
  const btmBtn = useRef(null);
  const [hotelReviews, setHotelReviews] = useState([]);
  const [bookingForm, setBookingForm] = useState(false);
  const [hotelRating, setHotelRating] = useState();
  const {actors} = useSelector(state => state.actorReducer);
  const [host, setHost] = useState({});

  //   console.log('Item : ', item);
  console.log('host : ', host.userImage);

  const getHotelRating = async () => {
    console.log('HID : ', item?.propertyId);

    try {
      let ratingRes = await actors?.reviewActor.getHotelRating(
        item?.propertyId,
      );
      console.log('Rating : ', ratingRes);
      if (ratingRes?.err != undefined) {
        setHotelRating(5);
        return;
      }
      setHotelRating(parseInt(ratingRes?.ok));
    } catch (err) {
      console.log(err);
      setHotelRating(5);
    }
  };

  const getAllReviews = async () => {
    console.log('Calling all reviews');
    console.log('Actor : ', actors?.reviewActor);
    console.log('Item : ', item?.propertyId);
    let Revs = [];

    try {
      let reviewResp = await actors?.reviewActor.getAllReviewsOnHotel(
        item?.propertyId,
      );

      console.log('Review Resp : ', reviewResp);

      if (reviewResp?.err != undefined) {
        setHotelReviews([]);
      } else {
        setHotelReviews(reviewResp?.ok);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getHostDetails = async () => {
    try {
      const hostId = item?.propertyId?.split('#')[0];
      let userResp = await actors?.userActor?.getUserByPrincipal(
        Principal.fromText(hostId),
      );

      console.log('User Resp : ', userResp);

      if (userResp?.err != undefined) {
        console.log('Error in getting user');
      } else {
        setHost(userResp?.ok); // ---- Check this
        console.log(userResp?.ok.userID); // ---- Check this
      }
    } catch (err) {
      console.log(err);
    }
  };
  // const calculateRating=()=>{
  //     let total=0
  //     for(let i=0;i<hotelReviews.length;i++){
  //         total+=parseInt(hotelReviews[i].rating)
  //     }
  //     console.log(parseFloat(total/hotelReviews.length))
  //     setHotelRating(parseFloat(total/hotelReviews.length))
  // }
  useEffect(() => {
    console.log('Item : ', item);

    btmBtn.current.present();
    getAllReviews();
    getHostDetails();
    getHotelRating();
  }, []);

  // useEffect(()=>{
  //     calculateRating()
  // },[hotelReviews])
  return (
    <BottomSheetModalProvider>
      <ScrollView>
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              setOpen(false);
            }}>
            <Icon name="angle-left" size={30} color={COLORS.white} />
          </TouchableOpacity>
          <Image source={{uri: item.imageList[0]}} style={styles.hotelImg} />
          {/* <Image source={images.hotel} style={styles.hotelImg}/> */}
          <View style={styles.hotelTitleReviewCont}>
            <View style={styles.hotelTitleCont}>
              <Text style={styles.hotelTitle}>{item?.propertyName}</Text>
              {/* <TouchableOpacity style={styles.likeCont}>
                <Icon2 name="hearto" size={20} color={COLORS.textLightGrey} />
              </TouchableOpacity> */}
            </View>

            {/* ------ */}
            {/* <View style={styles.hotelReviewCont}>
              <Icon2
                name="star"
                size={12}
                color={COLORS.black}
                style={{marginRight: 5}}
              />

              <Text style={styles.hotelReviewText}>
                {hotelRating} • {hotelReviews.length}{' '}
                {hotelReviews.length == 1 ? 'review' : 'reviews'} •{' '}
                {item?.location}
              </Text>
            </View> */}
            {/* ------ */}
          </View>
          <HostBand
            rooms={item.rooms}
            hostData={host}
            hotelRating={hotelRating}
            hotelReviews={hotelReviews}
          />
          <View style={[styles.allCont, {marginVertical: 25}]}>
            <HotelFacilityCard hostData={host} />
          </View>
          <View style={styles.hrLine}></View>
          <View style={styles.descritionCont}>
            <Text style={{color: COLORS.black, opacity: 0.7}}>
              {item?.propertyDescription}
            </Text>

            <TouchableOpacity>
              <Text
                style={{
                  color: COLORS.black,
                  opacity: 0.7,
                  textDecorationLine: 'underline',
                  marginVertical: 12,
                }}>
                Show more
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hrLine}></View>

          <View style={styles.descritionCont}>
            <Text
              style={{
                color: COLORS.black,
                fontWeight: 'bold',
                fontSize: 16,
                marginVertical: 10,
              }}>
              What this place offers
            </Text>
            {item?.amenities.map((amenity, index) => {
              return (
                <Text
                  key={index}
                  style={{
                    color: COLORS.black,
                    opacity: 0.7,
                    marginBottom: 5,
                  }}>
                  {' '}
                  - {amenity}
                </Text>
              );
            })}
          </View>

          {/* <View style={styles.hrLine}></View> */}
          <Reviews hotelReviews={hotelReviews} hotelRating={hotelRating} />
          {/* ------------- */}
          <View style={styles.hrLine}></View>

          <View style={styles.secondBand}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 15}}>
              <Image source={{uri: host?.userImage}} style={styles.img} />
              <View>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: SIZES.medium,
                    fontWeight: '500',
                    marginBottom: 10,
                  }}>
                  Hosted by {host?.firstName}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
                  <Icon3 name="verified" size={20} color={COLORS.black} />
                  <Text style={{color: COLORS.black}}>Identity verified</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                let hostId = item?.propertyId?.split('#')[0];
                console.log(host?.userID, 'hp', hostId);
                navigation.navigate('UserChat', {newChat: hostId});
                setOpen(false);
              }}>
              <Text style={styles.btnText}>Chat with {host?.firstName}</Text>
            </TouchableOpacity>
          </View>

          {/* ------------- */}
          {/* <View style={styles.hrLine}></View> */}

          <BottomSheetModal
            ref={btmBtn}
            index={0}
            snapPoints={['13']}
            backgroundStyle={{backgroundColor: COLORS.white}}
            style={{elevation: 10, backgroundColor: COLORS.mainnGrey}}>
            <ReserveBtn item={item} onClick={() => setBookingForm(true)} />
          </BottomSheetModal>

          <Modal animationType="slide" visible={bookingForm} transparent>
            <FirstForm
              setBookingForm={setBookingForm}
              item={item}
              setOpen={setOpen}
            />
          </Modal>
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
};

export default HotelDetailPage;

const styles = StyleSheet.create({
  bottomSheet: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 100,
    backgroundColor: COLORS.newBG,
  },
  backIcon: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    justifyContent: 'flex-start',
    paddingLeft: 20,
    position: 'absolute',
    zIndex: 1,
  },
  hotelImg: {
    width: '100%',
    height: 220,
  },
  hotelTitle: {
    width: '90%',
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 15,
  },
  hotelTitleReviewCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '90%',
    marginTop: 15,
    marginLeft: 40,
  },
  hotelTitleCont: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'flex-start',
  },
  likeCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  descritionCont: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  secondBand: {
    backgroundColor: COLORS.white,
    width: '85%',
    // height: 150,
    elevation: 10,
    borderRadius: 12,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },

  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  hotelReviewCont: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  hotelReviewText: {
    width: '80%',
    fontSize: SIZES.xSmall,
    color: 'black',
    marginBottom: 15,
    opacity: 0.6,
  },
  allCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  hrLine: {
    height: 2,
    borderBottomWidth: 0.25,
    borderBottomColor: COLORS.black,
    width: '100%',
    marginBottom: 20,
    opacity: 0.4,
  },
  btn: {
    width: '100%',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: COLORS.black,
    marginVertical: 10,
  },
  btnText: {
    fontSize: SIZES.preMedium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

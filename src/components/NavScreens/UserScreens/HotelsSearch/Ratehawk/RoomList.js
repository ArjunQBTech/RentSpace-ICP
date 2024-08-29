import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useState, useEffect} from 'react';
import {COLORS} from '../../../../../constants/themes';
import Line from '../Filters/ReUsables/Line';
import axios from 'axios';
import RateHawkBookingPage from './RateHawkBookingPage';
import { nodeBackend } from '../../../../../../DevelopmentConfig';

const RoomList = ({
  hotelId,
  checkInDate,
  checkOutDate,
  hotelName,
  hotelAddress,
}) => {
  console.log('Hotel ID : ', hotelId);
  console.log('CheckIn Date : ', checkInDate);
  console.log('CheckOut Date : ', checkOutDate);
  console.log('Hotel Name : ', hotelName);
  console.log('Hotel Address : ', hotelAddress);

  const [roomsList, setRoomsList] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [noRoomAvailable, setNoRoomAvailable] = useState(false);

  const [transferData, setTransferData] = useState({
    hotelName: hotelName,
    hotelAddress: hotelAddress,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  });

  // const baseUrl = 'https://rentspace.kaifoundry.com';
  // const baseUrl='http://localhost:5000'
  const baseUrl = nodeBackend;

  console.log('Base URL : ', baseUrl)

  const fetchHash = async () => {

    // sample hardcoded data for testing
    const postData = {
      hotelId: hotelId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      language: 'en',
      adults: 2,
      children: [16],
    };

    console.log('Post Data : ', postData);

    await axios
      .post(`${baseUrl}/api/v1/hotel/RateHawk/bookHotel`, postData)
      .then(response => {
        if (
          response?.data?.data?.data?.hotels[0]?.rates[0].book_hash ===
          undefined
        ) {
          console.log('No Room Available');
          setLoading(false);
          setNoRoomAvailable(true);
        } else {
          console.log(
            response?.data?.data?.data?.hotels[0]?.rates[0].book_hash,
          );
          setRoomsList(response?.data?.data?.data?.hotels[0]?.rates);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchHash();
    
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.marginView}>
        <Text style={styles.pageTitle}>Room Type Selection</Text>
      </View>
      <Line />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            animating={true}
            size={40}
            color={COLORS.mainPurple}
            style={styles.loader}
          />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.marginView}>
            <Text style={styles.hotelName}>{hotelName}</Text>
            <Text style={styles.hotelAdd}>{hotelAddress}</Text>
          </View>
          <View style={styles.marginView}>
            {roomsList.map((room, index) => {
              return (
                <View style={styles.card} key={index}>
                  <Image source={{uri: room.images[0]}} style={styles.img} />
                  <View style={styles.innerCard}>
                    <View style={styles.cardUp}>
                      <Text style={styles.roomType}>{room.room_name}</Text>
                      <Text style={styles.occupancy}>2 Person</Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: COLORS.mainGrey,
                        height: 0.5,
                      }}
                    />
                    <View style={styles.cardDown}>
                      <Text style={styles.price}>
                        €
                        {parseFloat(
                          Number(
                            room.payment_options.payment_types[0].show_amount,
                          ) * 1.08,
                        ).toFixed(2)}
                        /Night
                      </Text>
                      <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => console.log(room.book_hash)}>
                        <Text style={styles.bookBtnText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* only for integration testing */}
            <Text style={[styles.hotelName, {marginVertical: 10}]}>
              {noRoomAvailable ? 'No Room Available' : null}
            </Text>
            <View style={styles.card}>
              <View style={styles.innerCard}>
                <View style={styles.cardUp}>
                  <Text style={styles.roomType}>Testing Hotel</Text>
                  <Text style={styles.occupancy}>2 Person</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.mainGrey,
                    height: 0.5,
                  }}
                />
                <View style={styles.cardDown}>
                  <Text style={styles.price}>$100.00/Night</Text>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    // onPress={() => testorderBookingForm()}
                    onPress={() => {
                      setTransferData({
                        hotelName : "Testing Hotel Room",
                        hotelAddress: hotelAddress,
                        checkInDate: checkInDate,
                        checkOutDate: checkOutDate,
                      
                      })
                      setShowBookingForm(true)}}>
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal visible={showBookingForm}>
        <RateHawkBookingPage
          showSelf={setShowBookingForm}
          // hotelName={hotelName}
          // hotelAddress={hotelAddress}
          // checkInDate={checkInDate}
          // checkOutDate={checkOutDate}
          transferData={transferData}
        />
      </Modal>
    </View>
  );
};

export default RoomList;

const styles = StyleSheet.create({
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  loader: {
    position: 'absolute',
    top: '40%',
    marginHorizontal: '50%',
  },

  container: {
    backgroundColor: COLORS.newBG,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  marginView: {
    marginHorizontal: 20,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: COLORS.textLightGrey,
  },

  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.textLightGrey,
  },

  hotelAdd: {
    fontSize: 11,
    fontWeight: 'medium',
    marginBottom: 15,
    color: COLORS.textLightGrey,
  },

  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.black,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
  },

  innerCard: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: 180,
    borderRadius: 5,
  },

  cardUp: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    height: '60%',
  },

  roomType: {
    fontSize: 25,
    color: COLORS.black,
    fontWeight: 'bold',
  },

  occupancy: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: 'medium',
    backgroundColor: COLORS.black,
    width: 85,
    height: 30,
    borderRadius: 5,
    textAlign: 'center',
    paddingVertical: 5,
    marginVertical: 5,
  },

  cardDown: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: '40%',
  },

  price: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: 'bold',
  },

  bookBtn: {
    backgroundColor: COLORS.black,
    width: 120,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookBtnText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

import {
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

const RoomList = ({hotelId}) => {
  console.log(hotelId);

  const [roomsList, setRoomsList] = useState([]);

  const fetchHash = async hotelId => {
    const postData = {
      hotelId: hotelId,
      checkInDate: '2024-05-25',
      checkOutDate: '2024-05-28',
      language: 'en',
      adults: 2,
      children: [],
    };

    await axios
      .post('http://localhost:5000/api/v1/hotel/RateHawk/bookHotel', postData)
      .then(response => {
        // console.log(response?.data?.data?.data?.hotels[0]?.rates[0].book_hash);
        setRoomsList(response?.data?.data?.data?.hotels[0]?.rates);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchHash(hotelId);
  }, []);


  // ------------------- Integration Testing -------------------

  // testing function for orderBookingForm
  async function testorderBookingForm() {
    postData = {
      book_hash: 'h-99b47e0c-c401-5d59-849d-61ca4219a4af', // change everytime
      language: 'en',
      user_ip: '125.23.171.6',
    };

    await axios
      .post(
        'http://localhost:5000/api/v1/hotel/RateHawk/orderBookingForm',
        postData,
      )
      .then(response => {
        console.log('Item_ID : ', response.data.data.item_id);
        console.log('Partner_ID : ', response.data.data.partner_order_id);
        // console.log('Payment_Types : ', response.data.data.payment_type);
        const item_id = response.data.data.item_id;
        const partner_order_id = response.data.data.partner_order_id;
        const payment_types = response.data.data.payment_type;
        testCreditCardTokenization(item_id, partner_order_id, payment_types);
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  // testing function for Credit Card Tokenization
  async function testCreditCardTokenization(
    item_id,
    partner_order_id,
    payment_types,
  ) {
    const postData = {
      object_id: String(item_id),
      user_first_name: 'Isabelle',
      user_last_name: 'Mitchell',
      card_holder: 'Isabelle Mitchell',
      card_number: '4851728717006520',
      cvc: '378',
      is_cvc_required: true,
      month: '09',
      year: '24',
    };

    await axios
      .post(
        'http://localhost:5000/api/v1/hotel/RateHawk/crediCardTokenization',
        postData,
      )
      .then(response => {
        // console.log(response.data);
        // console.log(payment_types);
        const pay_uuid = response.data.pay_uuid;
        const init_uuid = response.data.init_uuid;
        // console.log("PAY_UUID : ",pay_uuid);
        // console.log("INIT_UUID : ",init_uuid);
        testOrderBookingFinish(
          partner_order_id,
          payment_types,
          pay_uuid,
          init_uuid,
        );
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  // testing function for orderBookingFinish

  async function testOrderBookingFinish(
    partner_order_id,
    payment_types,
    pay_uuid,
    init_uuid,
  ) {
    const postData = {
      email: 'athsam@gmail.com',
      phone: '9914173314',
      partner_order_id: String(partner_order_id),
      language: 'en',
      guests: [
        {
          first_name: 'Atharva',
          last_name: 'Bhatnagar',
        },
        {
          first_name: 'Saumya',
          last_name: 'Shahu',
        },
      ],
      payment_type: {
        type: payment_types[0].type,
        amount: payment_types[0].amount,
        currency_code: payment_types[0].currency_code,
        pay_uuid: pay_uuid,
        init_uuid: init_uuid,
      },
      return_path: 'google.com',
    };

    // console.log("POST DATA : ",postData);
    await axios
      .post(
        'http://localhost:5000/api/v1/hotel/RateHawk/orderBookFinish',
        postData,
      )
      .then(response => {
        // console.log(response.data);
        testOrderBookingFinishStatus(partner_order_id);
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  // testing function for orderBookingFinishStatus

  async function testOrderBookingFinishStatus(partner_order_id) {
    
    console.log(partner_order_id)
    const postData = {
      partner_order_id: partner_order_id
    };

    await axios
      .post(
        'http://localhost:5000/api/v1/hotel/RateHawk/orderBookFinishStatus',
        postData,
      )
      .then(response => {
        console.log("Final CLG")
        console.log(response.data);
      })
      .catch(error => {
        console.error(error.message);
      });
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.marginView}>
        <Text style={styles.pageTitle}>Room Type Selection</Text>
      </View>
      <Line />

      <ScrollView>
        <View style={styles.marginView}>
          <Text style={styles.hotelName}>Manhattan Tower Apartment Hotel</Text>
          <Text style={styles.hotelAdd}>
            4140 Parker Rd. Allentown, New Mexico 31134
          </Text>
        </View>
        <View style={styles.marginView}>
          {roomsList.map((room, index) => {
            return (
              <View style={styles.card}>
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
          <View style={styles.card}>
            <View style={styles.innerCard}>
              <View style={styles.cardUp}>
                <Text style={styles.roomType}>Testing Room</Text>
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
                  onPress={() => testorderBookingForm()}
                  >
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      


    </View>
  );
};

export default RoomList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.mainGrey,
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
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 15,
  },

  innerCard: {
    backgroundColor: COLORS.mainPurple,
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
    color: COLORS.white,
    fontWeight: 'bold',
  },

  occupancy: {
    fontSize: 15,
    color: COLORS.mainPurple,
    fontWeight: 'medium',
    backgroundColor: COLORS.white,
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
    color: COLORS.white,
    fontWeight: 'bold',
  },

  bookBtn: {
    backgroundColor: COLORS.white,
    width: 120,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookBtnText: {
    fontSize: 12,
    color: COLORS.mainPurple,
    fontWeight: 'bold',
  },
});

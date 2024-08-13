import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {COLORS, SIZES} from '../../../../../../constants/themes';
import Icon from 'react-native-vector-icons/Entypo';
import {Calendar} from 'react-native-calendars';
import {useSelector} from 'react-redux';
import BookingFormComp from './BookingFormComp';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';

const FirstForm = ({setBookingForm, item, setOpen}) => {
  const [selected, setSelected] = useState('');
  const [guests, setGuests] = useState('1');
  const {user} = useSelector(state => state.userReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const {principle} = useSelector(state => state.principleReducer);
  const [loading, setLoading] = useState(false);
  const [paymentScreen, setPaymentScreen] = useState(false);
  const [bookingAnimation, showBookingAnimation] = useState(false);
  const [booking, setBooking] = useState({
    hotelId: item?.propertyId,
    checkInDate: '',
    checkOutDate: '',
    bookingDuration: 1,
  });

  const [checkInDate, setCheckInDate] = useState({
    date: '',
    marked: false,
  });

  const validateData = useCallback(()=>{
    if(booking.checkInDate==='' || booking.checkOutDate==='' || booking.bookingDuration <= 0 || guests===0){
      return false
    } else {
      return true
    }
  },[booking, guests, item])

  // console.log("item on 1st form : ", item.payPalId);
  const book = async (booking, notify) => {
    if (booking.paymentStatus) {
      setLoading(true);
      await actors?.bookingActor
        .bookHotel(item?.propertyId, booking)
        .then(res => {
          console.log(res);
          console.log(booking);
          setLoading(false);
          // alert("Your booking is confirmed!")
          notify();
          // setOpen(false)
          showBookingAnimation(true);
          setTimeout(() => {
            setBookingForm(false);
            setOpen(false);
          }, 3000);
        })
        .catch(err => {
          console.log(booking, item?.propertyId);
          console.log(err);
          // alert(err)
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'ERROR',
            textBody: err,
            button: 'OK',
          });
          setLoading(false);
        });
    } else {
      // alert("You need to complete the payment first!")
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'WARNING',
        textBody: 'You need to complete the payment first',
        button: 'OK',
      });
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setBookingForm(false);
          }}>
          <Icon name="cross" size={20} color={COLORS.textLightGrey} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setSelected('')
          setCheckInDate({
            date: '',
            marked: false,
          })
          setBooking({...booking, checkInDate: '', checkOutDate: ''})
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: SIZES.preMedium - 1,
              fontWeight: '700',
            }}>
            CLEAR DATES
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textCont}>
        <View style={styles.textContHorz}>
          <TextInput
            value={parseInt(booking.bookingDuration)}
            placeholder="1"
            placeholderTextColor={COLORS.textLightGrey}
            style={[
              styles.boldLargeText,
              {
                width: 50,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: COLORS.textLightGrey,
                textAlign: 'center',
                padding: 0,
                height: 30,
                marginRight: 10,
              },
            ]}
            onChangeText={value => {
              setBooking({...booking, bookingDuration: parseInt(value)});
              console.log('something');
            }}
            keyboardType="numeric"
          />
          <Text style={styles.boldLargeText}>night</Text>
        </View>
        <Text style={styles.smallText}>no. of days</Text>
      </View>
      <View style={styles.textCont}>
        <Text style={styles.boldSmallText}>No. of guests</Text>
        <View style={styles.textContHorz}>
          <TextInput
            value={guests}
            placeholder="1"
            placeholderTextColor={COLORS.black}
            onChangeText={value => setGuests(value)}
            style={[
              styles.smallText,
              {
                width: 50,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: COLORS.textLightGrey,
                textAlign: 'center',
                padding: 0,
                height: 30,
                marginRight: 10,
              },
            ]}
            keyboardType="numeric"
          />
          <Text style={styles.smallText}>guests</Text>
        </View>
      </View>
      <View style={[styles.textCont, {marginBottom: 0}]}>
        <Text style={styles.boldSmallText}>Check In date :</Text>
        <Text style={styles.smallText}>{booking.checkInDate}</Text>
      </View>
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
          setCheckInDate({
            date: day.dateString,
            marked: true,
          })
          setBooking({
            ...booking,
            // date:`${(day.day<10)?"0"+day.day:day.day}/${(day.month<10)?"0"+day.month:day.month}/${day.year}`,
            checkOutDate: `${
              day.day + booking.bookingDuration < 10
                ? '0' + (day.day + booking.bookingDuration)
                : day.day + booking.bookingDuration
            }/${day.month < 10 ? '0' + day.month : day.month}/${day.year}`,

            checkInDate: `${day.day < 10 ? '0' + day.day : day.day}/${
              day.month < 10 ? '0' + day.month : day.month
            }/${day.year}`,
          });          
        }}
        style={styles.calendar}
        markedDates={{
          [checkInDate.date]: {
            selected: checkInDate.marked,
            selectedColor: COLORS.black,
            
          },
        }}
        minDate={`${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`}
      />
      <View style={styles.bottomCont}>
        {/* <Text style={styles.btmPriceText}>${item?.hotelPrice}/night</Text> */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            // console.log('booking : 123 : ', booking);
            // setPaymentScreen(true);
            if(validateData()) {
              setPaymentScreen(true);
            } else {
              Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'WARNING',
                textBody: 'Please fill all the fields correctly!',
                button: 'OK',
              })
            }
          }}>
          <Text style={styles.btnText}>Pay and Confirm</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" visible={paymentScreen}>
        {/* <PaymentScreen setBooking={setBooking} booking={booking} item={item} self={setPaymentScreen}/> */}
        <BookingFormComp
          setBookingForm={setPaymentScreen}
          setBooking={setBooking}
          booking={booking}
          item={item}
          loading={loading}
          book={book}
          setLoading={setLoading}
          showBookingAnimation={showBookingAnimation}
          bookingAnimation={bookingAnimation}
          setOpen={setOpen}
          days={booking.bookingDuration}
        />
      </Modal>
    </View>
  );
};

export default FirstForm;

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    height: '93%',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    position: 'absolute',
    bottom: 0,
    alignItems: 'flex-start',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 5,
    marginLeft: '5%',
    marginTop: 5,
    marginBottom: 20,
  },
  textCont: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginBottom: 20,
  },
  calendar: {
    marginHorizontal: 35,
    borderRadius: 10,
    elevation: 2,
    marginTop: '5%',
    minWidth: '85%',
    marginLeft: '7.5%',
  },
  textContHorz: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldLargeText: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: SIZES.large,
    padding: 1,
  },
  boldSmallText: {
    color: COLORS.black,
    fontSize: SIZES.small,
    fontWeight: '700',
  },
  smallText: {
    color: COLORS.black,
    opacity: 0.9,
    fontSize: SIZES.small + 1,
    padding: 0,
  },
  bottomCont: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'white',
    elevation: 10,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    paddingHorizontal: '5%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  btn: {
    width: '43%',
    backgroundColor: COLORS.black,
    borderRadius: 8,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    right: 0,
  },
  btnText: {
    color: 'white',
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  btmPriceText: {
    color: COLORS.black,
    fontSize: SIZES.preMedium,
    fontWeight: 'bold',
  },
});

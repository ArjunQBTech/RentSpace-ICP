import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import BottomBtn from '../../Reusables/BottomBtn';
import SaveBtn from '../../Reusables/SaveBtn';
import {COLORS, SIZES} from '../../../../constants/themes';
import PropertiesCard from '../../../NavScreens/UserScreens/HotelsSearch/Filters/PropertyTypes/PropertiesCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Fontisto';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import AmenityCard from '../../../NavScreens/UserScreens/HotelsSearch/Filters/Amenities/AmenityCard';
import {useDispatch, useSelector} from 'react-redux';
import {setListing} from '../../../../redux/NewListing/actions';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';

const amenitiesList = [
  {name: 'wifi', icon: <Icon name="wifi" size={28} />},
  {name: 'gym', icon: <Icon2 name="dumbbell" size={28} />},
  {name: 'tv', icon: <Icon name="tv" size={28} />},
  {
    name: 'laundry',
    icon: <Icon3 name="washing-machine" size={28} />,
  },
  {name: 'parking', icon: <Icon4 name="car" size={28} />},
  {
    name: 'medication',
    icon: <Icon2 name="briefcase-medical" size={28} />,
  },
  {
    name: 'gaming',
    icon: <Icon name="gamepad" size={28} />,
  },
  {
    name: 'dining',
    icon: <Icon5 name="local-dining" size={28} />,
  },
];
const propertyTypesList = [
  {name: 'House', icon: <Icon name="home" size={24} color={COLORS.black} />},
  {
    name: 'Villa',
    icon: <Icon5 name="villa" size={24} color={COLORS.black} />,
  },
  {
    name: 'Apartment',
    icon: <Icon5 name="apartment" size={24} color={COLORS.black} />,
  },
  {
    name: 'Hotel',
    icon: <Icon name="building-o" size={24} color={COLORS.black} />,
  },
  {
    name: 'Resort',
    icon: <Icon4 name="holiday-village" size={24} color={COLORS.black} />,
  },
  {
    name: 'Glamping',
    icon: <Icon4 name="tent" size={24} color={COLORS.black} />,
  },
];

const Amenities = ({setHostModal, pos}) => {
  const [propertyType, setPropertyType] = useState(propertyTypesList[0].name);
  const [amenities, setAmenities] = useState([]);
  const {listing} = useSelector(state => state.listingReducer);
  const dispatch = useDispatch();

  const emptyCheck = () => {
    if (amenities.length == 0) {
      // Alert.alert('No aminities slected!', 'Select atleast one aminity');
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'No aminities selected!',
        textBody: 'Select atleast one aminity',
        button: 'OK',
      });

      return false;
    } else {
      dispatch(
        setListing({
          ...listing,
          amenities: amenities,
          propertyType: propertyType,
        }),
      );
      return true;
    }
  };

  return (
    <View style={styles.view}>
      {/* <SaveBtn setHostModal={setHostModal} /> */}
      <Text style={styles.title}>Property Type</Text>
      <View style={[styles.listCont, {marginBottom: 30}]}>
        {propertyTypesList.map((item, index) => (
          <TouchableOpacity
            style={
              propertyType == item?.name
                ? [styles.card, {borderBottomWidth: 2}]
                : styles.card
            }
            onPress={() => setPropertyType(item?.name)}>
            {item?.icon}
            <Text style={styles.text}>{item?.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.title}>Amenities</Text>
      <View style={styles.listCont}>
        {amenitiesList.map((item, index) => {
          return (
            <AmenityCard
              item={item}
              key={index}
              amenities={amenities}
              setAmenities={setAmenities}
            />
          );
        })}
      </View>
      <BottomBtn
        setHostModal={setHostModal}
        // pos={pos}
        // pos={propertyType == 'Hotel' || propertyType == 'Resort' ? 5 : 6}
        pos={5}
        step={1}
        nextFunc={emptyCheck}
      />
    </View>
  );
};

export default Amenities;

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.newBG,
  },
  title: {
    width: '88%',
    color: COLORS.black,
    fontSize: SIZES.xxLarge,
    fontWeight: '500',
    marginLeft: '8%',
    marginTop: 25,
  },
  listCont: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
    columnGap: 30,
    rowGap: 20,
    marginLeft: '7.55%',
    marginVertical: 20,
    paddingLeft: 5,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1.5,
    width: '23%',
    borderRadius: 4,
    borderBottomColor: COLORS.black,
  },
  text: {
    color: COLORS.black,
    fontSize: SIZES.small,
    fontWeight: '400',
    marginTop: 5,
  },
});

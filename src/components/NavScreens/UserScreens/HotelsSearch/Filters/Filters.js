import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SIZES} from '../../../../../constants/themes';
import Iconn from 'react-native-vector-icons/Entypo';
import TypeOfPlace from './TypeOfPlace';
import Line from './ReUsables/Line';
import PriceRange from './PriceRange';
import PropertyTypes from './PropertyTypes/PropertyTypes';
import Amenities from './Amenities/Amenities';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Fontisto';
import Icon5 from 'react-native-vector-icons/MaterialIcons';

const Filters = ({setShowFilters, query, setQuery}) => {
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

  const [maxPrice, setMaxPrice] = useState(query.maxPrice);
  const [propertyType, setPropertyType] = useState(propertyTypesList[3].name);
  const [amenities, setAmenities] = useState([]);
  return (
    <View style={styles.view}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cross}
          onPress={() => setShowFilters(false)}>
          <Iconn name="cross" color={COLORS.black} size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Filters</Text>
      </View>
      <ScrollView style={styles.scrollPart}>
        {/* <TypeOfPlace />
        <Line /> */}
        {/* <PriceRange maxPrice={maxPrice} setMaxPrice={setMaxPrice} /> */}
        {/* <Line /> */}
        <PropertyTypes
          list={propertyTypesList}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
        />
        {/* <Line /> */}
        <Amenities
          amenitiesList={amenitiesList}
          amenities={amenities}
          setAmenities={setAmenities}
        />
        {/* <Line /> */}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.placeHolder} />
        <TouchableOpacity
          onPress={() => {
            setMaxPrice(0);
            setPropertyType('');
            setAmenities([]);
          }}>
          <Text style={styles.link}>Clear all</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            // setQuery(
            //   `maxPrice=${maxPrice}&pageSize=${25}&amenities=${amenities}&propertyType=${propertyType}`,
            // );
            setQuery({
              ...query,
              maxPrice: maxPrice,
              pageSize: 25,
              amenities: amenities,
              propertyType: propertyType,
              location: query.location,
            });
            setShowFilters(false);
          }}>
          <Text style={styles.btnText}>Show places</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: '0%',
    height: '93%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    elevation: 50
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom:10
  },
  cross: {
    position: 'absolute',
    left: '3%',
  },
  title: {
    color: COLORS.black,
    fontWeight: '800',
    fontSize: SIZES.medium,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: '0%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  link: {
    color: COLORS.textLightGrey,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontSize: SIZES.medium,
  },
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 12,
    paddingVertical: 12,
    width: '40%',
  },
  btnText: {
    fontSize: SIZES.preMedium + 1,
    fontWeight: '800',
    color: 'white',
  },
  placeHolder: {
    position: 'absolute',
    width: '6%',
    backgroundColor: COLORS.textLightGrey,
    height: 3,
    left: '47%',
    borderRadius: 2,
    top: '15%',
    opacity: 0.5,
  },
  scrollPart: {
    width: '100%',
    marginBottom: 100,
  },
});

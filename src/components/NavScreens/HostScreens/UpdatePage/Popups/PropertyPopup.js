import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../../../../constants/themes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Fontisto';

const PropertyPopup = ({propertyType, setPropertyType}) => {

  const propertiesList = [
    {name: 'House', icon: 'house', class: 0},
    {name: 'Villa', icon: 'villa', class: 0},
    {name: 'Apartment', icon: 'apartment', class: 0},
    {name: 'Hotel', icon: 'hotel', class: 0},
    {name: 'Resort', icon: 'fort', class: 0},
    {name: 'Glamping', icon: 'tent', class: 1},
  ];

  const updateProperty = item => {
    setPropertyType({...propertyType, name: item.name, icon: item.icon, status:false});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.popupTitle}>Select Property Type</Text>
      <View style={styles.popupItemContainer}>
        {propertiesList.map((item, index) => {
          if (item.class === 0) {
            return (
              <TouchableOpacity
                onPress={() => updateProperty(item)}
                style={styles.popupItem}>
                <Icon
                  name={item.icon}
                  style={
                    propertyType.name === item.name
                      ? styles.popupItemIconActive
                      : styles.popupItemIcon
                  }
                />
                <Text
                  style={
                    propertyType.name === item.name
                      ? styles.popupItemTextActive
                      : styles.popupItemText
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }
          if (item.class === 1) {
            return (
              <TouchableOpacity
                onPress={() => updateProperty(item)}
                style={styles.popupItem}>
                <Icon2
                  name={item.icon}
                  style={
                    propertyType.name === item.name
                      ? styles.popupItemIconActive
                      : styles.popupItemIcon
                  }
                />
                <Text
                  style={
                    propertyType.name === item.name
                      ? styles.popupItemTextActive
                      : styles.popupItemText
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </View>
  );
};

export default PropertyPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: '35%',
    borderRadius: 10,
    marginTop: '20%',
    marginHorizontal: '5%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '400',
    alignSelf: 'center',
    marginTop: '3%',
    color: COLORS.black,
    margin: 0,
  },

  popupItemContainer: {
    // backgroundColor: 'grey',
    width: '80%',
    height: 'fit-content',
    marginVertical: '7%',
    marginHorizontal: '5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 20,
  },

  popupItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  popupItemIcon: {
    color: COLORS.textLightGrey,
    fontSize: 50,
  },

  popupItemText: {
    color: COLORS.textLightGrey,
    fontSize: 14,
    fontWeight: '500',
  },
  popupItemIconActive: {
    color: COLORS.mainPurple,
    fontSize: 50,
  },

  popupItemTextActive: {
    color: COLORS.mainPurple,
    fontSize: 14,
    fontWeight: '500',
  },
});

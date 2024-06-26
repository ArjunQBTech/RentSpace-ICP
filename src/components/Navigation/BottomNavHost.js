import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, SIZES} from '../../constants/themes';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavHost = ({navigation, showDrawer, setShowDrawer}) => {
  return (
    <View style={styles.viewNav}>
      <TouchableOpacity
        style={styles.iconNav}
        onPress={() => navigation.navigate('hostHome')}>
        <Icon
          name="shield-checkmark-outline"
          size={26}
          color={COLORS.mainPurple}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconNav}>
        <Icon
          name="calendar-clear-outline"
          size={26}
          color={COLORS.mainPurple}
          onPress={() => navigation.navigate('hotelAvailable')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconNav}>
        <Icon2
          name="home-city-outline"
          size={26}
          color={COLORS.mainPurple}
          onPress={() => navigation.navigate('hostListing')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconNav}>
        <Icon
          name="chatbubble-ellipses-outline"
          size={26}
          color={COLORS.mainPurple}
          onPress={() => setShowDrawer(!showDrawer)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconNav}
        onPress={() => navigation.navigate('hostMenu')}>
        <Icon name="list" size={26} color={COLORS.mainPurple} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavHost;

const styles = StyleSheet.create({
  viewNav: {
    backgroundColor: COLORS.white,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 20,
    flexDirection: 'row',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 15,
    shadowColor: COLORS.black,
    shadowOffset: {width: -2, height: 4},
    shadowRadius: 3,
  },
  iconNav: {
    display: 'inline',
    width: 25,
    height: 25,
  },
});

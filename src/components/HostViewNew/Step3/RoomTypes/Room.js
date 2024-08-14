import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import BottomBtn from '../../Reusables/BottomBtn';
import {COLORS} from '../../../../constants/themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoomDetails from './RoomDetails';

import {useDispatch, useSelector} from 'react-redux';
import {setListing} from '../../../../redux/NewListing/actions'; 
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';

const Room = ({setHostModal, pos}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {listing} = useSelector(state => state.listingReducer);
  const dispatch = useDispatch();

  const [rooms, setRooms] = useState([]);

  const deleteRoom = index => {
    let tempRooms = [...rooms];
    tempRooms.splice(index, 1);
    setRooms(tempRooms);
  };

  // useEffect(() => {
  //   console.log('Rooms ===>>>', rooms);
  // }, [rooms]);

  const goNext = () => {
    if (rooms.length === 0) {
      Dialog.show({
        type:ALERT_TYPE.WARNING,
        title:'Warning',
        textBody:'Please create a room to proceed',
        button:'OK',
      })
      return false;
    } else {
      dispatch(setListing({...listing, rooms: rooms}));
      return true;
    }
  };

  return (
    <>
      <View style={styles.view}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Rooms</Text>
        </View>

        <Text style={{color: COLORS.textLightGrey}}>
          Create a new room to get a Room Card
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.createBtn}>+ Create New Room</Text>
        </TouchableOpacity>

        {rooms.length > 0 ? (
          <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            {rooms.map((room, index) => {
              return (
                <View style={styles.roomCard}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.roomTypeTxt}>{room.roomName}</Text>
                    {/* <TouchableOpacity onPress={() => {}}>
                      <Icon name="pencil" size={20} color={COLORS.black} />
                    </TouchableOpacity> */}
                  </View>
                  <Image
                    source={{uri: room.photos[0]}}
                    style={styles.roomImg}
                  />
                  <View style={styles.lowerInfos}>
                    <Text style={styles.lowerInfoTitle}>Total Rooms</Text>
                    <Text style={styles.lowerInfoVal}>{room.totalRooms}</Text>
                  </View>
                  <View style={styles.lowerInfos}>
                    <Text style={styles.lowerInfoTitle}>Max Occupancy</Text>
                    <Text style={styles.lowerInfoVal}>{room.maxOccupancy}</Text>
                  </View>
                  <View style={styles.lowerInfos}>
                    <Text style={styles.lowerInfoTitle}>Price</Text>
                    <Text style={styles.price}>€{room.roomPrice}/Night</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteRoom()}>
                    <Text style={styles.deleteBtn}>Delete Room</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <Text
            style={{
              color: COLORS.textLightGrey,
              textAlign: 'center',
              marginTop: 20,
            }}>
            No Rooms Created Yet
          </Text>
        )}
      </View>

      <BottomBtn
        setHostModal={setHostModal}
        pos={pos}
        step={1}
        nextFunc={() => goNext()}
      />

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide">
        <RoomDetails
          rooms={rooms}
          setRooms={setRooms}
          closeModal={setModalVisible}
        />
      </Modal>
    </>
  );
};

export default Room;

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 25,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.newBG,
  },
  header: {
    width: '100%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  createBtn: {
    backgroundColor: COLORS.black,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    padding: 10,
    textAlign: 'center',
    borderRadius: 10,
  },

  roomCard: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },
  roomTypeTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  roomImg: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  lowerInfos: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  lowerInfoTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: '400',
  },
  lowerInfoVal: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textLightGrey,
  },
  price: {
    fontSize: 16,
    backgroundColor: COLORS.black,
    color: COLORS.white,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  deleteBtn: {
    fontSize: 16,
    color: COLORS.white,
    backgroundColor: COLORS.black,
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: 'bold',
    borderRadius: 10,
    marginVertical: 10,
  },
});

import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SIZES} from '../../../../constants/themes';
import SaveBtn from '../../Reusables/SaveBtn';
import BottomBtn from '../../Reusables/BottomBtn';
import PhotoBtn from './PhotoBtn';
import Icon from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {setListing} from '../../../../redux/NewListing/actions';
import {launchImageLibrary} from 'react-native-image-picker';
import {setFiles} from '../../../../redux/files/actions';
import RNFS from 'react-native-fs';
import CustomPopAlert from '../../../NavScreens/CustomPopAlert';

const AddPhotos = ({setHostModal, pos}) => {
  const [showAlertPop, setShowAlertPop] = useState({
    type: '',
    title: '',
    message: '',
    color: '',
    visibility: false,
  });

  const [images, setImages] = useState('img2');
  const [hotelImgs, setHotelImgs] = useState(null);
  const {listing} = useSelector(state => state.listingReducer);
  const dispatch = useDispatch();
  const [video, setVideo] = useState(null);
  const checkEmpty = () => {
    console.log(video, hotelImgs);
    if (hotelImgs == null) {
      // Alert.alert('No image selected', 'Please add atleast one image');
      setShowAlertPop({
        type: 'default',
        title: 'No image selected',
        message: 'Please add atleast one image',
        color: COLORS.mainPurple,
        visibility: true,
      });
      console.log('no images');
      return false;
    } else if (video == null) {
      // Alert.alert('No video selected', 'Please add a Video');
      setShowAlertPop({
        type: 'default',
        title: 'No video selected',
        message: 'Please add a Video',
        color: COLORS.mainPurple,
        visibility: true,
      });
      console.log('no video');
      return false;
    } else {
      console.log(video, ...hotelImgs);
      dispatch(setFiles([video, ...hotelImgs]));
      dispatch(setListing({...listing, hotelImage: images}));
      return true;
    }
  };
  const chooseUserImg = async () => {
    const result = await launchImageLibrary(
      {selectionLimit: 5, mediaType: 'image', includeBase64: true},
      res => {
        //console.log(res)
        setHotelImgs(res.assets);
      },
    ).catch(err => {
      console.log(err);
    });
    console.log(result);
  };
  const chooseVideo = async () => {
    const result = await launchImageLibrary(
      {mediaType: 'video', videoQuality: 'medium', includeBase64: true},
      async res => {
        await RNFS.readFile(res.assets[0].uri, 'base64')
          .then(resp => {
            {
              console.log(resp);
              setVideo({...res.assets[0], base64: resp});
            }
          })
          .catch(err => {
            {
              console.log(err);
              // Alert.alert(
              //   'Unsupported format!',
              //   'The file format you are selected is not a correct video format',
              // );
              setShowAlertPop({
                type: 'default',
                title: 'Unsupported format!',
                message:
                  'The file format you are selected is not a correct video format',
                color: COLORS.mainPurple,
                visibility: true,
              });
            }
          });
      },
    ).catch(err => {
      console.log(err);
    });
    // await RNFS.readFile(result.assets,'base64').then((res)=>console.log(res)).catch((err)=>{err})
    console.log(result);
  };
  return (
    <View style={styles.view}>
      <SaveBtn setHostModal={setHostModal} />
      <Text style={styles.title}>Add some photos of your house</Text>
      <Text style={styles.text}>
        Our comprehensive verification system checks details such as name,
        address, government ID and more to confirm the identity of guests who
        book on Rentspace.
      </Text>
      <PhotoBtn
        text={'Add photos'}
        icon={<Icon name="plus" size={25} color={COLORS.black} />}
        onClick={chooseUserImg}
      />
      <PhotoBtn
        text={'Add a video'}
        icon={<Icon name="plus" size={25} color={COLORS.black} />}
        onClick={chooseVideo}
      />
      <BottomBtn
        setHostModal={setHostModal}
        pos={pos}
        step={2}
        back={2}
        nextFunc={checkEmpty}
      />
      <Modal
        transparent
        visible={showAlertPop.visibility}
        onRequestClose={() => {
          setShowAlertPop({...showAlertPop, visibility: false});
        }}>
        <CustomPopAlert
          type={showAlertPop.type}
          title={showAlertPop.title}
          message={showAlertPop.message}
          color={showAlertPop.color}
          onCloseRequest={setShowAlertPop}
        />
      </Modal>
    </View>
  );
};

export default AddPhotos;

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.mainGrey,
  },
  title: {
    width: '88%',
    color: COLORS.mainPurple,
    fontSize: SIZES.xxLarge,
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: '8%',
  },
  text: {
    fontSize: SIZES.preMedium,
    color: COLORS.black,
    width: '85%',
    marginLeft: '7.5%',
    marginBottom: 10,
    fontWeight: '300',
  },
});

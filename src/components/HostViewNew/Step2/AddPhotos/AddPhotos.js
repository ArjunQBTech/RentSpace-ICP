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
import { Dialog,ALERT_TYPE } from 'react-native-alert-notification';

const AddPhotos = ({setHostModal, pos}) => {

  const [images, setImages] = useState('img2');
  const [hotelImgs, setHotelImgs] = useState(null);
  const {listing} = useSelector(state => state.listingReducer);
  const dispatch = useDispatch();
  const [video, setVideo] = useState(null);
  const checkEmpty = () => {
    console.log(video, hotelImgs);
    if (hotelImgs == null) {
      // Alert.alert('No image selected', 'Please add atleast one image');
      Dialog.show({
        type:ALERT_TYPE.WARNING,
        title:'No image selected',
        textBody:'Please add atleast one image',
        button:'OK',
      })
      
      console.log('no images');
      return false;
    } else if (video == null) {
      // Alert.alert('No video selected', 'Please add a Video');
      Dialog.show({
        type:ALERT_TYPE.WARNING,
        title:'No video selected',
        textBody:'Please add a Video',
        button:'OK',
      })
      
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
              Dialog.show({
                type:ALERT_TYPE.WARNING,
                title:'Unsupported format',
                textBody:'The file format you are selected is not a correct video format',
                button:'OK',
              })
              
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
      {/* <SaveBtn setHostModal={setHostModal} /> */}
      <Text style={styles.title}>Add some photos of your property</Text>
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
    color: COLORS.black,
    fontSize: SIZES.xxLarge,
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: '8%',
    marginTop: 20,
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

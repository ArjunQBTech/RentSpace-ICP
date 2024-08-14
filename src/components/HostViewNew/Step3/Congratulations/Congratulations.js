import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SIZES} from '../../../../constants/themes';
import SaveBtn from '../../Reusables/SaveBtn';
import BottomBtn from '../../Reusables/BottomBtn';
import {images} from '../../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {setHotels} from '../../../../redux/hotels/actions';
import {setChatToken} from '../../../../redux/chatToken/actions';
import axios, {formToJSON} from 'axios';
import {FileSystem} from 'react-native-file-access';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {storage} from '../../../../../firebaseConfig';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';
import {nodeBackend} from '../../../../../DevelopmentConfig';

const Congratulations = ({setHostModal, pos, getHotelDetails}) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const {listing} = useSelector(state => state.listingReducer);
  console.log('Listing at congra : ', listing);
  const {actors} = useSelector(state => state.actorReducer);
  const {authData} = useSelector(state => state.authDataReducer);
  const {principle} = useSelector(state => state.principleReducer);
  const dispatch = useDispatch();
  // const baseUrl="https://rentspace.kaifoundry.com"
  // const baseUrl="http://localhost:5000"
  const baseUrl = nodeBackend;
  const {files} = useSelector(state => state.filesReducer);
  const {user} = useSelector(state => state.userReducer);
  const [imageList, setImageList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const [btnDisabled, setBtnDisabled] = useState(false);

  console.log('Principal : ', principle);

  // upload function to upload image to firebase
  async function uploadImage(uri) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, 'hotelImage/' + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        error => {
          console.log('Error => ', error);
          reject(new Error('Some error occured while trying to upload images'));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            // console.log('File available at', downloadURL);
            setImageList(list => [...list, downloadURL]);
            resolve(downloadURL);
          });
        },
      );
    });
  }

  // upload function to upload image to firebase
  async function uploadVideo(uri) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, 'hotelVideo/' + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          // setTransferred(progress.toFixed());
        },
        error => {
          console.log('Error => ', error);
          reject('Some error occured while trying to upload video');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            // console.log('File available at', downloadURL);
            setVideoList(list => [...list, downloadURL]);
            resolve(downloadURL);
          });
        },
      );
    });
  }
  const uploadAllFiles = async () => {
    try {
      console.log('Start uploading files');
      ApiHotelCreate();
    } catch (error) {
      console.log(error);
      setBtnDisabled(false);
    }
  };

  const ApiLogin = async () => {
    console.log('files', files);
    await axios
      .post(
        `${baseUrl}/api/v1/login/user`,
        {},
        {
          headers: {
            'x-private': authData.privateKey,
            'x-public': authData.publicKey,
            'x-delegation': authData.delegation,
          },
        },
      )
      .then(res => {
        console.log('hotel login api : ', res.data.userToken);
        dispatch(setChatToken(res.data.userToken));
        setToken(res.data.userToken);
      });
  };
  useEffect(() => {
    ApiLogin();
  }, []);
  // const ApiHotelFilters=async()=>{
  //   await axios.get(`${baseUrl}/api/v1/hotel/filters`).then((res)=>{
  //     console.log("hotel filters resp : ")
  //   }).catch((err)=>{console.log("hotel filters err : ",err)})
  // }

  async function ApiHotelCreate() {
    try {
      setLoading(true);

      const uploadPromises = files.map((file, index) =>
        index === 0 ? uploadVideo(file.uri) : uploadImage(file.uri),
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      const data = {
        propertyName: listing?.hotelTitle,
        propertyDescription: listing?.hotelDes,
        price: listing?.hotelPrice,
        priceCurrency: 'USDT',
        imageList: uploadedFiles.slice(1),
        videoList: [uploadedFiles[0]],
        maxOccupancy: '200',
        rooms: listing.rooms ? listing.rooms : [],
        location: listing?.hotelLocation,
        latitude: listing?.latitude,
        longitude: listing?.longitude,
        amenities: listing?.amenities,
        propertyType: listing?.propertyType,
        phantomWalletID: listing?.phantomWalletID,
        paymentMethods: listing?.paymentMethods,
        payPalId: listing?.payPalId,
        payPalSecret: listing?.payPalSecret,
      };

      console.log('Data => ', data);

      await axios
        .post(`${baseUrl}/api/v1/property/register`, data, {
          headers: {
            principal: principle,
            'x-private': authData.privateKey,
            'x-public': authData.publicKey,
            'x-delegation': authData.delegation,
            // "Content-Type":"multipart/form-data"
          },
        })
        .then(res => {
          console.log(res);
          setLoading(false);
          setHostModal(false);
          console.log('hotel creation api response videos : ', res.data);
          getHotelDetails();
        })
        .catch(err => {
          console.log('Err : ', err);
        });

      // console.log("Response : ", response);
      setBtnDisabled(false);
    } catch (error) {
      setLoading(false);
      console.log('Hotel creation API error: ', error);
      setBtnDisabled(false);

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'ERROR',
        textBody: error.message,
        button: 'OK',
      });
    }
  }

  // async function ApiHotelCreate() {
  //   setLoading(true);
  //   // await uploadVideo(files[0].uri)
  //   let uploadPromises = [uploadVideo(files[0].uri)];
  //   for (let i = 1; i < files.length; i++) {
  //     uploadPromises.push(uploadImage(files[i].uri));
  //   }
  //   Promise.all(uploadPromises)
  //     .then(async values => {
  //       // const data={
  //       //   hotelTitle:listing?.hotelTitle,
  //       //   hotelDes:listing?.hotelDes,
  //       //   hotelPrice:listing?.hotelPrice,
  //       //   // hotelLocation:listing?.hotelLocation.split('#')[2],
  //       //   hotelLocation:listing?.hotelLocation,
  //       //   // longitude:parseFloat(listing?.hotelLocation.split('#')[0]),
  //       //   // latitude:parseFloat(listing?.hotelLocation.split('#')[1]),
  //       //   latitude:listing?.latitude,
  //       //   longitude:listing?.longitude,
  //       //   amenities:listing?.amenities,
  //       //   propertyType:listing?.propertyType,
  //       //   phantomWalletID:listing?.phantomWalletID,
  //       //   paymentMethods:listing?.paymentMethods,
  //       //   vidFiles:[values[0]],
  //       //   imgFiles:values.slice(1)
  //       // }
  //       const data = {
  //         propertyName: listing?.hotelTitle,
  //         propertyDescription: listing?.hotelDes,
  //         price: listing?.hotelPrice,
  //         priceCurrency: 'USD',
  //         imageList: values.slice(1),
  //         videoList: [values[0]],
  //         maxOccupancy: '200', //update auto when rooms integrated
  //         rooms: [],
  //         location: listing?.hotelLocation,
  //         latitude: listing?.latitude,
  //         longitude: listing?.longitude,
  //         likedBy: [],
  //         amenities: listing?.amenities,
  //         propertyType: listing?.propertyType,
  //         phantomWalletID: listing?.phantomWalletID,
  //         paymentMethods: listing?.paymentMethods,
  //       };

  //       console.log('Hotel Data : ', data);

  //       const formData = new FormData();
  //       // Object.entries(data).forEach(([key, value]) => {
  //       //   formData.append(key, value);
  //       // });
  //       for (const [key, value] of Object.entries(data)) {
  //         formData.append(key, value);
  //       }

  //       let newFiles=[]
  //       await FileSystem.readFile(files[0].uri,'base64').then((res)=>{
  //         console.log(res)
  //         files.map((file,index)=>{
  //             newFiles.push({...file,fileIndex:`file${index}`})
  //             formData.append(`file${index}`,file)
  //         })
  //       })

  //       formData.append("files",JSON.stringify(newFiles))
  //       console.log("form",formData)
  //       await axios.post(`${baseUrl}/api/v1/hotel/register`,formData,{
  //         headers:{
  //           "x-private":authData.privateKey,
  //           "x-public":authData.publicKey,
  //           "x-delegation":authData.delegation,
  //           "Content-Type":"multipart/form-data"
  //         }
  //       }).then(async(res)=>{
  //         setLoading(false)
  //         setHostModal(false)

  //         console.log("hotel creation api response videos : ",res.data)
  //         getHotelDetails()
  //         await actors.hotelActor?.getHotelId().then(async(res)=>{
  //           console.log(res)
  //           dispatch(setHotels(res))
  //         }).catch((err)=>{
  //           console.log(err)
  //         })

  //       }).catch((err)=>{
  //         setLoading(false)
  //         console.log("hotel creation api err : ",err)
  //         // alert(err)
  //         Dialog.show({
  //           type:ALERT_TYPE.DANGER,
  //           title:'ERROR',
  //           textBody:err,
  //           button:'OK',
  //         })
  //         // setHostModal(false)
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
  const testLocalHotelCreation = async () => {
    console.log(listing, actors?.hotelActor.createHotel);
    await actors.hotelActor
      ?.createHotel({
        hotelTitle: listing?.hotelTitle,
        hotelDes: listing?.hotelDes,
        hotelPrice: listing?.hotelPrice,
        hotelLocation: listing?.hotelLocation.split('#')[2],
        createdAt: 'to be set',
        hotelImage: 'img',
      })
      .then(res => {
        console.log(res);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={styles.view}>
      <View style={styles.imgCont}>
        <Image source={images.congrats} style={styles.img} />
      </View>

      <Text style={styles.title}>Congratulations, {user?.firstName}</Text>
      <Text style={styles.text}>
        From one Host to another - welcome aboard. Thank you for sharing your
        home and helping to create incredible experiences for our guests.
      </Text>
      <Text style={styles.subtitle}>Thank You...</Text>
      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (!btnDisabled) {
              setBtnDisabled(true);
              uploadAllFiles();
            }
          }}>
          <Text style={styles.btnText}>Let’s get started</Text>
        </TouchableOpacity>
      </View>
      <ActivityIndicator size={40} animating={loading} style={styles.loader} />
    </View>
  );
};

export default Congratulations;

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
    width: '85%',
    color: COLORS.black,
    fontSize: SIZES.xxLarge,
    fontWeight: '500',
    marginBottom: 20,
    marginLeft: '7.5%',
  },
  text: {
    fontSize: SIZES.preMedium,
    color: COLORS.black,
    width: '85%',
    marginBottom: 15,
    marginLeft: '7.5%',
    opacity: 0.7,
  },
  subtitle: {
    fontSize: SIZES.xLarge,
    color: COLORS.black,
    fontWeight: '600',
    marginLeft: '7.5%',
  },
  imgCont:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:15,
    width:'100%',
  },
  img: {
    marginTop: 60,
    marginBottom: 25,
    marginLeft: '7.5%',
  },
  btnView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 15,
    width: '100%',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
  },
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 15,
    backgroundColor: COLORS.black,
    borderRadius: 10,
  },
  btnText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  loader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
});
